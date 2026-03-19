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
        instructionSlides: [
          "Hi! I'm Codog, your coding guide! Today we'll write our very first Python code together!",
          "See those lines starting with # in the editor? Those are COMMENTS. Python ignores them -- they're like sticky notes to yourself.",
          "Click on the empty line at the bottom of the editor so your cursor is blinking there.",
          "Now type: `print(\"Hello, snake!\")` -- you need the round brackets ( ) and the double quotes \" \" around the words!",
          "Click the green Run Code! button. Look at the Output section below -- your message should appear!",
        ],
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
        instructionSlides: [
          "A variable is like a labelled box -- you give it a name and store something inside!",
          "Click on the first empty line. Type: `snake_name = \"Slimy\"` -- the = puts the value in the box. Quotes mean it's text!",
          "On the NEXT line, type: `print(snake_name)` -- no quotes! We want what's IN the box, not the word.",
          "Click Run Code! -- your snake's name should appear. Try changing \"Slimy\" to your own name!",
          "If you get an error, double-check the spelling of `snake_name` -- Python is very picky!",
        ],
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
        instructionSlides: [
          "Cool trick! Put `f` before the `\"` and your message becomes a fill-in template. Anything you put inside `{ }` gets swapped for the real value!",
          "Look at the editor -- there's a line with `___` in it. That gap is yours to fill in!",
          "Replace `___` with `get_snake_length()` -- that's the built-in counter that knows how many body parts your snake has.",
          "Your finished line: `print(f\"My snake is {snake_name} and has {get_snake_length()} segments!\")` -- each `{ }` is a fill-in blank!",
          "Click Run Code! -- Python fills in `{snake_name}` with the actual name, and `{get_snake_length()}` with the real count!",
        ],
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
        instructionSlides: [
          "You can bundle a bunch of code, give it a name, and run it all just by typing that name! That's what `def` does.",
          "Look at the editor -- `def greet():` is already there. `def` means you're creating a new bundle of code. This one is called `greet`.",
          "To put code INSIDE `greet`, press Enter after the colon, then press Space 4 times. Count them: 1, 2, 3, 4!",
          "Now type: `print(\"Let's play!\")` -- because you pressed Space 4 times, this line is inside `greet`.",
          "Scroll below `greet` and on a new line (no spaces!), type: `greet()` -- typing the name with `()` is how you run it!",
          "Click Run Code! -- you should see Let's play! in the output. If not, check you have exactly 4 spaces before print.",
        ],
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
        instructionSlides: [
          "There's a BUG hiding in the code! A bug is a mistake that stops Python working. Can you spot it?",
          "Look at the two `print()` lines inside `greet()`. Both should have exactly 4 spaces before them.",
          "Count the spaces before the SECOND `print()` line -- it only has 2 spaces! That's the bug.",
          "Click right before the word `print` on that line. Delete 2 spaces, then add 2 more -- so there are 4 total.",
          "Click Run Code! -- if both messages appear without any error, you fixed the bug! Great detective work!",
        ],
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
        instructionSlides: [
          "Fun time! Let's change your snake's colour and speed. Both are just one line of code each!",
          "Find the first blank line. Type: `set_snake_color(\"lime\")` -- replace lime with any colour from the list on the right!",
          "Find the next blank line. Type: `set_game_speed(150)` -- lower numbers = faster snake, higher = slower!",
          "Click Run Code! and watch the game -- your snake should change colour and speed right away!",
        ],
        starterCode:
`# Pick a colour from the list on the right and call set_snake_color():
# Example: set_snake_color("lime")


# Set the game speed — pick a number between 100 and 300:
# Example: set_game_speed(150)


print("Snake customised!")
start_game()
`,
        hint:
`Type: set_snake_color("cyan")  (replace cyan with any colour from the list)
Then: set_game_speed(150)  (replace 150 with any number between 100–300)`,
        solutionCode:
`set_snake_color("lime")
set_game_speed(150)
print("Snake customised!")
start_game()
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
    learningOutcomes: ['on_key_down', 'named callbacks', 'lambda', 'if statement', 'game loop'],
    steps: [
      {
        stepId: 'sn3_s1_start_game_loop',
        concepts: ['set_direction', 'def', 'on_tick', 'start_game', 'named callback', 'game loop'],
        instruction:
`Mission: Start the snake moving! 🐍

Three things to write:
1. set_direction() to point the snake
2. on_tick(tick) to register the game loop
3. start_game() to launch it

Fill in all 3 missing lines below.`,
        detailedExplanation:
`🧭 set_direction() points the snake — try 'RIGHT', 'UP', 'DOWN', or 'LEFT'. (Capital letters and quotes!)

🔄 on_tick(tick) registers your tick function — no () after tick! You're handing it to the game to call, not running it yourself.

🚀 start_game() is what actually launches the snake. Without it, nothing moves — the snake waits for you!`,
        instructionSlides: [
          "Let's make the snake move! Three things need to happen: point it, register a tick loop, then launch it.",
          "Write: `set_direction('RIGHT')` -- use CAPITAL letters inside single quotes! Try UP, DOWN, or LEFT too.",
          "The tick function is already there. Below it (no spaces!), write: `on_tick(tick)` -- no `()` after tick! You're handing the function to the game, not running it.",
          "Finally, on the last blank line, write: `start_game()` -- this is what actually launches the snake. Without it, nothing moves!",
          "Click Run Code! and watch the game. Your snake should start slithering right!",
        ],
        starterCode:
`# Call set_direction() to point the snake — try 'RIGHT', 'UP', 'DOWN', or 'LEFT':


# This tick function keeps the game updating each step:
def tick():
    pass

# Register it with on_tick — no () after tick!


# Launch the snake — nothing moves without this!

`,
        hint:
`set_direction('RIGHT')

def tick():
    pass

on_tick(tick)    ← no () after tick — you're passing it, not calling it!
start_game()     ← this launches the snake!`,
        solutionCode:
`set_direction('RIGHT')

def tick():
    pass

on_tick(tick)
start_game()
`,
        successCriteria: [
          'Called set_direction() with a direction',
          'Defined a tick function and registered it with on_tick()',
          'Called start_game() to launch the snake',
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_calls_function', name: 'set_direction' },
            { type: 'ast_calls_function', name: 'on_tick' },
            { type: 'ast_has_function', name: 'tick' },
            { type: 'ast_calls_function', name: 'start_game', errorHint: "Don't forget start_game() at the end — that's what actually launches the snake!" },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'sn3_s2_arrow_keys',
        concepts: ['on_key_down', 'named callback', 'def'],
        instruction:
`Mission: Add keyboard controls! ⌨️

Define a function for each direction and register it with on_key_down.

go_up is already done — write go_down, go_left, and go_right!`,
        detailedExplanation:
`⌨️ on_key_down() watches for a key press and calls your function when it happens.

🐍 You pass the function by name — no () at the end! on_key_down('UP', go_up) says "call go_up when UP is pressed".

✏️ Write go_down, go_left, and go_right using the same pattern as go_up!`,
        instructionSlides: [
          "The snake moves but we can't steer it! Let's connect the arrow keys using named functions.",
          "Look at `go_up` -- it's already written. `def go_up():` defines it, and `on_key_down('UP', go_up)` registers it. No `()` after `go_up`!",
          "Now write `def go_down():` then 4 spaces then `set_direction('DOWN')`. Then `on_key_down('DOWN', go_down)` to register it.",
          "Do the same for go_left and go_right -- just change the direction word and function name in both places.",
          "Click Run Code!, click the game window, then try steering with your arrow keys. You control the snake!",
        ],
        starterCode:
`set_direction('RIGHT')

def tick():
    pass

on_tick(tick)
start_game()

# go_up is done — follow the same pattern for the other 3 directions:
def go_up():
    set_direction('UP')

on_key_down('UP', go_up)

# Write go_down below, then register it with on_key_down:


# Write go_left below, then register it with on_key_down:


# Write go_right below, then register it with on_key_down:

`,
        hint:
`def go_down():
    set_direction('DOWN')

on_key_down('DOWN', go_down)

# Then the same pattern for go_left and go_right`,
        solutionCode:
`set_direction('RIGHT')

def tick():
    pass

on_tick(tick)
start_game()

def go_up():
    set_direction('UP')

def go_down():
    set_direction('DOWN')

def go_left():
    set_direction('LEFT')

def go_right():
    set_direction('RIGHT')

on_key_down('UP',    go_up)
on_key_down('DOWN',  go_down)
on_key_down('LEFT',  go_left)
on_key_down('RIGHT', go_right)
`,
        successCriteria: [
          'Defined go_down, go_left, and go_right functions',
          'Registered all 4 directions with on_key_down()',
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_has_on_key_handler' },
            { type: 'ast_has_function', name: 'go_up' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'sn3_s3_meet_lambda',
        concepts: ['lambda', 'shorthand function', 'anonymous function'],
        instruction:
`Mission: Meet lambda — the shortcut function! ⚡

lambda is a way to write a tiny function in one line.
Replace the 4 named functions below with lambda shortcuts.`,
        detailedExplanation:
`⚡ lambda: set_direction('UP') is a tiny nameless function — it does the same job as:
    def go_up():
        set_direction('UP')

🔗 on_key_down('UP', lambda: set_direction('UP')) — the lambda IS the function. No def, no name needed!

💡 lambda is useful for small one-liners. For bigger code, named def functions are clearer.`,
        instructionSlides: [
          "You just wrote 4 named functions. Python has a shortcut for tiny one-liners called lambda!",
          "Compare these two -- they do EXACTLY the same thing:",
          "Long way:   def go_up():  then  set_direction('UP')  then  on_key_down('UP', go_up)",
          "Short way:  on_key_down('UP', lambda: set_direction('UP'))",
          "The `lambda:` part IS the tiny nameless function. Everything after the colon is what it does.",
          "Fill in the 4 blank `on_key_down` calls using lambda. The first one is shown as an example!",
        ],
        starterCode:
`set_direction('RIGHT')

def tick():
    pass

on_tick(tick)
start_game()

# Rewrite all 4 key handlers using lambda:
# Example (done for you): on_key_down('UP', lambda: set_direction('UP'))

on_key_down('UP',    lambda: set_direction('UP'))
on_key_down('DOWN',  )  # fill in the lambda
on_key_down('LEFT',  )  # fill in the lambda
on_key_down('RIGHT', )  # fill in the lambda
`,
        hint:
`on_key_down('DOWN',  lambda: set_direction('DOWN'))
on_key_down('LEFT',  lambda: set_direction('LEFT'))
on_key_down('RIGHT', lambda: set_direction('RIGHT'))

Pattern: lambda: set_direction('DIRECTION')`,
        solutionCode:
`set_direction('RIGHT')

def tick():
    pass

on_tick(tick)
start_game()

on_key_down('UP',    lambda: set_direction('UP'))
on_key_down('DOWN',  lambda: set_direction('DOWN'))
on_key_down('LEFT',  lambda: set_direction('LEFT'))
on_key_down('RIGHT', lambda: set_direction('RIGHT'))
`,
        successCriteria: [
          'Used lambda for all 4 on_key_down() calls',
          'Snake can be steered in all 4 directions',
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_has_on_key_handler' },
            { type: 'ast_calls_function', name: 'on_tick' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'sn3_s4_anti_reverse_guard',
        concepts: ['if statement', 'get_direction', 'guard clause'],
        instruction:
`Mission: Add safety checks to all 4 directions! 🛡️

Replace the pass in each function with an if statement that prevents the snake from reversing.

go_up should refuse if the snake is already going DOWN.`,
        detailedExplanation:
`⚠️ If the snake is going RIGHT and you press LEFT, the head would crash straight into its own body!

🛡️ Use an if statement to check first: if get_direction() != 'DOWN': — then set_direction('UP')

❓ The != symbol means "is NOT equal to" — so this says "only go UP if we're not already going DOWN".`,
        instructionSlides: [
          "Problem: if the snake goes RIGHT and you press LEFT, it crashes into itself! Let's add a safety check to all 4 directions.",
          "Find `go_up()`. Delete the word `pass`. Then with 4 spaces, write: `if get_direction() != 'DOWN':`",
          "Press Enter and type 8 spaces (4 + 4 more), then: `set_direction('UP')`. This says: only go UP if we're not already going DOWN!",
          "`!=` means 'is NOT equal to'. So `get_direction() != 'DOWN'` means 'are we not going down right now?'",
          "Do the same for go_down (guard: not 'UP'), go_left (guard: not 'RIGHT'), and go_right (guard: not 'LEFT').",
          "Click Run Code! and try pressing opposite directions. The snake should refuse to reverse into itself!",
        ],
        starterCode:
`set_direction('RIGHT')
on_tick(lambda: None)
start_game()

def go_up():
    # Replace pass — only go UP if we're not currently going DOWN:
    pass

def go_down():
    # Replace pass — only go DOWN if we're not currently going UP:
    pass

def go_left():
    # Replace pass — only go LEFT if we're not currently going RIGHT:
    pass

def go_right():
    # Replace pass — only go RIGHT if we're not currently going LEFT:
    pass

on_key_down('UP',    go_up)
on_key_down('DOWN',  go_down)
on_key_down('LEFT',  go_left)
on_key_down('RIGHT', go_right)
`,
        hint:
`Inside each function, delete 'pass' and write:
    if get_direction() != 'OPPOSITE':
        set_direction('THIS_DIRECTION')

go_up guard:    != 'DOWN'
go_down guard:  != 'UP'
go_left guard:  != 'RIGHT'
go_right guard: != 'LEFT'`,
        solutionCode:
`set_direction('RIGHT')
on_tick(lambda: None)
start_game()

def go_up():
    if get_direction() != 'DOWN':
        set_direction('UP')

def go_down():
    if get_direction() != 'UP':
        set_direction('DOWN')

def go_left():
    if get_direction() != 'RIGHT':
        set_direction('LEFT')

def go_right():
    if get_direction() != 'LEFT':
        set_direction('RIGHT')

on_key_down('UP',    go_up)
on_key_down('DOWN',  go_down)
on_key_down('LEFT',  go_left)
on_key_down('RIGHT', go_right)
`,
        successCriteria: [
          "Added if statements to all 4 direction functions",
          "Each function guards against the opposite direction",
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
        instructionSlides: [
          "Let's add scoring! `ate_food()` is a `def` block that the game runs FOR YOU every time the snake eats.",
          "Find `ate_food()` in the code. Delete the word `pass`. Then with 4 spaces before it, type: `global score`",
          "Why `global score`? The score box was created outside `ate_food`. Without this line, Python ignores the real one and makes a new empty box!",
          "Next line (4 spaces): `score += 1` -- this is a shortcut for `score = score + 1`. Adds 1 each time!",
          "Next line (4 spaces): `show_message(f\"Score: {score}\")` -- shows the score on screen using the `f` trick!",
          "Below `ate_food` (no spaces!): `on_food_eaten(ate_food)` -- no `()` after `ate_food`! We're passing it to the game to run, not running it ourselves.",
        ],
        starterCode:
`score = 0

def ate_food():
    # 1. Add: global score
    # 2. Add: score += 1
    # 3. Add: show_message(f"Score: {score}")
    pass

# Register the callback — write on_food_eaten(ate_food) here:


on_tick(lambda: None)
start_game()
def go_up():
    if get_direction() != 'DOWN':
        set_direction('UP')

def go_down():
    if get_direction() != 'UP':
        set_direction('DOWN')

def go_left():
    if get_direction() != 'RIGHT':
        set_direction('LEFT')

def go_right():
    if get_direction() != 'LEFT':
        set_direction('RIGHT')

on_key_down('UP',    go_up)
on_key_down('DOWN',  go_down)
on_key_down('LEFT',  go_left)
on_key_down('RIGHT', go_right)
`,
        hint:
`Inside ate_food() (delete 'pass' first, use 4 spaces):
1. Tell Python you want the score from outside: global score
2. Add 1: score += 1
3. Show it: show_message(f"Score: {score}")

Below the function: on_food_eaten(ate_food)  ← no () after ate_food`,
        solutionCode:
`score = 0

def ate_food():
    global score
    score += 1
    show_message(f"Score: {score}")

on_food_eaten(ate_food)
on_tick(lambda: None)
start_game()
def go_up():
    if get_direction() != 'DOWN':
        set_direction('UP')

def go_down():
    if get_direction() != 'UP':
        set_direction('DOWN')

def go_left():
    if get_direction() != 'RIGHT':
        set_direction('LEFT')

def go_right():
    if get_direction() != 'LEFT':
        set_direction('RIGHT')

on_key_down('UP',    go_up)
on_key_down('DOWN',  go_down)
on_key_down('LEFT',  go_left)
on_key_down('RIGHT', go_right)
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
        instructionSlides: [
          "Now let's make something happen when the snake crashes! We'll write a `def died():` block that the game runs for us automatically.",
          "Find the blank lines below `ate_food()`. Type: `def died():` to start the new block.",
          "Press Enter, then 4 spaces, then: `show_message(f\"Game Over! Final score: {score}\")`",
          "On a new line below `died` (no spaces!): `on_game_over(died)` -- no `()` after `died`! We're passing it to the game to run.",
          "Click Run Code! and play. When the snake crashes, your Game Over message should appear!",
        ],
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
start_game()
def go_up():
    if get_direction() != 'DOWN':
        set_direction('UP')

def go_down():
    if get_direction() != 'UP':
        set_direction('DOWN')

def go_left():
    if get_direction() != 'RIGHT':
        set_direction('LEFT')

def go_right():
    if get_direction() != 'LEFT':
        set_direction('RIGHT')

on_key_down('UP',    go_up)
on_key_down('DOWN',  go_down)
on_key_down('LEFT',  go_left)
on_key_down('RIGHT', go_right)
`,
        hint:
`def died():
    show_message(...)   ← use an f-string showing the final score

on_game_over(died)   ← no () after died — passing it, not calling it`,
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
start_game()
def go_up():
    if get_direction() != 'DOWN':
        set_direction('UP')

def go_down():
    if get_direction() != 'UP':
        set_direction('DOWN')

def go_left():
    if get_direction() != 'RIGHT':
        set_direction('LEFT')

def go_right():
    if get_direction() != 'LEFT':
        set_direction('RIGHT')

on_key_down('UP',    go_up)
on_key_down('DOWN',  go_down)
on_key_down('LEFT',  go_left)
on_key_down('RIGHT', go_right)
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
        instructionSlides: [
          "The game is too easy! Let's make the snake speed up when you reach 5 points using an if check.",
          "Find `ate_food()`. After the `score += 1` line, add a new line at the SAME level (4 spaces before it).",
          "Type: `if score >= 5:` -- `>=` means 'greater than or equal to'. So: when score reaches 5 or more...",
          "Press Enter and type 8 spaces (4 + 4), then: `set_game_speed(120)` -- lower number = faster snake!",
          "Click Run Code! and play until you get 5 points. Feel the snake speed up? You just added a difficulty jump!",
        ],
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
start_game()
def go_up():
    if get_direction() != 'DOWN':
        set_direction('UP')

def go_down():
    if get_direction() != 'UP':
        set_direction('DOWN')

def go_left():
    if get_direction() != 'RIGHT':
        set_direction('LEFT')

def go_right():
    if get_direction() != 'LEFT':
        set_direction('RIGHT')

on_key_down('UP',    go_up)
on_key_down('DOWN',  go_down)
on_key_down('LEFT',  go_left)
on_key_down('RIGHT', go_right)
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
start_game()
def go_up():
    if get_direction() != 'DOWN':
        set_direction('UP')

def go_down():
    if get_direction() != 'UP':
        set_direction('DOWN')

def go_left():
    if get_direction() != 'RIGHT':
        set_direction('LEFT')

def go_right():
    if get_direction() != 'LEFT':
        set_direction('RIGHT')

on_key_down('UP',    go_up)
on_key_down('DOWN',  go_down)
on_key_down('LEFT',  go_left)
on_key_down('RIGHT', go_right)
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
