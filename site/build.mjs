// Inlines the Europe dot map into index.html (run: node build.mjs)
import fs from 'fs';
const map = fs.readFileSync('assets/img/europe.svg', 'utf8');
fs.writeFileSync('index.html', fs.readFileSync('index.src.html', 'utf8').replace('<!--MAP-->', map));
