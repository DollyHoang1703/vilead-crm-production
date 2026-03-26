const fs = require('fs');

let content = fs.readFileSync('app/components/SalesManagement.tsx', 'utf-8');

// 1. Add import
if (!content.includes('import CreateOrderModal')) {
  content = content.replace(
    'import CustomerDetailModal from \'./CustomerDetailModal\'',
    'import CustomerDetailModal from \'./CustomerDetailModal\'\nimport CreateOrderModal from \'./CreateOrderModal\''
  );
}

// 2. Add state inside SalesManagement
if (!content.includes('const [showCreateOrderModal')) {
  content = content.replace(
    /const \[showLeadDetailModal, setShowLeadDetailModal\] = useState\(false\)/,
    'const [showLeadDetailModal, setShowLeadDetailModal] = useState(false)\n  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false)\n  const [selectedCustomerForOrder, setSelectedCustomerForOrder] = useState<Lead | null>(null)'
  );
}

// 3. Inject CreateOrderModal at the end
if (!content.includes('<CreateOrderModal')) {
  const modalCode = `
      {/* Create Order Modal */}
      {showCreateOrderModal && selectedCustomerForOrder && (
        <CreateOrderModal
          isOpen={showCreateOrderModal}
          onClose={() => {
            setShowCreateOrderModal(false)
            setSelectedCustomerForOrder(null)
          }}
          onSave={(orderData) => {
            console.log('Save order:', orderData)
            setShowCreateOrderModal(false)
            setSelectedCustomerForOrder(null)
            // You might want to refresh leads or save order logic here
          }}
          customers={[{ 
            id: selectedCustomerForOrder.id, 
            name: selectedCustomerForOrder.name, 
            phone: selectedCustomerForOrder.phone, 
            email: selectedCustomerForOrder.email, 
            company: selectedCustomerForOrder.company, 
            type: 'lead' as const
          }]}
          products={availableProducts}
          initialCustomerId={selectedCustomerForOrder.id.toString()}
        />
      )}
    </div>
  )
}
`;
  content = content.replace(/ \s*<\/div>\n\s*\)\n\s*}\s*$/, modalCode);
}

// 4. Update the <CustomerDetailModal /> prop onCreateOrder
if (!content.includes('onCreateOrder=')) {
  content = content.replace(
    '<CustomerDetailModal',
    '<CustomerDetailModal\n          onCreateOrder={(customerData) => {\n            console.log("onCreateOrder triggered:", customerData);\n            setSelectedCustomerForOrder(selectedLead);\n            setShowCreateOrderModal(true);\n          }}'
  );
}

fs.writeFileSync('app/components/SalesManagement.tsx', content);
console.log('Modification successful');
