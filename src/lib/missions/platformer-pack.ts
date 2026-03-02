/**
 * Platformer Mission Pack v1
 * 
 * "Build Your First Platformer" - A complete mission pack teaching Python
 * through building a platformer game step by step.
 */

import { 
  MissionPack, 
  Mission, 
  GameTemplateConfig,
  ThemeConfig,
  SpriteConfig,
  LevelPreset
} from './schema';

// =============================================================================
// THEME CONFIGURATIONS
// =============================================================================

const themes: ThemeConfig[] = [
  {
    id: 'space',
    name: 'Space Station',
    background: '/game/backgrounds/space.png',
    platformTile: '/game/tiles/metal-platform.png',
    coinSprite: '/game/sprites/star-coin.png',
    goalSprite: '/game/sprites/portal.png',
    colorPalette: {
      primary: '#1a1a2e',
      secondary: '#16213e',
      accent: '#0f3460'
    }
  },
  {
    id: 'jungle',
    name: 'Jungle Adventure',
    background: '/game/backgrounds/jungle.png',
    platformTile: '/game/tiles/grass-platform.png',
    coinSprite: '/game/sprites/banana-coin.png',
    goalSprite: '/game/sprites/treasure-chest.png',
    colorPalette: {
      primary: '#2d5a27',
      secondary: '#4a7c59',
      accent: '#8fc93a'
    }
  },
  {
    id: 'city',
    name: 'City Rooftops',
    background: '/game/backgrounds/city.png',
    platformTile: '/game/tiles/brick-platform.png',
    coinSprite: '/game/sprites/gem-coin.png',
    goalSprite: '/game/sprites/flag.png',
    colorPalette: {
      primary: '#2c3e50',
      secondary: '#34495e',
      accent: '#e74c3c'
    }
  }
];

// =============================================================================
// PLAYER SPRITE CONFIGURATIONS
// =============================================================================

const playerSprites: SpriteConfig[] = [
  {
    id: 'robot',
    name: 'Robo',
    spriteSheet: '/game/sprites/robot.png',
    animations: {
      idle: 'robot-idle',
      walk: 'robot-walk',
      jump: 'robot-jump'
    }
  },
  {
    id: 'cat',
    name: 'Whiskers',
    spriteSheet: '/game/sprites/cat.png',
    animations: {
      idle: 'cat-idle',
      walk: 'cat-walk',
      jump: 'cat-jump'
    }
  },
  {
    id: 'knight',
    name: 'Sir Jumps-a-Lot',
    spriteSheet: '/game/sprites/knight.png',
    animations: {
      idle: 'knight-idle',
      walk: 'knight-walk',
      jump: 'knight-jump'
    }
  },
  {
    id: 'astronaut',
    name: 'Astro',
    spriteSheet: '/game/sprites/astronaut.png',
    animations: {
      idle: 'astronaut-idle',
      walk: 'astronaut-walk',
      jump: 'astronaut-jump'
    }
  }
];

// =============================================================================
// LEVEL PRESETS
// =============================================================================

const levelPresets: LevelPreset[] = [
  {
    id: 'easy',
    name: 'Easy Peasy',
    difficulty: 'easy',
    platforms: [
      { x: 0, y: 300, width: 400, height: 40 },
      { x: 450, y: 280, width: 200, height: 40 },
      { x: 700, y: 260, width: 150, height: 40 }
    ],
    coins: [
      { x: 120, y: 260 },
      { x: 520, y: 240 },
      { x: 750, y: 220 }
    ],
    enemies: [],
    goal: { x: 780, y: 220 }
  },
  {
    id: 'medium',
    name: 'Getting Tricky',
    difficulty: 'medium',
    platforms: [
      { x: 0, y: 300, width: 200, height: 40 },
      { x: 280, y: 260, width: 150, height: 40 },
      { x: 500, y: 220, width: 150, height: 40 },
      { x: 720, y: 180, width: 180, height: 40 }
    ],
    coins: [
      { x: 80, y: 260 },
      { x: 330, y: 220 },
      { x: 550, y: 180 },
      { x: 800, y: 140 }
    ],
    enemies: [
      { type: 'slime', x: 300, y: 220 }
    ],
    goal: { x: 850, y: 140 }
  },
  {
    id: 'hard',
    name: 'Challenge Mode',
    difficulty: 'hard',
    platforms: [
      { x: 0, y: 300, width: 150, height: 40 },
      { x: 220, y: 250, width: 100, height: 40 },
      { x: 400, y: 200, width: 100, height: 40 },
      { x: 580, y: 150, width: 100, height: 40 },
      { x: 750, y: 120, width: 150, height: 40 }
    ],
    coins: [
      { x: 50, y: 260 },
      { x: 250, y: 210 },
      { x: 430, y: 160 },
      { x: 610, y: 110 },
      { x: 820, y: 80 }
    ],
    enemies: [
      { type: 'slime', x: 240, y: 210 },
      { type: 'bat', x: 450, y: 140 }
    ],
    goal: { x: 850, y: 80 }
  }
];

// =============================================================================
// GAME TEMPLATE
// =============================================================================

const platformerTemplate: GameTemplateConfig = {
  templateId: 'platformer_template_v1',
  name: 'Platformer Game',
  themes,
  playerSprites,
  levelPresets,
  availableMechanics: [
    { id: 'double_jump', name: 'Double Jump', description: 'Jump again in mid-air!', default: false },
    { id: 'dash', name: 'Dash', description: 'Quick burst of speed!', default: false },
    { id: 'timer', name: 'Timer', description: 'Race against the clock!', default: false },
    { id: 'lives', name: 'Lives System', description: 'Multiple chances!', default: true }
  ],
  defaultConfig: {
    THEME: 'space',
    PLAYER: {
      sprite: 'robot',
      speed: 4,
      jumpStrength: 15
    },
    MECHANICS: {
      doubleJump: false,
      dash: false,
      timer: false,
      lives: 3
    },
    LEVEL: {
      preset: 'easy',
      platforms: levelPresets[0].platforms,
      coins: levelPresets[0].coins,
      enemies: levelPresets[0].enemies,
      goal: levelPresets[0].goal
    },
    WIN_RULE: {
      type: 'reach_goal',
      target: 0
    }
  }
};

// =============================================================================
// MISSIONS
// =============================================================================

const missions: Mission[] = [
  // --------------------------------------------------------------------------
  // MISSION 0: Design Your Hero
  // --------------------------------------------------------------------------
  {
    missionId: 'm0_design_hero',
    title: 'Mission 0: Design Your Hero',
    missionType: 'creative',
    purpose: 'Create a personal connection to the game by designing a custom character.',
    storyIntro: "Welcome, future game developer! 🎨 Before we start coding, let's create YOUR hero! This pixel art character will be the star of all your games. Make them look however you want - they're uniquely yours!",
    estimatedMinutes: 10,
    learningOutcomes: ['creativity', 'pixel art basics', 'personalization'],
    steps: [
      {
        stepId: 'm0_s1_design_hero',
        concepts: ['pixel art', 'creativity'],
        instruction: 'Design your hero using the pixel art editor! Choose colors and draw your character.',
        detailedExplanation: "Pixel art is made of tiny squares called pixels. Click to color them in! You can start with a template and customize it, or create something totally new. This hero will appear in all your games!",
        starterCode: '', // Not used for creative missions
        hint: "Try starting with a template on the left for inspiration, then change the colors to make it your own!",
        successCriteria: [
          'Design a character with at least some colored pixels',
          'Save your hero design'
        ],
        validation: {
          type: 'runtime',
          checks: [] // Creative missions have special validation
        },
        reward: { stars: 2, badge: 'Hero Designer' }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // MISSION 1: Make Something Happen
  // --------------------------------------------------------------------------
  {
    missionId: 'm1_intro_and_run',
    title: 'Mission 1: Make Something Happen',
    purpose: 'Teach the loop of: edit Python → run → see result.',
    storyIntro: "Welcome, young coder! 🎮 Today you'll write your very first lines of Python code and see them come to life in a game. Are you ready to become a game developer?",
    estimatedMinutes: 10,
    learningOutcomes: ['print() function', 'strings', 'running code'],
    steps: [
      {
        stepId: 'm1_s1_print_and_message',
        concepts: ['print()', 'strings'],
        instruction: "Let's start simple! Write a message that appears in your game.",
        detailedExplanation: "In Python, we use `print()` to show text. The text goes inside quotes. Try changing the message to say something different!",
        starterCode: `# Your first Python code! 🎉
# Change the message below to anything you want!

print('Welcome to my game!')
show_message('Welcome to my game!')
`,
        hint: "Try changing what's inside the quotes to your own message, like 'Hello World!' or 'Let\\'s play!'",
        solutionCode: `print('Welcome to my game!')
show_message('Welcome to my game!')`,
        successCriteria: [
          'Console shows your message',
          'Game window displays the welcome text'
        ],
        validation: {
          type: 'runtime',
          checks: [
            { type: 'stdout_contains', text: '' },
            { type: 'ui_message_shown' }
          ]
        },
        reward: { stars: 1, badge: 'First Run' }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // MISSION 2: Build Your First Scene
  // --------------------------------------------------------------------------
  {
    missionId: 'm2_build_scene',
    title: 'Mission 2: Build Your First Scene',
    missionType: 'level_design',
    purpose: 'Learn game design by creating levels, obstacles, and enemies visually.',
    storyIntro: "Welcome to the Level Designer! 🎨🏗️ Now that you have a hero, let's build the WORLD they'll explore! You'll design platforms to jump on, create obstacles to avoid, and even make your own enemies!",
    estimatedMinutes: 30,
    learningOutcomes: ['level design', 'game objects', 'spatial thinking', 'creativity'],
    steps: [
      {
        stepId: 'm2_s1_design_level',
        concepts: ['level design', 'game objects', 'spatial thinking', 'creativity'],
        instruction: "Design your level! Pick a theme, place platforms, add coins and enemies, then save it.",
        detailedExplanation: "The Level Designer is your sandbox - place platforms to jump on, coins to collect, and enemies to dodge. Pick a theme, make sure there's a path from spawn to goal, then hit Save when you're happy with it!",
        starterCode: '',
        hint: "Try picking a template on the left for inspiration, then customize it to make it yours! Don't forget to test your level before saving.",
        successCriteria: [
          'Choose a theme for your level',
          'Place platforms, coins, and enemies',
          'Make sure there is a spawn point and goal',
          'Save your level'
        ],
        validation: {
          type: 'runtime',
          checks: [
            { type: 'theme_applied' },
            { type: 'level_has_spawn' },
            { type: 'level_has_goal' },
            { type: 'level_has_platforms', count: 3 },
            { type: 'level_saved' }
          ]
        },
        reward: { stars: 5, badge: 'Scene Builder' }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // MISSION 3: Move with Functions
  // --------------------------------------------------------------------------
  {
    missionId: 'm3_movement_with_functions',
    title: 'Mission 3: Move with Functions',
    purpose: 'Teach functions, def, and calling move() with parameters.',
    storyIntro: "Your player is in the game! 🏃 Let's write a function that makes them run. A function is like a named recipe — write it once, call it whenever you want!",
    estimatedMinutes: 15,
    learningOutcomes: ['functions', 'def keyword', 'parameters'],
    steps: [
      {
        stepId: 'm3_s1_go_right',
        concepts: ['functions', 'def', 'parameters'],
        instruction: 'Complete the go_right() function by adding a move() call inside it, then run it to see your player dash across the screen!',
        detailedExplanation: "def creates a function — a named block of code you can call whenever you like. move(pixels) moves the player right by that many pixels instantly. Put move() inside go_right() and call go_right() to run it!",
        starterCode: `# A function is a named block of code you can call whenever you like!

def go_right():
    # YOUR CODE: call move() with how many pixels to move
    # Example: move(200) moves 200 pixels to the right
    pass

# Call your function to move the player!
go_right()
print('Player moved!')
`,
        hint: "Delete 'pass' inside go_right() and write: move(200)  — then run it!",
        successCriteria: [
          "Define a function called go_right()",
          "Call move() inside go_right()",
          "Call go_right() to test it"
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_has_function', name: 'go_right' },
            { type: 'ast_calls_function', name: 'move' },
            { type: 'ast_calls_function', name: 'go_right' }
          ]
        },
        reward: { stars: 2, badge: 'Function Builder' }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // MISSION 4: Keyboard Controls
  // --------------------------------------------------------------------------
  {
    missionId: 'm4_input_and_conditionals',
    title: 'Mission 4: Keyboard Controls',
    purpose: 'Introduce events + if statements, then smooth held-key movement.',
    storyIntro: "Functions are awesome! 🚀 Now let's connect them to the keyboard so YOU can control the player. We'll learn about `if` - teaching the computer to make decisions!",
    estimatedMinutes: 25,
    learningOutcomes: ['events', 'if/elif statements', 'keyboard input', 'on_update', 'is_key_pressed'],
    steps: [
      {
        stepId: 'm4_s1_left_right_keys',
        concepts: ['events', 'if/elif'],
        instruction: 'Use if/elif to move the player when LEFT or RIGHT arrow keys are pressed.',
        detailedExplanation: "`if` lets us check something and do different things. `elif` means 'else if' - another check if the first wasn't true.",
        starterCode: `# How many pixels to move each time a key is pressed
speed = 5

# This function runs whenever a key is pressed
def on_key(key):
    if key == 'LEFT':
        # YOUR CODE: call move(-speed) here to move left
        print('Moving left!')
    elif key == 'RIGHT':
        # YOUR CODE: call move(speed) here to move right
        # Hint: look at LEFT above — do the same but with +speed!
        print('Moving right!')

# Both keys are connected below — you just need to add the move() calls above!
on_key_down('LEFT', lambda: on_key('LEFT'))
on_key_down('RIGHT', lambda: on_key('RIGHT'))

print('Add move() inside each if/elif block above! ⬅️ ➡️')
`,
        hint: "Inside 'if key == LEFT': write move(-speed)  — and inside 'elif key == RIGHT': write move(speed)",
        successCriteria: [
          "Add move(-speed) inside the LEFT key block",
          "Add move(speed) inside the RIGHT key block",
          "Both keys are already connected with on_key_down()"
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_has_if' },
            { type: 'ast_has_on_key_handler' },
            { type: 'ast_calls_function', name: 'move' }
          ]
        },
        reward: { stars: 2, badge: 'Controls Unlocked' }
      },
      {
        stepId: 'm4_s2_smooth_movement',
        concepts: ['on_update', 'is_key_pressed', 'game loop'],
        instruction: 'Make the movement smooth! Hold an arrow key and your hero should keep moving — like Mario.',
        detailedExplanation: "on_key_down() fires once per tap — like pressing Enter. But Mario moves as long as you HOLD the key! To do that we use on_update() which runs 60 times per second, and is_key_pressed() which checks if a key is still being held down.",
        starterCode: `# is_key_pressed() returns True while you HOLD the key
# on_update() runs this function 60 times per second!

speed = 5

def update():
    # YOUR CODE: check if LEFT or RIGHT is held, then call move()
    # Hint: if is_key_pressed('LEFT'):
    #           move(-speed)
    pass

# This connects your update() to the game loop
on_update(update)

print('Hold LEFT or RIGHT — your hero should move smoothly!')
`,
        hint: "Delete 'pass' and add two if statements: one for 'LEFT' calling move(-speed), one for 'RIGHT' calling move(speed).",
        solutionCode: `speed = 5

def update():
    if is_key_pressed('LEFT'):
        move(-speed)
    if is_key_pressed('RIGHT'):
        move(speed)

on_update(update)`,
        successCriteria: [
          "Use on_update() to run your function every frame",
          "Use is_key_pressed() to check which keys are held",
          "Holding LEFT moves left, holding RIGHT moves right"
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_calls_function', name: 'on_update' },
            { type: 'ast_calls_function', name: 'is_key_pressed' },
            { type: 'ast_has_if' }
          ]
        },
        reward: { stars: 3, badge: 'Smooth Mover' }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // MISSION 5: Build Platforms with Loops
  // --------------------------------------------------------------------------
  {
    missionId: 'm5_loops_and_level_building',
    title: 'Mission 5: Build Platforms with Loops',
    purpose: 'Teach loops and lists through placing platforms.',
    storyIntro: "Your player can move! 🎉 But they need somewhere to walk. Let's build platforms! We'll use lists (collections of things) and loops (doing something many times).",
    estimatedMinutes: 20,
    learningOutcomes: ['lists', 'for loops', 'tuples'],
    steps: [
      {
        stepId: 'm5_s1_platform_list',
        concepts: ['lists', 'for loops'],
        instruction: 'Create a list of platforms and add them using a loop.',
        detailedExplanation: "A list is a collection of items in square brackets. A `for` loop goes through each item and does something with it. Each platform has (x, y, width, height).",
        starterCode: `# List of platforms: (x position, y position, width, height)
platforms = [
    (0, 300, 400, 40),    # Ground platform
    (450, 250, 200, 40),  # Middle platform
    (700, 200, 150, 40),  # High platform
]

# Loop through each platform and add it to the game
for p in platforms:
    add_platform(p[0], p[1], p[2], p[3])
    print(f'Added platform at x={p[0]}')

print(f'Total platforms: {len(platforms)}')
`,
        hint: "Try adding a new platform! Add a new line like (200, 350, 150, 40) inside the list.",
        successCriteria: [
          'At least 2 platforms appear in the game',
          'Uses a for-loop to add platforms'
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_for_loop' },
            { type: 'platform_count_gte', count: 2 }
          ]
        },
        reward: { stars: 3, badge: 'Level Designer' }
      },
      {
        stepId: 'm5_s2_pick_level_preset',
        concepts: ['lists', 'editing values'],
        instruction: 'Choose a level preset, then make at least one change so your level is unique!',
        detailedExplanation: "You can start with a preset and then customize it. Change at least one platform so your game is different from everyone else's!",
        starterCode: `# 🎮 PICK YOUR LEVEL DIFFICULTY
# Try: 'easy', 'medium', or 'hard'
LEVEL_PRESET = 'easy'

# Load the preset platforms
platforms = load_platform_preset(LEVEL_PRESET)

# ✨ MAKE IT YOURS!
# Change ONE platform to make your level unique
# Example: platforms[0] = (0, 320, 420, 40)
# The numbers are: (x, y, width, height)

# YOUR CHANGE HERE:
# platforms[0] = (0, 280, 500, 40)

# Add all platforms to the game
for p in platforms:
    add_platform(p[0], p[1], p[2], p[3])

print(f'Loaded {LEVEL_PRESET} preset with YOUR changes!')
`,
        hint: "Uncomment the line that starts with # platforms[0] = and change the numbers!",
        successCriteria: [
          'A preset loads successfully',
          'At least one platform is different from the preset defaults'
        ],
        validation: {
          type: 'runtime',
          checks: [
            { type: 'preset_loaded' },
            { type: 'platforms_modified_from_preset' }
          ]
        },
        reward: { stars: 3, badge: 'Remix Level' },
        customization: {
          type: 'level_design',
          description: 'Choose difficulty and customize your platforms',
          options: ['easy', 'medium', 'hard']
        }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // MISSION 6: Jump and Gravity
  // --------------------------------------------------------------------------
  {
    missionId: 'm6_gravity_and_jump',
    title: 'Mission 6: Make Your Player Jump!',
    purpose: 'Teach set_player_vy, is_on_ground, and keyboard events.',
    storyIntro: "Your player can walk left and right — now let's make them jump! 🦘 Jumping is how your hero reaches higher platforms and avoids enemies. Let's code it!",
    estimatedMinutes: 20,
    learningOutcomes: ['set_player_vy', 'is_on_ground', 'on_key_down', 'if statements'],
    steps: [
      {
        stepId: 'm6_s1_simple_jump',
        concepts: ['set_player_vy', 'on_key_down'],
        instruction: 'Complete the jump() function so pressing SPACE launches the player upward.',
        detailedExplanation: "set_player_vy() sets the player's vertical speed. Negative = moving UP, positive = moving DOWN. -15 is a good jump strength — try it and see! The game's gravity will pull the player back down automatically.",
        starterCode: `# ✅ Smooth movement from Mission 4 (hold the key to keep moving!)
speed = 5
def movement():
    if is_key_pressed('LEFT'):
        move(-speed)
    if is_key_pressed('RIGHT'):
        move(speed)
on_update(movement)

# set_player_vy() sets the player's upward speed.
# Negative = UP, positive = DOWN. -15 is a good jump height!

def jump():
    # YOUR CODE: call set_player_vy(-15) to launch the player upward!
    pass

# Connect the SPACE key to your jump() function
on_key_down('SPACE', jump)

print('Add set_player_vy(-15) inside jump(), then Run Code and press SPACE!')
`,
        hint: "Inside jump(), delete 'pass' and write: set_player_vy(-15)",
        successCriteria: [
          "Define a jump() function",
          "Call set_player_vy() with a negative number inside jump()",
          "Connect SPACE key to jump() using on_key_down()"
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_has_function', name: 'jump' },
            { type: 'ast_calls_function', name: 'set_player_vy' },
            { type: 'ast_has_on_key_handler' }
          ]
        },
        reward: { stars: 2, badge: 'Jump Starter' }
      },
      {
        stepId: 'm6_s2_ground_check',
        concepts: ['is_on_ground', 'if statements'],
        instruction: 'Add a ground check — only allow jumping when the player is on the ground!',
        detailedExplanation: "Right now the player can jump again while in mid-air (double jump). Real platformers check if the player is on the ground before jumping. is_on_ground() returns True when touching a platform. Use an if statement to check before jumping!",
        starterCode: `# ✅ Smooth movement from Mission 4 (hold the key to keep moving!)
speed = 5
def movement():
    if is_key_pressed('LEFT'):
        move(-speed)
    if is_key_pressed('RIGHT'):
        move(speed)
on_update(movement)

# Jump height — try changing this number!
JUMP_STRENGTH = -15

def jump():
    # YOUR CODE: use an if statement to only jump when on the ground!
    # Hint: if is_on_ground():
    #           set_player_vy(JUMP_STRENGTH)
    set_player_vy(JUMP_STRENGTH)   # replace this line with the if check!

on_key_down('SPACE', jump)

print('Add the if is_on_ground() check to stop double-jumping!')
`,
        hint: "Replace set_player_vy(JUMP_STRENGTH) with: if is_on_ground():  (new line)      set_player_vy(JUMP_STRENGTH)",
        successCriteria: [
          "Use if is_on_ground(): before jumping",
          "set_player_vy() is only called when on the ground",
          "Cannot double-jump in mid-air"
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_has_if' },
            { type: 'ast_calls_function', name: 'is_on_ground' },
            { type: 'ast_calls_function', name: 'set_player_vy' }
          ]
        },
        reward: { stars: 3, badge: 'Jump Master' }
      },
      {
        stepId: 'm6_s3_tune_jump',
        concepts: ['variables', 'experimentation'],
        instruction: 'Tune your jump! Change JUMP_STRENGTH to find the perfect jump height for your level.',
        detailedExplanation: "Game designers test and tweak numbers to make a game feel right. A bigger number (like -25) makes a huge jump. A smaller number (like -10) makes a tiny hop. Try a few values and pick one that works with YOUR level's platform heights!",
        starterCode: `# ✅ Smooth movement from Mission 4 (hold the key to keep moving!)
speed = 5
def movement():
    if is_key_pressed('LEFT'):
        move(-speed)
    if is_key_pressed('RIGHT'):
        move(speed)
on_update(movement)

# Try different values here and see how they feel!
# -10 = small hop, -15 = normal jump, -20 = high jump, -25 = huge leap
JUMP_STRENGTH = -15

def jump():
    if is_on_ground():
        set_player_vy(JUMP_STRENGTH)
        print(f'Jump! Strength: {JUMP_STRENGTH}')

on_key_down('SPACE', jump)
print(f'Jump strength is {JUMP_STRENGTH} — try changing it!')
`,
        hint: "Change -15 to any number between -8 and -30. Run Code and press SPACE to test it!",
        successCriteria: [
          "JUMP_STRENGTH is set to a value you chose",
          "The jump feels good for your level"
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_has_assignment', variable: 'JUMP_STRENGTH' },
            { type: 'ast_calls_function', name: 'set_player_vy' },
            { type: 'ast_has_if' }
          ]
        },
        reward: { stars: 3, badge: 'Game Designer' }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // MISSION 7: Level Objects — Coins and Goals
  // --------------------------------------------------------------------------
  {
    missionId: 'm7_collisions',
    title: 'Mission 7: Add Coins and a Goal!',
    purpose: 'Teach add_coin() and add_goal() — placing interactive objects in the level.',
    storyIntro: "Your level has platforms to jump on — but it needs THINGS to collect and a FINISH LINE! 🪙🏁 Let's add coins and a goal flag. Watch them appear live in the game as you write the code!",
    estimatedMinutes: 15,
    learningOutcomes: ['add_coin', 'add_goal', 'coordinates', 'level design'],
    steps: [
      {
        stepId: 'm7_s1_add_coins',
        concepts: ['add_coin', 'coordinates'],
        instruction: 'Place coins in your level using add_coin(x, y)!',
        detailedExplanation: "add_coin(x, y) places a shiny collectible at that position. x moves the coin LEFT and RIGHT (0 = far left, 800 = far right). y moves it UP and DOWN (0 = top of screen, 500 = bottom). Place coins above platforms so players have to jump to reach them! The coins will appear instantly when you run your code.",
        starterCode: `# ✅ Platforms from Mission 5
platforms = [
    (0,   300, 400, 40),  # Ground platform
    (450, 250, 200, 40),  # Middle platform
    (700, 200, 150, 40),  # High platform
]
for p in platforms:
    add_platform(p[0], p[1], p[2], p[3])

# ✅ Smooth movement + jump from Missions 4 & 6
speed = 5
def movement():
    if is_key_pressed('LEFT'):
        move(-speed)
    if is_key_pressed('RIGHT'):
        move(speed)
on_update(movement)

JUMP_STRENGTH = -15
def jump():
    if is_on_ground():
        set_player_vy(JUMP_STRENGTH)
on_key_down('SPACE', jump)

# --- Mission 7: Place coins in your level! ---
# add_coin(x, y) makes a coin appear at that position.
add_coin(120, 260)   # Above the ground platform — done for you!
# YOUR CODE: add 2 more coins above the other platforms!

print('Coins added! Jump around — but you cannot collect them yet 🪙')
`,
        hint: "The middle platform is at y=250. A coin just above it would be at y=210. Try add_coin(520, 210)!",
        solutionCode: `platforms = [
    (0,   300, 400, 40),
    (450, 250, 200, 40),
    (700, 200, 150, 40),
]
for p in platforms:
    add_platform(p[0], p[1], p[2], p[3])

speed = 5
def movement():
    if is_key_pressed('LEFT'):
        move(-speed)
    if is_key_pressed('RIGHT'):
        move(speed)
on_update(movement)

JUMP_STRENGTH = -15
def jump():
    if is_on_ground():
        set_player_vy(JUMP_STRENGTH)
on_key_down('SPACE', jump)

add_coin(120, 260)
add_coin(520, 210)
add_coin(750, 160)

print('3 coins placed! 🪙')
`,
        successCriteria: [
          'Use add_coin() at least 2 times',
          'Coins appear at different positions in the game'
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_calls_function', name: 'add_coin' }
          ]
        },
        reward: { stars: 2, badge: 'Coin Placer' }
      },
      {
        stepId: 'm7_s2_add_goal',
        concepts: ['add_goal', 'coordinates'],
        instruction: 'Add a GOAL flag — the finish line of your level!',
        detailedExplanation: "add_goal(x, y) places a shining flag that marks the END of your level. Put it somewhere challenging — maybe on the highest platform! When you run your code the flag will appear. In the next mission you will write code to make the game react when the player TOUCHES the flag.",
        starterCode: `# ✅ Platforms from Mission 5
platforms = [
    (0,   300, 400, 40),
    (450, 250, 200, 40),
    (700, 200, 150, 40),
]
for p in platforms:
    add_platform(p[0], p[1], p[2], p[3])

# ✅ Smooth movement + jump from Missions 4 & 6
speed = 5
def movement():
    if is_key_pressed('LEFT'):
        move(-speed)
    if is_key_pressed('RIGHT'):
        move(speed)
on_update(movement)

JUMP_STRENGTH = -15
def jump():
    if is_on_ground():
        set_player_vy(JUMP_STRENGTH)
on_key_down('SPACE', jump)

# ✅ Coins from Mission 7 Step 1
add_coin(120, 260)
add_coin(520, 210)
add_coin(750, 160)

# --- Mission 7 Step 2: Place the finish line! ---
# add_goal(x, y) places a flag the player needs to reach.
# YOUR CODE: add the goal somewhere hard to reach!

print('Goal placed! Next mission: write code that reacts when you touch it!')
`,
        hint: "The highest platform is at x=700-850, y=200. Try add_goal(720, 160) to put it near the top!",
        solutionCode: `platforms = [
    (0,   300, 400, 40),
    (450, 250, 200, 40),
    (700, 200, 150, 40),
]
for p in platforms:
    add_platform(p[0], p[1], p[2], p[3])

speed = 5
def movement():
    if is_key_pressed('LEFT'):
        move(-speed)
    if is_key_pressed('RIGHT'):
        move(speed)
on_update(movement)

JUMP_STRENGTH = -15
def jump():
    if is_on_ground():
        set_player_vy(JUMP_STRENGTH)
on_key_down('SPACE', jump)

add_coin(120, 260)
add_coin(520, 210)
add_coin(750, 160)
add_goal(720, 160)

print('Level set! Can you reach the goal? 🏁')
`,
        successCriteria: [
          'Use add_goal() to place a goal flag',
          'Goal appears in the game'
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_calls_function', name: 'add_goal' },
            { type: 'ast_calls_function', name: 'add_coin' }
          ]
        },
        reward: { stars: 3, badge: 'Level Builder' }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // MISSION 8: Coins and Score
  // --------------------------------------------------------------------------
  {
    missionId: 'm8_collectibles_and_score',
    title: 'Mission 8: Collect Coins and Score!',
    purpose: 'Teach collides_with(), score tracking, and win conditions.',
    storyIntro: "Your coins and goal are in the level — but touching them does NOTHING yet! 🪙 Let's write code to collect coins, keep score, and win the game!",
    estimatedMinutes: 25,
    learningOutcomes: ['variables', 'increment', 'conditionals', 'score tracking'],
    steps: [
      {
        stepId: 'm8_s1_score_counter',
        concepts: ['collides_with', 'score', 'increment'],
        instruction: 'Write code to collect coins and keep score!',
        detailedExplanation: "collides_with('COIN') returns True every frame that your hero is touching a coin. When that happens: remove_colliding('COIN') makes it disappear, score += 1 adds 1 to the score (a shortcut for score = score + 1), and show_score(score) updates the number on screen.",
        starterCode: `# ✅ Platforms from Mission 5
platforms = [
    (0,   300, 400, 40),
    (450, 250, 200, 40),
    (700, 200, 150, 40),
]
for p in platforms:
    add_platform(p[0], p[1], p[2], p[3])

# ✅ Smooth movement + jump from Missions 4 & 6
speed = 5
def movement():
    if is_key_pressed('LEFT'):
        move(-speed)
    if is_key_pressed('RIGHT'):
        move(speed)
on_update(movement)

JUMP_STRENGTH = -15
def jump():
    if is_on_ground():
        set_player_vy(JUMP_STRENGTH)
on_key_down('SPACE', jump)

# ✅ Coins from Mission 7 — already placed!
add_coin(120, 260)
add_coin(520, 210)
add_coin(750, 160)

# --- Mission 8: Make coins collectable! ---
score = 0
show_score(score)

def update():
    global score
    # YOUR CODE: check if touching a COIN, then:
    #   remove_colliding('COIN')   — make it disappear
    #   score += 1                 — add 1 to score
    #   show_score(score)          — update the display
    pass

on_update(update)
print('Jump into the coins — nothing happens yet! Add your code to collect them.')
`,
        hint: "Inside update(), replace 'pass' with: if collides_with('COIN'):  (new line)      remove_colliding('COIN') (new line)      score += 1 (new line)      show_score(score)",
        solutionCode: `platforms = [
    (0,   300, 400, 40),
    (450, 250, 200, 40),
    (700, 200, 150, 40),
]
for p in platforms:
    add_platform(p[0], p[1], p[2], p[3])

speed = 5
def movement():
    if is_key_pressed('LEFT'):
        move(-speed)
    if is_key_pressed('RIGHT'):
        move(speed)
on_update(movement)

JUMP_STRENGTH = -15
def jump():
    if is_on_ground():
        set_player_vy(JUMP_STRENGTH)
on_key_down('SPACE', jump)

add_coin(120, 260)
add_coin(520, 210)
add_coin(750, 160)

score = 0
show_score(score)

def update():
    global score
    if collides_with('COIN'):
        remove_colliding('COIN')
        score += 1
        show_score(score)
        play_sound('coin')
        print(f'Got a coin! Score: {score} 🪙')

on_update(update)
`,
        successCriteria: [
          'Coins disappear when touched',
          'Score increases with each coin',
          'Score displays on screen'
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_calls_function', name: 'collides_with' },
            { type: 'ast_calls_function', name: 'remove_colliding' },
            { type: 'ast_has_assignment', variable: 'score' }
          ]
        },
        reward: { stars: 4, badge: 'Treasure Hunter' }
      },
      {
        stepId: 'm8_s2_choose_win_rule',
        concepts: ['conditionals', 'variables'],
        instruction: 'Pick how players win: reach the goal OR collect enough coins!',
        detailedExplanation: "Different games have different win conditions. You get to choose what makes YOUR game winnable!",
        starterCode: `# ✅ Platforms, controls + jump from previous missions
platforms = [
    (0,   300, 400, 40),
    (450, 250, 200, 40),
    (700, 200, 150, 40),
]
for p in platforms:
    add_platform(p[0], p[1], p[2], p[3])

speed = 5
def movement():
    if is_key_pressed('LEFT'):
        move(-speed)
    if is_key_pressed('RIGHT'):
        move(speed)
on_update(movement)

JUMP_STRENGTH = -15
def jump():
    if is_on_ground():
        set_player_vy(JUMP_STRENGTH)
on_key_down('SPACE', jump)

# ✅ Coins + goal from Mission 7
add_coin(120, 260)
add_coin(520, 210)
add_coin(750, 160)
add_goal(720, 160)

# ✅ Coin collection from Mission 8 Step 1
score = 0
show_score(score)

# --- Mission 8 Step 2: Choose your win rule! ---
# 'reach_goal'    — touch the flag to win
# 'collect_coins' — collect all 3 coins to win
WIN_RULE = 'collect_coins'
COINS_TO_WIN = 3

def update():
    global score
    if collides_with('COIN'):
        remove_colliding('COIN')
        score += 1
        show_score(score)
        if WIN_RULE == 'collect_coins' and score >= COINS_TO_WIN:
            show_message('🎉 YOU WIN! 🎉')
            play_sound('victory')
    # YOUR CODE: add an if check for collides_with('GOAL') to win another way!

on_update(update)

rule_text = f'{WIN_RULE}: {COINS_TO_WIN} coins' if WIN_RULE == 'collect_coins' else WIN_RULE
print(f'Win condition: {rule_text}')
`,
        hint: "Try WIN_RULE = 'reach_goal' to make touching the flag the way to win!",
        successCriteria: [
          'WIN_RULE can be changed between options',
          'Correct win condition triggers victory'
        ],
        validation: {
          type: 'runtime',
          checks: [
            { type: 'win_rule_switchable' }
          ]
        },
        reward: { stars: 4, badge: 'Game Designer' },
        customization: {
          type: 'rules',
          description: 'Choose your win condition',
          options: ['reach_goal', 'collect_coins']
        }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // MISSION 9: Enemies and Game Over
  // --------------------------------------------------------------------------
  {
    missionId: 'm9_enemy_and_game_over',
    title: 'Mission 9: Enemies and Game Over',
    purpose: 'Teach basic AI (looping movement) and game states.',
    storyIntro: "Coins are great, but games need DANGER too! 😈 Let's add a slime that patrols your level. If it catches you, you lose a life — run out of lives and it is GAME OVER!",
    estimatedMinutes: 30,
    learningOutcomes: ['add_enemy', 'set_enemy_x', 'direction variable', 'collides_with ENEMY', 'lives'],
    steps: [
      {
        stepId: 'm9_s1_enemy_patrol',
        concepts: ['direction variable', 'set_enemy_x', 'on_update'],
        instruction: 'Add a slime and make it patrol — write the code inside update_enemy!',
        detailedExplanation: "add_enemy('slime', x, y) places a slime on screen. To make it move we use a direction variable: enemy_dir = 1 means moving RIGHT, -1 means moving LEFT. Every frame (60 times per second) we add enemy_speed × enemy_dir to enemy_x, then call set_enemy_x('slime', enemy_x) to actually move the slime on screen. When enemy_x passes right_bound we flip enemy_dir to -1 (turn left). When it passes left_bound we flip to 1 (turn right). We need 'global enemy_x, enemy_dir' inside the function so Python knows we are changing the outer variables, not creating new ones.",
        starterCode: `# ✅ Platforms, controls + jump from previous missions
platforms = [
    (0,   300, 400, 40),
    (450, 250, 200, 40),
    (700, 200, 150, 40),
]
for p in platforms:
    add_platform(p[0], p[1], p[2], p[3])

speed = 5
def movement():
    if is_key_pressed('LEFT'):
        move(-speed)
    if is_key_pressed('RIGHT'):
        move(speed)
on_update(movement)

JUMP_STRENGTH = -15
def jump():
    if is_on_ground():
        set_player_vy(JUMP_STRENGTH)
on_key_down('SPACE', jump)

# ✅ Coins + goal from Mission 7
add_coin(120, 260)
add_coin(520, 210)
add_coin(750, 160)
add_goal(720, 160)

# ✅ Coin collection from Mission 8
score = 0
show_score(score)
def collect():
    global score
    if collides_with('COIN'):
        remove_colliding('COIN')
        score += 1
        show_score(score)
on_update(collect)

# --- Mission 9 Step 1: Make the slime patrol! ---
enemy_x = 400      # slime's starting x position
enemy_dir = 1      # direction: 1 = RIGHT, -1 = LEFT
enemy_speed = 2    # pixels moved each frame
left_bound = 350   # turn around here (left wall)
right_bound = 550  # turn around here (right wall)

add_enemy('slime', enemy_x, 260)

def update_enemy():
    global enemy_x, enemy_dir

    # 1. Move the slime: add speed × direction to enemy_x
    enemy_x = enemy_x + (enemy_speed * enemy_dir)

    # 2. YOUR CODE — flip direction at each boundary:
    #    if enemy_x >= right_bound:   enemy_dir = -1
    #    if enemy_x <= left_bound:    enemy_dir = 1

    # 3. Move the slime on screen to its new position
    set_enemy_x('slime', enemy_x)

on_update(update_enemy)
print('Add the direction-flip code in Step 2 above! 👾')
`,
        hint: "After the movement line, add:\n    if enemy_x >= right_bound:\n        enemy_dir = -1\n    if enemy_x <= left_bound:\n        enemy_dir = 1",
        solutionCode: `platforms = [
    (0,   300, 400, 40),
    (450, 250, 200, 40),
    (700, 200, 150, 40),
]
for p in platforms:
    add_platform(p[0], p[1], p[2], p[3])

speed = 5
def movement():
    if is_key_pressed('LEFT'):
        move(-speed)
    if is_key_pressed('RIGHT'):
        move(speed)
on_update(movement)

JUMP_STRENGTH = -15
def jump():
    if is_on_ground():
        set_player_vy(JUMP_STRENGTH)
on_key_down('SPACE', jump)

add_coin(120, 260)
add_coin(520, 210)
add_coin(750, 160)
add_goal(720, 160)

score = 0
show_score(score)
def collect():
    global score
    if collides_with('COIN'):
        remove_colliding('COIN')
        score += 1
        show_score(score)
on_update(collect)

enemy_x = 400
enemy_dir = 1
enemy_speed = 2
left_bound = 350
right_bound = 550

add_enemy('slime', enemy_x, 260)

def update_enemy():
    global enemy_x, enemy_dir
    enemy_x = enemy_x + (enemy_speed * enemy_dir)
    if enemy_x >= right_bound:
        enemy_dir = -1
    if enemy_x <= left_bound:
        enemy_dir = 1
    set_enemy_x('slime', enemy_x)

on_update(update_enemy)
print('Watch out for the slime! 👾')
`,
        successCriteria: [
          'Slime moves left and right on screen',
          'Slime reverses direction at the boundaries'
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_calls_function', name: 'set_enemy_x' },
            { type: 'ast_calls_function', name: 'add_enemy' },
            { type: 'ast_has_if' }
          ]
        },
        reward: { stars: 4, badge: 'Enemy Engineer' }
      },
      {
        stepId: 'm9_s2_game_over',
        concepts: ['collides_with', 'lives', 'game over'],
        instruction: 'Lose a life when the slime touches you — write the body of the if block!',
        detailedExplanation: "collides_with('ENEMY') works exactly like collides_with('COIN') from Mission 8 — it returns True when the player is touching any enemy. When that happens we want to: take away one life (lives -= 1), update the hearts on screen (show_lives), send the player back to the start (reset_player_position), and if lives reach zero show a Game Over message. The patrol() function call keeps the slime moving every frame.",
        starterCode: `# ✅ Platforms, controls + jump from previous missions
platforms = [
    (0,   300, 400, 40),
    (450, 250, 200, 40),
    (700, 200, 150, 40),
]
for p in platforms:
    add_platform(p[0], p[1], p[2], p[3])

speed = 5
def movement():
    if is_key_pressed('LEFT'):
        move(-speed)
    if is_key_pressed('RIGHT'):
        move(speed)
on_update(movement)

JUMP_STRENGTH = -15
def jump():
    if is_on_ground():
        set_player_vy(JUMP_STRENGTH)
on_key_down('SPACE', jump)

# ✅ Coins + goal from Mission 7
add_coin(120, 260)
add_coin(520, 210)
add_coin(750, 160)
add_goal(720, 160)

# ✅ Coin collection from Mission 8
score = 0
show_score(score)
def collect():
    global score
    if collides_with('COIN'):
        remove_colliding('COIN')
        score += 1
        show_score(score)
on_update(collect)

# ✅ Slime patrol from Step 1
enemy_x = 400
enemy_dir = 1
enemy_speed = 2
add_enemy('slime', enemy_x, 260)
def patrol():
    global enemy_x, enemy_dir
    enemy_x = enemy_x + (enemy_speed * enemy_dir)
    if enemy_x >= 550:
        enemy_dir = -1
    if enemy_x <= 350:
        enemy_dir = 1
    set_enemy_x('slime', enemy_x)

# --- Mission 9 Step 2: Lose a life when touched! ---
lives = 3
show_lives(lives)

def update():
    global lives
    patrol()  # keep the slime moving every frame

    if collides_with('ENEMY'):
        # YOUR CODE — write 4 lines inside this if block:
        # 1. lives -= 1
        # 2. show_lives(lives)
        # 3. reset_player_position()
        # 4. if lives <= 0:
        #        show_message('💀 GAME OVER 💀')
        pass

on_update(update)
print(f'You have {lives} lives ❤️  — walk into the slime to test!')
`,
        hint: "Replace 'pass' with the 4 lines. Each line goes inside the 'if collides_with' block — indent them 8 spaces (2 tabs). The inner 'if lives <= 0' needs its show_message indented one more level.",
        solutionCode: `platforms = [
    (0,   300, 400, 40),
    (450, 250, 200, 40),
    (700, 200, 150, 40),
]
for p in platforms:
    add_platform(p[0], p[1], p[2], p[3])

speed = 5
def movement():
    if is_key_pressed('LEFT'):
        move(-speed)
    if is_key_pressed('RIGHT'):
        move(speed)
on_update(movement)

JUMP_STRENGTH = -15
def jump():
    if is_on_ground():
        set_player_vy(JUMP_STRENGTH)
on_key_down('SPACE', jump)

add_coin(120, 260)
add_coin(520, 210)
add_coin(750, 160)
add_goal(720, 160)

score = 0
show_score(score)
def collect():
    global score
    if collides_with('COIN'):
        remove_colliding('COIN')
        score += 1
        show_score(score)
on_update(collect)

enemy_x = 400
enemy_dir = 1
enemy_speed = 2
add_enemy('slime', enemy_x, 260)
def patrol():
    global enemy_x, enemy_dir
    enemy_x = enemy_x + (enemy_speed * enemy_dir)
    if enemy_x >= 550:
        enemy_dir = -1
    if enemy_x <= 350:
        enemy_dir = 1
    set_enemy_x('slime', enemy_x)

lives = 3
show_lives(lives)

def update():
    global lives
    patrol()
    if collides_with('ENEMY'):
        lives -= 1
        show_lives(lives)
        reset_player_position()
        if lives <= 0:
            show_message('💀 GAME OVER 💀')

on_update(update)
print(f'Lives: {lives} ❤️')
`,
        successCriteria: [
          'Touching the slime reduces lives',
          'Hearts on screen update',
          'Player returns to start when hit',
          'Game Over shows when all lives are gone'
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_calls_function', name: 'collides_with' },
            { type: 'ast_calls_function', name: 'reset_player_position' },
            { type: 'ast_calls_function', name: 'show_lives' }
          ]
        },
        reward: { stars: 5, badge: 'Game Maker' }
      },
      {
        stepId: 'm9_s3_choose_enemy_type',
        concepts: ['variables', 'difficulty', 'experimentation'],
        instruction: 'Make your game harder — tune the enemy and add your own challenge!',
        detailedExplanation: "Game designers call this 'balancing' — tweaking numbers until the game feels fun but challenging. Try changing enemy_speed (higher = faster), patrol zone (wider = bigger threat area), and lives (more lives = more forgiving). Then try the challenge: add play_sound('hurt') and play_sound('game_over') to the right places to make the game feel more alive!",
        starterCode: `# ✅ Platforms, controls + jump from previous missions
platforms = [
    (0,   300, 400, 40),
    (450, 250, 200, 40),
    (700, 200, 150, 40),
]
for p in platforms:
    add_platform(p[0], p[1], p[2], p[3])

speed = 5
def movement():
    if is_key_pressed('LEFT'):
        move(-speed)
    if is_key_pressed('RIGHT'):
        move(speed)
on_update(movement)

JUMP_STRENGTH = -15
def jump():
    if is_on_ground():
        set_player_vy(JUMP_STRENGTH)
on_key_down('SPACE', jump)

# ✅ Coins + goal from Mission 7
add_coin(120, 260)
add_coin(520, 210)
add_coin(750, 160)
add_goal(720, 160)

# ✅ Coin collection from Mission 8
score = 0
show_score(score)
def collect():
    global score
    if collides_with('COIN'):
        remove_colliding('COIN')
        score += 1
        show_score(score)
on_update(collect)

# ✅ Slime patrol + lives from Steps 1 & 2
enemy_x = 400
enemy_dir = 1
add_enemy('slime', enemy_x, 260)
def patrol():
    global enemy_x, enemy_dir
    enemy_x = enemy_x + (enemy_speed * enemy_dir)
    if enemy_x >= right_bound:
        enemy_dir = -1
    if enemy_x <= left_bound:
        enemy_dir = 1
    set_enemy_x('slime', enemy_x)

lives = 3
show_lives(lives)

def update():
    global lives
    patrol()
    if collides_with('ENEMY'):
        lives -= 1
        show_lives(lives)
        reset_player_position()
        # YOUR CODE: add play_sound('hurt') here
        if lives <= 0:
            show_message('💀 GAME OVER 💀')
            # YOUR CODE: add play_sound('game_over') here

on_update(update)

# --- Mission 9 Step 3: Tune these values! ---
# Try changing them and pressing Run Code to feel the difference.
enemy_speed = 2    # 1 = slow, 3 = tricky, 5 = very fast
left_bound = 350   # patrol left wall  (try 100 to make it cover more ground)
right_bound = 550  # patrol right wall (try 700 to match)

print(f'Speed={enemy_speed} | Zone: {left_bound}–{right_bound} | Lives={lives}')
`,
        hint: "Find the two '# YOUR CODE' comments inside the update() function and replace them with play_sound('hurt') and play_sound('game_over'). Then try changing enemy_speed to 3 or 4 and pressing Run Code to feel the difference!",
        successCriteria: [
          'play_sound called when player is hit',
          'play_sound called on game over',
          'Enemy tuning variables adjusted'
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_calls_function', name: 'play_sound' }
          ]
        },
        reward: { stars: 4, badge: 'Boss Builder' }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // MISSION 10: Win the Level
  // --------------------------------------------------------------------------
  {
    missionId: 'm10_win_condition_and_polish',
    title: 'Mission 10: Win the Level',
    purpose: 'Teach goal states and finishing a project.',
    storyIntro: "This is it! 🏁 The final mission! Your platformer has everything - movement, platforms, coins, enemies. Now let's add the GOAL so players can WIN!",
    estimatedMinutes: 20,
    learningOutcomes: ['conditionals', 'state', 'win conditions', 'polish'],
    steps: [
      {
        stepId: 'm10_s1_goal_flag',
        concepts: ['conditionals', 'state'],
        instruction: 'Add a goal flag. Reach it to win the game!',
        detailedExplanation: "The goal is the finish line of your game. When the player touches it, they win! This is the moment all the gameplay leads to.",
        starterCode: `# ✅ Platforms, controls + jump from previous missions
platforms = [
    (0,   300, 400, 40),
    (450, 250, 200, 40),
    (700, 200, 150, 40),
]
for p in platforms:
    add_platform(p[0], p[1], p[2], p[3])

speed = 5
def movement():
    if is_key_pressed('LEFT'):
        move(-speed)
    if is_key_pressed('RIGHT'):
        move(speed)
on_update(movement)

JUMP_STRENGTH = -15
def jump():
    if is_on_ground():
        set_player_vy(JUMP_STRENGTH)
on_key_down('SPACE', jump)

# ✅ Coins + goal from Mission 7, collection from Mission 8
score = 0
add_coin(120, 260)
add_coin(520, 210)
add_coin(750, 160)
add_goal(720, 160)
show_score(score)

# --- Mission 10: Make reaching the goal trigger a WIN! ---
has_won = False

def update():
    global score, has_won
    if collides_with('COIN'):
        remove_colliding('COIN')
        score += 1
        show_score(score)
    if not has_won and collides_with('GOAL'):
        has_won = True
        show_message('🎉 YOU WIN! 🎉')
        play_sound('victory')
        freeze_enemies()
        print('VICTORY! 🏆')

on_update(update)
print('Reach the flag to WIN! 🚩')
`,
        hint: "Try moving the goal to different positions with add_goal(x, y) to make it easier or harder to reach!",
        successCriteria: [
          'Reaching the goal triggers victory',
          'Win message displays',
          'Next level unlocks'
        ],
        validation: {
          type: 'runtime',
          checks: [
            { type: 'win_triggered' }
          ]
        },
        reward: { stars: 5, badge: 'Platformer Complete' }
      }
    ]
  }
];

// =============================================================================
// EXPORT MISSION PACK
// =============================================================================

export const platformerMissionPack: MissionPack = {
  packId: 'platformer_v1',
  packTitle: 'Build Your First Platformer',
  description: 'Learn Python by building a real platformer game! Move, jump, collect coins, defeat enemies, and reach the goal.',
  targetAgeRange: '8-14',
  gameTemplate: platformerTemplate,
  missions,
  learningOutcomes: [
    'Variables and types',
    'Functions',
    'Conditionals (if/elif/else)',
    'Loops (for)',
    'Lists',
    'Events and state',
    'Simple physics (position/velocity)',
    'Collision detection',
    'Debugging and reading errors'
  ]
};

// Helper to get a specific mission by ID
export function getMissionById(missionId: string): Mission | undefined {
  return missions.find(m => m.missionId === missionId);
}

// Helper to get a specific step
export function getStepById(missionId: string, stepId: string) {
  const mission = getMissionById(missionId);
  return mission?.steps.find(s => s.stepId === stepId);
}

// Helper to get the next step
export function getNextStep(currentMissionId: string, currentStepId: string) {
  const mission = getMissionById(currentMissionId);
  if (!mission) return null;
  
  const stepIndex = mission.steps.findIndex(s => s.stepId === currentStepId);
  
  // If there's a next step in this mission
  if (stepIndex < mission.steps.length - 1) {
    return {
      mission,
      step: mission.steps[stepIndex + 1]
    };
  }
  
  // Otherwise, get the first step of the next mission
  const missionIndex = missions.findIndex(m => m.missionId === currentMissionId);
  if (missionIndex < missions.length - 1) {
    const nextMission = missions[missionIndex + 1];
    return {
      mission: nextMission,
      step: nextMission.steps[0]
    };
  }
  
  return null; // No more steps/missions
}

