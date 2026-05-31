// ===== KID HUB APP.JS =====

// ── NAVIGATION ──────────────────────────────────────
function showSection(id) {
  document.querySelectorAll('.hub-section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'math') newMathProblem();
}

// ── FACTS ───────────────────────────────────────────
const facts = {
  animals: [
    '🐙 Octopuses have THREE hearts and BLUE blood!',
    '🦒 A giraffe\'s tongue is 18 inches long and dark purple!',
    '🐧 Penguins propose to their mates with a pebble!',
    '🦁 Lions can sleep up to 20 hours a day!',
    '🦋 Butterflies taste with their feet!',
    '🐘 Elephants are the only animals that can\'t jump!',
    '🦈 Sharks are older than trees — they\'ve been here 400 million years!'
  ],
  space: [
    '🌟 The Sun is so big, 1.3 million Earths could fit inside it!',
    '🚀 A day on Venus is longer than a year on Venus!',
    '🌙 You could fit all the planets in our solar system between Earth and the Moon!',
    '⭐ There are more stars in the universe than grains of sand on Earth!',
    '🪐 Saturn\'s rings are mostly made of ice and rock!',
    '🌌 The Milky Way has over 200 billion stars!'
  ],
  ocean: [
    '🌊 95% of the ocean is still unexplored!',
    '🐳 Blue whales\'s hearts are the size of a small car!',
    '🦑 Giant squids have eyes the size of dinner plates!',
    '🐠 Clownfish can change their gender!',
    '🌊 The ocean produces 50% of the Earth\'s oxygen!',
    '🦀 Crabs have their teeth in their stomachs!'
  ],
  science: [
    '⚡ Lightning strikes Earth 100 times every second!',
    '💡 A day on Earth is actually 23 hours, 56 minutes!',
    '🧲 Magnets work because of electrons spinning in atoms!',
    '🌈 A rainbow is actually a full circle — we only see half from the ground!',
    '❄️ No two snowflakes are exactly alike!',
    '🌡️ Hot water can freeze faster than cold water — it\'s called the Mpemba effect!'
  ],
  history: [
    '🏺 Ancient Egyptians used toothpaste made from crushed eggshells!',
    '⚔️ The shortest war in history lasted only 38 minutes!',
    '📮 The first email was sent in 1971 — just to test if it worked!',
    '🗿 The Great Pyramid was the tallest man-made structure for 3,800 years!',
    '🎲 Playing cards were invented in China over 1,000 years ago!'
  ]
};

let currentTopic = 'animals';

function setTopic(topic) {
  currentTopic = topic;
  document.querySelectorAll('.topic-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  newFact();
}

function newFact() {
  const list = facts[currentTopic];
  const fact = list[Math.floor(Math.random() * list.length)];
  const emojis = { animals:'🐾', space:'🚀', ocean:'🌊', science:'🔬', history:'🏛️' };
  document.getElementById('fact-emoji').textContent = emojis[currentTopic] || '✨';
  const el = document.getElementById('fact-text');
  el.style.opacity = 0;
  setTimeout(() => { el.textContent = fact; el.style.opacity = 1; el.style.transition = 'opacity 0.4s'; }, 200);
}

// ── DRAWING CANVAS ──────────────────────────────────
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let tool = 'draw';
let lastX = 0, lastY = 0;

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  if (e.touches) {
    return [(e.touches[0].clientX - rect.left) * scaleX, (e.touches[0].clientY - rect.top) * scaleY];
  }
  return [(e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY];
}

canvas.addEventListener('mousedown', e => { drawing = true; [lastX, lastY] = getPos(e); });
canvas.addEventListener('mousemove', e => { if (!drawing) return; draw(e); });
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseleave', () => drawing = false);
canvas.addEventListener('touchstart', e => { e.preventDefault(); drawing = true; [lastX, lastY] = getPos(e); });
canvas.addEventListener('touchmove', e => { e.preventDefault(); if (!drawing) return; draw(e); });
canvas.addEventListener('touchend', () => drawing = false);

function draw(e) {
  const [x, y] = getPos(e);
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.strokeStyle = tool === 'erase' ? '#ffffff' : document.getElementById('colorPicker').value;
  ctx.lineWidth = tool === 'erase' ? parseInt(document.getElementById('brushSize').value) * 3 : parseInt(document.getElementById('brushSize').value);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
  [lastX, lastY] = [x, y];
}

function setTool(t) { tool = t; }
function clearCanvas() { ctx.clearRect(0, 0, canvas.width, canvas.height); }
function downloadCanvas() {
  const link = document.createElement('a');
  link.download = 'my-drawing.png';
  link.href = canvas.toDataURL();
  link.click();
}

// ── STORY GENERATOR ──────────────────────────────────
const storyTemplates = [
  (hero, type, setting, quest) =>
    `Once upon a time, a brave ${type} named **${hero}** lived in the ${setting}. One morning, ${hero} woke up to discover something shocking — someone had stolen the magical key that kept the ${setting} safe! With a heart full of courage, ${hero} set off on a quest to ${quest}. Along the way, ${hero} met a talking fox who gave 3 riddles, crossed a rainbow bridge guarded by a grumpy troll, and discovered a secret power hidden deep within. After three days and three nights, ${hero} finally succeeded! The whole ${setting} celebrated with a giant feast, and ${hero} became the most legendary hero the land had ever seen. ✨`,
  (hero, type, setting, quest) =>
    `In the magical land of ${setting}, there was no hero quite like **${hero}** — the most clever ${type} who ever existed. One stormy night, an ancient map appeared under ${hero}'s pillow with a single message: "Only you can ${quest}." Without hesitating, ${hero} grabbed their gear and dove headfirst into the greatest adventure imaginable. There were fire puzzles, invisible mazes, and a dragon who only spoke in rhymes. But ${hero} was clever — and brave — and kind. And those three things together? Unstoppable. 🌟`,
];

function generateStory() {
  const hero = document.getElementById('heroName').value.trim() || 'Hero';
  const type = document.getElementById('heroType').value;
  const setting = document.getElementById('setting').value;
  const quest = document.getElementById('quest').value;
  const template = storyTemplates[Math.floor(Math.random() * storyTemplates.length)];
  let story = template(hero, type, setting, quest);
  story = story.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const out = document.getElementById('story-output');
  out.innerHTML = story;
  out.style.display = 'block';
  out.style.animation = 'slideIn 0.5s ease';
}

// ── MATH CHALLENGE ───────────────────────────────────
let mathLevel = 'easy';
let mathAnswer = 0;
let mathScore = 0;
let mathStreak = 0;

function setLevel(level) {
  mathLevel = level;
  document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  newMathProblem();
}

function newMathProblem() {
  let a, b, ops, op, ans;
  if (mathLevel === 'easy') { a = rand(1,10); b = rand(1,10); ops = ['+','-']; }
  else if (mathLevel === 'medium') { a = rand(5,25); b = rand(5,25); ops = ['+','-','×']; }
  else { a = rand(10,50); b = rand(2,12); ops = ['+','-','×','÷']; }
  op = ops[Math.floor(Math.random() * ops.length)];
  if (op === '+') { ans = a + b; }
  else if (op === '-') { if (a < b) [a, b] = [b, a]; ans = a - b; }
  else if (op === '×') { ans = a * b; }
  else { ans = a; a = a * b; ans = a / b; b = b; }
  mathAnswer = ans;
  document.getElementById('math-problem').textContent = `${a} ${op} ${b} = ?`;
  document.getElementById('math-answer').value = '';
  document.getElementById('math-feedback').textContent = '';
  document.getElementById('math-answer').focus();
}

function checkMath() {
  const userAns = parseFloat(document.getElementById('math-answer').value);
  const fb = document.getElementById('math-feedback');
  if (isNaN(userAns)) { fb.textContent = '⚠️ Enter a number!'; return; }
  if (userAns === mathAnswer) {
    mathScore++; mathStreak++;
    fb.textContent = ['🎉 Correct!', '⭐ Amazing!', '🚀 Brilliant!', '🔥 On Fire!'][Math.min(mathStreak - 1, 3)];
    fb.style.color = '#1dd1a1';
    setTimeout(newMathProblem, 800);
  } else {
    mathStreak = 0;
    fb.textContent = `❌ Nope! The answer was ${mathAnswer}`;
    fb.style.color = '#ff6b6b';
  }
  document.getElementById('math-score').textContent = mathScore;
  document.getElementById('math-streak').textContent = mathStreak;
}

document.getElementById('math-answer').addEventListener('keydown', e => { if (e.key === 'Enter') checkMath(); });
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// ── MEMORY GAME ─────────────────────────────────────
const memEmojis = ['🐶','🐱','🦁','🐸','🦋','🌈','⭐','🍕'];
let memFlipped = [], memMatched = 0, memLocked = false;

function startMemoryGame() {
  const area = document.getElementById('game-area');
  const cards = [...memEmojis, ...memEmojis].sort(() => Math.random() - 0.5);
  memFlipped = []; memMatched = 0; memLocked = false;
  area.innerHTML = `<h3 style="text-align:center;margin-bottom:12px;">🃏 Memory Match — Find all pairs!</h3><div class="memory-grid"></div>`;
  const grid = area.querySelector('.memory-grid');
  cards.forEach((emoji, i) => {
    const card = document.createElement('div');
    card.className = 'mem-card';
    card.dataset.emoji = emoji;
    card.dataset.index = i;
    card.textContent = '?';
    card.addEventListener('click', () => flipCard(card));
    grid.appendChild(card);
  });
}

function flipCard(card) {
  if (memLocked || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  card.textContent = card.dataset.emoji;
  memFlipped.push(card);
  if (memFlipped.length === 2) {
    memLocked = true;
    if (memFlipped[0].dataset.emoji === memFlipped[1].dataset.emoji) {
      memFlipped.forEach(c => c.classList.add('matched'));
      memMatched++;
      memFlipped = []; memLocked = false;
      if (memMatched === memEmojis.length) {
        setTimeout(() => alert('🎉 You found all pairs! Amazing!'), 300);
      }
    } else {
      setTimeout(() => {
        memFlipped.forEach(c => { c.classList.remove('flipped'); c.textContent = '?'; });
        memFlipped = []; memLocked = false;
      }, 900);
    }
  }
}

// ── NUMBER GUESS GAME ────────────────────────────────
let secretNum, guessCount;

function startNumberGuess() {
  secretNum = Math.floor(Math.random() * 100) + 1;
  guessCount = 0;
  document.getElementById('game-area').innerHTML = `
    <h3 style="text-align:center;">🔢 Guess the Number (1-100)</h3>
    <div class="guess-box" style="margin-top:14px;">
      <input type="number" id="guessInput" min="1" max="100" placeholder="Your guess" />
      <br/><button class="big-btn" style="margin:10px auto;" onclick="submitGuess()">🎯 Guess!</button>
      <div class="guess-hint" id="guess-hint"></div>
    </div>`;
  document.getElementById('guessInput').addEventListener('keydown', e => { if (e.key === 'Enter') submitGuess(); });
}

function submitGuess() {
  const g = parseInt(document.getElementById('guessInput').value);
  if (!g || g < 1 || g > 100) return;
  guessCount++;
  const hint = document.getElementById('guess-hint');
  if (g === secretNum) {
    hint.textContent = `🎉 YES! It was ${secretNum}! You got it in ${guessCount} guess${guessCount>1?'es':''}!`;
    hint.style.color = '#1dd1a1';
  } else if (g < secretNum) {
    hint.textContent = `📈 Too low! Try higher. (Guess #${guessCount})`;
    hint.style.color = '#feca57';
  } else {
    hint.textContent = `📉 Too high! Try lower. (Guess #${guessCount})`;
    hint.style.color = '#ff6b6b';
  }
  document.getElementById('guessInput').value = '';
  document.getElementById('guessInput').focus();
}

// ── EMOJI QUIZ ───────────────────────────────────────
const emojiQuizzes = [
  { q: '🍕 + ❤️ = ?', a: 'pizza love', hint: 'You love pizza!' },
  { q: '🐍 + 🎮 = ?', a: 'snake game', hint: 'Classic Nokia game' },
  { q: '🌙 + 🔬 = ?', a: 'astronomy', hint: 'Studying the night sky' },
  { q: '🐶 + 🏃 = ?', a: 'walkies', hint: 'Taking your pup for a walk' },
  { q: '🎵 + 🧠 = ?', a: 'earworm', hint: 'A song stuck in your head' },
  { q: '🌊 + 🏄 = ?', a: 'surfing', hint: 'Ride the waves!' },
  { q: '🔥 + 💧 = ?', a: 'steam', hint: 'What happens when fire meets water' },
];
let emojiIdx = 0;

function startEmojiQuiz() {
  emojiIdx = Math.floor(Math.random() * emojiQuizzes.length);
  renderEmojiQuiz();
}

function renderEmojiQuiz() {
  const q = emojiQuizzes[emojiIdx];
  document.getElementById('game-area').innerHTML = `
    <h3 style="text-align:center;">🤔 Emoji Quiz!</h3>
    <div style="text-align:center;">
      <div style="font-size:2.5rem;margin:16px;">${q.q}</div>
      <input type="text" id="emojiAns" placeholder="Your answer" style="padding:10px;font-size:1rem;border:2px solid #667eea;border-radius:10px;" />
      <br/><button class="big-btn" style="margin:10px auto;" onclick="checkEmoji()">✅ Check!</button>
      <div id="emoji-feedback" style="font-size:1.2rem;font-weight:700;min-height:30px;"></div>
      <button class="big-btn" onclick="nextEmoji()" style="background:linear-gradient(135deg,#48dbfb,#0abde3);">⏭️ Next Quiz</button>
    </div>`;
  document.getElementById('emojiAns').addEventListener('keydown', e => { if (e.key === 'Enter') checkEmoji(); });
}

function checkEmoji() {
  const ans = document.getElementById('emojiAns').value.trim().toLowerCase();
  const q = emojiQuizzes[emojiIdx];
  const fb = document.getElementById('emoji-feedback');
  if (ans.includes(q.a) || q.a.includes(ans)) {
    fb.textContent = '🎉 Correct! ' + q.hint;
    fb.style.color = '#1dd1a1';
  } else {
    fb.textContent = `❌ Nope! Hint: ${q.hint}`;
    fb.style.color = '#ff6b6b';
  }
}

function nextEmoji() {
  emojiIdx = (emojiIdx + 1) % emojiQuizzes.length;
  renderEmojiQuiz();
}

// ── TYPING CHALLENGE ─────────────────────────────────
const typingWords = [
  'rainbow', 'elephant', 'sunshine', 'chocolate', 'butterfly',
  'adventure', 'dinosaur', 'waterfall', 'penguin', 'starlight'
];
let typingStart, typingWord;

function startTypingChallenge() {
  typingWord = typingWords[Math.floor(Math.random() * typingWords.length)];
  typingStart = null;
  document.getElementById('game-area').innerHTML = `
    <h3 style="text-align:center;">⌨️ Typing Speed Challenge!</h3>
    <div style="text-align:center;margin-top:14px;">
      <div style="font-size:2rem;font-weight:900;color:#764ba2;margin-bottom:12px;">${typingWord}</div>
      <input type="text" id="typeInput" placeholder="Type the word above!" style="padding:10px;font-size:1.1rem;border:2px solid #667eea;border-radius:10px;" />
      <div id="type-feedback" style="font-size:1.2rem;font-weight:700;margin-top:10px;min-height:30px;"></div>
    </div>`;
  const inp = document.getElementById('typeInput');
  inp.focus();
  inp.addEventListener('input', () => {
    if (!typingStart) typingStart = Date.now();
    const val = inp.value;
    if (val === typingWord) {
      const ms = Date.now() - typingStart;
      document.getElementById('type-feedback').innerHTML =
        `🎉 Done in <strong>${(ms/1000).toFixed(2)}s</strong>! <button class="big-btn" style="display:inline-block;margin:6px;padding:8px 16px;font-size:0.9rem;" onclick="startTypingChallenge()">Next Word</button>`;
      document.getElementById('type-feedback').style.color = '#1dd1a1';
    } else if (!typingWord.startsWith(val)) {
      document.getElementById('type-feedback').textContent = '⚠️ Oops! Keep typing...';
      document.getElementById('type-feedback').style.color = '#feca57';
    } else {
      document.getElementById('type-feedback').textContent = '✍️ Keep going!';
      document.getElementById('type-feedback').style.color = '#667eea';
    }
  });
}

// ── INIT ─────────────────────────────────────────────
newMathProblem();
