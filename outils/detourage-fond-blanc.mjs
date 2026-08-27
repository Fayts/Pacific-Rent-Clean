// Detourage du fond blanc par remplissage depuis les bords.
// On n'efface QUE le blanc relie au bord du cadre : les blancs interieurs
// (cuve transparente, reflets du tube chrome) sont donc preserves.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const SRC = process.argv[2];
const OUT = process.argv[3];
const W = Number(process.argv[4] || 1400);
const THR = Number(process.argv[5] || 232);      // seuil de luminance du fond
const SOFT = Number(process.argv[6] || 208);     // debut de la transition

const S = '/tmp/claude-0/-home-user-Pacific-Rent-Clean/15879dab-30ac-5667-b679-b62b3c4639e1/scratchpad';
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', SRC, '-vf', `scale=${W}:-2`,
  '-pix_fmt', 'rgb24', '-f', 'rawvideo', `${S}/src.bin`]);
const dim = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height',
  '-of', 'csv=p=0', SRC]).toString().trim().split(',').map(Number);
const H = Math.round(W * dim[1] / dim[0] / 2) * 2;
const buf = readFileSync(`${S}/src.bin`);
console.log(`source ${dim[0]}x${dim[1]} -> travail ${W}x${H}`);

const lum = p => 0.2126 * buf[p * 3] + 0.7152 * buf[p * 3 + 1] + 0.0722 * buf[p * 3 + 2];
const sat = p => {
  const r = buf[p * 3], g = buf[p * 3 + 1], b = buf[p * 3 + 2];
  return Math.max(r, g, b) - Math.min(r, g, b);
};

// remplissage depuis les bords, sur les pixels clairs et peu colores
const bg = new Uint8Array(W * H);
const st = new Int32Array(W * H);
let sp = 0;
const push = p => { if (!bg[p] && lum(p) > SOFT && sat(p) < 40) { bg[p] = 1; st[sp++] = p; } };
for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x); }
for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1); }
while (sp > 0) {
  const q = st[--sp], qx = q % W, qy = (q / W) | 0;
  if (qx > 0) push(q - 1);
  if (qx < W - 1) push(q + 1);
  if (qy > 0) push(q - W);
  if (qy < H - 1) push(q + W);
}

// alpha : opaque au coeur du sujet, transition douce sur le liseré clair
const rgba = Buffer.alloc(W * H * 4);
let kept = 0;
for (let p = 0; p < W * H; p++) {
  const L = lum(p);
  let a = 255;
  if (bg[p]) a = L >= THR ? 0 : Math.round(255 * (THR - L) / (THR - SOFT));
  rgba[p * 4] = buf[p * 3]; rgba[p * 4 + 1] = buf[p * 3 + 1];
  rgba[p * 4 + 2] = buf[p * 3 + 2]; rgba[p * 4 + 3] = a;
  if (a > 8) kept++;
}
writeFileSync(`${S}/cut.rgba`, rgba);
console.log(`pixels conserves : ${(100 * kept / (W * H)).toFixed(1)} % du cadre`);

// boite englobante du sujet, pour recadrer au plus juste
let L = W, R = 0, T = H, B = 0;
for (let p = 0; p < W * H; p++) {
  if (rgba[p * 4 + 3] > 24) {
    const x = p % W, y = (p / W) | 0;
    if (x < L) L = x; if (x > R) R = x; if (y < T) T = y; if (y > B) B = y;
  }
}
console.log(`boite du sujet : x ${L}..${R}, y ${T}..${B}  (${R - L} x ${B - T})`);
execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba',
  '-s', `${W}x${H}`, '-i', `${S}/cut.rgba`, '-frames:v', '1', OUT]);
console.log('ecrit :', OUT);
