const fs = require('fs');
const content = fs.readFileSync('app/components/SalesManagement.tsx', 'utf-8');
const lines = content.split('\n');
const results = lines.map((l, i) => l.includes('<CustomerDetailModal') ? `${i+1}: ${l}` : null).filter(Boolean);
fs.writeFileSync('output.txt', results.join('\n'));
