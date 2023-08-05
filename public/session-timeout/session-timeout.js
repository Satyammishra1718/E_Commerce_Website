
function redirectToLogin() {
    window.location.href = '/session-expired';
  }
  
  const sessionTimeout = 600*1000;  
  let sessionTimer;
  
  function resetSessionTimer() {
    clearTimeout(sessionTimer);
    sessionTimer = setTimeout(redirectToLogin, sessionTimeout);
  }
 
  document.addEventListener('mousemove', resetSessionTimer);
  document.addEventListener('keypress', resetSessionTimer);
  
  resetSessionTimer();
  