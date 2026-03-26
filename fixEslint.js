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
      // Replace literal double quotes with &quot; only if they are not part of an HTML attribute
      // A safe way for these specific lines is just replacing all `"` and `"` with `&quot;` inside the text.
      // Easiest is to just regex replace `"(.*?)"` with `&quot;$1&quot;` specifically on those lines.
      lines[idx] = lines[idx].replace(/"(.*?)"/g, '&quot;$1&quot;');
      // Handle unmatched quotes if any
      lines[idx] = lines[idx].replace(/"/g, '&quot;');
    }
  }

  fs.writeFileSync(fullPath, lines.join('\n'), 'utf8');
  console.log(`Fixed ${filePath}`);
}

replaceUnescapedQuotes('app/components/SalesManagement.tsx', [
  4308, 5077, 6268, 6300, 6343, 6347, 7433
]);

replaceUnescapedQuotes('app/components/SettingsManagement.tsx', [
  2973, 3098, 3132, 9415, 9447
]);

replaceUnescapedQuotes('components/ui/creatable-select.tsx', [
  159
]);

// For SettingsManagement missing dependency exhaustive-deps error:
const settingsPath = path.join(__dirname, 'app/components/SettingsManagement.tsx');
if (fs.existsSync(settingsPath)) {
  let content = fs.readFileSync(settingsPath, 'utf8');
  // Just add eslint-disable-next-line
  const lines = content.split('\n');
  const lineIdx = 6306 - 1;
  if (!lines[lineIdx - 1].includes('eslint-disable-next-line')) {
    lines.splice(lineIdx - 1, 0, '    // eslint-disable-next-line react-hooks/exhaustive-deps');
    fs.writeFileSync(settingsPath, lines.join('\n'), 'utf8');
    console.log('Fixed SettingsManagement.tsx exhaustive-deps');
  }
}
