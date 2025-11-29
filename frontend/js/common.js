const App = {
  token: localStorage.getItem('token'),
  user: null,
  async initPage({ protectedPage = false, adminOnly = false, onReady } = {}) {
    this.cacheGlobals();
    this.bindGlobalActions();
    this.loadTheme();
    this.registerServiceWorker();

    if (!this.token && protectedPage) {
      return this.redirectHome();
    }

    if (this.token) {
      try {
        const res = await this.api('/auth/verify', null, 'GET', true);
        this.user = res.user;
        this.renderUserChip();
        if (adminOnly && this.user.role !== 'admin') {
          return this.redirectHome();
        }
      } catch (err) {
        console.error(err);
        this.signOut();
        if (protectedPage) return;
      }
    }

    if (typeof onReady === 'function') {
      onReady();
    }
  },

  cacheGlobals() {
    this.$year = document.getElementById('year');
    if (this.$year) this.$year.textContent = new Date().getFullYear();
  },

  bindGlobalActions() {
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) =>
      btn.addEventListener('click', () => this.toggleTheme())
    );

    document.querySelectorAll('[data-lang-select]').forEach((select) =>
      select.addEventListener('change', (e) => {
        document.documentElement.lang = e.target.value;
        this.toast(`Language set to ${e.target.value}`);
      })
    );

    document.querySelectorAll('[data-signout]').forEach((btn) =>
      btn.addEventListener('click', () => this.signOut())
    );
  },

  renderUserChip() {
    const chip = document.querySelector('[data-user-chip]');
    if (chip && this.user) {
      chip.innerHTML = `<span class="badge">${this.user.role}</span>${this.user.email}`;
    }
  },

  setSession(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('token', token);
    this.renderUserChip();
  },

  redirectHome() {
    window.location.href = '/';
  },

  signOut() {
    localStorage.removeItem('token');
    this.token = null;
    this.user = null;
    this.redirectHome();
  },

  async api(path, body = null, method = 'POST', authRequired = true) {
    const options = { method, headers: { 'Content-Type': 'application/json' } };
    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }
    if (authRequired && this.token) {
      options.headers.Authorization = `Bearer ${this.token}`;
    }
    const res = await fetch(`/api${path}`, options);
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }
    return res.status === 204 ? {} : res.json();
  },

  toast(message) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  },

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  },

  triggerNotification(title, body) {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then((reg) => {
        reg.active?.postMessage({ type: 'notify', title, body });
      });
    } else {
      Notification.requestPermission();
    }
  },

  loadTheme() {
    const stored = localStorage.getItem('theme') || 'dark';
    document.body.className = stored;
  },

  toggleTheme() {
    const next = document.body.classList.contains('dark') ? 'light' : 'dark';
    document.body.className = next;
    localStorage.setItem('theme', next);
  },

  formValues(form) {
    const data = new FormData(form);
    return Object.fromEntries(data.entries());
  },

  fillForm(target, data = {}) {
    const form = typeof target === 'string' ? document.getElementById(target) : target;
    if (!form) return;
    Object.entries(data).forEach(([key, value]) => {
      if (form.elements[key]) form.elements[key].value = value;
    });
  },

  downloadFile(filename, text) {
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  },

  debounce(fn, delay = 300) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), delay);
    };
  },
};

window.App = App;
