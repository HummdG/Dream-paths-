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
    purpose: 'Teach functions and reuse.',
    storyIntro: "Your player is in the game! 🏃 But they're just standing there... Let's teach them to move! We'll create a function - that's like a recipe the computer can follow.",
    estimatedMinutes: 15,
    learningOutcomes: ['functions', 'parameters', 'def keyword'],
    steps: [
      {
        stepId: 'm3_s1_define_move',
        concepts: ['functions', 'parameters'],
        instruction: 'Write a function called `move()` that moves the player left or right.',
        detailedExplanation: "A function is a reusable piece of code. We use `def` to define it, give it a name, and put our code inside. The `dx` parameter tells us how far to move.",
        starterCode: `# Let's create a movement function!
# 'dx' means 'change in x' - positive goes right, negative goes left

def move(dx):
    # Get the player's current position
    current_x = get_player_x()
    
    # Calculate new position
    new_x = current_x + dx
    
    # Move the player!
    set_player_x(new_x)

# Test your function!
# move(50) moves right, move(-50) moves left
move(50)
print('Player moved right!')
`,
        hint: "Try adding move(-50) after move(50) to see the player go right then left!",
        successCriteria: [
          "Function 'move' exists in your code",
          'Calling move(50) moves the player right',
          'Calling move(-50) moves the player left'
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_has_function', name: 'move' },
            { type: 'ast_calls_function', name: 'move' }
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
    purpose: 'Introduce events + if statements.',
    storyIntro: "Functions are awesome! 🚀 Now let's connect them to the keyboard so YOU can control the player. We'll learn about `if` - teaching the computer to make decisions!",
    estimatedMinutes: 20,
    learningOutcomes: ['events', 'if/elif statements', 'keyboard input'],
    steps: [
      {
        stepId: 'm4_s1_left_right_keys',
        concepts: ['events', 'if/elif'],
        instruction: 'Use if/elif to move the player when LEFT or RIGHT arrow keys are pressed.',
        detailedExplanation: "`if` lets us check something and do different things. `elif` means 'else if' - another check if the first wasn't true.",
        starterCode: `# Player speed - try different numbers!
speed = 5

# This function runs when a key is pressed
def on_key(key):
    # Check which key was pressed
    if key == 'LEFT':
        # Move left (negative direction)
        move(-speed)
        print('Moving left!')
    elif key == 'RIGHT':
        # Move right (positive direction)
        move(speed)
        print('Moving right!')

# Connect arrow keys to our function
on_key_down('LEFT', lambda: on_key('LEFT'))
on_key_down('RIGHT', lambda: on_key('RIGHT'))

print('Use arrow keys to move! ⬅️ ➡️')
`,
        hint: "Try changing speed = 10 to move faster, or speed = 2 to move slower!",
        successCriteria: [
          'LEFT arrow moves player left',
          'RIGHT arrow moves player right',
          'Uses if/elif (not separate duplicate code)'
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
    title: 'Mission 6: Jump and Gravity',
    purpose: 'Introduce velocity, update loop, and simple physics.',
    storyIntro: "Platforms are ready! 🏗️ But your player is floating... Let's add GRAVITY so they fall down, and JUMPING so they can leap to higher platforms!",
    estimatedMinutes: 25,
    learningOutcomes: ['state', 'update loop', 'velocity', 'global keyword'],
    steps: [
      {
        stepId: 'm6_s1_velocity',
        concepts: ['state', 'update loop'],
        instruction: 'Add vertical velocity (vy) and gravity to make the player fall.',
        detailedExplanation: "Velocity is how fast something is moving. Gravity pulls things down by adding to velocity every frame. `global` lets us change a variable from inside a function.",
        starterCode: `# Vertical velocity - starts at 0 (not moving up or down)
vy = 0

# Gravity - pulls the player down each frame
gravity = 1

# This function runs every frame (60 times per second!)
def update():
    global vy  # We need 'global' to change vy inside the function
    
    # Gravity pulls down (increases vy)
    vy = vy + gravity
    
    # Move the player by vy
    move_player_y(vy)

# Start the update loop
on_update(update)

print('Gravity is ON! Watch the player fall! 🍎')
`,
        hint: "Try changing gravity = 0.5 to fall slower, or gravity = 2 to fall faster!",
        successCriteria: [
          'Player falls down when not on a platform',
          'vy increases over time due to gravity'
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_has_assignment', variable: 'vy' },
            { type: 'ast_calls_function', name: 'on_update' }
          ]
        },
        reward: { stars: 3, badge: 'Physics Apprentice' }
      },
      {
        stepId: 'm6_s2_jump',
        concepts: ['conditionals', 'functions'],
        instruction: 'Let the player jump, but only when touching the ground!',
        detailedExplanation: "We need to check if the player is on the ground before letting them jump. This prevents infinite jumping in mid-air!",
        starterCode: `# Jump strength - negative because up is negative y
jump_strength = -15

def try_jump():
    global vy
    
    # Only jump if we're on the ground!
    if is_on_ground():
        vy = jump_strength
        print('Jump! 🦘')
    else:
        print("Can't jump in mid-air!")

# Press SPACE to jump
on_key_down('SPACE', try_jump)

print('Press SPACE to jump! 🚀')
`,
        hint: "Try changing jump_strength = -20 for a higher jump, or -10 for a smaller hop!",
        successCriteria: [
          'SPACE key triggers a jump',
          'Cannot double-jump in mid-air'
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_has_if' },
            { type: 'ast_has_on_key_handler' },
            { type: 'ast_calls_function', name: 'set_player_vy' }
          ]
        },
        reward: { stars: 3, badge: 'Jump Master' }
      },
      {
        stepId: 'm6_s3_choose_jump_style',
        concepts: ['booleans', 'conditionals'],
        instruction: 'Choose your jump style: Double Jump OR Super Jump!',
        detailedExplanation: "Booleans are True or False values. We can use them to turn features on or off. Pick ONE style to make your game feel unique!",
        starterCode: `# 🎮 CHOOSE YOUR JUMP STYLE!
# Pick ONE (not both!)
DOUBLE_JUMP = True   # Can jump again in mid-air
SUPER_JUMP = False   # One powerful jump

# Jump tracking (for double jump)
jumps_remaining = 2 if DOUBLE_JUMP else 1
normal_jump = -15
super_jump = -25

def try_jump():
    global vy, jumps_remaining
    
    if is_on_ground():
        jumps_remaining = 2 if DOUBLE_JUMP else 1
    
    if jumps_remaining > 0:
        if SUPER_JUMP and is_on_ground():
            vy = super_jump
            print('SUPER JUMP! 🚀')
        else:
            vy = normal_jump
            print('Jump!')
        jumps_remaining = jumps_remaining - 1

on_key_down('SPACE', try_jump)

style = 'Double Jump' if DOUBLE_JUMP else 'Super Jump'
print(f'Jump style: {style}')
`,
        hint: "Try DOUBLE_JUMP = False and SUPER_JUMP = True for powerful single jumps!",
        successCriteria: [
          'One jump style is enabled',
          'The jump behavior matches your choice'
        ],
        validation: {
          type: 'runtime',
          checks: [
            { type: 'jump_style_enabled' }
          ]
        },
        reward: { stars: 3, badge: 'Signature Move' },
        customization: {
          type: 'mechanics',
          description: 'Choose between double jump or super jump',
          options: ['double_jump', 'super_jump']
        }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // MISSION 7: Collision Detection
  // --------------------------------------------------------------------------
  {
    missionId: 'm7_collisions',
    title: 'Mission 7: Collision Detection',
    purpose: 'Teach boolean logic and checking interactions.',
    storyIntro: "Oops! 😅 The player falls through platforms. We need to teach the game to check when things TOUCH each other. This is called collision detection!",
    estimatedMinutes: 20,
    learningOutcomes: ['booleans', 'collision detection', 'if statements'],
    steps: [
      {
        stepId: 'm7_s1_platform_collision',
        concepts: ['booleans', 'if statements'],
        instruction: 'Stop the player from falling through platforms!',
        detailedExplanation: "We check if the player would collide with a platform BEFORE moving them. If they would, we stop their fall and put them on top of the platform.",
        starterCode: `vy = 0
gravity = 1

def update():
    global vy
    
    # Apply gravity
    vy = vy + gravity
    
    # Check for platform collision BEFORE moving
    if will_collide_below(vy):
        # Stop falling!
        vy = 0
        # Snap to top of platform
        snap_to_platform()
        print('Landed! 🛬')
    else:
        # No platform below, keep falling
        move_player_y(vy)

on_update(update)

print('Now you can land on platforms! 🎯')
`,
        hint: "The magic is in checking BEFORE moving. will_collide_below() looks ahead!",
        successCriteria: [
          'Player lands on platforms and stops falling',
          'vy resets to 0 when landing'
        ],
        validation: {
          type: 'runtime',
          checks: [
            { type: 'player_lands_on_platform' }
          ]
        },
        reward: { stars: 4, badge: 'Collision Crusher' }
      }
    ]
  },

  // --------------------------------------------------------------------------
  // MISSION 8: Coins and Score
  // --------------------------------------------------------------------------
  {
    missionId: 'm8_collectibles_and_score',
    title: 'Mission 8: Coins and Score',
    purpose: 'Teach counters, events, and simple game mechanics.',
    storyIntro: "Your platformer is taking shape! 🎮 Now let's add COINS to collect. Every great game has rewards - it makes players want to keep playing!",
    estimatedMinutes: 25,
    learningOutcomes: ['variables', 'increment', 'conditionals', 'score tracking'],
    steps: [
      {
        stepId: 'm8_s1_score_counter',
        concepts: ['variables', 'increment', 'conditionals'],
        instruction: 'Collect coins to increase your score!',
        detailedExplanation: "`score += 1` is a shortcut for `score = score + 1`. We check for coin collision each frame and update the score when touching one.",
        starterCode: `# Start with 0 points
score = 0

# Add some coins to the level
add_coin(120, 260)
add_coin(520, 240)
add_coin(750, 220)

def update():
    global score
    
    # Check if touching a coin
    if collides_with('COIN'):
        # Remove the coin we touched
        remove_colliding('COIN')
        
        # Add to score
        score += 1
        
        # Show the new score
        show_score(score)
        
        # Play a happy sound!
        play_sound('coin')
        print(f'Got a coin! Score: {score} 🪙')

on_update(update)

print('Collect all the coins! 🪙')
show_score(score)
`,
        hint: "Try adding more coins with add_coin(x, y) at different positions!",
        successCriteria: [
          'Coins disappear when collected',
          'Score increases with each coin',
          'Score displays on screen'
        ],
        validation: {
          type: 'runtime',
          checks: [
            { type: 'coin_collected' },
            { type: 'score_increments' }
          ]
        },
        reward: { stars: 4, badge: 'Treasure Hunter' }
      },
      {
        stepId: 'm8_s2_choose_win_rule',
        concepts: ['conditionals', 'variables'],
        instruction: 'Pick how players win: reach the goal OR collect enough coins!',
        detailedExplanation: "Different games have different win conditions. You get to choose what makes YOUR game winnable!",
        starterCode: `# 🏆 CHOOSE HOW TO WIN!
# 'reach_goal' - touch the flag to win
# 'collect_coins' - collect X coins to win
WIN_RULE = 'collect_coins'
COINS_TO_WIN = 3

score = 0

def check_win():
    global score
    
    if WIN_RULE == 'reach_goal':
        if collides_with('GOAL'):
            you_win()
    elif WIN_RULE == 'collect_coins':
        if score >= COINS_TO_WIN:
            you_win()

def you_win():
    show_message('🎉 YOU WIN! 🎉')
    play_sound('victory')
    stop_game()

# (Include in your main update loop)
# check_win()

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
    storyIntro: "Coins are great, but games need DANGER too! 😈 Let's add enemies that move around. If they catch you... GAME OVER!",
    estimatedMinutes: 30,
    learningOutcomes: ['state', 'direction', 'AI movement', 'game over'],
    steps: [
      {
        stepId: 'm9_s1_enemy_patrol',
        concepts: ['state', 'direction', 'conditionals'],
        instruction: 'Make an enemy patrol back and forth on a platform.',
        detailedExplanation: "The enemy needs to remember which direction it's going. When it reaches the edge, we flip the direction (multiply by -1).",
        starterCode: `# Enemy starting position
enemy_x = 400
enemy_speed = 2
enemy_dir = 1  # 1 = right, -1 = left

# Patrol boundaries
left_bound = 350
right_bound = 550

# Add the enemy to the game
add_enemy('slime', enemy_x, 260)

def update_enemy():
    global enemy_x, enemy_dir
    
    # Move in current direction
    enemy_x = enemy_x + (enemy_speed * enemy_dir)
    
    # Check boundaries and flip direction
    if enemy_x >= right_bound:
        enemy_dir = -1  # Go left
        print('Enemy turns left!')
    elif enemy_x <= left_bound:
        enemy_dir = 1   # Go right
        print('Enemy turns right!')
    
    # Update enemy position
    set_enemy_x('slime', enemy_x)

on_update(update_enemy)

print('Watch out for the enemy! 👾')
`,
        hint: "Try changing enemy_speed = 4 to make it faster and more dangerous!",
        successCriteria: [
          'Enemy moves continuously',
          'Enemy reverses direction at boundaries'
        ],
        validation: {
          type: 'runtime',
          checks: [
            { type: 'enemy_moves' },
            { type: 'enemy_reverses' }
          ]
        },
        reward: { stars: 4, badge: 'Enemy Engineer' }
      },
      {
        stepId: 'm9_s2_game_over',
        concepts: ['if', 'functions', 'reset'],
        instruction: 'Game Over when the player touches an enemy!',
        detailedExplanation: "We check for enemy collision each frame. If the player touches an enemy, show Game Over and restart the level.",
        starterCode: `lives = 3

def update():
    global lives
    
    # Check if touching an enemy
    if collides_with('ENEMY'):
        lives = lives - 1
        show_message(f'Ouch! Lives: {lives}')
        play_sound('hurt')
        
        # Reset player position
        reset_player_position()
        
        # Check for game over
        if lives <= 0:
            show_message('💀 GAME OVER 💀')
            play_sound('game_over')
            restart_level()

on_update(update)

print(f'Lives: {lives} ❤️')
show_lives(lives)
`,
        hint: "Try changing lives = 5 to give the player more chances!",
        successCriteria: [
          'Touching an enemy reduces lives',
          'Game Over shows when lives reach 0',
          'Level can restart'
        ],
        validation: {
          type: 'runtime',
          checks: [
            { type: 'game_over_on_enemy_collision' },
            { type: 'level_restarts' }
          ]
        },
        reward: { stars: 5, badge: 'Game Maker' }
      },
      {
        stepId: 'm9_s3_choose_enemy_type',
        concepts: ['strings', 'if/elif'],
        instruction: 'Choose your enemy type and its behavior!',
        detailedExplanation: "Different enemies can have different behaviors. Pick one that matches the feel you want for your game!",
        starterCode: `# 👾 CHOOSE YOUR ENEMY!
# 'slime' - patrols left/right on ground
# 'bat' - hovers up and down in the air  
# 'robot' - fast burst, then pauses

ENEMY_TYPE = 'slime'

enemy_x = 400
enemy_y = 260
move_dir = 1
move_timer = 0

def update_enemy():
    global enemy_x, enemy_y, move_dir, move_timer
    
    if ENEMY_TYPE == 'slime':
        # Patrol left/right
        enemy_x += 2 * move_dir
        if enemy_x > 550 or enemy_x < 350:
            move_dir *= -1
            
    elif ENEMY_TYPE == 'bat':
        # Hover up/down
        enemy_y += 2 * move_dir
        if enemy_y > 280 or enemy_y < 200:
            move_dir *= -1
            
    elif ENEMY_TYPE == 'robot':
        # Fast then pause
        move_timer += 1
        if move_timer < 30:
            enemy_x += 4 * move_dir
        elif move_timer > 60:
            move_timer = 0
            if enemy_x > 550 or enemy_x < 350:
                move_dir *= -1
    
    set_enemy_position(ENEMY_TYPE, enemy_x, enemy_y)

add_enemy(ENEMY_TYPE, enemy_x, enemy_y)
on_update(update_enemy)

print(f'Enemy type: {ENEMY_TYPE} 👾')
`,
        hint: "Try ENEMY_TYPE = 'bat' for a flying enemy, or 'robot' for unpredictable movement!",
        successCriteria: [
          'Enemy appears in the game',
          'Behavior matches the chosen type'
        ],
        validation: {
          type: 'runtime',
          checks: [
            { type: 'enemy_moves' },
            { type: 'enemy_behavior_matches_type' }
          ]
        },
        reward: { stars: 4, badge: 'Boss Builder' },
        customization: {
          type: 'mechanics',
          description: 'Choose enemy type and behavior',
          options: ['slime', 'bat', 'robot']
        }
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
        starterCode: `# Add the goal flag at the end of the level
add_goal(780, 160)

has_won = False

def update():
    global has_won
    
    # Only check if we haven't won yet
    if not has_won:
        # Check if touching the goal
        if collides_with('GOAL'):
            has_won = True
            
            # Victory!
            show_message('🎉 YOU WIN! 🎉')
            show_message('You completed the level!')
            play_sound('victory')
            
            # Stop all enemies
            freeze_enemies()
            
            # Unlock the next level
            unlock_next_level()
            
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

