import 'dotenv/config'
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

// Type for lesson steps
interface LessonStep {
  id: string;
  title: string;
  type: "intro" | "concept" | "code" | "challenge" | "summary";
  content: string;
  codeTemplate?: string;
  expectedOutput?: string;
  hint?: string;
  conceptExplanation?: string;
  showGamePreview?: boolean;
}

async function main() {
  console.log('🌱 Seeding database...')

  // Create the Junior Game Developer path
  const path = await prisma.path.upsert({
    where: { slug: 'junior_game_dev' },
    update: {},
    create: {
      slug: 'junior_game_dev',
      name: 'Junior Game Developer',
      description: 'Learn Python programming by building your own platformer game! This adventure takes you from your first line of code to a fully playable game. Perfect for ages 8-12.',
      ageRange: '8-12',
      imageUrl: null,
    },
  })

  console.log('✅ Created path:', path.name)

  // =====================================================
  // MISSION 1: Hello, Python!
  // =====================================================
  const mission1Steps: LessonStep[] = [
    {
      id: "1-intro",
      title: "Welcome to Python! 🐍",
      type: "intro",
      content: `Hey there, future game developer! 👋

You're about to learn how to talk to computers using a language called **Python**. Don't worry - it's much easier than learning a new human language!

Python is used by real game developers, scientists, and even people at companies like Google and Netflix. And now, YOU get to learn it too!

The best part? By the end of these missions, you'll have built your very own platformer game that you can show off to your friends and family!`,
    },
    {
      id: "1-concept",
      title: "What is Code?",
      type: "concept",
      content: `Think of code like giving instructions to a very smart, but very literal robot. 🤖

If you tell your friend "make me a sandwich," they know what to do. But a computer needs EXACT instructions:
- Open the bread bag
- Take out two slices
- Put peanut butter on one slice
- Put jelly on the other slice
- Press them together

Code is just instructions written in a way computers can understand. Python makes these instructions look almost like English!`,
      conceptExplanation: "Programmers call these instructions 'code' and writing code is called 'programming' or 'coding'.",
    },
    {
      id: "1-code1",
      title: "Your First Code",
      type: "code",
      content: `Let's write your very first line of Python code! 

We'll use a command called \`print()\` which tells the computer to display a message.

Click the **Run Code** button to see what happens!`,
      codeTemplate: `print("Hello, World!")`,
      expectedOutput: "Hello, World!",
      hint: "Just click Run Code - the code is already written for you!",
    },
    {
      id: "1-code2",
      title: "Make It Your Own",
      type: "code",
      content: `Amazing! You just ran your first Python program! 🎉

Now let's make it personal. Change the message inside the quotes to say hello with YOUR name!

For example: \`print("Hello, I am Alex!")\``,
      codeTemplate: `print("Hello, I am ___!")`,
      expectedOutput: "Hello, I am",
      hint: "Replace the ___ with your name! Keep the quotes around your message.",
    },
    {
      id: "1-challenge",
      title: "Challenge: Two Messages",
      type: "challenge",
      content: `Ready for your first challenge? 💪

Write TWO print statements to display:
1. Your name
2. Your favorite game

Each print statement goes on its own line!`,
      codeTemplate: `# Write your first message here
print("My name is ___")

# Write your second message here
print("My favorite game is ___")`,
      expectedOutput: "My name is",
      hint: "Write two separate print() commands, one on each line. Replace ___ with your answers!",
    },
    {
      id: "1-summary",
      title: "Mission Complete! 🏆",
      type: "summary",
      content: `You did it! You've written your first Python code!

**What you learned:**
- Code is just instructions for computers
- \`print()\` displays messages on the screen
- Text in quotes is called a "string"
- Each instruction goes on its own line

**Coming up next:** You'll learn about variables - special containers that hold information for your game!`,
    },
  ];

  // =====================================================
  // MISSION 2: Variables - Your Hero's Stats
  // =====================================================
  const mission2Steps: LessonStep[] = [
    {
      id: "2-intro",
      title: "Meet Variables! 📦",
      type: "intro",
      content: `Every game hero has stats - their name, health points, speed, and more!

In Python, we store these stats in things called **variables**. Think of a variable as a labeled box where you can put stuff.

Just like you might have a box labeled "LEGOS" to store your LEGO pieces, we use variables to store information our game needs!`,
    },
    {
      id: "2-concept",
      title: "Creating Variables",
      type: "concept",
      content: `To create a variable, we give it a name and put something inside using the \`=\` sign.

\`\`\`python
hero_name = "Luna"
health = 100
speed = 5
\`\`\`

The \`=\` sign means "put this value in this box" - it's NOT the same as equals in math!

**Rules for naming variables:**
- Use lowercase letters
- Use underscores for spaces (hero_name, not hero name)
- Start with a letter, not a number
- Make names descriptive!`,
      conceptExplanation: "Variables can hold different types of data: text (strings), whole numbers (integers), and decimal numbers (floats).",
    },
    {
      id: "2-code1",
      title: "Create Your Hero",
      type: "code",
      content: `Let's create variables for your game hero!

Change the values to customize YOUR hero:`,
      codeTemplate: `# Your hero's stats
hero_name = "Star Knight"
health = 100
speed = 5

# Let's see our hero!
print("Hero:", hero_name)
print("Health:", health)
print("Speed:", speed)`,
      expectedOutput: "Hero:",
      hint: "Change the values after the = signs to customize your hero, then click Run!",
    },
    {
      id: "2-code2",
      title: "Doing Math",
      type: "code",
      content: `Variables with numbers can do math! This is how games calculate damage, scores, and movement.

**Math symbols in Python:**
- \`+\` for adding
- \`-\` for subtracting  
- \`*\` for multiplying
- \`/\` for dividing

Try changing the numbers and see what happens!`,
      codeTemplate: `score = 0
coins_collected = 5
points_per_coin = 10

# Calculate total score
score = coins_collected * points_per_coin

print("Coins collected:", coins_collected)
print("Points per coin:", points_per_coin)
print("Total score:", score)`,
      expectedOutput: "Total score: 50",
      hint: "The * symbol multiplies numbers. 5 coins × 10 points = 50 total!",
    },
    {
      id: "2-challenge",
      title: "Challenge: Hero Stats",
      type: "challenge",
      content: `Your hero just took damage from an enemy! 😱

Complete the code to:
1. Start with 100 health
2. Subtract 25 damage
3. Print the remaining health

The final health should be **75**.`,
      codeTemplate: `# Starting health
health = 100
damage = 25

# Calculate remaining health (use - to subtract)
health = health - ___

# Print the result
print("Health remaining:", health)`,
      expectedOutput: "Health remaining: 75",
      hint: "Replace ___ with 'damage' to subtract the damage from health!",
    },
    {
      id: "2-summary",
      title: "Variables Mastered! 🏆",
      type: "summary",
      content: `Excellent work! You now know how to store and use data!

**What you learned:**
- Variables are like labeled boxes for storing data
- Use \`=\` to put values in variables
- Numbers can do math: \`+\` \`-\` \`*\` \`/\`
- You can use variables inside print() 

**Coming up next:** Making decisions with if statements - how your hero will react to different situations!`,
    },
  ];

  // =====================================================
  // MISSION 3: If Statements - Making Decisions
  // =====================================================
  const mission3Steps: LessonStep[] = [
    {
      id: "3-intro",
      title: "Decision Time! 🤔",
      type: "intro",
      content: `Games are full of decisions:
- **IF** you collect a coin → add points
- **IF** you touch an enemy → lose health
- **IF** health reaches zero → game over

In Python, we use \`if\` statements to make our code do different things based on conditions. This is what makes games interactive and exciting!`,
    },
    {
      id: "3-concept",
      title: "How If Statements Work",
      type: "concept",
      content: `An \`if\` statement checks if something is true, then runs code only if it is.

\`\`\`python
if health > 0:
    print("Still alive!")
\`\`\`

**Important:** Notice the colon \`:\` at the end of the if line, and the spaces (indent) before print. Python uses these to know what code belongs to the if!

**Comparison symbols:**
- \`>\` greater than
- \`<\` less than
- \`==\` equal to (two equals signs!)
- \`>=\` greater or equal
- \`<=\` less or equal
- \`!=\` not equal`,
      conceptExplanation: "The indented code (with spaces at the start) only runs when the condition is True. This is called the 'code block'.",
    },
    {
      id: "3-code1",
      title: "Your First If Statement",
      type: "code",
      content: `Let's check if our hero has enough health to continue!

Try changing the health value to see different messages:`,
      codeTemplate: `health = 75

if health > 50:
    print("You're doing great!")

if health <= 50:
    print("Be careful! Health is low!")`,
      expectedOutput: "You're doing great!",
      hint: "Try changing health to 30 and run again to see what happens!",
    },
    {
      id: "3-code2",
      title: "If-Else: Two Choices",
      type: "code",
      content: `Sometimes we want to do one thing OR another. We use \`else\` for this!

\`else\` means "if the condition WASN'T true, do this instead."`,
      codeTemplate: `coins = 10
item_cost = 15

if coins >= item_cost:
    print("You bought the power-up!")
    coins = coins - item_cost
else:
    print("Not enough coins!")

print("Coins left:", coins)`,
      expectedOutput: "Not enough coins!",
      hint: "Try changing coins to 20 to see what happens when you CAN afford the item!",
    },
    {
      id: "3-code3",
      title: "Multiple Choices with Elif",
      type: "code",
      content: `What if we have MORE than two choices? Use \`elif\` (short for "else if")!

This lets us check multiple conditions in order:`,
      codeTemplate: `score = 85

if score >= 90:
    print("⭐⭐⭐ Amazing! S Rank!")
elif score >= 70:
    print("⭐⭐ Great! A Rank!")
elif score >= 50:
    print("⭐ Good! B Rank!")
else:
    print("Keep practicing!")`,
      expectedOutput: "⭐⭐ Great! A Rank!",
      hint: "Change the score to different values (95, 60, 30) to see all the different ranks!",
    },
    {
      id: "3-challenge",
      title: "Challenge: Health Check",
      type: "challenge",
      content: `Create a health status system for your game!

Complete the code so it prints:
- "Full health!" when health is 100
- "Feeling good!" when health is 50 or more
- "Danger! Need healing!" when health is below 50

Test with health = 30 (should show danger message)`,
      codeTemplate: `health = 30

if health == 100:
    print("Full health!")
elif health >= ___:
    print("Feeling good!")
else:
    print("Danger! Need healing!")`,
      expectedOutput: "Danger! Need healing!",
      hint: "Replace ___ with 50 to check if health is 50 or more!",
    },
    {
      id: "3-summary",
      title: "Decision Making Pro! 🏆",
      type: "summary",
      content: `You're making great progress! Now you can make your code smart!

**What you learned:**
- \`if\` checks if something is true
- \`else\` runs when the if condition is false
- \`elif\` lets you check multiple conditions
- Comparison: \`>\` \`<\` \`==\` \`>=\` \`<=\` \`!=\`
- Code blocks need to be indented with spaces

**Coming up next:** Loops - how to repeat actions without writing the same code over and over!`,
    },
  ];

  // =====================================================
  // MISSION 4: Loops - Repeat Actions
  // =====================================================
  const mission4Steps: LessonStep[] = [
    {
      id: "4-intro",
      title: "Loops: Repeat Power! 🔄",
      type: "intro",
      content: `Imagine you want to draw 100 coins on screen. Would you write print("🪙") 100 times? That would take forever!

**Loops** let us repeat code as many times as we want with just a few lines. Games use loops constantly:
- Draw all the enemies
- Check all the collisions
- Update every frame

Let's learn this superpower!`,
    },
    {
      id: "4-concept",
      title: "The For Loop",
      type: "concept",
      content: `A \`for\` loop repeats code a specific number of times.

\`\`\`python
for i in range(5):
    print("Jump!")
\`\`\`

This prints "Jump!" five times! 

**How it works:**
- \`range(5)\` creates numbers: 0, 1, 2, 3, 4
- \`i\` holds the current number
- The code inside runs once for each number

**Useful tip:** \`range(5)\` goes from 0 to 4, not 1 to 5!`,
      conceptExplanation: "The variable 'i' is commonly used in loops. It stands for 'index' - the current count.",
    },
    {
      id: "4-code1",
      title: "Counting with Loops",
      type: "code",
      content: `Let's create a countdown for our game!

Watch how \`i\` changes each time through the loop:`,
      codeTemplate: `print("Game starting in...")

for i in range(5):
    print(i)

print("GO!")`,
      expectedOutput: "GO!",
      hint: "Notice it counts 0, 1, 2, 3, 4 - that's 5 numbers starting from 0!",
    },
    {
      id: "4-code2",
      title: "Collecting Coins",
      type: "code",
      content: `Let's simulate collecting coins using a loop!

Each time through the loop, we add to our score:`,
      codeTemplate: `score = 0
coins_to_collect = 5

for i in range(coins_to_collect):
    print("Collected coin", i + 1)
    score = score + 10

print("---")
print("Final score:", score)`,
      expectedOutput: "Final score: 50",
      hint: "Try changing coins_to_collect to 10 and see how the score changes!",
    },
    {
      id: "4-code3",
      title: "While Loops",
      type: "code",
      content: `A \`while\` loop keeps going AS LONG AS something is true.

This is perfect for game loops - keep playing while the player is alive!`,
      codeTemplate: `health = 3
enemy_damage = 1

while health > 0:
    print("Health:", health, "- Fighting enemy!")
    health = health - enemy_damage

print("Game Over!")`,
      expectedOutput: "Game Over!",
      hint: "The loop keeps running while health is greater than 0. When it hits 0, the loop stops!",
    },
    {
      id: "4-challenge",
      title: "Challenge: Power Up!",
      type: "challenge",
      content: `Your hero finds a power-up station that charges their power level!

Write a loop that charges from 0 to 5, printing each level.
The output should end with "Fully charged! Power: 5"`,
      codeTemplate: `power = 0

# Use a while loop to charge up!
while power < ___:
    power = power + 1
    print("Charging... Power:", power)

print("Fully charged! Power:", power)`,
      expectedOutput: "Fully charged! Power: 5",
      hint: "Replace ___ with 5 so the loop runs while power is less than 5!",
    },
    {
      id: "4-summary",
      title: "Loop Master! 🏆",
      type: "summary",
      content: `Amazing! Loops are one of the most powerful tools in programming!

**What you learned:**
- \`for\` loops repeat a specific number of times
- \`range(n)\` creates numbers from 0 to n-1
- \`while\` loops repeat while a condition is true
- Loops save us from writing repetitive code

**Coming up next:** Functions - create your own reusable commands!`,
    },
  ];

  // =====================================================
  // MISSION 5: Functions - Create Powers
  // =====================================================
  const mission5Steps: LessonStep[] = [
    {
      id: "5-intro",
      title: "Functions: Your Custom Commands! ⚡",
      type: "intro",
      content: `You've been using functions already - \`print()\` and \`range()\` are both functions!

Now you'll learn to create YOUR OWN functions. Think of them like teaching the computer a new trick.

Instead of writing the same code over and over, you create a function once and use it whenever you need it. Like having a special move you can do anytime!`,
    },
    {
      id: "5-concept",
      title: "Creating Functions",
      type: "concept",
      content: `Here's how to make a function:

\`\`\`python
def say_hello():
    print("Hello, hero!")
    print("Ready for adventure?")
\`\`\`

**Breaking it down:**
- \`def\` means "I'm defining a new function"
- \`say_hello\` is the function's name
- \`()\` is where we put inputs (more on this soon!)
- \`:\` starts the function's code
- Indented code is what the function does

**To USE the function, just call its name:**
\`\`\`python
say_hello()
\`\`\``,
      conceptExplanation: "Functions help organize code and make it reusable. Real games have hundreds of functions!",
    },
    {
      id: "5-code1",
      title: "Your First Function",
      type: "code",
      content: `Let's create a function that displays a game message!

Notice: we first DEFINE the function, then CALL it at the bottom.`,
      codeTemplate: `# Define the function
def show_welcome():
    print("=== STAR QUEST ===")
    print("Press any key to start!")
    print("==================")

# Call the function
show_welcome()`,
      expectedOutput: "=== STAR QUEST ===",
      hint: "The function is defined first, then called at the bottom with show_welcome()",
    },
    {
      id: "5-code2",
      title: "Functions with Inputs",
      type: "code",
      content: `Functions can take **parameters** - inputs that change what they do!

The input goes inside the parentheses:`,
      codeTemplate: `def greet_player(name):
    print("Welcome,", name, "!")
    print("Your adventure awaits!")

# Call with different names
greet_player("Luna")
greet_player("Max")`,
      expectedOutput: "Welcome, Luna !",
      hint: "Try adding greet_player(\"YourName\") at the bottom!",
    },
    {
      id: "5-code3",
      title: "Functions That Return Values",
      type: "code",
      content: `Functions can also give back a result using \`return\`.

This is super useful for calculations in games!`,
      codeTemplate: `def calculate_damage(base_damage, power_level):
    total = base_damage * power_level
    return total

# Use the function
damage = calculate_damage(10, 3)
print("Damage dealt:", damage)

# Use it again with different values
super_damage = calculate_damage(10, 5)
print("Super damage:", super_damage)`,
      expectedOutput: "Damage dealt: 30",
      hint: "The return statement sends the result back so we can store it in a variable!",
    },
    {
      id: "5-challenge",
      title: "Challenge: Health System",
      type: "challenge",
      content: `Create a function that calculates health after taking damage!

The function should:
1. Take current_health and damage as inputs
2. Subtract damage from health
3. Return the new health value

Test it: 100 health - 35 damage = 65 health remaining`,
      codeTemplate: `def take_damage(current_health, damage):
    new_health = current_health - ___
    return new_health

# Test your function!
health = take_damage(100, 35)
print("Health remaining:", health)`,
      expectedOutput: "Health remaining: 65",
      hint: "Replace ___ with 'damage' to subtract the damage amount!",
    },
    {
      id: "5-summary",
      title: "Function Master! 🏆",
      type: "summary",
      content: `You've unlocked a powerful programming skill!

**What you learned:**
- \`def\` creates a new function
- Functions can have parameters (inputs)
- \`return\` sends a value back
- Functions make code reusable and organized

**Coming up next:** Lists - store multiple items together, perfect for inventories and enemies!`,
    },
  ];

  // =====================================================
  // MISSION 6: Lists - Collections
  // =====================================================
  const mission6Steps: LessonStep[] = [
    {
      id: "6-intro",
      title: "Lists: Collections of Items! 📝",
      type: "intro",
      content: `In games, we often need to track multiple things:
- All the coins on the level
- All the enemies to update
- The player's inventory
- High scores

**Lists** let us store multiple items in one variable. Think of them like a backpack that can hold many items!`,
    },
    {
      id: "6-concept",
      title: "Creating Lists",
      type: "concept",
      content: `Create a list using square brackets \`[]\`:

\`\`\`python
inventory = ["sword", "shield", "potion"]
scores = [100, 85, 92, 78]
\`\`\`

**Accessing items:** Use their position (index), starting from 0!

\`\`\`python
inventory[0]  # "sword" (first item)
inventory[1]  # "shield" (second item)
inventory[2]  # "potion" (third item)
\`\`\`

**Remember:** Computers start counting from 0, not 1!`,
      conceptExplanation: "The position number is called an 'index'. The first item is always at index 0.",
    },
    {
      id: "6-code1",
      title: "Your Inventory",
      type: "code",
      content: `Let's create an inventory for your hero!`,
      codeTemplate: `# Create an inventory list
inventory = ["sword", "shield", "health potion"]

# Print the whole inventory
print("Your items:", inventory)

# Print specific items
print("Weapon:", inventory[0])
print("Defense:", inventory[1])
print("Healing:", inventory[2])`,
      expectedOutput: "Your items:",
      hint: "Change the items in the list to customize your hero's gear!",
    },
    {
      id: "6-code2",
      title: "Adding and Removing",
      type: "code",
      content: `Lists can grow and shrink!

- \`append()\` adds an item to the end
- \`remove()\` removes a specific item`,
      codeTemplate: `inventory = ["sword"]
print("Start:", inventory)

# Add items
inventory.append("shield")
inventory.append("bow")
print("After finding items:", inventory)

# Remove an item
inventory.remove("sword")
print("After dropping sword:", inventory)`,
      expectedOutput: "After dropping sword:",
      hint: "append() adds to the end, remove() takes out the specified item",
    },
    {
      id: "6-code3",
      title: "Looping Through Lists",
      type: "code",
      content: `The real power comes when we combine lists with loops!

We can do something to EVERY item in a list:`,
      codeTemplate: `enemies = ["goblin", "skeleton", "dragon"]

print("Enemies in this level:")
for enemy in enemies:
    print("- Watch out for the", enemy, "!")

print("---")
print("Total enemies:", len(enemies))`,
      expectedOutput: "Total enemies: 3",
      hint: "The 'for enemy in enemies' loop goes through each item one by one!",
    },
    {
      id: "6-challenge",
      title: "Challenge: Power-Ups",
      type: "challenge",
      content: `Create a power-up collection system!

1. Start with a list containing "speed" and "jump"
2. Add "shield" to the list
3. Print how many power-ups you have (use len())

The output should show: "Total power-ups: 3"`,
      codeTemplate: `# Start with two power-ups
power_ups = ["speed", "jump"]

# Add shield to the list
power_ups.___("shield")

# Print all power-ups
print("Your power-ups:", power_ups)

# Print the count
print("Total power-ups:", len(power_ups))`,
      expectedOutput: "Total power-ups: 3",
      hint: "Replace ___ with 'append' to add the shield power-up!",
    },
    {
      id: "6-summary",
      title: "Collection Expert! 🏆",
      type: "summary",
      content: `You can now manage groups of items like a pro!

**What you learned:**
- Lists use \`[]\` and hold multiple items
- Access items with \`list[index]\` (starting from 0)
- \`append()\` adds items
- \`remove()\` removes items
- \`len()\` tells you how many items
- Loops can go through each item

**Coming up next:** We'll put everything together and start building your actual game!`,
    },
  ];

  // =====================================================
  // MISSION 7: Building Your Game
  // =====================================================
  const mission7Steps: LessonStep[] = [
    {
      id: "7-intro",
      title: "Let's Build Your Game! 🎮",
      type: "intro",
      content: `This is it! You've learned all the Python skills you need. Now we'll use them to build a REAL platformer game!

We've created special game functions for you:
- \`create_player()\` - Creates your hero
- \`create_platform()\` - Creates surfaces to stand on
- \`create_coin()\` - Creates collectible coins
- \`set_background()\` - Changes the sky color
- \`set_gravity()\` - Controls how fast you fall

Let's bring your game to life!`,
    },
    {
      id: "7-code1",
      title: "Creating Your Player",
      type: "code",
      content: `First, let's create your player character!

The create_player function takes:
- x, y: Position on screen (0,0 is top-left)
- width, height: How big the player is
- color: What color to make them`,
      codeTemplate: `# Create your hero!
# create_player(x, y, width, height, color)

create_player(100, 200, 40, 40, "red")`,
      expectedOutput: "",
      showGamePreview: true,
      hint: "Try changing 'red' to other colors like 'blue', 'green', or 'purple'!",
    },
    {
      id: "7-code2",
      title: "Adding Platforms",
      type: "code",
      content: `Now let's add platforms for your player to stand on!

The ground is at y=260 (near the bottom). Let's create a ground platform and some floating ones:`,
      codeTemplate: `# Create the player
create_player(50, 200, 40, 40, "blue")

# Create the ground (a long platform at the bottom)
create_platform(0, 260, 600, 40, "forestgreen")

# Create floating platforms
create_platform(100, 200, 120, 20, "brown")
create_platform(300, 150, 120, 20, "brown")
create_platform(450, 100, 100, 20, "brown")`,
      expectedOutput: "",
      showGamePreview: true,
      hint: "Try moving the platforms! x goes left/right, y goes up/down. Click Play to test jumping!",
    },
    {
      id: "7-code3",
      title: "Adding Coins",
      type: "code",
      content: `Time to add something to collect! Coins give your game a goal.

Place coins on or above your platforms:`,
      codeTemplate: `# Create player and platforms
create_player(50, 200, 40, 40, "purple")
create_platform(0, 260, 600, 40, "forestgreen")
create_platform(100, 200, 120, 20, "brown")
create_platform(300, 140, 120, 20, "brown")

# Add coins to collect!
create_coin(150, 170)
create_coin(350, 110)
create_coin(500, 230)`,
      expectedOutput: "",
      showGamePreview: true,
      hint: "Click Play and collect all the coins! Watch your score increase!",
    },
    {
      id: "7-challenge",
      title: "Challenge: Design a Level",
      type: "challenge",
      content: `Now YOU design a fun level!

Create a level with:
- 1 player
- At least 3 platforms (including ground)
- At least 3 coins

Make it challenging but possible to beat!`,
      codeTemplate: `# Set a cool sky color
set_background("skyblue")

# Create your player
create_player(50, 200, 40, 40, "orange")

# Create platforms - design your level!
create_platform(0, 260, 600, 40, "green")
# Add more platforms here...

# Add coins to collect
# Add coins here...`,
      expectedOutput: "",
      showGamePreview: true,
      hint: "Use create_platform(x, y, width, height, color) and create_coin(x, y) to build your level!",
    },
    {
      id: "7-summary",
      title: "Game Creator! 🏆",
      type: "summary",
      content: `WOW! You just created a playable game level!

**What you built:**
- A player character that moves and jumps
- Platforms to navigate
- Coins to collect
- Your own level design!

**Coming up next:** The final mission - polish your game and make it truly yours!`,
    },
  ];

  // =====================================================
  // MISSION 8: Polish and Complete
  // =====================================================
  const mission8Steps: LessonStep[] = [
    {
      id: "8-intro",
      title: "Final Mission: Make It Amazing! ✨",
      type: "intro",
      content: `You've built a working game! Now let's make it SHINE!

Professional game developers spend lots of time on "polish" - the little details that make games feel great:
- Color schemes
- Level layout
- Difficulty balance
- Visual style

Let's use everything you've learned to create your masterpiece!`,
    },
    {
      id: "8-concept",
      title: "Game Design Tips",
      type: "concept",
      content: `**Color Tips:**
- Use contrasting colors (player should stand out!)
- Pick a theme: Night time? Sunset? Underwater?

**Level Design Tips:**
- Start easy, get harder
- Give players safe spots to rest
- Make coins require skill to get

**Platform Ideas:**
- Stair-stepping up
- Gaps to jump across
- High platforms for bonus coins`,
      conceptExplanation: "Good level design teaches players naturally - they learn by playing, not by reading instructions!",
    },
    {
      id: "8-code1",
      title: "Sunset Theme",
      type: "code",
      content: `Let's create a beautiful sunset-themed level!

Notice how the colors work together:`,
      codeTemplate: `# Sunset theme!
set_background("#FF7F50")  # Coral sunset sky

# Orange player stands out against the sky
create_player(50, 200, 40, 40, "#FFD700")

# Dark ground
create_platform(0, 260, 600, 40, "#2F4F4F")

# Purple/dark platforms
create_platform(80, 200, 100, 15, "#4B0082")
create_platform(220, 160, 100, 15, "#4B0082")
create_platform(360, 120, 100, 15, "#4B0082")
create_platform(480, 80, 100, 15, "#4B0082")

# Coins on each platform
create_coin(120, 170)
create_coin(260, 130)
create_coin(400, 90)
create_coin(520, 50)`,
      expectedOutput: "",
      showGamePreview: true,
      hint: "This level goes from left to right and up! Collect all 4 coins!",
    },
    {
      id: "8-code2",
      title: "Night Sky Theme",
      type: "code",
      content: `Now try a mysterious night theme!`,
      codeTemplate: `# Night sky theme
set_background("#1a1a2e")

# Glowing player!
create_player(50, 200, 35, 35, "#00ffff")

# Dark blue ground
create_platform(0, 260, 600, 40, "#16213e")

# Floating islands
create_platform(50, 190, 80, 20, "#0f3460")
create_platform(180, 220, 60, 20, "#0f3460")
create_platform(280, 180, 90, 20, "#0f3460")
create_platform(420, 140, 80, 20, "#0f3460")
create_platform(500, 200, 80, 20, "#0f3460")

# Golden coins scattered around
create_coin(80, 160)
create_coin(200, 190)
create_coin(320, 150)
create_coin(450, 110)
create_coin(530, 170)`,
      expectedOutput: "",
      showGamePreview: true,
      hint: "The cyan (light blue) player glows against the dark background!",
    },
    {
      id: "8-challenge",
      title: "Final Challenge: Your Masterpiece",
      type: "challenge",
      content: `Create your ULTIMATE level! 🏆

Requirements:
- Choose a color theme (make it look amazing!)
- At least 5 platforms arranged creatively
- At least 5 coins
- A path that makes sense (players can reach everything)

This is YOUR game - make it something you're proud of!`,
      codeTemplate: `# YOUR MASTERPIECE LEVEL
# Choose your theme color!
set_background("___")

# Your hero (pick a color that stands out!)
create_player(50, 200, 40, 40, "___")

# Design your platforms!
create_platform(0, 260, 600, 40, "___")
# Add at least 4 more platforms...

# Place your coins!
# Add at least 5 coins...`,
      expectedOutput: "",
      showGamePreview: true,
      hint: "Think about the journey: Where does the player start? Where do they go? Make it fun!",
    },
    {
      id: "8-summary",
      title: "🎉 Congratulations, Game Developer! 🎉",
      type: "summary",
      content: `YOU DID IT! You've completed the Junior Game Developer path!

**Your Python Journey:**
✅ print() - Displaying messages
✅ Variables - Storing data
✅ If statements - Making decisions
✅ Loops - Repeating actions
✅ Functions - Creating reusable code
✅ Lists - Managing collections
✅ Building a real game!

**What's Next?**
- Share your game with friends and family!
- Try creating new levels
- Experiment with different themes
- Keep learning and coding!

You are now officially a Game Developer! 🎮🌟`,
    },
  ];

  // Define all 8 missions
  const missions = [
    {
      sequenceNumber: 1,
      title: 'Hello, Python!',
      storyIntro: "Welcome to your coding adventure! 🎮 Every game developer starts with their first line of code. Today, you'll write your very first Python program and discover how to make the computer do what you say!",
      goal: "Learn to use print() to display messages and write your first Python code!",
      steps: mission1Steps,
      estimatedDuration: 20,
      resources: [
        'Python uses simple English-like commands',
        'print() is your first Python function!'
      ],
      unlockCondition: null,
    },
    {
      sequenceNumber: 2,
      title: 'Variables - Hero Stats',
      storyIntro: "Your hero needs stats! 💪 Health, speed, strength... all the numbers that make a game character special. Variables are like magical containers that remember these important values for you!",
      goal: "Learn to create variables and do math with them - essential for any game!",
      steps: mission2Steps,
      estimatedDuration: 25,
      resources: [
        'Variables store information for later use',
        'Numbers can do math: + - * /'
      ],
      unlockCondition: 'completion_of_mission_1',
    },
    {
      sequenceNumber: 3,
      title: 'Making Decisions',
      storyIntro: "Games need choices! 🤔 Should the enemy attack? Did the player collect enough coins? Is the game over? If-statements let your code make smart decisions just like you do!",
      goal: "Master if-statements to make your code react to different situations!",
      steps: mission3Steps,
      estimatedDuration: 30,
      resources: [
        'if checks conditions',
        'else handles the other case',
        'elif means "else if"'
      ],
      unlockCondition: 'completion_of_mission_2',
    },
    {
      sequenceNumber: 4,
      title: 'Loops - Repeat Power',
      storyIntro: "Imagine spawning 100 enemies one by one... that would take forever! 🔄 Loops let you repeat code automatically. This is how games handle all those coins, enemies, and effects you see!",
      goal: "Learn for and while loops to make your code repeat actions efficiently!",
      steps: mission4Steps,
      estimatedDuration: 30,
      resources: [
        'for loops repeat a set number of times',
        'while loops repeat until something changes'
      ],
      unlockCondition: 'completion_of_mission_3',
    },
    {
      sequenceNumber: 5,
      title: 'Functions - Custom Powers',
      storyIntro: "What if you could create your own commands? ⚡ Functions are like teaching the computer new tricks. Make it once, use it forever! Real games have thousands of functions working together!",
      goal: "Create your own reusable functions with parameters and return values!",
      steps: mission5Steps,
      estimatedDuration: 30,
      resources: [
        'def creates a new function',
        'Parameters are inputs to functions',
        'return sends back a result'
      ],
      unlockCondition: 'completion_of_mission_4',
    },
    {
      sequenceNumber: 6,
      title: 'Lists - Item Collections',
      storyIntro: "Heroes need inventories! 📦 Lists let you group items together - perfect for tracking coins, enemies, power-ups, and more. This is how games manage all their objects!",
      goal: "Master lists to store and manage collections of items!",
      steps: mission6Steps,
      estimatedDuration: 30,
      resources: [
        'Lists use square brackets []',
        'Index starts at 0, not 1',
        'append() adds, remove() removes'
      ],
      unlockCondition: 'completion_of_mission_5',
    },
    {
      sequenceNumber: 7,
      title: 'Build Your Game',
      storyIntro: "It's game time! 🎮 You've learned variables, conditions, loops, functions, and lists. Now we combine them all to create YOUR platformer game! Watch your code come to life!",
      goal: "Use everything you've learned to build a playable platformer level!",
      steps: mission7Steps,
      estimatedDuration: 40,
      resources: [
        'create_player() makes your hero',
        'create_platform() makes surfaces',
        'create_coin() makes collectibles'
      ],
      unlockCondition: 'completion_of_mission_6',
    },
    {
      sequenceNumber: 8,
      title: 'Polish & Share',
      storyIntro: "Time to make your game SHINE! ✨ Professional games aren't just functional - they're beautiful! Choose colors, design levels, and create something you're proud to show off!",
      goal: "Design beautiful levels and complete your game masterpiece!",
      steps: mission8Steps,
      estimatedDuration: 45,
      resources: [
        'set_background() changes the sky color',
        'Use color names or hex codes like #FF5733',
        'Great design makes great games!'
      ],
      unlockCondition: 'completion_of_mission_7',
    },
  ]

  // Create all missions
  for (const missionData of missions) {
    const mission = await prisma.mission.upsert({
      where: {
        pathId_sequenceNumber: {
          pathId: path.id,
          sequenceNumber: missionData.sequenceNumber,
        },
      },
      update: {
        title: missionData.title,
        storyIntro: missionData.storyIntro,
        goal: missionData.goal,
        stepsJson: missionData.steps as unknown as Prisma.InputJsonValue,
        estimatedDurationMinutes: missionData.estimatedDuration,
        resourcesJson: missionData.resources,
        unlockCondition: missionData.unlockCondition,
      },
      create: {
        pathId: path.id,
        sequenceNumber: missionData.sequenceNumber,
        title: missionData.title,
        storyIntro: missionData.storyIntro,
        goal: missionData.goal,
        stepsJson: missionData.steps as unknown as Prisma.InputJsonValue,
        estimatedDurationMinutes: missionData.estimatedDuration,
        resourcesJson: missionData.resources,
        unlockCondition: missionData.unlockCondition,
      },
    })

    console.log(`✅ Created mission ${mission.sequenceNumber}: ${mission.title}`)
  }

  console.log('')
  console.log('🎉 Database seeded successfully!')
  console.log('')
  console.log('Created:')
  console.log(`  - 1 Dream Path: "${path.name}"`)
  console.log(`  - ${missions.length} Missions with complete Python curriculum`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
