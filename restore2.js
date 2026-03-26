const fs = require('fs');
try {
  console.log('Reading backup...');
  const data = fs.readFileSync('app/components/SalesManagement.tsx.backup', 'utf8');
  console.log('Writing to target...');
  fs.writeFileSync('app/components/SalesManagement.tsx', data, 'utf8');
  console.log('RESTORE SUCCESSFUL');
} catch (e) {
  console.error('RESTORE ERROR:', e.message);
}
