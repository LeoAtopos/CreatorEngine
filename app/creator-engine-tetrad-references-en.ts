import type { TetradReferenceGame } from "./creator-engine-tetrad-references";

// The English reference library mirrors the Chinese library game-for-game and in the same order.
export const tetradReferenceGamesEn: TetradReferenceGame[] = [
  {
    title: "Steins;Gate",
    sentence: {
      gameplay: { identity: "a lab member trying to change fate", verb: "read messages, use a phone, and trace clues", goal: "protect their friends and reach the ideal world line", constraint: "information is scarce, and key choices push the future onto different branches" },
      experience: { audience: "players who enjoy character drama and mystery", feeling: "the tension of understanding causality while fearing the cost of each choice", dynamic: "message choices and world-line reversals", alternative: "action combat" },
      hypothesis: { mechanism: "compare small changes across world lines", behavior: "actively infer causes between messages and events", experience: "they are bargaining with fate", signal: "players can explain a later consequence caused by one choice" },
    },
    player: {
      firstLook: { theme: "time loops and choices between world lines", genre: "urban science-fiction visual novel", references: "Japanese romance visual novels and time-loop stories", expectation: "build relationships and alter fate" },
      firstTen: { fulfilment: "will", outcome: "and will also", uniqueExperience: "a sense of causality as phone actions quietly change information and character responses", nextGoal: "understand the lab's anomaly" },
      arc: { source: "the severe consequences of world-line shifts and accumulated relationships", finale: "making a defining choice between love and causality" },
    },
    examples: {
      narrative: { foundation: "Japanese branching visual novel", signature: "Time loops, relationships, and branching choices gradually reveal the truth.", support: { mechanics: "Phone actions and decisive choices must open branches and alter world lines.", aesthetics: "Portraits, text boxes, and urban sci-fi imagery focus attention on relationships.", technology: "Dialogue trees, flags, saves, and rollback must reliably preserve branch state." } },
      mechanics: { foundation: "phone-triggered branching", signature: "Messages and key choices change relationship states and story routes.", support: { narrative: "Sparse but consequential interactions let the player personally trigger world-line shifts.", aesthetics: "The phone UI and visual-novel frame sustain urban sci-fi immersion.", technology: "The design requires condition checks, branch tracking, and multiple recoverable saves." } },
      aesthetics: { foundation: "urban sci-fi visual novel", signature: "Real Akihabara backdrops, character portraits, and glitch effects make everyday life feel unstable.", support: { narrative: "The contrast between familiar streets and visual anomalies signals world-line drift.", mechanics: "A stable visual hierarchy keeps reading, choices, and phone use clear.", technology: "Mostly static assets with focused effects support dense text and many branches." } },
      technology: { foundation: "conditional narrative scripting", signature: "Variables, flags, and save states manage extensive dialogue, events, and world lines.", support: { narrative: "Nonlinear branches must remain causally consistent after rewinds.", mechanics: "Phone events and player choices must reliably alter later content.", aesthetics: "Portraits, backgrounds, sound, and glitch effects need unified timing." } },
    },
  },
  {
    title: "The Legend of Zelda: Breath of the Wild",
    sentence: {
      gameplay: { identity: "an amnesiac hero", verb: "explore, climb, fight, and combine environmental rules", goal: "recover their strength and confront the Calamity", constraint: "stamina, weather, enemies, and limited resources continually shape the route" },
      experience: { audience: "players who love free exploration", feeling: "a curiosity-led adventure where they discover their own solutions", dynamic: "open terrain and systemic interaction", alternative: "a fixed quest order" },
      hypothesis: { mechanism: "travel toward landmarks across nearly every visible surface", behavior: "choose personal routes and revise plans along the way", experience: "the world is genuinely open", signal: "players can retell a personal detour that emerged away from the quest" },
    },
    player: {
      firstLook: { theme: "an amnesiac hero returning to a vast wilderness", genre: "open-world action adventure", references: "systemic exploration games", expectation: "reach what they can see and invent their own solutions" },
      firstTen: { fulfilment: "will", outcome: "and will also", uniqueExperience: "the freedom to combine climbing, gliding, and environmental rules into personal solutions", nextGoal: "reach the next striking landmark" },
      arc: { source: "new powers, equipment, memories, and world knowledge", finale: "completing a personal heroic journey along a self-chosen route" },
    },
    examples: {
      narrative: { foundation: "fragmented open-world narrative", signature: "Players recover memories in their own order and reconstruct history from ruins.", support: { mechanics: "Lost memories motivate exploration, climbing, and landmark seeking.", aesthetics: "Empty wilderness and ruins express collapse and renewal.", technology: "Quests and memories must trigger in nonlinear order without contradiction." } },
      mechanics: { foundation: "systemic open-world exploration", signature: "Climbing, gliding, elements, and physics combine into many valid solutions.", support: { narrative: "A self-chosen route produces a personal sequence of adventures.", aesthetics: "Visible landmarks are both compositions and goals.", technology: "Unified rules define priorities for physics, collision, and streaming." } },
      aesthetics: { foundation: "painterly natural wilderness", signature: "Soft color, broad vistas, and natural sound create solitude and freedom.", support: { narrative: "Ruins communicate the lost kingdom without dense exposition.", mechanics: "Readable landmarks, weather, and materials help players plan.", technology: "Stylized materials reduce detail cost while preserving distant readability." } },
      technology: { foundation: "seamless world streaming", signature: "Terrain, vistas, and interactive objects appear during continuous travel with few interruptions.", support: { narrative: "A continuous landscape keeps memory hunting spatially coherent.", mechanics: "Climbing, gliding, and long travel remain uninterrupted.", aesthetics: "Persistent distant landmarks uphold the promise that visible places are reachable." } },
    },
  },
  {
    title: "Hades",
    sentence: {
      gameplay: { identity: "the prince trying to escape the Underworld", verb: "fight, choose boons, and tune weapons", goal: "break through every guardian", constraint: "death ends the current build and returns the player home" },
      experience: { audience: "players who enjoy action challenges and character stories", feeling: "steady progress in which even failure has value", dynamic: "randomized builds and new dialogue after death", alternative: "failure as pure punishment" },
      hypothesis: { mechanism: "turn each death into new power, knowledge, or relationship responses", behavior: "treat failure as preparation and immediately plan another build", experience: "failure still advances the journey", signal: "players can name their next experiment immediately after dying" },
    },
    player: {
      firstLook: { theme: "an Underworld prince repeatedly escaping a family conflict", genre: "mythic action roguelite", references: "fast action and randomized dungeon games", expectation: "build spectacular combinations and challenge the Underworld again" },
      firstTen: { fulfilment: "will", outcome: "and will also", uniqueExperience: "continued progress as death returns them to new dialogue and changing relationships", nextGoal: "try another escape with a new build" },
      arc: { source: "new weapon forms, boon combinations, and family revelations", finale: "turning repeated failure into mastery and reconciliation" },
    },
    examples: {
      narrative: { foundation: "death-loop family drama", signature: "Every failed run advances dialogue, relationships, and world knowledge.", support: { mechanics: "Returning home after death naturally explains the roguelite loop.", aesthetics: "Distinct gods and Underworld spaces continually carry the family conflict.", technology: "Contextual dialogue must react to deaths, weapons, encounters, and relationships." } },
      mechanics: { foundation: "action roguelite loop", signature: "Random boons, weapon builds, and permanent growth vary every escape attempt.", support: { narrative: "Repeated failure becomes the hero's ongoing rebellion and repair of family ties.", aesthetics: "Readable attack effects keep fast build combinations legible.", technology: "Random rooms, stacked states, and combat feedback must combine reliably." } },
      aesthetics: { foundation: "hand-painted dark mythology", signature: "Saturated characters, sharp silhouettes, and ornate powers reinvent the Greek Underworld.", support: { narrative: "Portraits and environments establish divine identities and family relations quickly.", mechanics: "God-specific colors, icons, and sounds identify boon builds.", technology: "Modular portraits and effects support extensive dialogue and skill combinations." } },
      technology: { foundation: "state-driven dialogue system", signature: "Deaths, equipment, encounters, and relationships filter large pools of contextual dialogue.", support: { narrative: "Characters remember the player's history, so repetition keeps producing story.", mechanics: "Combat outcomes and build choices receive specific reactions back home.", aesthetics: "Portraits, voices, and staging must bridge fast combat and dialogue smoothly." } },
    },
  },
  {
    title: "Slay the Spire",
    sentence: {
      gameplay: { identity: "an adventurer climbing a living spire", verb: "play cards, build a deck, and choose routes", goal: "survive encounters and reach the summit", constraint: "health, energy, random rewards, and irreversible choices limit each run" },
      experience: { audience: "players who enjoy strategic experimentation", feeling: "discovering a powerful plan through disciplined trade-offs", dynamic: "deck building and visible enemy intent", alternative: "reflex execution" },
      hypothesis: { mechanism: "show enemy intent before each turn", behavior: "calculate risk and reshape the deck around future threats", experience: "defeats are understandable and improvable", signal: "players can explain why a card or route helped or broke their build" },
    },
    player: {
      firstLook: { theme: "a lone climb through a hostile living tower", genre: "deck-building roguelike", references: "card strategy and run-based dungeon games", expectation: "assemble card synergies and solve tactical fights" },
      firstTen: { fulfilment: "will", outcome: "and will also", uniqueExperience: "planning around visible intent while a small deck begins forming a distinct strategy", nextGoal: "find the next card or relic that completes the build" },
      arc: { source: "deck compression, relic synergies, and escalating enemy patterns", finale: "turning an improvised deck into a precise engine" },
    },
    examples: {
      narrative: { foundation: "minimalist ascent narrative", signature: "Sparse characters and events frame each run as a dangerous climb through a changing Spire.", support: { mechanics: "The climb gives route choices, floors, bosses, and resets a coherent purpose.", aesthetics: "Grotesque rooms and creatures suggest an unknowable organism.", technology: "Modular events and encounters can be assembled without a fixed plot order." } },
      mechanics: { foundation: "deck-building roguelike", signature: "Cards, relics, routes, and visible intent create transparent but deep risk management.", support: { narrative: "Each deck records the decisions and discoveries of one ascent.", aesthetics: "Clear icons and intent markers privilege strategic readability.", technology: "Deterministic effects and composable status rules support large synergy spaces." } },
      aesthetics: { foundation: "illustrated occult grotesque", signature: "Hand-drawn creatures, muted chambers, and strong combat icons make the Spire strange but readable.", support: { narrative: "Unfamiliar beings imply a larger mystery without lengthy exposition.", mechanics: "Cards, buffs, and enemy intent remain distinct at a glance.", technology: "2D modular assets make new cards, enemies, and events economical to add." } },
      technology: { foundation: "deterministic card-effect engine", signature: "Ordered effects, statuses, and seeded randomness make complex combinations reproducible.", support: { narrative: "Seeded runs preserve a coherent sequence of rooms and events.", mechanics: "Reliable resolution lets players learn and optimize interactions.", aesthetics: "A data-driven presentation maps each effect to consistent icons and animation." } },
    },
  },
  {
    title: "It Takes Two",
    sentence: {
      gameplay: { identity: "two transformed partners trying to repair their relationship", verb: "coordinate asymmetric abilities and solve cooperative set pieces", goal: "return home and reconcile", constraint: "neither player can progress alone" },
      experience: { audience: "two players seeking a shared adventure", feeling: "constant surprise and mutual dependence", dynamic: "new paired mechanics in every chapter", alternative: "parallel solo play" },
      hypothesis: { mechanism: "give each player a different half of every solution", behavior: "communicate, time actions, and rescue one another", experience: "cooperation is the story", signal: "both players regularly call out plans and credit the partner's action" },
    },
    player: {
      firstLook: { theme: "a couple repairing their relationship after becoming dolls", genre: "two-player cooperative platform adventure", references: "co-op puzzle and cinematic platform games", expectation: "solve imaginative situations together" },
      firstTen: { fulfilment: "will", outcome: "and will also", uniqueExperience: "two different toolsets combining into solutions neither player can complete alone", nextGoal: "discover the next paired mechanic" },
      arc: { source: "constantly changing abilities and emotional conflicts", finale: "rebuilding trust through actions performed together" },
    },
    examples: {
      narrative: { foundation: "relationship-repair adventure", signature: "A strained couple's emotional journey is externalized as fantastical cooperative trials.", support: { mechanics: "Every obstacle should require mutual reliance rather than merely sharing space.", aesthetics: "Domestic objects become oversized worlds shaped by relationship memories.", technology: "Split-screen state and cinematics must preserve two viewpoints and synchronized events." } },
      mechanics: { foundation: "asymmetric two-player co-op", signature: "Each chapter gives complementary abilities that must be combined to progress.", support: { narrative: "Depending on a partner turns reconciliation into player action.", aesthetics: "Tools and targets use paired colors and shapes to clarify roles.", technology: "Input, cameras, checkpoints, and interactions must stay synchronized for two players." } },
      aesthetics: { foundation: "handcrafted toy-box spectacle", signature: "Miniature materials, oversized household spaces, and playful transformations create constant novelty.", support: { narrative: "Familiar objects embody the couple's shared history.", mechanics: "Distinct visual languages teach each chapter's new cooperative tools.", technology: "Detailed materials and varied effects demand scalable split-screen rendering." } },
      technology: { foundation: "synchronized split-screen co-op", signature: "Two cameras, characters, and asymmetric interactions remain stable in local and online play.", support: { narrative: "Both players witness the same emotional beats from their own viewpoint.", mechanics: "Precise synchronization supports timing, rescue, and paired abilities.", aesthetics: "Dynamic resolution and camera rules preserve spectacle while rendering two views." } },
    },
  },
  {
    title: "Overwatch",
    sentence: {
      gameplay: { identity: "a specialist hero in a six-person team", verb: "aim, use abilities, and coordinate roles", goal: "control objectives with the team", constraint: "enemy compositions, cooldowns, positioning, and time pressure demand adaptation" },
      experience: { audience: "players who enjoy team competition and expressive heroes", feeling: "being indispensable through a distinct role", dynamic: "hero switching and ability synergy", alternative: "identical weapon loadouts" },
      hypothesis: { mechanism: "let players switch heroes to answer the current team problem", behavior: "read both compositions and coordinate ability timing", experience: "team strategy matters as much as aim", signal: "players change hero or plan in response to an opponent" },
    },
    player: {
      firstLook: { theme: "stylized global heroes fighting over shared objectives", genre: "team hero shooter", references: "class shooters and objective esports", expectation: "master a hero and combine abilities with teammates" },
      firstTen: { fulfilment: "will", outcome: "and will also", uniqueExperience: "feeling essential through a hero role whose abilities change the whole fight", nextGoal: "coordinate a decisive ultimate or learn another hero" },
      arc: { source: "map knowledge, hero matchups, and team coordination", finale: "turning individual mastery into coordinated team plays" },
    },
    examples: {
      narrative: { foundation: "ensemble heroic worldbuilding", signature: "A global cast and faction conflicts are told through character identity, maps, and short media.", support: { mechanics: "Each hero's fiction defines a clear combat role and ability fantasy.", aesthetics: "Silhouettes, voices, and regional maps communicate identity instantly.", technology: "Live content must add heroes and lore without breaking shared game state." } },
      mechanics: { foundation: "team hero shooter", signature: "Distinct roles, cooldown abilities, and mid-match hero switching create composition strategy.", support: { narrative: "Hero abilities make personality and background playable.", aesthetics: "Strong silhouettes and effect colors keep crowded fights readable.", technology: "Server authority and prediction must synchronize many fast abilities." } },
      aesthetics: { foundation: "stylized near-future heroism", signature: "Bright shapes, readable silhouettes, and optimistic global locations favor clarity and appeal.", support: { narrative: "Costume and location design communicate cultures and factions quickly.", mechanics: "Team colors, audio cues, and effect hierarchy reveal threats and opportunities.", technology: "Scalable effects and animation must preserve readability across hardware." } },
      technology: { foundation: "server-authoritative live service", signature: "Low-latency networking, replayable state, and patchable hero data sustain competitive play.", support: { narrative: "Regular content updates can expand heroes and world events.", mechanics: "Authoritative hit and ability resolution protects competitive consistency.", aesthetics: "Streaming and effect budgets keep diverse heroes and maps clear at speed." } },
    },
  },
  {
    title: "Stardew Valley",
    sentence: {
      gameplay: { identity: "a newcomer restoring an inherited farm", verb: "plant, harvest, craft, explore, and build relationships", goal: "shape a sustainable life and community", constraint: "each day has limited time, energy, seasons, and money" },
      experience: { audience: "players seeking a calm, self-directed routine", feeling: "ownership over gradual growth and belonging", dynamic: "daily planning and seasonal change", alternative: "constant urgent objectives" },
      hypothesis: { mechanism: "let small daily actions accumulate across seasons", behavior: "create personal routines and priorities", experience: "the farm and community truly become theirs", signal: "players can describe a self-chosen plan for the next day or season" },
    },
    player: {
      firstLook: { theme: "leaving city work to rebuild a farm and a place in the community", genre: "pixel-art farming life simulation", references: "farming, crafting, and social simulation games", expectation: "grow a farm at a personal pace" },
      firstTen: { fulfilment: "will", outcome: "and will also", uniqueExperience: "choosing a daily rhythm among crops, exploration, and relationships", nextGoal: "finish a first harvest or meet more townspeople" },
      arc: { source: "seasonal planning, farm automation, and deepening relationships", finale: "seeing a once-empty plot become a personal home and community" },
    },
    examples: {
      narrative: { foundation: "small-town renewal story", signature: "Personal routines and relationships slowly turn an inherited farm into a home.", support: { mechanics: "Daily work and gifting become visible acts of belonging.", aesthetics: "Seasonal town changes make time and community growth tangible.", technology: "Schedules, relationship flags, and persistent world state must interact consistently." } },
      mechanics: { foundation: "seasonal farming life sim", signature: "Time, energy, crops, crafting, exploration, and relationships compete for each day.", support: { narrative: "Player priorities create an individual story of work and connection.", aesthetics: "Crop stages and seasonal palettes expose progress clearly.", technology: "Calendar simulation and persistent object states drive the whole world." } },
      aesthetics: { foundation: "warm pixel-art countryside", signature: "Compact sprites, seasonal color, and gentle music create nostalgic intimacy.", support: { narrative: "Portraits and repeated town spaces make relationships familiar.", mechanics: "Readable tiles and crop stages make daily planning effortless.", technology: "Tile-based assets support a large, moddable world at low cost." } },
      technology: { foundation: "persistent calendar simulation", signature: "Time, seasons, schedules, crops, relationships, and placed objects advance together.", support: { narrative: "Characters remember events and follow believable routines.", mechanics: "Daily constraints and long-term growth remain predictable.", aesthetics: "Seasonal asset swaps transform the same spaces efficiently." } },
    },
  },
  {
    title: "Limbo",
    sentence: {
      gameplay: { identity: "a child searching through a hostile shadow world", verb: "run, jump, pull objects, and test hazards", goal: "move deeper into the unknown", constraint: "hidden traps and unforgiving physics make death frequent" },
      experience: { audience: "players who enjoy atmospheric puzzles", feeling: "fragile curiosity mixed with dread", dynamic: "observation, physical experimentation, and immediate retries", alternative: "explicit instruction" },
      hypothesis: { mechanism: "present lethal mechanisms without explanatory text", behavior: "watch motion and test cautious hypotheses", experience: "they survive by reading the world", signal: "players revise an approach based on environmental cues after a death" },
    },
    player: {
      firstLook: { theme: "a lone child crossing a deadly dreamlike world", genre: "monochrome puzzle platformer", references: "atmospheric platformers and environmental puzzles", expectation: "decode hazards through observation" },
      firstTen: { fulfilment: "will", outcome: "but will instead", uniqueExperience: "learning cruel physical rules through quick deaths with almost no interface or explanation", nextGoal: "understand the next silhouette or machine" },
      arc: { source: "larger machines, gravity shifts, and increasingly ambiguous imagery", finale: "escaping a hostile world through hard-won intuition" },
    },
    examples: {
      narrative: { foundation: "wordless nightmare journey", signature: "A child's unexplained search is told through danger, silhouettes, and ambiguous events.", support: { mechanics: "Vulnerability and trial-and-error make the journey feel desperate.", aesthetics: "The lack of words lets composition and motion carry meaning.", technology: "Scripted environmental events must communicate story without dialogue." } },
      mechanics: { foundation: "physics puzzle platforming", signature: "Simple movement, movable objects, traps, and quick retries reward observation.", support: { narrative: "Every hazard becomes an episode in the child's ordeal.", aesthetics: "Animation and silhouette are the primary tutorial language.", technology: "Consistent rigid-body behavior makes deadly experiments learnable." } },
      aesthetics: { foundation: "monochrome silhouette horror", signature: "Black forms, mist, shallow focus, and sparse sound create dread and ambiguity.", support: { narrative: "Unexplained silhouettes preserve interpretive space.", mechanics: "Interactive objects and hazards must remain readable in darkness.", technology: "Lighting, depth of field, and layered scrolling become core rendering needs." } },
      technology: { foundation: "2D physics and layered rendering", signature: "Rigid bodies, joints, lighting, and depth build an interactive silhouette world.", support: { narrative: "Controlled events make pursuit, death, and imagery work without dialogue.", mechanics: "Credible physical feedback supports observation and experimentation.", aesthetics: "Fog, light, and parallax give the black-and-white world depth." } },
    },
  },
  {
    title: "Genshin Impact",
    sentence: {
      gameplay: { identity: "a traveler searching for their sibling", verb: "explore, switch characters, combine elements, and grow a team", goal: "uncover the stories of each nation", constraint: "resources, enemies, and character capabilities shape progression" },
      experience: { audience: "players who enjoy fantasy travel and character collection", feeling: "companionship while discovering new regions and assembling a personal team", dynamic: "elemental combat and continuing world updates", alternative: "a single linear campaign" },
      hypothesis: { mechanism: "explore freely through landmarks, regional rules, and elemental opportunities", behavior: "leave quests voluntarily and adjust team combinations", experience: "the journey stays fresh", signal: "players can describe a surprising discovery or elemental combination" },
    },
    player: {
      firstLook: { theme: "a traveler crossing a fantasy continent in search of family", genre: "anime open-world action RPG", references: "character-collection, elemental-combat, and long-running adventure games", expectation: "explore new regions and assemble a personal team" },
      firstTen: { fulfilment: "will", outcome: "and will also", uniqueExperience: "switching characters to combine elements in combat and environmental problems", nextGoal: "reach the next landmark or expand the team" },
      arc: { source: "new nations, characters, elemental builds, and version stories", finale: "traveling the world with companions while continuing to pursue the truth" },
    },
    examples: {
      narrative: { foundation: "chapter-based world journey", signature: "Distinct nations, character chapters, and events extend one cross-regional journey.", support: { mechanics: "Searching for family and learning each nation provide long-term goals.", aesthetics: "Every nation needs distinct architecture, music, and color.", technology: "Quest state, cross-platform accounts, and version updates must remain compatible." } },
      mechanics: { foundation: "elemental action RPG", signature: "Character switching, elemental reactions, exploration, and progression form an expandable loop.", support: { narrative: "Character powers and regions turn companions and lore into action.", aesthetics: "Element colors and skill animation clarify team differences.", technology: "Multi-character state, elemental resolution, and world resources must cooperate." } },
      aesthetics: { foundation: "anime-style 3D rendering", signature: "Anime characters, bright landscapes, and regional music unify a varied fantasy journey.", support: { narrative: "Character design and scenery distinguish nations, factions, and identities.", mechanics: "Element colors and effects make reactions and switching readable.", technology: "Tiered materials, lighting, and effects must preserve style across devices." } },
      technology: { foundation: "cross-platform Unity", signature: "One content base spans mobile, console, and PC with a shared account experience.", support: { narrative: "Cross-platform updates let the long-form story unfold by version.", mechanics: "Input adaptation, resource management, and networking support exploration and combat.", aesthetics: "Scalable graphics preserve the same stylized look on varied hardware." } },
    },
  },
  {
    title: "Rocket League",
    sentence: {
      gameplay: { identity: "a driver of a rocket-powered car", verb: "accelerate, jump, pass, and shoot", goal: "score more goals in the arena", constraint: "vehicle momentum, ball physics, and defenders limit control precision" },
      experience: { audience: "players who enjoy short competitive matches", feeling: "skill growth from awkward touches to coordinated aerial plays", dynamic: "shared physics and team opposition", alternative: "character statistics" },
      hypothesis: { mechanism: "practice under consistent vehicle and ball physics", behavior: "predict rebounds and attempt increasingly complex touches", experience: "their mechanical skill is genuinely improving", signal: "players adjust positioning and reproduce a deliberate hit" },
    },
    player: {
      firstLook: { theme: "rocket cars playing football in neon arenas", genre: "vehicle football competition", references: "sports competition and physics driving games", expectation: "use high-speed control to pass and score" },
      firstTen: { fulfilment: "will", outcome: "and will also", uniqueExperience: "a large skill space emerging from jumping, boosting, and predicting the ball", nextGoal: "complete a reliable pass or first goal" },
      arc: { source: "aerial control, rotational positioning, and team chemistry", finale: "executing fast coordinated plays and comebacks through practice" },
    },
    examples: {
      narrative: { foundation: "player-generated sports drama", signature: "Comebacks, teamwork, mistakes, and seasonal growth create stories without a fixed plot.", support: { mechanics: "Open physics continually produces replayable decisive moments.", aesthetics: "Goal celebrations, arenas, and car customization amplify identity and memory.", technology: "Reliable replays and match records must preserve player history." } },
      mechanics: { foundation: "vehicle football", signature: "Driving, boosting, jumping, and aerial hits form high-skill competition under shared physics.", support: { narrative: "Passes, saves, and reversals naturally become match stories.", aesthetics: "Ball paths, speed, and collisions are designed for high-speed readability.", technology: "Ball physics, car control, and network resolution must remain consistent." } },
      aesthetics: { foundation: "neon arena sport", signature: "Bright stadiums, exaggerated cars, and strong goal effects evoke a future sports broadcast.", support: { narrative: "Team colors, customization, and celebrations create player identity.", mechanics: "High-contrast balls, lines, and boost effects clarify fast movement.", technology: "Modular cars and effects must expand without obscuring competitive play." } },
      technology: { foundation: "physics prediction and network sync", signature: "Fast cars, ball motion, and collisions must stay credible for every player.", support: { narrative: "Stable matches and seasonal records build a personal competitive history.", mechanics: "Prediction, correction, and server judgment make precise practice possible.", aesthetics: "Stable frame rate and clear effects preserve high-speed readability." } },
    },
  },
];
