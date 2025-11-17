// Utility script to clear localStorage and force fresh login
// Run this in browser console: copy and paste the clearAndReload() function

function clearAndReload() {
  console.log('🧹 Clearing localStorage...');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('✅ Storage cleared!');
  console.log('🔄 Redirecting to login...');
  window.location.href = '/login';
}

console.log('📋 To clear storage and login fresh, run: clearAndReload()');
