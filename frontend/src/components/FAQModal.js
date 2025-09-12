import React, { useState } from 'react';

const FAQModal = ({ isOpen, onClose }) => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqs = [
    {
      question: "How do I place an order?",
      answer: "Simply browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or sign in to complete your purchase."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our encrypted payment gateway."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days within the country, and 7-14 business days for international orders. Express shipping options are available for faster delivery."
    },
    {
      question: "Can I track my order?",
      answer: "Yes! Once your order ships, you'll receive a tracking number via email. You can also track your order status in your account dashboard."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Items must be in original condition with tags attached. Please see our Returns & Exchanges section for full details."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach us via WhatsApp at +234 704 907 3197, email at dera.delis@gmail.com, or through our contact form. We typically respond within 24 hours."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination. Check out at checkout for specific rates to your location."
    },
    {
      question: "How do I update my account information?",
      answer: "Log into your account and go to 'Account Settings' to update your personal information, shipping addresses, and payment methods."
    },
    {
      question: "What if I receive a damaged item?",
      answer: "If you receive a damaged item, please contact us immediately with photos of the damage. We'll arrange for a replacement or full refund at no cost to you."
    },
    {
      question: "Do you have a mobile app?",
      answer: "Currently, we don't have a mobile app, but our website is fully responsive and optimized for mobile devices. You can bookmark our site for easy access."
    }
  ];

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full max-h-[80vh] overflow-y-auto">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Frequently Asked Questions
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
                <div className="mt-2">
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg">
                        <button
                          onClick={() => toggleItem(index)}
                          className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                        >
                          <span className="font-medium text-gray-900">{faq.question}</span>
                          <svg
                            className={`h-5 w-5 text-gray-500 transform transition-transform ${
                              openItems[index] ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {openItems[index] && (
                          <div className="px-4 pb-3">
                            <p className="text-sm text-gray-600">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
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

export default FAQModal;
