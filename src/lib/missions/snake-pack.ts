/**
 * Snake Basics Mission Pack v1
 *
 * A gentle Python introduction through a Snake game.
 * Teaches comments, variables, functions, conditionals, and callbacks
 * before children tackle the full platformer.
 *
 * 4 missions × 3 steps = 12 steps total.
 * All missions have engineType: 'snake'.
 * Platformer pack is locked until this pack is fully completed.
 *
 * Starter code design principle:
 *   Show the scaffolding / context, but LEAVE the key concept blank.
 *   The student must write the missing piece to pass validation.
 */

import { MissionPack, Mission } from './schema';

// =============================================================================
// MISSIONS
// =============================================================================

const missions: Mission[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // SN1: Hello, Python! — comments, print, variables, f-strings
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'sn1_hello_python',
    title: 'Hello, Python!',
    purpose: 'Learn how to write comments, print messages, and use variables.',
    storyIntro:
      "Your snake is hungry and waiting! Before it can move, you need to learn the basics of Python. Let's start by making the snake say hello!",
    estimatedMinutes: 30,
    engineType: 'snake',
    learningOutcomes: ['comments', 'print()', 'variables', 'f-strings'],
    steps: [
      {
        stepId: 'sn1_s1_comments_and_print',
        concepts: ['comments', 'print'],
        instruction:
`Mission: Say hello to the snake world! 🐍

Write a comment and use print() to say hello.

Add your comment and print() call in the starter code below.`,
        detailedExplanation:
`💬 A comment starts with # — Python ignores that line. Use it to leave notes for yourself!

🖨️ print() shows a message on screen. Whatever's inside the quotes appears in the Output below.

✏️ Try it: print("Hello, snake!") — include the word "Hello" to pass the check!`,
        starterCode:
`# This is a comment! Python ignores lines that start with #
# Add a comment below explaining what this program does:


# Now write a print() call below to say hello — include the word "Hello":
`,
        hint:
`Type: print("Hello, snake!")
Don't forget the quotes around the text!
A comment looks like: # My snake program`,
        solutionCode:
`# This program says hello to the snake world!
print("Hello, snake!")
`,
        successCriteria: [
          'Your code calls print()',
          'The output contains the word "Hello"',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_calls_function', name: 'print' },
            { type: 'stdout_contains', text: 'Hello' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'sn1_s2_variables',
        concepts: ['variables', 'assignment'],
        instruction:
`Mission: Give your snake a name! 🐍

Create a variable called snake_name and print it.

Add both lines in the starter code below.`,
        detailedExplanation:
`📦 A variable is like a labelled box — choose a name, then store something with =

🐍 Try it: snake_name = "Slimy"  (text values need quotes around them)

🖨️ To print the value: print(snake_name) — no quotes around the variable name!`,
        starterCode:
`# Create a variable called snake_name and store your snake's name in it:
# (text values need quotes around them, like "Slimy")


# Now print the variable below — no quotes around the variable name:
`,
        hint:
`Write: snake_name = "Slimy"  (use quotes because it's text)
Then on the next line write: print(snake_name)  (no quotes — you want the VALUE inside the variable)`,
        solutionCode:
`snake_name = "Slimy"
print(snake_name)
`,
        successCriteria: [
          "Created a variable called 'snake_name'",
          'Called print() to show the variable',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_assignment', variable: 'snake_name' },
            { type: 'ast_calls_function', name: 'print' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'sn1_s3_fstrings',
        concepts: ['f-strings', 'string formatting'],
        instruction:
`Mission: Make your snake talk! 🐍

Your snake is called Slimy. Make it say how long it is!

The starter code is almost complete — replace ___ with the right function call.`,
        detailedExplanation:
`🔤 An f-string lets you put a variable inside a sentence — add f before the quote marks!

🐍 Wrap any variable (or function call) in { } curly braces and Python fills it in for you.

💡 There's a built-in function called get_snake_length() — it tells you how many segments the snake has.`,
        starterCode:
`snake_name = "Slimy"

# Replace ___ with the function that counts the snake's segments:
print(f"My snake is {snake_name} and has {___} segments!")
`,
        hint:
`Replace ___ with get_snake_length() — that's the function that counts how many segments your snake has!
Your finished line should look like:
print(f"My snake is {snake_name} and has {get_snake_length()} segments!")`,
        solutionCode:
`snake_name = "Slimy"
print(f"My snake is {snake_name} and has {get_snake_length()} segments!")
`,
        successCriteria: [
          'Called print() with an f-string',
          'Used get_snake_length() inside the string',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_calls_function', name: 'print' },
            { type: 'ast_calls_function', name: 'get_snake_length', errorHint: "Oops! Your snake doesn't know how long it is yet. Try calling: get_snake_length()" },
          ],
        },
        reward: { stars: 1 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // SN2: Functions — def, indentation, calling, parameters, customisation
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'sn2_functions',
    title: 'Functions',
    purpose: 'Learn to define and call your own functions using def.',
    storyIntro:
      "Your snake needs a team of helpers! Functions are like mini-programs you write once and use many times. Let's build some!",
    estimatedMinutes: 35,
    engineType: 'snake',
    learningOutcomes: ['def', 'indentation', 'calling functions'],
    steps: [
      {
        stepId: 'sn2_s1_define_and_call',
        concepts: ['def', 'calling functions'],
        instruction:
`Mission: Write your first function! ⚙️

Define a function called greet, put a print() inside it, then call it.

The shell is ready in the starter code — fill it in!`,
        detailedExplanation:
`⚙️ A function is like a recipe — you write it once and can run it whenever you want!

📝 Start with def, then the name, then (): — then indent 4 spaces to write the code inside.

▶️ After defining it, you must call it: greet() — otherwise it just sits there and never runs!`,
        starterCode:
`# Define the function — add a print() inside it (4 spaces before print!)
def greet():
    # Write your print("Let's play!") statement here:


# Call the function below this line (type greet() with no spaces before it):
`,
        hint:
`Inside the function (indented 4 spaces): print("Let's play!")
Then outside the function (no spaces): greet()

Make sure you have:
def greet():
    print("Let's play!")

greet()`,
        solutionCode:
`def greet():
    print("Let's play!")

greet()
`,
        successCriteria: [
          "Defined a function called 'greet' with a print() inside",
          "Called greet() to run it",
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_function', name: 'greet' },
            { type: 'ast_calls_function', name: 'greet' },
            { type: 'stdout_contains', text: 'play' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'sn2_s2_indentation',
        concepts: ['indentation', 'fixing bugs'],
        instruction:
`Mission: Spot the bug! 🐛

There's a deliberate indentation error in the starter code. Can you fix it?`,
        detailedExplanation:
`📏 Python uses spaces to know what belongs inside a function — all lines must line up!

🔍 Find the line with only 2 spaces before print — it should have 4 spaces.

💡 Press Tab to add 4 spaces automatically, or count them out by hand.`,
        starterCode:
`def greet():
    print("Welcome to Snake!")
  print("Get ready to code!")  # BUG: wrong indentation! Fix me!

greet()
`,
        hint:
`The second print() line needs 4 spaces before it (not 2).
Count the spaces: the line should look like:
    print("Get ready to code!")
(that's 4 spaces, then the word print)`,
        solutionCode:
`def greet():
    print("Welcome to Snake!")
    print("Get ready to code!")

greet()
`,
        successCriteria: [
          "Fixed the indentation error",
          "Both print statements run without error",
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_function', name: 'greet' },
            { type: 'stdout_contains', text: 'Snake' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'sn2_s3_customise_snake',
        concepts: ['calling API functions', 'customisation'],
        instruction:
`Mission: Customise your snake! 🎨

Pick a colour and a speed for your snake using the two function calls below.`,
        detailedExplanation:
`🎨 set_snake_color() changes the snake's colour — try "lime", "cyan", or "magenta"!

⚡ set_game_speed() controls how fast the snake moves. Lower number = faster snake!

🐍 Click Run Code and watch your snake change instantly!`,
        starterCode:
`# Pick a colour from the list on the right and call set_snake_color():
# Example: set_snake_color("lime")


# Set the game speed — pick a number between 100 and 300:
# Example: set_game_speed(150)


print("Snake customised!")
`,
        hint:
`Type: set_snake_color("cyan")  (replace cyan with any colour from the list)
Then: set_game_speed(150)  (replace 150 with any number between 100–300)`,
        solutionCode:
`set_snake_color("lime")
set_game_speed(150)
print("Snake customised!")
`,
        successCriteria: [
          'Called set_snake_color() with a colour',
          'Called set_game_speed() with a number',
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_calls_function', name: 'set_snake_color' },
            { type: 'ast_calls_function', name: 'set_game_speed' },
          ],
        },
        reward: { stars: 1 },
        customization: {
          type: 'cosmetic',
          description: 'Choose a colour for your snake — copy one of these into set_snake_color():',
          options: [
            '"lime"', '"cyan"', '"yellow"', '"orange"',
            '"magenta"', '"white"', '"#ff6b6b"', '"#4fc3f7"',
            '"#ffd54f"', '"#ce93d8"',
          ],
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // SN3: Keyboard Controls — on_key_down, lambda, if guards, game loop
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'sn3_keyboard_controls',
    title: 'Keyboard Controls',
    purpose: 'Make the snake respond to arrow key presses using on_key_down.',
    storyIntro:
      "The snake can move on its own, but it needs YOU to steer it! Let's connect the arrow keys to the snake's direction.",
    estimatedMinutes: 35,
    engineType: 'snake',
    learningOutcomes: ['on_key_down', 'lambda', 'if statement', 'game loop'],
    steps: [
      {
        stepId: 'sn3_s1_start_game_loop',
        concepts: ['set_direction', 'on_tick', 'lambda', 'game loop'],
        instruction:
`Mission: Start the snake moving! 🐍

Set the direction and start the game loop.

Write both lines in the starter code below.`,
        detailedExplanation:
`🧭 set_direction() points the snake — try 'RIGHT', 'UP', 'DOWN', or 'LEFT'. (Use capital letters and quotes!)

🔄 on_tick(lambda: None) starts the game loop — the snake begins moving as soon as you call it!

🎮 After clicking Run Code, click on the game area to see your snake go!`,
        starterCode:
`# Call set_direction() to point the snake — try 'RIGHT', 'UP', 'DOWN', or 'LEFT':


# Call on_tick(lambda: None) to start the game loop:
`,
        hint:
`Type: set_direction('RIGHT')  (the direction must be in UPPERCASE and in quotes)
Then: on_tick(lambda: None)  (this starts the game ticking)`,
        solutionCode:
`set_direction('RIGHT')
on_tick(lambda: None)
`,
        successCriteria: [
          'Called set_direction() with a direction',
          'Called on_tick() to start the game loop',
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_calls_function', name: 'set_direction' },
            { type: 'ast_calls_function', name: 'on_tick' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'sn3_s2_arrow_keys',
        concepts: ['on_key_down', 'lambda', 'event handlers'],
        instruction:
`Mission: Add keyboard controls! ⌨️

Add on_key_down() for all 4 arrow keys so you can steer the snake.

The game loop is already set up — add the 4 key lines below it.`,
        detailedExplanation:
`⌨️ on_key_down() watches for a key press and runs a function when it happens.

🐍 Pattern: on_key_down('UP', lambda: set_direction('UP')) — do this for all 4 directions!

🎮 After clicking Run Code, click the game area and use your arrow keys to steer!`,
        starterCode:
`set_direction('RIGHT')
on_tick(lambda: None)

# Add on_key_down() for all 4 arrow keys below.
# Pattern: on_key_down('UP', lambda: set_direction('UP'))
`,
        hint:
`You need 4 lines — one for each direction:
on_key_down('UP',    lambda: set_direction('UP'))
on_key_down('DOWN',  lambda: set_direction('DOWN'))
on_key_down('LEFT',  lambda: set_direction('LEFT'))
on_key_down('RIGHT', lambda: set_direction('RIGHT'))`,
        solutionCode:
`set_direction('RIGHT')
on_tick(lambda: None)
on_key_down('UP',    lambda: set_direction('UP'))
on_key_down('DOWN',  lambda: set_direction('DOWN'))
on_key_down('LEFT',  lambda: set_direction('LEFT'))
on_key_down('RIGHT', lambda: set_direction('RIGHT'))
`,
        successCriteria: [
          'Used on_key_down() to handle key presses',
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_has_on_key_handler' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'sn3_s3_anti_reverse_guard',
        concepts: ['if statement', 'get_direction', 'guard clause'],
        instruction:
`Mission: Add safety checks! 🛡️

Replace the pass in go_up() and go_down() with if statements so the snake can't reverse into itself.`,
        detailedExplanation:
`⚠️ If the snake is going RIGHT and you press LEFT, the head would crash straight into its own body!

🛡️ Use an if statement to check first: if get_direction() != 'DOWN': — then set_direction('UP')

❓ The != symbol means "is NOT equal to" — so this says "only go UP if we're not already going DOWN".`,
        starterCode:
`set_direction('RIGHT')
on_tick(lambda: None)

def go_up():
    # Replace 'pass' with an if statement:
    # if get_direction() != 'DOWN':
    #     set_direction('UP')
    pass

def go_down():
    # Replace 'pass' with an if statement:
    # if get_direction() != 'UP':
    #     set_direction('DOWN')
    pass

on_key_down('UP', go_up)
on_key_down('DOWN', go_down)
on_key_down('LEFT',  lambda: set_direction('LEFT') if get_direction() != 'RIGHT' else None)
on_key_down('RIGHT', lambda: set_direction('RIGHT') if get_direction() != 'LEFT' else None)
`,
        hint:
`Delete the \`pass\` line and write the if statement:
def go_up():
    if get_direction() != 'DOWN':   ← 4 spaces before if
        set_direction('UP')          ← 8 spaces before set_direction

Do the same for go_down() using 'UP' as the guard.`,
        solutionCode:
`set_direction('RIGHT')
on_tick(lambda: None)

def go_up():
    if get_direction() != 'DOWN':
        set_direction('UP')

def go_down():
    if get_direction() != 'UP':
        set_direction('DOWN')

on_key_down('UP', go_up)
on_key_down('DOWN', go_down)
on_key_down('LEFT',  lambda: set_direction('LEFT') if get_direction() != 'RIGHT' else None)
on_key_down('RIGHT', lambda: set_direction('RIGHT') if get_direction() != 'LEFT' else None)
`,
        successCriteria: [
          "Added 'if' statements to guard direction changes",
          "go_up() and go_down() now work correctly",
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_has_if' },
            { type: 'ast_has_on_key_handler' },
          ],
        },
        reward: { stars: 1 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // SN4: Score & Game Over — global variables, on_food_eaten, on_game_over
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'sn4_score_and_game_over',
    title: 'Score & Game Over',
    purpose: 'Track the score and react to game events using callbacks.',
    storyIntro:
      "Your snake can move! Now let's add scoring so you can track how well you're doing — and make the game react when it ends.",
    estimatedMinutes: 35,
    engineType: 'snake',
    learningOutcomes: ['global variables', 'on_food_eaten', 'on_game_over', 'conditional speed'],
    steps: [
      {
        stepId: 'sn4_s1_food_callback',
        concepts: ['global', 'on_food_eaten', 'show_message'],
        instruction:
`Mission: Track the score! 🍎

Fill in the ate_food() function to update the score when the snake eats, then register it with on_food_eaten().`,
        detailedExplanation:
`🌍 A global variable lives outside functions — write global score inside ate_food() so it can change it!

➕ score += 1 is a shortcut for score = score + 1 — it adds 1 each time the snake eats.

📺 show_message() displays text on the game screen. Use an f-string to show the current score!`,
        starterCode:
`score = 0

def ate_food():
    # 1. Add: global score
    # 2. Add: score += 1
    # 3. Add: show_message(f"Score: {score}")
    pass

# Register the callback — write on_food_eaten(ate_food) here:


on_tick(lambda: None)
on_key_down('UP',    lambda: set_direction('UP') if get_direction() != 'DOWN' else None)
on_key_down('DOWN',  lambda: set_direction('DOWN') if get_direction() != 'UP' else None)
on_key_down('LEFT',  lambda: set_direction('LEFT') if get_direction() != 'RIGHT' else None)
on_key_down('RIGHT', lambda: set_direction('RIGHT') if get_direction() != 'LEFT' else None)
`,
        hint:
`Inside ate_food() (delete the 'pass' first):
    global score
    score += 1
    show_message(f"Score: {score}")

Then below the function: on_food_eaten(ate_food)  (no () after ate_food!)`,
        solutionCode:
`score = 0

def ate_food():
    global score
    score += 1
    show_message(f"Score: {score}")

on_food_eaten(ate_food)
on_tick(lambda: None)
on_key_down('UP',    lambda: set_direction('UP') if get_direction() != 'DOWN' else None)
on_key_down('DOWN',  lambda: set_direction('DOWN') if get_direction() != 'UP' else None)
on_key_down('LEFT',  lambda: set_direction('LEFT') if get_direction() != 'RIGHT' else None)
on_key_down('RIGHT', lambda: set_direction('RIGHT') if get_direction() != 'LEFT' else None)
`,
        successCriteria: [
          "Used 'global score' inside ate_food()",
          'Called on_food_eaten() to register the callback',
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_calls_function', name: 'on_food_eaten' },
            { type: 'ast_uses_global', variable: 'score' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'sn4_s2_game_over_callback',
        concepts: ['on_game_over', 'def', 'show_message'],
        instruction:
`Mission: Handle game over! 💀

Write a died() function that shows a message when the snake crashes, then register it with on_game_over().`,
        detailedExplanation:
`💀 on_game_over() calls your function when the snake hits a wall or itself.

🖨️ Use show_message() to display a "Game Over" message — include the final score with an f-string!

💡 You don't need global inside died() — you're only reading score, not changing it!`,
        starterCode:
`score = 0

def ate_food():
    global score
    score += 1
    show_message(f"Score: {score}")

# Write a function called died() that shows a Game Over message with the final score:


# Register it with on_game_over():


on_food_eaten(ate_food)
on_tick(lambda: None)
on_key_down('UP',    lambda: set_direction('UP') if get_direction() != 'DOWN' else None)
on_key_down('DOWN',  lambda: set_direction('DOWN') if get_direction() != 'UP' else None)
on_key_down('LEFT',  lambda: set_direction('LEFT') if get_direction() != 'RIGHT' else None)
on_key_down('RIGHT', lambda: set_direction('RIGHT') if get_direction() != 'LEFT' else None)
`,
        hint:
`Write the function:
def died():
    show_message(f"Game Over! Final score: {score}")

Then register it: on_game_over(died)  (no () after died!)`,
        solutionCode:
`score = 0

def ate_food():
    global score
    score += 1
    show_message(f"Score: {score}")

def died():
    show_message(f"Game Over! Final score: {score}")

on_food_eaten(ate_food)
on_game_over(died)
on_tick(lambda: None)
on_key_down('UP',    lambda: set_direction('UP') if get_direction() != 'DOWN' else None)
on_key_down('DOWN',  lambda: set_direction('DOWN') if get_direction() != 'UP' else None)
on_key_down('LEFT',  lambda: set_direction('LEFT') if get_direction() != 'RIGHT' else None)
on_key_down('RIGHT', lambda: set_direction('RIGHT') if get_direction() != 'LEFT' else None)
`,
        successCriteria: [
          "Defined a function called 'died'",
          'Called on_game_over() to register it',
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_calls_function', name: 'on_game_over' },
            { type: 'ast_has_function', name: 'died' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'sn4_s3_difficulty_scaling',
        concepts: ['if statement', 'set_game_speed', 'difficulty scaling'],
        instruction:
`Mission: Make it harder! ⚡

Add an if statement inside ate_food() that speeds the snake up when the score reaches 5.`,
        detailedExplanation:
`⚡ set_game_speed() changes the speed — lower number means the snake moves faster!

🔢 score >= 5 means "score is 5 or more". The >= symbol means "greater than or equal to".

🎯 Add the if statement after score += 1 — remember to indent it 4 spaces inside ate_food()!`,
        starterCode:
`score = 0

def ate_food():
    global score
    score += 1
    show_message(f"Score: {score}")
    # Add an if statement here to speed up when score >= 5:
    # Use set_game_speed() with a lower number (try 120)


def died():
    show_message(f"Game Over! Final score: {score}")

on_food_eaten(ate_food)
on_game_over(died)
on_tick(lambda: None)
on_key_down('UP',    lambda: set_direction('UP') if get_direction() != 'DOWN' else None)
on_key_down('DOWN',  lambda: set_direction('DOWN') if get_direction() != 'UP' else None)
on_key_down('LEFT',  lambda: set_direction('LEFT') if get_direction() != 'RIGHT' else None)
on_key_down('RIGHT', lambda: set_direction('RIGHT') if get_direction() != 'LEFT' else None)
`,
        hint:
`Add these two lines inside ate_food(), after score += 1:
    if score >= 5:          ← 4 spaces before 'if'
        set_game_speed(120) ← 8 spaces before 'set_game_speed'`,
        solutionCode:
`score = 0

def ate_food():
    global score
    score += 1
    show_message(f"Score: {score}")
    if score >= 5:
        set_game_speed(120)

def died():
    show_message(f"Game Over! Final score: {score}")

on_food_eaten(ate_food)
on_game_over(died)
on_tick(lambda: None)
on_key_down('UP',    lambda: set_direction('UP') if get_direction() != 'DOWN' else None)
on_key_down('DOWN',  lambda: set_direction('DOWN') if get_direction() != 'UP' else None)
on_key_down('LEFT',  lambda: set_direction('LEFT') if get_direction() != 'RIGHT' else None)
on_key_down('RIGHT', lambda: set_direction('RIGHT') if get_direction() != 'LEFT' else None)
`,
        successCriteria: [
          "Added an 'if score >= 5' check inside ate_food()",
          'Called set_game_speed() to scale difficulty',
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_has_if' },
            { type: 'ast_calls_function', name: 'set_game_speed' },
          ],
        },
        reward: { stars: 2, badge: 'Snake Master' },
      },
    ],
  },
];

// =============================================================================
// PACK DEFINITION
// =============================================================================

export const snakeMissionPack: MissionPack = {
  packId: 'snake_basics_v1',
  packTitle: 'Snake Basics',
  description: 'Learn Python fundamentals by building and controlling a Snake game!',
  targetAgeRange: '8-14',

  // The snake pack doesn't use themes/sprites/presets — provide empty stubs
  // so the MissionPack interface is satisfied.
  gameTemplate: {
    templateId: 'snake_v1',
    name: 'Snake Game',
    themes: [],
    playerSprites: [],
    levelPresets: [],
    availableMechanics: [],
    defaultConfig: {
      THEME: 'snake',
      PLAYER: { sprite: 'snake', speed: 5, jumpStrength: 0 },
      MECHANICS: { doubleJump: false, dash: false, timer: false, lives: 1 },
      LEVEL: { preset: 'snake', platforms: [], coins: [], enemies: [], goal: { x: 0, y: 0 } },
      WIN_RULE: { type: 'collect_coins', target: 10 },
    },
  },

  missions,

  learningOutcomes: [
    'Comments',
    'print()',
    'Variables',
    'f-strings',
    'Functions (def)',
    'Indentation',
    'if statements',
    'on_key_down callbacks',
    'global variables',
    'Game loops',
  ],
};

// =============================================================================
// HELPERS
// =============================================================================

export function getSnakeMissionById(missionId: string) {
  return snakeMissionPack.missions.find(m => m.missionId === missionId);
}
