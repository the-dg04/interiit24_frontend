import React from 'react';

export const Card = ({ children }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    {children}
  </div>
);

export const CardHeader = ({ children }) => (
  <h3 className="text-xl font-bold mb-4">{children}</h3>
);

export const CardContent = ({ children }) => (
  <div>{children}</div>
);
