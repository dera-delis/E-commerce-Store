import React from 'react';

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
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
                    Privacy Policy
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
                    <h4 className="font-semibold text-gray-900 mb-2">1. Information We Collect</h4>
                    <p className="mb-2">We collect information you provide directly to us, such as when you:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Create an account or update your profile</li>
                      <li>Make a purchase or place an order</li>
                      <li>Contact us for customer support</li>
                      <li>Subscribe to our newsletter</li>
                      <li>Participate in surveys or promotions</li>
                    </ul>
                    <p className="mt-2">This may include your name, email address, phone number, shipping address, payment information, and other details you choose to provide.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">2. How We Use Your Information</h4>
                    <p className="mb-2">We use the information we collect to:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Process and fulfill your orders</li>
                      <li>Provide customer support and respond to your inquiries</li>
                      <li>Send you order confirmations, shipping updates, and account notifications</li>
                      <li>Improve our website, products, and services</li>
                      <li>Send you marketing communications (with your consent)</li>
                      <li>Prevent fraud and ensure security</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">3. Information Sharing</h4>
                    <p className="mb-2">We do not sell, trade, or otherwise transfer your personal information to third parties except:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>With service providers who assist us in operating our website and conducting our business</li>
                      <li>When required by law or to protect our rights</li>
                      <li>In connection with a business transfer or acquisition</li>
                      <li>With your explicit consent</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">4. Data Security</h4>
                    <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">5. Cookies and Tracking</h4>
                    <p>We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">6. Your Rights</h4>
                    <p className="mb-2">You have the right to:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Access and update your personal information</li>
                      <li>Request deletion of your account and data</li>
                      <li>Opt-out of marketing communications</li>
                      <li>Request a copy of your data</li>
                      <li>Withdraw consent for data processing</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">7. Contact Us</h4>
                    <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                    <ul className="list-none space-y-1 ml-4 mt-2">
                      <li>Email: dera.delis@gmail.com</li>
                      <li>WhatsApp: +234 704 907 3197</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-blue-800 text-sm">
                      <strong>Note:</strong> This privacy policy may be updated from time to time. We will notify you of any material changes by posting the new policy on this page.
                    </p>
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

export default PrivacyPolicyModal;
