/**
 * Doctor Main Path Mission Pack v1
 *
 * 8 missions mixing patient monitor coding and real-world medical experiments.
 * Prerequisite: patient_monitor_basics_v1 (Junior Medic Academy).
 * Path: 'doctor'
 */

import { MissionPack, Mission } from './schema';

const missions: Mission[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // D1: Design Your Doctor — creative (pixel art)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'dr1_design_doctor',
    title: 'Design Your Doctor',
    purpose: 'Create a pixel art doctor character.',
    storyIntro:
      "Every great doctor needs a white coat! Design your doctor character in the pixel art editor — it will represent you throughout the path.",
    estimatedMinutes: 20,
    engineType: 'patient_monitor',
    missionType: 'creative',
    learningOutcomes: ['creativity', 'design'],
    steps: [
      {
        stepId: 'dr1_s1_draw_doctor',
        concepts: ['pixel art', 'design'],
        instruction: 'Draw your doctor character in the 16×16 pixel editor!',
        detailedExplanation: 'Give your doctor a white coat, stethoscope, or whatever makes them unique. Use bright colours to stand out!',
        starterCode: '',
        successCriteria: ['Draw and save your doctor character'],
        validation: { type: 'ast', checks: [] },
        reward: { stars: 3, badge: 'character_designer' },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // D2: Build a Stethoscope — experiment_guide + coding
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'dr2_stethoscope',
    title: 'Build a Stethoscope',
    purpose: 'Build a DIY stethoscope and model heart rate with Python variables.',
    storyIntro:
      "A stethoscope is a doctor's most important tool! Build one from household items, then use Python to calculate heart rate from your measurements.",
    estimatedMinutes: 40,
    engineType: 'patient_monitor',
    missionType: 'experiment_guide',
    learningOutcomes: ['experiment', 'variables', 'multiplication', 'BPM calculation'],
    steps: [
      {
        stepId: 'dr2_s1_build',
        concepts: ['experiment', 'medical science'],
        instruction: 'Build your DIY stethoscope!',
        detailedExplanation: 'Use a plastic funnel, tubing, and a small cup to build a stethoscope. Count your heartbeat!',
        starterCode: '',
        experimentGuide: {
          materials: [
            'Small plastic funnel',
            '30cm plastic tubing',
            'Small plastic cup',
            'Sticky tape',
          ],
          steps: [
            'Attach the funnel to one end of the tubing with tape',
            'Attach the small cup to the other end (this is the earpiece)',
            'Press the funnel firmly against your chest (not your ear!)',
            'Listen through the cup — you should hear your heartbeat!',
            'Count the heartbeats for 15 seconds',
            'Multiply by 4 to get your beats per minute (BPM)',
          ],
          safetyNote: 'Never put anything inside your ear canal. Hold the cup gently near your ear.',
        },
        successCriteria: ['Complete the stethoscope build'],
        validation: { type: 'ast', checks: [] },
        reward: { stars: 2, badge: 'medic_engineer' },
      },
      {
        stepId: 'dr2_s2_calculate_bpm',
        concepts: ['multiplication', 'variables', 'if/elif'],
        instruction:
`Stethoscope Step 2: Calculate your BPM! ❤️

Use multiplication to convert your 15-second count to BPM.
beats_in_15_sec × 4 = heart rate!`,
        detailedExplanation:
`❤️ Heart rate is measured in beats per minute (BPM).
If you count 18 beats in 15 seconds:
  18 × 4 = 72 BPM — that's normal!

Use variables and multiplication (*) to calculate yours.`,
        starterCode:
`# How many beats did you count in 15 seconds?
beats_in_15_sec = 18

# Multiply by 4 to get BPM
heart_rate = beats_in_15_sec * 4

print(f"Your heart rate: {heart_rate} BPM")

if heart_rate > 100:
    print("That's fast — maybe you were running!")
elif heart_rate < 60:
    print("That's slow — are you very relaxed?")
else:
    print("Normal range. Healthy heart!")

# Show on monitor
set_heart_rate(heart_rate)
start_monitor()
`,
        hint:
`heart_rate = beats_in_15_sec * 4
print(f"Your heart rate: {heart_rate} BPM")`,
        solutionCode:
`beats_in_15_sec = 18
heart_rate = beats_in_15_sec * 4

print(f"Your heart rate: {heart_rate} BPM")

if heart_rate > 100:
    print("That's fast — maybe you were running!")
elif heart_rate < 60:
    print("That's slow — are you very relaxed?")
else:
    print("Normal range. Healthy heart!")

set_heart_rate(heart_rate)
start_monitor()
`,
        successCriteria: [
          'Use multiplication to calculate BPM',
          'Use if/elif/else',
          'Update the monitor',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_uses_multiplication' },
            { type: 'ast_has_if' },
            { type: 'vital_set' },
            { type: 'stdout_contains', text: 'BPM' },
          ],
        },
        reward: { stars: 2 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // D3: Body Systems Quiz — coding quiz with score tracking
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'dr3_body_quiz',
    title: 'Body Systems Quiz',
    purpose: 'Build a Python quiz that tests knowledge of body systems.',
    storyIntro:
      "A doctor must know the human body! Write a quiz program that asks questions, checks answers, and keeps score.",
    estimatedMinutes: 30,
    engineType: 'patient_monitor',
    learningOutcomes: ['variables', 'if/else', 'score tracking', 'lists'],
    steps: [
      {
        stepId: 'dr3_s1_first_question',
        concepts: ['if/else', 'string comparison'],
        instruction:
`Quiz Step 1: Ask the first question! ❓

Write a question-and-answer check using if/else.
If the answer is correct, print "Correct!" and add 1 to the score.`,
        detailedExplanation:
`❓ A quiz is just a series of if/else checks.
Set an answer variable and check if it matches:
  if answer == "heart":
      print("Correct!")
      score += 1
  else:
      print("Not quite — it was the heart!")`,
        starterCode:
`score = 0

# Question 1
question = "Which organ pumps blood around your body?"
answer = "heart"  # Change this to test wrong answers!
correct = "heart"

print(f"Q: {question}")

if answer == correct:
    print("✅ Correct!")
    score += 1
else:
    print(f"❌ Not quite — it was the {correct}!")

print(f"Score: {score}/1")
`,
        hint:
`if answer == correct:
    print("Correct!")
    score += 1`,
        solutionCode:
`score = 0

question = "Which organ pumps blood around your body?"
answer = "heart"
correct = "heart"

print(f"Q: {question}")

if answer == correct:
    print("✅ Correct!")
    score += 1
else:
    print(f"❌ Not quite — it was the {correct}!")

print(f"Score: {score}/1")
`,
        successCriteria: [
          'Track score variable',
          'Use if/else to check answer',
          'Print score',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_assignment', variable: 'score' },
            { type: 'ast_has_if' },
            { type: 'stdout_contains', text: 'Score' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'dr3_s2_multiple_questions',
        concepts: ['lists', 'for loop', 'score tracking'],
        instruction:
`Quiz Step 2: Ask 5 questions! 📋

Store questions, answers, and correct answers in lists.
Use a for loop to ask each one and track the total score.`,
        detailedExplanation:
`📋 Lists let you store multiple questions efficiently.
Use zip() to loop through questions and answers together:
  for q, a, c in zip(questions, answers, correct_answers):
      if a == c: score += 1`,
        starterCode:
`questions = [
    "Which organ pumps blood?",
    "What do lungs do?",
    "How many bones in an adult body?",
    "What is the largest organ?",
    "Which system fights disease?",
]

correct_answers = ["heart", "breathe", "206", "skin", "immune"]

# Your answers (try changing them!)
answers = ["heart", "breathe", "206", "skin", "immune"]

score = 0
for i in range(len(questions)):
    q = questions[i]
    a = answers[i]
    c = correct_answers[i]

    if a == c:
        print(f"Q{i+1}: ✅ Correct!")
        score += 1
    else:
        print(f"Q{i+1}: ❌ Answer was: {c}")

print(f"Final score: {score}/{len(questions)}")
`,
        hint:
`for i in range(len(questions)):
    if answers[i] == correct_answers[i]:
        score += 1`,
        solutionCode:
`questions = [
    "Which organ pumps blood?",
    "What do lungs do?",
    "How many bones in an adult body?",
    "What is the largest organ?",
    "Which system fights disease?",
]

correct_answers = ["heart", "breathe", "206", "skin", "immune"]
answers = ["heart", "breathe", "206", "skin", "immune"]

score = 0
for i in range(len(questions)):
    if answers[i] == correct_answers[i]:
        print(f"Q{i+1}: ✅ Correct!")
        score += 1
    else:
        print(f"Q{i+1}: ❌ Answer was: {correct_answers[i]}")

print(f"Final score: {score}/{len(questions)}")
`,
        successCriteria: [
          'Use a list of questions',
          'Use a for loop',
          'Track and print final score',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_list' },
            { type: 'ast_has_for_loop' },
            { type: 'stdout_contains', text: 'Final score' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'dr3_s3_grade',
        concepts: ['if/elif', 'grade calculation'],
        instruction:
`Quiz Step 3: Give a grade! 🏆

After the quiz, use if/elif to give a doctor rank based on the score.
5/5 = "Chief Physician", 3-4 = "Doctor", 1-2 = "Intern", 0 = "Keep studying!"`,
        detailedExplanation:
`🏆 Use if/elif to assign a rank based on the score.
This is just like a real grading system!`,
        starterCode:
`questions = ["Q1", "Q2", "Q3", "Q4", "Q5"]
correct_answers = ["a", "b", "c", "d", "e"]
answers = ["a", "b", "c", "d", "e"]

score = sum(1 for a, c in zip(answers, correct_answers) if a == c)
print(f"Score: {score}/{len(questions)}")

if score == 5:
    rank = "Chief Physician 👨‍⚕️"
elif score >= 3:
    rank = "Doctor 🩺"
elif score >= 1:
    rank = "Medical Intern 🏥"
else:
    rank = "Keep studying! 📚"

print(f"Your rank: {rank}")
`,
        hint:
`if score == 5:
    rank = "Chief Physician"
elif score >= 3:
    rank = "Doctor"`,
        solutionCode:
`questions = ["Q1", "Q2", "Q3", "Q4", "Q5"]
correct_answers = ["a", "b", "c", "d", "e"]
answers = ["a", "b", "c", "d", "e"]

score = sum(1 for a, c in zip(answers, correct_answers) if a == c)
print(f"Score: {score}/{len(questions)}")

if score == 5:
    rank = "Chief Physician 👨‍⚕️"
elif score >= 3:
    rank = "Doctor 🩺"
elif score >= 1:
    rank = "Medical Intern 🏥"
else:
    rank = "Keep studying! 📚"

print(f"Your rank: {rank}")
`,
        successCriteria: [
          'Calculate score',
          'Use if/elif for grading',
          'Print the rank',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_if' },
            { type: 'ast_has_assignment', variable: 'rank' },
            { type: 'stdout_contains', text: 'rank' },
          ],
        },
        reward: { stars: 1 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // D4: Dissect a Flower — experiment_guide + coding
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'dr4_flower_dissect',
    title: 'Dissect a Flower',
    purpose: 'Label flower parts and code plant cell functions in Python.',
    storyIntro:
      "Doctors study all living things, not just humans! Dissect a flower to learn about plant biology, then write Python to describe each cell function.",
    estimatedMinutes: 40,
    engineType: 'patient_monitor',
    missionType: 'experiment_guide',
    learningOutcomes: ['experiment', 'biology', 'dictionaries', 'for loops'],
    steps: [
      {
        stepId: 'dr4_s1_dissect',
        concepts: ['experiment', 'biology'],
        instruction: 'Dissect a flower and label its parts!',
        detailedExplanation: 'Carefully pull apart a flower to find the petal, sepal, stamen, pistil, and stem. Label each part on a piece of paper.',
        starterCode: '',
        experimentGuide: {
          materials: [
            'A fresh flower (daisy, tulip, or similar)',
            'White paper',
            'Pencil and ruler',
            'Magnifying glass (optional)',
            'Sticky tape',
          ],
          steps: [
            'Lay the flower on white paper',
            'Gently pull off the petals and lay them out',
            'Find the stamens (pollen-covered sticks) inside',
            'Look for the pistil (the central part) in the middle',
            'Identify the sepals (green leaf-like parts at the base)',
            'Tape each part to the paper and label it',
          ],
          safetyNote: 'Watch out for pollen if you have hay fever. Wash your hands after handling flowers.',
        },
        successCriteria: ['Complete the flower dissection'],
        validation: { type: 'ast', checks: [] },
        reward: { stars: 2, badge: 'botanist' },
      },
      {
        stepId: 'dr4_s2_cell_functions',
        concepts: ['dictionaries', 'for loops', 'biology'],
        instruction:
`Flower Step 2: Code the plant cell functions! 🌱

Create a dictionary of flower parts and their functions.
Loop through it and print each one.`,
        detailedExplanation:
`🌱 A Python dictionary maps keys to values — perfect for parts and functions!
  parts = {
      "petal": "attracts pollinators",
      "stamen": "produces pollen",
  }
  for part, function in parts.items():
      print(f"{part}: {function}")`,
        starterCode:
`# Flower parts and their functions
flower_parts = {
    "petal": "attracts insects and birds for pollination",
    "stamen": "produces pollen",
    "pistil": "receives pollen and produces seeds",
    "sepal": "protects the flower bud",
    "stem": "carries water and nutrients",
}

print("=== Flower Biology Guide ===")
for part, function in flower_parts.items():
    print(f"{part.capitalize()}: {function}")

print(f"\\nTotal parts studied: {len(flower_parts)}")
`,
        hint:
`for part, function in flower_parts.items():
    print(f"{part}: {function}")`,
        solutionCode:
`flower_parts = {
    "petal": "attracts insects and birds for pollination",
    "stamen": "produces pollen",
    "pistil": "receives pollen and produces seeds",
    "sepal": "protects the flower bud",
    "stem": "carries water and nutrients",
}

print("=== Flower Biology Guide ===")
for part, function in flower_parts.items():
    print(f"{part.capitalize()}: {function}")

print(f"\\nTotal parts studied: {len(flower_parts)}")
`,
        successCriteria: [
          'Create a dictionary of flower parts',
          'Loop through and print each',
          'Output shows all parts',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_for_loop' },
            { type: 'stdout_contains', text: 'petal' },
            { type: 'stdout_contains', text: 'pollen' },
          ],
        },
        reward: { stars: 2 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // D5: Heartbeat Analyser — loops, min/max, abnormal detection
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'dr5_heartbeat_analyser',
    title: 'Heartbeat Analyser',
    purpose: 'Analyse a list of heart rate readings to find highs, lows, and abnormal values.',
    storyIntro:
      "A cardiologist analyses hundreds of readings. Write Python to process a list of heart rate data and spot anything unusual!",
    estimatedMinutes: 30,
    engineType: 'patient_monitor',
    learningOutcomes: ['lists', 'min()/max()', 'for loops', 'abnormal detection'],
    steps: [
      {
        stepId: 'dr5_s1_find_extremes',
        concepts: ['min()', 'max()', 'lists'],
        instruction:
`Analyser Step 1: Find the highest and lowest readings! 📊

Given a list of heart rate readings, use min() and max() to find extremes.`,
        detailedExplanation:
`📊 min() finds the smallest value, max() finds the largest.
  readings = [72, 65, 110, 58, 95, 120, 70]
  lowest = min(readings)
  highest = max(readings)`,
        starterCode:
`readings = [72, 65, 110, 58, 95, 120, 70, 88, 103, 67]

lowest = min(readings)
highest = max(readings)

print(f"Heart Rate Analysis")
print(f"Lowest:  {lowest} bpm")
print(f"Highest: {highest} bpm")
print(f"Readings taken: {len(readings)}")
`,
        hint:
`lowest = min(readings)
highest = max(readings)`,
        solutionCode:
`readings = [72, 65, 110, 58, 95, 120, 70, 88, 103, 67]

lowest = min(readings)
highest = max(readings)

print(f"Heart Rate Analysis")
print(f"Lowest:  {lowest} bpm")
print(f"Highest: {highest} bpm")
print(f"Readings taken: {len(readings)}")
`,
        successCriteria: [
          'Use min() and max()',
          'Print lowest and highest',
          'Count total readings',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_calls_function', name: 'min' },
            { type: 'ast_calls_function', name: 'max' },
            { type: 'stdout_contains', text: 'Highest' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'dr5_s2_flag_abnormal',
        concepts: ['for loop', 'if statement', 'abnormal detection'],
        instruction:
`Analyser Step 2: Flag abnormal readings! 🚨

Loop through the readings. If any are > 100 or < 55, print a warning.`,
        detailedExplanation:
`🚨 Normal heart rate is 55–100 bpm.
Loop through each reading and check:
  for reading in readings:
      if reading > 100 or reading < 55:
          print(f"⚠ Abnormal: {reading} bpm")`,
        starterCode:
`readings = [72, 65, 110, 58, 95, 120, 70, 88, 103, 45]

abnormal = []
for reading in readings:
    if reading > 100 or reading < 55:
        abnormal.append(reading)
        print(f"⚠ Abnormal reading: {reading} bpm")

print(f"\\nTotal abnormal readings: {len(abnormal)}")
if len(abnormal) == 0:
    print("All readings normal!")
`,
        hint:
`if reading > 100 or reading < 55:
    print(f"Abnormal: {reading} bpm")`,
        solutionCode:
`readings = [72, 65, 110, 58, 95, 120, 70, 88, 103, 45]

abnormal = []
for reading in readings:
    if reading > 100 or reading < 55:
        abnormal.append(reading)
        print(f"⚠ Abnormal reading: {reading} bpm")

print(f"\\nTotal abnormal readings: {len(abnormal)}")
if len(abnormal) == 0:
    print("All readings normal!")
`,
        successCriteria: [
          'Loop through readings',
          'Flag abnormal values',
          'Count abnormal readings',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_for_loop' },
            { type: 'ast_has_if' },
            { type: 'stdout_contains', text: 'Abnormal' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'dr5_s3_show_on_monitor',
        concepts: ['patient monitor API', 'real-time display'],
        instruction:
`Analyser Step 3: Show the analysis on the monitor! 📺

Set the heart rate on the monitor to the average reading.
Flag an alert if the average is abnormal!`,
        detailedExplanation:
`📺 Calculate the average heart rate and display it.
  average = sum(readings) / len(readings)
  set_heart_rate(int(average))

Then check if the average needs an alert!`,
        starterCode:
`readings = [72, 65, 110, 58, 95, 120, 70, 88, 103, 45]

average = sum(readings) / len(readings)
print(f"Average heart rate: {average:.1f} bpm")

set_heart_rate(int(average))
start_monitor()

if average > 100:
    show_alert(f"High average HR: {average:.0f} bpm")
elif average < 55:
    show_alert(f"Low average HR: {average:.0f} bpm")
else:
    show_message(f"Average HR normal: {average:.0f} bpm")
`,
        hint:
`average = sum(readings) / len(readings)
set_heart_rate(int(average))`,
        solutionCode:
`readings = [72, 65, 110, 58, 95, 120, 70, 88, 103, 45]

average = sum(readings) / len(readings)
print(f"Average heart rate: {average:.1f} bpm")

set_heart_rate(int(average))
start_monitor()

if average > 100:
    show_alert(f"High average HR: {average:.0f} bpm")
elif average < 55:
    show_alert(f"Low average HR: {average:.0f} bpm")
else:
    show_message(f"Average HR normal: {average:.0f} bpm")
`,
        successCriteria: [
          'Calculate average',
          'Display on monitor',
          'Alert if abnormal',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_calls_function', name: 'set_heart_rate' },
            { type: 'vital_set' },
            { type: 'stdout_contains', text: 'Average' },
          ],
        },
        reward: { stars: 1 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // D6: First Aid Guide — if/elif decision tree
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'dr6_first_aid',
    title: 'First Aid Guide',
    purpose: 'Build a Python decision tree that gives first aid advice based on symptoms.',
    storyIntro:
      "First aid saves lives! Build a decision-making program that asks about a symptom and gives the correct first aid step.",
    estimatedMinutes: 25,
    engineType: 'patient_monitor',
    learningOutcomes: ['if/elif/else', 'decision trees', 'user simulation'],
    steps: [
      {
        stepId: 'dr6_s1_symptom_check',
        concepts: ['if/elif', 'decision logic'],
        instruction:
`First Aid Step 1: Check the symptom! 🩹

Write an if/elif chain that gives first aid advice for different symptoms.`,
        detailedExplanation:
`🩹 A decision tree is a series of if/elif checks.
  symptom = "cut"
  if symptom == "cut":
      print("Apply pressure and clean the wound.")
  elif symptom == "burn":
      print("Cool under cold water for 10 minutes.")`,
        starterCode:
`# Change this to test different symptoms!
symptom = "cut"

if symptom == "cut":
    advice = "Apply gentle pressure. Clean with water. Cover with a plaster."
elif symptom == "burn":
    advice = "Cool under cold running water for 10 minutes. Don't pop blisters."
elif symptom == "nosebleed":
    advice = "Pinch the soft part of the nose. Lean forward slightly. Wait 10 minutes."
elif symptom == "splinter":
    advice = "Clean the area. Use sterilised tweezers. Apply antiseptic after."
else:
    advice = "Ask an adult or call for help if serious."

print(f"Symptom: {symptom}")
print(f"First Aid: {advice}")
`,
        hint:
`if symptom == "cut":
    advice = "Apply pressure and clean the wound."`,
        solutionCode:
`symptom = "cut"

if symptom == "cut":
    advice = "Apply gentle pressure. Clean with water. Cover with a plaster."
elif symptom == "burn":
    advice = "Cool under cold running water for 10 minutes. Don't pop blisters."
elif symptom == "nosebleed":
    advice = "Pinch the soft part of the nose. Lean forward slightly. Wait 10 minutes."
elif symptom == "splinter":
    advice = "Clean the area. Use sterilised tweezers. Apply antiseptic after."
else:
    advice = "Ask an adult or call for help if serious."

print(f"Symptom: {symptom}")
print(f"First Aid: {advice}")
`,
        successCriteria: [
          'Create an if/elif chain',
          'Print symptom and advice',
          'Handle an unknown symptom with else',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_if' },
            { type: 'ast_has_assignment', variable: 'advice' },
            { type: 'stdout_contains', text: 'First Aid' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'dr6_s2_multiple_symptoms',
        concepts: ['function with parameter', 'reusable logic'],
        instruction:
`First Aid Step 2: Make it a function! 🔧

Wrap the symptom check in a function called get_advice(symptom).
Call it for 3 different symptoms.`,
        detailedExplanation:
`🔧 A function makes your code reusable.
  def get_advice(symptom):
      if symptom == "cut": return "..."
      ...

Call it: get_advice("burn"), get_advice("cut")`,
        starterCode:
`def get_advice(symptom):
    if symptom == "cut":
        return "Clean the wound and apply a plaster."
    elif symptom == "burn":
        return "Cool under cold water for 10 minutes."
    elif symptom == "nosebleed":
        return "Pinch and lean forward for 10 minutes."
    else:
        return "Seek adult help if unsure."

# Test with multiple symptoms
for s in ["cut", "burn", "nosebleed", "headache"]:
    advice = get_advice(s)
    print(f"{s}: {advice}")
`,
        hint:
`def get_advice(symptom):
    if symptom == "cut":
        return "Clean the wound and apply a plaster."`,
        solutionCode:
`def get_advice(symptom):
    if symptom == "cut":
        return "Clean the wound and apply a plaster."
    elif symptom == "burn":
        return "Cool under cold water for 10 minutes."
    elif symptom == "nosebleed":
        return "Pinch and lean forward for 10 minutes."
    else:
        return "Seek adult help if unsure."

for s in ["cut", "burn", "nosebleed", "headache"]:
    advice = get_advice(s)
    print(f"{s}: {advice}")
`,
        successCriteria: [
          'Define get_advice function',
          'Call it for multiple symptoms',
          'Print advice for each',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_function', name: 'get_advice' },
            { type: 'ast_has_for_loop' },
            { type: 'stdout_contains', text: 'burn' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'dr6_s3_monitor_display',
        concepts: ['show_alert()', 'add_treatment()', 'monitor integration'],
        instruction:
`First Aid Step 3: Show alerts on the monitor! 🖥️

For each serious symptom, trigger an alert on the patient monitor.
Add the treatment to the treatment log.`,
        detailedExplanation:
`🖥️ Connect your first aid logic to the patient monitor.
Use show_alert() for serious symptoms and add_treatment() for each fix!`,
        starterCode:
`symptoms = ["cut", "burn", "fever"]

start_monitor()

for symptom in symptoms:
    if symptom == "burn":
        show_alert(f"Serious: {symptom}!")
    else:
        show_message(f"Treating: {symptom}")
    add_treatment(f"First aid for {symptom}")
    print(f"Treated: {symptom}")

show_message("All symptoms treated!")
`,
        hint:
`for symptom in symptoms:
    add_treatment(f"First aid for {symptom}")`,
        solutionCode:
`symptoms = ["cut", "burn", "fever"]

start_monitor()

for symptom in symptoms:
    if symptom == "burn":
        show_alert(f"Serious: {symptom}!")
    else:
        show_message(f"Treating: {symptom}")
    add_treatment(f"First aid for {symptom}")
    print(f"Treated: {symptom}")

show_message("All symptoms treated!")
`,
        successCriteria: [
          'Loop through symptoms',
          'Add treatments to monitor',
          'Show alerts for serious symptoms',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_for_loop' },
            { type: 'treatment_applied' },
            { type: 'stdout_contains', text: 'Treated' },
          ],
        },
        reward: { stars: 1 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // D7: Diagnosis Detective — function returning diagnosis
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'dr7_diagnosis',
    title: 'Diagnosis Detective',
    purpose: 'Write a function that takes a symptoms list and returns a diagnosis.',
    storyIntro:
      "A doctor makes diagnoses based on multiple symptoms. Write a diagnosis function that takes a list of symptoms and figures out what's wrong!",
    estimatedMinutes: 30,
    engineType: 'patient_monitor',
    learningOutcomes: ['functions returning values', 'list membership', 'diagnosis logic'],
    steps: [
      {
        stepId: 'dr7_s1_symptom_function',
        concepts: ['function', 'return value', 'in keyword'],
        instruction:
`Diagnosis Step 1: Write a diagnose function! 🔍

Write diagnose(symptoms) that takes a list and returns a diagnosis string.
Use "in" to check if a symptom is in the list.`,
        detailedExplanation:
`🔍 The "in" keyword checks if an item is in a list:
  if "fever" in symptoms:
      return "Possible infection"

Your function should check multiple symptoms and return a diagnosis!`,
        starterCode:
`def diagnose(symptoms):
    if "fever" in symptoms and "cough" in symptoms:
        return "Possible respiratory infection"
    elif "fever" in symptoms and "rash" in symptoms:
        return "Possible viral illness"
    elif "headache" in symptoms and "sensitivity" in symptoms:
        return "Possible migraine"
    else:
        return "Unclear — needs further tests"

# Test the function
test_symptoms = ["fever", "cough"]
result = diagnose(test_symptoms)
print(f"Symptoms: {test_symptoms}")
print(f"Diagnosis: {result}")
`,
        hint:
`def diagnose(symptoms):
    if "fever" in symptoms:
        return "Possible infection"`,
        solutionCode:
`def diagnose(symptoms):
    if "fever" in symptoms and "cough" in symptoms:
        return "Possible respiratory infection"
    elif "fever" in symptoms and "rash" in symptoms:
        return "Possible viral illness"
    elif "headache" in symptoms and "sensitivity" in symptoms:
        return "Possible migraine"
    else:
        return "Unclear — needs further tests"

test_symptoms = ["fever", "cough"]
result = diagnose(test_symptoms)
print(f"Symptoms: {test_symptoms}")
print(f"Diagnosis: {result}")
`,
        successCriteria: [
          'Define diagnose function',
          'Return a diagnosis string',
          'Print the result',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_function', name: 'diagnose' },
            { type: 'stdout_contains', text: 'Diagnosis' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'dr7_s2_multiple_patients',
        concepts: ['list of lists', 'for loop', 'function calls'],
        instruction:
`Diagnosis Step 2: Diagnose multiple patients! 👥

Create a list of patient symptom lists.
Loop through them and print a diagnosis for each patient.`,
        detailedExplanation:
`👥 A real doctor sees many patients!
Create a list where each item is another list of symptoms.
Loop through and diagnose each one.`,
        starterCode:
`def diagnose(symptoms):
    if "fever" in symptoms and "cough" in symptoms:
        return "Respiratory infection"
    elif "fever" in symptoms and "rash" in symptoms:
        return "Viral illness"
    elif "headache" in symptoms:
        return "Migraine or tension headache"
    else:
        return "Needs further tests"

patients = [
    ["fever", "cough"],
    ["headache", "sensitivity"],
    ["fever", "rash"],
    ["tiredness"],
]

for i, symptoms in enumerate(patients):
    diagnosis = diagnose(symptoms)
    print(f"Patient {i+1}: {diagnosis}")
`,
        hint:
`for i, symptoms in enumerate(patients):
    diagnosis = diagnose(symptoms)
    print(f"Patient {i+1}: {diagnosis}")`,
        solutionCode:
`def diagnose(symptoms):
    if "fever" in symptoms and "cough" in symptoms:
        return "Respiratory infection"
    elif "fever" in symptoms and "rash" in symptoms:
        return "Viral illness"
    elif "headache" in symptoms:
        return "Migraine or tension headache"
    else:
        return "Needs further tests"

patients = [
    ["fever", "cough"],
    ["headache", "sensitivity"],
    ["fever", "rash"],
    ["tiredness"],
]

for i, symptoms in enumerate(patients):
    diagnosis = diagnose(symptoms)
    print(f"Patient {i+1}: {diagnosis}")
`,
        successCriteria: [
          'Create list of patient symptom lists',
          'Loop and diagnose each patient',
          'Print all diagnoses',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_for_loop' },
            { type: 'stdout_contains', text: 'Patient 1' },
            { type: 'stdout_contains', text: 'Patient 4' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'dr7_s3_monitor_diagnosis',
        concepts: ['monitor alerts', 'treatment based on diagnosis'],
        instruction:
`Diagnosis Step 3: Connect to the monitor! 🖥️

Use the diagnosis to trigger monitor alerts and apply treatments.
Serious diagnoses should flash a red alert!`,
        detailedExplanation:
`🖥️ Integrate your diagnosis engine with the patient monitor.
For serious conditions, use show_alert().
Always add_treatment() based on the diagnosis!`,
        starterCode:
`def diagnose(symptoms):
    if "fever" in symptoms and "cough" in symptoms:
        return "Respiratory infection"
    elif "fever" in symptoms and "rash" in symptoms:
        return "Viral illness"
    else:
        return "Monitoring required"

patient_symptoms = ["fever", "cough"]
diagnosis = diagnose(patient_symptoms)

start_monitor()
set_heart_rate(98)

if "infection" in diagnosis or "illness" in diagnosis:
    show_alert(f"Diagnosis: {diagnosis}")
    add_treatment("Antibiotics")
    add_treatment("Rest and hydration")
else:
    show_message(f"Diagnosis: {diagnosis}")
    add_treatment("Observation")

print(f"Final diagnosis: {diagnosis}")
`,
        hint:
`if "infection" in diagnosis:
    show_alert(diagnosis)
    add_treatment("Antibiotics")`,
        solutionCode:
`def diagnose(symptoms):
    if "fever" in symptoms and "cough" in symptoms:
        return "Respiratory infection"
    elif "fever" in symptoms and "rash" in symptoms:
        return "Viral illness"
    else:
        return "Monitoring required"

patient_symptoms = ["fever", "cough"]
diagnosis = diagnose(patient_symptoms)

start_monitor()
set_heart_rate(98)

if "infection" in diagnosis or "illness" in diagnosis:
    show_alert(f"Diagnosis: {diagnosis}")
    add_treatment("Antibiotics")
    add_treatment("Rest and hydration")
else:
    show_message(f"Diagnosis: {diagnosis}")
    add_treatment("Observation")

print(f"Final diagnosis: {diagnosis}")
`,
        successCriteria: [
          'Show diagnosis on monitor',
          'Apply treatment based on diagnosis',
          'Alert for serious conditions',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_function', name: 'diagnose' },
            { type: 'treatment_applied' },
            { type: 'stdout_contains', text: 'diagnosis' },
          ],
        },
        reward: { stars: 1 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // D8: Hospital Simulator — manage 3 patients, loops, treatments
  // ─────────────────────────────────────────────────────────────────────────────
  {
    missionId: 'dr8_hospital_sim',
    title: 'Hospital Simulator',
    purpose: 'Manage 3 patients simultaneously: loop through vitals, apply treatments, track outcomes.',
    storyIntro:
      "You're now Chief of Medicine! Three patients need your attention at once. Write a full hospital simulation to manage them all!",
    estimatedMinutes: 45,
    engineType: 'patient_monitor',
    learningOutcomes: ['lists of dicts', 'for loops', 'complex conditions', 'full programs'],
    steps: [
      {
        stepId: 'dr8_s1_patient_records',
        concepts: ['lists of dictionaries', 'data structures'],
        instruction:
`Hospital Step 1: Set up patient records! 📋

Create a list of 3 patient dictionaries, each with name, heart_rate, and oxygen.`,
        detailedExplanation:
`📋 A list of dictionaries is perfect for patient records:
  patients = [
      {"name": "Alice", "heart_rate": 95, "oxygen": 98},
      {"name": "Bob", "heart_rate": 55, "oxygen": 90},
  ]

Print a summary of all patients!`,
        starterCode:
`patients = [
    {"name": "Alice", "heart_rate": 95, "oxygen": 98},
    {"name": "Bob", "heart_rate": 55, "oxygen": 90},
    {"name": "Carol", "heart_rate": 115, "oxygen": 96},
]

print("=== Ward Report ===")
for patient in patients:
    name = patient["name"]
    hr = patient["heart_rate"]
    o2 = patient["oxygen"]
    print(f"{name}: HR={hr} bpm, O2={o2}%")
`,
        hint:
`for patient in patients:
    print(f"{patient['name']}: HR={patient['heart_rate']}")`,
        solutionCode:
`patients = [
    {"name": "Alice", "heart_rate": 95, "oxygen": 98},
    {"name": "Bob", "heart_rate": 55, "oxygen": 90},
    {"name": "Carol", "heart_rate": 115, "oxygen": 96},
]

print("=== Ward Report ===")
for patient in patients:
    name = patient["name"]
    hr = patient["heart_rate"]
    o2 = patient["oxygen"]
    print(f"{name}: HR={hr} bpm, O2={o2}%")
`,
        successCriteria: [
          'Create list of patient dictionaries',
          'Loop through and print each patient',
          'Show all three patients',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_for_loop' },
            { type: 'stdout_contains', text: 'Alice' },
            { type: 'stdout_contains', text: 'Carol' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'dr8_s2_treat_patients',
        concepts: ['complex conditions', 'add_treatment()', 'monitor'],
        instruction:
`Hospital Step 2: Treat each patient! 💊

Loop through the patients, update the monitor for each one, and apply treatments if needed.`,
        detailedExplanation:
`💊 For each patient:
- Set heart rate on monitor
- If HR > 100: show_alert() and add_treatment()
- If O2 < 95: add_treatment("Oxygen therapy")
- Otherwise: show_message("Stable")`,
        starterCode:
`patients = [
    {"name": "Alice", "heart_rate": 95, "oxygen": 98},
    {"name": "Bob", "heart_rate": 55, "oxygen": 90},
    {"name": "Carol", "heart_rate": 115, "oxygen": 96},
]

start_monitor()

for patient in patients:
    name = patient["name"]
    hr = patient["heart_rate"]
    o2 = patient["oxygen"]

    set_heart_rate(hr)
    set_oxygen(o2)

    if hr > 100:
        show_alert(f"{name}: High HR!")
        add_treatment(f"{name}: Beta blockers")
    if o2 < 95:
        show_alert(f"{name}: Low O2!")
        add_treatment(f"{name}: Oxygen therapy")
    if hr <= 100 and o2 >= 95:
        show_message(f"{name}: Stable")

    print(f"Treated {name}")
`,
        hint:
`for patient in patients:
    set_heart_rate(patient["heart_rate"])
    if patient["heart_rate"] > 100:
        add_treatment(f"{patient['name']}: Beta blockers")`,
        solutionCode:
`patients = [
    {"name": "Alice", "heart_rate": 95, "oxygen": 98},
    {"name": "Bob", "heart_rate": 55, "oxygen": 90},
    {"name": "Carol", "heart_rate": 115, "oxygen": 96},
]

start_monitor()

for patient in patients:
    name = patient["name"]
    hr = patient["heart_rate"]
    o2 = patient["oxygen"]

    set_heart_rate(hr)
    set_oxygen(o2)

    if hr > 100:
        show_alert(f"{name}: High HR!")
        add_treatment(f"{name}: Beta blockers")
    if o2 < 95:
        show_alert(f"{name}: Low O2!")
        add_treatment(f"{name}: Oxygen therapy")
    if hr <= 100 and o2 >= 95:
        show_message(f"{name}: Stable")

    print(f"Treated {name}")
`,
        successCriteria: [
          'Set vitals for each patient',
          'Apply treatments based on vitals',
          'All three patients treated',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_for_loop' },
            { type: 'treatment_applied' },
            { type: 'stdout_contains', text: 'Treated' },
          ],
        },
        reward: { stars: 1 },
      },
      {
        stepId: 'dr8_s3_outcomes',
        concepts: ['tracking outcomes', 'final report', 'complete program'],
        instruction:
`Hospital Step 3: Track outcomes! 📊

Count how many patients were stable, needed treatment, and print a final ward report.
This is your final program as Chief of Medicine!`,
        detailedExplanation:
`📊 A good chief tracks all outcomes.
Count stable vs treated patients and print a summary at the end.
You've earned the Doctor badge — congratulations!`,
        starterCode:
`patients = [
    {"name": "Alice", "heart_rate": 95, "oxygen": 98},
    {"name": "Bob", "heart_rate": 55, "oxygen": 90},
    {"name": "Carol", "heart_rate": 115, "oxygen": 96},
]

start_monitor()
stable_count = 0
treated_count = 0

for patient in patients:
    name = patient["name"]
    hr = patient["heart_rate"]
    o2 = patient["oxygen"]

    set_heart_rate(hr)
    set_oxygen(o2)

    needs_treatment = hr > 100 or hr < 55 or o2 < 95

    if needs_treatment:
        treated_count += 1
        add_treatment(f"{name}: Treatment applied")
        show_alert(f"{name} needs treatment!")
    else:
        stable_count += 1
        show_message(f"{name}: Stable")

    print(f"{name}: {'treated' if needs_treatment else 'stable'}")

print(f"\\n=== Final Ward Report ===")
print(f"Stable patients:  {stable_count}")
print(f"Treated patients: {treated_count}")
print(f"Total patients:   {len(patients)}")
`,
        hint:
`stable_count = 0
treated_count = 0
for patient in patients:
    if needs_treatment:
        treated_count += 1
    else:
        stable_count += 1`,
        solutionCode:
`patients = [
    {"name": "Alice", "heart_rate": 95, "oxygen": 98},
    {"name": "Bob", "heart_rate": 55, "oxygen": 90},
    {"name": "Carol", "heart_rate": 115, "oxygen": 96},
]

start_monitor()
stable_count = 0
treated_count = 0

for patient in patients:
    name = patient["name"]
    hr = patient["heart_rate"]
    o2 = patient["oxygen"]

    set_heart_rate(hr)
    set_oxygen(o2)

    needs_treatment = hr > 100 or hr < 55 or o2 < 95

    if needs_treatment:
        treated_count += 1
        add_treatment(f"{name}: Treatment applied")
        show_alert(f"{name} needs treatment!")
    else:
        stable_count += 1
        show_message(f"{name}: Stable")

    print(f"{name}: {'treated' if needs_treatment else 'stable'}")

print(f"\\n=== Final Ward Report ===")
print(f"Stable patients:  {stable_count}")
print(f"Treated patients: {treated_count}")
print(f"Total patients:   {len(patients)}")
`,
        successCriteria: [
          'Track stable and treated counts',
          'Print final ward report',
          'All patients managed',
        ],
        validation: {
          type: 'ast_and_runtime',
          checks: [
            { type: 'ast_has_for_loop' },
            { type: 'treatment_applied' },
            { type: 'stdout_contains', text: 'Ward Report' },
          ],
        },
        reward: { stars: 3, badge: 'doctor' },
      },
    ],
  },
];

// =============================================================================
// PACK DEFINITION
// =============================================================================

export const doctorMissionPack: MissionPack = {
  packId: 'doctor_v1',
  packTitle: 'Junior Doctor',
  description: 'Complete 8 medical missions — from building a stethoscope to running a hospital simulation.',
  targetAgeRange: '8-14',
  gameTemplate: {
    templateId: 'doctor_path',
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
    'Variables, f-strings, print()',
    'Functions with parameters and return values',
    'if/elif/else decision trees',
    'Lists, for loops, and dictionaries',
    'Real-world medical science',
  ],
};

export function getDoctorMissionById(missionId: string) {
  return missions.find(m => m.missionId === missionId);
}
