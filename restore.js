const fs = require('fs');
try {
  fs.renameSync('app/components/SalesManagement.tsx', 'app/components/SalesManagement_BAD.tsx');
  fs.copyFileSync('app/components/SalesManagement.tsx.backup', 'app/components/SalesManagement.tsx');
  console.log('Restore OK!');
} catch (e) {
  console.error('Error:', e);
}
