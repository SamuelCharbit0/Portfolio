let countries = [];
let currentCountry = null;
let round = 1;
let score = 0;

async function fetchCountries() {
  const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags');
  countries = await response.json();
  startRound();
}

function startRound() {
  if (round > 10) {
    document.getElementById('game-over').classList.remove('hidden');
    document.getElementById('round-title').classList.add('hidden');
    document.getElementById('flag-image').classList.add('hidden');
    document.getElementById('options-grid').classList.add('hidden');
    document.getElementById('final-score').textContent = `Votre score : ${score} / 10`;
    removeFeedback();
    return;
  }

  document.getElementById('game-over').classList.add('hidden');
  document.getElementById('round-title').textContent = `Manche ${round} / 10`;
  document.getElementById('round-title').classList.remove('hidden');
  document.getElementById('flag-image').classList.remove('hidden');
  document.getElementById('options-grid').classList.remove('hidden');

  currentCountry = countries[Math.floor(Math.random() * countries.length)];
  document.getElementById('flag-image').src = currentCountry.flags.svg;

  const optionsSet = new Set([currentCountry]);
  while (optionsSet.size < 4) {
    optionsSet.add(countries[Math.floor(Math.random() * countries.length)]);
  }

  const shuffledOptions = Array.from(optionsSet).sort(() => Math.random() - 0.5);
  const optionsGrid = document.getElementById('options-grid');
  optionsGrid.innerHTML = '';

  shuffledOptions.forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option.name.common;
    btn.className = 'option-button';
    btn.onclick = () => handleAnswer(option.name.common, btn);
    optionsGrid.appendChild(btn);
  });

  removeFeedback();
}

function handleAnswer(answer, clickedButton) {
  // Désactive tous les boutons après un clic
  const buttons = document.querySelectorAll('.option-button');
  buttons.forEach(btn => btn.disabled = true);

  if (answer === currentCountry.name.common) {
    showFeedback('✅ Bonne réponse !');
    score++;
  } else {
    showFeedback(`❌ Mauvaise réponse. La bonne réponse était : ${currentCountry.name.common}`);
  }

  // Attendre 3 secondes avant de passer au tour suivant
  setTimeout(() => {
    round++;
    startRound();
  }, 3000);
}

function showFeedback(message) {
  removeFeedback();
  const feedback = document.createElement('p');
  feedback.id = 'feedback-text';
  feedback.textContent = message;
  feedback.style.marginTop = '1.5rem';
  feedback.style.fontSize = '1.2rem';
  feedback.style.fontWeight = 'bold';
  feedback.style.color = '#444';
  document.querySelector('.game-container').appendChild(feedback);
}

function removeFeedback() {
  const oldFeedback = document.getElementById('feedback-text');
  if (oldFeedback) {
    oldFeedback.remove();
  }
}

function restartGame() {
  score = 0;
  round = 1;
  startRound();
}

fetchCountries();