document.addEventListener('DOMContentLoaded', () => {
  App.initPage({ protectedPage: true, adminOnly: true, onReady: setupAdmin });
});

function setupAdmin() {
  document.getElementById('add-professional-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = App.formValues(e.target);
    await App.api('/admin/professionals', {
      name: form.name,
      type: form.type,
      lat: Number(form.lat),
      lng: Number(form.lng),
      rating: 5,
      reviews: [],
      contact: { phone: form.phone, email: form.email, chatUrl: '/pages/chat.html' },
    });
    App.toast('Professional added');
    e.target.reset();
    loadAdminData();
  });

  loadAdminData();
}

async function loadAdminData() {
  const [usersRes, professionals, logs] = await Promise.all([
    App.api('/admin/users', null, 'GET'),
    App.api('/admin/professionals', null, 'GET'),
    App.api('/admin/analytics', null, 'GET'),
  ]);

  const usersList = document.getElementById('admin-users');
  usersList.innerHTML = usersRes.users
    .map(
      (user) => `<li>
        <span>${user.email}</span>
        <select data-status="${user.email}">
          <option value="active" ${user.status === 'active' ? 'selected' : ''}>Active</option>
          <option value="suspended" ${user.status === 'suspended' ? 'selected' : ''}>Suspended</option>
        </select>
      </li>`
    )
    .join('');

  document.querySelectorAll('[data-status]').forEach((select) =>
    select.addEventListener('change', (e) => updateUserStatus(e.target.dataset.status, e.target.value))
  );

  const prosList = document.getElementById('admin-professionals');
  prosList.innerHTML = professionals
    .map(
      (pro) => `<li>
        <span>${pro.name}</span>
        <button data-remove="${pro.id}">Remove</button>
      </li>`
    )
    .join('');

  prosList.querySelectorAll('[data-remove]').forEach((btn) =>
    btn.addEventListener('click', () => removeProfessional(btn.dataset.remove))
  );

  const logList = document.getElementById('admin-logs');
  logList.innerHTML = logs.events.slice(-15).map((log) => `<li>${log.route || log.message} — ${log.timestamp}</li>`).join('');
}

async function updateUserStatus(email, status) {
  await App.api('/admin/users/status', { email, status });
  App.toast(`Updated ${email}`);
}

async function removeProfessional(id) {
  await App.api(`/admin/professionals/${id}`, null, 'DELETE');
  App.toast('Professional removed');
  loadAdminData();
}
