const systems = {
  save() {
    try {
      localStorage.setItem("zaneSave", JSON.stringify(gameState));
      ui.print("<span class='muted'>(Game saved.)</span>");
    } catch {
      ui.print("(Save failed — localStorage unavailable.)");
    }
  },
  load() {
    const data = localStorage.getItem("zaneSave");
    if (!data) return ui.print("(No save found.)");
    Object.assign(gameState, JSON.parse(data));
    ui.print("<span class='muted'>(Game loaded.)</span>");
    ui.print(gameState.world.rooms[gameState.hero.room]?.desc || "");
  },
  stats() {
    const h = gameState.hero;
    ui.print(`HP:${h.hp} ATK:${h.atk} DEF:${h.def} LVL:${h.lvl} XP:${h.xp} Gold:${h.gold}`);
  },
  inv() {
    const inv = gameState.hero.inventory;
    if (!inv.length) return ui.print("Inventory is empty.");
    ui.print("Inventory: " + inv.map(i => i.name).join(", "));
  },
  help() {
    ui.print("Commands: look, n/s/e/w, take <item>, talk <npc>, use <item>, inv, stats, save, load");
    ui.print("Tip: Buttons can auto-run (Look) or pre-fill (Take/Talk/Use).");
  }
};
