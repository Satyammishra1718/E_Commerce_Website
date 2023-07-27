// session-timeout.js

// Function to redirect the user to the login page with a message
function redirectToLogin() {
    window.location.href = '/session-expired';
  }
  
  // Set the session timeout in milliseconds (10 minutes = 600000 ms)
  const sessionTimeout = 3000;  
  let sessionTimer;
  
  // Function to reset the session timer
  function resetSessionTimer() {
    clearTimeout(sessionTimer);
    sessionTimer = setTimeout(redirectToLogin, sessionTimeout);
  }
  
  // Event listeners to reset the timer on user activity
  document.addEventListener('mousemove', resetSessionTimer);
  document.addEventListener('keypress', resetSessionTimer);
  
  // Start the initial session timer
  resetSessionTimer();
  