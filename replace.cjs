const fs = require('fs');
const path = require('path');
const dir = './src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));
let count = 0;
files.forEach(f => {
  const filepath = path.join(dir, f);
  let content = fs.readFileSync(filepath, 'utf8');
  if (content.includes('{ type: "spring", damping: 25, stiffness: 200 }')) {
    content = content.replace(/\{ type: "spring", damping: 25, stiffness: 200 \}/g, '{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }');
    fs.writeFileSync(filepath, content);
    count++;
  }
});
console.log('Updated ' + count + ' files.');
