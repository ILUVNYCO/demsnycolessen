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

/* ── Formulier verzenden via Formspree ─────────────────────── */
async function submitForm(e) {
  e.preventDefault();

  const form = document.getElementById('intakeForm');
  const btnSubmit = form.querySelector('.btn-submit');

  // Laadstatus tonen
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
      stroke-linecap="round" stroke-linejoin="round" style="animation:spin .8s linear infinite">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
    Versturen...
  `;

  try {
    const response = await fetch('https://formspree.io/f/mvzljqzb', {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      // Succes — toon bevestigingscherm
      form.style.display = 'none';
      document.getElementById('modalNav').style.display = 'none';
      document.getElementById('progressFill').style.width = '100%';
      document.getElementById('modalSuccess').classList.add('show');
    } else {
      // Server fout
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
        Probeer opnieuw
      `;
      alert('Er ging iets mis. Probeer het opnieuw of mail ons direct op info@demsnyco.com');
    }
  } catch (err) {
    // Netwerkfout
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
      Probeer opnieuw
    `;
    alert('Geen internetverbinding. Controleer je verbinding en probeer opnieuw.');
  }
}

/* ── Escape-toets sluit de modal ──────────────────────────── */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeIntake();
});

/* ── Initialiseer dots bij laden ──────────────────────────── */
buildDots();