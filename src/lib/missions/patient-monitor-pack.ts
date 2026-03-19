/**
 * Patient Monitor Basics Mission Pack v1
 *
 * Junior Medic Academy — a gentle Python introduction through a hospital monitor.
 * Teaches variables, functions, conditionals, and loops via patient care.
 *
 * 4 missions × 3 steps = 12 steps total.
 * All missions have engineType: 'patient_monitor'.
 * Free pack (like snake_basics_v1 and rocket_basics_v1).
 */

import { MissionPack, Mission } from './schema';

// =============================================================================
// MISSIONS
// =============================================================================

const missions: Mission[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // PM1: First Day at the Hospital — variables, print(), patient card
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'pm1_first_day',
    title: 'First Day at the Hospital',
    purpose: 'Learn variables and print() by creating a patient card.',
    storyIntro:
      "Welcome to DreamPaths Hospital! As a junior medic, your first job is to fill out a patient card. Let's use Python to record the patient's information!",
    estimatedMinutes: 30,
    engineType: 'patient_monitor',
    learningOutcomes: ['variables', 'print()', 'string and number types'],
    steps: [
      {
        stepId: 'pm1_s1_variables',
        concepts: ['variables', 'assignment'],
        instruction:
`Day 1 Step 1: Create the patient card! 🏥

Every patient needs a record. Create variables for:
patient_name, age, and heart_rate.`,
        detailedExplanation:
`📋 Variables store information we need later.
Text goes in quotes: patient_name = "Jamie"
Numbers don't: age = 10, heart_rate = 72

Create all three variables to continue!`,
        instructionSlides: [
          "Welcome to DreamPaths Hospital! As a junior medic, you'll use Python to look after patients.",
          "First, let's fill in the patient card. A variable stores information -- like a box with a label on it.",
          "Find `patient_name =` and complete it: `patient_name = \"Jamie\"` -- text values always need quotes!",
          "Find `age =` and add a number: `age = 10` -- numbers don't need quotes.",
          "Find `heart_rate =` and set it to 72 -- that's a normal heart rate in beats per minute. Then click Run Code!",
        ],
        starterCode:
`# Patient card — fill in the details!

# The patient's name (text, use quotes)
patient_name =

# Patient's age (a number)
age =

# Heart rate in beats per minute
heart_rate =
`,
        hint:
`patient_name = "Jamie"
age = 10
heart_rate = 72`,
        solutionCode:
`patient_name = "Jamie"
age = 10
heart_rate = 72
`,
        successCriteria: [
          'Create patient_name variable',
          'Create age variable',
          'Create heart_rate variable',
        ],
        validation: {
          type: 'ast',
          checks: [
            { type: 'ast_has_assignment', variable: 'patient_name' },
            { type: 'ast_has_assignment', variable: 'age' },
            { type: 'ast_has_assignment', variable: 'heart_rate' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'pm1_s2_print_card',
        concepts: ['print()', 'f-strings'],
        instruction:
`Day 1 Step 2: Print the patient card! 🖨️

Use print() and an f-string to display the patient's information nicely.`,
        detailedExplanation:
`🖨️ f-strings let you put variables inside text:
  print(f"Patient: {patient_name}, Age: {age}")

The {} curly braces are replaced with the variable's value!`,
        instructionSlides: [
          "The patient card data is ready! Now let's print it in a readable format using an f-string.",
          "An f-string starts with `f` before the opening `\"`. Then any variable inside `{ }` gets swapped for its value.",
          "Write: `print(f\"Patient: {patient_name}, Age: {age}, HR: {heart_rate} bpm\")` -- three variables, three `{ }` blanks!",
          "Click Run Code! -- you should see Jamie's details filled in. Try changing the values at the top and re-running!",
        ],
        starterCode:
`patient_name = "Jamie"
age = 10
heart_rate = 72

# Write a print() using an f-string that shows all three variables:
# Put f before the quote, wrap each variable in { }
# Example output: Patient: Jamie, Age: 10, HR: 72 bpm
`,
        hint:
`print(f"Patient: {patient_name}, Age: {age}, HR: {heart_rate} bpm")

Remember: f before the quote, variables inside { }`,
        solutionCode:
`patient_name = "Jamie"
age = 10
heart_rate = 72

print(f"Patient: {patient_name}, Age: {age}, HR: {heart_rate} bpm")
`,
        successCriteria: [
          'Use print()',
          'Output contains patient name',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_calls_function', name: 'print' },
            { type: 'stdout_contains', text: 'Jamie' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'pm1_s3_monitor',
        concepts: ['set_heart_rate()', 'monitor API'],
        instruction:
`Day 1 Step 3: Update the monitor! 📺

Use set_heart_rate() to show the heart rate on the patient monitor screen.
Watch the EKG waveform change!`,
        detailedExplanation:
`📺 The monitor shows the patient's vitals visually.
Call set_heart_rate(72) to update the display.
Try different values — normal is 60–100 bpm!`,
        instructionSlides: [
          "Now let's hook up the heart monitor! `set_heart_rate()` updates the display on the monitor screen.",
          "Write: `set_heart_rate(heart_rate)` -- passing the variable means the monitor shows whatever value is stored in `heart_rate`.",
          "On the next line, write: `start_monitor()` -- this turns on the monitor and shows the EKG waveform.",
          "Click Run Code! -- watch the monitor panel on the left. The EKG line should appear!",
          "Try changing `heart_rate = 72` at the top to 120 or 40. Re-run and see the waveform change speed!",
        ],
        starterCode:
`patient_name = "Jamie"
heart_rate = 72

# Update the monitor display — call set_heart_rate() with the heart_rate variable:


# Turn on the monitor to show the EKG waveform — call start_monitor():


print(f"Monitoring {patient_name} — HR: {heart_rate} bpm")
`,
        hint:
`set_heart_rate(heart_rate)   ← pass the variable, not a raw number
start_monitor()               ← turns on the monitor display`,
        solutionCode:
`patient_name = "Jamie"
heart_rate = 72

set_heart_rate(heart_rate)
start_monitor()

print(f"Monitoring {patient_name} — HR: {heart_rate} bpm")
`,
        successCriteria: [
          'Call set_heart_rate()',
          'Call start_monitor()',
          'Output contains monitoring info',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_calls_function', name: 'set_heart_rate' },
            { type: 'vital_set' },
          ],
        },
        reward: { stars: 1 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // PM2: Check the Vitals — def, parameters, return values
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'pm2_check_vitals',
    title: 'Check the Vitals',
    purpose: 'Learn functions with parameters and return values.',
    storyIntro:
      "A good doctor checks all the vitals! Let's write functions to read and process patient data systematically.",
    estimatedMinutes: 35,
    engineType: 'patient_monitor',
    learningOutcomes: ['def', 'parameters', 'return values'],
    steps: [
      {
        stepId: 'pm2_s1_define_function',
        concepts: ['def', 'function definition'],
        instruction:
`Vitals Step 1: Write a check function! 🔬

Define a function called check_patient that sets the patient's vitals on the monitor.`,
        detailedExplanation:
`🔬 Functions group code so you can reuse it.
  def check_patient():
      set_heart_rate(75)
      set_oxygen(98)

Call start_monitor() after to see the results!`,
        instructionSlides: [
          "Let's write a function that checks all the patient's vitals in one go!",
          "Look at `def check_patient():` -- it's an empty function body. Your job: fill in the three vital-setting calls inside it.",
          "With 4 spaces before each: `set_heart_rate(75)`, `set_oxygen(98)`, `set_blood_pressure(120, 80)` -- one per line.",
          "`check_patient()` and `start_monitor()` at the bottom are already there. Fill in the function body and click Run Code!",
          "Try changing the numbers inside `check_patient`. What happens if you set heart rate to 120?",
        ],
        starterCode:
`def check_patient():
    # Set the heart rate to 75 bpm:

    # Set oxygen to 98%:

    # Set blood pressure — two numbers: systolic (120) and diastolic (80):


check_patient()
start_monitor()
`,
        hint:
`Inside check_patient() (4 spaces before each call):
    set_heart_rate(75)
    set_oxygen(98)
    set_blood_pressure(120, 80)`,
        solutionCode:
`def check_patient():
    set_heart_rate(75)
    set_oxygen(98)
    set_blood_pressure(120, 80)

check_patient()
start_monitor()
`,
        successCriteria: [
          'Define check_patient function',
          'Call set_heart_rate()',
          'Vitals updated on monitor',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_function', name: 'check_patient' },
            { type: 'vital_set' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'pm2_s2_parameters',
        concepts: ['parameters', 'arguments'],
        instruction:
`Vitals Step 2: Make the function flexible with parameters! 🎯

Add a parameter so you can pass the heart rate when calling the function.`,
        detailedExplanation:
`🎯 Parameters let you pass values in:
  def check_patient(hr):
      set_heart_rate(hr)

Now call it: check_patient(80) or check_patient(60)
Try different heart rates!`,
        instructionSlides: [
          "What if we want to check different patients with different heart rates? We can add a setting to `check_patient`!",
          "Look at `def check_patient(hr):` -- `hr` is the setting. When you call `check_patient(80)`, the number 80 becomes `hr` inside.",
          "Inside the function (4 spaces): write `set_heart_rate(hr)` -- uses whatever number was passed in.",
          "On the next line (still 4 spaces): write `print(f\"Heart rate set to {hr} bpm\")` -- shows what was set.",
          "Click Run Code! -- then try changing 80 to different numbers. What's a dangerously high rate? Too slow?",
        ],
        starterCode:
`def check_patient(hr):
    # Use set_heart_rate() with the hr parameter:

    # Print: "Heart rate set to {hr} bpm" using an f-string:


check_patient(80)
start_monitor()
`,
        hint:
`Inside check_patient(hr) (4 spaces):
    set_heart_rate(hr)
    print(f"Heart rate set to {hr} bpm")

hr is the parameter — it takes whatever number you pass in when you call the function.`,
        solutionCode:
`def check_patient(hr):
    set_heart_rate(hr)
    print(f"Heart rate set to {hr} bpm")

check_patient(80)
start_monitor()
`,
        successCriteria: [
          'Function takes a parameter',
          'Output shows heart rate',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_function', name: 'check_patient' },
            { type: 'stdout_contains', text: 'bpm' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'pm2_s3_get_reading',
        concepts: ['get_reading()', 'reading sensor data'],
        instruction:
`Vitals Step 3: Read the monitor! 📊

Use get_reading() to read back the current heart rate.
Print the reading to show it's working!`,
        detailedExplanation:
`📊 get_reading("heart_rate") returns the current value.
After setting the heart rate, read it back:
  hr = get_reading("heart_rate")
  print(f"Current HR: {hr}")`,
        instructionSlides: [
          "We can SET the heart rate -- but can we READ it back from the monitor? Yes, with `get_reading()`!",
          "Write: `hr = get_reading(\"heart_rate\")` -- this asks the monitor for the current heart rate and stores it.",
          "On the next line, write: `print(f\"Current heart rate: {hr} bpm\")` -- shows the reading in the output.",
          "Click Run Code! -- the output should show 85 bpm. Change the `set_heart_rate(85)` to another value and re-run. Does `get_reading` pick up the new value?",
        ],
        starterCode:
`set_heart_rate(85)
start_monitor()

# Read back the current heart rate using get_reading():
# Pass "heart_rate" as the string argument, save the result in a variable called hr:


# Print the result: "Current heart rate: {hr} bpm"
`,
        hint:
`hr = get_reading("heart_rate")   ← save the reading in a variable
print(f"Current heart rate: {hr} bpm")`,
        solutionCode:
`set_heart_rate(85)
start_monitor()

hr = get_reading("heart_rate")
print(f"Current heart rate: {hr} bpm")
`,
        successCriteria: [
          'Call get_reading()',
          'Output shows heart rate value',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_calls_function', name: 'get_reading' },
            { type: 'stdout_contains', text: 'heart rate' },
          ],
        },
        reward: { stars: 1 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // PM3: Alert System — if/elif/else, show_alert()
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'pm3_alert_system',
    title: 'Alert System',
    purpose: 'Use if/elif/else to trigger medical alerts based on heart rate.',
    storyIntro:
      "Doctors need to act fast when vitals go out of range. Build an alert system that watches the heart rate and sounds the alarm when needed!",
    estimatedMinutes: 35,
    engineType: 'patient_monitor',
    learningOutcomes: ['if', 'elif', 'else', 'show_alert()'],
    steps: [
      {
        stepId: 'pm3_s1_high_rate',
        concepts: ['if statement', 'show_alert()'],
        instruction:
`Alert System Step 1: Check for high heart rate! ❤️‍🔥

Write an if statement: if heart_rate > 100, call show_alert("High heart rate!").`,
        detailedExplanation:
`❤️‍🔥 A high heart rate (> 100 bpm) can be dangerous.
Use an if statement to check:
  if heart_rate > 100:
      show_alert("High heart rate!")

show_alert() flashes a red banner on the monitor!`,
        instructionSlides: [
          "Doctors need to know when something is wrong! An if check lets Python make a decision automatically.",
          "Write: `if heart_rate > 100:` -- this checks if the number in heart_rate is dangerously high.",
          "On the next line (4 spaces!): `show_alert(\"High heart rate!\")` -- the 4 spaces mean it's INSIDE the if check.",
          "Click Run Code! -- with 120 set, the red alert should flash. Try changing 120 to 75. Does the alert still appear?",
        ],
        starterCode:
`heart_rate = 120  # Try changing this value!

set_heart_rate(heart_rate)
start_monitor()

# Write an if statement: if heart_rate is more than 100, call show_alert("High heart rate!"):
`,
        hint:
`if heart_rate > 100:
    show_alert("High heart rate!")

4 spaces before show_alert — it's inside the if block!`,
        solutionCode:
`heart_rate = 120

set_heart_rate(heart_rate)
start_monitor()

if heart_rate > 100:
    show_alert("High heart rate!")
`,
        successCriteria: [
          'Use an if statement',
          'Call show_alert()',
          'Alert triggered',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_if' },
            { type: 'alert_triggered' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'pm3_s2_low_rate',
        concepts: ['elif', 'multiple conditions'],
        instruction:
`Alert System Step 2: Check for low heart rate too! 💔

Add an elif: if heart_rate < 50, show_alert("Low heart rate!").`,
        detailedExplanation:
`💔 A very low heart rate (< 50 bpm) is also a warning sign.
Add elif after your if:
  if heart_rate > 100:
      show_alert("High heart rate!")
  elif heart_rate < 50:
      show_alert("Low heart rate!")`,
        instructionSlides: [
          "A heart rate that is too LOW is also dangerous! `elif` adds a second condition right after the first `if`.",
          "`elif` means 'else if' -- it only checks when the first `if` was false. Order matters!",
          "After the `if` block (at the SAME indent level as `if`): write `elif heart_rate < 50:` then inside (4 spaces): `show_alert(\"Low heart rate!\")`",
          "Click Run Code! with heart_rate = 40. A different alert should appear. Try heart_rate = 75 -- does either alert fire?",
        ],
        starterCode:
`heart_rate = 40  # Low heart rate — try different values!

set_heart_rate(heart_rate)
start_monitor()

if heart_rate > 100:
    show_alert("High heart rate!")
# Add elif: if heart_rate is less than 50, call show_alert("Low heart rate!"):
`,
        hint:
`elif heart_rate < 50:
    show_alert("Low heart rate!")

elif goes at the SAME level as the if above it — no extra spaces before elif.`,
        solutionCode:
`heart_rate = 40

set_heart_rate(heart_rate)
start_monitor()

if heart_rate > 100:
    show_alert("High heart rate!")
elif heart_rate < 50:
    show_alert("Low heart rate!")
`,
        successCriteria: [
          'Use if and elif',
          'Alert triggered for low heart rate',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_if' },
            { type: 'alert_triggered' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'pm3_s3_normal',
        concepts: ['else', 'complete if/elif/else'],
        instruction:
`Alert System Step 3: All clear! ✅

Add an else clause: if heart rate is normal, show_message("Vitals normal ✓").`,
        detailedExplanation:
`✅ else runs when none of the if/elif conditions matched.
Normal heart rate is 50–100 bpm.
  else:
      show_message("Vitals normal ✓")

Try heart_rate = 75 to see the normal message!`,
        instructionSlides: [
          "What happens when the heart rate is perfectly normal (50-100)? `else` handles everything the `if` and `elif` missed!",
          "`else` has no condition of its own -- it runs when ALL the conditions above were false.",
          "After the `elif` block (same level as `if` and `elif`): write `else:` then inside (4 spaces): `show_message(\"Vitals normal ✓\")`",
          "Click Run Code! with heart_rate = 75. You should see the normal message. Test all three values: 40, 75, 120.",
        ],
        starterCode:
`heart_rate = 75  # Normal — try 40, 75, and 120!

set_heart_rate(heart_rate)
start_monitor()

if heart_rate > 100:
    show_alert("High heart rate!")
elif heart_rate < 50:
    show_alert("Low heart rate!")
# Add else: when neither condition matched, show_message("Vitals normal ✓"):
`,
        hint:
`else:
    show_message("Vitals normal ✓")

else has no condition — it runs when ALL the checks above were false.`,
        solutionCode:
`heart_rate = 75

set_heart_rate(heart_rate)
start_monitor()

if heart_rate > 100:
    show_alert("High heart rate!")
elif heart_rate < 50:
    show_alert("Low heart rate!")
else:
    show_message("Vitals normal ✓")
`,
        successCriteria: [
          'Complete if/elif/else',
          'Vitals updated on monitor',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_if' },
            { type: 'vital_set' },
          ],
        },
        reward: { stars: 1 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // PM4: Treatment Plan — for loop, add_treatment(), list
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'pm4_treatment_plan',
    title: 'Treatment Plan',
    purpose: 'Use lists and for loops to apply a series of treatments.',
    storyIntro:
      "The patient needs several treatments! Instead of writing each one separately, a smart doctor uses a list and a loop to apply them all automatically.",
    estimatedMinutes: 40,
    engineType: 'patient_monitor',
    learningOutcomes: ['lists', 'for loops', 'add_treatment()'],
    steps: [
      {
        stepId: 'pm4_s1_list',
        concepts: ['lists', 'square brackets'],
        instruction:
`Treatment Step 1: Make a symptoms list! 📋

Create a list called symptoms with at least 3 medical symptoms.
A list uses square brackets: [ ]`,
        detailedExplanation:
`📋 A list stores multiple values in one variable:
  symptoms = ["fever", "headache", "cough"]

Items are separated by commas inside [ ]
Create your symptoms list to continue!`,
        instructionSlides: [
          "Our patient needs multiple treatments! A list lets us store many values in one variable.",
          "Write: `symptoms = [\"fever\", \"headache\", \"cough\"]` -- square brackets `[ ]` hold the items, each in quotes, separated by commas.",
          "You can add as many symptoms as you want inside the brackets! Just keep separating with commas.",
          "Click Run Code! -- `print(symptoms)` shows the whole list, and `len(symptoms)` counts the items.",
        ],
        starterCode:
`# Create a list called symptoms with at least 3 medical conditions:
# Square brackets hold the items, strings need quotes, items separated by commas:
symptoms =

# Print the list and count how many items it has:
print(symptoms)
print(f"Total symptoms: {len(symptoms)}")
`,
        hint:
`symptoms = ["fever", "headache", "cough"]

Square brackets [ ] hold the list. Each item in quotes, separated by commas.`,
        solutionCode:
`symptoms = ["fever", "headache", "cough"]

print(symptoms)
print(f"Total symptoms: {len(symptoms)}")
`,
        successCriteria: [
          'Create a list called symptoms',
          'Output shows the list',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_list' },
            { type: 'ast_has_assignment', variable: 'symptoms' },
            { type: 'stdout_contains', text: 'fever' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'pm4_s2_for_loop',
        concepts: ['for loop', 'add_treatment()'],
        instruction:
`Treatment Step 2: Loop through the treatments! 🔄

Use a for loop to apply a treatment for each symptom.`,
        detailedExplanation:
`🔄 A for loop runs once for each item in a list:
  for symptom in symptoms:
      add_treatment(symptom)

Each time through the loop, symptom is the next item.
The treatment log on the monitor will fill up!`,
        instructionSlides: [
          "We could treat each symptom one by one... or use a `for` loop to do them ALL automatically!",
          "Write: `for symptom in symptoms:` -- this says 'go through each item in the list, call it `symptom` each time'.",
          "With 4 spaces: `add_treatment(symptom)` -- applies a treatment for that symptom. The loop runs this once per item!",
          "On the next line (still 4 spaces): `print(f\"Applied treatment for: {symptom}\")` -- logs what was done.",
          "Click Run Code! -- you should see three treatment lines appear. The loop did all the work!",
        ],
        starterCode:
`symptoms = ["fever", "headache", "cough"]

start_monitor()

# Write a for loop that goes through each symptom and applies a treatment:
# Pattern:
#   for symptom in symptoms:
#       add_treatment(symptom)
#       print(f"Applied treatment for: {symptom}")
`,
        hint:
`for symptom in symptoms:
    add_treatment(symptom)
    print(f"Applied treatment for: {symptom}")

4 spaces before add_treatment and print -- they're inside the loop!`,
        solutionCode:
`symptoms = ["fever", "headache", "cough"]

start_monitor()

for symptom in symptoms:
    add_treatment(symptom)
    print(f"Applied treatment for: {symptom}")
`,
        successCriteria: [
          'Use a for loop',
          'Call add_treatment()',
          'Treatment applied on monitor',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_for_loop' },
            { type: 'ast_calls_function', name: 'add_treatment' },
            { type: 'treatment_applied' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'pm4_s3_complete',
        concepts: ['patient_stable', 'complete treatment'],
        instruction:
`Treatment Step 3: Confirm treatment complete! ✅

After the loop, set normal vitals and show "Treatment complete!".
The patient is on the road to recovery!`,
        detailedExplanation:
`✅ After treating all symptoms, reset the vitals to normal:
  set_heart_rate(72)
  set_oxygen(98)
  show_message("Treatment complete!")

A heart rate of 72 and oxygen of 98 means the patient is stable!`,
        instructionSlides: [
          "After all treatments are done, we need to confirm the patient is stable by resetting their vitals to normal.",
          "After the loop (no indentation -- these lines are OUTSIDE the loop): write `set_heart_rate(72)` then `set_oxygen(98)`.",
          "72 bpm heart rate and 98% oxygen are both in the normal range -- the patient is recovering!",
          "On the last line before `print`: write `show_message(\"Treatment complete!\")` -- this appears on the monitor screen.",
          "Click Run Code! -- treatments apply, then the monitor shows normal vitals. Patient is stable!",
        ],
        starterCode:
`symptoms = ["fever", "headache", "cough"]

start_monitor()

for symptom in symptoms:
    add_treatment(symptom)
    print(f"Treated: {symptom}")

# After the loop — set heart rate back to normal (72 bpm):

# Set oxygen back to normal (98%):

# Show a message saying treatment is complete:

print("Patient is stable!")
`,
        hint:
`After the loop (no indentation — these are outside the loop):
set_heart_rate(72)
set_oxygen(98)
show_message("Treatment complete!")`,
        solutionCode:
`symptoms = ["fever", "headache", "cough"]

start_monitor()

for symptom in symptoms:
    add_treatment(symptom)
    print(f"Treated: {symptom}")

set_heart_rate(72)
set_oxygen(98)
show_message("Treatment complete!")
print("Patient is stable!")
`,
        successCriteria: [
          'Complete the treatment loop',
          'Set heart rate and oxygen',
          'Show completion message',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_for_loop' },
            { type: 'treatment_applied' },
            { type: 'vital_set' },
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

export const patientMonitorMissionPack: MissionPack = {
  packId: 'patient_monitor_basics_v1',
  packTitle: 'Junior Medic Academy',
  description: 'Learn Python by monitoring and treating patients in a hospital simulator!',
  targetAgeRange: '8-14',
  gameTemplate: {
    templateId: 'patient_monitor_basics',
    name: 'Patient Monitor',
    themes: [],
    playerSprites: [],
    levelPresets: [],
    availableMechanics: [],
    defaultConfig: {
      THEME: 'hospital',
      PLAYER: { sprite: 'doctor', speed: 0, jumpStrength: 0 },
      MECHANICS: { doubleJump: false, dash: false, timer: false, lives: 1 },
      LEVEL: { preset: 'hospital', platforms: [], coins: [], enemies: [], goal: { x: 0, y: 0 } },
      WIN_RULE: { type: 'reach_goal', target: 1 },
    },
  },
  missions,
  learningOutcomes: [
    'Variables and data types',
    'print() and f-strings',
    'Functions with parameters',
    'if/elif/else conditions',
    'Lists and for loops',
  ],
};

export function getPatientMissionById(missionId: string) {
  return missions.find(m => m.missionId === missionId);
}
