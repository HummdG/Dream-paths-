/**
 * Rocket Basics Mission Pack v1
 *
 * Space Cadet Program — a gentle Python introduction through a rocket simulator.
 * Teaches variables, functions, conditionals, and callbacks via rocket flight.
 *
 * 4 missions × 3 steps = 12 steps total.
 * All missions have engineType: 'rocket'.
 * Free pack (like snake_basics_v1).
 */

import { MissionPack, Mission } from './schema';

// =============================================================================
// MISSIONS
// =============================================================================

const missions: Mission[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // RC1: Mission Briefing — variables, print(), f-strings
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'rc1_mission_briefing',
    title: 'Mission Briefing',
    purpose: 'Learn variables, print(), and f-strings to prepare for launch.',
    storyIntro:
      "Welcome to the Space Cadet Program! Before we blast off, every astronaut must complete their mission briefing. Let's write it in Python!",
    estimatedMinutes: 30,
    engineType: 'rocket',
    learningOutcomes: ['variables', 'print()', 'f-strings'],
    steps: [
      {
        stepId: 'rc1_s1_variables',
        concepts: ['variables', 'assignment'],
        instruction:
`Mission Briefing Step 1: Set your mission variables! 🚀

Every mission needs key data stored in variables.
Create three variables: pilot_name, fuel, and altitude.`,
        detailedExplanation:
`📦 A variable stores a value you can use later.
Just write: pilot_name = "Alex"

Numbers don't need quotes: fuel = 100
✏️ Create all three variables to continue!`,
        instructionSlides: [
          "Welcome, Space Cadet! Before we can blast off, we need to set up our mission variables.",
          "A variable is like a labelled box -- you give it a name and store something inside. Text uses quotes!",
          "Find the line `pilot_name =` and complete it: `pilot_name = \"Alex\"` -- replace Alex with your name!",
          "Find `fuel =` and add a number (0 to 100). We start full, so try: `fuel = 100`",
          "Find `altitude =` and set it to 0 -- we start on the ground! Then click Run Code!",
        ],
        starterCode:
`# Mission variables — fill these in!

# Your name as the pilot (use quotes for text)
pilot_name =

# Starting fuel percentage (a number from 0 to 100)
fuel =

# Starting altitude in km (we're on the ground, so...)
altitude =
`,
        hint:
`pilot_name = "Alex"   # text goes in quotes
fuel = 100             # just a number
altitude = 0           # we start on the ground`,
        solutionCode:
`pilot_name = "Alex"
fuel = 100
altitude = 0
`,
        successCriteria: [
          'Create a variable called pilot_name',
          'Create a variable called fuel',
          'Create a variable called altitude',
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_has_assignment', variable: 'pilot_name' },
            { type: 'ast_has_assignment', variable: 'fuel' },
            { type: 'ast_has_assignment', variable: 'altitude' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'rc1_s2_print',
        concepts: ['print()', 'output'],
        instruction:
`Mission Briefing Step 2: Print your mission data! 🖨️

Use print() to display the mission briefing to Mission Control.
Print the pilot_name, fuel, and altitude variables.`,
        detailedExplanation:
`🖨️ print() sends a message to the output panel below.
You can print variables directly: print(pilot_name)
Or text in quotes: print("Launching now!")`,
        instructionSlides: [
          "Great mission variables! Now let's report them to Mission Control using `print()`.",
          "The first `print(pilot_name)` is already there. You need to add two more lines below it.",
          "Type: `print(fuel)` -- this prints the fuel number. Then on the next line: `print(altitude)`",
          "Click Run Code! -- you should see three values appear in the Output. Mission Control is watching!",
        ],
        starterCode:
`pilot_name = "Alex"
fuel = 100
altitude = 0

# Print each variable below:
print(pilot_name)

`,
        hint:
`print(pilot_name)
print(fuel)
print(altitude)`,
        solutionCode:
`pilot_name = "Alex"
fuel = 100
altitude = 0

print(pilot_name)
print(fuel)
print(altitude)
`,
        successCriteria: [
          'Call print() at least once',
          'Output contains a value',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_calls_function', name: 'print' },
            { type: 'stdout_contains', text: '100' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'rc1_s3_fstrings',
        concepts: ['f-strings', 'string formatting'],
        instruction:
`Mission Briefing Step 3: Format your briefing with f-strings! ✨

An f-string lets you put variables inside a sentence.
Print a nice briefing message using an f-string.`,
        detailedExplanation:
`✨ f-strings start with the letter f before the quote:
  f"Hello, {pilot_name}!"

The curly braces {} insert the variable's value.
Make your mission briefing personal!`,
        instructionSlides: [
          "Raw numbers printed on separate lines are hard to read! Let's put them all in one nice sentence using an f-string.",
          "An f-string starts with `f` before the opening `\"`. Then you can put any variable inside `{ }` and Python swaps it for the real value.",
          "For example: `print(f\"Hello, {pilot_name}!\")` would print: Hello, Alex!",
          "Now write your own briefing line that includes all three variables: pilot_name, fuel, and altitude. Put all three inside `{ }`!",
          "Click Run Code! -- Python should fill in all three values. Much better than three separate lines!",
        ],
        starterCode:
`pilot_name = "Alex"
fuel = 100
altitude = 0

# Write a print() using an f-string that includes all three variables:
# f-strings start with f before the quote: f"Hello, {pilot_name}!"
# Use {pilot_name}, {fuel}, and {altitude} somewhere in your message:
`,
        hint:
`Put f before the opening quote, then wrap each variable in { }:
print(f"Pilot {pilot_name}, fuel is {fuel}%, altitude {altitude} km")`,
        solutionCode:
`pilot_name = "Alex"
fuel = 100
altitude = 0

print(f"Pilot {pilot_name}, fuel is {fuel}%, altitude {altitude} km")
`,
        successCriteria: [
          'Use an f-string',
          'Output contains the pilot name',
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_calls_function', name: 'print' },
          ],
        },
        reward: { stars: 1 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // RC2: Rocket Functions — def, parameters, calling functions
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'rc2_rocket_functions',
    title: 'Rocket Functions',
    purpose: 'Learn to write and call functions with parameters.',
    storyIntro:
      "A rocket needs reusable systems. Real engineers write functions so they can run the same code multiple times without repeating themselves!",
    estimatedMinutes: 35,
    engineType: 'rocket',
    learningOutcomes: ['def', 'parameters', 'calling functions'],
    steps: [
      {
        stepId: 'rc2_s1_define_function',
        concepts: ['def', 'function definition'],
        instruction:
`Functions Step 1: Define a launch function! 🔧

A function is a named block of code you can run whenever you need it.
Write a function called launch_rocket that prints "3... 2... 1... Launch!".`,
        detailedExplanation:
`🔧 A function is defined with def:
  def launch_rocket():
      print("3... 2... 1... Launch!")

Don't forget the colon and the indent!`,
        instructionSlides: [
          "In Python, you can write a group of steps, give them a name, and run them all just by typing that name. That's what `def` is for!",
          "Look at the editor -- `def launch_rocket():` is already there. `def` means you're creating a new group of steps. This one is called `launch_rocket`.",
          "To put code INSIDE `launch_rocket`, press Enter after the colon, then press Space 4 times.",
          "Now type: `print(\"3... 2... 1... Launch!\")` -- with 4 spaces before it, this line is inside `launch_rocket`.",
          "Click Run Code! -- wait, nothing happens yet! `launch_rocket` won't run until you USE IT. We'll fix that next!",
        ],
        starterCode:
`# Define a function called launch_rocket
def launch_rocket():
    # Write a print() call inside the function:

`,
        hint:
`def launch_rocket():
    print("3... 2... 1... Launch!")`,
        solutionCode:
`def launch_rocket():
    print("3... 2... 1... Launch!")
`,
        successCriteria: [
          'Define a function called launch_rocket',
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_has_function', name: 'launch_rocket' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'rc2_s2_call_function',
        concepts: ['calling functions'],
        instruction:
`Functions Step 2: Call your function! 📞

Defining a function doesn't run it — you have to call it!
Call launch_rocket() to see it in action.`,
        detailedExplanation:
`📞 To run (call) a function, write its name followed by ()
  launch_rocket()

You can call it multiple times — try calling it twice!`,
        instructionSlides: [
          "We wrote `launch_rocket()` but it's just sitting there waiting! We need to USE IT to make it run.",
          "Find the blank line below `launch_rocket`. Type: `launch_rocket()` -- make sure there are NO spaces before it!",
          "Click Run Code! -- you should see your countdown appear in the Output. 3... 2... 1... Launch!",
          "Try typing `launch_rocket()` again on the next line. You can run it as many times as you want!",
        ],
        starterCode:
`def launch_rocket():
    print("3... 2... 1... Launch!")

# Call the function below:

`,
        hint:
`launch_rocket()`,
        solutionCode:
`def launch_rocket():
    print("3... 2... 1... Launch!")

launch_rocket()
`,
        successCriteria: [
          'Define launch_rocket()',
          'Call the function',
          'Output contains "Launch"',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_function', name: 'launch_rocket' },
            { type: 'ast_calls_function', name: 'launch_rocket' },
            { type: 'stdout_contains', text: 'Launch' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'rc2_s3_parameters',
        concepts: ['parameters', 'arguments'],
        instruction:
`Functions Step 3: Add a parameter! 🎯

Parameters let you pass data into a function.
Write a function status_report(power) that prints the thrust power.`,
        detailedExplanation:
`🎯 A parameter is like a variable inside the function:
  def status_report(power):
      print(f"Thrust: {power}%")

When you call it: status_report(75) — power becomes 75.`,
        instructionSlides: [
          "What if we want `status_report` to show ANY power level, not just one fixed number? That's what parameters are for!",
          "Look at `def status_report(power):` -- `power` is the setting. When you call `status_report(50)`, the number 50 gets passed in as `power`.",
          "Inside the function (4 spaces!), write a print that shows the power level. Use an f-string: `print(f\"Thrust: {power}%\")`",
          "The two calls at the bottom are already there. Once you fill in the function body, click Run Code! -- you should see two lines, one for each power level.",
          "Try changing 50 and 100 to other numbers. Your function works with ANY value you pass in!",
        ],
        starterCode:
`# Define a function with a parameter called power:
def status_report(power):
    # Write a print() that shows: "Thrust: {power}%"
    # Use an f-string so the number fills in automatically!


# Call it twice with different power levels:
status_report(50)
status_report(100)
`,
        hint:
`Inside the function (4 spaces!):
    print(f"Thrust: {power}%")

The calls at the bottom are already there -- just fill in the function body.`,
        solutionCode:
`def status_report(power):
    print(f"Thrust: {power}%")

status_report(50)
status_report(100)
`,
        successCriteria: [
          'Define a function with a parameter',
          'Call the function',
          'Output contains "Thrust"',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_function', name: 'status_report' },
            { type: 'ast_calls_function', name: 'status_report' },
            { type: 'stdout_contains', text: 'Thrust' },
          ],
        },
        reward: { stars: 1 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // RC3: Keyboard Controls — on_update, set_direction, set_thrust
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'rc3_keyboard_controls',
    title: 'Keyboard Controls',
    purpose: 'Use on_update and the rocket API to control thrust and direction.',
    storyIntro:
      "Time to fly! Astronauts control their rockets with precision. Let's connect your code to the rocket and watch it move!",
    estimatedMinutes: 35,
    engineType: 'rocket',
    learningOutcomes: ['on_update', 'set_direction()', 'set_thrust()'],
    steps: [
      {
        stepId: 'rc3_s1_set_thrust',
        concepts: ['set_thrust()', 'rocket API'],
        instruction:
`Rocket Controls Step 1: Fire the engines! 🔥

Use set_thrust() to power up the rocket.
Set the thrust to 80 and watch the rocket rise!`,
        detailedExplanation:
`🔥 set_thrust(power) controls how much engine power to use.
  0 = engines off
  100 = full blast

Call set_thrust(80) and then launch() to start the simulation!`,
        instructionSlides: [
          "Time to actually fly a rocket! `set_thrust()` controls how much engine power to use.",
          "Write: `set_thrust(80)` -- the number is the power level. 0 = engines off, 100 = full blast. 80 is a good starting point!",
          "On the next line, write: `launch()` -- this starts the rocket simulation.",
          "Click Run Code! and watch the rocket on the left. It should start rising. Try changing 80 to other numbers!",
        ],
        starterCode:
`# Fire the engines! Call set_thrust() with a power level (0 = off, 100 = full blast):
# Try 80 for a strong launch!


# Call launch() to start the simulation:
`,
        hint:
`set_thrust(80)   ← 80% engine power
launch()          ← starts the simulation`,
        solutionCode:
`set_thrust(80)
launch()
`,
        successCriteria: [
          'Call set_thrust()',
          'Rocket launches',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_calls_function', name: 'set_thrust' },
            { type: 'rocket_launched' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'rc3_s2_set_direction',
        concepts: ['set_direction()', 'angles'],
        instruction:
`Rocket Controls Step 2: Steer the rocket! 🧭

use set_direction() to control which way the rocket points.
90 degrees = straight up. Try different angles!`,
        detailedExplanation:
`🧭 set_direction(angle) points the rocket nose.
  90 = straight up
  45 = diagonal right
  0 = straight right

Try set_direction(90) for the best altitude climb!`,
        instructionSlides: [
          "The rocket is flying but maybe not straight up! `set_direction()` controls the angle.",
          "90 degrees = straight up. 45 = diagonal right. 0 = straight sideways. Write: `set_direction(90)` for the best altitude climb!",
          "Then write: `set_thrust(100)` for full power. `launch()` is already at the bottom.",
          "Click Run Code! and watch the rocket climb straight up. Then try changing 90 to 45 -- see what happens to the flight path!",
        ],
        starterCode:
`# Point the rocket — 90 = straight up, 45 = diagonal, 0 = sideways:


# Set full thrust:


# Start the simulation:
launch()
`,
        hint:
`set_direction(90)   ← 90 degrees = straight up
set_thrust(100)      ← full power`,
        solutionCode:
`set_direction(90)
set_thrust(100)
launch()
`,
        successCriteria: [
          'Call set_direction()',
          'Call set_thrust()',
          'Rocket launches',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_calls_function', name: 'set_direction' },
            { type: 'ast_calls_function', name: 'set_thrust' },
            { type: 'direction_set' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'rc3_s3_on_update',
        concepts: ['on_update', 'callback functions'],
        instruction:
`Rocket Controls Step 3: React to altitude! 📡

Use on_update() to run code every game tick.
Show a message when the rocket is flying!`,
        detailedExplanation:
`📡 on_update(my_function) calls your function every tick.
Inside the function, use get_altitude() to read the height.

Try showing a message when altitude > 50!`,
        instructionSlides: [
          "What if we want to CHECK the altitude while the rocket is flying? We need a function that the game runs for us automatically every moment!",
          "Look at `def check_flight():` -- inside it, write: `alt = get_altitude()` to read the current height into a variable.",
          "On the next line (still inside check_flight, 4 spaces): write `if alt > 50:` then on the line after (8 spaces): `show_message(f\"Flying! Altitude: {alt} km\")`",
          "Below the function (no spaces): write `on_update(check_flight)` -- notice: no `()` after `check_flight`! We're handing it to the game to run, not running it ourselves.",
          "Click Run Code! -- when the rocket passes 50 km, the message should appear. Try changing 50 to other values!",
        ],
        starterCode:
`set_thrust(90)
set_direction(90)

def check_flight():
    # Read the current altitude into a variable called alt:


    # If alt is more than 50, show a message with the altitude:


# Register check_flight to run every game tick (no () after the name!):


launch()
`,
        hint:
`Inside check_flight():
    alt = get_altitude()
    if alt > 50:
        show_message(f"Flying! Altitude: {alt} km")

Then outside:
on_update(check_flight)   ← no () after check_flight!`,
        solutionCode:
`set_thrust(90)
set_direction(90)

def check_flight():
    alt = get_altitude()
    if alt > 50:
        show_message(f"Flying! Altitude: {alt} km")

on_update(check_flight)
launch()
`,
        successCriteria: [
          'Define a function for on_update',
          'Call on_update()',
          'Rocket launches',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_function', name: 'check_flight' },
            { type: 'ast_calls_function', name: 'on_update' },
            { type: 'ast_calls_function', name: 'get_altitude' },
            { type: 'rocket_launched' },
          ],
        },
        reward: { stars: 1 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // RC4: Reach Orbit — if/elif, get_altitude(), orbit event
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'rc4_reach_orbit',
    title: 'Reach Orbit',
    purpose: 'Use if/elif conditions to respond to altitude and reach orbit.',
    storyIntro:
      "The final mission: reach orbit at 400 km! Use if/elif to check your altitude and react. You've learned everything you need — now fly!",
    estimatedMinutes: 40,
    engineType: 'rocket',
    learningOutcomes: ['if/elif', 'get_altitude()', 'orbit_reached event'],
    steps: [
      {
        stepId: 'rc4_s1_if_altitude',
        concepts: ['if statement', 'get_altitude()'],
        instruction:
`Orbit Step 1: Check your altitude! 📏

Use an if statement inside on_update to show a message when altitude > 100 km.`,
        detailedExplanation:
`🔍 get_altitude() returns how high your rocket is in km.
Use an if statement to check it:
  if get_altitude() > 100:
      show_message("Approaching orbit!")`,
        instructionSlides: [
          "`monitor` already reads altitude into `alt`. Now you need to make a decision: if the number is big enough, show a message!",
          "An `if` check runs the code inside ONLY when the condition is true. Write: `if alt > 100:` then on the next line (8 spaces): `show_message(\"Approaching orbit!\")`",
          "`alt > 100` means 'the altitude number is more than 100'. When that's true, Python runs the indented code.",
          "Click Run Code! and watch -- the message should appear as the rocket climbs past 100 km!",
        ],
        starterCode:
`set_thrust(100)
set_direction(90)

def monitor():
    alt = get_altitude()
    # Write an if statement: if alt is more than 100, show "Approaching orbit!":


on_update(monitor)
launch()
`,
        hint:
`Inside monitor() (4 spaces before if):
    if alt > 100:
        show_message("Approaching orbit!")`,
        solutionCode:
`set_thrust(100)
set_direction(90)

def monitor():
    alt = get_altitude()
    if alt > 100:
        show_message("Approaching orbit!")

on_update(monitor)
launch()
`,
        successCriteria: [
          'Use an if statement',
          'Call get_altitude()',
          'Rocket launches',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_if' },
            { type: 'ast_calls_function', name: 'get_altitude' },
            { type: 'rocket_launched' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'rc4_s2_orbit_message',
        concepts: ['elif', 'orbit'],
        instruction:
`Orbit Step 2: Add orbit detection! 🛸

Add an elif to check when altitude >= 400 and show "Orbit reached!".`,
        detailedExplanation:
`🛸 elif means "else if" — it checks a second condition:
  if alt > 100:
      show_message("Approaching orbit!")
  elif alt >= 400:
      show_message("Orbit reached!")

Run it and let the rocket fly up to 400 km!`,
        instructionSlides: [
          "We want TWO different messages -- one for approaching orbit, one for actually reaching it at 400 km!",
          "`elif` means 'else if' -- it adds a second condition right after the first `if`.",
          "After the `if alt > 100:` block, add: `elif alt >= 400:` then inside (8 spaces): `show_message(\"Orbit reached!\")`",
          "`>=` means 'greater than or equal to' -- so this fires when the rocket reaches exactly 400 km or higher.",
          "Click Run Code! and let the rocket fly all the way to 400 km. Watch for both messages as it climbs!",
        ],
        starterCode:
`set_thrust(100)
set_direction(90)

def monitor():
    alt = get_altitude()
    if alt > 100:
        show_message("Approaching orbit!")
    # Add elif: check if alt is 400 or more, then show "Orbit reached!":


on_update(monitor)
launch()
`,
        hint:
`After the if block (same level as if, 4 spaces):
    elif alt >= 400:
        show_message("Orbit reached!")

Note: >= means "greater than or equal to"`,
        solutionCode:
`set_thrust(100)
set_direction(90)

def monitor():
    alt = get_altitude()
    if alt >= 400:
        show_message("Orbit reached!")
    elif alt > 100:
        show_message("Approaching orbit!")

on_update(monitor)
launch()
`,
        successCriteria: [
          'Use if and elif',
          'Reach orbit (400 km)',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_if' },
            { type: 'orbit_reached' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'rc4_s3_fuel_check',
        concepts: ['get_fuel()', 'multiple conditions'],
        instruction:
`Orbit Step 3: Check your fuel! ⛽

Add a fuel check: if fuel <= 0, show "Out of fuel!".
Every astronaut needs to watch the fuel gauge!`,
        detailedExplanation:
`⛽ get_fuel() returns remaining fuel (0–100).
Add another condition to your monitor function:
  if get_fuel() <= 0:
      show_message("Out of fuel!")`,
        instructionSlides: [
          "Every rocket has limited fuel! `get_fuel()` returns how much is left (0 to 100).",
          "Inside `monitor`, after the altitude checks, write: `fuel = get_fuel()` to read the fuel level.",
          "Then write: `if fuel <= 0:` and inside (8 spaces): `show_message(\"Out of fuel!\")`. `<=` means 'less than or equal to'.",
          "Let the rocket fly until it runs out. Your warning message should appear when fuel hits zero!",
        ],
        starterCode:
`set_thrust(100)
set_direction(90)

def monitor():
    alt = get_altitude()
    if alt >= 400:
        show_message("Orbit reached!")
    elif alt > 100:
        show_message("Approaching orbit!")

    # Read the remaining fuel into a variable called fuel:


    # If fuel is 0 or less, show "Out of fuel!":


on_update(monitor)
launch()
`,
        hint:
`After the altitude checks (still inside monitor, 4 spaces):
    fuel = get_fuel()
    if fuel <= 0:
        show_message("Out of fuel!")

<= means "less than or equal to"`,
        solutionCode:
`set_thrust(100)
set_direction(90)

def monitor():
    alt = get_altitude()
    fuel = get_fuel()

    if alt >= 400:
        show_message("Orbit reached!")
    elif alt > 100:
        show_message("Approaching orbit!")

    if fuel <= 0:
        show_message("Out of fuel!")

on_update(monitor)
launch()
`,
        successCriteria: [
          'Call get_fuel()',
          'Add a fuel check condition',
          'Reach orbit',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_calls_function', name: 'get_fuel' },
            { type: 'ast_has_if' },
            { type: 'orbit_reached' },
          ],
        },
        reward: { stars: 1 },
      },
    ],
  },
];

// =============================================================================
// PACK DEFINITION
// =============================================================================

export const rocketMissionPack: MissionPack = {
  packId: 'rocket_basics_v1',
  packTitle: 'Space Cadet Program',
  description: 'Learn Python by launching and flying a rocket into orbit!',
  targetAgeRange: '8-14',
  gameTemplate: {
    templateId: 'rocket_basics',
    name: 'Rocket Simulator',
    themes: [],
    playerSprites: [],
    levelPresets: [],
    availableMechanics: [],
    defaultConfig: {
      THEME: 'space',
      PLAYER: { sprite: 'rocket', speed: 0, jumpStrength: 0 },
      MECHANICS: { doubleJump: false, dash: false, timer: false, lives: 1 },
      LEVEL: { preset: 'space', platforms: [], coins: [], enemies: [], goal: { x: 0, y: 0 } },
      WIN_RULE: { type: 'reach_goal', target: 1 },
    },
  },
  missions,
  learningOutcomes: [
    'Variables and data types',
    'print() and f-strings',
    'Functions with parameters',
    'if/elif conditions',
    'Callbacks with on_update()',
  ],
};

export function getRocketMissionById(missionId: string) {
  return missions.find(m => m.missionId === missionId);
}
