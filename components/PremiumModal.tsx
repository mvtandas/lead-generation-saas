import React from 'react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: 'CREDITS' | 'LEAD_LIMIT' | 'EXPORT_LIMIT';
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, reason }) => {
  if (!isOpen) return null;

  const content = {
    CREDITS: {
      title: 'Out of Credits',
      description: "You've used all your credits for this month. Upgrade to a Pro plan to get more credits and continue generating leads."
    },
    LEAD_LIMIT: {
      title: 'Lead List Limit Reached',
      description: 'Your "My Leads" list is full. The free plan allows up to 25 leads. Upgrade to Pro for unlimited leads.'
    },
    EXPORT_LIMIT: {
      title: 'Export Limit Reached',
      description: 'The free plan allows exporting up to 10 leads at a time. Upgrade to Pro for unlimited exports.'
    }
  }

  const { title, description } = content[reason];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
               <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
               </svg>
            </div>
            <h3 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
                {description}
            </p>
        </div>
        <div className="mt-6 flex flex-col space-y-3">
          <button className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Upgrade to Pro
          </button>
          <button onClick={onClose} className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;