const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'prisma', 'dev.db');
const dests = [
  path.join(__dirname, '..', '..', 'node_modules', '.prisma', 'client', 'dev.db'),
  path.join(__dirname, '..', '..', 'node_modules', '@prisma', 'client', 'dev.db'),
];

console.log(`Starting to copy database file from: ${src}`);

dests.forEach(dest => {
  try {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
    console.log(`Successfully copied database to: ${dest}`);
  } catch (err) {
    console.warn(`Could not copy database to ${dest}:`, err.message);
  }
});
