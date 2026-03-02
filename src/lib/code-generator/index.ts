/**
 * Code Generator Service
 * 
 * Converts level designer output into Python code at different complexity levels.
 * This creates the "Design-to-Code" pipeline where kids learn Python by
 * recreating the game they designed visually.
 */

import { LevelData } from '@/components/level-designer/level-designer';

// Complexity phases for generated code
export type CodePhase = 1 | 2 | 3 | 4 | 5;

export interface GeneratedCode {
  phase: CodePhase;
  code: string;
  explanation: string;
  concepts: string[];
  lineAnnotations: Record<number, string>; // Line number -> explanation
}

export interface CodeGeneratorOptions {
  levelData: LevelData;
  heroName?: string;
  childName?: string;
  includeComments?: boolean;
}

/**
 * Generate Python code from level data at the specified complexity phase
 */
export function generateCode(options: CodeGeneratorOptions, phase: CodePhase): GeneratedCode {
  const { levelData, heroName = "Hero", childName = "Coder", includeComments = true } = options;
  
  switch (phase) {
    case 1:
      return generatePhase1(levelData, heroName, childName, includeComments);
    case 2:
      return generatePhase2(levelData, heroName, childName, includeComments);
    case 3:
      return generatePhase3(levelData, heroName, childName, includeComments);
    case 4:
      return generatePhase4(levelData, heroName, childName, includeComments);
    case 5:
      return generatePhase5(levelData, heroName, childName, includeComments);
    default:
      return generatePhase1(levelData, heroName, childName, includeComments);
  }
}

/**
 * Phase 1: Super Simple - Just load and play
 * Concepts: Function calls, strings
 */
function generatePhase1(
  levelData: LevelData, 
  heroName: string, 
  childName: string,
  includeComments: boolean
): GeneratedCode {
  const comments = includeComments ? `# 🎮 ${childName}'s Game: "${levelData.name}"
# Your first Python code!

` : '';

  const code = `${comments}# Say hello to the world!
print("Welcome to ${levelData.name}!")

# Load your awesome level
load_my_level("${levelData.name}")

# Set up the game controls
setup_simple_game()

# Let's play!
print("Use arrow keys to move, SPACE to jump!")
`;

  return {
    phase: 1,
    code,
    explanation: "This is your first Python program! It loads the level you designed and lets you play it.",
    concepts: ['print()', 'function calls', 'strings'],
    lineAnnotations: {
      1: "A comment - Python ignores lines starting with #",
      4: "print() shows text on screen AND as a speech bubble!",
      7: "This loads YOUR level that you designed",
      10: "This sets up keyboard controls automatically",
      13: "Another message - try changing the text!"
    }
  };
}

/**
 * Phase 2: Variables - Store level data in variables
 * Concepts: Variables, numbers, strings
 */
function generatePhase2(
  levelData: LevelData,
  heroName: string,
  childName: string,
  includeComments: boolean
): GeneratedCode {
  // Extract data from level
  const platforms = levelData.objects.filter(o => o.type === 'platform');
  const coins = levelData.objects.filter(o => o.type === 'coin');
  const spawn = levelData.objects.find(o => o.type === 'spawn');
  const goal = levelData.objects.find(o => o.type === 'goal');

  const comments = includeComments ? `# 🎮 ${childName}'s Game: "${levelData.name}"
# Now with VARIABLES!

` : '';

  const code = `${comments}# Game settings - try changing these!
game_name = "${levelData.name}"
player_speed = 5
jump_power = 15

# Level info
num_platforms = ${platforms.length}
num_coins = ${coins.length}
theme = "${levelData.theme}"

# Show what we've got
print(f"Loading {game_name}...")
print(f"Theme: {theme}")
print(f"Platforms: {num_platforms}, Coins: {num_coins}")

# Set up the game
set_theme(theme)
load_my_level(game_name)
setup_simple_game()

print("Game loaded! Have fun!")
`;

  return {
    phase: 2,
    code,
    explanation: "Variables are like labeled boxes that store information. You can use them to customize your game!",
    concepts: ['variables', 'numbers', 'strings', 'f-strings'],
    lineAnnotations: {
      4: "A variable! 'game_name' now holds your level's name",
      5: "Try changing this number to make your hero faster!",
      6: "Higher = bigger jumps, lower = smaller hops",
      9: `Your level has ${platforms.length} platforms`,
      10: `You placed ${coins.length} coins to collect`,
      14: "f-strings let you put variables inside text!",
      19: "Using the 'theme' variable instead of typing it again"
    }
  };
}

/**
 * Phase 3: Lists & Loops - Build level piece by piece
 * Concepts: Lists, tuples, for loops
 */
function generatePhase3(
  levelData: LevelData,
  heroName: string,
  childName: string,
  includeComments: boolean
): GeneratedCode {
  const platforms = levelData.objects.filter(o => o.type === 'platform');
  const coins = levelData.objects.filter(o => o.type === 'coin');
  const spawn = levelData.objects.find(o => o.type === 'spawn');
  const goal = levelData.objects.find(o => o.type === 'goal');

  // Convert to game coordinates (grid * 20)
  const platformsCode = platforms.map(p => 
    `    (${p.x * 20}, ${p.y * 20}, ${p.width * 20}, ${p.height * 20}),`
  ).join('\n');

  const coinsCode = coins.map(c => 
    `    (${c.x * 20 + 10}, ${c.y * 20 + 10}),`
  ).join('\n');

  const spawnX = spawn ? spawn.x * 20 : 40;
  const spawnY = spawn ? spawn.y * 20 : 300;
  const goalX = goal ? goal.x * 20 : 740;
  const goalY = goal ? goal.y * 20 : 300;

  const comments = includeComments ? `# 🎮 ${childName}'s Game: "${levelData.name}"
# Building with LISTS and LOOPS!

` : '';

  const code = `${comments}print("Building ${levelData.name}...")

# Set the theme
set_theme("${levelData.theme}")

# Platform positions: (x, y, width, height)
platforms = [
${platformsCode || '    (0, 360, 800, 40),  # Ground'}
]

# Coin positions: (x, y)
coins = [
${coinsCode || '    (400, 300),'}
]

# Build all platforms using a loop!
print(f"Adding {len(platforms)} platforms...")
for x, y, width, height in platforms:
    add_platform(x, y, width, height)

# Add all coins
print(f"Adding {len(coins)} coins...")
for x, y in coins:
    add_coin(x, y)

# Set player start and goal
set_player_position(${spawnX}, ${spawnY})
add_goal(${goalX}, ${goalY})

# Ready to play!
setup_simple_game()
print("Level built! Go collect those coins! 🪙")
`;

  return {
    phase: 3,
    code,
    explanation: "Lists store multiple items together. Loops let you do the same thing to each item without repeating code!",
    concepts: ['lists', 'tuples', 'for loops', 'len()'],
    lineAnnotations: {
      7: "A list of platforms - each one is a tuple (x, y, width, height)",
      13: "A list of coin positions - tuples with just (x, y)",
      18: "len() tells us how many items are in a list",
      19: "This loop runs once for EACH platform in the list!",
      20: "For each platform, we call add_platform with its values",
      24: "Same pattern - loop through all coins and add each one"
    }
  };
}

/**
 * Phase 4: Functions - Organize code into reusable pieces
 * Concepts: Functions, def, parameters, return
 */
function generatePhase4(
  levelData: LevelData,
  heroName: string,
  childName: string,
  includeComments: boolean
): GeneratedCode {
  const platforms = levelData.objects.filter(o => o.type === 'platform');
  const coins = levelData.objects.filter(o => o.type === 'coin');
  const enemies = levelData.objects.filter(o => o.type === 'enemy');
  const spawn = levelData.objects.find(o => o.type === 'spawn');
  const goal = levelData.objects.find(o => o.type === 'goal');

  const platformsCode = platforms.map(p => 
    `        (${p.x * 20}, ${p.y * 20}, ${p.width * 20}, ${p.height * 20}),`
  ).join('\n');

  const coinsCode = coins.map(c => 
    `        (${c.x * 20 + 10}, ${c.y * 20 + 10}),`
  ).join('\n');

  const spawnX = spawn ? spawn.x * 20 : 40;
  const spawnY = spawn ? spawn.y * 20 : 300;
  const goalX = goal ? goal.x * 20 : 740;
  const goalY = goal ? goal.y * 20 : 300;

  const comments = includeComments ? `# 🎮 ${childName}'s Game: "${levelData.name}"
# Organized with FUNCTIONS!

` : '';

  const code = `${comments}# ============================================
# GAME SETUP
# ============================================

def setup_level():
    """Build all the platforms and set the theme"""
    set_theme("${levelData.theme}")
    
    platforms = [
${platformsCode || '        (0, 360, 800, 40),'}
    ]
    
    for x, y, w, h in platforms:
        add_platform(x, y, w, h)
    
    print(f"Built {len(platforms)} platforms!")
    return len(platforms)

def add_collectibles():
    """Add coins for the player to collect"""
    coins = [
${coinsCode || '        (400, 300),'}
    ]
    
    for x, y in coins:
        add_coin(x, y)
    
    print(f"Added {len(coins)} coins!")
    return len(coins)

def setup_player():
    """Position the player at the start"""
    set_player_position(${spawnX}, ${spawnY})
    add_goal(${goalX}, ${goalY})
    print("Player ready at start position!")

# ============================================
# RUN THE GAME!
# ============================================

print("🎮 Starting ${levelData.name}!")

# Call our functions to build the level
platform_count = setup_level()
coin_count = add_collectibles()
setup_player()

# Set up controls
setup_simple_game()

print(f"Level complete! {platform_count} platforms, {coin_count} coins")
print("Use arrow keys + SPACE to play!")
`;

  return {
    phase: 4,
    code,
    explanation: "Functions are reusable blocks of code with a name. They help organize your program and avoid repeating yourself!",
    concepts: ['functions', 'def', 'parameters', 'return', 'docstrings'],
    lineAnnotations: {
      6: "def creates a function - this one is called 'setup_level'",
      7: "Docstring - explains what the function does",
      17: "return sends a value back when the function is called",
      19: "Another function! Each does one specific job",
      41: "Calling our function - it runs all the code inside it",
      42: "We can save the returned value in a variable!"
    }
  };
}

/**
 * Phase 5: Full Game - Complete with physics, enemies, game states
 * Concepts: State, conditionals, game loop, events
 */
function generatePhase5(
  levelData: LevelData,
  heroName: string,
  childName: string,
  includeComments: boolean
): GeneratedCode {
  const platforms = levelData.objects.filter(o => o.type === 'platform');
  const coins = levelData.objects.filter(o => o.type === 'coin');
  const enemies = levelData.objects.filter(o => o.type === 'enemy');
  const spawn = levelData.objects.find(o => o.type === 'spawn');
  const goal = levelData.objects.find(o => o.type === 'goal');

  const platformsCode = platforms.map(p => 
    `    (${p.x * 20}, ${p.y * 20}, ${p.width * 20}, ${p.height * 20}),`
  ).join('\n');

  const coinsCode = coins.map(c => 
    `    (${c.x * 20 + 10}, ${c.y * 20 + 10}),`
  ).join('\n');

  const enemiesCode = enemies.map(e => 
    `    ("${e.subtype || 'slime'}", ${e.x * 20}, ${e.y * 20}),`
  ).join('\n');

  const spawnX = spawn ? spawn.x * 20 : 40;
  const spawnY = spawn ? spawn.y * 20 : 300;
  const goalX = goal ? goal.x * 20 : 740;
  const goalY = goal ? goal.y * 20 : 300;

  const winCondition = levelData.settings.winCondition;
  const requiredCoins = levelData.settings.requiredCoins || coins.length;

  const comments = includeComments ? `# 🎮 ${childName}'s Complete Game: "${levelData.name}"
# Full game with physics, enemies, and win conditions!

` : '';

  const code = `${comments}# ============================================
# GAME CONFIGURATION
# ============================================

GAME_NAME = "${levelData.name}"
THEME = "${levelData.theme}"
WIN_CONDITION = "${winCondition}"
COINS_TO_WIN = ${requiredCoins}

# Player settings - customize these!
PLAYER_SPEED = 5
JUMP_POWER = 15
GRAVITY = 1
LIVES = 3

# ============================================
# GAME STATE
# ============================================

score = 0
lives = LIVES
velocity_y = 0
game_won = False

# ============================================
# LEVEL DATA
# ============================================

PLATFORMS = [
${platformsCode || '    (0, 360, 800, 40),'}
]

COINS = [
${coinsCode || '    (400, 300),'}
]

ENEMIES = [
${enemiesCode || '    # No enemies in this level'}
]

# ============================================
# SETUP FUNCTIONS
# ============================================

def build_level():
    """Construct the entire level"""
    set_theme(THEME)
    
    # Add platforms
    for x, y, w, h in PLATFORMS:
        add_platform(x, y, w, h)
    
    # Add coins
    for x, y in COINS:
        add_coin(x, y)
    
    # Add enemies
    for enemy_type, x, y in ENEMIES:
        add_enemy(enemy_type, x, y)
    
    # Set start and goal
    set_player_position(${spawnX}, ${spawnY})
    add_goal(${goalX}, ${goalY})
    
    print(f"🏗️ Built: {len(PLATFORMS)} platforms, {len(COINS)} coins")

# ============================================
# PLAYER CONTROLS
# ============================================

def move_left():
    """Move player left"""
    move(-PLAYER_SPEED)

def move_right():
    """Move player right"""
    move(PLAYER_SPEED)

def try_jump():
    """Jump if on ground"""
    global velocity_y
    if is_on_ground():
        velocity_y = -JUMP_POWER
        play_sound('jump')
        print("Jump! 🦘")

# ============================================
# GAME LOGIC
# ============================================

def update_physics():
    """Handle gravity and falling"""
    global velocity_y
    
    if not is_on_ground():
        velocity_y += GRAVITY
        move_player_y(velocity_y)
    else:
        velocity_y = 0

def check_collisions():
    """Handle collecting coins and touching enemies"""
    global score, lives
    
    # Coin collection
    if collides_with('COIN'):
        remove_colliding('COIN')
        score += 1
        show_score(score)
        play_sound('coin')
        print(f"🪙 Got a coin! Score: {score}")
        check_win()
    
    # Enemy collision
    if collides_with('ENEMY'):
        lives -= 1
        show_lives(lives)
        play_sound('hurt')
        reset_player_position()
        print(f"💥 Ouch! Lives: {lives}")
        
        if lives <= 0:
            game_over()

def check_win():
    """Check if player has won"""
    global game_won
    
    if game_won:
        return
    
    won = False
    
    if WIN_CONDITION == 'reach_goal':
        if collides_with('GOAL'):
            won = True
    elif WIN_CONDITION == 'collect_all_coins':
        if score >= COINS_TO_WIN:
            won = True
    
    if won:
        game_won = True
        victory()

def victory():
    """Player wins!"""
    show_message("🎉 YOU WIN! 🎉")
    play_sound('victory')
    freeze_enemies()
    print("🏆 Congratulations! You beat the level!")

def game_over():
    """Player loses"""
    show_message("💀 GAME OVER 💀")
    play_sound('game_over')
    print("Try again!")
    restart_level()

# ============================================
# GAME LOOP
# ============================================

def game_update():
    """Runs every frame"""
    if not game_won:
        update_physics()
        check_collisions()
        
        # Check goal collision for reach_goal mode
        if WIN_CONDITION == 'reach_goal':
            check_win()

# ============================================
# START THE GAME!
# ============================================

print(f"🎮 Loading {GAME_NAME}...")
build_level()

# Set up controls
on_key_down('LEFT', move_left)
on_key_down('RIGHT', move_right)
on_key_down('SPACE', try_jump)

# Start game loop
on_update(game_update)

# Show initial UI
show_score(score)
show_lives(lives)

print("Ready! Arrow keys to move, SPACE to jump!")
print(f"Goal: {WIN_CONDITION.replace('_', ' ').title()}")
`;

  return {
    phase: 5,
    code,
    explanation: "This is a complete game with physics, enemies, scoring, and win/lose conditions. You've learned all the Python you need to make your own games!",
    concepts: ['global variables', 'game loop', 'state management', 'conditionals', 'events', 'physics'],
    lineAnnotations: {
      6: "Constants (UPPERCASE) are values that don't change",
      21: "Game state - these variables track what's happening",
      46: "Build the whole level by calling functions",
      74: "'global' lets us change a variable from inside a function",
      92: "The game loop - this runs 60 times per second!",
      93: "Physics: add gravity to velocity each frame",
      103: "Check if player touches a coin",
      112: "Check if player touches an enemy",
      165: "Register our functions to run when keys are pressed",
      169: "Start the game loop - game_update runs every frame"
    }
  };
}

/**
 * Get all phases as an array for displaying progression
 */
export function getAllPhases(options: CodeGeneratorOptions): GeneratedCode[] {
  return [1, 2, 3, 4, 5].map(phase => generateCode(options, phase as CodePhase));
}

/**
 * Get a summary of what each phase teaches
 */
export function getPhaseSummaries(): Array<{ phase: CodePhase; title: string; concepts: string[]; description: string }> {
  return [
    {
      phase: 1,
      title: "Hello World!",
      concepts: ['print()', 'function calls', 'strings'],
      description: "Write your first code and see it come to life!"
    },
    {
      phase: 2,
      title: "Variables",
      concepts: ['variables', 'numbers', 'f-strings'],
      description: "Store information in labeled boxes you can use later"
    },
    {
      phase: 3,
      title: "Lists & Loops",
      concepts: ['lists', 'tuples', 'for loops'],
      description: "Work with collections and repeat actions efficiently"
    },
    {
      phase: 4,
      title: "Functions",
      concepts: ['def', 'parameters', 'return'],
      description: "Organize code into reusable building blocks"
    },
    {
      phase: 5,
      title: "Complete Game",
      concepts: ['state', 'game loop', 'physics', 'events'],
      description: "Put it all together into a full working game!"
    }
  ];
}





