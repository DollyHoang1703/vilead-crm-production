const fs = require('fs');
const lines = fs.readFileSync('app/components/SalesManagement.tsx', 'utf-8').split('\n');
let out = '';
lines.forEach((line, i) => {
  if (line.includes('CustomerDetailModal')) {
    out += (i + 1) + ': ' + line.trim() + '\n';
  }
});
fs.writeFileSync('matches.txt', out);
