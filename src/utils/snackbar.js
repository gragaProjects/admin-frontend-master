// Create a container for snackbars if it doesn't exist
let snackbarContainer = document.getElementById('snackbar-container');
if (!snackbarContainer) {
  snackbarContainer = document.createElement('div');
  snackbarContainer.id = 'snackbar-container';
  snackbarContainer.className = 'fixed bottom-4 right-4 z-50 space-y-2';
  document.body.appendChild(snackbarContainer);
}

export const showSnackbar = (message, type = 'info') => {
  // Create snackbar element
  const snackbar = document.createElement('div');
  snackbar.className = `px-4 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 translate-y-0 opacity-100 ${
    type === 'success' ? 'bg-green-500' :
    type === 'error' ? 'bg-red-500' :
    type === 'warning' ? 'bg-yellow-500' :
    'bg-blue-500'
  }`;

  // Add message
  snackbar.textContent = message;

  // Add to container
  snackbarContainer.appendChild(snackbar);

  // Trigger reflow
  snackbar.offsetHeight;

  // Remove after 3 seconds
  setTimeout(() => {
    snackbar.style.transform = 'translateY(100%)';
    snackbar.style.opacity = '0';
    setTimeout(() => {
      snackbarContainer.removeChild(snackbar);
    }, 300);
  }, 3000);
}; 