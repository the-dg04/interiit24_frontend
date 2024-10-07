import React from 'react';

export const Alert = ({ children, variant = 'info' }) => (
  <div
    className={`p-4 rounded-md mb-4 ${
      variant === 'info'
        ? 'bg-blue-100 text-blue-800'
        : variant === 'success'
          ? 'bg-green-100 text-green-800'
          : variant === 'warning'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
    }`}
  >
    {children}
  </div>
);
export const AlertDescription = ({ children }) => (
  <div className="text-sm">{children}</div>
);

export const AlertTitle = ({ children }) => (
  <div className="font-bold text-base mb-2">{children}</div>
);
export const AlertDialog = ({ children, isOpen }) => (
  <div
  className={`fixed z-10 inset-0 overflow-y-auto ${
    isOpen ? 'block' : 'hidden'
  }`}>
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
        &#8203;
      </span> 
      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        {children}
      </div>
    </div>
  </div>
);

export const AlertDialogAction = ({ children, onClick }) => (
  <button
    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    onClick={onClick}
  >
    {children}
  </button>
);
