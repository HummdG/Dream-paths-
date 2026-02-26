/**
 * Lesson Scaffolder
 *
 * Personalizes coding lessons with the user's actual level data.
 * The game is already running via GamePreview — lessons teach Python
 * by directly manipulating it with move(), print(), add_platform(), etc.
 */

import { LevelData } from '@/components/level-designer/level-designer';
import { CodePhase } from './index';

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
  return [
    generateLesson1(levelData, childName, heroName),
    generateLesson2(levelData, childName, heroName),
    generateLesson3(levelData, childName, heroName),
    generateLesson4(levelData, childName, heroName),
    generateLesson5(levelData, childName, heroName),
  ];
}

// =============================================================================
// LESSON 1: Make Your Hero Talk
// print(), say(), show_message()
// =============================================================================

function generateLesson1(
  levelData: LevelData,
  childName: string,
  heroName: string
): PersonalizedLesson {
  return {
    id: 'lesson_1_print',
    phase: 1,
    title: '🗣️ Make Your Hero Talk',
    description: 'Use print() and show_message() to make your hero speak!',
    concepts: ['print()', 'strings', 'show_message()'],
    levelName: levelData.name,
    childName,
    heroName,
    totalXp: 150,
    steps: [
      {
        id: 'l1_step1_print',
        title: 'Say Hello!',
        instruction: `Make ${heroName} say something using print().`,
        explanation: `In Python, print() shows text. In this game it also makes ${heroName} say it in a speech bubble above their head! Think of print() like giving your hero a voice — whatever you put in the quotes is what they say. Try changing the message to anything you want!`,
        starterCode: `# Make your hero say something!
print("Hello! I am ${heroName}!")
`,
        solutionCode: `print("Hello! I am ${heroName}!")`,
        hints: [
          'Make sure your text is between quote marks "like this"',
          `Try changing the message — what does ${heroName} want to say?`,
          'Press Run Code! to see the speech bubble appear on screen'
        ],
        expectedOutput: `Hello! I am ${heroName}!`,
        validation: [
          { type: 'contains', value: 'print(' },
          { type: 'runs_without_error', value: '' }
        ],
        rewards: { xp: 40 }
      },
      {
        id: 'l1_step2_multiple_prints',
        title: 'Tell a Story',
        instruction: `Use three print() statements to tell a mini story about ${heroName}.`,
        explanation: `You can use multiple print() calls — each one creates a new message. This is like writing lines in a script for your hero. Real games use this to show dialogue, instructions, and story text. Try adding a third line about the level!`,
        starterCode: `# Tell a 3-line story!
print("Hi! I'm ${heroName}!")
print("I'm ready to explore ${levelData.name}!")
print("Let's go!")
`,
        solutionCode: `print("Hi! I'm ${heroName}!")
print("I'm ready to explore ${levelData.name}!")
print("Let's go!")`,
        hints: [
          'Each print() shows one message in the speech bubble',
          `The level is called "${levelData.name}" — try using that name!`,
          'Add an exclamation mark to make it more exciting!'
        ],
        validation: [
          { type: 'contains', value: 'print(' },
          { type: 'output_contains', value: heroName }
        ],
        rewards: { xp: 40 }
      },
      {
        id: 'l1_step3_show_message',
        title: 'Big Screen Message',
        instruction: `Use show_message() to display a bold message in the centre of the game screen.`,
        explanation: `show_message() puts text in the middle of the game canvas — like a loading screen or announcement. print() is a speech bubble near your hero; show_message() is a broadcast to the whole screen. Game designers use these for level intros, tutorials, and countdowns. Try using both together!`,
        starterCode: `# Speech bubble from the hero
print("Get ready...")

# Big message on screen
show_message("Welcome to ${levelData.name}!")
`,
        solutionCode: `print("Get ready...")
show_message("Welcome to ${levelData.name}!")`,
        hints: [
          'show_message() takes a string in quotes just like print()',
          'You can use both print() and show_message() at the same time',
          `Try: show_message("Level: ${levelData.name} — GO!")`
        ],
        validation: [
          { type: 'calls_function', value: 'show_message' },
          { type: 'runs_without_error', value: '' }
        ],
        rewards: { xp: 70, badge: 'Storyteller' }
      }
    ]
  };
}

// =============================================================================
// LESSON 2: Move Your Hero
// move(), set_player_position(), variables
// =============================================================================

function generateLesson2(
  levelData: LevelData,
  _childName: string,
  heroName: string
): PersonalizedLesson {
  return {
    id: 'lesson_2_move',
    phase: 2,
    title: '🏃 Move Your Hero',
    description: 'Make your hero slide left and right using move()!',
    concepts: ['move()', 'variables', 'numbers'],
    levelName: levelData.name,
    childName: _childName,
    heroName,
    totalXp: 200,
    steps: [
      {
        id: 'l2_step1_move',
        title: 'Slide Right!',
        instruction: `Call move(100) to slide ${heroName} to the right.`,
        explanation: `move() is like telling your hero "take X steps". The number inside is how many pixels to move. Positive numbers go right, negative numbers go left. Think of it like a number line — right is positive, left is negative. Watch the hero slide!`,
        starterCode: `# Move the hero right by 100 pixels
move(100)
print("${heroName} moved right!")
`,
        solutionCode: `move(100)
print("${heroName} moved right!")`,
        hints: [
          'The number inside move() is how many pixels to slide',
          'Try move(200) for a bigger slide!',
          'After clicking Run, watch the game screen — the hero will move'
        ],
        validation: [
          { type: 'calls_function', value: 'move' },
          { type: 'runs_without_error', value: '' }
        ],
        rewards: { xp: 50 }
      },
      {
        id: 'l2_step2_variable_speed',
        title: 'Speed Variable',
        instruction: `Create a variable called speed, then use it inside move().`,
        explanation: `Variables are like labelled boxes that store values. Instead of typing 80 directly into move(80), you create a box called "speed" and put 80 inside. Then move(speed) uses whatever is in that box. This is powerful because you only need to change the number in ONE place to affect everything — real game devs do this!`,
        starterCode: `# Create a speed variable
speed = 80

# Use the variable
move(speed)
print(f"${heroName} moved at speed {speed}")
`,
        solutionCode: `speed = 80
move(speed)
print(f"${heroName} moved at speed {speed}")`,
        hints: [
          'speed = 80 creates a variable with value 80',
          'Change speed = 80 to speed = 150 and run again — see the difference?',
          'The f"..." string lets you put {speed} inside to show the value'
        ],
        validation: [
          { type: 'contains', value: 'speed' },
          { type: 'calls_function', value: 'move' },
          { type: 'runs_without_error', value: '' }
        ],
        rewards: { xp: 60 }
      },
      {
        id: 'l2_step3_multi_move',
        title: 'Dance Moves',
        instruction: `Make ${heroName} do a three-step dance: right, left, then right again.`,
        explanation: `You can call move() multiple times in a row. Each call is applied instantly to the hero's position. This is how cutscenes and scripted animations work in real games — a sequence of position commands. Try making a little dance pattern! Negative numbers move left.`,
        starterCode: `# Three-step dance!
move(100)   # Step right
move(-50)   # Step back left
move(75)    # Step right again

print("${heroName} danced!")
`,
        solutionCode: `move(100)
move(-50)
move(75)
print("${heroName} danced!")`,
        hints: [
          'Positive move() = right, negative move() = left',
          'Each move() adds to the previous position',
          'Try your own pattern: move(200) move(-200) move(50)'
        ],
        validation: [
          { type: 'calls_function', value: 'move' },
          { type: 'output_contains', value: heroName }
        ],
        rewards: { xp: 90, badge: 'Mover' }
      }
    ]
  };
}

// =============================================================================
// LESSON 3: Build Your Level
// add_platform(), add_coin(), for loops
// =============================================================================

function generateLesson3(
  levelData: LevelData,
  _childName: string,
  heroName: string
): PersonalizedLesson {
  const theme = levelData.theme || 'space';

  return {
    id: 'lesson_3_build',
    phase: 3,
    title: '🏗️ Build Your Level',
    description: 'Place platforms and coins using add_platform() and add_coin()!',
    concepts: ['add_platform()', 'add_coin()', 'lists', 'for loops'],
    levelName: levelData.name,
    childName: _childName,
    heroName,
    totalXp: 250,
    steps: [
      {
        id: 'l3_step1_platform',
        title: 'Place a Platform',
        instruction: `Use add_platform(x, y, width, height) to add a floating platform.`,
        explanation: `add_platform() places a solid platform your hero can stand on. The four numbers are: x (left position), y (top position), width (how wide), height (how tall). Coordinates start at the top-left of the screen (0, 0). Lower y values are higher up — like a map where north is up. Run this and you'll see a platform appear!`,
        starterCode: `# Set the theme
set_theme("${theme}")

# Add a floating platform
# add_platform(x, y, width, height)
add_platform(200, 280, 200, 20)

print("Platform placed!")
`,
        solutionCode: `set_theme("${theme}")
add_platform(200, 280, 200, 20)
print("Platform placed!")`,
        hints: [
          'Try add_platform(100, 300, 300, 20) for a wide ground platform',
          'A lower y value puts the platform higher up on screen',
          'Width controls how long the platform is — try 400!'
        ],
        validation: [
          { type: 'calls_function', value: 'add_platform' },
          { type: 'runs_without_error', value: '' }
        ],
        rewards: { xp: 70 }
      },
      {
        id: 'l3_step2_coin',
        title: 'Add a Coin',
        instruction: `Use add_coin(x, y) to place a collectible coin in the level.`,
        explanation: `add_coin() places a shiny coin that players can collect. Coins give players a reason to explore your level — they reward curiosity. Place it somewhere interesting: floating above a platform, at the end of a jump, or hidden in a corner. In real platformer games, level designers spend hours perfecting coin placement!`,
        starterCode: `# Add a platform to stand on
add_platform(200, 300, 300, 20)

# Add a coin floating above the platform
add_coin(320, 260)

print("Coin added! Can you collect it?")
`,
        solutionCode: `add_platform(200, 300, 300, 20)
add_coin(320, 260)
print("Coin added!")`,
        hints: [
          'Place the coin above a platform so the player can reach it',
          'Try add_coin(400, 200) for a coin higher up',
          'Move the hero with move() to try collecting the coin!'
        ],
        validation: [
          { type: 'calls_function', value: 'add_coin' },
          { type: 'runs_without_error', value: '' }
        ],
        rewards: { xp: 70 }
      },
      {
        id: 'l3_step3_for_loop',
        title: 'Build with a Loop',
        instruction: `Use a for loop to add multiple platforms from a list.`,
        explanation: `A list holds multiple items in square brackets, separated by commas. A for loop goes through each item and does something with it. Instead of writing add_platform() ten times, you write it once inside the loop. This is how real games load level data — a single loop processes hundreds of platforms. The 'for p in platforms:' means "for each item in platforms, call it p and run the code below".`,
        starterCode: `# A list of platforms: (x, y, width, height)
platforms = [
    (0, 360, 800, 20),    # Ground
    (150, 280, 180, 20),  # Low platform
    (400, 210, 180, 20),  # Mid platform
]

# Loop through and add each one
for p in platforms:
    add_platform(p[0], p[1], p[2], p[3])

print(f"Built {len(platforms)} platforms!")
`,
        solutionCode: `platforms = [
    (0, 360, 800, 20),
    (150, 280, 180, 20),
    (400, 210, 180, 20),
]
for p in platforms:
    add_platform(p[0], p[1], p[2], p[3])`,
        hints: [
          'Try adding a fourth platform to the list — just add another (x, y, width, height) line',
          'len(platforms) tells you how many items are in the list',
          'p[0] is the first value, p[1] is second, p[2] is third, p[3] is fourth'
        ],
        validation: [
          { type: 'contains', value: 'for ' },
          { type: 'calls_function', value: 'add_platform' },
          { type: 'runs_without_error', value: '' }
        ],
        rewards: { xp: 110, badge: 'Level Builder' }
      }
    ]
  };
}

// =============================================================================
// LESSON 4: Score and Win
// score variable, show_score(), collides_with(), you_win()
// =============================================================================

function generateLesson4(
  levelData: LevelData,
  _childName: string,
  heroName: string
): PersonalizedLesson {
  return {
    id: 'lesson_4_score',
    phase: 4,
    title: '🏆 Score and Win',
    description: 'Track score, collect coins, and set up a win condition!',
    concepts: ['score variable', 'show_score()', 'collides_with()', 'you_win()'],
    levelName: levelData.name,
    childName: _childName,
    heroName,
    totalXp: 300,
    steps: [
      {
        id: 'l4_step1_score_display',
        title: 'Show the Score',
        instruction: `Create a score variable and display it on screen with show_score().`,
        explanation: `Every game needs a way to track progress. score = 0 creates a variable starting at zero. show_score() puts it in the top-left corner of the game canvas where players can see it. Think of variables like memory slots in the computer — score = 0 reserves a slot called "score" and puts 0 in it. Later we'll change that number when the player collects coins!`,
        starterCode: `# Start with zero points
score = 0

# Show it on the game screen
show_score(score)

print(f"Score: {score}")
`,
        solutionCode: `score = 0
show_score(score)
print(f"Score: {score}")`,
        hints: [
          'score = 0 creates the variable; show_score(score) displays it',
          'Try changing score = 0 to score = 10 to see a different starting number',
          'show_score() always shows the current value of whatever you pass it'
        ],
        validation: [
          { type: 'contains', value: 'score' },
          { type: 'calls_function', value: 'show_score' },
          { type: 'runs_without_error', value: '' }
        ],
        rewards: { xp: 80 }
      },
      {
        id: 'l4_step2_collect_coin',
        title: 'Collect a Coin',
        instruction: `Add a coin and collect it: move ${heroName} into it, then check with collides_with().`,
        explanation: `collides_with('COIN') checks if your hero is touching a coin right now — it returns True or False. This is called collision detection and it's one of the most important concepts in game programming. Move the hero into the coin with move(), then check if they're touching. If yes, score goes up! += 1 is a shortcut for score = score + 1.`,
        starterCode: `score = 0
show_score(score)

# Add a coin right in front of the hero
add_coin(180, 295)

# Move hero into the coin
move(80)

# Check if touching a coin
if collides_with('COIN'):
    remove_colliding('COIN')
    score += 1
    show_score(score)
    print(f"Coin collected! Score: {score}")
else:
    print("Not touching a coin yet")
`,
        solutionCode: `score = 0
add_coin(180, 295)
move(80)
if collides_with('COIN'):
    remove_colliding('COIN')
    score += 1
    show_score(score)`,
        hints: [
          "collides_with('COIN') is True when the hero overlaps a coin",
          'remove_colliding() makes the coin disappear when collected',
          'Try moving more with move(120) if the hero misses the coin'
        ],
        validation: [
          { type: 'calls_function', value: 'collides_with' },
          { type: 'contains', value: 'score' },
          { type: 'runs_without_error', value: '' }
        ],
        rewards: { xp: 100 }
      },
      {
        id: 'l4_step3_win_condition',
        title: 'Add a Win Condition',
        instruction: `Place a goal flag and call you_win() when ${heroName} reaches it.`,
        explanation: `Every game needs an ending — a moment where the player wins! add_goal() places a flag the player aims for. When you detect a collision with it, call you_win() and the game shows a victory screen. This is the loop that makes games satisfying: challenge → effort → reward. The if/not game_won check prevents winning multiple times!`,
        starterCode: `game_won = False

# Place a goal flag
add_goal(700, 300)

# Move hero toward the goal
move(600)

# Check if reached the goal
if not game_won and collides_with('GOAL'):
    game_won = True
    show_message("🎉 YOU WIN!")
    you_win()
    print("Victory!")
`,
        solutionCode: `game_won = False
add_goal(700, 300)
move(600)
if not game_won and collides_with('GOAL'):
    game_won = True
    show_message("🎉 YOU WIN!")
    you_win()`,
        hints: [
          "add_goal(x, y) places the flag; collides_with('GOAL') checks if touching it",
          'game_won = True prevents winning multiple times',
          'Try move(700) if the hero is not reaching the flag'
        ],
        validation: [
          { type: 'calls_function', value: 'add_goal' },
          { type: 'calls_function', value: 'you_win' },
          { type: 'runs_without_error', value: '' }
        ],
        rewards: { xp: 120, badge: 'Win Condition Set' }
      }
    ]
  };
}

// =============================================================================
// LESSON 5: Keyboard Controls
// on_key_down(), on_update(), lambdas, set_player_vy()
// =============================================================================

function generateLesson5(
  levelData: LevelData,
  _childName: string,
  heroName: string
): PersonalizedLesson {
  return {
    id: 'lesson_5_controls',
    phase: 5,
    title: '⌨️ Keyboard Controls',
    description: 'Hook up arrow keys and make your hero jump!',
    concepts: ['on_key_down()', 'on_update()', 'lambda', 'set_player_vy()'],
    levelName: levelData.name,
    childName: _childName,
    heroName,
    totalXp: 400,
    steps: [
      {
        id: 'l5_step1_right_key',
        title: 'Arrow Key — Right',
        instruction: `Use on_key_down('RIGHT', ...) so pressing the right arrow moves ${heroName}.`,
        explanation: `on_key_down() registers a listener — it says "whenever the RIGHT key is pressed, run this code". The lambda: move(50) is a mini function written in one line. It's like setting a trap: whenever the key is pressed the trap fires and the hero moves. This is the pattern used in every game ever made! After clicking Run Code!, try pressing → on your keyboard.`,
        starterCode: `# Pressing RIGHT arrow moves the hero
on_key_down('RIGHT', lambda: move(50))

print("Press → to move right!")
`,
        solutionCode: `on_key_down('RIGHT', lambda: move(50))
print("Press → to move right!")`,
        hints: [
          "on_key_down('RIGHT', ...) fires when you press the right arrow key",
          "lambda: move(50) is a shorthand function — it means 'when called, run move(50)'",
          'Click Run Code!, then click the game canvas, then press →'
        ],
        validation: [
          { type: 'calls_function', value: 'on_key_down' },
          { type: 'runs_without_error', value: '' }
        ],
        rewards: { xp: 100 }
      },
      {
        id: 'l5_step2_both_directions',
        title: 'Left and Right',
        instruction: `Add both LEFT and RIGHT arrow key controls for ${heroName}.`,
        explanation: `Now we register two listeners — one for LEFT, one for RIGHT. The LEFT key moves the hero in the negative direction (move(-50)). Try changing the number to control speed. You can also print a message when a key is pressed so you know it fired. After running, click the game and use both arrow keys!`,
        starterCode: `# RIGHT arrow → move right
on_key_down('RIGHT', lambda: move(50))

# LEFT arrow → move left
on_key_down('LEFT', lambda: move(-50))

print("Use ← → arrow keys to move!")
`,
        solutionCode: `on_key_down('RIGHT', lambda: move(50))
on_key_down('LEFT', lambda: move(-50))
print("Use ← → arrow keys to move!")`,
        hints: [
          'Negative move() values move the hero left',
          'Try changing 50 to 100 for faster movement',
          'Click on the game canvas first, then press the arrow keys'
        ],
        validation: [
          { type: 'calls_function', value: 'on_key_down' },
          { type: 'contains', value: 'LEFT' },
          { type: 'contains', value: 'RIGHT' },
          { type: 'runs_without_error', value: '' }
        ],
        rewards: { xp: 120 }
      },
      {
        id: 'l5_step3_jump',
        title: 'Add Jumping',
        instruction: `Press SPACE to jump! Use set_player_vy() with a guard so ${heroName} can only jump on the ground.`,
        explanation: `set_player_vy() sets the hero's vertical velocity — how fast they move up or down. Negative numbers go up (because y=0 is the top of the screen). The is_on_ground() check is a guard: it prevents double-jumping in mid-air. Without it, the player could jump infinitely! This is the same logic used in Super Mario Bros. Once you run this, try pressing SPACE while standing on a platform.`,
        starterCode: `# Arrow key controls
on_key_down('RIGHT', lambda: move(50))
on_key_down('LEFT', lambda: move(-50))

# Jump with SPACE — only when on the ground!
def try_jump():
    if is_on_ground():
        set_player_vy(-15)  # Negative = upward
        print("Jump!")
    else:
        print("Can't jump mid-air!")

on_key_down('SPACE', try_jump)

print("Use ← → to move, SPACE to jump!")
`,
        solutionCode: `on_key_down('RIGHT', lambda: move(50))
on_key_down('LEFT', lambda: move(-50))
def try_jump():
    if is_on_ground():
        set_player_vy(-15)
on_key_down('SPACE', try_jump)`,
        hints: [
          'set_player_vy(-15) makes the hero launch upward — bigger negatives jump higher',
          'is_on_ground() returns True only when touching a platform',
          'The def try_jump(): block defines a named function — on_key_down calls it on SPACE'
        ],
        validation: [
          { type: 'calls_function', value: 'on_key_down' },
          { type: 'calls_function', value: 'set_player_vy' },
          { type: 'contains', value: 'is_on_ground' },
          { type: 'runs_without_error', value: '' }
        ],
        rewards: { xp: 180, badge: 'Game Controller' }
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
