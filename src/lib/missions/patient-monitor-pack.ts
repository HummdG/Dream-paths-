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
        starterCode:
`patient_name = "Jamie"
age = 10
heart_rate = 72

# Print a nice patient summary using an f-string:
print(f"Patient: {patient_name}, Age: {age}, HR: {heart_rate} bpm")
`,
        hint:
`print(f"Patient: {patient_name}, Age: {age}, HR: {heart_rate} bpm")`,
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
        starterCode:
`patient_name = "Jamie"
heart_rate = 72

# Update the monitor with the heart rate
set_heart_rate(heart_rate)

# Start monitoring
start_monitor()

print(f"Monitoring {patient_name} — HR: {heart_rate} bpm")
`,
        hint:
`set_heart_rate(72)
start_monitor()`,
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
        starterCode:
`def check_patient():
    set_heart_rate(75)
    set_oxygen(98)
    set_blood_pressure(120, 80)

check_patient()
start_monitor()
`,
        hint:
`def check_patient():
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
        starterCode:
`def check_patient(hr):
    set_heart_rate(hr)
    print(f"Heart rate set to {hr} bpm")

check_patient(80)
start_monitor()
`,
        hint:
`def check_patient(hr):
    set_heart_rate(hr)
    print(f"Heart rate set to {hr} bpm")`,
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
        starterCode:
`set_heart_rate(85)
start_monitor()

# Read back the current heart rate
hr = get_reading("heart_rate")
print(f"Current heart rate: {hr} bpm")
`,
        hint:
`hr = get_reading("heart_rate")
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
        starterCode:
`heart_rate = 120  # Try changing this value!

set_heart_rate(heart_rate)
start_monitor()

if heart_rate > 100:
    show_alert("High heart rate!")
`,
        hint:
`if heart_rate > 100:
    show_alert("High heart rate!")`,
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
        starterCode:
`heart_rate = 40  # Low heart rate — try different values!

set_heart_rate(heart_rate)
start_monitor()

if heart_rate > 100:
    show_alert("High heart rate!")
elif heart_rate < 50:
    show_alert("Low heart rate!")
`,
        hint:
`elif heart_rate < 50:
    show_alert("Low heart rate!")`,
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
        starterCode:
`heart_rate = 75  # Normal — try 40, 75, and 120!

set_heart_rate(heart_rate)
start_monitor()

if heart_rate > 100:
    show_alert("High heart rate!")
elif heart_rate < 50:
    show_alert("Low heart rate!")
else:
    show_message("Vitals normal ✓")
`,
        hint:
`else:
    show_message("Vitals normal ✓")`,
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
        starterCode:
`# Create a list of symptoms
symptoms = ["fever", "headache", "cough"]

# Print the list
print(symptoms)
print(f"Total symptoms: {len(symptoms)}")
`,
        hint:
`symptoms = ["fever", "headache", "cough"]`,
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
        starterCode:
`symptoms = ["fever", "headache", "cough"]

start_monitor()

# Loop through symptoms and apply a treatment for each one
for symptom in symptoms:
    add_treatment(symptom)
    print(f"Applied treatment for: {symptom}")
`,
        hint:
`for symptom in symptoms:
    add_treatment(symptom)`,
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
        starterCode:
`symptoms = ["fever", "headache", "cough"]

start_monitor()

for symptom in symptoms:
    add_treatment(symptom)
    print(f"Treated: {symptom}")

# After the loop — set normal vitals and confirm complete
set_heart_rate(72)
set_oxygen(98)
show_message("Treatment complete!")
print("Patient is stable!")
`,
        hint:
`set_heart_rate(72)
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
