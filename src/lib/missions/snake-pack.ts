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
    estimatedMinutes: 15,
    engineType: 'snake',
    learningOutcomes: ['comments', 'print()', 'variables', 'f-strings'],
    steps: [
      {
        stepId: 'sn1_s1_comments_and_print',
        concepts: ['comments', 'print'],
        instruction:
`Write a comment explaining what your code does, then write a print() call to greet the snake world!

A **comment** starts with # — Python ignores that line completely. It's a note for you (and other humans reading your code).

The **print()** function shows text on screen. Whatever you put inside the brackets and quotes appears in the output below.

The starter code shows you the structure — you need to write the print() call yourself!`,
        detailedExplanation:
`**Comments** are notes you write in your code. They start with a # symbol:

\`\`\`python
# This is a comment — Python ignores this line
# You can write anything here!
\`\`\`

Why use comments? They help you remember what your code does, and help other people understand it too. Professional programmers write comments all the time!

**print()** shows a message on screen:

\`\`\`python
print("Hello, world!")
print("I love coding!")
\`\`\`

Whatever text you put inside the quotes will appear in the Output panel below the editor. Try changing the message!`,
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
`Give your snake a name by creating a variable!

A **variable** is like a labelled box that stores information. You choose the name, then use = to put something in the box.

The starter code has comments telling you what to write — you need to add both lines yourself: create a variable called \`snake_name\` and then print it.`,
        detailedExplanation:
`**Variables** store values so you can use them later:

\`\`\`python
snake_name = "Slimy"
my_score = 0
player_lives = 3
\`\`\`

The name goes on the LEFT of =, and the value goes on the RIGHT.

Variable names can contain letters, numbers, and underscores (_), but they can't start with a number. Use lowercase with underscores (like \`snake_name\`, not \`SnakeName\`).

Once you have a variable, you can use it with print():

\`\`\`python
snake_name = "Slimy"
print(snake_name)
\`\`\`

Notice: no quotes around \`snake_name\` when printing it! That tells Python to print the VALUE stored inside the variable, not the word "snake_name".`,
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
`Mix text and variables together using an f-string!

An **f-string** lets you embed a variable's value right inside a sentence. Put the letter \`f\` before the opening quote, and wrap variable names in curly braces \`{}\`.

The starter code sets up \`snake_name\` for you. Your job: write a \`print(f"...")\` call that uses \`snake_name\` AND calls \`get_snake_length()\` inside the string.`,
        detailedExplanation:
`An **f-string** (formatted string) lets you build sentences that include variable values:

\`\`\`python
name = "Slimy"
length = 3

# Without f-string (awkward):
print("My snake is " + name + " and has " + str(length) + " segments!")

# With f-string (much nicer!):
print(f"My snake is {name} and has {length} segments!")
\`\`\`

The key is the **f before the quote** and **{} around the variable name**. Inside the curly braces, you can put any variable or even a function call:

\`\`\`python
print(f"Score: {get_score()}")
print(f"Head position: {get_snake_head()}")
\`\`\`

The f-string automatically converts numbers to text for you — no extra work needed!`,
        starterCode:
`snake_name = "Slimy"

# Write a print() call using an f-string.
# Include snake_name AND call get_snake_length() inside the string.
# Example structure: print(f"My snake is {snake_name} and has {get_snake_length()} segments!")
`,
        hint:
`Put f before the opening quote: f"..."
Use {} curly braces to embed variables and function calls.
Example: print(f"My snake is {snake_name} and has {get_snake_length()} segments!")`,
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
            { type: 'ast_calls_function', name: 'get_snake_length' },
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
    estimatedMinutes: 20,
    engineType: 'snake',
    learningOutcomes: ['def', 'indentation', 'calling functions'],
    steps: [
      {
        stepId: 'sn2_s1_define_and_call',
        concepts: ['def', 'calling functions'],
        instruction:
`Create your first function!

A function is a block of code you can run whenever you want. Use the \`def\` keyword to define one.

The starter code gives you the function shell — you need to:
1. Add a \`print("Let's play!")\` line **inside** the function (with 4 spaces before it)
2. **Call** the function by typing \`greet()\` after it`,
        detailedExplanation:
`Think of a function like a **recipe card**. You write the recipe once (define it), and you can cook it as many times as you want (call it).

Here's how to define a function:

\`\`\`python
def greet():
    print("Let's play!")
\`\`\`

Three things to notice:
1. Start with \`def\` (short for "define")
2. Then the function name followed by ()
3. Then a colon :
4. The code INSIDE the function is **indented** (4 spaces to the right)

After defining it, you need to CALL it:

\`\`\`python
greet()
\`\`\`

Without calling it, the function just sits there and never runs. It's like writing a recipe but never cooking it!`,
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
`Python uses indentation (spaces at the start of a line) to know what belongs inside a function.

Every line inside a function MUST start with exactly 4 spaces. There's a deliberate bug in the starter code — one line has the wrong number of spaces. Can you spot and fix it?`,
        detailedExplanation:
`**Indentation** is one of Python's most important rules. Unlike most languages, Python uses spaces to show what code belongs together.

CORRECT — both lines have 4 spaces before them:
\`\`\`python
def greet():
    print("Welcome to Snake!")   ← 4 spaces
    print("Get ready to code!")  ← 4 spaces (same!)
\`\`\`

WRONG — the second line only has 2 spaces:
\`\`\`python
def greet():
    print("Welcome to Snake!")   ← 4 spaces
  print("Get ready to code!")  ← only 2 spaces! BUG!
\`\`\`

Python will show an IndentationError if the spaces don't match. Count carefully!

**Pro tip:** In this editor, press Tab to add 4 spaces automatically, or use the Space key 4 times.`,
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
`Customise your snake using two built-in functions!

The starter code is empty — you need to write both function calls yourself:
1. Call \`set_snake_color()\` with a colour of your choice (see the options below!)
2. Call \`set_game_speed()\` with a number between 100 and 300 (lower = faster)

Then hit Run Code and watch your snake change!`,
        detailedExplanation:
`The Snake API gives you special functions to customise the game.

**Change the colour:**
\`\`\`python
set_snake_color("lime")
set_snake_color("cyan")
set_snake_color("orange")
set_snake_color("#ff6b6b")  # hex colour codes work too!
\`\`\`

**Change the speed** (milliseconds between each step — lower = faster):
\`\`\`python
set_game_speed(200)  # default speed
set_game_speed(150)  # a bit faster
set_game_speed(100)  # very fast!
set_game_speed(300)  # slow and relaxed
\`\`\`

Pick your favourite colour from the list in the "Make it yours!" box, then set a speed you enjoy. The snake updates as soon as you click Run Code!`,
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
    estimatedMinutes: 20,
    engineType: 'snake',
    learningOutcomes: ['on_key_down', 'lambda', 'if statement', 'game loop'],
    steps: [
      {
        stepId: 'sn3_s1_start_game_loop',
        concepts: ['set_direction', 'on_tick', 'lambda', 'game loop'],
        instruction:
`Start the snake moving by setting a direction and starting the game loop!

The starter code is empty — write both lines yourself:
1. Call \`set_direction('RIGHT')\` to point the snake right
2. Call \`on_tick(lambda: None)\` to start the game loop (the snake will begin moving!)

Once you run the code, click on the game and watch the snake go!`,
        detailedExplanation:
`**set_direction()** tells the snake which way to go:
\`\`\`python
set_direction('RIGHT')   # move right (default)
set_direction('LEFT')    # move left
set_direction('UP')      # move up
set_direction('DOWN')    # move down
\`\`\`

**on_tick()** starts the game loop — it runs a function every time the snake moves. For now, we'll pass it a lambda that does nothing (\`lambda: None\`). We'll make it more useful in later missions.

What is a **lambda**? It's a quick way to write a tiny function in one line:
\`\`\`python
# This lambda does nothing — just tells the engine to start ticking
on_tick(lambda: None)

# This lambda would print something every tick
on_tick(lambda: print("tick!"))
\`\`\`

Once you call on_tick(), the snake will start moving!`,
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
`Now add arrow key controls using \`on_key_down()\`!

The game loop is set up for you. Your job: add **4 lines** using \`on_key_down()\` — one for each arrow key.

Pattern: \`on_key_down('UP', lambda: set_direction('UP'))\`

After running the code, click on the game area and use your arrow keys to steer the snake. Avoid the walls!`,
        detailedExplanation:
`**on_key_down()** connects a key press to a function:

\`\`\`python
on_key_down('UP', lambda: set_direction('UP'))
\`\`\`

This means: "When the UP arrow key is pressed, call set_direction('UP')".

You need all 4 directions:
\`\`\`python
on_key_down('UP',    lambda: set_direction('UP'))
on_key_down('DOWN',  lambda: set_direction('DOWN'))
on_key_down('LEFT',  lambda: set_direction('LEFT'))
on_key_down('RIGHT', lambda: set_direction('RIGHT'))
\`\`\`

The pattern is always the same:
- First argument: the key name in quotes (UPPERCASE: 'UP', 'DOWN', 'LEFT', 'RIGHT')
- Second argument: the function to call (here we use a lambda for simplicity)

**After clicking Run Code**, click on the game area and press the arrow keys to steer!`,
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
`Add safety checks so the snake can't reverse into itself!

The starter code has \`go_up()\` and \`go_down()\` functions, but they're incomplete — they just say \`pass\` (do nothing).

**Your job:** Replace \`pass\` in each function with an \`if\` statement that checks the current direction before changing it. Use \`get_direction()\` to check what direction the snake is moving.

Try pressing UP or DOWN — nothing happens yet. Add the \`if\` statements to make them work!`,
        detailedExplanation:
`**The problem:** If the snake is moving RIGHT and you press LEFT, the head would immediately run into the body!

**The fix — use an if statement:**
\`\`\`python
def go_up():
    if get_direction() != 'DOWN':
        set_direction('UP')
\`\`\`

This says: "Only go UP if we're not currently going DOWN (which would be a direct reversal)."

The \`!=\` symbol means "is NOT equal to". So \`get_direction() != 'DOWN'\` means "the current direction is NOT DOWN".

Here are all the opposite pairs:
- UP is the opposite of DOWN
- DOWN is the opposite of UP
- LEFT is the opposite of RIGHT
- RIGHT is the opposite of LEFT

For each direction, check that the snake isn't already going the OPPOSITE way.`,
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
    estimatedMinutes: 20,
    engineType: 'snake',
    learningOutcomes: ['global variables', 'on_food_eaten', 'on_game_over', 'conditional speed'],
    steps: [
      {
        stepId: 'sn4_s1_food_callback',
        concepts: ['global', 'on_food_eaten', 'show_message'],
        instruction:
`Track the score using a global variable and \`on_food_eaten()\`!

The starter code sets up \`score = 0\` and shows the structure. Your job: fill in the body of \`ate_food()\`:
1. Add \`global score\` so the function can modify the outer variable
2. Add \`score += 1\` to increase the score
3. Add \`show_message(f"Score: {score}")\` to show it on screen

Then register it: \`on_food_eaten(ate_food)\``,
        detailedExplanation:
`When a function is called, it normally can't change variables that were created OUTSIDE the function. The \`global\` keyword fixes this:

\`\`\`python
score = 0  # created outside the function

def ate_food():
    global score      # tell Python to use the OUTER score variable
    score += 1        # now we can change it!
    show_message(f"Score: {score}")
\`\`\`

Without \`global score\`, Python would create a NEW local score variable inside the function and the outer one would never change.

**on_food_eaten()** registers a callback — a function that gets called automatically when the snake eats food:
\`\`\`python
on_food_eaten(ate_food)  # pass the function NAME (no parentheses!)
\`\`\`

Notice we write \`ate_food\` not \`ate_food()\`. We're handing Python the function itself, not calling it right now.`,
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
`Handle the game ending by writing a \`died()\` function!

The \`ate_food()\` function from the last step is already here. Your job:
1. Write a new function called \`died()\` that calls \`show_message()\` with a "Game Over" message including the final score
2. Register it: \`on_game_over(died)\`

Steer your snake into a wall to test it!`,
        detailedExplanation:
`**on_game_over()** works just like on_food_eaten() — it calls your function when something happens in the game:

\`\`\`python
def died():
    show_message(f"Game Over! Final score: {score}")

on_game_over(died)
\`\`\`

The function name can be anything you want — \`died\`, \`game_ended\`, \`oh_no\` — as long as you use the same name in on_game_over().

**show_message()** displays text in the middle of the game screen:
\`\`\`python
show_message("You won!")
show_message(f"Score: {score}")
\`\`\`

The score variable is accessible inside \`died()\` without \`global\` because we're only READING it, not changing it. The \`global\` keyword is only needed when you want to MODIFY a variable from inside a function.`,
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
`Make the game get harder as your score increases!

The full game is running. Your job: add an \`if\` statement **inside** \`ate_food()\` (after \`score += 1\`) that speeds up the snake when the score reaches 5.

Use \`set_game_speed(120)\` to make the snake faster. The \`>=\` operator means "greater than or equal to".`,
        detailedExplanation:
`Adding difficulty scaling makes the game feel rewarding — the better you play, the harder it gets!

Inside \`ate_food()\`, after updating the score, add:
\`\`\`python
def ate_food():
    global score
    score += 1
    show_message(f"Score: {score}")

    if score >= 5:
        set_game_speed(120)  # faster when score is 5 or more!
\`\`\`

The \`>=\` symbol means "greater than or equal to". So \`score >= 5\` means "score is 5 or higher".

You could even add multiple speed tiers:
\`\`\`python
if score >= 10:
    set_game_speed(80)   # very fast at score 10
elif score >= 5:
    set_game_speed(120)  # fast at score 5
\`\`\`

Notice the if statement is INSIDE the function, indented 4 spaces. And set_game_speed() is INSIDE the if, indented 8 spaces total (4 for the function + 4 for the if).`,
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
