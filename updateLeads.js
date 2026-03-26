const fs = require('fs');
let content = fs.readFileSync('app/components/SalesManagement.tsx', 'utf8');

let mapped = 0;
// We find all instances of id: XX, ... status: 'YY', ... product: 'ZZ' inside the useState block.
content = content.replace(/(product:\s*'([^']+)',\s*tags:[\s\S]*?status:\s*'([^']+)',)/g, (match, p1, productStr, statusStr) => {
  mapped++;
  let products = ['crm-professional'];
  let pipelineId = 2; // default
  if (mapped % 3 === 0) {
    products = ['marketing-course']; // default to pipeline 1
    pipelineId = 1;
  } else if (mapped % 3 === 1) {
    products = ['consulting-basic']; // dich vu tu van -> pipeline 3
    pipelineId = 3;
  }
  
  return p1 + '\n      products: ' + JSON.stringify(products) + ',\n      pipelineStages: { ' + pipelineId + ': \'' + statusStr + '\' },';
});

console.log('Mapped ' + mapped + ' leads.');
fs.writeFileSync('app/components/SalesManagement.tsx', content);
