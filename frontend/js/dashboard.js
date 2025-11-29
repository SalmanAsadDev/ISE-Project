let progressChart;

document.addEventListener('DOMContentLoaded', () => {
  App.initPage({ protectedPage: true, onReady: setupDashboard });
});

async function setupDashboard() {
  bindDashboardForms();
  hydrateDashboard();
}

function bindDashboardForms() {
  document.getElementById('profile-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await App.api('/profile', App.formValues(e.target), 'PUT');
    App.toast('Profile updated');
  });

  document.getElementById('goals-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await App.api('/profile/goals', App.formValues(e.target), 'PUT');
    App.toast('Goals saved');
  });

  document.getElementById('diet-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await App.api('/profile/diet', App.formValues(e.target));
    renderDiet(res.diet);
    e.target.reset();
  });

  document.getElementById('progress-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await App.api('/profile/progress', App.formValues(e.target));
    renderProgress(res.progress);
    e.target.reset();
  });

  document.getElementById('appointment-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await App.api('/profile/appointments', App.formValues(e.target));
    renderAppointments(res.appointments);
    e.target.reset();
  });

  document.getElementById('reminder-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await App.api('/profile/reminders', App.formValues(e.target));
    App.triggerNotification('Reminder saved', 'We will nudge you at the selected time.');
    renderReminders(res.reminders);
    e.target.reset();
  });

  document.getElementById('feedback-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await App.api('/profile/feedback', App.formValues(e.target));
    App.toast('Feedback submitted – thank you!');
    e.target.reset();
  });

  document.getElementById('delete-data')?.addEventListener('click', async () => {
    if (confirm('This removes your local data. Continue?')) {
      await App.api('/profile/data', {}, 'DELETE');
      App.toast('All entries cleared');
      hydrateDashboard();
    }
  });
}

async function hydrateDashboard() {
  const data = await App.api('/profile', null, 'GET');
  App.user = { ...App.user, ...data };
  App.fillForm('profile-form', data.profile || {});
  App.fillForm('goals-form', data.goals || {});
  renderDiet(data.diet || []);
  renderAppointments(data.appointments || []);
  renderReminders(data.reminders || []);
  renderProgress(data.progress || []);
  loadAnalytics();
}

function renderDiet(entries = []) {
  const list = document.getElementById('diet-list');
  if (!list) return;
  list.innerHTML = entries
    .slice(-10)
    .map((item) => `<li><strong>${item.meal}</strong> • ${item.calories} kcal <span class="badge">${new Date(item.date).toLocaleDateString()}</span></li>`)
    .join('');
}

function renderAppointments(items = []) {
  const list = document.getElementById('appointment-list');
  if (!list) return;
  list.innerHTML = items
    .map((item) => `<li>${item.title} • ${new Date(item.datetime).toLocaleString()} @ ${item.location || 'TBD'}</li>`)
    .join('');
}

function renderReminders(items = []) {
  const list = document.getElementById('reminder-list');
  if (!list) return;
  list.innerHTML = items
    .map((rem) => `<li>${rem.message} • ${rem.time}</li>`)
    .join('');
}

function renderProgress(entries = []) {
  const ctx = document.getElementById('progress-chart');
  if (!ctx) return;
  const labels = entries.map((item) => new Date(item.date).toLocaleDateString());
  const weights = entries.map((item) => item.weight);
  if (progressChart) progressChart.destroy();
  progressChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Weight (kg)',
          data: weights,
          borderColor: '#38bdf8',
          fill: false,
        },
      ],
    },
  });
}

async function loadAnalytics() {
  const res = await App.api('/profile/analytics', null, 'GET');
  const list = document.getElementById('analytics-list');
  if (!list) return;
  list.innerHTML = res.analytics.map((item) => `<li>${item.type} • ${item.label}</li>`).join('');
}
