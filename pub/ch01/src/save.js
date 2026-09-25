import { freshProgress, CARDS, PROGRESS_VERSION, validSavedWordCard, WORD_CARD_LIMIT, cardFor } from './game.js';
// Keep the storage address stable so existing installations are discovered;
// the version inside each snapshot is the schema contract, not this key suffix.
export const SAVE_KEY = 'overlap-city.progress.v1';
export const BACKUP_KEY = `${SAVE_KEY}.backup`;
export const RECOVERY_KEY = `${SAVE_KEY}.recovery`;
export const SAVE_VERSION = PROGRESS_VERSION;
const integer = (x, min = 0, max = Number.MAX_SAFE_INTEGER) => Number.isSafeInteger(x) && x >= min && x <= max;
// An unsupported schema is not corruption: never silently roll it back to an
// older backup. v1 and v2 are the supported migration sources.
function unsupportedVersion(raw) {
  try {
    const value = JSON.parse(raw);
    return Number.isSafeInteger(value?.version) && ![1, 2, SAVE_VERSION].includes(value.version);
  } catch { return false; }
}
// 저장은 영속 진행만 허용한다. 유효하지 않은 기본/백업은 명시적 새 시작 전까지 보존한다.
function validBase(p) {
  if (!p || !integer(p.coins) || !integer(p.remainder, 0, 3) || !integer(p.savedAt) || typeof p.explored !== 'boolean') return false;
  if (!p.levels || !p.slots || !p.goals || !integer(p.place, 0, 2)) return false;
  for (const key of ['weapon', 'armor', 'collector']) {
    if (!integer(p.levels[key], key === 'weapon' ? 1 : 0, 30)) return false;
    if (p.slots[key] !== null && (!cardFor(p, p.slots[key]) || cardFor(p, p.slots[key]).gear !== key || !p.levels[key])) return false;
  }
  const list = (x, allowed) => Array.isArray(x) && new Set(x).size === x.length && x.every(v => allowed.includes(v));
  if (!list(p.cards, Object.keys(CARDS)) || !list(p.claimed, Object.keys(freshProgress().goals)) || !list(p.unlocked, [0, 1, 2]) || !p.unlocked.includes(0) || !p.unlocked.includes(p.place)) return false;
  if (!list(p.specials, ['pulse', 'wave']) || !p.specials.includes('pulse') || !Array.isArray(p.specialSlots) || p.specialSlots.length !== 2 || p.specialSlots[0] !== 'pulse' || ![null, 'wave'].includes(p.specialSlots[1]) || (p.specialSlots[1] && !p.specials.includes(p.specialSlots[1]))) return false;
  for (const [key, card] of Object.entries(p.slots)) if (!['weapon', 'armor', 'collector'].includes(key) || (card && !p.cards.includes(card))) return false;
  for (const id of Object.keys(freshProgress().goals)) if (!integer(p.goals[id]) || (p.claimed.includes(id) && !p.goals[id])) return false;
  for (const [id, card] of Object.entries(CARDS)) if (p.cards.includes(id) !== p.claimed.includes(card.goal)) return false;
  if ((p.cards.includes('guard') || p.cards.includes('reach')) && !p.cards.includes('focus')) return false;
  if (p.specials.includes('wave') !== p.claimed.includes('win0')) return false;
  if (p.unlocked.includes(1) !== !!p.goals.win0 || p.unlocked.includes(2) !== !!p.goals.win1 || (p.goals.win1 && !p.goals.win0)) return false;
  return true;
}
export function valid(p) {
  return p?.version === SAVE_VERSION && validBase(p) && !!p.automation &&
    Object.keys(p.automation).length === 1 && typeof p.automation.specials === 'boolean' &&
    (!p.automation.specials || p.claimed.includes('collect')) &&
    Array.isArray(p.wordCards) && p.wordCards.length <= WORD_CARD_LIMIT &&
    (!p.wordCards.length || p.claimed.includes('upgrade')) &&
    new Set(p.wordCards.map(card => card?.id)).size === p.wordCards.length &&
    p.wordCards.every(validSavedWordCard);
}
export function decode(raw) {
  try {
    let progress = JSON.parse(raw);
    // Copy only after validating the legacy contract. Reading never mutates
    // either stored original; saving preserves both before the first v3 write.
    if (progress?.version === 1 && validBase(progress)) progress = { ...progress, version: 2, automation: { specials: false } };
    if (progress?.version === 2 && validBase(progress) && progress.automation && Object.keys(progress.automation).length === 1 && typeof progress.automation.specials === 'boolean' && (!progress.automation.specials || progress.claimed.includes('collect'))) progress = { ...progress, version: SAVE_VERSION, wordCards: [] };
    return valid(progress) ? progress : null;
  } catch { return null; }
}
function legacy(raw) { try { return [1, 2].includes(JSON.parse(raw)?.version); } catch { return false; } }
export class SaveStore {
  constructor(storage, now = Date.now) { this.storage = storage; this.now = now; this.blocked = false; this.last = 0; this.message = '아직 저장하지 않음'; this.failed = false; this.explicitNew = false; }
  load() {
    this.blocked = false; this.failed = false; this.last = 0; this.explicitNew = false; this.message = '아직 저장하지 않음';
    try {
      const raw = this.storage.getItem(SAVE_KEY), backup = this.storage.getItem(BACKUP_KEY);
      if (unsupportedVersion(raw) || unsupportedVersion(backup)) {
        this.blocked = true; this.message = '다른 버전의 저장 기록입니다. 호환되는 게임 버전에서 열어 주세요. 기본본과 백업을 보존 중입니다.';
        return freshProgress();
      }
      const main = decode(raw), fallback = decode(backup);
      if (main) { this.last = main.savedAt; this.message = legacy(raw) ? '이전 진행을 읽었습니다. 다음 저장 시 새 형식으로 기록합니다.' : '저장된 진행을 불러왔습니다.'; return main; }
      if (fallback) { this.last = fallback.savedAt; this.message = '기본 저장본 오류 · 정상 백업을 복구했습니다.'; return fallback; }
      if (raw !== null || backup !== null) { this.blocked = true; this.message = '저장본과 백업을 읽을 수 없습니다. 기존 기록을 보존 중입니다.'; }
    } catch { this.blocked = true; this.failed = true; this.message = '저장소를 읽을 수 없습니다. 접근 재시도 또는 새 시작을 선택하세요.'; }
    return freshProgress();
  }
  save(progress) {
    if (this.blocked) return false;
    try {
      const candidate = { ...structuredClone(progress), savedAt: this.now() };
      if (!valid(candidate)) throw new Error('invalid progress');
      const data = JSON.stringify(candidate); if (!decode(data)) throw new Error('invalid serialization');
      const previous = this.storage.getItem(SAVE_KEY);
      const backup = this.storage.getItem(BACKUP_KEY);
      if (!this.explicitNew && (unsupportedVersion(previous) || unsupportedVersion(backup))) {
        this.failed = true; this.message = '다른 버전의 저장 기록이 있어 저장하지 않았습니다. 현재 메모리 진행과 기존 기록을 보존합니다.'; return false;
      }
      const previousProgress = decode(previous), backupProgress = decode(backup);
      // Retain the latest migration/rejected pair before replacing an original.
      // If preservation fails (including silent writes), leave both untouched.
      if (legacy(previous) || legacy(backup) || (previous !== null && !previousProgress) || (backup !== null && !backupProgress)) {
        const rejected = JSON.stringify({ main: previous, backup });
        this.storage.setItem(RECOVERY_KEY, rejected);
        if (this.storage.getItem(RECOVERY_KEY) !== rejected) throw new Error('recovery verification failed');
      }
      // 손상 기본본을 정상 백업 위에 덮지 않는다. 기록 및 읽기 확인 성공 후에만 시각 갱신.
      // Both live copies must use v3 after migration. Otherwise an older client
      // could reject the new main and silently revive a stale backup.
      if (previousProgress) this.storage.setItem(BACKUP_KEY, legacy(previous) ? JSON.stringify(previousProgress) : previous);
      else if (backupProgress && legacy(backup)) this.storage.setItem(BACKUP_KEY, JSON.stringify(backupProgress));
      else if (this.explicitNew && backup !== null && !backupProgress) this.storage.setItem(BACKUP_KEY, data);
      this.storage.setItem(SAVE_KEY, data);
      if (this.storage.getItem(SAVE_KEY) !== data) throw new Error('write verification failed');
      progress.savedAt = candidate.savedAt; this.last = candidate.savedAt; this.failed = false; this.explicitNew = false; this.message = '로컬 저장 완료'; return true;
    } catch { this.failed = true; this.message = '저장 실패 · 현재 변경은 미저장 상태입니다. 다시 시도하세요.'; return false; }
  }
  startNew() { this.blocked = false; this.explicitNew = true; return freshProgress(); }
  resetAll() {
    const keys = [SAVE_KEY, BACKUP_KEY, RECOVERY_KEY], previous = [];
    try {
      for (const key of keys) previous.push(this.storage.getItem(key));
      for (const key of keys) this.storage.removeItem(key);
      if (keys.some(key => this.storage.getItem(key) !== null)) throw new Error('reset verification failed');
      this.blocked = false; this.failed = false; this.explicitNew = false; this.last = 0;
      this.message = '게임을 완전히 초기화했습니다.';
      return freshProgress();
    } catch {
      for (let i = 0; i < previous.length; i++) {
        try { if (previous[i] !== null) this.storage.setItem(keys[i], previous[i]); } catch { /* 원본 복구 실패는 저장 차단으로 표시 */ }
      }
      this.blocked = true; this.failed = true;
      this.message = '초기화 실패 · 저장 기록을 확인할 수 없습니다.';
      return null;
    }
  }
}
