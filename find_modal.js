const fs = require('fs');
const lines = fs.readFileSync('app/components/SalesManagement.tsx', 'utf-8').split('\n');
lines.forEach((line, i) => {
  if (line.includes('CustomerDetailModal')) {
    console.log(i + 1 + ': ' + line.trim());
  }
});
