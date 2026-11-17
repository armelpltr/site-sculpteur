// Génère des images placeholder neutres (formes abstraites) pour les œuvres
// fictives, le portrait et l'atelier. À supprimer une fois les vraies photos
// fournies par l'artiste.
//
// Usage : npm run placeholders
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dossierOeuvres = path.join(racine, 'src/content/oeuvres/images');
const dossierAssets = path.join(racine, 'src/assets');

const fond = (w, h, c1, c2) => `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="ombre" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#000" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect y="${h * 0.78}" width="${w}" height="${h * 0.22}" fill="#000" opacity="0.035"/>`;

const matiere = (id, a, b) => `
  <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${a}"/>
    <stop offset="1" stop-color="${b}"/>
  </linearGradient>`;

// Chaque forme est dessinée dans un repère 1000 × 1250, puis mise à l'échelle.
const formes = {
  ovale: (m) => `
    <defs>${matiere('m', m[0], m[1])}</defs>
    <ellipse cx="500" cy="985" rx="230" ry="26" fill="url(#ombre)"/>
    <path d="M500 260 C690 300 720 560 640 760 C590 890 410 900 360 760 C290 560 320 230 500 260 Z" fill="url(#m)"/>
    <ellipse cx="520" cy="560" rx="70" ry="120" fill="#000" opacity="0.10"/>
    <rect x="420" y="900" width="160" height="80" fill="${m[1]}" opacity="0.9"/>`,
  arche: (m) => `
    <defs>${matiere('m', m[0], m[1])}</defs>
    <ellipse cx="500" cy="985" rx="300" ry="28" fill="url(#ombre)"/>
    <path d="M260 980 L260 560 C260 330 740 330 740 560 L740 980 L620 980 L620 580 C620 450 380 450 380 580 L380 980 Z" fill="url(#m)"/>`,
  spirale: (m) => `
    <defs>${matiere('m', m[0], m[1])}</defs>
    <ellipse cx="500" cy="985" rx="200" ry="24" fill="url(#ombre)"/>
    <path d="M500 300 C700 320 720 520 560 560 C430 590 420 440 520 440 C600 440 590 520 540 520" fill="none" stroke="url(#m)" stroke-width="70" stroke-linecap="round"/>
    <path d="M470 560 C440 700 560 760 520 900" fill="none" stroke="url(#m)" stroke-width="80" stroke-linecap="round"/>
    <rect x="430" y="900" width="140" height="80" fill="${m[1]}"/>`,
  totem: (m) => `
    <defs>${matiere('m', m[0], m[1])}</defs>
    <ellipse cx="500" cy="985" rx="170" ry="22" fill="url(#ombre)"/>
    <rect x="420" y="260" width="160" height="170" rx="80" fill="url(#m)"/>
    <rect x="390" y="450" width="220" height="200" rx="30" fill="url(#m)"/>
    <rect x="430" y="670" width="140" height="310" rx="10" fill="url(#m)"/>
    <rect x="390" y="450" width="220" height="200" rx="30" fill="#000" opacity="0.06"/>`,
  vague: (m) => `
    <defs>${matiere('m', m[0], m[1])}</defs>
    <ellipse cx="500" cy="985" rx="320" ry="26" fill="url(#ombre)"/>
    <path d="M200 980 C220 700 380 520 520 520 C660 520 640 700 760 640 C820 610 830 520 800 460 C900 560 880 980 800 980 Z" fill="url(#m)"/>
    <path d="M300 980 C320 780 420 640 520 640" fill="none" stroke="#000" stroke-opacity="0.08" stroke-width="30"/>`,
  equilibre: (m) => `
    <defs>${matiere('m', m[0], m[1])}</defs>
    <ellipse cx="500" cy="985" rx="160" ry="22" fill="url(#ombre)"/>
    <circle cx="560" cy="360" r="110" fill="url(#m)"/>
    <polygon points="300,560 720,500 690,560 320,620" fill="url(#m)"/>
    <polygon points="480,620 560,620 600,980 440,980" fill="url(#m)"/>`,
};

// [clé de forme, couleurs matière, couleurs fond]
const oeuvres = [
  ['souffle', 'ovale', ['#7a5a3a', '#3e2c1c'], ['#efece6', '#dcd7cf']],
  ['seuil', 'arche', ['#e9e5de', '#b9b3a8'], ['#e6e3dd', '#cfcac1']],
  ['enroulement', 'spirale', ['#5b4a3a', '#2b221a'], ['#f1eee9', '#ddd8d0']],
  ['veilleur', 'totem', ['#8d8e8f', '#4a4b4d'], ['#ece9e4', '#d6d2ca']],
  ['ressac', 'vague', ['#a58a68', '#6b543a'], ['#f0ede7', '#dad5cc']],
  ['point-d-appui', 'equilibre', ['#3d3f42', '#1d1e20'], ['#eeebe5', '#d8d3cb']],
];

const vues = [
  { suffixe: '1', w: 1600, h: 2000, zoom: 1, dx: 0 },
  { suffixe: '2', w: 1600, h: 2000, zoom: 1.35, dx: -120 },
  { suffixe: '3', w: 2000, h: 1500, zoom: 0.9, dx: 0 },
];

async function rendre(svg, sortie, w, h) {
  await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${svg}</svg>`))
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(sortie);
}

await mkdir(dossierOeuvres, { recursive: true });
await mkdir(dossierAssets, { recursive: true });

for (const [nom, forme, m, f] of oeuvres) {
  for (const v of vues) {
    const echelle = (Math.min(v.w / 1000, v.h / 1250)) * v.zoom;
    const tx = (v.w - 1000 * echelle) / 2 + v.dx;
    const ty = (v.h - 1250 * echelle) / 2 + (v.zoom > 1 ? -150 : 0);
    const svg = `${fond(v.w, v.h, f[0], f[1])}
      <g transform="translate(${tx} ${ty}) scale(${echelle})">${formes[forme](m)}</g>`;
    await rendre(svg, path.join(dossierOeuvres, `${nom}-${v.suffixe}.jpg`), v.w, v.h);
  }
}

// Portrait : silhouette abstraite, à remplacer par une vraie photo de l'artiste.
await rendre(
  `${fond(1200, 1500, '#e9e6e0', '#d2cdc4')}
   <circle cx="600" cy="560" r="190" fill="#b7b0a5"/>
   <path d="M250 1500 C250 1040 420 860 600 860 C780 860 950 1040 950 1500 Z" fill="#b7b0a5"/>`,
  path.join(dossierAssets, 'portrait.jpg'), 1200, 1500,
);

// Atelier : composition de volumes sur socles.
await rendre(
  `${fond(2400, 1350, '#eceae5', '#cfc9bf')}
   <rect x="300" y="760" width="360" height="420" fill="#d9d4cb"/>
   <ellipse cx="480" cy="620" rx="150" ry="150" fill="#8f7558"/>
   <rect x="1000" y="700" width="420" height="480" fill="#dcd7ce"/>
   <path d="M1060 700 L1210 330 L1360 700 Z" fill="#6f7072"/>
   <rect x="1750" y="820" width="320" height="360" fill="#d6d1c7"/>
   <rect x="1820" y="520" width="180" height="300" rx="90" fill="#efece7"/>`,
  path.join(dossierAssets, 'atelier.jpg'), 2400, 1350,
);

console.log('Placeholders générés.');
