import React from 'react';

const CookiePolicyModal = ({ isOpen, onClose }) => {
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
                    Cookie Policy
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
                    <h4 className="font-semibold text-gray-900 mb-2">What Are Cookies?</h4>
                    <p>Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and to provide information to website owners.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">How We Use Cookies</h4>
                    <p className="mb-2">We use cookies for several purposes:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>To remember your preferences and settings</li>
                      <li>To keep you signed in to your account</li>
                      <li>To remember items in your shopping cart</li>
                      <li>To analyze how our website is used</li>
                      <li>To improve our website's performance and functionality</li>
                      <li>To provide personalized content and advertisements</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Types of Cookies We Use</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-gray-900">Essential Cookies</h5>
                        <p className="text-sm">These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and remembering your login status. The website cannot function properly without these cookies.</p>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900">Performance Cookies</h5>
                        <p className="text-sm">These cookies collect information about how visitors use our website, such as which pages are visited most often. This helps us improve how our website works and provides a better user experience.</p>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900">Functionality Cookies</h5>
                        <p className="text-sm">These cookies allow the website to remember choices you make (such as your username, language, or region) and provide enhanced, more personal features.</p>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900">Targeting/Advertising Cookies</h5>
                        <p className="text-sm">These cookies are used to deliver advertisements more relevant to you and your interests. They may also be used to limit the number of times you see an advertisement and measure the effectiveness of advertising campaigns.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Third-Party Cookies</h4>
                    <p className="mb-2">We may also use third-party cookies from trusted partners for:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Analytics and performance monitoring</li>
                      <li>Social media integration</li>
                      <li>Payment processing</li>
                      <li>Customer support tools</li>
                      <li>Marketing and advertising</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Managing Cookies</h4>
                    <p className="mb-2">You can control and manage cookies in several ways:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Through your browser settings (most browsers allow you to refuse or delete cookies)</li>
                      <li>By using our cookie preference center (if available)</li>
                      <li>By opting out of specific third-party cookies through their respective websites</li>
                    </ul>
                    <p className="mt-2 text-sm">Please note that disabling certain cookies may affect the functionality of our website.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Browser-Specific Instructions</h4>
                    <div className="space-y-2">
                      <p><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</p>
                      <p><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</p>
                      <p><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</p>
                      <p><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Cookie Retention</h4>
                    <p>Cookies are typically stored for different periods depending on their purpose:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li>Session cookies: Deleted when you close your browser</li>
                      <li>Persistent cookies: Remain on your device for a set period or until manually deleted</li>
                      <li>Essential cookies: Usually retained for the duration of your session</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Updates to This Policy</h4>
                    <p>We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Contact Us</h4>
                    <p>If you have any questions about our use of cookies, please contact us at:</p>
                    <ul className="list-none space-y-1 ml-4 mt-2">
                      <li>Email: dera.delis@gmail.com</li>
                      <li>WhatsApp: +234 704 907 3197</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-blue-800 text-sm">
                      <strong>Note:</strong> By continuing to use our website, you consent to our use of cookies as described in this policy. You can withdraw your consent at any time by adjusting your browser settings or contacting us.
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

export default CookiePolicyModal;
