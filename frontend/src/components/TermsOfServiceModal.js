import React from 'react';

const TermsOfServiceModal = ({ isOpen, onClose }) => {
  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full max-h-[80vh] overflow-y-auto">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Terms of Service
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-2 text-sm text-gray-600 space-y-4">
                  <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h4>
                    <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">2. Use License</h4>
                    <p className="mb-2">Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Modify or copy the materials</li>
                      <li>Use the materials for any commercial purpose or for any public display</li>
                      <li>Attempt to reverse engineer any software contained on the website</li>
                      <li>Remove any copyright or other proprietary notations from the materials</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">3. User Accounts</h4>
                    <p className="mb-2">When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Safeguarding the password and all activities under your account</li>
                      <li>Notifying us immediately of any unauthorized use of your account</li>
                      <li>Ensuring your account information remains accurate and up-to-date</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">4. Product Information and Pricing</h4>
                    <p className="mb-2">We strive to provide accurate product information and pricing. However:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Product descriptions and images are for illustrative purposes only</li>
                      <li>Prices are subject to change without notice</li>
                      <li>We reserve the right to limit quantities and refuse service</li>
                      <li>Availability of products is not guaranteed</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">5. Payment Terms</h4>
                    <p className="mb-2">Payment is due at the time of purchase. We accept various payment methods including:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Credit and debit cards</li>
                      <li>PayPal</li>
                      <li>Bank transfers</li>
                    </ul>
                    <p className="mt-2">All payments are processed securely through encrypted payment gateways.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">6. Shipping and Delivery</h4>
                    <p className="mb-2">Shipping terms include:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Delivery times are estimates and not guaranteed</li>
                      <li>Risk of loss transfers to you upon delivery</li>
                      <li>Additional charges may apply for international shipping</li>
                      <li>We are not responsible for delays caused by shipping carriers</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">7. Returns and Refunds</h4>
                    <p>Returns and refunds are subject to our return policy. Items must be returned within 30 days in original condition. Refunds will be processed to the original payment method within 5-10 business days after receiving the returned item.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">8. Prohibited Uses</h4>
                    <p className="mb-2">You may not use our website:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                      <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                      <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                      <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                      <li>To submit false or misleading information</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">9. Limitation of Liability</h4>
                    <p>In no event shall E-commerce Store, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">10. Governing Law</h4>
                    <p>These Terms shall be interpreted and governed by the laws of Nigeria, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">11. Changes to Terms</h4>
                    <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">12. Contact Information</h4>
                    <p>If you have any questions about these Terms of Service, please contact us at:</p>
                    <ul className="list-none space-y-1 ml-4 mt-2">
                      <li>Email: dera.delis@gmail.com</li>
                      <li>WhatsApp: +234 704 907 3197</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServiceModal;
