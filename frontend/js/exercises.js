document.addEventListener('DOMContentLoaded', () => {
  App.initPage({ protectedPage: true, onReady: setupExercises });
});

const exercises = {
  arms: [
    {
      id: 'bicep-curl',
      name: 'Bicep Curl',
      muscle: 'arms',
      image: '/images/exercises/bicep-curl.jpg',
      instructions: [
        'Stand with feet shoulder-width apart, holding dumbbells at your sides with palms facing forward.',
        'Keep your elbows close to your torso and curl the weights while contracting your biceps.',
        'Raise the weights until your biceps are fully contracted and the dumbbells are at shoulder level.',
        'Hold the contracted position for a brief pause as you squeeze your biceps.',
        'Slowly lower the weights back to the starting position.',
        'Repeat for the desired number of repetitions.'
      ],
      tips: [
        'Keep your back straight and core engaged throughout the movement.',
        'Avoid swinging your body or using momentum to lift the weights.',
        'Control the weight on both the way up and down.'
      ],
      sets: '3-4 sets',
      reps: '8-12 reps'
    },
    {
      id: 'tricep-dip',
      name: 'Tricep Dip',
      muscle: 'arms',
      image: '/images/exercises/tricep-dip.jpg',
      instructions: [
        'Sit on the edge of a bench or chair with your hands gripping the edge, fingers pointing forward.',
        'Slide your body forward so your glutes are off the bench and your arms support your weight.',
        'Lower your body by bending your elbows until they form a 90-degree angle.',
        'Push yourself back up to the starting position using your triceps.',
        'Keep your legs extended or bent at 90 degrees for easier variation.',
        'Repeat for the desired number of repetitions.'
      ],
      tips: [
        'Keep your shoulders down and away from your ears.',
        'Don\'t let your elbows flare out to the sides.',
        'Lower yourself slowly and control the movement.'
      ],
      sets: '3 sets',
      reps: '8-15 reps'
    }
  ],
  legs: [
    {
      id: 'squat',
      name: 'Barbell Squat',
      muscle: 'legs',
      image: '/images/exercises/squat.jpg',
      instructions: [
        'Stand with feet shoulder-width apart, toes slightly pointed out.',
        'Place a barbell across your upper back (not on your neck), holding it with an overhand grip.',
        'Keep your chest up, core tight, and back straight.',
        'Lower your body by bending at the hips and knees as if sitting back into a chair.',
        'Descend until your thighs are parallel to the floor or lower.',
        'Drive through your heels to return to the starting position.',
        'Keep your knees tracking over your toes throughout the movement.'
      ],
      tips: [
        'Maintain a neutral spine throughout the entire movement.',
        'Don\'t let your knees cave inward.',
        'Keep your weight in your heels, not your toes.',
        'Breathe in on the way down, breathe out on the way up.'
      ],
      sets: '3-5 sets',
      reps: '6-12 reps'
    },
    {
      id: 'lunges',
      name: 'Walking Lunges',
      muscle: 'legs',
      image: '/images/exercises/lunges.jpg',
      instructions: [
        'Stand tall with feet hip-width apart, hands on hips or holding weights.',
        'Take a large step forward with your right leg, lowering your body until both knees are bent at 90 degrees.',
        'Your front knee should be directly above your ankle, and your back knee should hover just above the ground.',
        'Push off with your back foot and bring it forward to step into the next lunge.',
        'Alternate legs as you move forward.',
        'Keep your torso upright throughout the movement.'
      ],
      tips: [
        'Keep your front knee from extending past your toes.',
        'Maintain an upright posture - don\'t lean forward.',
        'Engage your core for stability.',
        'Take controlled steps, not rushed movements.'
      ],
      sets: '3 sets',
      reps: '10-15 reps per leg'
    }
  ],
  chest: [
    {
      id: 'bench-press',
      name: 'Bench Press',
      muscle: 'chest',
      image: '/images/exercises/bench-press.jpg',
      instructions: [
        'Lie flat on a bench with your feet firmly on the floor.',
        'Grip the barbell slightly wider than shoulder-width apart.',
        'Unrack the bar and hold it directly above your chest with arms extended.',
        'Lower the bar slowly to your chest, touching it lightly at nipple level.',
        'Press the bar back up explosively until your arms are fully extended.',
        'Keep your shoulder blades retracted and pressed into the bench.',
        'Repeat for the desired number of repetitions.'
      ],
      tips: [
        'Keep your wrists straight and aligned with your forearms.',
        'Don\'t bounce the bar off your chest.',
        'Maintain control throughout the entire movement.',
        'Have a spotter when lifting heavy weights.'
      ],
      sets: '3-5 sets',
      reps: '6-10 reps'
    },
    {
      id: 'push-ups',
      name: 'Push-Ups',
      muscle: 'chest',
      image: '/images/exercises/push-ups.jpg',
      instructions: [
        'Start in a plank position with hands placed slightly wider than shoulder-width apart.',
        'Your body should form a straight line from head to heels.',
        'Lower your body by bending your elbows until your chest nearly touches the floor.',
        'Keep your core engaged and don\'t let your hips sag or pike up.',
        'Push yourself back up to the starting position by extending your arms.',
        'Repeat for the desired number of repetitions.'
      ],
      tips: [
        'Keep your neck in a neutral position - don\'t look up or down.',
        'Breathe in as you lower, breathe out as you push up.',
        'For beginners, start with knee push-ups.',
        'For advanced, try decline push-ups with feet elevated.'
      ],
      sets: '3-4 sets',
      reps: '10-20 reps'
    }
  ],
  abs: [
    {
      id: 'crunches',
      name: 'Crunches',
      muscle: 'abs',
      image: '/images/exercises/crunches.jpg',
      instructions: [
        'Lie on your back with knees bent and feet flat on the floor, hip-width apart.',
        'Place your hands behind your head, or cross them over your chest.',
        'Engage your core and lift your upper body off the floor.',
        'Curl your shoulders toward your pelvis, keeping your lower back on the floor.',
        'Hold the contraction for a moment at the top.',
        'Slowly lower back down to the starting position.',
        'Repeat for the desired number of repetitions.'
      ],
      tips: [
        'Don\'t pull on your neck with your hands - use them for support only.',
        'Focus on lifting with your abs, not your neck.',
        'Exhale as you crunch up, inhale as you lower down.',
        'Keep your movements controlled and deliberate.'
      ],
      sets: '3 sets',
      reps: '15-25 reps'
    },
    {
      id: 'plank',
      name: 'Plank',
      muscle: 'abs',
      image: '/images/exercises/plank.jpg',
      instructions: [
        'Start in a push-up position with your arms extended and hands directly under your shoulders.',
        'Your body should form a straight line from head to heels.',
        'Engage your core, glutes, and leg muscles.',
        'Hold this position while maintaining proper form.',
        'Keep your head in a neutral position, looking at the floor.',
        'Breathe normally throughout the hold.'
      ],
      tips: [
        'Don\'t let your hips sag or raise too high - keep them level.',
        'Keep your shoulders directly over your wrists.',
        'Start with 20-30 seconds and gradually increase duration.',
        'For variation, try side planks or plank with leg lifts.'
      ],
      sets: '3 sets',
      reps: 'Hold for 30-60 seconds'
    }
  ],
  back: [
    {
      id: 'pull-ups',
      name: 'Pull-Ups',
      muscle: 'back',
      image: '/images/exercises/pull-ups.jpg',
      instructions: [
        'Hang from a pull-up bar with an overhand grip, hands slightly wider than shoulder-width.',
        'Your arms should be fully extended, and your body should hang straight.',
        'Pull your body up by engaging your back muscles until your chin clears the bar.',
        'Focus on pulling with your lats and squeezing your shoulder blades together.',
        'Lower yourself slowly and with control back to the starting position.',
        'Repeat for the desired number of repetitions.'
      ],
      tips: [
        'Avoid swinging or using momentum - use controlled movements.',
        'Keep your core engaged throughout the movement.',
        'For beginners, use an assisted pull-up machine or resistance bands.',
        'Full range of motion is key - go all the way up and all the way down.'
      ],
      sets: '3-4 sets',
      reps: '5-12 reps'
    },
    {
      id: 'bent-over-row',
      name: 'Bent-Over Row',
      muscle: 'back',
      image: '/images/exercises/bent-over-row.jpg',
      instructions: [
        'Stand with feet hip-width apart, holding a barbell or dumbbells with an overhand grip.',
        'Hinge at your hips and bend your knees slightly, keeping your back straight.',
        'Your torso should be nearly parallel to the floor.',
        'Pull the weight toward your lower chest/upper abdomen, squeezing your shoulder blades together.',
        'Keep your elbows close to your body as you pull.',
        'Lower the weight slowly back to the starting position.',
        'Repeat for the desired number of repetitions.'
      ],
      tips: [
        'Keep your back straight and core engaged throughout.',
        'Don\'t round your back - maintain a neutral spine.',
        'Pull the weight to your body, not away from it.',
        'Focus on using your back muscles, not just your arms.'
      ],
      sets: '3-4 sets',
      reps: '8-12 reps'
    }
  ]
};

function setupExercises() {
  renderExercises('all');
  
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const muscle = e.target.dataset.muscle;
      renderExercises(muscle);
    });
  });
}

function renderExercises(filter = 'all') {
  const container = document.getElementById('exercises-container');
  if (!container) return;

  let exercisesToShow = [];
  
  if (filter === 'all') {
    Object.values(exercises).forEach(muscleGroup => {
      exercisesToShow = exercisesToShow.concat(muscleGroup);
    });
  } else {
    exercisesToShow = exercises[filter] || [];
  }

  container.innerHTML = exercisesToShow.map(exercise => `
    <div class="card exercise-card">
      <div class="exercise-image-container">
        <img src="${exercise.image}" alt="${exercise.name}" 
             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22150%22%3E%3Crect fill=%22%23333%22 width=%22200%22 height=%22150%22/%3E%3Ctext fill=%22%23999%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3E${exercise.name}%3C/text%3E%3C/svg%3E'"
             style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; background: #333;" />
      </div>
      <h3>${exercise.name}</h3>
      <div class="exercise-meta">
        <span class="badge">${exercise.muscle}</span>
        <span class="badge">${exercise.sets}</span>
        <span class="badge">${exercise.reps}</span>
      </div>
      <div class="exercise-instructions">
        <h4>Instructions:</h4>
        <ol>
          ${exercise.instructions.map(step => `<li>${step}</li>`).join('')}
        </ol>
      </div>
      <div class="exercise-tips">
        <h4>Tips:</h4>
        <ul>
          ${exercise.tips.map(tip => `<li>${tip}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');
}

