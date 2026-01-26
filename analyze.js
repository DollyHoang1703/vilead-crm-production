const fs = require('fs');
const content = fs.readFileSync('app/components/SettingsManagement.tsx', 'utf8');
const lines = content.split('\n');

// Check for the exact issue around line 2286-2295
console.log('Lines 2280-2300:');
for (let i = 2279; i < Math.min(2300, lines.length); i++) {
  console.log(`${i+1}: ${lines[i]}`);
}

// Find all arrow functions that might not be properly closed
console.log('\n\nLooking for WorkflowManagement definition:');
for (let i = 1840; i < 1860; i++) {
  console.log(`${i+1}: ${lines[i]}`);
}

// Check characters around line 2286
console.log('\n\nCharacter codes on line 2287-2289:');
for (let i = 2286; i <= 2288; i++) {
  const line = lines[i];
  console.log(`Line ${i+1}: "${line}"`);
  console.log(`  Char codes: ${[...line].map((c, j) => `${j}:${c.charCodeAt(0)}`).join(', ')}`);
}
