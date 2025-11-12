// src/components/BackgroundWrapper.jsx

import React from 'react';

/**
 * A reusable page wrapper that applies the app's dark gradient
 * and ensures it covers the full screen height.
 */
const BackgroundWrapper = ({ children}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {children}
    </div>
  );
};

export default BackgroundWrapper;