import React from 'react';

const ReturnsExchangesModal = ({ isOpen, onClose }) => {
  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Returns & Exchanges
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
                <div className="mt-2 text-sm text-gray-500 space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Return Policy</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Items can be returned within 30 days of purchase</li>
                      <li>Items must be in original condition with tags attached</li>
                      <li>Original receipt or order confirmation required</li>
                      <li>Return shipping costs are the responsibility of the customer</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Exchange Policy</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Exchanges available for different sizes or colors</li>
                      <li>Exchange requests must be made within 14 days</li>
                      <li>Price difference will be charged if exchanging for higher value item</li>
                      <li>Refund will be issued if exchanging for lower value item</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">How to Return/Exchange</h4>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Contact our support team via WhatsApp or email</li>
                      <li>Provide your order number and reason for return/exchange</li>
                      <li>Receive return authorization and shipping instructions</li>
                      <li>Package items securely and ship to our return address</li>
                      <li>Once received, we'll process your return or exchange within 3-5 business days</li>
                    </ol>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-blue-800 text-sm">
                      <strong>Note:</strong> Some items may not be eligible for return due to hygiene reasons (e.g., personal care items, undergarments). Please check product descriptions for return eligibility.
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

export default ReturnsExchangesModal;
