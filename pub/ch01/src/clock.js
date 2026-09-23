// Lifecycle boundaries reset the baseline; menus do not. Never replay a
// suspended browser's wall time as attacks, cooldowns, or drop expiration.
export class ActiveClock {
  constructor(now) { this.last = now; this.active = true; }
  sample(now) {
    const elapsed = this.active ? Math.max(0, now - this.last) / 1000 : 0;
    this.last = now;
    return elapsed;
  }
  setActive(active, now) { this.active = active; this.last = now; }
}
