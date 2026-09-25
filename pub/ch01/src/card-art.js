// 카드 ID로 32×32 비트맵을 재현한다. 저장본에는 이미지를 넣지 않는다.
const SIZE = 32;
const PALETTES = {
  weapon: [[19, 25, 44], [241, 188, 103], [53, 196, 216], [255, 230, 168]],
  armor: [[29, 24, 48], [193, 159, 239], [132, 97, 211], [238, 219, 255]],
  collector: [[18, 39, 43], [222, 183, 93], [73, 198, 181], [255, 230, 156]],
};

export function cardArtPixels(id, gear) {
  const palette = PALETTES[gear];
  if (!palette || typeof id !== 'string') throw new TypeError('invalid card art');
  const pixels = new Uint8ClampedArray(SIZE * SIZE * 4);
  let seed = [...id].reduce((hash, char) => Math.imul(hash ^ char.codePointAt(0), 16777619) >>> 0, 2166136261);
  const random = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return seed >>> 0; };
  const put = (x, y, color) => {
    if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) return;
    const offset = (y * SIZE + x) * 4;
    pixels.set([...palette[color], 255], offset);
  };
  const rect = (x, y, width, height, color) => {
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) put(px, py, color);
  };
  rect(0, 0, SIZE, SIZE, 0);
  rect(2, 2, 28, 2, 1); rect(2, 28, 28, 2, 1);
  rect(2, 4, 2, 24, 1); rect(28, 4, 2, 24, 1);
  rect(5, 5, 22, 22, 0);
  for (let i = 0; i < 12; i++) {
    const x = 5 + random() % 22, y = 5 + random() % 22;
    if (x < 12 || x > 19 || y < 9 || y > 24) put(x, y, random() % 2 ? 1 : 2);
  }
  // 같은 장비라도 카드마다 가장자리 룬과 색 점이 달라진다.
  for (let i = 0; i < 8; i++) {
    const color = random() % 3 ? 2 : 3;
    rect(5 + i * 3, 5, 2, 2, color);
    rect(5 + i * 3, 25, 2, 2, random() % 3 ? 1 : 3);
  }
  if (gear === 'weapon') {
    rect(14, 8, 4, 13, 2); rect(15, 6, 2, 18, 3);
    rect(11, 21, 10, 3, 1); rect(14, 24, 4, 3, 1);
  } else if (gear === 'armor') {
    for (let y = 9; y < 24; y++) {
      const half = Math.max(1, 8 - Math.floor((y - 9) / 2));
      rect(16 - half, y, half * 2, 1, 2);
    }
    rect(14, 12, 4, 10, 3); rect(15, 10, 2, 14, 3);
  } else {
    rect(9, 10, 4, 12, 2); rect(19, 10, 4, 12, 2);
    rect(11, 21, 10, 4, 1); rect(9, 9, 4, 4, 3); rect(19, 9, 4, 4, 3);
    rect(15, 14, 2, 4, 3);
  }
  return pixels;
}

const urls = new Map();
export function cardArtUrl(id, gear) {
  const key = `${gear}:${id}`;
  if (!urls.has(key)) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = SIZE;
    const context = canvas.getContext('2d'), image = context.createImageData(SIZE, SIZE);
    image.data.set(cardArtPixels(id, gear)); context.putImageData(image, 0, 0);
    urls.set(key, canvas.toDataURL('image/png'));
  }
  return urls.get(key);
}
