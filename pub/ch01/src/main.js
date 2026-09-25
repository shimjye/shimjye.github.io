// 입력과 화면의 기준. 보상·성장 판정은 game.js, 저장 검증은 save.js에 둔다.
import { World, PLACES, GEAR, CARDS, GOALS, stats, cost, nextObjective, makeWordCard, cardFor, WORD_CARD_LIMIT } from './game.js';
import { SaveStore } from './save.js';
import { ActiveClock } from './clock.js';
import { cardArtUrl } from './card-art.js';
const $ = id => document.getElementById(id);
// localStorage 접근 자체가 거부되는 환경에서도 저장 실패 UI를 표시한다.
const storage = { getItem: key => window.localStorage.getItem(key), setItem: (key, value) => window.localStorage.setItem(key, value), removeItem: key => window.localStorage.removeItem(key) };
const saves = new SaveStore(storage);
let world = new World(saves.load()), panel = '', scene, lastRevision = -1, lastMode = '', toastUntil = 0, lastSavedRevision = saves.last ? 0 : -1, firstCardPrompt = false, autoIncome = 0, autoIncomeUntil = 0;
const clock = new ActiveClock(performance.now());
clock.setActive(!document.hidden, performance.now());
let lastSave = performance.now(), lastUi = 0, movePointer = null;
const log = [];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let panelOpener = null, lastPanelHTML = '', wordDraft = '', wordPreview = null, wordError = '', mapFocus = 0;
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const wordEffect = card => `${{ weapon: '피해 +25%', armor: '받는 피해 −20%', collector: '수집 반경 +16' }[card.gear]}${card.kind === 'rare' ? ` · ${PLACES[card.place].name}에서만 적용` : ' · 모든 장소'}`;
const cardImage = (id, gear) => `<img class="card-art" src="${cardArtUrl(id, gear)}" alt="">`;
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches && scene) {
    scene.tweens.killAll(); scene.effects.clear(true, true); scene.cameras.main.resetFX();
  }
});
function notice(text, duration = 5000) { $('toast').textContent = text; $('toast').classList.add('visible'); toastUntil = performance.now() + duration; }
function saveNow() { const ok = saves.save(world.p); if (ok) lastSavedRevision = world.revision; render(true); return ok; }
function closePanel() {
  firstCardPrompt = false; panel = ''; $('panel').hidden = true; render(true);
  if (panelOpener?.isConnected) panelOpener.focus({ preventScroll: true });
}
function showPanel(name, opener) {
  if (name === 'map' && world.mode === 'combat') { notice('전투 중에는 지도를 열 수 없습니다. 승리하거나 도망친 뒤 이동하세요.'); return; }
  if (panel === name) { closePanel(); return; }
  if (name === 'map') mapFocus = world.p.place;
  panelOpener = opener; panel = name; $('panel').hidden = false; render(true);
  $('panel').scrollTop = 0; $('panel-title').focus({ preventScroll: true });
}
function nextGoal() { return nextObjective(world).text; }
function compare(key, p = world.p) {
  const current = stats(p), next = structuredClone(p); next.levels[key]++;
  const s = stats(next);
  return key === 'weapon' ? `피해 ${current.damage} → ${s.damage} · 주기 0.8초` : key === 'armor' ? `최대 체력 ${current.maxHp} → ${s.maxHp}` : `수집 반경 ${current.radius} → ${s.radius}`;
}
function renderPanel() {
  if (!panel) return;
  const p = world.p;
  $('panel-title').textContent = { equipment: '장비 카드', cards: '인챈트 카드와 특수 공격', goals: '도시의 기록', map: '도시 지도', settings: '설정' }[panel];
  let html = '';
  if (world.mode === 'combat' && panel !== 'map') html += '<p class="notice">전투 진행 중 · 메뉴를 닫으면 화면 드래그와 특수 공격을 사용할 수 있습니다.</p>';
  if (panel === 'equipment') {
    html += '<p class="small-note">장비 카드는 구매·강화할 수 있습니다. 각 장비에 인챈트 카드 1장.</p>';
    Object.entries(GEAR).forEach(([key, name], i) => {
      const level = p.levels[key], price = cost(p, key), missing = Math.max(0, price - p.coins);
      html += `<article class="entry gear-card"><span class="tag">장비 카드 · ${level ? `Lv.${level}` : '미구매'}</span><div class="art art-${i}"></div><h3>${name}</h3><small>${['공격 피해', '생존력', '보상 수집'][i]}</small><div class="clear"></div><p class="compare">${compare(key)}</p><p>인챈트 슬롯 · ${escapeHtml(cardFor(p, p.slots[key])?.name || cardFor(p, p.slots[key])?.word || '비어 있음')}</p><small>${key === 'armor' ? '최대 체력 증가분만큼 현재 체력도 증가' : key === 'collector' ? '기본 수집 가능 · 최대 반경 80' : '전장에 등장한 가장 가까운 적 자동 조준'}</small><button data-upgrade="${key}" ${missing || level >= 30 ? 'disabled' : ''}>${level >= 30 ? '최대 레벨' : `${level ? '강화' : '구매'} · ${price} 코인${missing ? ` (${missing} 부족)` : ''}`}</button><button data-open-enchants="${key}" ${level ? '' : 'disabled'}>인챈트 카드 선택</button></article>`;
    });
  }
  if (panel === 'cards') {
    if (firstCardPrompt) html += `<article class="entry completed">${cardImage('focus', 'weapon')}<h3>첫 인챈트 카드 · 집중 타격</h3><p>공명기에 인챈트하면 피해가 25% 증가합니다.</p><div class="clear"></div><button data-equip="focus">지금 인챈트</button><button data-later>나중에</button></article>`;
    html += '<p class="small-note">목표에서 인챈트 카드 획득 · 장비 카드에 무료 적용·해제</p>';
    Object.entries(CARDS).forEach(([id, card]) => {
      const owned = p.cards.includes(id), equipped = p.slots[card.gear] === id, available = !!p.levels[card.gear];
      const copy = structuredClone(p); copy.slots[card.gear] = equipped ? null : id;
      const before = stats(p), after = stats(copy);
      const comparison = card.gear === 'weapon' ? `피해 ${before.damage} → ${after.damage}` : card.gear === 'armor' ? `피해 감소 ${Math.round(before.reduction * 100)}% → ${Math.round(after.reduction * 100)}%` : `수집 반경 ${before.radius} → ${after.radius}`;
      html += `<article class="entry enchant-card ${equipped ? 'current' : ''}"><span class="tag">${equipped ? '인챈트 중' : owned ? '보유' : '미획득'}</span>${cardImage(id, card.gear)}<h3>${card.name}</h3><small>대상 · ${GEAR[card.gear]}</small><div class="clear"></div><p>${card.effect} · ${equipped ? GEAR[card.gear] + ' 카드에 적용 중' : '해당 장비에 인챈트 시 적용'}</p><p class="compare">${comparison}</p><button data-equip="${id}" ${!owned || !available ? 'disabled' : ''}>${!owned ? `${GOALS.find(g => g.id === card.goal).name} 보상 필요` : !available ? `${GEAR[card.gear]} 구매 필요` : equipped ? '인챈트 해제' : '인챈트 적용'}</button></article>`;
    });
    html += `<article class="entry"><h3>단어 인챈트 카드 생성</h3><p>공백 없는 단어를 입력해 결과를 확인하고 획득하세요. 첫 무기 카드 수령 후 무료 · 최대 ${WORD_CARD_LIMIT}장 · 같은 단어는 한 번만 획득할 수 있습니다.</p><form id="word-card-form"><label for="word-input">카드 단어</label><input id="word-input" name="word" value="${escapeHtml(wordDraft)}" maxlength="24" autocomplete="off" placeholder="예: 빛, 은하고래" required><button type="submit">결과 확인</button></form>${wordError ? `<p role="alert">${wordError}</p>` : ''}${wordPreview ? `<div class="word-preview">${cardImage(wordPreview.id, wordPreview.gear)}<h3>${escapeHtml(wordPreview.word)}</h3><small>${wordPreview.kind === 'common' ? '흔한 단어 · 범용 효과' : '드문 단어 · 장소 조건'} · ${GEAR[wordPreview.gear]}</small><div class="clear"></div><p>${wordEffect(wordPreview)}</p><button data-claim-word ${!p.claimed.includes('upgrade') || p.wordCards.some(card => card.id === wordPreview.id) || p.wordCards.length >= WORD_CARD_LIMIT ? 'disabled' : ''}>${!p.claimed.includes('upgrade') ? '첫 무기 카드 보상 필요' : p.wordCards.some(card => card.id === wordPreview.id) ? '이미 획득한 카드' : p.wordCards.length >= WORD_CARD_LIMIT ? '생성 한도 도달' : '무료 획득'}</button></div>` : ''}</article>`;
    for (const card of p.wordCards) {
      const equipped = p.slots[card.gear] === card.id, available = !!p.levels[card.gear];
      html += `<article class="entry enchant-card ${equipped ? 'current' : ''}"><span class="tag">${equipped ? '인챈트 중' : '보유'}</span>${cardImage(card.id, card.gear)}<h3>${escapeHtml(card.word)}</h3><small>${GEAR[card.gear]} · ${card.kind === 'common' ? '범용' : '조건부'}</small><div class="clear"></div><p>${wordEffect(card)}</p><button data-equip-word="${p.wordCards.indexOf(card)}" ${available ? '' : 'disabled'}>${!available ? `${GEAR[card.gear]} 구매 필요` : equipped ? '인챈트 해제' : '인챈트 적용'}</button></article>`;
    }
    html += `<article class="entry"><h3>특수 공격 · 장비 카드와 별도</h3><p>왼쪽: 집중 파동 · 가장 가까운 적 1기<br>무기 피해 ×3 · 쿨다운 5초</p><p>오른쪽: 충격파 · 전장 전체 살아 있는 적<br>무기 피해 ×2 · 쿨다운 9초</p><button data-wave ${p.specials.includes('wave') ? '' : 'disabled'}>${!p.specials.includes('wave') ? '골목 첫 승리 목표 보상 필요' : p.specialSlots[1] ? '충격파 해제' : '오른쪽에 충격파 장착'}</button></article>`;
    const automationUnlocked = p.claimed.includes('collect');
    html += `<article class="entry ${p.automation.specials ? 'current' : ''}"><h3>특수 기술 자동 사용</h3><p>전투 중 장착한 특수 공격을 사용할 수 있을 때 자동으로 발동합니다. 수동 공격과 같은 대상·쿨다운을 적용합니다.</p><small>${automationUnlocked ? '첫 수집 목표 보상으로 해금됨 · 수동 사용도 가능' : '첫 수집 목표 보상 수령 후 해금'}</small><button data-automation="specials" aria-pressed="${p.automation.specials}" ${automationUnlocked ? '' : 'disabled'}>${!automationUnlocked ? '첫 수집 목표 보상 필요' : p.automation.specials ? '자동 사용 끄기' : '자동 사용 켜기'}</button></article>`;
  }
  if (panel === 'goals') {
    html += '<p class="small-note">장소는 승리 즉시 개방됩니다. 카드·특수 공격·코인 보상은 직접 받으세요.</p>';
    for (const g of GOALS) {
      const claimed = p.claimed.includes(g.id), done = p.goals[g.id] > 0, gated = ['dodge', 'collect'].includes(g.id) && !p.claimed.includes('upgrade');
      html += `<article class="entry ${done && !claimed ? 'completed' : ''}"><span class="tag">${claimed ? '수령 완료' : done ? '완료 · 미수령' : '진행 중'}</span><h3>${g.name}</h3><p>${g.condition}</p><small>진행 ${Math.min(1, p.goals[g.id])} / 1 · ${g.reward}</small><button data-claim="${g.id}" ${world.canClaim(g.id) ? '' : 'disabled'}>${claimed ? '수령 완료' : gated ? '집중 타격 카드를 먼저 받으세요' : done ? '보상 받기' : '목표 진행 중'}</button></article>`;
    }
  }
  if (panel === 'map') {
    const a = PLACES[mapFocus], open = p.unlocked.includes(mapFocus);
    html += '<p class="small-note">지도에서 장소를 선택하세요. 열린 장소는 비전투 중 무료로 이동합니다.</p>';
    html += `<div class="city-map" role="group" aria-label="도시 지도">${PLACES.map((place, i) => `<button class="map-point point-${i} ${p.place === i ? 'here' : ''} ${p.unlocked.includes(i) ? '' : 'locked'} ${mapFocus === i ? 'selected' : ''}" data-map-point="${i}" aria-pressed="${mapFocus === i}"><span>0${i + 1} · ${place.name}</span><small>${p.place === i ? '현재 장소' : p.unlocked.includes(i) ? '개방' : '잠김'}</small></button>`).join('')}</div>`;
    html += `<article class="entry map-detail ${p.place === mapFocus ? 'current' : ''}"><span class="tag">${open ? '개방' : '잠김'}</span><h3>${a.name}</h3><p>${a.description}</p><small>적 ${a.count}기 · 드롭 ${a.reward} 코인/기<br>조우 ${a.chance * 100}% · 도망 ${Math.round(a.escape * 100)}%<br>개방 조건 · ${a.condition}<br>${a.goal}<br>첫 승리 ${mapFocus < 2 ? p.goals[`win${mapFocus}`] ? '완료' : '미완료' : '자유 탐색'}</small><button data-travel="${mapFocus}" ${world.mode === 'combat' || !open || p.place === mapFocus ? 'disabled' : ''}>${world.mode === 'combat' ? '전투 중 이동 불가' : p.place === mapFocus ? '현재 장소' : open ? '이곳으로 이동' : '잠긴 장소'}</button></article>`;
  }
  if (panel === 'settings') {
    html += `<article class="entry"><h3>로컬 진행</h3><p>${saves.message}</p><small>마지막 성공: ${saves.last ? new Date(saves.last).toLocaleString('ko-KR') : '없음'}<br>현재 ${p.coins} 코인 · ${PLACES[p.place].name}<br>${world.revision !== lastSavedRevision ? '마지막 저장 이후 변경 있음' : '현재 진행 저장됨'}</small><button data-save>지금 저장 / 다시 시도</button></article><p class="notice">15초마다 자동 저장합니다. 재접속하면 저장한 성장으로 비전투 화면에서 시작합니다. 적과 미수집 드롭은 복원하지 않으며 부재 시간 보상은 없습니다.</p><p class="small-note">직전 정상 저장본은 백업으로 보존됩니다. 저장 실패 후 종료하면 미저장 진행이 사라질 수 있습니다.</p><article class="entry"><h3>최근 기록</h3>${log.slice(-8).reverse().map(text => `<p>${escapeHtml(text)}</p>`).join('') || '<p>탐색을 시작해 보세요.</p>'}</article><article class="entry"><h3>게임 완전 초기화</h3><p>현재 진행과 로컬 저장 기록을 모두 삭제합니다.</p><button data-reset>완전 초기화</button></article>`;
  }
  // A combat reward can repaint this menu while a keyboard user is choosing.
  // Keep the action and scroll position, not a now-detached DOM element.
  if (html !== lastPanelHTML) {
    const body = $('panel-body'), active = document.activeElement;
    const action = body.contains(active) && active.matches('button') ? Object.entries(active.dataset) : null;
    const inputActive = body.contains(active) && active.id === 'word-input';
    const selection = inputActive ? [active.selectionStart, active.selectionEnd] : null;
    const scrollTop = $('panel').scrollTop;
    body.innerHTML = html; lastPanelHTML = html;
    if (action) {
      const replacement = [...body.querySelectorAll('button')].find(button => !button.disabled && action.every(([key, value]) => button.dataset[key] === value));
      (replacement || $('panel-title')).focus({ preventScroll: true });
    }
    if (selection) { const input = $('word-input'); input.focus({ preventScroll: true }); input.setSelectionRange(...selection); }
    $('panel').scrollTop = scrollTop;
  }
}
function render(force = false) {
  const p = world.p, s = stats(p), place = PLACES[p.place], battle = world.mode === 'combat';
  $('coins').textContent = p.coins.toLocaleString('ko-KR'); $('hp').textContent = `${Math.ceil(world.hp)} / ${s.maxHp}`;
  $('health-fill').style.width = `${Math.max(0, world.hp / s.maxHp * 100)}%`; $('phase').textContent = battle ? '자동 공격 중' : '탐색 대기';
  $('place').textContent = place.name; $('area-label').textContent = `0${p.place + 1} / ${place.role}`;
  const objective = nextObjective(world), guide = $('next-goal');
  guide.innerHTML = `다음 목표 · ${objective.text} <span aria-hidden="true">›</span>`;
  const guidePanel = !['explore', 'field'].includes(objective.target);
  guide.setAttribute('aria-controls', guidePanel ? 'panel' : 'field');
  if (guidePanel) guide.setAttribute('aria-expanded', String(panel === objective.target));
  else guide.removeAttribute('aria-expanded');
  $('idle').hidden = battle; $('escape').hidden = !battle;
  const nextBattle = !battle && world.nextBattleAt !== null ? Math.max(0, world.nextBattleAt - world.time) : null;
  guide.hidden = nextBattle === null;
  const escapeRemaining = Math.max(0, world.escapeAt - world.time);
  $('escape').textContent = escapeRemaining ? `도망 ${escapeRemaining.toFixed(1)}초` : `도망 ${Math.round(world.escapeChance() * 100)}%`;
  $('escape').disabled = escapeRemaining > 0;
  $('battle-status').textContent = battle ? `남은 적 ${world.enemies.filter(e => e.hp > 0).length}/${world.enemies.length}\n자동 피해 ${s.damage} / 0.8초${performance.now() < autoIncomeUntil ? ` · +${autoIncome} 코인` : ''}` : '현실과 상상의 경계';
  $('chance').textContent = nextBattle !== null ? `${nextBattle.toFixed(1)}초 후 현재 장소에서 자동 전투 · 바로 탐색 가능` : !p.explored ? '첫 탐색은 반드시 조우합니다' : `탐색 무료 · 조우 확률 ${place.chance * 100}%`;
  $('goal-dot').style.display = GOALS.some(g => world.canClaim(g.id)) ? 'block' : 'none';
  if (force || lastRevision !== world.revision) {
    $('gear-weapon').textContent = `Lv.${p.levels.weapon} · 피해 ${s.damage}`;
    $('gear-armor').textContent = `${p.levels.armor ? `Lv.${p.levels.armor} · 생명 ${s.maxHp}${s.reduction ? ` · 감소 ${Math.round(s.reduction * 100)}%` : ''}` : '미구매'}`;
    $('gear-collector').textContent = `${p.levels.collector ? `Lv.${p.levels.collector} · 반경 ${s.radius}` : '미구매'}`;
    $('card-armor').classList.toggle('unowned', !p.levels.armor);
    $('card-collector').classList.toggle('unowned', !p.levels.collector);
    for (const key of Object.keys(GEAR)) {
      const slot = $('card-' + key), id = p.slots[key];
      if (slot.dataset.cardId !== (id || '')) {
        slot.classList.toggle('enchanted', !!id);
        slot.style.setProperty('--enchant-art', id ? `url("${cardArtUrl(id, key)}")` : 'none');
        slot.dataset.cardId = id || '';
        slot.title = id ? `${GEAR[key]} · ${cardFor(p, id)?.name || cardFor(p, id)?.word} 인챈트` : GEAR[key];
        slot.setAttribute('role', 'group'); slot.setAttribute('aria-label', slot.title);
      }
    }
  }
  for (const [i, id] of ['special-left', 'special-right'].entries()) {
    const ability = p.specialSlots[i], remaining = ability ? Math.max(0, world.cooldowns[ability] - world.time) : 0;
    $(id).disabled = !battle || !ability || remaining > 0;
    $(id).querySelector('small').textContent = !ability ? '획득·장착 필요' : remaining > 0 ? `${remaining.toFixed(1)}초` : battle ? '사용 가능' : '전투 중 사용';
  }
  $('field').dataset.playerX = String(Math.round(world.x));
  if (force || lastRevision !== world.revision || lastMode !== world.mode) {
    renderPanel(); $('desktop-summary').innerHTML = `<div class="summary-box"><small>다음 기록</small><p>${nextGoal()}</p><small>현재 능력</small><p>공격 ${s.damage} · 생명 ${s.maxHp} · 수집 ${s.radius}</p></div><div class="summary-box"><small>도시 지도</small>${PLACES.map((a, i) => `<p>${p.place === i ? '●' : p.unlocked.includes(i) ? '◇' : '·'} ${a.name} ${p.unlocked.includes(i) ? '' : '잠김'}</p>`).join('')}</div>`;
    document.querySelectorAll('[data-panel]').forEach(b => {
      const open = b.dataset.panel === panel;
      // 장소 변경이 불가능한 전투에서는 지도 진입 자체를 비활성화한다.
      if (b.dataset.panel === 'map') { b.disabled = battle; b.title = battle ? '전투 중에는 지도를 사용할 수 없습니다.' : ''; }
      b.classList.toggle('active', open); b.setAttribute('aria-expanded', String(open)); b.setAttribute('aria-controls', 'panel');
    });
    lastRevision = world.revision; lastMode = world.mode;
  }
}

class CityScene extends Phaser.Scene {
  constructor() { super('city'); }
  preload() { this.load.image('sprites', './public/assets/sprites.png'); }
  create() {
    scene = this;
    const texture = this.textures.get('sprites'), source = texture.getSourceImage(), w = source.width, h = source.height;
    // 생성 아틀라스의 실제 실루엣에 맞춘 비파괴 프레임. 캐릭터와 아이콘은 원본 PNG를 공유한다.
    texture.add('hero', 0, 0, 0, Math.floor(w / 3), Math.floor(h * .54));
    texture.add('enemy', 0, Math.floor(w / 3), 0, Math.floor(w / 3), Math.floor(h * .54));
    texture.add('cube', 0, Math.floor(w * 2 / 3), 0, Math.floor(w / 3), Math.floor(h * .54));
    this.add.rectangle(200, 463, 400, 94, 0x101b2a, .24);
    this.graphics = this.add.graphics(); this.enemiesView = new Map(); this.effects = this.add.group();
    this.hero = this.add.image(200, 435, 'sprites', 'hero').setDisplaySize(55, 89).setDepth(4);
    this.add.text(200, 495, '← 회피 · 수집 →', { fontFamily: 'sans-serif', fontSize: '10px', color: '#bed6de' }).setOrigin(.5).setAlpha(.65);
    this.labels = new Map(); this.lastPlace = -1;
  }
  flash(text, x, y, color = '#f8d297') {
    const label = this.add.text(x, y, text, { fontFamily: 'sans-serif', fontSize: '15px', fontStyle: 'bold', color, stroke: '#152333', strokeThickness: 4 }).setOrigin(.5).setDepth(10);
    this.effects.add(label);
    if (reducedMotion.matches) this.time.delayedCall(800, () => label.destroy());
    else this.tweens.add({ targets: label, y: y - 30, alpha: 0, duration: 800, onComplete: () => label.destroy() });
  }
  effect(event) {
    if (event.type === 'hit') {
      this.flash(event.text, event.x, event.y - 40, event.automatic ? '#f8d297' : '#9effed');
      const beam = this.add.line(0, 0, event.fromX, 424, event.x, event.y, event.automatic ? 0xffd08b : 0x84f7ec).setOrigin(0).setLineWidth(event.automatic ? 1 : 3).setDepth(3);
      this.effects.add(beam);
      if (reducedMotion.matches) this.time.delayedCall(170, () => beam.destroy());
      else this.tweens.add({ targets: beam, alpha: 0, duration: 170, onComplete: () => beam.destroy() });
    }
    if (event.type === 'hurt') { if (!reducedMotion.matches) this.cameras.main.shake(100, .006); this.flash(event.text, world.x, 405, '#ffadb1'); }
    if (event.type === 'collect') this.flash('+' + event.text.match(/\d+/)?.[0], event.x, 435);
    if (event.type === 'dodge') this.flash('회피', world.x, 404, '#98f2dc');
    if (event.type === 'kill' && !reducedMotion.matches) { const ring = this.add.circle(event.x, event.y, 15, 0xc4a4ed, .7); this.effects.add(ring); this.tweens.add({ targets: ring, scale: 3, alpha: 0, duration: 300, onComplete: () => ring.destroy() }); }
    if (event.type === 'strike') {
      const strike = this.add.rectangle(event.x, 439, event.width, 70, 0xff777b, .55).setDepth(2); this.effects.add(strike);
      if (reducedMotion.matches) this.time.delayedCall(250, () => strike.destroy());
      else this.tweens.add({ targets: strike, alpha: 0, duration: 250, onComplete: () => strike.destroy() });
    }
    if (event.type === 'upgrade' && !reducedMotion.matches) this.cameras.main.flash(200, 100, 170, 170, false);
  }
  update() {
    const g = this.graphics; if (!g) return; g.clear();
    if (this.lastPlace !== world.p.place) { $('game-shell').dataset.place = String(world.p.place); this.lastPlace = world.p.place; }
    $('game-shell').style.setProperty('--scene-pan', `${world.mode === 'combat' && !reducedMotion.matches ? (200 - world.x) * .18 : 0}px`);
    this.hero.x = world.x; this.hero.alpha = world.mode === 'combat' && world.time < world.invincibleUntil ? .45 : 1;
    g.lineStyle(1, 0x8ecdc5, .3); g.strokeEllipse(world.x, 474, stats(world.p).radius * 2, 12);
    for (const h of world.hazards) {
      const progress = (world.time - h.start) / (h.at - h.start);
      g.fillStyle(0xe75d72, .13 + progress * .18); g.fillRect(h.x - h.width / 2, 411, h.width, 67);
      g.lineStyle(2, 0xffa29d, .8); g.strokeRect(h.x - h.width / 2, 411, h.width, 67);
      for (let x = h.x - h.width / 2 + 8; x < h.x + h.width / 2; x += 14) { g.lineBetween(x, 478, Math.min(x + 10, h.x + h.width / 2), 465); }
      g.fillStyle(0xffbdb1, .95); g.fillRect(h.x - h.width / 2, 480, h.width * progress, 3);
      g.fillTriangle(h.x, 416, h.x - 7, 429, h.x + 7, 429); g.fillStyle(0x431e34); g.fillRect(h.x - 1, 420, 2, 4);
    }
    for (const shot of world.projectiles) {
      const progress = Math.min(1, (world.time - shot.start) / (shot.at - shot.start));
      const x = shot.fromX + (shot.x - shot.fromX) * progress, y = shot.fromY + (455 - shot.fromY) * progress;
      g.lineStyle(4, 0xffb49d, .8); g.lineBetween(shot.fromX, shot.fromY, x, y);
      g.fillStyle(0xffe4b1); g.fillCircle(x, y, 9);
      g.lineStyle(2, 0xff777b); g.strokeCircle(x, y, 12);
    }
    const alive = new Set();
    world.activeEnemies().forEach((e, i) => {
      alive.add(e.id); let view = this.enemiesView.get(e.id);
      if (!view) { view = this.add.image(e.x, e.y, 'sprites', i % 2 ? 'cube' : 'enemy').setDisplaySize(65, 83).setDepth(2); this.enemiesView.set(e.id, view); }
      view.x = e.x;
      const preparing = world.hazards.some(h => h.sourceId === e.id);
      if (preparing) {
        const pulse = reducedMotion.matches ? 1 : .7 + Math.sin(world.time * 12) * .2;
        g.lineStyle(3, 0xffd7b8, pulse); g.strokeEllipse(e.x, e.y, 76, 96);
        view.setTint(0xffc8a6);
      } else view.clearTint();
      view.y = e.y + (reducedMotion.matches ? 0 : Math.sin(world.time * 2 + i) * 4);
      g.fillStyle(0x121d2d, .9); g.fillRoundedRect(e.x - 30, e.y - 57, 60, 5, 2);
      g.fillStyle(0xdb92ba); g.fillRect(e.x - 29, e.y - 56, 58 * e.hp / e.maxHp, 3);
    });
    for (const [id, view] of this.enemiesView) if (!alive.has(id)) { view.destroy(); this.enemiesView.delete(id); }
    for (const d of world.drops) {
      if (!reducedMotion.matches && d.expires - world.time < 2 && Math.floor(world.time * 8) % 2 === 0) continue;
      g.fillStyle(0xffc965, .18); g.fillCircle(d.x, d.y, 13); g.fillStyle(0xf6c875); g.fillRect(d.x - 4, d.y - 6, 8, 12); g.fillStyle(0xffefb6); g.fillRect(d.x - 1, d.y - 4, 2, 8);
    }
  }
}
const game = new Phaser.Game({ type: Phaser.CANVAS, parent: 'phaser', width: 400, height: 510, transparent: true, pixelArt: true, antialias: false, scene: CityScene, audio: { noAudio: true }, banner: false });

// 활성 실행 중 메뉴는 전투를 멈추지 않는다. 앱 전환·freeze 시간은 소급하지 않는다.
function advance() {
  const now = performance.now(), elapsed = clock.sample(now);
  if (!saves.blocked) world.tick(elapsed);
  for (const event of world.events.splice(0)) {
    scene?.effect(event);
    if (!['hit', 'strike', 'kill'].includes(event.type)) {
      log.push(event.text); if (log.length > 20) log.shift();
      if (event.type === 'coin') { autoIncome = Number(event.text.match(/\d+/)?.[0] || 0); autoIncomeUntil = performance.now() + 750; }
      if (event.type !== 'coin') notice(event.text, event.type === 'result' ? 9000 : 4000);
      if (event.type === 'result') { $('idle-title').textContent = event.text.startsWith('승리') ? '균열 너머, 다음 거리로' : '잠시 숨을 고르고'; $('idle-description').textContent = event.text; }
      if (event.type === 'reward' && event.card === 'focus') {
        firstCardPrompt = true; panel = 'cards'; $('panel').hidden = false; renderPanel();
        $('panel').scrollTop = 0; $('panel-title').focus({ preventScroll: true });
        notice('첫 카드 획득! 집중 타격을 장착하세요. 나중에 하려면 메뉴를 닫으세요.', 9000);
      }
    }
  }
  if (now - lastSave >= 15000) { if (!saves.blocked) saveNow(); lastSave = now; }
  if (now > toastUntil) $('toast').classList.remove('visible');
  if (now - lastUi >= 100) { render(); lastUi = now; }
}
setInterval(advance, 50);
document.querySelectorAll('[data-panel]').forEach(b => b.addEventListener('click', () => { advance(); showPanel(b.dataset.panel, b); }));
$('close-panel').onclick = closePanel;
document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel && !saves.blocked) { e.preventDefault(); closePanel(); } });
function explore() {
  advance(); if (panel) closePanel(); world.explore(); advance(); render(true);
}
$('explore').onclick = explore;
$('next-goal').onclick = () => {
  advance(); const { target } = nextObjective(world);
  if (target === 'explore') explore();
  else if (target === 'field') {
    if (panel) closePanel(); $('field').focus({ preventScroll: true });
    notice('공격은 자동입니다. 게임 화면 어디서든 누른 채 좌우로 드래그해 위험을 피하고 드롭을 모으세요.');
  } else showPanel(target, $('next-goal'));
};
$('escape').onclick = () => { advance(); world.escape(); advance(); render(true); };
['special-left', 'special-right'].forEach((id, slot) => { $(id).addEventListener('pointerdown', e => { e.preventDefault(); advance(); world.requestSpecial(slot); }); $(id).addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); world.requestSpecial(slot); } }); });
const shell = $('game-shell'), field = $('field');
function moveToPointer(e) {
  const rect = field.getBoundingClientRect();
  world.move((e.clientX - rect.left) * 400 / rect.width);
}
shell.addEventListener('pointerdown', e => {
  if (movePointer !== null || world.mode !== 'combat' || e.target.closest('button, nav, #panel') || e.button !== 0) return;
  advance(); movePointer = e.pointerId; moveToPointer(e);
  shell.setPointerCapture(e.pointerId);
});
shell.addEventListener('pointermove', e => { if (e.pointerId === movePointer) moveToPointer(e); });
function release() { movePointer = null; world.move(null); }
for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) shell.addEventListener(name, e => { if (e.pointerId === movePointer) release(); });
field.addEventListener('keydown', e => { if (e.target === field && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { e.preventDefault(); world.move(e.key === 'ArrowLeft' ? 25 : 375); } });
field.addEventListener('keyup', e => { if (e.target === field && e.key.startsWith('Arrow')) release(); }); field.addEventListener('blur', release);
function suspend() {
  release(); world.pending.clear(); clock.setActive(false, performance.now());
  if (!saves.blocked) saveNow();
}
function resume() {
  release(); world.pending.clear(); clock.setActive(!document.hidden, performance.now());
}
window.addEventListener('blur', () => { release(); world.pending.clear(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) suspend(); else resume(); });
document.addEventListener('freeze', suspend);
document.addEventListener('resume', resume);
window.addEventListener('pagehide', suspend);
window.addEventListener('pageshow', resume);
$('panel-body').addEventListener('input', e => {
  if (e.target.id === 'word-input') {
    wordDraft = e.target.value; wordPreview = null; wordError = '';
    $('panel-body').querySelector('.word-preview')?.remove();
  }
});
$('panel-body').addEventListener('submit', e => {
  if (e.target.id !== 'word-card-form') return;
  e.preventDefault(); wordDraft = e.target.elements.word.value;
  wordPreview = makeWordCard(wordDraft);
  wordError = wordPreview ? '' : '공백 없이 한글·영문·숫자로 1~24자 입력하세요.';
  render(true);
  const claim = $('panel-body').querySelector('[data-claim-word]:not(:disabled)');
  (claim || $('word-input')).focus({ preventScroll: true });
});
$('panel-body').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b || b.disabled) return; advance();
  if (b.dataset.upgrade) world.upgrade(b.dataset.upgrade);
  if (b.dataset.openEnchants) { showPanel('cards', document.querySelector('[data-panel="cards"]')); return; }
  if (b.dataset.equip) { world.enchant(b.dataset.equip); firstCardPrompt = false; }
  if (b.dataset.equipWord !== undefined) world.enchant(world.p.wordCards[Number(b.dataset.equipWord)]?.id);
  if (b.hasAttribute('data-claim-word') && wordPreview) {
    if (world.claimWordCard(wordPreview.word)) { wordDraft = ''; wordPreview = null; wordError = ''; }
  }
  if (b.hasAttribute('data-later')) closePanel();
  if (b.dataset.claim) world.claim(b.dataset.claim);
  if (b.hasAttribute('data-wave')) world.equipWave();
  if (b.dataset.automation === 'specials') world.setSpecialAutomation(!world.p.automation.specials);
  if (b.dataset.travel !== undefined) world.travel(Number(b.dataset.travel));
  if (b.dataset.mapPoint !== undefined) mapFocus = Number(b.dataset.mapPoint);
  if (b.hasAttribute('data-save')) { saveNow(); notice(saves.message); }
  if (b.hasAttribute('data-reset')) { $('reset-confirm').showModal(); $('cancel-reset').focus(); return; }
  advance(); render(true);
});
$('cancel-reset').onclick = () => $('reset-confirm').close();
$('confirm-reset').onclick = () => {
  const fresh = saves.resetAll(); $('reset-confirm').close();
  if (!fresh) { notice(saves.message); render(true); return; }
  release(); scene?.tweens.killAll(); scene?.effects.clear(true, true); scene?.cameras.main.resetFX();
  world = new World(fresh); log.length = 0; firstCardPrompt = false; wordDraft = ''; wordPreview = null; wordError = ''; autoIncome = 0; autoIncomeUntil = 0;
  lastSavedRevision = -1; lastRevision = -1; lastMode = ''; lastSave = performance.now();
  $('idle-title').textContent = '거리의 잔광을 따라서';
  $('idle-description').innerHTML = '균열 너머의 존재를 찾으세요.<br>공격은 자동으로 이어집니다.';
  closePanel(); notice(saves.message); render(true);
};
function recovery() { if (saves.blocked) { $('recovery-text').textContent = saves.message; $('recovery').showModal(); } }
$('retry-load').onclick = () => { saves.blocked = false; world = new World(saves.load()); if (!saves.blocked) { $('recovery').close(); render(true); } else $('recovery-text').textContent = saves.message; };
$('new-game').onclick = () => { world = new World(saves.startNew()); $('recovery').close(); saveNow(); notice('새 게임을 시작합니다.'); render(true); };
$('recovery').addEventListener('cancel', e => e.preventDefault());
render(true); recovery(); if (saves.last) notice(saves.message);
