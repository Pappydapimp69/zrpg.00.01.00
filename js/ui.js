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

// Submit
document.getElementById("submitBtn").addEventListener("click", () => {
  const input = document.getElementById("commandInput");
  const cmd = input.value;
  input.value = "";
  parseCommand(cmd);
});
document.getElementById("commandInput").addEventListener("keydown", e => {
  if (e.key === "Enter") document.getElementById("submitBtn").click();
});

// Movement and quick buttons (these run immediately)
document.querySelectorAll("#quickBtns button").forEach(btn => {
  btn.addEventListener("click", () => parseCommand(btn.dataset.cmd));
});

// Static command buttons
document.querySelectorAll("#staticBtns button").forEach(btn => {
  btn.addEventListener("click", () => {
    const cmd = btn.dataset.cmd;
    if (cmd === "look") {
      parseCommand("look"); // auto-exec
    } else {
      const input = document.getElementById("commandInput");
      input.value = cmd + " ";
      input.focus();
    }
  });
});

// Top action buttons (help, stats, inv, save, load)
document.querySelectorAll("#topActions button").forEach(btn => {
  btn.addEventListener("click", () => parseCommand(btn.dataset.cmd));
});
