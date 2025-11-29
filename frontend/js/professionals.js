document.addEventListener('DOMContentLoaded', () => {
  App.initPage({ protectedPage: true, onReady: setupProfessionals });
});

let professionals = [];
let coords;

function setupProfessionals() {
  document.getElementById('detect-location')?.addEventListener('click', detectLocation);
  document.getElementById('professional-search')?.addEventListener(
    'input',
    App.debounce((e) => filterProfessionals(e.target.value), 300)
  );
  fetchProfessionals();
}

async function fetchProfessionals(query = '') {
  const suffix = query ? `/search?q=${encodeURIComponent(query)}` : coords ? `?lat=${coords.lat}&lng=${coords.lng}` : '';
  const res = await App.api(`/professionals${suffix}`, null, 'GET');
  professionals = res.professionals || res;
  renderProfessionals(professionals);
}

function renderProfessionals(list = []) {
  const container = document.getElementById('professional-list');
  if (!container) return;
  container.innerHTML = list
    .map(
      (pro) => `<article class="card">
        <div class="split">
          <div>
            <h3>${pro.name}</h3>
            <p>${pro.type} • ⭐ ${pro.rating}</p>
            <p>${pro.distanceKm ? `${pro.distanceKm} km away` : 'Local provider'}</p>
            <p>
              <a href="tel:${pro.contact?.phone}">Call</a> ·
              <a href="mailto:${pro.contact?.email}">Email</a> ·
              <a href="${pro.contact?.chatUrl}">Chat</a>
            </p>
          </div>
          <img src="/images/workout.png" alt="Professional" style="border-radius:16px;max-width:200px;width:100%;" />
        </div>
        <button data-rate="${pro.id}">Rate 5⭐</button>
      </article>`
    )
    .join('');

  container.querySelectorAll('[data-rate]').forEach((btn) =>
    btn.addEventListener('click', () => rateProfessional(btn.dataset.rate))
  );
}

async function rateProfessional(id) {
  await App.api('/professionals/rate', { id, rating: 5, text: 'Excellent coach!' });
  App.toast('Thanks for rating!');
  fetchProfessionals();
}

function detectLocation() {
  const status = document.getElementById('location-status');
  if (!navigator.geolocation) {
    coords = { lat: 37.7749, lng: -122.4194 };
    status.textContent = 'Using fallback coordinates';
    return fetchProfessionals();
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      status.textContent = `Lat ${coords.lat.toFixed(2)}, Lng ${coords.lng.toFixed(2)}`;
      fetchProfessionals();
    },
    () => {
      coords = { lat: 37.7749, lng: -122.4194 };
      status.textContent = 'Using mock coordinates';
      fetchProfessionals();
    }
  );
}

function filterProfessionals(term) {
  if (!term) return renderProfessionals(professionals);
  fetchProfessionals(term);
}
