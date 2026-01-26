const fs = require('fs');
const content = fs.readFileSync('app/components/SettingsManagement.tsx', 'utf8');
const lines = content.split('\n');

// Track depth and look for issues around line 3541
let depth = 0;
let inString = false;
let stringChar = '';
let prev = '';

console.log('Analyzing JSX structure around line 3540:');

for (let i = 3250; i < 3600 && i < lines.length; i++) {
  const line = lines[i];
  const lineNum = i + 1;
  
  // Count opens/closes
  let opens = 0;
  let closes = 0;
  
  for (let c of line) {
    if (!inString) {
      if (c === '"' || c === "'" || c === '`') {
        inString = true;
        stringChar = c;
      } else if (c === '<') {
        // Could be JSX opening tag
      } else if (c === '{') {
        opens++;
        depth++;
      } else if (c === '}') {
        closes++;
        depth--;
      }
    } else {
      if (c === stringChar && prev !== '\\') {
        inString = false;
      }
    }
    prev = c;
  }
  
  // Print lines with changes or around 3541
  if (opens !== closes || lineNum >= 3535 && lineNum <= 3560) {
    console.log(`${lineNum}: depth=${depth} +${opens}/-${closes} | ${line.substring(0, 80)}`);
  }
  
  if (depth < 0) {
    console.log(`*** DEPTH WENT NEGATIVE at line ${lineNum} ***`);
    break;
  }
}
