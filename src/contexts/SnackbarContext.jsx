import React, { createContext, useContext, useState } from 'react';

const SnackbarContext = createContext();

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });

    // Auto close after 4 seconds
    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, open: false }));
    }, 4000);
  };

  const hideSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}

      {/* Snackbar Modal */}
      <div
        className={`
          fixed top-5 right-5 z-[9999]
          px-6 py-3 rounded-lg shadow-lg text-white flex items-center
          transition-opacity duration-300 
          ${snackbar.open ? "opacity-100" : "opacity-0 pointer-events-none"}
          ${
            snackbar.severity === 'success' ? 'bg-green-600' :
            snackbar.severity === 'error' ? 'bg-red-600' :
            snackbar.severity === 'warning' ? 'bg-yellow-500' :
            'bg-blue-600'
          }
        `}
      >
        <span>{snackbar.message}</span>

        <button
          onClick={hideSnackbar}
          className="ml-4 text-white hover:text-gray-200"
        >
          ✕
        </button>
      </div>
    </SnackbarContext.Provider>
  );
};
