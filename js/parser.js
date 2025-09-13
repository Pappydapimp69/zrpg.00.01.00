function parseCommand(input) {
  const cmd = (input || "").trim();
  if (!cmd) return;

  const [verb, ...rest] = cmd.toLowerCase().split(/\s+/);
  const arg = rest.join(" ");

  // First, check built-in systems
  if (systems[verb]) {
    systems[verb](arg);
    return;
  }

  switch (verb) {
    case "look": return doLook();
    case "n":
    case "s":
    case "e":
    case "w": return move(verb);
    case "take": return doTake(arg);
    case "talk": return doTalk(arg);
    case "use":  return doUse(arg);
    default:
      ui.print("Unknown command.");
  }
}

function currentRoom() {
  return gameState.world.rooms[gameState.hero.room];
}

function doLook() {
  const room = currentRoom();
  ui.print(room.desc);
  if (room.items?.length) {
    ui.print("You see: " + room.items.map(id => gameState.world.items[id].name).join(", "));
  }
  if (room.npcs?.length) {
    ui.print("People here: " + room.npcs.map(id => gameState.world.npcs[id].name).join(", "));
  }
  gameState.hero.flags.tutorial.didLook = true;
  checkTutorialUnlock();
  hintIfNeeded();
}

function doTake(arg) {
  const room = currentRoom();
  if (!arg) return ui.print("Take what?");
  if (!room.items?.includes(arg)) return ui.print("You don't see that here.");

  const item = gameState.world.items[arg];
  gameState.hero.inventory.push(item);
  room.items = room.items.filter(i => i !== arg);
  ui.print(`You take the ${item.name}. <span class="delta">+${item.name}</span>`);

  gameState.hero.flags.tutorial.didTake = true;
  checkTutorialUnlock();
  hintIfNeeded();
}

function doTalk(arg) {
  const room = currentRoom();
  if (!arg) return ui.print("Talk to whom?");
  if (!room.npcs?.includes(arg)) return ui.print("Nobody by that name is here.");

  const npc = gameState.world.npcs[arg];
  const line = npc.dialogue.shift() || `${npc.name} has nothing more to say.`;
  ui.print(line);

  gameState.hero.flags.tutorial.didTalk = true;
  checkTutorialUnlock();
  hintIfNeeded();
}

function doUse(arg) {
  if (!arg) return ui.print("Use what?");
  const inv = gameState.hero.inventory;
  const item = inv.find(i => i.id === arg || i.name.toLowerCase() === arg);
  if (!item) return ui.print("You don't have that.");

  if (item.id === "torch") {
    const lit = !gameState.hero.flags.torchLit;
    gameState.hero.flags.torchLit = lit;
    ui.print(lit ? "You light the torch. Shadows recoil." : "You douse the torch. Darkness thickens.");
    return;
  }

  ui.print("Nothing happens.");
}

function move(dir) {
  const room = currentRoom();
  const next = room.exits?.[dir];
  if (!next) return ui.print("You can't go that way.");
  gameState.hero.room = next;
  const dest = currentRoom();
  ui.print(dest.desc);

  if (gameState.hero.flags.torchLit && dest.dark) {
    ui.print("<span class='muted'>Your torchlight pushes back the dark.</span>");
  }
}

