const fs = require('fs');
const path = require('path');

function replaceUnescapedQuotes(filePath, linesToFix) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) return;
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  
  for (const lineNum of linesToFix) {
    const idx = lineNum - 1;
    if (idx >= 0 && idx < lines.length) {
      lines[idx] = lines[idx].replace(/"(.*?)"/g, '&quot;$1&quot;');
      lines[idx] = lines[idx].replace(/"/g, '&quot;');
    }
  }

  fs.writeFileSync(fullPath, lines.join('\n'), 'utf8');
  console.log(`Fixed ${filePath}`);
}

replaceUnescapedQuotes('app/components/SalesManagement.tsx', [2145]);
replaceUnescapedQuotes('app/components/email-marketing/AddSenderModal.tsx', [147]);
replaceUnescapedQuotes('app/components/OrderDetailModal.tsx', [484]);
replaceUnescapedQuotes('app/components/OrderManagement.tsx', [2997]);
replaceUnescapedQuotes('app/components/ReportsManagement.tsx', [2479]);
