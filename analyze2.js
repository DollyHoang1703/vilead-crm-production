const fs = require('fs');
const content = fs.readFileSync('app/components/SettingsManagement.tsx', 'utf8');
const lines = content.split('\n');

// Starting from WorkflowManagement at line 1850, track brace depth
let depth = 0;
let startLine = 1849; // 0-indexed for WorkflowManagement

console.log('Tracking brace depth from WorkflowManagement start:');

for (let i = startLine; i < Math.min(2300, lines.length); i++) {
  const line = lines[i];
  const lineNum = i + 1;
  
  // Simple brace count (ignoring strings for simplicity)
  let opens = 0;
  let closes = 0;
  
  // Count { and } but skip those in strings/comments
  let inString = false;
  let stringChar = '';
  let prev = '';
  
  for (let c of line) {
    if (!inString) {
      if (c === '"' || c === "'" || c === '`') {
        inString = true;
        stringChar = c;
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
  
  // Print interesting lines
  if (opens > 0 || closes > 0 || lineNum >= 2285) {
    console.log(`${lineNum}: depth=${depth} opens=${opens} closes=${closes} | ${line.trim().substring(0, 60)}`);
  }
  
  // Check for depth going to 0 (would mean WorkflowManagement closed)
  if (depth <= 0 && lineNum > 1850) {
    console.log(`\n*** DEPTH HIT ${depth} at line ${lineNum} ***`);
    console.log(`Line: ${line}`);
    break;
  }
}
