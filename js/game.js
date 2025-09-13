// Core state model (minimal, deterministic)
const gameState = {
  hero: {
    name: "Hero",
    hp: 10,
    atk: 2,
    def: 1,
    lvl: 1,
    xp: 0,
    gold: 0,
    inventory: [],
    room: "cell",
    flags: {
      torchLit: false,
      tutorial: { didLook: false, didTake: false, didTalk: false, unlocked: false }
    },
    journal: []
  },
  world: {},
  systems: {
    save: true, load: true, help: true, stats: true, inv: true
  }
};

// Boot world
async function initWorld() {
  try {
    const res = await fetch("data/starterWorld.json", { cache: "no-store" });
    gameState.world = await res.json();
    ui.print("Welcome to ZaneRPG. This tiny room teaches the basics; then the world opens up.");
    ui.print(gameState.world.rooms[gameState.hero.room].desc);
    hintIfNeeded();
  } catch (e) {
    ui.print("Failed to load world data.");
    console.error(e);
  }
}

// Tutorial unlock when 3 basics are done
function checkTutorialUnlock() {
  const t = gameState.hero.flags.tutorial;
  if (!t.unlocked && t.didLook && t.didTake && t.didTalk) {
    t.unlocked = true;
    // Reveal exit from the cell
    const cell = gameState.world.rooms["cell"];
    cell.exits = cell.exits || {};
    cell.exits.n = "hall";
    ui.print("<span class='delta'>You feel ready. The guard unlatches the door to the north.</span>");
  }
}

function hintIfNeeded() {
  const t = gameState.hero.flags.tutorial;
  if (!t.didLook) {
    ui.print("<span class='muted'>Hint: Try the Look button.</span>");
  } else if (!t.didTake) {
    ui.print("<span class='muted'>Hint: Click Take, then type <em>torch</em>.</span>");
  } else if (!t.didTalk) {
    ui.print("<span class='muted'>Hint: Click Talk, then type <em>guard</em>.</span>");
  } else if (!t.unlocked) {
    ui.print("<span class='muted'>Hint: You're ready—listen for the door…</span>");
  }
}

initWorld();
