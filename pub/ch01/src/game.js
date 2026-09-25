// 전투·보상·성장·지도·목표의 현재 규칙. 화면과 저장 계층은 여기서 확정한 결과를 표시·보존한다.
// 밸런스 초깃값: 0.8초당 피해 8, 실제 자동 피해 4당 코인 1, 첫 강화 12코인.
export const PLACES = [
  { name: '잔광 골목', role: '시작 구역', chance: .7, escape: .8, hp: 64, count: 2, reward: 10, width: 70, warning: 1.5, interval: 4.4, damage: 12, description: '느리고 좁은 균열 · 회피를 익히는 골목', condition: '처음부터 개방', goal: '첫 승리 → 유리 교차로 개방' },
  { name: '유리 교차로', role: '전투 구역', chance: .8, escape: .6, hp: 100, count: 3, reward: 18, width: 94, warning: 1.3, interval: 3.6, damage: 17, description: '엇갈리는 균열 · 장비 성장을 위한 코인', condition: '잔광 골목에서 승리', goal: '첫 승리 → 공중 정원 개방' },
  { name: '공중 정원', role: '탐색 구역', chance: .6, escape: .4, hp: 135, count: 3, reward: 26, width: 112, warning: 1.4, interval: 3.9, damage: 20, description: '보상 위치를 노리는 균열 · 수집 동선 판단', condition: '유리 교차로에서 승리', goal: '위험 사이에서 드롭 수집' },
];
export const GEAR = { weapon: '공명기', armor: '방호 재킷', collector: '궤도 자석' };
export const PROGRESS_VERSION = 3;
export const WORD_CARD_LIMIT = 12;
const COMMON_WORDS = new Set(['빛', '도시', '검', '방패', '자석', 'light', 'city', 'sword', 'shield', 'magnet']);
function wordCardDefinition(input, allowSpaces = false) {
  if (typeof input !== 'string') return null;
  const word = (allowSpaces ? input.normalize('NFKC').trim().replace(/ +/g, ' ') : input.normalize('NFKC')).toLowerCase();
  const pattern = allowSpaces ? /^[\p{L}\p{N}]+(?: [\p{L}\p{N}]+)*$/u : /^[\p{L}\p{N}]+$/u;
  if ([...word].length > 24 || !pattern.test(word)) return null;
  const hash = [...word].reduce((value, char) => (Math.imul(value, 31) + char.codePointAt(0)) >>> 0, 0);
  const gear = ['weapon', 'armor', 'collector'][hash % 3];
  const kind = COMMON_WORDS.has(word) ? 'common' : 'rare';
  return { id: `word:${word}`, word, gear, kind, place: kind === 'rare' ? Math.floor(hash / 3) % PLACES.length : null };
}
export function makeWordCard(input) { return wordCardDefinition(input); }
// 기존 v3 진행의 공백 포함 카드는 보존하되 신규 생성에는 허용하지 않는다.
export function validSavedWordCard(card) { return card && JSON.stringify(card) === JSON.stringify(wordCardDefinition(card.word, true)); }
export function cardFor(p, id) { return CARDS[id] || (Array.isArray(p.wordCards) ? p.wordCards.find(card => card?.id === id) : null); }
export const CARDS = {
  focus: { name: '집중 타격', gear: 'weapon', effect: '무기 피해 +25%', goal: 'upgrade', art: 0 },
  guard: { name: '견고한 방어', gear: 'armor', effect: '받는 피해 −20%', goal: 'dodge', art: 1 },
  reach: { name: '넓은 수집', gear: 'collector', effect: '수집 반경 +16', goal: 'collect', art: 2 },
};
export const GOALS = [
  { id: 'upgrade', name: '첫 무기 강화', condition: '공명기 레벨을 한 번 올리기', reward: '집중 타격 카드', card: 'focus' },
  { id: 'dodge', name: '첫 회피', condition: '예고된 위험 안에서 밖으로 이동해 회피', reward: '견고한 방어 카드', card: 'guard' },
  { id: 'collect', name: '첫 수집', condition: '드롭 접근 수집 또는 승리 정산 1회', reward: '넓은 수집 카드 · 특수 기술 자동 사용 해금', card: 'reach' },
  { id: 'win0', name: '골목의 잔광', condition: '잔광 골목에서 첫 승리', reward: '특수 공격: 충격파 · 교차로 즉시 개방' },
  { id: 'win1', name: '교차로 너머', condition: '유리 교차로에서 첫 승리', reward: '60 코인 · 공중 정원 즉시 개방' },
];
export function freshProgress() {
  return { version: PROGRESS_VERSION, coins: 0, remainder: 0, levels: { weapon: 1, armor: 0, collector: 0 }, slots: { weapon: null, armor: null, collector: null }, cards: [], wordCards: [], specials: ['pulse'], specialSlots: ['pulse', null], automation: { specials: false }, place: 0, unlocked: [0], explored: false, goals: { upgrade: 0, dodge: 0, collect: 0, win0: 0, win1: 0 }, claimed: [], savedAt: 0 };
}
export function stats(p) {
  const active = key => {
    const card = cardFor(p, p.slots[key]);
    return card && (!card.kind || card.kind === 'common' || card.place === p.place);
  };
  return { damage: Math.floor((8 + (p.levels.weapon - 1) * 3) * (active('weapon') ? 1.25 : 1)), maxHp: 100 + p.levels.armor * 20, radius: Math.min(80, 22 + p.levels.collector * 6 + (active('collector') ? 16 : 0)), reduction: active('armor') ? .2 : 0 };
}
export function cost(p, key) { return Math.floor((key === 'weapon' ? 12 : 20) * 1.55 ** (p.levels[key] - (key === 'weapon' ? 1 : 0))); }
// Guidance only selects an existing action; it never buys, claims, or travels
// on the player's behalf. Combat guidance cannot bypass the map restriction.
export function nextObjective(world) {
  const p = world.p, battle = world.mode === 'combat';
  const play = text => ({ text, target: battle ? 'field' : 'explore' });
  if (!p.goals.upgrade) {
    const price = cost(p, 'weapon');
    if (p.coins < price) return play(`${battle ? '자동 공격으로' : '탐색으로'} 코인 모으기 · 첫 강화까지 ${price - p.coins} 코인`);
    return { text: `공명기 첫 강화 · ${price} 코인`, target: 'equipment' };
  }
  if (!p.claimed.includes('upgrade')) return { text: '목표에서 집중 타격 카드 받기', target: 'goals' };
  if (!p.slots.weapon) return { text: '인챈트에서 집중 타격 적용', target: 'cards' };
  if (!p.goals.win0) return play('잔광 골목 승리 · 다음 장소 개방');
  if (!p.claimed.includes('win0')) return { text: '첫 승리 보상 · 충격파 받기', target: 'goals' };
  if (!p.specialSlots[1]) return { text: '인챈트 메뉴에서 충격파 장착', target: 'cards' };
  if (!p.goals.win1) {
    if (p.place !== 1) return battle ? play('현재 전투를 마치고 유리 교차로로 이동') : { text: '지도에서 유리 교차로 이동', target: 'map' };
    return play('유리 교차로 승리 · 공중 정원 개방');
  }
  const unclaimed = GOALS.filter(goal => !p.claimed.includes(goal.id));
  const goal = unclaimed.find(goal => p.goals[goal.id] > 0) || unclaimed[0];
  if (goal) return { text: `${goal.name} · ${goal.reward}`, target: 'goals' };
  if (p.place !== 2 && !battle) return { text: '지도에서 공중 정원 이동', target: 'map' };
  return play(`${PLACES[p.place].name} 탐색 · 자유롭게 성장하기`);
}
export class World {
  constructor(progress = freshProgress(), random = Math.random) {
    this.p = structuredClone(progress); this.random = random; this.mode = 'idle'; this.hp = stats(this.p).maxHp;
    this.x = 200; this.targetX = null; this.enemies = []; this.drops = []; this.hazards = []; this.projectiles = []; this.events = [];
    this.time = 0; this.nextBattleAt = null; this.autoAt = 0; this.invincibleUntil = 0; this.cooldowns = { pulse: 0, wave: 0 }; this.escapeAt = 0; this.pending = new Set(); this.serial = 0; this.revision = 0;
  }
  emit(type, text, data = {}) { this.events.push({ type, text, ...data }); }
  changed() { this.revision++; }
  explore() {
    if (this.mode !== 'idle') return false;
    const guaranteed = !this.p.explored && this.p.place === 0;
    this.p.explored = true; this.changed();
    if (!guaranteed && this.random() >= PLACES[this.p.place].chance) { this.emit('notice', '고요한 거리입니다. 다시 탐색해 보세요.'); return false; }
    return this.startBattle();
  }
  startBattle() {
    if (this.mode !== 'idle') return false;
    const a = PLACES[this.p.place]; this.nextBattleAt = null;
    const count = Math.min(12, a.count + Math.floor(this.p.goals.collect / 2) * 2);
    const slots = [225, 280, 335].flatMap(y => [50, 150, 250, 350].map(x => ({ x, y })));
    const first = Math.floor(this.random() * slots.length);
    const positions = [slots.splice(first, 1)[0]];
    while (positions.length < count) positions.push(slots.splice(Math.floor(this.random() * slots.length), 1)[0]);
    this.mode = 'combat'; this.hp = stats(this.p).maxHp; this.x = 200; this.targetX = null;
    this.enemies = positions.map((position, i) => {
      const baseX = position.x + Math.round((this.random() - .5) * 24);
      const baseY = Math.max(220, Math.min(340, position.y + Math.round((this.random() - .5) * 20)));
      return { id: ++this.serial, x: baseX, y: baseY, baseX, baseY, drift: i % 2 ? -1 : 1, speed: .8 + (i % 3) * .15,
        hp: a.hp, maxHp: a.hp, spawnAt: this.time + i * 2, next: this.time + i * 2 + 2, attacks: 0 };
    });
    this.drops = []; this.hazards = []; this.projectiles = []; this.autoAt = this.time + .4; this.invincibleUntil = 0;
    this.cooldowns = { pulse: 0, wave: 0 }; this.escapeAt = 0; this.pending.clear();
    this.emit('notice', '조우! 자동 공격 중 · 화면 어디서든 좌우로 드래그해 회피하세요.'); return true;
  }
  move(x) { this.targetX = x === null ? null : Math.max(25, Math.min(375, x)); }
  activeEnemies() { return this.enemies.filter(e => e.hp > 0 && this.time >= e.spawnAt); }
  requestSpecial(slot) { if (this.mode === 'combat' && this.p.specialSlots[slot]) this.pending.add(this.p.specialSlots[slot]); }
  setSpecialAutomation(enabled) {
    if (typeof enabled !== 'boolean' || !this.p.claimed.includes('collect') || this.p.automation.specials === enabled) return false;
    this.p.automation.specials = enabled; this.changed();
    this.emit('notice', `특수 기술 자동 사용 ${enabled ? '켜짐' : '꺼짐'} · 수동 조작은 계속 사용할 수 있습니다.`); return true;
  }
  nearest() {
    return this.activeEnemies().sort((a, b) => Math.hypot(a.x - this.x, a.y - 455) - Math.hypot(b.x - this.x, b.y - 455) || a.x - b.x)[0];
  }
  hit(enemy, amount, automatic) {
    if (!enemy || enemy.hp <= 0) return;
    const dealt = Math.min(enemy.hp, amount); enemy.hp -= dealt;
    this.emit('hit', `${dealt}`, { x: enemy.x, y: enemy.y, fromX: this.x, automatic });
    if (automatic) {
      const total = this.p.remainder + dealt; const coins = Math.floor(total / 4);
      this.p.remainder = total % 4; this.p.coins += coins; this.changed();
      if (coins) this.emit('coin', `자동 피해 +${coins} 코인`);
    }
    if (enemy.hp === 0) {
      // A defeated enemy cannot complete a warning or projectile already in flight.
      this.hazards = this.hazards.filter(hazard => hazard.sourceId !== enemy.id);
      this.projectiles = this.projectiles.filter(projectile => projectile.sourceId !== enemy.id);
      this.drops.push({ id: ++this.serial, x: enemy.x, y: enemy.y, born: this.time, expires: this.time + 9.2, value: PLACES[this.p.place].reward });
      this.emit('kill', '균열 소멸', { x: enemy.x, y: enemy.y });
    }
  }
  collect(drop, settlement = false) {
    // 접근 수집과 승리 정산은 같은 제거·지급 경로를 사용해 중복 보상을 막는다.
    const index = this.drops.indexOf(drop); if (index < 0) return 0;
    this.drops.splice(index, 1); this.p.coins += drop.value; this.p.goals.collect++; this.changed();
    if (!settlement) this.emit('collect', `접근 수집 +${drop.value} 코인`, { x: drop.x, y: 455 });
    return drop.value;
  }
  finish(result) {
    // 승리만 남은 드롭을 정산한다. 도망·패배는 이미 얻은 성장만 유지한다.
    if (this.mode !== 'combat') return;
    let sum = 0, count = this.drops.length;
    if (result === 'win') {
      for (const d of [...this.drops]) sum += this.collect(d, true);
      if (this.p.place < 2) {
        this.p.goals[`win${this.p.place}`] = 1;
        if (!this.p.unlocked.includes(this.p.place + 1)) this.p.unlocked.push(this.p.place + 1);
      }
    this.emit('result', `승리! 남은 드롭 ${count}개 정산 +${sum} 코인. 성장과 목표가 유지됩니다. 3초 후 다음 전투가 시작됩니다.`);
    } else this.emit('result', `${result === 'escape' ? '도망 성공' : '패배'} · 남은 드롭 ${count}개 소멸. 획득한 코인과 성장은 유지됩니다. 3초 후 다음 전투가 시작됩니다.`);
    this.mode = 'idle'; this.nextBattleAt = this.time + 3; this.enemies = []; this.hazards = []; this.projectiles = []; this.drops = []; this.pending.clear(); this.targetX = null; this.changed();
  }
  escapeChance() { return PLACES[this.p.place].escape - (this.hazards.some(h => Math.abs(this.x - h.x) <= h.width / 2) ? .2 : 0); }
  escape() {
    if (this.mode !== 'combat' || this.time < this.escapeAt) return false;
    if (this.random() < this.escapeChance()) { this.finish('escape'); return true; }
    this.escapeAt = this.time + 5; this.emit('notice', '도망 실패 · 전투 지속, 5초 후 재시도'); return false;
  }
  // 50ms 이하 간격으로 활성 시간을 진행한다. 중단 시간 제외는 호출 계층에서 처리한다.
  tick(dt) {
    if (!Number.isFinite(dt) || dt <= 0) return;
    while (dt > 1e-8) {
      if (this.mode === 'idle') {
        if (this.nextBattleAt === null) break;
        const step = Math.min(dt, this.nextBattleAt - this.time);
        this.time += step; dt -= step;
        if (this.time >= this.nextBattleAt - 1e-8) this.startBattle();
      } else { const step = Math.min(.05, dt); this.step(step); dt -= step; }
    }
  }
  step(dt) {
    this.time += dt;
    if (this.targetX !== null) this.x += Math.sign(this.targetX - this.x) * Math.min(Math.abs(this.targetX - this.x), dt * 235);
    for (const enemy of this.activeEnemies()) {
      const age = this.time - enemy.spawnAt;
      enemy.x = Math.max(25, Math.min(375, enemy.baseX + enemy.drift * 48 * Math.sin(age * enemy.speed)));
      enemy.y = Math.max(220, Math.min(345, enemy.baseY + (enemy.id % 3 ? 1 : -1) * 22 * Math.sin(age * enemy.speed * .7)));
    }
    for (const h of this.hazards) if (Math.abs(this.x - h.x) <= h.width / 2) h.wasInside = true;
    if (this.time >= this.autoAt) { this.autoAt += .8; this.hit(this.nearest(), stats(this.p).damage, true); }
    // Automatic requests use the same pending set as manual input: one cast
    // per ability, with the same target, cooldown and reward rules.
    if (this.p.automation.specials && this.p.claimed.includes('collect')) {
      this.p.specialSlots.forEach((ability, slot) => {
        if (ability && this.time >= this.cooldowns[ability]) this.requestSpecial(slot);
      });
    }
    // 같은 프레임에서는 자동 공격 → 살아 있는 적 대상 특수 공격 → 승리 정산.
    for (const special of this.pending) {
      if (this.time < this.cooldowns[special]) continue;
      const targets = special === 'wave' ? this.activeEnemies() : [this.nearest()].filter(Boolean);
      if (!targets.length) continue;
      this.cooldowns[special] = this.time + (special === 'wave' ? 9 : 5);
      for (const enemy of targets) this.hit(enemy, stats(this.p).damage * (special === 'wave' ? 2 : 3), false);
      this.emit('special', special === 'wave' ? '충격파' : '집중 파동');
    }
    this.pending.clear();
    // 소멸 시간이 지난 드롭은 승리와 같은 프레임에도 정산하지 않는다.
    this.drops = this.drops.filter(d => { if (this.time < d.expires) return true; this.emit('notice', '미수집 드롭이 소멸했습니다.'); return false; });
    if (this.enemies.every(e => e.hp <= 0)) { this.finish('win'); return; }
    const a = PLACES[this.p.place];
    for (const enemy of this.activeEnemies()) {
      if (this.time >= enemy.next) {
        enemy.next = this.time + a.interval * Math.max(1, this.enemies.length / 3); enemy.attacks++;
        let x = this.x;
        if (this.p.place === 1 && enemy.attacks % 2 === 0) x = 400 - this.x;
        if (this.p.place === 2 && this.drops.length) x = this.drops[0].x;
        x = Math.max(a.width / 2, Math.min(400 - a.width / 2, x));
        this.hazards.push({ id: ++this.serial, sourceId: enemy.id, x, width: a.width, at: this.time + a.warning, start: this.time, fromX: enemy.x, fromY: enemy.y, wasInside: Math.abs(this.x - x) <= a.width / 2 });
      }
    }
    for (const h of this.hazards.filter(h => this.time >= h.at)) {
      this.projectiles.push({ id: h.id, sourceId: h.sourceId, x: h.x, width: h.width, fromX: h.fromX ?? h.x, fromY: h.fromY ?? 260, start: this.time, at: this.time + .45, wasInside: h.wasInside });
    }
    this.hazards = this.hazards.filter(h => this.time < h.at);
    for (const shot of this.projectiles.filter(shot => this.time >= shot.at)) {
      const inside = Math.abs(this.x - shot.x) <= shot.width / 2;
      if (inside && this.time >= this.invincibleUntil) {
        const damage = Math.ceil(a.damage * (1 - stats(this.p).reduction)); this.hp = Math.max(0, this.hp - damage); this.invincibleUntil = this.time + .65;
        this.emit('hurt', `피격 −${damage}`, { x: this.x, y: 455 });
      } else if (!inside && shot.wasInside) { this.p.goals.dodge++; this.changed(); this.emit('dodge', '회피!'); }
      this.emit('strike', '!', { x: shot.x, width: shot.width });
    }
    this.projectiles = this.projectiles.filter(shot => this.time < shot.at);
    if (this.hp <= 0) { this.finish('defeat'); return; }
    for (const d of [...this.drops]) {
      d.y = Math.min(455, d.y + dt * 170);
      if (d.y >= 455 && Math.abs(d.x - this.x) <= stats(this.p).radius) this.collect(d);
    }
  }
  upgrade(key) {
    if (!(key in GEAR) || this.p.levels[key] >= 30) return false;
    const price = cost(this.p, key); if (this.p.coins < price) return false;
    const old = stats(this.p); this.p.coins -= price; this.p.levels[key]++;
    this.hp += stats(this.p).maxHp - old.maxHp;
    if (key === 'weapon') this.p.goals.upgrade = 1;
    this.changed(); this.emit('upgrade', `${GEAR[key]} Lv.${this.p.levels[key]} · 강화 완료`); return true;
  }
  // 회피·수집은 먼저 달성해도 첫 무기 카드 수령 전에는 보상을 열지 않는다.
  canClaim(id) { return this.p.goals[id] > 0 && !this.p.claimed.includes(id) && (!['dodge', 'collect'].includes(id) || this.p.claimed.includes('upgrade')); }
  claim(id) {
    const goal = GOALS.find(g => g.id === id); if (!goal || !this.canClaim(id)) return false;
    this.p.claimed.push(id);
    if (goal.card) this.p.cards.push(goal.card);
    if (id === 'win0') this.p.specials.push('wave');
    if (id === 'win1') this.p.coins += 60;
    this.changed(); this.emit('reward', `${goal.name} · ${goal.reward}`, { card: goal.card }); return true;
  }
  enchant(card, key = cardFor(this.p, card)?.gear) {
    const definition = cardFor(this.p, card);
    if (!definition || definition.gear !== key || !this.p.levels[key] || (!this.p.cards.includes(card) && !this.p.wordCards.some(item => item.id === card))) return false;
    this.p.slots[key] = this.p.slots[key] === card ? null : card;
    this.changed(); this.emit('notice', `${GEAR[key]} · ${definition.name || definition.word} ${this.p.slots[key] ? '인챈트 적용' : '인챈트 해제'}`); return true;
  }
  equip(card, key) { return this.enchant(card, key); }
  previewWordCard(input) { return makeWordCard(input); }
  claimWordCard(input) {
    const card = makeWordCard(input);
    if (!card || !this.p.claimed.includes('upgrade') || this.p.wordCards.length >= WORD_CARD_LIMIT || this.p.wordCards.some(item => item.id === card.id)) return false;
    this.p.wordCards.push(card); this.changed(); this.emit('reward', `${card.word} 카드 획득`); return true;
  }
  equipWave() { if (!this.p.specials.includes('wave')) return false; this.p.specialSlots[1] = this.p.specialSlots[1] ? null : 'wave'; this.changed(); return true; }
  travel(index) { if (this.mode === 'combat' || !this.p.unlocked.includes(index)) return false; this.p.place = index; this.changed(); this.emit('notice', `${PLACES[index].name}에 도착했습니다.`); return true; }
}
