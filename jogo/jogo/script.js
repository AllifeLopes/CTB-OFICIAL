// ============================================================
// 10 QUESTÕES INICIAIS
// Troque, adicione ou remova questões neste array.
// answer: true = CERTO | false = ERRADO
// ============================================================
const questions = [
  {
    text: "O uso do cinto de segurança é obrigatório para todos os ocupantes do veículo.",
    answer: true,
    explanation: "O cinto de segurança deve ser utilizado pelo condutor e pelos passageiros."
  },
  {
    text: "É permitido dirigir utilizando o telefone celular na mão quando o veículo está em movimento.",
    answer: false,
    explanation: "Segurar ou manusear telefone celular enquanto dirige configura infração."
  },
  {
    text: "O condutor deve dar preferência ao pedestre que estiver atravessando na faixa.",
    answer: true,
    explanation: "A faixa de pedestres exige atenção e respeito à preferência do pedestre nas situações previstas pelas regras de trânsito."
  },
  {
    text: "A luz amarela do semáforo significa que o motorista deve acelerar para passar antes da luz vermelha.",
    answer: false,
    explanation: "A luz amarela indica atenção e mudança iminente para o vermelho, não uma ordem para acelerar."
  },
  {
    text: "Dirigir sob influência de álcool pode gerar penalidades previstas na legislação de trânsito.",
    answer: true,
    explanation: "A legislação brasileira prevê medidas e penalidades relacionadas à condução sob influência de álcool."
  },
  {
    text: "O capacete é equipamento obrigatório para condutor e passageiro de motocicleta.",
    answer: true,
    explanation: "Condutor e passageiro devem utilizar capacete de segurança nas condições previstas pela regulamentação."
  },
  {
    text: "Estacionar diante de uma guia rebaixada destinada à entrada ou saída de veículos é permitido por poucos minutos.",
    answer: false,
    explanation: "A curta duração da parada não transforma um local proibido para estacionamento em local permitido."
  },
  {
    text: "A placa de PARE determina que o condutor realize a parada antes de prosseguir com segurança.",
    answer: true,
    explanation: "A sinalização de PARE determina parada obrigatória."
  },
  {
    text: "O pisca-alerta pode ser usado normalmente enquanto o veículo está circulando apenas para chamar atenção.",
    answer: false,
    explanation: "O pisca-alerta possui situações específicas de utilização e não deve ser usado livremente durante a circulação."
  },
  {
    text: "Antes de mudar de faixa, o motorista deve sinalizar sua intenção e verificar se a manobra pode ser feita com segurança.",
    answer: true,
    explanation: "A mudança de faixa exige sinalização prévia e verificação das condições de segurança."
  }
];


// ============================================================
// SISTEMA DE PONTOS E PATENTES
// Cada resposta correta vale 10 pontos.
// 100 pontos = LENDA.
// ============================================================
const ranks = [
  { min: 0,   name: "RECRUTA",     icon: "🪖" },
  { min: 20,  name: "SOLDADO",     icon: "🎖️" },
  { min: 30,  name: "CABO",        icon: "🎖️" },
  { min: 40,  name: "SARGENTO",    icon: "⭐" },
  { min: 50,  name: "SUBTENENTE",  icon: "⭐" },
  { min: 60,  name: "ASPIRANTE",   icon: "🏅" },
  { min: 70,  name: "TENENTE",     icon: "🏅" },
  { min: 80,  name: "CAPITÃO",     icon: "🔥" },
  { min: 90,  name: "COMANDANTE",  icon: "👑" },
  { min: 100, name: "LENDA",       icon: "🏆" }
];

function getRank(score) {
  let currentRank = ranks[0];
  for (const rank of ranks) {
    if (score >= rank.min) currentRank = rank;
  }
  return currentRank;
}

function updateRankHUD() {
  const score = points * 10;
  const rank = getRank(score);

  const scoreHud = document.getElementById("rankScore");
  const rankHud = document.getElementById("rankName");
  const bar = document.getElementById("rankProgress");

  if (scoreHud) scoreHud.textContent = score;
  if (rankHud) rankHud.textContent = `${rank.icon} ${rank.name}`;
  if (bar) bar.style.width = `${Math.min(score, 100)}%`;

  // Salva a melhor pontuação deste jogador neste navegador.
  const player = sessionStorage.getItem("ctb_usuario") || "Jogador";
  const key = "ctb_recorde_" + player;
  const best = Number(localStorage.getItem(key) || 0);
  if (score > best) localStorage.setItem(key, String(score));

  const bestEl = document.getElementById("bestScore");
  if (bestEl) bestEl.textContent = Math.max(score, best);
}

let current = 0;
let points = 0;
let answered = false;

const questionEl = document.getElementById("question");
const progressEl = document.getElementById("progress");
const buttonsEl = document.getElementById("answerButtons");
const feedbackEl = document.getElementById("feedback");
const feedbackStatusEl = document.getElementById("feedbackStatus");
const explanationEl = document.getElementById("explanation");
const nextBtn = document.getElementById("nextBtn");
const resultEl = document.getElementById("result");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

function loadQuestion() {
  answered = false;
  const q = questions[current];

  progressEl.textContent = `QUESTÃO ${current + 1} DE ${questions.length}`;
  questionEl.textContent = q.text;

  buttonsEl.classList.remove("hidden");
  feedbackEl.className = "feedback hidden";
  resultEl.classList.add("hidden");
}

function answer(value) {
  if (answered) return;
  answered = true;

  const q = questions[current];
  const isCorrect = value === q.answer;

  if (isCorrect) {
    points++;
    updateRankHUD();
  }

  buttonsEl.classList.add("hidden");
  feedbackEl.classList.remove("hidden");

  if (isCorrect) {
    feedbackEl.classList.add("success");
    feedbackStatusEl.textContent = "✓ RESPOSTA CORRETA!";
  } else {
    feedbackEl.classList.add("error");
    feedbackStatusEl.textContent = "✕ RESPOSTA ERRADA!";
  }

  explanationEl.textContent = q.explanation;
  nextBtn.textContent =
    current === questions.length - 1 ? "VER RESULTADO ▶" : "PRÓXIMA QUESTÃO ▶";
}

function nextQuestion() {
  current++;

  if (current >= questions.length) {
    showResult();
    return;
  }

  loadQuestion();
}

function showResult() {
  progressEl.textContent = "RESULTADO";
  questionEl.textContent = "Você concluiu as 10 questões!";
  buttonsEl.classList.add("hidden");
  feedbackEl.classList.add("hidden");
  resultEl.classList.remove("hidden");

  const percent = Math.round((points / questions.length) * 100);
  const finalPoints = points * 10;
  const finalRank = getRank(finalPoints);
  scoreEl.innerHTML = `${points} / ${questions.length} — ${percent}%<br>${finalPoints} PONTOS<br>${finalRank.icon} ${finalRank.name}`;
  updateRankHUD();
}

function restart() {
  current = 0;
  points = 0;
  updateRankHUD();
  loadQuestion();
}

document.querySelectorAll(".answer-btn").forEach(button => {
  button.addEventListener("click", () => {
    answer(button.dataset.answer === "true");
  });
});

nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", restart);

loadQuestion();


// LOGIN / SESSÃO
const playerNameEl = document.getElementById("playerName");
const logoutBtn = document.getElementById("logoutBtn");

if (playerNameEl) {
  playerNameEl.textContent = sessionStorage.getItem("ctb_usuario") || "Jogador";
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("ctb_logado");
    sessionStorage.removeItem("ctb_usuario");
    window.location.href = "../index.html";
  });
}
