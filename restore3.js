const fs = require('fs');
try {
  const data = fs.readFileSync('d:\\D\\BA\\MKT\\CRM-SYSTEM\\Source\\vilead-crm-production\\app\\components\\SalesManagement.tsx.backup', 'utf8');
  fs.writeFileSync('d:\\D\\BA\\MKT\\CRM-SYSTEM\\Source\\vilead-crm-production\\app\\components\\SalesManagement.tsx', data, 'utf8');
  fs.writeFileSync('d:\\D\\BA\\MKT\\CRM-SYSTEM\\Source\\vilead-crm-production\\success.txt', 'RESTORE_SUCCESSFUL_WITH_NODE');
  console.log('OK');
} catch (e) {
  fs.writeFileSync('d:\\D\\BA\\MKT\\CRM-SYSTEM\\Source\\vilead-crm-production\\error.txt', e.toString());
  console.log('ERR');
}
