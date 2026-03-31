const config = {
  girlfriendName: "Her",
  photos: [],
  videos: []
};

const startPetals = () => {
  const layer = document.getElementById("petal-layer");
  if (!layer) return;

  setInterval(() => {
    const petal = document.createElement("span");
    petal.className = "petal";

    const left = Math.random() * 100;
    const duration = 5 + Math.random() * 6;
    const size = 8 + Math.random() * 12;

    petal.style.left = `${left}vw`;
    petal.style.animationDuration = `${duration}s`;
    petal.style.width = `${size}px`;
    petal.style.height = `${size * 1.2}px`;

    layer.appendChild(petal);
    setTimeout(() => petal.remove(), duration * 1000 + 1200);
  }, 280);
};

const startRoses = () => {
  const layer = document.getElementById("rose-layer");
  if (!layer) return;

  setInterval(() => {
    const rose = document.createElement("span");
    rose.className = "rose";

    const left = Math.random() * 100;
    const duration = 11 + Math.random() * 7;
    const size = 18 + Math.random() * 18;

    rose.style.left = `${left}vw`;
    rose.style.animationDuration = `${duration}s`;
    rose.style.width = `${size}px`;
    rose.style.height = `${size}px`;

    layer.appendChild(rose);
    setTimeout(() => rose.remove(), duration * 1000 + 600);
  }, 900);
};

const createConfettiBurst = (x = window.innerWidth / 2, y = window.innerHeight / 2) => {
  const count = 22;
  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${x}px`;
    piece.style.top = `${y}px`;
    piece.style.setProperty("--dx", `${(Math.random() - 0.5) * 240}px`);
    piece.style.setProperty("--dy", `${(Math.random() - 0.5) * 220}px`);
    piece.style.background = ["#ff4f86", "#6f61ff", "#f7c948", "#00c2ff"][Math.floor(Math.random() * 4)];
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 950);
  }
};

const initLandingPage = () => {
  const yesBtn = document.getElementById("yes-btn");
  const noBtn = document.getElementById("no-btn");
  const card = document.querySelector(".entry-card");
  if (!yesBtn || !noBtn || !card) return;

  const dodge = () => {
    const cardRect = card.getBoundingClientRect();
    const x = Math.random() * (cardRect.width - noBtn.offsetWidth - 24);
    const y = 8 + Math.random() * 20;
    noBtn.style.transform = `translate(${x - 70}px, ${y}px)`;
  };

  noBtn.addEventListener("mouseenter", dodge);
  noBtn.addEventListener("click", dodge);

  yesBtn.addEventListener("click", () => {
    createConfettiBurst(window.innerWidth / 2, window.innerHeight / 2);
    document.body.classList.add("go-next");
    setTimeout(() => {
      window.location.href = "surprise.html";
    }, 650);
  });
};

const initSurprisePage = () => {
  const actionBtn = document.getElementById("action-btn");
  const stepTitle = document.getElementById("step-title");
  const stepHint = document.getElementById("step-hint");
  const banner = document.getElementById("banner");
  const balloonZone = document.getElementById("balloon-zone");
  const cakeCard = document.getElementById("cake-card");

  if (!actionBtn || !stepTitle || !stepHint) return;

  let audioCtx;
  let musicTimer;
  let musicTimeout;

  const playPianoTone = (freq, duration = 0.42) => {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2200, now);

    const master = audioCtx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.linearRampToValueAtTime(0.05, now + 0.015);
    master.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    const osc1 = audioCtx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, now);

    const osc2 = audioCtx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 2, now);

    const overtoneGain = audioCtx.createGain();
    overtoneGain.gain.setValueAtTime(0.18, now);

    osc1.connect(filter);
    osc2.connect(overtoneGain);
    overtoneGain.connect(filter);
    filter.connect(master);
    master.connect(audioCtx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  };

  const happyBirthdaySequence = [
    { f: 392, d: 280 }, { f: 392, d: 280 }, { f: 440, d: 560 }, { f: 392, d: 560 }, { f: 523, d: 560 }, { f: 494, d: 1120 },
    { f: 392, d: 280 }, { f: 392, d: 280 }, { f: 440, d: 560 }, { f: 392, d: 560 }, { f: 587, d: 560 }, { f: 523, d: 1120 },
    { f: 392, d: 280 }, { f: 392, d: 280 }, { f: 784, d: 560 }, { f: 659, d: 560 }, { f: 523, d: 560 }, { f: 494, d: 560 }, { f: 440, d: 1120 },
    { f: 698, d: 280 }, { f: 698, d: 280 }, { f: 659, d: 560 }, { f: 523, d: 560 }, { f: 587, d: 560 }, { f: 523, d: 1200 }
  ];

  const startMusic = () => {
    if (!window.AudioContext && !window.webkitAudioContext) return;
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new Ctx();
    }

    const playStep = (i = 0) => {
      const n = happyBirthdaySequence[i % happyBirthdaySequence.length];
      playPianoTone(n.f, Math.max(0.2, n.d / 1000 * 0.85));

      const note = document.createElement("span");
      note.className = "music-note";
      note.style.left = `${16 + Math.random() * 68}%`;
      note.style.top = `${22 + Math.random() * 18}%`;
      note.textContent = Math.random() > 0.5 ? "*" : "o";
      document.body.appendChild(note);
      setTimeout(() => note.remove(), 1600);

      musicTimeout = setTimeout(() => playStep(i + 1), n.d);
    };

    playStep(0);
    musicTimer = 1;
  };

  const stopMusic = () => {
    clearInterval(musicTimer);
    clearTimeout(musicTimeout);
    musicTimer = null;
    musicTimeout = null;
  };

  const spawnBalloon = () => {
    const b = document.createElement("span");
    b.className = "balloon";
    b.style.left = `${6 + Math.random() * 88}%`;
    b.style.background = ["#ff5d8f", "#00c2ff", "#7a68ff", "#ffd166", "#5dd39e"][Math.floor(Math.random() * 5)];
    b.style.animationDuration = `${6 + Math.random() * 4}s`;
    balloonZone.appendChild(b);
    setTimeout(() => b.remove(), 11000);
  };

  const steps = [
    {
      button: "Lights On",
      title: "Ready to start the birthday setup?",
      hint: "Tap the top button and enjoy each step.",
      run: () => {
        document.body.classList.remove("dim");
        document.body.classList.add("bright");
        createConfettiBurst(window.innerWidth / 2, 120);
      }
    },
    {
      button: "Play Music",
      title: "Background tune is now on",
      hint: "A small melody to make the surprise lively.",
      run: () => startMusic()
    },
    {
      button: "Decorate",
      title: "Decorations are up",
      hint: "Party banner unlocked.",
      run: () => banner.classList.add("show")
    },
    {
      button: "Fly Balloons",
      title: "Balloons are flying",
      hint: "Tap anywhere for mini confetti burst.",
      run: () => {
        for (let i = 0; i < 14; i += 1) {
          setTimeout(spawnBalloon, i * 120);
        }
      }
    },
    {
      button: "Cut The Cake",
      title: "Cake is served",
      hint: "Tap the cake card for extra confetti.",
      run: () => {
        cakeCard.classList.add("show");
      }
    },
    {
      button: "Open Final Message",
      title: "Moving to final page",
      hint: "Opening separate message page.",
      run: () => {
        stopMusic();
        document.body.classList.add("go-next");
        setTimeout(() => {
          window.location.href = "message.html";
        }, 650);
      }
    }
  ];

  let stepIndex = -1;

  const goNext = () => {
    stepIndex += 1;

    if (stepIndex >= steps.length) {
      actionBtn.textContent = "Restart";
      stepTitle.textContent = "All set. Happy Birthday, Her";
      stepHint.textContent = "Tap restart to play the sequence again.";
      return;
    }

    const step = steps[stepIndex];
    step.run();
    stepTitle.textContent = step.title;
    stepHint.textContent = step.hint;

    if (stepIndex < steps.length - 1) {
      actionBtn.textContent = steps[stepIndex + 1].button;
    } else {
      actionBtn.textContent = "Done";
    }
  };

  actionBtn.addEventListener("click", () => {
    if (stepIndex >= steps.length) {
      stopMusic();
      window.location.reload();
      return;
    }
    goNext();
  });

  document.body.addEventListener("click", (event) => {
    if (stepIndex >= 3) {
      createConfettiBurst(event.clientX, event.clientY);
    }
  });

  cakeCard.addEventListener("click", () => {
    createConfettiBurst(window.innerWidth / 2, window.innerHeight / 2);
    const flame = document.querySelector(".flame");
    if (flame) flame.classList.add("off");
  });

};

const initMessagePage = () => {
  const playBtn = document.getElementById("play-joy");
  const backBtn = document.getElementById("back-party");
  if (!playBtn || !backBtn) return;

  let ctx;
  let timer;

  const pianoTone = (freq, duration = 0.4) => {
    if (!ctx) return;
    const now = ctx.currentTime;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2400, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    const base = ctx.createOscillator();
    base.type = "sine";
    base.frequency.setValueAtTime(freq, now);

    const overtone = ctx.createOscillator();
    overtone.type = "triangle";
    overtone.frequency.setValueAtTime(freq * 2, now);

    const overtoneGain = ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.2, now);

    base.connect(filter);
    overtone.connect(overtoneGain);
    overtoneGain.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    base.start(now);
    overtone.start(now);
    base.stop(now + duration);
    overtone.stop(now + duration);
  };

  playBtn.addEventListener("click", () => {
    if (!window.AudioContext && !window.webkitAudioContext) return;
    if (!ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      ctx = new Ctx();
    }
    clearTimeout(timer);
    const tune = [
      { f: 392, d: 280 }, { f: 392, d: 280 }, { f: 440, d: 560 }, { f: 392, d: 560 }, { f: 523, d: 560 }, { f: 494, d: 1120 },
      { f: 392, d: 280 }, { f: 392, d: 280 }, { f: 440, d: 560 }, { f: 392, d: 560 }, { f: 587, d: 560 }, { f: 523, d: 1120 },
      { f: 392, d: 280 }, { f: 392, d: 280 }, { f: 784, d: 560 }, { f: 659, d: 560 }, { f: 523, d: 560 }, { f: 494, d: 560 }, { f: 440, d: 1120 },
      { f: 698, d: 280 }, { f: 698, d: 280 }, { f: 659, d: 560 }, { f: 523, d: 560 }, { f: 587, d: 560 }, { f: 523, d: 1200 }
    ];
    const playTune = (i = 0) => {
      if (i >= tune.length) return;
      pianoTone(tune[i].f, Math.max(0.2, tune[i].d / 1000 * 0.85));
      timer = setTimeout(() => playTune(i + 1), tune[i].d);
    };
    playTune(0);
    createConfettiBurst(window.innerWidth / 2, 120);
  });

  backBtn.addEventListener("click", () => {
    window.location.href = "surprise.html";
  });
};

startPetals();
startRoses();

if (document.body.dataset.page === "landing") {
  initLandingPage();
}

if (document.body.dataset.page === "surprise") {
  initSurprisePage();
}

if (document.body.dataset.page === "message") {
  initMessagePage();
}
