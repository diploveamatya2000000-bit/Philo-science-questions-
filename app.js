// 1) EDIT HERE: Add/modify questions
const DATA = [
  {
    category: "Cosmology",
    q: "Why is there something rather than nothing?",
    options: [
      "Brute fact (no deeper explanation)",
      "Necessary existence (logic/necessity)",
      "Multiverse / anthropic reasoning",
      "Theism / creator hypothesis",
      "Simulation hypothesis",
      "My own theory"
    ]
  },
  {
    category: "Consciousness",
    q: "Is consciousness fundamental or emergent?",
    options: [
      "Emergent from brain computation",
      "Panpsychism (mind-like aspect everywhere)",
      "Idealism (mind is primary)",
      "Dualism (mind and matter distinct)",
      "Illusionism (consciousness is a story)",
      "My own theory"
    ]
  },
  {
    category: "Physics",
    q: "Does time really flow, or is it an illusion?",
    options: [
      "Time flows (A-theory / presentism)",
      "Block universe (B-theory)",
      "Relational time (emerges from change)",
      "Time is a useful model only",
      "My own theory"
    ]
  },
  {
    category: "Epistemology",
    q: "How do we decide what is true?",
    options: [
      "Empiricism (evidence first)",
      "Rationalism (reason first)",
      "Pragmatism (what works)",
      "Coherentism (fits best with all beliefs)",
      "Skepticism (we can’t be sure)",
      "My own theory"
    ]
  }
];

// 2) APP LOGIC (no need to edit below unless you want features)
const $ = (id) => document.getElementById(id);

const usernameEl = $("username");
const categoryEl = $("category");
const questionEl = $("question");
const optionEl = $("option");
const notesEl = $("notes");
const statusEl = $("status");

const saveBtn = $("saveBtn");
const downloadBtn = $("downloadBtn");
const clearBtn = $("clearBtn");
const qTextEl = $("qText");

function uniq(arr){ return [...new Set(arr)]; }

function getKey(){
  const user = (usernameEl.value || "guest").trim().toLowerCase();
  const q = questionEl.value;
  return `sp_lab::${user}::${q}`;
}

function loadCategories(){
  const cats = uniq(DATA.map(x => x.category));
  categoryEl.innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join("");
}

function loadQuestions(){
  const cat = categoryEl.value;
  const qs = DATA.filter(x => x.category === cat);
  questionEl.innerHTML = qs.map((x, idx) => `<option value="${x.q}">${idx+1}. ${x.q}</option>`).join("");
  loadCurrent();
}

function loadOptionsForQuestion(q){
  const item = DATA.find(x => x.q === q);
  const opts = item ? item.options : ["My own theory"];
  optionEl.innerHTML = opts.map(o => `<option value="${o}">${o}</option>`).join("");
  qTextEl.textContent = q || "—";
}

function loadCurrent(){
  const q = questionEl.value;
  loadOptionsForQuestion(q);

  const raw = localStorage.getItem(getKey());
  if(raw){
    const saved = JSON.parse(raw);
    optionEl.value = saved.option || optionEl.value;
    notesEl.value = saved.notes || "";
    statusEl.textContent = `Loaded saved notes ✅ (last saved: ${saved.savedAt})`;
  } else {
    notesEl.value = "";
    statusEl.textContent = "No saved notes for this question yet.";
  }
}

function save(){
  const payload = {
    option: optionEl.value,
    notes: notesEl.value,
    savedAt: new Date().toLocaleString()
  };
  localStorage.setItem(getKey(), JSON.stringify(payload));
  statusEl.textContent = `Saved ✅ (${payload.savedAt})`;
}

function downloadTxt(){
  const user = (usernameEl.value || "guest").trim() || "guest";
  const q = questionEl.value;
  const text =
`User: ${user}
Category: ${categoryEl.value}
Question: ${q}
Chosen option: ${optionEl.value}

NOTES:
${notesEl.value}
`;
  const blob = new Blob([text], {type:"text/plain"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${user}-theory-notes.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function clearThis(){
  localStorage.removeItem(getKey());
  notesEl.value = "";
  statusEl.textContent = "Cleared this question’s saved notes.";
}

// events
categoryEl.addEventListener("change", loadQuestions);
questionEl.addEventListener("change", loadCurrent);
optionEl.addEventListener("change", () => statusEl.textContent = "Changed option (not saved yet).");
notesEl.addEventListener("input", () => statusEl.textContent = "Typing... (not saved yet)");

saveBtn.addEventListener("click", save);
downloadBtn.addEventListener("click", downloadTxt);
clearBtn.addEventListener("click", clearThis);

usernameEl.addEventListener("change", loadCurrent);

// init
loadCategories();
loadQuestions();