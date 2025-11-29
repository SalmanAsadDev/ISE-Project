document.addEventListener('DOMContentLoaded', () => {
  App.initPage({ protectedPage: true, onReady: setupPlans });
});

let currentPlans;

function setupPlans() {
  currentPlans = { mealPlans: [], workoutPlans: [] };
  bindPlanActions();
  fetchPlans();
}

function bindPlanActions() {
  document.getElementById('generate-meal')?.addEventListener('click', async () => {
    const plan = await App.api('/plans/meal/auto', {});
    App.toast('Meal plan generated');
    currentPlans.mealPlans.push(plan);
    renderPlans();
  });

  document.getElementById('generate-workout')?.addEventListener('click', async () => {
    const plan = await App.api('/plans/workout/auto', {});
    App.toast('Workout plan ready');
    currentPlans.workoutPlans.push(plan);
    renderPlans();
  });

  document.getElementById('export-plans')?.addEventListener('click', async () => {
    const data = await App.api('/plans/export', {});
    App.downloadFile(data.filename, JSON.stringify(data.data, null, 2));
  });

  document.getElementById('import-plans')?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    await App.api('/plans/import', { data: JSON.parse(text) });
    App.toast('Plans imported');
    fetchPlans();
  });

  const search = document.getElementById('plan-search');
  if (search) {
    search.addEventListener(
      'input',
      App.debounce(async (e) => {
        const term = e.target.value;
        if (!term) return renderPlans();
        const res = await App.api(`/plans/search?q=${encodeURIComponent(term)}`, null, 'GET');
        renderPlans(res.results);
      }, 300)
    );
  }
}

async function fetchPlans() {
  const plans = await App.api('/plans', null, 'GET');
  currentPlans = plans;
  renderPlans();
}

function renderPlans(filtered) {
  const container = document.getElementById('plans-output');
  if (!container || !currentPlans) return;
  const mealPlans = filtered || currentPlans.mealPlans || [];
  const workoutPlans = filtered ? [] : currentPlans.workoutPlans || [];
  const sections = [];

  sections.push(
    `<div><h3>Meal Plans</h3>${mealPlans
      .map(
        (plan) => `<article class="card">
          <h4>${plan.goal}</h4>
          <p>${plan.days?.length || 0} day rotation</p>
          <small>${new Date(plan.createdAt).toLocaleDateString()}</small>
        </article>`
      )
      .join('') || '<p class="muted">No meal plans yet</p>'}</div>`
  );

  sections.push(
    `<div><h3>Workout Plans</h3>${workoutPlans
      .map(
        (plan) => `<article class="card">
          <h4>${plan.focus}</h4>
          <p>${plan.sessions?.length || 0} sessions</p>
          <small>${new Date(plan.createdAt).toLocaleDateString()}</small>
        </article>`
      )
      .join('') || '<p class="muted">No workouts yet</p>'}</div>`
  );

  container.innerHTML = `<div class="split">${sections.join('')}</div>`;
}
