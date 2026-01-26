const fs = require('fs');
const content = fs.readFileSync('app/components/SettingsManagement.tsx', 'utf8');
const lines = content.split('\n');

// Count div tags from line 3261 (start of Add Distribution Rule Modal)
let divStack = [];
let startLine = 3260;

console.log('Tracking div tags from Add Distribution Rule Modal:\n');

for (let i = startLine; i < 3560 && i < lines.length; i++) {
  const line = lines[i];
  const lineNum = i + 1;
  
  // Find all opening and closing div tags
  const openMatches = line.match(/<div[^>]*>/g) || [];
  const closeMatches = line.match(/<\/div>/g) || [];
  const selfCloseMatches = line.match(/<div[^>]*\/>/g) || [];
  
  // Adjust for self-closing
  const realOpens = openMatches.length - selfCloseMatches.length;
  
  for (let j = 0; j < realOpens; j++) {
    divStack.push(lineNum);
  }
  
  for (let j = 0; j < closeMatches.length; j++) {
    if (divStack.length > 0) {
      const opened = divStack.pop();
      // Show balance operations
      if (closeMatches.length > 0 || realOpens > 0) {
        // console.log(`Line ${lineNum}: Close div (opened at ${opened}), stack depth=${divStack.length}`);
      }
    } else {
      console.log(`*** Line ${lineNum}: EXTRA </div> - no matching open! ***`);
      console.log(`   Content: ${line.trim()}`);
    }
  }
  
  // Print div-related lines
  if (realOpens > 0 || closeMatches.length > 0) {
    console.log(`${lineNum}: opens=${realOpens} closes=${closeMatches.length} stack=${divStack.length} | ${line.trim().substring(0, 70)}`);
  }
}

console.log(`\nFinal div stack: ${divStack.length} unclosed divs at lines: ${divStack.join(', ')}`);
