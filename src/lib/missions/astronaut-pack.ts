/**
 * Astronaut Main Path Mission Pack v1
 *
 * 8 missions mixing rocket coding and real-world space experiments.
 * Prerequisite: rocket_basics_v1 (Space Cadet Program).
 * Path: 'astronaut'
 */

import { MissionPack, Mission } from './schema';

const missions: Mission[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // A1: Design Your Rocket — creative (pixel art)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'as1_design_rocket',
    title: 'Design Your Rocket',
    purpose: 'Design a pixel art rocket that will appear in your missions.',
    storyIntro:
      "Every astronaut has their own rocket! Draw your rocket in the pixel art editor — it will be your personal spacecraft for the rest of the path.",
    estimatedMinutes: 35,
    engineType: 'rocket',
    missionType: 'creative',
    learningOutcomes: ['creativity', 'design thinking'],
    steps: [
      {
        stepId: 'as1_s1_draw_rocket',
        concepts: ['pixel art', 'design'],
        instruction: 'Draw your rocket in the 16×16 pixel editor!',
        detailedExplanation: 'Use the colour palette to design your rocket. Give it a nose cone, body, and fins. It will appear in your simulations!',
        starterCode: '',
        successCriteria: ['Draw and save your rocket'],
        validation: { type: 'ast', checks: [] },
        reward: { stars: 3, badge: 'rocket_designer' },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A2: Build a Water Rocket — experiment_guide + coding
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'as2_water_rocket',
    title: 'Build a Water Rocket',
    purpose: 'Build a real water rocket and calculate the best launch angle with if/elif.',
    storyIntro:
      "Real astronauts understand rockets by building them! First you'll build a water rocket, then write Python to calculate the perfect launch angle.",
    estimatedMinutes: 45,
    engineType: 'rocket',
    missionType: 'experiment_guide',
    learningOutcomes: ['experiment', 'if/elif', 'angles', 'physics'],
    steps: [
      {
        stepId: 'as2_s1_build',
        concepts: ['experiment', 'engineering'],
        instruction: 'Build your water rocket and launch it!',
        detailedExplanation: 'Follow the steps to build a plastic bottle rocket with fins. Get a grown-up to help with the pump!',
        starterCode: '',
        experimentGuide: {
          materials: [
            '2-litre plastic bottle',
            '3× cardboard rectangles (15cm each)',
            'Cork',
            'Bike pump with needle adaptor',
            'Water',
            'Sticky tape',
          ],
          steps: [
            'Cut 3 triangle fins from cardboard (about 15cm tall)',
            'Tape the fins evenly around the bottle near the base',
            'Fill the bottle one-third full with water',
            'Push the cork firmly into the bottle opening',
            'Attach the pump needle through the cork',
            'Point the rocket away from people, pump until it launches!',
          ],
          safetyNote: 'Always point the rocket away from people and buildings. Do this outside on grass with a grown-up present.',
        },
        successCriteria: ['Complete all build steps'],
        validation: { type: 'ast', checks: [] },
        reward: { stars: 2, badge: 'rocket_builder' },
      },
      {
        stepId: 'as2_s2_angle_calc',
        concepts: ['if/elif', 'variables', 'angles'],
        instruction:
`Water Rocket Step 2: Calculate launch angle! 📐

Use if/elif to find the best angle based on pump speed.
Higher speed = steeper angle.`,
        detailedExplanation:
`📐 Different speeds need different angles for the best flight.
Use if/elif to choose:
  if speed > 80: angle = 75
  elif speed > 50: angle = 60
  else: angle = 45

Print the ideal angle for your speed!`,
        starterCode:
`# How hard you pump (try different values!)
speed = 50

# Use if/elif to pick the best launch angle:
if speed > 80:
    angle = 75
elif speed > 50:
    angle = 60
else:
    angle = 45

print(f"Best launch angle: {angle} degrees")
print(f"Pump speed: {speed}")
`,
        hint:
`if speed > 80:
    angle = 75
elif speed > 50:
    angle = 60
else:
    angle = 45`,
        solutionCode:
`speed = 50

if speed > 80:
    angle = 75
elif speed > 50:
    angle = 60
else:
    angle = 45

print(f"Best launch angle: {angle} degrees")
print(f"Pump speed: {speed}")
`,
        successCriteria: [
          'Use if/elif/else',
          'Print the launch angle',
          'Output contains "degrees"',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_if' },
            { type: 'ast_has_assignment', variable: 'angle' },
            { type: 'stdout_contains', text: 'degrees' },
          ],
        },
        reward: { stars: 2 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A3: Gravity Simulation — coding, multiple planets
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'as3_gravity',
    title: 'Gravity Simulation',
    purpose: 'Simulate gravity on Earth, Moon, and Mars — see how thrust requirements differ.',
    storyIntro:
      "Gravity is different on every planet! On the Moon you need less thrust to fly. Let's simulate launching on three worlds.",
    estimatedMinutes: 30,
    engineType: 'rocket',
    learningOutcomes: ['variables', 'functions', 'scientific thinking'],
    steps: [
      {
        stepId: 'as3_s1_earth',
        concepts: ['gravity', 'set_thrust()'],
        instruction:
`Gravity Step 1: Launch on Earth! 🌍

Earth has strong gravity. You need at least 60% thrust to lift off.
Try set_thrust(70) and reach 50 km altitude.`,
        detailedExplanation:
`🌍 Earth's gravity is 9.8 m/s² — the strongest of the three planets.
You need high thrust to escape it!`,
        starterCode:
`# Launch on Earth — needs high thrust!
planet = "Earth"
print(f"Launching on {planet}...")

set_direction(90)
set_thrust(70)
launch()

def monitor():
    alt = get_altitude()
    if alt > 50:
        show_message(f"{planet}: {alt} km!")

on_update(monitor)
`,
        hint:
`set_thrust(70)
launch()`,
        solutionCode:
`planet = "Earth"
print(f"Launching on {planet}...")

set_direction(90)
set_thrust(70)
launch()

def monitor():
    alt = get_altitude()
    if alt > 50:
        show_message(f"{planet}: {alt} km!")

on_update(monitor)
`,
        successCriteria: [
          'Set thrust to at least 60',
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
        stepId: 'as3_s2_moon',
        concepts: ['comparison', 'different gravity'],
        instruction:
`Gravity Step 2: Launch on the Moon! 🌙

The Moon's gravity is 6× weaker than Earth's.
On the Moon, set_thrust(20) is enough to fly!
Try reaching 100 km with lower thrust.`,
        detailedExplanation:
`🌙 The Moon has much weaker gravity (1.6 m/s²).
Lower thrust gets you much higher!
Print a comparison between Earth and Moon thrust needed.`,
        starterCode:
`earth_thrust = 70
moon_thrust = 20

print(f"Earth needs: {earth_thrust}% thrust")
print(f"Moon needs:  {moon_thrust}% thrust")
print(f"Difference:  {earth_thrust - moon_thrust}% less on the Moon!")

set_direction(90)
set_thrust(moon_thrust)
launch()

def monitor():
    alt = get_altitude()
    if alt > 100:
        show_message(f"Moon launch! {alt} km!")

on_update(monitor)
`,
        hint:
`earth_thrust = 70
moon_thrust = 20
print(f"Earth needs: {earth_thrust}% thrust")`,
        solutionCode:
`earth_thrust = 70
moon_thrust = 20

print(f"Earth needs: {earth_thrust}% thrust")
print(f"Moon needs:  {moon_thrust}% thrust")
print(f"Difference:  {earth_thrust - moon_thrust}% less on the Moon!")

set_direction(90)
set_thrust(moon_thrust)
launch()

def monitor():
    alt = get_altitude()
    if alt > 100:
        show_message(f"Moon launch! {alt} km!")

on_update(monitor)
`,
        successCriteria: [
          'Compare Earth and Moon thrust',
          'Rocket launches with lower thrust',
          'Output shows comparison',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_calls_function', name: 'set_thrust' },
            { type: 'stdout_contains', text: 'Moon' },
            { type: 'rocket_launched' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'as3_s3_mars',
        concepts: ['function with planet parameter', 'reusable code'],
        instruction:
`Gravity Step 3: Build a planet launcher function! 🔴

Write a function launch_on_planet(planet, thrust) that works for any planet.
Call it for Earth, Moon, and Mars!`,
        detailedExplanation:
`🔴 Mars gravity is 3.7 m/s² — between Earth and Moon.
Mars thrust needed: about 40%.
Write one function, call it three times with different arguments!`,
        starterCode:
`def launch_on_planet(planet, thrust):
    print(f"Launching on {planet} with {thrust}% thrust")
    set_thrust(thrust)

launch_on_planet("Earth", 70)
launch_on_planet("Moon", 20)
launch_on_planet("Mars", 40)

set_direction(90)
launch()
`,
        hint:
`def launch_on_planet(planet, thrust):
    print(f"Launching on {planet} with {thrust}% thrust")
    set_thrust(thrust)`,
        solutionCode:
`def launch_on_planet(planet, thrust):
    print(f"Launching on {planet} with {thrust}% thrust")
    set_thrust(thrust)

launch_on_planet("Earth", 70)
launch_on_planet("Moon", 20)
launch_on_planet("Mars", 40)

set_direction(90)
launch()
`,
        successCriteria: [
          'Define launch_on_planet function',
          'Call it for three planets',
          'Output mentions Mars',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_function', name: 'launch_on_planet' },
            { type: 'stdout_contains', text: 'Mars' },
            { type: 'rocket_launched' },
          ],
        },
        reward: { stars: 1 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A4: Star Map — experiment_guide + coding
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'as4_star_map',
    title: 'Star Map',
    purpose: 'Draw 5 constellations and code star distances with variables.',
    storyIntro:
      "Astronauts navigate by the stars! First you'll draw a star map, then use Python to record star distances.",
    estimatedMinutes: 40,
    engineType: 'rocket',
    missionType: 'experiment_guide',
    learningOutcomes: ['experiment', 'variables', 'dictionaries', 'astronomy'],
    steps: [
      {
        stepId: 'as4_s1_draw_stars',
        concepts: ['experiment', 'astronomy'],
        instruction: 'Draw your star map — 5 constellations on black card!',
        detailedExplanation: 'Use white paint or chalk to draw 5 constellations. Label each one!',
        starterCode: '',
        experimentGuide: {
          materials: [
            'Black card or paper (A4)',
            'White paint pen, chalk, or white gel pen',
            'Ruler',
            'Star chart (printed or on a screen)',
          ],
          steps: [
            'Look up a star chart for your hemisphere',
            'Draw 5 constellations on the black card',
            'Use dots for stars and lines to connect them',
            'Label each constellation with its name',
            'Note which star is the brightest in each one',
          ],
          safetyNote: 'If going outside at night to observe real stars, always go with a grown-up.',
        },
        successCriteria: ['Complete the star map'],
        validation: { type: 'ast', checks: [] },
        reward: { stars: 2, badge: 'star_mapper' },
      },
      {
        stepId: 'as4_s2_star_distances',
        concepts: ['variables', 'f-strings', 'light years'],
        instruction:
`Star Map Step 2: Record star distances! ⭐

Create variables for 5 star distances in light years and print them.`,
        detailedExplanation:
`⭐ Light years measure distance in space.
  proxima_centauri = 4.2  # light years
  sirius = 8.6
  betelgeuse = 700

Store each star's distance in a variable and print them all!`,
        starterCode:
`# Distances in light years from Earth
proxima_centauri = 4.2
sirius = 8.6
rigel = 860
betelgeuse = 700
vega = 25

print("=== Star Distance Chart ===")
print(f"Proxima Centauri: {proxima_centauri} light years")
print(f"Sirius:          {sirius} light years")
print(f"Vega:            {vega} light years")
print(f"Rigel:           {rigel} light years")
print(f"Betelgeuse:      {betelgeuse} light years")
`,
        hint:
`proxima_centauri = 4.2
sirius = 8.6
print(f"Sirius: {sirius} light years")`,
        solutionCode:
`proxima_centauri = 4.2
sirius = 8.6
rigel = 860
betelgeuse = 700
vega = 25

print("=== Star Distance Chart ===")
print(f"Proxima Centauri: {proxima_centauri} light years")
print(f"Sirius:          {sirius} light years")
print(f"Vega:            {vega} light years")
print(f"Rigel:           {rigel} light years")
print(f"Betelgeuse:      {betelgeuse} light years")
`,
        successCriteria: [
          'Create star distance variables',
          'Print all five distances',
          'Output contains "light years"',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_assignment', variable: 'sirius' },
            { type: 'stdout_contains', text: 'light years' },
          ],
        },
        reward: { stars: 2 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A5: Mission Control — WASD steering, reach orbit and return
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'as5_mission_control',
    title: 'Mission Control',
    purpose: 'Write a full keyboard-controlled mission to orbit and return.',
    storyIntro:
      "It's the big one! Fly to orbit and come back safely. You'll use on_update and conditions to manage a complete space mission.",
    estimatedMinutes: 35,
    engineType: 'rocket',
    learningOutcomes: ['on_update', 'conditions', 'mission phases'],
    steps: [
      {
        stepId: 'as5_s1_launch_phase',
        concepts: ['launch phase', 'thrust control'],
        instruction:
`Mission Step 1: Launch phase! 🚀

Write code to launch the rocket: set thrust to 100, direction to 90.
Show a message when altitude reaches 100 km.`,
        detailedExplanation:
`🚀 A real mission has phases. Phase 1 is launch!
Set thrust and direction, then use on_update to monitor altitude.`,
        starterCode:
`set_thrust(100)
set_direction(90)

def mission_control():
    alt = get_altitude()
    fuel = get_fuel()

    if alt >= 100:
        show_message(f"Phase 2: Ascending! {alt} km")
    else:
        show_message(f"Launching... {alt} km")

on_update(mission_control)
launch()
`,
        hint:
`set_thrust(100)
set_direction(90)
launch()`,
        solutionCode:
`set_thrust(100)
set_direction(90)

def mission_control():
    alt = get_altitude()
    if alt >= 100:
        show_message(f"Phase 2: Ascending! {alt} km")
    else:
        show_message(f"Launching... {alt} km")

on_update(mission_control)
launch()
`,
        successCriteria: [
          'Set thrust and direction',
          'Use on_update',
          'Rocket launches',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_calls_function', name: 'set_thrust' },
            { type: 'ast_calls_function', name: 'on_update' },
            { type: 'rocket_launched' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'as5_s2_orbit_phase',
        concepts: ['orbit', 'mission phases'],
        instruction:
`Mission Step 2: Reach orbit! 🛸

Add a condition: when altitude >= 400, show "Orbit achieved!" and reduce thrust.`,
        detailedExplanation:
`🛸 At orbit you can reduce thrust — you're in free fall!
  if alt >= 400:
      show_message("Orbit achieved!")
      set_thrust(0)`,
        starterCode:
`set_thrust(100)
set_direction(90)

def mission_control():
    alt = get_altitude()

    if alt >= 400:
        show_message("Orbit achieved! ★")
        set_thrust(0)
    elif alt >= 100:
        show_message(f"Ascending: {alt} km")
    else:
        show_message(f"Launching: {alt} km")

on_update(mission_control)
launch()
`,
        hint:
`if alt >= 400:
    show_message("Orbit achieved!")
    set_thrust(0)`,
        solutionCode:
`set_thrust(100)
set_direction(90)

def mission_control():
    alt = get_altitude()

    if alt >= 400:
        show_message("Orbit achieved! ★")
        set_thrust(0)
    elif alt >= 100:
        show_message(f"Ascending: {alt} km")
    else:
        show_message(f"Launching: {alt} km")

on_update(mission_control)
launch()
`,
        successCriteria: [
          'Check for orbit altitude',
          'Reach orbit',
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
        stepId: 'as5_s3_fuel_management',
        concepts: ['fuel monitoring', 'full mission'],
        instruction:
`Mission Step 3: Manage fuel! ⛽

Add fuel monitoring. If fuel < 20%, reduce thrust to 50 to conserve it.
Complete the full mission with fuel awareness!`,
        detailedExplanation:
`⛽ Real missions carefully manage fuel consumption.
Check fuel in your on_update and throttle back when running low!`,
        starterCode:
`set_thrust(100)
set_direction(90)

def mission_control():
    alt = get_altitude()
    fuel = get_fuel()

    # Fuel conservation
    if fuel < 20:
        set_thrust(50)

    # Mission phases
    if alt >= 400:
        show_message(f"ORBIT! Fuel: {fuel}%")
        set_thrust(0)
    elif alt >= 100:
        show_message(f"Ascending: {alt} km | Fuel: {fuel}%")

on_update(mission_control)
launch()
`,
        hint:
`if fuel < 20:
    set_thrust(50)`,
        solutionCode:
`set_thrust(100)
set_direction(90)

def mission_control():
    alt = get_altitude()
    fuel = get_fuel()

    if fuel < 20:
        set_thrust(50)

    if alt >= 400:
        show_message(f"ORBIT! Fuel: {fuel}%")
        set_thrust(0)
    elif alt >= 100:
        show_message(f"Ascending: {alt} km | Fuel: {fuel}%")

on_update(mission_control)
launch()
`,
        successCriteria: [
          'Check fuel level',
          'Manage thrust based on fuel',
          'Reach orbit',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_calls_function', name: 'get_fuel' },
            { type: 'orbit_reached' },
          ],
        },
        reward: { stars: 1 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A6: Planet Landing — controlled descent
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'as6_planet_landing',
    title: 'Planet Landing',
    purpose: 'Land the rocket safely by controlling thrust during descent.',
    storyIntro:
      "You've been in orbit — now land safely! Too fast and you'll crash. Use your fuel wisely to control the descent.",
    estimatedMinutes: 30,
    engineType: 'rocket',
    learningOutcomes: ['altitude monitoring', 'landing logic', 'conditions'],
    steps: [
      {
        stepId: 'as6_s1_descent',
        concepts: ['descent', 'altitude monitoring'],
        instruction:
`Landing Step 1: Begin descent! ⬇️

Set thrust to 0 to begin descending. Show the altitude as you fall.`,
        detailedExplanation:
`⬇️ With no thrust, gravity pulls the rocket down.
Watch the altitude decrease! When does it reach 0?`,
        starterCode:
`# Start in orbit
set_thrust(80)
set_direction(90)

def descent():
    alt = get_altitude()
    show_message(f"Altitude: {alt} km")

on_update(descent)
launch()
`,
        hint:
`set_thrust(0)  # No thrust = falling`,
        solutionCode:
`set_thrust(80)
set_direction(90)

def descent():
    alt = get_altitude()
    show_message(f"Altitude: {alt} km")

on_update(descent)
launch()
`,
        successCriteria: [
          'Monitor altitude during flight',
          'Rocket launches',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_calls_function', name: 'get_altitude' },
            { type: 'rocket_launched' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'as6_s2_braking',
        concepts: ['braking thrust', 'landing conditions'],
        instruction:
`Landing Step 2: Fire retro-rockets! 🔥

When altitude < 100, fire retro-rockets (increase thrust) to slow descent.`,
        detailedExplanation:
`🔥 Real rockets fire engines downward to slow their descent.
If altitude < 100, apply thrust (e.g. 30) to slow down.
If altitude < 10, apply more thrust (60) for final approach!`,
        starterCode:
`set_thrust(100)
set_direction(90)

def landing_control():
    alt = get_altitude()

    if alt < 10:
        set_thrust(60)
        show_message(f"Final approach: {alt} km")
    elif alt < 100:
        set_thrust(30)
        show_message(f"Braking: {alt} km")
    elif alt >= 400:
        set_thrust(0)
        show_message("In orbit — beginning descent")

on_update(landing_control)
launch()
`,
        hint:
`if alt < 100:
    set_thrust(30)  # retro-rockets`,
        solutionCode:
`set_thrust(100)
set_direction(90)

def landing_control():
    alt = get_altitude()

    if alt < 10:
        set_thrust(60)
        show_message(f"Final approach: {alt} km")
    elif alt < 100:
        set_thrust(30)
        show_message(f"Braking: {alt} km")
    elif alt >= 400:
        set_thrust(0)
        show_message("In orbit — beginning descent")

on_update(landing_control)
launch()
`,
        successCriteria: [
          'Apply braking thrust at low altitude',
          'Use if/elif for altitude phases',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_if' },
            { type: 'thrust_set' },
            { type: 'rocket_launched' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'as6_s3_touchdown',
        concepts: ['touchdown message', 'complete landing'],
        instruction:
`Landing Step 3: Touchdown! 🛬

Show a touchdown message when altitude reaches 0.
Complete the full launch → orbit → land sequence!`,
        detailedExplanation:
`🛬 When altitude == 0 the rocket has landed.
Show a congratulations message and stop the engine!`,
        starterCode:
`set_thrust(100)
set_direction(90)

def full_mission():
    alt = get_altitude()
    fuel = get_fuel()

    if alt == 0:
        set_thrust(0)
        show_message(f"Touchdown! Fuel left: {fuel}%")
    elif alt < 10:
        set_thrust(60)
        show_message(f"Final approach: {alt} km")
    elif alt < 100:
        set_thrust(30)
        show_message(f"Braking: {alt} km")
    elif alt >= 400:
        set_thrust(0)
        show_message("Orbit — descending")

on_update(full_mission)
launch()
`,
        hint:
`if alt == 0:
    set_thrust(0)
    show_message("Touchdown!")`,
        solutionCode:
`set_thrust(100)
set_direction(90)

def full_mission():
    alt = get_altitude()
    fuel = get_fuel()

    if alt == 0:
        set_thrust(0)
        show_message(f"Touchdown! Fuel left: {fuel}%")
    elif alt < 10:
        set_thrust(60)
    elif alt < 100:
        set_thrust(30)
    elif alt >= 400:
        set_thrust(0)

on_update(full_mission)
launch()
`,
        successCriteria: [
          'Show touchdown message',
          'Use fuel monitoring',
          'Complete mission sequence',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_calls_function', name: 'get_fuel' },
            { type: 'ast_has_if' },
            { type: 'rocket_launched' },
          ],
        },
        reward: { stars: 1 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A7: Alien Discovery — random, if/elif, string generation
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'as7_alien_discovery',
    title: 'Alien Discovery',
    purpose: 'Generate alien greetings using random and if/elif to respond.',
    storyIntro:
      "You've landed on a mysterious planet and something is approaching... Use Python to generate an alien greeting and decide how to respond!",
    estimatedMinutes: 30,
    engineType: 'rocket',
    learningOutcomes: ['import random', 'random.choice()', 'if/elif with strings'],
    steps: [
      {
        stepId: 'as7_s1_random',
        concepts: ['import', 'random.choice()'],
        instruction:
`Alien Step 1: Generate a random greeting! 👾

Use random.choice() to pick a random alien greeting from a list.`,
        detailedExplanation:
`👾 import random lets you use random number functions.
  import random
  greetings = ["Zorp!", "Beep boop", "Greetings, Earthling"]
  greeting = random.choice(greetings)
  print(greeting)`,
        starterCode:
`import random

# List of possible alien greetings
greetings = ["Zorp!", "Beep boop!", "Greetings, Earthling!", "Bzzzt!", "Meeble worp!"]

# Pick a random one
greeting = random.choice(greetings)
print(f"The alien says: {greeting}")
`,
        hint:
`import random
greeting = random.choice(greetings)`,
        solutionCode:
`import random

greetings = ["Zorp!", "Beep boop!", "Greetings, Earthling!", "Bzzzt!", "Meeble worp!"]

greeting = random.choice(greetings)
print(f"The alien says: {greeting}")
`,
        successCriteria: [
          'Import random',
          'Use random.choice()',
          'Print the greeting',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_calls_function', name: 'random.choice' },
            { type: 'stdout_contains', text: 'alien' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'as7_s2_respond',
        concepts: ['if/elif with strings', 'in keyword'],
        instruction:
`Alien Step 2: Respond to the greeting! 💬

Use if/elif to check which greeting was chosen and respond differently.`,
        detailedExplanation:
`💬 Use if/elif to respond based on the greeting:
  if greeting == "Zorp!":
      response = "Zorp to you too!"
  elif "boop" in greeting:
      response = "Boop boop!"
  else:
      response = "Hello! I come in peace."`,
        starterCode:
`import random

greetings = ["Zorp!", "Beep boop!", "Greetings, Earthling!", "Bzzzt!", "Meeble worp!"]
greeting = random.choice(greetings)
print(f"Alien: {greeting}")

# Respond based on what the alien said
if greeting == "Zorp!":
    response = "Zorp to you too!"
elif "boop" in greeting:
    response = "Boop boop back at you!"
elif "Earthling" in greeting:
    response = "Yes, I'm from Earth! Pleased to meet you!"
else:
    response = "Hello! I come in peace."

print(f"You say: {response}")
`,
        hint:
`if greeting == "Zorp!":
    response = "Zorp to you too!"
else:
    response = "Hello! I come in peace."`,
        solutionCode:
`import random

greetings = ["Zorp!", "Beep boop!", "Greetings, Earthling!", "Bzzzt!", "Meeble worp!"]
greeting = random.choice(greetings)
print(f"Alien: {greeting}")

if greeting == "Zorp!":
    response = "Zorp to you too!"
elif "boop" in greeting:
    response = "Boop boop back at you!"
elif "Earthling" in greeting:
    response = "Yes, I'm from Earth! Pleased to meet you!"
else:
    response = "Hello! I come in peace."

print(f"You say: {response}")
`,
        successCriteria: [
          'Use if/elif/else',
          'Print both alien and response',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_if' },
            { type: 'stdout_contains', text: 'You say' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'as7_s3_show_on_hud',
        concepts: ['show_message()', 'on_update'],
        instruction:
`Alien Step 3: Show the encounter on the rocket HUD! 🖥️

Use show_message() to display the alien conversation on your rocket's screen!`,
        detailedExplanation:
`🖥️ show_message() shows text on the rocket's HUD.
First launch the rocket, then display the alien message!`,
        starterCode:
`import random

greetings = ["Zorp!", "Beep boop!", "Greetings, Earthling!"]
greeting = random.choice(greetings)

responses = {
    "Zorp!": "Zorp to you too!",
    "Beep boop!": "Boop boop!",
    "Greetings, Earthling!": "I come in peace!"
}

response = responses.get(greeting, "Hello!")

print(f"Alien: {greeting}")
print(f"You:   {response}")

set_thrust(40)
set_direction(90)
launch()
show_message(f"Alien: {greeting}")
`,
        hint:
`show_message(f"Alien: {greeting}")
launch()`,
        solutionCode:
`import random

greetings = ["Zorp!", "Beep boop!", "Greetings, Earthling!"]
greeting = random.choice(greetings)

responses = {
    "Zorp!": "Zorp to you too!",
    "Beep boop!": "Boop boop!",
    "Greetings, Earthling!": "I come in peace!"
}

response = responses.get(greeting, "Hello!")

print(f"Alien: {greeting}")
print(f"You:   {response}")

set_thrust(40)
set_direction(90)
launch()
show_message(f"Alien: {greeting}")
`,
        successCriteria: [
          'Show alien message on HUD',
          'Print the conversation',
          'Rocket launches',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_calls_function', name: 'show_message' },
            { type: 'stdout_contains', text: 'Alien' },
            { type: 'rocket_launched' },
          ],
        },
        reward: { stars: 1 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // A8: Space Mission Complete — full mission combining all concepts
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'as8_full_mission',
    title: 'Space Mission Complete',
    purpose: 'Write a complete space mission combining all concepts learned.',
    storyIntro:
      "This is it — your final mission! Launch, orbit, discover aliens, and land safely. Write the most complete rocket program you've ever coded!",
    estimatedMinutes: 45,
    engineType: 'rocket',
    learningOutcomes: ['all concepts combined', 'full program design'],
    steps: [
      {
        stepId: 'as8_s1_mission_plan',
        concepts: ['variables', 'functions', 'program planning'],
        instruction:
`Final Mission Step 1: Plan your mission! 📝

Create mission variables and define a mission_log function that prints updates.
Plan: pilot name, target altitude, and mission name.`,
        detailedExplanation:
`📝 Good programmers plan before they code!
Set up all your mission variables and a logging function.`,
        starterCode:
`# Mission parameters
pilot_name = "Commander Alex"
mission_name = "Operation Starbound"
target_altitude = 400

# Mission log function
def mission_log(message):
    print(f"[{mission_name}] {message}")

mission_log(f"Pilot: {pilot_name}")
mission_log(f"Target: {target_altitude} km")
mission_log("Systems ready. Prepare for launch!")
`,
        hint:
`def mission_log(message):
    print(f"[{mission_name}] {message}")`,
        solutionCode:
`pilot_name = "Commander Alex"
mission_name = "Operation Starbound"
target_altitude = 400

def mission_log(message):
    print(f"[{mission_name}] {message}")

mission_log(f"Pilot: {pilot_name}")
mission_log(f"Target: {target_altitude} km")
mission_log("Systems ready. Prepare for launch!")
`,
        successCriteria: [
          'Define mission variables',
          'Create mission_log function',
          'Print mission briefing',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_function', name: 'mission_log' },
            { type: 'ast_has_assignment', variable: 'pilot_name' },
            { type: 'stdout_contains', text: 'launch' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'as8_s2_full_flight',
        concepts: ['full mission', 'all phases'],
        instruction:
`Final Mission Step 2: Launch and reach orbit! 🚀

Use on_update to handle all mission phases: launch → ascent → orbit.
Show mission_log updates at each phase.`,
        detailedExplanation:
`🚀 Put it all together! Use your mission_log function inside on_update
to report on each phase of the mission.`,
        starterCode:
`pilot_name = "Commander Alex"
target_altitude = 400

def mission_log(message):
    print(f"[Mission] {message}")

set_thrust(100)
set_direction(90)

def full_mission():
    alt = get_altitude()
    fuel = get_fuel()

    if alt >= target_altitude:
        set_thrust(0)
        show_message(f"ORBIT! Alt: {alt} km")
    elif alt >= 100:
        show_message(f"Ascending: {alt} km")
    else:
        show_message(f"Launch phase: {alt} km")

on_update(full_mission)
mission_log("Launching!")
launch()
`,
        hint:
`on_update(full_mission)
launch()`,
        solutionCode:
`pilot_name = "Commander Alex"
target_altitude = 400

def mission_log(message):
    print(f"[Mission] {message}")

set_thrust(100)
set_direction(90)

def full_mission():
    alt = get_altitude()
    if alt >= target_altitude:
        set_thrust(0)
        show_message(f"ORBIT! Alt: {alt} km")
    elif alt >= 100:
        show_message(f"Ascending: {alt} km")
    else:
        show_message(f"Launch phase: {alt} km")

on_update(full_mission)
mission_log("Launching!")
launch()
`,
        successCriteria: [
          'Use on_update with all phases',
          'Reach orbit',
          'Print mission log',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_calls_function', name: 'on_update' },
            { type: 'orbit_reached' },
            { type: 'stdout_contains', text: 'Mission' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'as8_s3_complete_mission',
        concepts: ['complete program', 'all concepts'],
        instruction:
`Final Mission Step 3: Complete the mission! 🏆

Add fuel management and a completion message.
This is your masterpiece — make it the best rocket program you've written!`,
        detailedExplanation:
`🏆 The best programs handle every case.
Add fuel warnings, all phases, and a final completion message.
You've earned the Astronaut badge!`,
        starterCode:
`import random

pilot_name = "Commander Alex"
target_altitude = 400

def mission_log(message):
    print(f"[Mission] {message}")

set_thrust(100)
set_direction(90)

phase = "launch"

def full_mission():
    global phase
    alt = get_altitude()
    fuel = get_fuel()

    if fuel < 15:
        mission_log(f"WARNING: Fuel critical! {fuel}%")

    if alt >= target_altitude and phase == "ascent":
        phase = "orbit"
        set_thrust(0)
        show_message("ORBIT ACHIEVED! ★")
        mission_log("Orbit achieved!")
    elif alt >= 50 and phase == "launch":
        phase = "ascent"
        show_message(f"Ascending: {alt} km")
    elif phase == "launch":
        show_message(f"Launching: {alt} km")

on_update(full_mission)
mission_log(f"Pilot {pilot_name} — launching!")
launch()
`,
        hint:
`global phase
if alt >= target_altitude:
    phase = "orbit"
    show_message("ORBIT ACHIEVED!")`,
        solutionCode:
`import random

pilot_name = "Commander Alex"
target_altitude = 400

def mission_log(message):
    print(f"[Mission] {message}")

set_thrust(100)
set_direction(90)

phase = "launch"

def full_mission():
    global phase
    alt = get_altitude()
    fuel = get_fuel()

    if fuel < 15:
        mission_log(f"WARNING: Fuel critical! {fuel}%")

    if alt >= target_altitude and phase == "ascent":
        phase = "orbit"
        set_thrust(0)
        show_message("ORBIT ACHIEVED! ★")
        mission_log("Orbit achieved!")
    elif alt >= 50 and phase == "launch":
        phase = "ascent"
        show_message(f"Ascending: {alt} km")
    elif phase == "launch":
        show_message(f"Launching: {alt} km")

on_update(full_mission)
mission_log(f"Pilot {pilot_name} — launching!")
launch()
`,
        successCriteria: [
          'Manage mission phases',
          'Add fuel monitoring',
          'Reach orbit',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_calls_function', name: 'get_fuel' },
            { type: 'orbit_reached' },
            { type: 'stdout_contains', text: 'Mission' },
          ],
        },
        reward: { stars: 3, badge: 'astronaut' },
      },
    ],
  },
];

// =============================================================================
// PACK DEFINITION
// =============================================================================

export const astronautMissionPack: MissionPack = {
  packId: 'astronaut_v1',
  packTitle: 'Space Explorer',
  description: 'Complete 8 space missions — from designing your rocket to discovering aliens and landing safely.',
  targetAgeRange: '8-14',
  gameTemplate: {
    templateId: 'astronaut_path',
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
    'Variables, f-strings, print()',
    'Functions with parameters',
    'if/elif/else conditions',
    'Lists and for loops',
    'Callbacks and on_update()',
    'import random',
    'Real-world rocket science',
  ],
};

export function getAstronautMissionById(missionId: string) {
  return missions.find(m => m.missionId === missionId);
}
