/* ===================== QUIZ DATA ===================== */
const questions = [
  {
    q: "În ce lună am vorbit prima dată?",
    hint: "",
    answers: ["Iunie", "Februarie", "Octombrie", "Mai"],
    correct: 1,
  },
  {
    q: "Cum am făcut cunoștință?",
    hint: "",
    answers: ["Instagram", "La școală", "Pe Davincik", "Prin prieteni"],
    correct: 2,
  },
  {
    q: "Pe ce dată am început să fim împreună?",
    hint: "",
    answers: ["10 septembrie", "13 aprilie", "1 iunie", "14 februarie"],
    correct: 1,
  },
  {
    q: "Persoana mea preferată?",
    hint: "",
    answers: ["Tu", "Prietenii", "Familia", "Eu 😄"],
    correct: 0,
  },
  {
    q: "În ce an ne-am cunoscut?",
    hint: "",
    answers: ["2021", "2022", "2023", "2024"],
    correct: 2,
  },
];

/* ===================== STATE (game variables) ===================== */
let idx = 0;            // which question we are on now (0..4)
let selected = null;    // selected answer index for current question
let score = 0;          // number of correct answers
let userAnswers = [];   // stores the exact text she chose for each question

const showVideoAfterIndex = 2; // show video after question #3 (index 2)
let videoShown = false;        // ensure it shows only once

let heartClicks = 0; // easter egg counter (click heart 3 times)

/* ===================== ELEMENTS: HOME ===================== */
const homeCard = document.getElementById("homeCard");
const startBtn = document.getElementById("startBtn");

/* ===================== ELEMENTS: QUIZ ===================== */
const gameCard = document.getElementById("gameCard");
const finalCard = document.getElementById("finalCard");

const progressBar = document.getElementById("progressBar");
const stepCounter = document.getElementById("stepCounter");
const questionEl = document.getElementById("question");
const hintEl = document.getElementById("hint");
const answersEl = document.getElementById("answers");
const feedbackEl = document.getElementById("feedback");
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");

/* ===================== ELEMENTS: FINAL FORM ===================== */
const scoreField = document.getElementById("scoreField");     // hidden input
const answersField = document.getElementById("answersField"); // hidden input (if exists)
const noBtn = document.getElementById("noBtn");

/* ===================== ELEMENTS: HEART FX ===================== */
const fxLayer = document.getElementById("fxLayer");

/* ===================== ELEMENTS: VIDEO INTERLUDE ===================== */
const videoCard = document.getElementById("videoCard");
const heartBtn = document.getElementById("heartBtn");
const videoWrap = document.getElementById("videoWrap");
const loveVideo = document.getElementById("loveVideo");
const continueBtn = document.getElementById("continueBtn");
const secretMsg = document.getElementById("secretMsg");

/* ===================== ELEMENTS: FORM SUBMIT ===================== */
const valentineForm = document.getElementById("valentineForm");
const sentMsg = document.getElementById("sentMsg");

/* ===================== ELEMENTS: GIFT ===================== */
const giftCard = document.getElementById("giftCard");
const giftBtn = document.getElementById("giftBtn");
const giftBox = document.getElementById("giftBox"); // exists but not used in photo version
const giftMsg = document.getElementById("giftMsg");

/* ===================== HEART FX FUNCTION ===================== */
function popHearts(count = 10) {
  if (!fxLayer) return;

  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "fx-heart";
    el.textContent = "❤️";

    const dx = (Math.random() * 240 - 120).toFixed(0) + "px";
    el.style.setProperty("--dx", dx);

    el.style.left = cx + "px";
    el.style.top = (cy + 80) + "px";

    fxLayer.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

/* ===================== RENDER CURRENT QUESTION ===================== */
function render() {
  const total = questions.length;
  const q = questions[idx];

  stepCounter.textContent = `Pas ${idx + 1}/${total}`;
  questionEl.textContent = q.q;
  hintEl.textContent = q.hint;

  const pct = Math.round((idx / total) * 100);
  progressBar.style.width = `${pct}%`;

  answersEl.innerHTML = "";
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";

  selected = null;
  nextBtn.disabled = true;

  q.answers.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.type = "button";
    btn.textContent = text;

    btn.addEventListener("click", () => {
      selected = i;
      userAnswers[idx] = q.answers[i];

      [...answersEl.children].forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      nextBtn.disabled = false;
    });

    answersEl.appendChild(btn);
  });

  backBtn.disabled = idx === 0;
}

/* ===================== QUIZ: NEXT / BACK ===================== */
function goNext() {
  const q = questions[idx];
  if (selected === null) return;

  if (selected === q.correct) {
    score++;
    popHearts(12);
    feedbackEl.textContent = "Corect ✅";
    feedbackEl.className = "feedback ok";
  } else {
    feedbackEl.textContent = `Aproape 😄 (corect: ${q.answers[q.correct]})`;
    feedbackEl.className = "feedback nope";
  }

  setTimeout(() => {
    // after question #3 -> show video interlude once
    if (idx === showVideoAfterIndex && !videoShown) {
      videoShown = true;
      openVideoInterlude();
      return;
    }

    idx++;
    if (idx >= questions.length) finish();
    else render();
  }, 650);
}

function goBack() {
  if (idx === 0) return;
  idx--;
  render();
}

/* ===================== FINISH QUIZ -> SHOW FINAL CARD ===================== */
function finish() {
  progressBar.style.width = "100%";
  gameCard.classList.add("hidden");
  finalCard.classList.remove("hidden");

  if (scoreField) scoreField.value = `${score}/${questions.length}`;
  if (answersField) answersField.value = userAnswers.join(" | ");
}

/* ===================== VIDEO INTERLUDE FUNCTIONS ===================== */
function openVideoInterlude() {
  if (!videoCard || !gameCard) {
    idx++;
    render();
    return;
  }

  gameCard.classList.add("hidden");
  videoCard.classList.remove("hidden");

  if (videoWrap) videoWrap.classList.add("hidden");
  if (continueBtn) continueBtn.classList.add("hidden");
}

if (heartBtn) {
  heartBtn.addEventListener("click", () => {
    // Easter egg: show secret message on 3rd click
    heartClicks++;
    if (heartClicks === 3 && secretMsg) {
      secretMsg.classList.remove("hidden");
      popHearts(22);
    }

    if (videoWrap) videoWrap.classList.remove("hidden");
    if (loveVideo) {
      loveVideo.muted = false;
      loveVideo.volume = 1;
      loveVideo.play().catch(() => {});
    }
    if (continueBtn) continueBtn.classList.remove("hidden");
  });
}

if (continueBtn) {
  continueBtn.addEventListener("click", () => {
    idx++; // continue with question #4
    if (videoCard) videoCard.classList.add("hidden");
    gameCard.classList.remove("hidden");
    render();
  });
}

/* ===================== FINAL: FUN "NO" BUTTON ===================== */
if (noBtn) {
  noBtn.addEventListener("click", () => {
    const phrases = [
      "Ești sigură? 😏",
      "Mai gândește-te 😄",
      "Nu merge așa 🙃",
      "Ok… atunci apasă DA 😌",
    ];
    const pick = phrases[Math.floor(Math.random() * phrases.length)];
    noBtn.textContent = pick;
  });
}

/* ===================== HOME START BUTTON ===================== */
if (startBtn) {
  startBtn.addEventListener("click", () => {
    if (homeCard) homeCard.classList.add("hidden");
    if (gameCard) gameCard.classList.remove("hidden");
    render();
  });
}

/* ===================== FORM SUBMIT (send email, stay on page) ===================== */
if (valentineForm) {
  valentineForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(valentineForm);

    try {
      const res = await fetch(valentineForm.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        if (sentMsg) sentMsg.classList.remove("hidden");
        const submitBtn = valentineForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        // show gift after accept
        if (giftCard) giftCard.classList.remove("hidden");
      } else {
        alert("Nu s-a trimis. Mai încearcă o dată.");
      }
    } catch (err) {
      alert("Eroare de internet. Mai încearcă o dată.");
    }
  });
}

/* ===================== GIFT OPEN (photo swap) ===================== */
const giftImg = document.getElementById("giftImg");
let giftOpened = false;

if (giftBtn) {
  giftBtn.addEventListener("click", () => {
    giftOpened = !giftOpened;

    if (giftImg) {
      giftImg.src = giftOpened ? "assets/gift-open.jpg" : "assets/gift-closed.jpg";
      giftImg.classList.remove("opened");
      void giftImg.offsetWidth; // restart animation
      giftImg.classList.add("opened");
    }

    if (giftMsg) giftMsg.classList.remove("hidden");
    popHearts(18);
  });
}

/* ===================== EVENT LISTENERS ===================== */
if (nextBtn) nextBtn.addEventListener("click", goNext);
if (backBtn) backBtn.addEventListener("click", goBack);
