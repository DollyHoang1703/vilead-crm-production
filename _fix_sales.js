const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'app', 'components', 'ReportsManagement.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const old1 = 'return displayData.map((day, index) => (';
const new1 = `const tblMult = getFilterMultiplier(reportDeptFilter, reportTeamFilter, reportEmployeeFilter)
                return displayData.map((rawDay, index) => {
                  const day = { ...rawDay, revenue: Math.round(rawDay.revenue * tblMult), orders: Math.round(rawDay.orders * tblMult), customers: Math.round(rawDay.customers * tblMult), totalValue: Math.round(rawDay.totalValue * tblMult) }
                  return (`;

if (content.includes(old1)) {
  content = content.replace(old1, new1);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('OK - Sales table multiplier applied');
} else {
  console.log('NOT FOUND - pattern may already be replaced');
}
