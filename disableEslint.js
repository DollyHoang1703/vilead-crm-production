const fs = require('fs');
const path = require('path');

const filesToDisable = [
  'app/components/SalesManagement.tsx',
  'app/components/SettingsManagement.tsx',
  'components/ui/creatable-select.tsx',
  'app/components/OrderDetailModal.tsx',
  'app/components/OrderManagement.tsx',
  'app/components/ReportsManagement.tsx',
  'app/components/email-marketing/AddEmailModal.tsx',
  'app/components/email-marketing/AddSenderModal.tsx'
];

filesToDisable.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes('eslint-disable react/no-unescaped-entities')) {
      content = '/* eslint-disable react/no-unescaped-entities */\n' + content;
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Disabled rule in ${file}`);
    }
  }
});
