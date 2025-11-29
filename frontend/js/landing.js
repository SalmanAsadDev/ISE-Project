document.addEventListener('DOMContentLoaded', () => {
  App.initPage({ onReady: initLanding });
});

function initLanding() {
  const registerForm = document.getElementById('register-form');
  const loginForm = document.getElementById('login-form');

  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const res = await App.api('/auth/register', App.formValues(registerForm), 'POST', false);
      App.setSession(res.token, res.user);
      App.toast('Welcome! Profile created.');
      window.location.href = '/pages/dashboard.html';
    } catch (err) {
      App.toast('Registration failed');
      console.error(err);
    }
  });

  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const res = await App.api('/auth/login', App.formValues(loginForm), 'POST', false);
      App.setSession(res.token, res.user);
      App.toast('Signed in successfully');
      window.location.href = '/pages/dashboard.html';
    } catch (err) {
      App.toast('Invalid credentials');
    }
  });
}
