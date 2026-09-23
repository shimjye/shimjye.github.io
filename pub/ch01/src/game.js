// 설계 F1~F9의 상태/경제 규칙. 렌더링과 분리해 동일 규칙을 터치·PC·테스트에서 사용한다.
// 밸런스 초깃값: 0.8초당 피해 8, 실제 자동 피해 4당 코인 1, 첫 강화 12코인.
export const PLACES = [
  { name: '잔광 골목', role: '시작 구역', chance: .7, escape: .8, hp: 64, count: 2, reward: 10, width: 70, warning: 1.5, interval: 4.4, damage: 12, description: '느리고 좁은 균열 · 회피를 익히는 골목', condition: '처음부터 개방', goal: '첫 승리 → 유리 교차로 개방' },
  { name: '유리 교차로', role: '전투 구역', chance: .8, escape: .6, hp: 100, count: 3, reward: 18, width: 94, warning: 1.3, interval: 3.6, damage: 17, description: '엇갈리는 균열 · 장비 성장을 위한 코인', condition: '잔광 골목에서 승리', goal: '첫 승리 → 공중 정원 개방' },
  { name: '공중 정원', role: '탐색 구역', chance: .6, escape: .4, hp: 135, count: 3, reward: 26, width: 112, warning: 1.4, interval: 3.9, damage: 20, description: '보상 위치를 노리는 균열 · 수집 동선 판단', condition: '유리 교차로에서 승리', goal: '위험 사이에서 드롭 수집' },
];
export const GEAR = { weapon: '공명기', armor: '방호 재킷', collector: '궤도 자석' };
export const PROGRESS_VERSION = 2;
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
  return { version: PROGRESS_VERSION, coins: 0, remainder: 0, levels: { weapon: 1, armor: 0, collector: 0 }, slots: { weapon: null, armor: null, collector: null }, cards: [], specials: ['pulse'], specialSlots: ['pulse', null], automation: { specials: false }, place: 0, unlocked: [0], explored: false, goals: { upgrade: 0, dodge: 0, collect: 0, win0: 0, win1: 0 }, claimed: [], savedAt: 0 };
}
export function stats(p) {
  return { damage: Math.floor((8 + (p.levels.weapon - 1) * 3) * (p.slots.weapon === 'focus' ? 1.25 : 1)), maxHp: 100 + p.levels.armor * 20, radius: Math.min(80, 22 + p.levels.collector * 6 + (p.slots.collector === 'reach' ? 16 : 0)), reduction: p.slots.armor === 'guard' ? .2 : 0, range: 240 };
}
export function cost(p, key) { return Math.floor((key === 'weapon' ? 12 : 20) * 1.55 ** (p.levels[key] - (key === 'weapon' ? 1 : 0))); }
// Guidance only selects an existing action; it never buys, claims, or travels
// on the player's behalf. Combat guidance cannot bypass the map restriction.
export function nextObjective(world) {
  const p = world.p, battle = world.mode === 'combat';
  const play = text => ({ text, target: battle ? 'move-pad' : 'explore' });
  if (!p.goals.upgrade) {
    const price = cost(p, 'weapon');
    if (p.coins < price) return play(`${battle ? '자동 공격으로' : '탐색으로'} 코인 모으기 · 첫 강화까지 ${price - p.coins} 코인`);
    return { text: `공명기 첫 강화 · ${price} 코인`, target: 'equipment' };
  }
  if (!p.claimed.includes('upgrade')) return { text: '목표에서 집중 타격 카드 받기', target: 'goals' };
  if (!p.slots.weapon) return { text: '카드에서 집중 타격 장착', target: 'cards' };
  if (!p.goals.win0) return play('잔광 골목 승리 · 다음 장소 개방');
  if (!p.claimed.includes('win0')) return { text: '첫 승리 보상 · 충격파 받기', target: 'goals' };
  if (!p.specialSlots[1]) return { text: '카드 메뉴에서 충격파 장착', target: 'cards' };
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
    this.x = 200; this.targetX = null; this.enemies = []; this.drops = []; this.hazards = []; this.events = [];
    this.time = 0; this.autoAt = 0; this.invincibleUntil = 0; this.cooldowns = { pulse: 0, wave: 0 }; this.escapeAt = 0; this.pending = new Set(); this.serial = 0; this.revision = 0;
  }
  emit(type, text, data = {}) { this.events.push({ type, text, ...data }); }
  changed() { this.revision++; }
  explore() {
    if (this.mode !== 'idle') return false;
    const guaranteed = !this.p.explored && this.p.place === 0;
    this.p.explored = true; this.changed();
    if (!guaranteed && this.random() >= PLACES[this.p.place].chance) { this.emit('notice', '고요한 거리입니다. 다시 탐색해 보세요.'); return false; }
    const a = PLACES[this.p.place];
    this.mode = 'combat'; this.hp = stats(this.p).maxHp; this.x = 200; this.targetX = null;
    this.enemies = Array.from({ length: a.count }, (_, i) => ({ id: ++this.serial, x: a.count === 2 ? 115 + 170 * i : 75 + 125 * i, y: 260 + (i % 2) * 22, hp: a.hp, maxHp: a.hp, next: this.time + 2 + i * 1.8, attacks: 0 }));
    this.drops = []; this.hazards = []; this.autoAt = this.time + .4; this.invincibleUntil = 0;
    this.cooldowns = { pulse: 0, wave: 0 }; this.escapeAt = 0; this.pending.clear();
    this.emit('notice', '조우! 자동 공격 중 · 하단을 좌우로 드래그해 회피하세요.'); return true;
  }
  move(x) { this.targetX = x === null ? null : Math.max(25, Math.min(375, x)); }
  requestSpecial(slot) { if (this.mode === 'combat' && this.p.specialSlots[slot]) this.pending.add(this.p.specialSlots[slot]); }
  setSpecialAutomation(enabled) {
    if (typeof enabled !== 'boolean' || !this.p.claimed.includes('collect') || this.p.automation.specials === enabled) return false;
    this.p.automation.specials = enabled; this.changed();
    this.emit('notice', `특수 기술 자동 사용 ${enabled ? '켜짐' : '꺼짐'} · 수동 조작은 계속 사용할 수 있습니다.`); return true;
  }
  nearest(range = stats(this.p).range) {
    return this.enemies.filter(e => e.hp > 0 && Math.hypot(e.x - this.x, e.y - 455) <= range)
      .sort((a, b) => Math.hypot(a.x - this.x, a.y - 455) - Math.hypot(b.x - this.x, b.y - 455) || a.x - b.x)[0];
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
      this.drops.push({ id: ++this.serial, x: enemy.x, y: enemy.y, born: this.time, expires: this.time + 9.2, value: PLACES[this.p.place].reward });
      this.emit('kill', '균열 소멸', { x: enemy.x, y: enemy.y });
    }
  }
  collect(drop, settlement = false) {
    const index = this.drops.indexOf(drop); if (index < 0) return 0;
    this.drops.splice(index, 1); this.p.coins += drop.value; this.p.goals.collect++; this.changed();
    if (!settlement) this.emit('collect', `접근 수집 +${drop.value} 코인`, { x: drop.x, y: 455 });
    return drop.value;
  }
  finish(result) {
    if (this.mode !== 'combat') return;
    let sum = 0, count = this.drops.length;
    if (result === 'win') {
      for (const d of [...this.drops]) sum += this.collect(d, true);
      if (this.p.place < 2) {
        this.p.goals[`win${this.p.place}`] = 1;
        if (!this.p.unlocked.includes(this.p.place + 1)) this.p.unlocked.push(this.p.place + 1);
      }
      this.emit('result', `승리! 남은 드롭 ${count}개 정산 +${sum} 코인. 성장과 목표가 유지됩니다.`);
    } else this.emit('result', `${result === 'escape' ? '도망 성공' : '패배'} · 남은 드롭 ${count}개 소멸. 획득한 코인과 성장은 유지됩니다.`);
    this.mode = 'idle'; this.enemies = []; this.hazards = []; this.drops = []; this.pending.clear(); this.targetX = null; this.changed();
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
    while (dt > 1e-8 && this.mode === 'combat') { const step = Math.min(.05, dt); this.step(step); dt -= step; }
  }
  step(dt) {
    this.time += dt;
    if (this.targetX !== null) this.x += Math.sign(this.targetX - this.x) * Math.min(Math.abs(this.targetX - this.x), dt * 235);
    for (const h of this.hazards) if (Math.abs(this.x - h.x) <= h.width / 2) h.wasInside = true;
    if (this.time >= this.autoAt) { this.autoAt += .8; this.hit(this.nearest(), stats(this.p).damage, true); }
    // Automatic requests use the same pending set as manual input: one cast
    // per ability, with the same range, targets, cooldown and reward rules.
    if (this.p.automation.specials && this.p.claimed.includes('collect')) {
      this.p.specialSlots.forEach((ability, slot) => {
        if (ability && this.time >= this.cooldowns[ability]) this.requestSpecial(slot);
      });
    }
    // 같은 프레임에서는 자동 공격 → 살아 있는 적 대상 특수 공격 → 승리 정산.
    for (const special of this.pending) {
      if (this.time < this.cooldowns[special]) continue;
      const targets = special === 'wave' ? this.enemies.filter(e => e.hp > 0) : [this.nearest(300)].filter(Boolean);
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
    for (const enemy of this.enemies.filter(e => e.hp > 0)) {
      if (this.time >= enemy.next) {
        enemy.next = this.time + a.interval; enemy.attacks++;
        let x = this.x;
        if (this.p.place === 1 && enemy.attacks % 2 === 0) x = 400 - this.x;
        if (this.p.place === 2 && this.drops.length) x = this.drops[0].x;
        x = Math.max(a.width / 2, Math.min(400 - a.width / 2, x));
        this.hazards.push({ id: ++this.serial, x, width: a.width, at: this.time + a.warning, start: this.time, wasInside: Math.abs(this.x - x) <= a.width / 2 });
      }
    }
    for (const h of this.hazards.filter(h => this.time >= h.at)) {
      const inside = Math.abs(this.x - h.x) <= h.width / 2;
      if (inside && this.time >= this.invincibleUntil) {
        const damage = Math.ceil(a.damage * (1 - stats(this.p).reduction)); this.hp = Math.max(0, this.hp - damage); this.invincibleUntil = this.time + .65;
        this.emit('hurt', `피격 −${damage}`, { x: this.x, y: 455 });
      } else if (!inside && h.wasInside) { this.p.goals.dodge++; this.changed(); this.emit('dodge', '회피!'); }
      this.emit('strike', '!', { x: h.x, width: h.width });
    }
    this.hazards = this.hazards.filter(h => this.time < h.at);
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
  canClaim(id) { return this.p.goals[id] > 0 && !this.p.claimed.includes(id) && (!['dodge', 'collect'].includes(id) || this.p.claimed.includes('upgrade')); }
  claim(id) {
    const goal = GOALS.find(g => g.id === id); if (!goal || !this.canClaim(id)) return false;
    this.p.claimed.push(id);
    if (goal.card) this.p.cards.push(goal.card);
    if (id === 'win0') this.p.specials.push('wave');
    if (id === 'win1') this.p.coins += 60;
    this.changed(); this.emit('reward', `${goal.name} · ${goal.reward}`, { card: goal.card }); return true;
  }
  equip(card, key = CARDS[card]?.gear) {
    if (!this.p.cards.includes(card) || CARDS[card]?.gear !== key || !this.p.levels[key]) return false;
    this.p.slots[key] = this.p.slots[key] === card ? null : card;
    this.changed(); this.emit('notice', `${CARDS[card].name} ${this.p.slots[key] ? '장착' : '해제'}`); return true;
  }
  equipWave() { if (!this.p.specials.includes('wave')) return false; this.p.specialSlots[1] = this.p.specialSlots[1] ? null : 'wave'; this.changed(); return true; }
  travel(index) { if (this.mode === 'combat' || !this.p.unlocked.includes(index)) return false; this.p.place = index; this.changed(); this.emit('notice', `${PLACES[index].name}에 도착했습니다.`); return true; }
}
