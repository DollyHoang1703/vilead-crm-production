const fs = require('fs');
const file = './app/components/ReportsManagement.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/ease-\[cubic-bezier\(0\.645,0\.045,0\.355,1\)\]/g, 'ease-omi-ease');
fs.writeFileSync(file, content);
console.log('Done');
