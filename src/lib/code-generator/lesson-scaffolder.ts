/**
 * Lesson Scaffolder
 * 
 * Personalizes coding lessons with the user's actual level data.
 * Creates a "fill-in-the-blanks" experience where kids complete
 * code that controls THEIR game.
 */

import { LevelData } from '@/components/level-designer/level-designer';
import { CodePhase, generateCode, getPhaseSummaries } from './index';

export interface LessonStep {
  id: string;
  title: string;
  instruction: string;
  explanation: string;
  starterCode: string;
  solutionCode: string;
  hints: string[];
  expectedOutput?: string;
  validation: ValidationRule[];
  rewards: {
    xp: number;
    badge?: string;
  };
}

export interface ValidationRule {
  type: 'contains' | 'output_contains' | 'runs_without_error' | 'calls_function';
  value: string;
}

export interface Lesson {
  id: string;
  phase: CodePhase;
  title: string;
  description: string;
  concepts: string[];
  steps: LessonStep[];
  totalXp: number;
}

export interface PersonalizedLesson extends Lesson {
  levelName: string;
  childName: string;
  heroName: string;
}

/**
 * Generate all lessons for a given level
 */
export function generateLessonsForLevel(
  levelData: LevelData,
  childName: string,
  heroName: string = "Hero"
): PersonalizedLesson[] {
  const lessons: PersonalizedLesson[] = [];
  
  // Lesson 1: Hello World & Print
  lessons.push(generateLesson1(levelData, childName, heroName));
  
  // Lesson 2: Variables
  lessons.push(generateLesson2(levelData, childName, heroName));
  
  // Lesson 3: Lists & Loops
  lessons.push(generateLesson3(levelData, childName, heroName));
  
  // Lesson 4: Functions
  lessons.push(generateLesson4(levelData, childName, heroName));
  
  // Lesson 5: Complete Game
  lessons.push(generateLesson5(levelData, childName, heroName));
  
  return lessons;
}

/**
 * Lesson 1: Hello World - Print statements and basic function calls
 */
function generateLesson1(
  levelData: LevelData,
  childName: string,
  heroName: string
): PersonalizedLesson {
  return {
    id: 'lesson_1_hello_world',
    phase: 1,
    title: '🌟 Hello World!',
    description: 'Write your first Python code and see it come to life!',
    concepts: ['print()', 'strings', 'function calls'],
    levelName: levelData.name,
    childName,
    heroName,
    totalXp: 150,
    steps: [
      {
        id: 'l1_step1_first_print',
        title: 'Say Hello!',
        instruction: `Let's make ${heroName} say something! Type a message in the print() function.`,
        explanation: `In Python, \`print()\` shows text on the screen. But in YOUR game, it also makes ${heroName} say it in a speech bubble! Try it!`,
        starterCode: `# Type your message between the quotes!
print("Hello, I am ${heroName}!")
`,
        solutionCode: `print("Hello, I am ${heroName}!")`,
        hints: [
          "Make sure your text is between the quote marks \"like this\"",
          "You can change the message to say anything you want!",
          "Press the Run button to see what happens"
        ],
        expectedOutput: `Hello, I am ${heroName}!`,
        validation: [
          { type: 'contains', value: 'print(' },
          { type: 'runs_without_error', value: '' }
        ],
        rewards: { xp: 30 }
      },
      {
        id: 'l1_step2_multiple_prints',
        title: 'Tell a Story',
        instruction: `Great job! Now let's have ${heroName} tell us about the level you made!`,
        explanation: `You can use multiple print() statements to show several messages. Each one becomes a new speech bubble!`,
        starterCode: `# Make ${heroName} introduce the level!
print("Welcome to ${levelData.name}!")
print("I'm ${heroName}!")
print("Let's have an adventure!")
`,
        solutionCode: `print("Welcome to ${levelData.name}!")
print("I'm ${heroName}!")
print("Let's have an adventure!")`,
        hints: [
          "Each print() shows one message",
          "Try adding your own print() with a custom message!",
          "Don't forget the quotes around your text"
        ],
        validation: [
          { type: 'contains', value: 'print(' },
          { type: 'output_contains', value: levelData.name }
        ],
        rewards: { xp: 40 }
      },
      {
        id: 'l1_step3_load_level',
        title: 'Load Your Level',
        instruction: `Now let's actually load the level "${levelData.name}" that you designed!`,
        explanation: `Functions do specific jobs. \`load_my_level()\` loads the level you designed, and \`setup_simple_game()\` adds the controls. Watch your game appear!`,
        starterCode: `# Say hello
print("Loading ${levelData.name}...")

# Load YOUR level!
load_my_level("${levelData.name}")

# Add controls
setup_simple_game()

# Ready to play!
print("Game loaded! Use arrow keys to move!")
`,
        solutionCode: `print("Loading ${levelData.name}...")
load_my_level("${levelData.name}")
setup_simple_game()
print("Game loaded! Use arrow keys to move!")`,
        hints: [
          "load_my_level() needs your level name in quotes",
          "setup_simple_game() adds arrow key controls",
          "After running this, try playing your game!"
        ],
        validation: [
          { type: 'calls_function', value: 'load_my_level' },
          { type: 'calls_function', value: 'setup_simple_game' },
          { type: 'runs_without_error', value: '' }
        ],
        rewards: { xp: 80, badge: 'First Game Loaded' }
      }
    ]
  };
}

/**
 * Lesson 2: Variables - Store and use data
 */
function generateLesson2(
  levelData: LevelData,
  childName: string,
  heroName: string
): PersonalizedLesson {
  const coinCount = levelData.objects.filter(o => o.type === 'coin').length;
  const platformCount = levelData.objects.filter(o => o.type === 'platform').length;
  
  return {
    id: 'lesson_2_variables',
    phase: 2,
    title: '📦 Variables',
    description: 'Learn to store information in labeled boxes!',
    concepts: ['variables', 'numbers', 'strings', 'f-strings'],
    levelName: levelData.name,
    childName,
    heroName,
    totalXp: 200,
    steps: [
      {
        id: 'l2_step1_create_variable',
        title: 'Create a Variable',
        instruction: `Variables are like labeled boxes. Let's create one to store ${heroName}'s speed!`,
        explanation: `A variable has a name and a value. \`speed = 5\` creates a box called "speed" with the number 5 inside. You can change this number to make ${heroName} faster or slower!`,
        starterCode: `# Create a speed variable - try different numbers!
speed = 5

# Use the variable
print(f"${heroName}'s speed is {speed}")

# Try changing speed to 10 and run again!
`,
        solutionCode: `speed = 5
print(f"${heroName}'s speed is {speed}")`,
        hints: [
          "Try changing speed = 5 to speed = 10",
          "The {speed} in the print shows the variable's value",
          "Variable names can't have spaces - use underscores like player_speed"
        ],
        validation: [
          { type: 'contains', value: 'speed' },
          { type: 'contains', value: '=' },
          { type: 'runs_without_error', value: '' }
        ],
        rewards: { xp: 40 }
      },
      {
        id: 'l2_step2_multiple_variables',
        title: 'Game Settings',
        instruction: `Let's create variables for all your game settings!`,
        explanation: `You can have many variables! Each one stores a different piece of information about your game. This makes it easy to customize everything.`,
        starterCode: `# Game settings
game_name = "${levelData.name}"
theme = "${levelData.theme}"
player_speed = 5
jump_power = 15

# Count what's in your level
num_coins = ${coinCount}
num_platforms = ${platformCount}

# Show the settings
print(f"🎮 Game: {game_name}")
print(f"🎨 Theme: {theme}")
print(f"⚡ Speed: {player_speed}")
print(f"🦘 Jump: {jump_power}")
print(f"🪙 Coins: {num_coins}")
`,
        solutionCode: `game_name = "${levelData.name}"
theme = "${levelData.theme}"
player_speed = 5
jump_power = 15
num_coins = ${coinCount}
num_platforms = ${platformCount}`,
        hints: [
          "f-strings let you put variables inside text using {variable_name}",
          "Try changing player_speed to 10 - it will update in the message!",
          `Your level "${levelData.name}" has ${coinCount} coins`
        ],
        validation: [
          { type: 'contains', value: 'game_name' },
          { type: 'contains', value: 'player_speed' },
          { type: 'runs_without_error', value: '' }
        ],
        rewards: { xp: 60 }
      },
      {
        id: 'l2_step3_use_variables',
        title: 'Use Your Variables',
        instruction: `Now let's use these variables to actually load and configure your game!`,
        explanation: `Instead of typing "${levelData.name}" every time, we can use the variable game_name. This is called "using a variable" - Python replaces it with the stored value.`,
        starterCode: `# Your game settings
game_name = "${levelData.name}"
theme = "${levelData.theme}"

print(f"Loading {game_name}...")

# Use variables instead of typing names!
set_theme(theme)
load_my_level(game_name)
setup_simple_game()

print(f"{game_name} is ready to play!")
`,
        solutionCode: `game_name = "${levelData.name}"
theme = "${levelData.theme}"
set_theme(theme)
load_my_level(game_name)
setup_simple_game()`,
        hints: [
          "set_theme() changes the visual style of your game",
          "Using variables means you only change the value in one place",
          "Try changing theme to 'space' or 'city' at the top!"
        ],
        validation: [
          { type: 'calls_function', value: 'set_theme' },
          { type: 'calls_function', value: 'load_my_level' },
          { type: 'runs_without_error', value: '' }
        ],
        rewards: { xp: 100, badge: 'Variable Master' }
      }
    ]
  };
}

/**
 * Lesson 3: Lists & Loops
 */
function generateLesson3(
  levelData: LevelData,
  childName: string,
  heroName: string
): PersonalizedLesson {
  const platforms = levelData.objects.filter(o => o.type === 'platform').slice(0, 3);
  const coins = levelData.objects.filter(o => o.type === 'coin').slice(0, 3);
  
  const platformData = platforms.map(p => `(${p.x * 20}, ${p.y * 20}, ${p.width * 20}, ${p.height * 20})`).join(', ');
  const coinData = coins.map(c => `(${c.x * 20}, ${c.y * 20})`).join(', ');
  
  return {
    id: 'lesson_3_lists_loops',
    phase: 3,
    title: '🔄 Lists & Loops',
    description: 'Work with collections and repeat actions!',
    concepts: ['lists', 'tuples', 'for loops', 'len()'],
    levelName: levelData.name,
    childName,
    heroName,
    totalXp: 250,
    steps: [
      {
        id: 'l3_step1_lists',
        title: 'Create a List',
        instruction: `A list holds multiple items. Let's make a list of messages for ${heroName} to say!`,
        explanation: `Lists use square brackets [] and items are separated by commas. They're perfect for storing collections of things!`,
        starterCode: `# A list of messages
messages = [
    "Hello!",
    "Welcome to ${levelData.name}!",
    "Let's collect some coins!",
    "Watch out for enemies!"
]

# Show all messages
print(messages)
print(f"We have {len(messages)} messages!")
`,
        solutionCode: `messages = ["Hello!", "Welcome!", "Let's play!"]`,
        hints: [
          "Lists use square brackets []",
          "len() tells you how many items are in a list",
          "Try adding your own message to the list!"
        ],
        validation: [
          { type: 'contains', value: '[' },
          { type: 'contains', value: ']' },
          { type: 'runs_without_error', value: '' }
        ],
        rewards: { xp: 50 }
      },
      {
        id: 'l3_step2_for_loops',
        title: 'Loop Through Items',
        instruction: `Instead of printing each message one by one, let's use a loop!`,
        explanation: `A for loop goes through each item in a list and does something with it. It saves you from writing the same code over and over!`,
        starterCode: `# Messages for ${heroName}
messages = [
    "Hello!",
    "Welcome to ${levelData.name}!",
    "Ready to play?"
]

# Loop through and print each message
for message in messages:
    print(message)

print("All messages said!")
`,
        solutionCode: `for message in messages:
    print(message)`,
        hints: [
          "The 'for' keyword starts the loop",
          "'message' is a variable that holds each item as we go",
          "Everything indented under the for runs for each item"
        ],
        validation: [
          { type: 'contains', value: 'for ' },
          { type: 'contains', value: ' in ' },
          { type: 'runs_without_error', value: '' }
        ],
        rewards: { xp: 70 }
      },
      {
        id: 'l3_step3_build_platforms',
        title: 'Build Platforms with Loops',
        instruction: `Now the real magic - let's build YOUR level's platforms using a loop!`,
        explanation: `Your level has platforms stored as positions. We can loop through them and add each one to the game. This is how real games are built!`,
        starterCode: `print("Building ${levelData.name}...")

set_theme("${levelData.theme}")

# Your platform positions from the level designer!
# Format: (x, y, width, height)
platforms = [
    ${platformData || '(0, 360, 800, 40)'}
]

# Build each platform
for x, y, width, height in platforms:
    add_platform(x, y, width, height)
    print(f"Platform at ({x}, {y})")

print(f"Built {len(platforms)} platforms!")

# Set up the game
setup_simple_game()
`,
        solutionCode: `platforms = [${platformData}]
for x, y, width, height in platforms:
    add_platform(x, y, width, height)`,
        hints: [
          "Each platform is a tuple: (x, y, width, height)",
          "The for loop 'unpacks' the tuple into 4 variables",
          "add_platform() creates the platform in the game"
        ],
        validation: [
          { type: 'contains', value: 'for ' },
          { type: 'calls_function', value: 'add_platform' },
          { type: 'runs_without_error', value: '' }
        ],
        rewards: { xp: 130, badge: 'Loop Legend' }
      }
    ]
  };
}

/**
 * Lesson 4: Functions
 */
function generateLesson4(
  levelData: LevelData,
  childName: string,
  heroName: string
): PersonalizedLesson {
  return {
    id: 'lesson_4_functions',
    phase: 4,
    title: '🔧 Functions',
    description: 'Create reusable blocks of code!',
    concepts: ['def', 'parameters', 'return', 'calling functions'],
    levelName: levelData.name,
    childName,
    heroName,
    totalXp: 300,
    steps: [
      {
        id: 'l4_step1_first_function',
        title: 'Create a Function',
        instruction: `Functions are reusable blocks of code with a name. Let's make one for ${heroName}!`,
        explanation: `Use 'def' to define a function, give it a name, and put your code inside (indented). Then you can call it anytime!`,
        starterCode: `# Create a function
def say_hello():
    print("Hello!")
    print("I'm ${heroName}!")
    print("Ready to play ${levelData.name}!")

# Call the function
say_hello()

# You can call it again!
say_hello()
`,
        solutionCode: `def say_hello():
    print("Hello!")
say_hello()`,
        hints: [
          "'def' means 'define a function'",
          "Don't forget the colon : at the end of the def line",
          "The code inside must be indented (4 spaces)"
        ],
        validation: [
          { type: 'contains', value: 'def ' },
          { type: 'runs_without_error', value: '' }
        ],
        rewards: { xp: 60 }
      },
      {
        id: 'l4_step2_parameters',
        title: 'Add Parameters',
        instruction: `Parameters let you pass information INTO a function!`,
        explanation: `Parameters are like slots where you put values when calling the function. This makes functions flexible and reusable.`,
        starterCode: `# Function with a parameter
def greet(name):
    print(f"Hello, {name}!")
    print(f"Welcome to ${levelData.name}!")

# Call with different names
greet("${childName}")
greet("${heroName}")
greet("Player")
`,
        solutionCode: `def greet(name):
    print(f"Hello, {name}!")
greet("${childName}")`,
        hints: [
          "The parameter 'name' becomes a variable inside the function",
          "You can pass different values each time you call it",
          "Try calling greet() with your own name!"
        ],
        validation: [
          { type: 'contains', value: 'def ' },
          { type: 'contains', value: '(' },
          { type: 'runs_without_error', value: '' }
        ],
        rewards: { xp: 80 }
      },
      {
        id: 'l4_step3_build_game',
        title: 'Organize Your Game',
        instruction: `Let's organize your entire game into clean functions!`,
        explanation: `Real game developers organize code into functions. Each function does one job. This makes code easier to understand and change!`,
        starterCode: `# Function to set up the level
def setup_level():
    print("Setting up ${levelData.name}...")
    set_theme("${levelData.theme}")
    load_my_level("${levelData.name}")
    print("Level loaded!")

# Function to set up controls
def setup_controls():
    print("Adding controls...")
    setup_simple_game()
    print("Controls ready!")

# Function to start the game
def start_game():
    print("🎮 Starting game!")
    setup_level()
    setup_controls()
    print("Have fun playing!")

# Run everything!
start_game()
`,
        solutionCode: `def setup_level():
    set_theme("${levelData.theme}")
    load_my_level("${levelData.name}")

def start_game():
    setup_level()
    setup_simple_game()

start_game()`,
        hints: [
          "Each function has one job",
          "start_game() calls the other functions in order",
          "You only need to call start_game() to run everything!"
        ],
        validation: [
          { type: 'contains', value: 'def setup_level' },
          { type: 'contains', value: 'def start_game' },
          { type: 'runs_without_error', value: '' }
        ],
        rewards: { xp: 160, badge: 'Function Wizard' }
      }
    ]
  };
}

/**
 * Lesson 5: Complete Game
 */
function generateLesson5(
  levelData: LevelData,
  childName: string,
  heroName: string
): PersonalizedLesson {
  const coinCount = levelData.objects.filter(o => o.type === 'coin').length;
  
  return {
    id: 'lesson_5_complete_game',
    phase: 5,
    title: '🚀 Complete Game',
    description: 'Put it all together - physics, scoring, and win conditions!',
    concepts: ['state', 'game loop', 'conditionals', 'events'],
    levelName: levelData.name,
    childName,
    heroName,
    totalXp: 400,
    steps: [
      {
        id: 'l5_step1_game_state',
        title: 'Track Game State',
        instruction: `Games need to remember things - like your score and lives. These are called "state"!`,
        explanation: `State variables track information that changes during the game. Score goes up when you collect coins. Lives go down when you get hit!`,
        starterCode: `# Game state - things that change while playing
score = 0
lives = 3

# Show initial state
show_score(score)
show_lives(lives)

print(f"Score: {score}, Lives: {lives}")
print("Your game state is set up!")

# Load the level
set_theme("${levelData.theme}")
load_my_level("${levelData.name}")
setup_simple_game()
`,
        solutionCode: `score = 0
lives = 3
show_score(score)
show_lives(lives)`,
        hints: [
          "Variables at the top of your code are 'global' state",
          "show_score() and show_lives() update the display",
          "These values will change as you play!"
        ],
        validation: [
          { type: 'contains', value: 'score' },
          { type: 'contains', value: 'lives' },
          { type: 'runs_without_error', value: '' }
        ],
        rewards: { xp: 80 }
      },
      {
        id: 'l5_step2_collecting',
        title: 'Collect Coins',
        instruction: `Let's make ${heroName} collect coins and increase the score!`,
        explanation: `We check if ${heroName} touches a coin. If they do, we remove the coin, add to the score, and play a sound. Instant gratification!`,
        starterCode: `score = 0
show_score(score)

# Set up the level
set_theme("${levelData.theme}")
load_my_level("${levelData.name}")

# This function runs when touching a coin
def collect_coin():
    global score
    if collides_with('COIN'):
        remove_colliding('COIN')
        score = score + 1
        show_score(score)
        play_sound('coin')
        print(f"🪙 Got a coin! Score: {score}")

# Check for coins every frame
on_update(collect_coin)

# Add controls
setup_simple_game()

print("Collect all ${coinCount} coins!")
`,
        solutionCode: `def collect_coin():
    global score
    if collides_with('COIN'):
        remove_colliding('COIN')
        score += 1
        show_score(score)`,
        hints: [
          "'global score' lets us change the score variable inside the function",
          "collides_with('COIN') checks if touching a coin",
          "on_update() makes this function run every frame"
        ],
        validation: [
          { type: 'contains', value: 'collides_with' },
          { type: 'contains', value: 'global score' },
          { type: 'runs_without_error', value: '' }
        ],
        rewards: { xp: 120 }
      },
      {
        id: 'l5_step3_win_condition',
        title: 'Win the Game!',
        instruction: `The final step - let ${heroName} WIN when reaching the goal!`,
        explanation: `We check if ${heroName} touches the goal. When they do - VICTORY! Confetti, sounds, celebration!`,
        starterCode: `score = 0
game_won = False

show_score(score)
set_theme("${levelData.theme}")
load_my_level("${levelData.name}")

def collect_coin():
    global score
    if collides_with('COIN'):
        remove_colliding('COIN')
        score += 1
        show_score(score)
        print(f"🪙 Score: {score}")

def check_win():
    global game_won
    if not game_won and collides_with('GOAL'):
        game_won = True
        show_message("🎉 YOU WIN! 🎉")
        play_sound('victory')
        freeze_enemies()
        print("🏆 VICTORY!")

def game_loop():
    collect_coin()
    check_win()

on_update(game_loop)
setup_simple_game()

print("Reach the goal to win!")
`,
        solutionCode: `def check_win():
    global game_won
    if not game_won and collides_with('GOAL'):
        game_won = True
        show_message("🎉 YOU WIN! 🎉")`,
        hints: [
          "game_won prevents winning multiple times",
          "collides_with('GOAL') checks if touching the flag",
          "freeze_enemies() stops enemies when you win"
        ],
        validation: [
          { type: 'contains', value: 'collides_with' },
          { type: 'contains', value: 'GOAL' },
          { type: 'runs_without_error', value: '' }
        ],
        rewards: { xp: 200, badge: 'Game Developer' }
      }
    ]
  };
}

/**
 * Get a specific lesson by ID
 */
export function getLessonById(
  lessons: PersonalizedLesson[],
  lessonId: string
): PersonalizedLesson | undefined {
  return lessons.find(l => l.id === lessonId);
}

/**
 * Get progress summary for lessons
 */
export function calculateLessonProgress(
  lessons: PersonalizedLesson[],
  completedStepIds: string[]
): {
  totalSteps: number;
  completedSteps: number;
  totalXp: number;
  earnedXp: number;
  currentLesson: PersonalizedLesson | null;
  currentStep: LessonStep | null;
  percentComplete: number;
} {
  let totalSteps = 0;
  let completedSteps = 0;
  let totalXp = 0;
  let earnedXp = 0;
  let currentLesson: PersonalizedLesson | null = null;
  let currentStep: LessonStep | null = null;

  for (const lesson of lessons) {
    for (const step of lesson.steps) {
      totalSteps++;
      totalXp += step.rewards.xp;
      
      if (completedStepIds.includes(step.id)) {
        completedSteps++;
        earnedXp += step.rewards.xp;
      } else if (!currentStep) {
        currentLesson = lesson;
        currentStep = step;
      }
    }
  }

  return {
    totalSteps,
    completedSteps,
    totalXp,
    earnedXp,
    currentLesson,
    currentStep,
    percentComplete: totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0
  };
}



