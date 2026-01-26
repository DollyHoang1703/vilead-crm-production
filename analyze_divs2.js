const fs = require('fs');
const content = fs.readFileSync('app/components/SettingsManagement.tsx', 'utf8');
const lines = content.split('\n');

// Start from the Dialog opening
let divStack = [];
let startLine = 3259; // Right after the Dialog open

console.log('Tracking div tags starting from line 3260:\n');

for (let i = startLine; i < 3560 && i < lines.length; i++) {
  const line = lines[i];
  const lineNum = i + 1;
  
  // Check for dialog elements too
  if (line.includes('<Dialog') || line.includes('</Dialog') ||
      line.includes('<DialogContent') || line.includes('</DialogContent') ||
      line.includes('<DialogHeader') || line.includes('</DialogHeader') ||
      line.includes('<DialogFooter') || line.includes('</DialogFooter')) {
    console.log(`${lineNum}: [DIALOG] ${line.trim().substring(0, 60)}`);
  }
  
  // Find all opening and closing div tags
  const openMatches = line.match(/<div[^>]*>/g) || [];
  const closeMatches = line.match(/<\/div>/g) || [];
  
  for (let j = 0; j < openMatches.length; j++) {
    divStack.push({line: lineNum, match: openMatches[j].substring(0, 40)});
  }
  
  for (let j = 0; j < closeMatches.length; j++) {
    if (divStack.length > 0) {
      const opened = divStack.pop();
    } else {
      console.log(`\n*** Line ${lineNum}: EXTRA </div> - no matching open! ***`);
      console.log(`   Line content: ${line.trim()}`);
    }
  }
  
  // Show status at key lines
  if (lineNum >= 3268 && lineNum <= 3275) {
    console.log(`${lineNum}: stack=${divStack.length} | ${line.trim().substring(0, 70)}`);
  }
  if (lineNum >= 3538 && lineNum <= 3543) {
    console.log(`${lineNum}: stack=${divStack.length} | ${line.trim().substring(0, 70)}`);
  }
}

console.log(`\nFinal: ${divStack.length} unclosed divs`);
if (divStack.length > 0) {
  console.log('Unclosed at:', divStack.map(d => d.line).join(', '));
}
