/* ═══════════════════════════════════════════════════════════
   KAIO BIRTHDAY — main.js
   ═══════════════════════════════════════════════════════════ */

/* ── CONFIG — edit these to personalise ──────────────────── */
const CONFIG = {
  name: "Kaio",

  message: `Happy Birthday, Kaio! 🎉

Today, we celebrate you — your energy, your spirit, and everything that makes you who you are.

You've got something special about you, and everyone around you feels it. Here's to another incredible year filled with laughter, success, and moments worth remembering.

Keep being exactly who you are. The world is better with you in it.

Happy Birthday! 🥂 This one's for you. 🥂`,

  photos: [
    {
      src: "images/photo1.jpg",
      caption: "📸 Kaio — always in the moment"
    },
    {
      src: "images/photo2.jpg",
      caption: "✨ Beautiful moments, forever remembered"
    }
  ],

  musicSrc: "music/birthday.mp3"
};

/* ══════════════════════════════════════════════════════════ */

let musicStarted = false;

/* ── DOM READY ───────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  initSparkles();
  initGallery();
  initScrollReveal();
  initClickEffects();
  initMessage();
  initFireworksObserver();

  // Try autoplay
  const audio = document.getElementById("bg-music");
  audio.volume = 0;

  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        fadeInMusic();
        musicStarted = true;
        updatePlayBtn(true);
      })
      .catch(() => {
        // Autoplay blocked — music starts on first interaction
      });
  }
});


/* ── MUSIC ───────────────────────────────────────────────── */
function fadeInMusic() {
  const audio = document.getElementById("bg-music");
  const vol =
    parseFloat(document.getElementById("volume-slider").value) / 100;

  audio.volume = 0;

  let v = 0;

  const step = () => {
    v = Math.min(v + 0.02, vol);
    audio.volume = v;

    if (v < vol) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}


function startMusicOnInteraction() {
  if (musicStarted) return;

  musicStarted = true;

  const audio = document.getElementById("bg-music");

  audio.play()
    .then(() => {
      fadeInMusic();
      updatePlayBtn(true);
    })
    .catch(() => {});
}


function updatePlayBtn(playing) {
  const btn = document.getElementById("play-pause-btn");

  btn.innerHTML = playing
    ? `<svg viewBox="0 0 24 24">
         <rect x="6" y="4" width="4" height="16"/>
         <rect x="14" y="4" width="4" height="16"/>
       </svg>`
    : `<svg viewBox="0 0 24 24">
         <polygon points="5,3 19,12 5,21"/>
       </svg>`;
}


window.togglePlayPause = function () {
  const audio = document.getElementById("bg-music");

  if (audio.paused) {
    audio.play();
    updatePlayBtn(true);
  } else {
    audio.pause();
    updatePlayBtn(false);
  }
};


window.setVolume = function (val) {
  const audio = document.getElementById("bg-music");
  audio.volume = val / 100;
};


/* ── WELCOME SCREEN ──────────────────────────────────────── */
window.openSurprise = function () {
  startMusicOnInteraction();

  const welcome = document.getElementById("welcome-screen");
  const main = document.getElementById("main-content");
  const player = document.getElementById("music-player");

  welcome.classList.add("hidden");

  setTimeout(() => {
    main.classList.add("visible");
    player.classList.add("visible");

    // Fire celebration on entry
    setTimeout(() => launchCelebration(), 800);
  }, 500);
};


// Also start music on any tap of welcome screen
document
  .getElementById("welcome-screen")
  ?.addEventListener("click", startMusicOnInteraction);


/* ── PARTICLE BACKGROUND ─────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");

  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();

  window.addEventListener("resize", () => {
    resize();
  });


  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(init = false) {
      this.x = Math.random() * canvas.width;
      this.y = init
        ? Math.random() * canvas.height
        : canvas.height + 10;

      this.type =
        Math.random() < 0.3
          ? "balloon"
          : Math.random() < 0.5
          ? "star"
          : "firefly";

      this.size =
        this.type === "balloon"
          ? 10 + Math.random() * 14
          : 1.5 + Math.random() * 3;

      this.speedY = -(0.3 + Math.random() * 0.8);
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.alpha = 0.3 + Math.random() * 0.6;

      // gold or blue
      this.hue = Math.random() < 0.5 ? 45 : 220;

      this.phase = Math.random() * Math.PI * 2;
      this.wobble = 0.3 + Math.random() * 0.7;
    }

    update(t) {
      this.y += this.speedY;

      this.x +=
        this.speedX +
        Math.sin(t * 0.001 + this.phase) * this.wobble;

      if (this.y < -30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;

      if (this.type === "balloon") {

        // Balloon shape
        ctx.beginPath();

        ctx.ellipse(
          this.x,
          this.y,
          this.size * 0.7,
          this.size,
          0,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          this.hue === 45
            ? "rgba(212,175,55,0.7)"
            : "rgba(45,95,204,0.7)";

        ctx.fill();

        ctx.beginPath();

        ctx.moveTo(
          this.x,
          this.y + this.size
        );

        ctx.lineTo(
          this.x,
          this.y + this.size + 12
        );

        ctx.strokeStyle =
          this.hue === 45
            ? "rgba(212,175,55,0.4)"
            : "rgba(45,95,204,0.4)";

        ctx.lineWidth = 1;
        ctx.stroke();

      } else if (this.type === "star") {

        // Star sparkle
        ctx.fillStyle =
          `hsla(${this.hue}, 90%, 75%, 1)`;

        ctx.beginPath();

        ctx.arc(
          this.x,
          this.y,
          this.size,
          0,
          Math.PI * 2
        );

        ctx.fill();

        ctx.shadowBlur = 8;
        ctx.shadowColor =
          `hsla(${this.hue}, 90%, 75%, 0.8)`;

        ctx.fill();

      } else {

        // Firefly
        const pulse =
          0.5 +
          0.5 *
          Math.sin(
            Date.now() * 0.003 +
            this.phase
          );

        ctx.beginPath();

        ctx.arc(
          this.x,
          this.y,
          this.size * pulse,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          `rgba(212,175,55,${0.4 * pulse})`;

        ctx.shadowBlur = 12;
        ctx.shadowColor =
          "rgba(212,175,55,0.6)";

        ctx.fill();
      }

      ctx.restore();
    }
  }


  for (let i = 0; i < 80; i++) {
    particles.push(new Particle());
  }


  let t = 0;

  function animate() {
    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    t++;

    particles.forEach((p) => {
      p.update(t);
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}


/* ── SPARKLES ON WELCOME ─────────────────────────────────── */
function initSparkles() {
  const welcome =
    document.getElementById("welcome-screen");

  const symbols = [
    "✨",
    "⭐",
    "🌟",
    "💫",
    "⚡"
  ];

  for (let i = 0; i < 12; i++) {
    const s = document.createElement("div");

    s.className = "sparkle";

    s.textContent =
      symbols[i % symbols.length];

    s.style.left =
      `${5 + Math.random() * 90}%`;

    s.style.top =
      `${10 + Math.random() * 80}%`;

    s.style.animationDelay =
      `${Math.random() * 4}s`;

    s.style.animationDuration =
      `${3 + Math.random() * 3}s`;

    welcome.appendChild(s);
  }
}


/* ── CONFETTI ────────────────────────────────────────────── */
function launchCelebration() {
  const canvas =
    document.getElementById("confetti-canvas");

  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = [
    "#d4af37",
    "#f0d060",
    "#2d5fcc",
    "#ffffff",
    "#a07820",
    "#6090ff",
    "#ffd700"
  ];

  const pieces = [];

  for (let i = 0; i < 220; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 200,
      w: 6 + Math.random() * 10,
      h: 3 + Math.random() * 6,

      color:
        colors[
          Math.floor(
            Math.random() * colors.length
          )
        ],

      speed: 2.5 + Math.random() * 4,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.18,
      drift: (Math.random() - 0.5) * 2,
      opacity: 0.85 + Math.random() * 0.15,

      shape:
        Math.random() < 0.3
          ? "circle"
          : "rect"
    });
  }


  let frame = 0;

  function draw() {
    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    let alive = false;

    pieces.forEach((p) => {

      p.y += p.speed;
      p.x += p.drift;
      p.angle += p.spin;

      if (p.y < canvas.height + 20) {
        alive = true;
      }

      ctx.save();

      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);

      ctx.globalAlpha =
        p.opacity *
        Math.max(
          0,
          1 - frame / 300
        );

      ctx.fillStyle = p.color;

      if (p.shape === "circle") {

        ctx.beginPath();

        ctx.arc(
          0,
          0,
          p.w / 2,
          0,
          Math.PI * 2
        );

        ctx.fill();

      } else {

        ctx.fillRect(
          -p.w / 2,
          -p.h / 2,
          p.w,
          p.h
        );
      }

      ctx.restore();
    });

    frame++;

    if (alive && frame < 320) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );
    }
  }

  draw();
}


/* ── FIREWORKS ───────────────────────────────────────────── */
function launchFireworks() {
  const canvas =
    document.getElementById("firework-canvas");

  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const fireworks = [];


  function spawnFirework() {
    const x =
      canvas.width *
      (0.2 + Math.random() * 0.6);

    const y =
      canvas.height *
      (0.1 + Math.random() * 0.4);

    const color =
      Math.random() < 0.5
        ? "#d4af37"
        : "#4d7fff";

    const count =
      40 +
      Math.floor(Math.random() * 30);


    for (let i = 0; i < count; i++) {

      const angle =
        (i / count) *
        Math.PI *
        2;

      const speed =
        2 +
        Math.random() * 4;

      fireworks.push({
        x,
        y,

        vx:
          Math.cos(angle) *
          speed,

        vy:
          Math.sin(angle) *
          speed,

        alpha: 1,

        color,

        size:
          2 +
          Math.random() * 2,

        decay:
          0.015 +
          Math.random() * 0.01
      });
    }
  }


  let spawned = 0;

  const spawnInterval =
    setInterval(() => {

      spawnFirework();

      spawned++;

      if (spawned >= 6) {
        clearInterval(spawnInterval);
      }

    }, 600);


  function draw() {

    ctx.fillStyle =
      "rgba(6,8,16,0.15)";

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    fireworks.forEach((f) => {

      f.x += f.vx;
      f.y += f.vy;

      // gravity
      f.vy += 0.05;

      f.alpha -= f.decay;

      ctx.save();

      ctx.globalAlpha =
        Math.max(0, f.alpha);

      ctx.beginPath();

      ctx.arc(
        f.x,
        f.y,
        f.size,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = f.color;

      ctx.shadowBlur = 8;
      ctx.shadowColor = f.color;

      ctx.fill();

      ctx.restore();
    });


    // Remove dead particles
    for (
      let i = fireworks.length - 1;
      i >= 0;
      i--
    ) {
      if (fireworks[i].alpha <= 0) {
        fireworks.splice(i, 1);
      }
    }


    if (
      fireworks.length > 0 ||
      spawned < 6
    ) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );
    }
  }

  draw();
}


function initFireworksObserver() {
  const finale =
    document.getElementById("finale");

  let fired = false;

  const obs =
    new IntersectionObserver(
      (entries) => {

        if (
          entries[0].isIntersecting &&
          !fired
        ) {
          fired = true;

          launchFireworks();
          launchCelebration();
        }
      },
      {
        threshold: 0.3
      }
    );

  if (finale) {
    obs.observe(finale);
  }
}


/* ── GALLERY ─────────────────────────────────────────────── */
function initGallery() {

  const track =
    document.getElementById(
      "gallery-track"
    );

  const dotsEl =
    document.getElementById(
      "gallery-dots"
    );

  const captionEl =
    document.getElementById(
      "gallery-caption"
    );

  const fsViewer =
    document.getElementById(
      "fullscreen-viewer"
    );

  const fsImg =
    document.getElementById("fs-img");


  let current = 0;
  let autoTimer;


  // Build slides
  CONFIG.photos.forEach((p, i) => {

    const slide =
      document.createElement("div");

    slide.className =
      "gallery-slide" +
      (i === 0 ? " active" : "");


    slide.innerHTML = `
      <img
        src="${p.src}"
        alt="Photo ${i + 1}"
        loading="lazy"
        onclick="openFullscreen(${i})"
        style="cursor:zoom-in"
      >

      <div class="gallery-overlay"></div>

      <div class="gallery-slide-num">
        ${i + 1} / ${CONFIG.photos.length}
      </div>
    `;


    track.appendChild(slide);


    const dot =
      document.createElement("button");

    dot.className =
      "gallery-dot" +
      (i === 0 ? " active" : "");

    dot.setAttribute(
      "aria-label",
      `Slide ${i + 1}`
    );

    dot.onclick = () => goTo(i);

    dotsEl.appendChild(dot);
  });


  if (captionEl) {
    captionEl.textContent =
      CONFIG.photos[0].caption;
  }


  function goTo(n) {

    const slides =
      track.querySelectorAll(
        ".gallery-slide"
      );

    const dots =
      dotsEl.querySelectorAll(
        ".gallery-dot"
      );


    slides[current].classList.remove(
      "active"
    );

    dots[current].classList.remove(
      "active"
    );


    current =
      (n + CONFIG.photos.length) %
      CONFIG.photos.length;


    slides[current].classList.add(
      "active"
    );

    dots[current].classList.add(
      "active"
    );


    track.style.transform =
      `translateX(-${current * 100}%)`;


    if (captionEl) {

      captionEl.style.opacity = "0";

      setTimeout(() => {

        captionEl.textContent =
          CONFIG.photos[current].caption;

        captionEl.style.opacity = "1";

      }, 350);
    }


    resetAuto();
  }


  function resetAuto() {

    clearInterval(autoTimer);

    autoTimer =
      setInterval(
        () => goTo(current + 1),
        4000
      );
  }


  resetAuto();


  document.getElementById(
    "gallery-prev"
  ).onclick = () =>
    goTo(current - 1);


  document.getElementById(
    "gallery-next"
  ).onclick = () =>
    goTo(current + 1);


  // Touch swipe
  let touchStartX = 0;

  const container =
    document.querySelector(
      ".gallery-container"
    );


  container.addEventListener(
    "touchstart",
    (e) => {
      touchStartX =
        e.touches[0].clientX;
    },
    {
      passive: true
    }
  );


  container.addEventListener(
    "touchend",
    (e) => {

      const diff =
        touchStartX -
        e.changedTouches[0].clientX;

      if (Math.abs(diff) > 40) {
        goTo(
          current +
          (diff > 0 ? 1 : -1)
        );
      }
    }
  );


  // Fullscreen
  window.openFullscreen = function (i) {

    fsImg.src =
      CONFIG.photos[i].src;

    fsViewer.classList.add("show");
  };


  document.getElementById(
    "fs-close"
  ).onclick = () =>
    fsViewer.classList.remove(
      "show"
    );


  fsViewer.addEventListener(
    "click",
    (e) => {

      if (e.target === fsViewer) {
        fsViewer.classList.remove(
          "show"
        );
      }

    }
  );
}


/* ── MESSAGE TYPEWRITER ──────────────────────────────────── */
let msgDone = false;


function initMessage() {

  const el =
    document.getElementById(
      "msg-body"
    );

  const cursor =
    document.getElementById(
      "msg-cursor"
    );

  const msgCard =
    document.querySelector(
      ".message-card"
    );


  const obs =
    new IntersectionObserver(
      (entries) => {

        if (
          entries[0].isIntersecting &&
          !msgDone
        ) {

          msgDone = true;

          typeMessage(
            el,
            cursor
          );

          obs.disconnect();
        }
      },
      {
        threshold: 0.3
      }
    );


  if (msgCard) {
    obs.observe(msgCard);
  }
}


function typeMessage(el, cursor) {

  const text =
    CONFIG.message;

  let i = 0;

  el.innerHTML = "";


  function next() {

    if (i < text.length) {

      const ch = text[i++];


      if (ch === "\n") {

        if (text[i] === "\n") {

          el.innerHTML +=
            "<br><br>";

          i++;

        } else {

          el.innerHTML +=
            "<br>";
        }

      } else {

        el.innerHTML += ch;
      }


      setTimeout(
        next,
        20
      );

    } else {

      if (cursor) {
        cursor.style.display =
          "none";
      }
    }
  }


  next();
}


/* ── SCROLL REVEAL ───────────────────────────────────────── */
function initScrollReveal() {

  const obs =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((e) => {

          if (e.isIntersecting) {
            e.target.classList.add(
              "visible"
            );
          }

        });

      },
      {
        threshold: 0.12
      }
    );


  document
    .querySelectorAll(".reveal")
    .forEach((el) =>
      obs.observe(el)
    );
}


/* ── CLICK EFFECTS ───────────────────────────────────────── */
function initClickEffects() {

  const emojis = [
    "🎉",
    "🎊",
    "⭐",
    "✨",
    "🎈",
    "💫",
    "🎁",
    "🌟",
    "🥂",
    "🔥"
  ];


  document.addEventListener(
    "click",
    (e) => {

      startMusicOnInteraction();


      // Ripple
      const r =
        document.createElement(
          "div"
        );

      r.className =
        "ripple-circle";

      r.style.left =
        e.clientX + "px";

      r.style.top =
        e.clientY + "px";

      document.body.appendChild(r);


      setTimeout(
        () => r.remove(),
        700
      );


      // Float emoji (30% chance)
      if (Math.random() < 0.3) {

        const f =
          document.createElement(
            "div"
          );

        f.className =
          "float-emoji";

        f.textContent =
          emojis[
            Math.floor(
              Math.random() *
              emojis.length
            )
          ];

        f.style.left =
          e.clientX - 12 + "px";

        f.style.top =
          e.clientY - 12 + "px";

        document.body.appendChild(f);


        setTimeout(
          () => f.remove(),
          1500
        );
      }

    }
  );
       }
