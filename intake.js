/* ═══════════════════════════════════════════════════════════
   DEMS & NYCO — Intake Modal Logic
   intake.js
═══════════════════════════════════════════════════════════ */

const TOTAL_STEPS = 4;
let currentStep = 1;

/* ── Stap dots opbouwen ────────────────────────────────────── */
function buildDots() {
  const dots = document.getElementById('stepDots');
  dots.innerHTML = '';
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const d = document.createElement('div');
    d.className = 'step-dot'
      + (i === currentStep ? ' active' : '')
      + (i < currentStep  ? ' done'   : '');
    dots.appendChild(d);
  }
}

/* ── Progressbalk & knoppen updaten ───────────────────────── */
function updateProgress() {
  const pct = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;
  document.getElementById('progressFill').style.width = pct + '%';
  buildDots();

  const btnBack = document.getElementById('btnBack');
  const btnNext = document.getElementById('btnNext');

  btnBack.style.display = currentStep > 1 ? 'inline-flex' : 'none';
  btnNext.style.display = currentStep < TOTAL_STEPS ? 'flex' : 'none';
}

/* ── Stap tonen ────────────────────────────────────────────── */
function showStep(n) {
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  const target = document.querySelector(`.form-step[data-step="${n}"]`);
  if (target) target.classList.add('active');
  updateProgress();
  // scroll panel naar boven bij stapwisseling
  document.getElementById('modalPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Navigatie ─────────────────────────────────────────────── */
function nextStep() {
  if (currentStep < TOTAL_STEPS) {
    currentStep++;
    showStep(currentStep);
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  }
}

/* ── Modal openen ──────────────────────────────────────────── */
/**
 * @param {string} titel           - Naam van het traject voor de modal-header
 * @param {string} voorgeselecteerd - Waarde van de te selecteren dienst-pill
 */
function openIntake(titel, voorgeselecteerd) {
  // Reset stap en formulier
  currentStep = 1;
  document.getElementById('intakeForm').reset();
  document.getElementById('intakeForm').style.display = '';
  document.getElementById('modalNav').style.display = '';
  document.getElementById('modalSuccess').classList.remove('show');
  document.getElementById('progressFill').style.width = '0%';

  // Zet dynamische titel
  document.getElementById('modalTitle').textContent = titel;

  // Selecteer automatisch de juiste dienst-pill op basis van welke kaart is aangeklikt
  if (voorgeselecteerd) {
    const dienstRadios = document.querySelectorAll('input[name="dienst"]');
    dienstRadios.forEach(radio => {
      radio.checked = (radio.value === voorgeselecteerd);
    });
  }

  // Toon stap 1
  showStep(1);

  // Open overlay
  document.getElementById('intakeModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

/* ── Modal sluiten ─────────────────────────────────────────── */
function closeIntake() {
  document.getElementById('intakeModal').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Klik buiten de modal sluit hem ───────────────────────── */
function handleOverlayClick(e) {
  if (e.target === document.getElementById('intakeModal')) {
    closeIntake();
  }
}

/* ── Formulier verzenden ───────────────────────────────────── */
function submitForm(e) {
  e.preventDefault();
  document.getElementById('intakeForm').style.display = 'none';
  document.getElementById('modalNav').style.display  = 'none';
  document.getElementById('progressFill').style.width = '100%';
  document.getElementById('modalSuccess').classList.add('show');
}

/* ── Escape-toets sluit de modal ──────────────────────────── */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeIntake();
});

/* ── Initialiseer dots bij laden ──────────────────────────── */
buildDots();
