// UI helper for printing to transcript
const ui = {
  print(html) {
    const t = document.getElementById("transcript");
    const div = document.createElement("div");
    div.className = "line";
    div.innerHTML = html;
    t.appendChild(div);
    t.scrollTop = t.scrollHeight;
  }
};

// --- Event Listeners ---

// Submit button + Enter key
document.getElementById("submitBtn").addEventListener("click", () => {
  const input = document.getElementById("commandInput");
  const cmd = input.value;
  input.value = "";
  parseCommand(cmd); // run command
});
document.getElementById("commandInput").addEventListener("keydown", e => {
  if (e.key === "Enter") document.getElementById("submitBtn").click();
});

// Quick movement buttons (N, S, E, W, Look)
document.querySelectorAll("#quickBtns button").forEach(btn => {
  btn.addEventListener("click", () => parseCommand(btn.dataset.cmd));
});

// Static command buttons (Look runs immediately; others pre-fill input)
document.querySelectorAll("#staticBtns button").forEach(btn => {
  btn.addEventListener("click", () => {
    const cmd = btn.dataset.cmd;
    if (cmd === "look") {
      parseCommand("look"); // auto-exec
    } else {
      const input = document.getElementById("commandInput");
      input.value = cmd + " "; // e.g. "take "
      input.focus();
    }
  });
});

// Top action buttons (Help, Stats, Inv, Save, Load)
document.querySelectorAll("#topActions button").forEach(btn => {
  btn.addEventListener("click", () => parseCommand(btn.dataset.cmd));
});
