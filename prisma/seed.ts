import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create the Junior Game Developer path
  const path = await prisma.path.upsert({
    where: { slug: 'junior_game_dev' },
    update: {},
    create: {
      slug: 'junior_game_dev',
      name: 'Junior Game Developer',
      description: 'A 4-week sequence of missions where the child designs and builds simple games. Perfect for kids aged 8-12 who love playing games and want to learn how to make their own!',
      ageRange: '8-12',
      imageUrl: null,
    },
  })

  console.log('✅ Created path:', path.name)

  // Define all 8 missions
  const missions = [
    {
      sequenceNumber: 1,
      title: 'Design Your Hero',
      storyIntro: "Welcome, young game developer! 🎮 Every great game starts with a hero. Today, you'll create the main character for YOUR very first game. Think about your favorite game characters - what makes them special? Now it's your turn to create someone even cooler!",
      goal: "Design your game's hero - what they look like, who they are, and what special abilities they have.",
      steps: [
        'Get some paper and colored pencils (or open a drawing app on your tablet)',
        'Draw your hero! Think about: What do they wear? What color is their hair? Do they have any cool accessories?',
        'Write your hero\'s name at the top of the page',
        'Write 3 short sentences about who your hero is (Are they a space explorer? A magical wizard? A robot inventor?)',
        'List 3 special abilities your hero has (Can they jump super high? Shoot fireballs? Turn invisible?)',
        'Show your hero to a family member and tell them the story!',
        'Ask someone to take a photo of your drawing to keep'
      ],
      estimatedDuration: 30,
      resources: [
        'Tip: Look at characters from games like Mario, Minecraft, or Roblox for inspiration!',
        'Optional: Use a free drawing app like Sketchpad or Tayasui Sketches'
      ],
      unlockCondition: null,
    },
    {
      sequenceNumber: 2,
      title: 'Build Your First Playable Scene',
      storyIntro: "Amazing hero you created! 🌟 Now your hero needs a world to explore. Today, you'll build your first game level using the Level Designer - just click and drag to create platforms, add coins, and place enemies!",
      goal: 'Create a playable level with platforms, coins, and a goal flag.',
      steps: [
        'Open the Level Designer from your dashboard',
        'Pick a theme for your level (Jungle, Space, or City)',
        'Add some platforms by clicking the Platform tool and drawing on the canvas',
        'Place at least 3 coins for your hero to collect',
        'Add the Goal flag at the end of your level',
        'Click "Test" to play your level and make sure it\'s beatable!',
        'Save your level with a cool name'
      ],
      estimatedDuration: 30,
      resources: [
        'Tip: Make sure there\'s a path from the start to the goal!',
        'Tip: Start simple - you can always add more later',
        'Challenge: Try adding a moving platform!'
      ],
      unlockCondition: 'completion_of_mission_1',
    },
    {
      sequenceNumber: 3,
      title: 'Add Jumping and Gravity',
      storyIntro: "Your hero can walk! 🚶 But real game heroes can JUMP! Today, we'll add jumping with a twist - your hero needs to come back down (that's called gravity). This is how real game developers make characters feel fun to control!",
      goal: 'Make your hero jump when you press the space bar, and fall back down naturally.',
      steps: [
        'Open your Scratch project from Mission 2',
        'We need to create a variable! Go to Variables (orange) and click "Make a Variable"',
        'Name it "y velocity" - this tracks how fast your hero moves up or down',
        'In your forever loop, add: "change y velocity by -1" (this is gravity pulling down!)',
        'Add: "change y by y velocity"',
        'Add: "if y position < -150 then" and inside put "set y velocity to 0" and "set y to -150"',
        'Now for jumping! Add a new "if" block: "if key space pressed then"',
        'Inside it, put: "if y position = -150 then" (so you can only jump from the ground)',
        'Inside that, put: "set y velocity to 15"',
        'Click the green flag and press SPACE to jump!',
        'Play around with the numbers to make jumping feel just right'
      ],
      estimatedDuration: 40,
      resources: [
        'Tip: If gravity feels too strong, change -1 to -0.5',
        'Tip: If jumps are too small, try y velocity = 18 or 20',
        'Challenge: Can you add double-jump? (Hint: use another variable to count jumps)'
      ],
      unlockCondition: 'completion_of_mission_2',
    },
    {
      sequenceNumber: 4,
      title: 'Create Collectible Coins',
      storyIntro: "Your hero can run and jump! 🏃‍♂️ Now let's give them something to do - collect shiny coins! Every time your hero touches a coin, it should disappear and you'll earn points. This is one of the most satisfying feelings in games!",
      goal: 'Add coins that your hero can collect, and display a score that goes up with each coin.',
      steps: [
        'Create a new variable called "Score" and make sure "show on stage" is checked',
        'Add "set Score to 0" at the very beginning (under the green flag)',
        'Now create a coin! Click "Choose a Sprite" and pick a coin or star',
        'Make your coin smaller using the size option (try 50)',
        'Click on your coin sprite and add this code:',
        'Start with "when green flag clicked"',
        'Add "forever" loop',
        'Inside, add "if touching [your hero sprite name] then"',
        'Inside the if, add: "change Score by 1"',
        'Then add: "go to x: (pick random -200 to 200) y: (pick random -100 to 100)"',
        'Add a sound! Go to Sounds tab, choose "Add Sound", pick a coin sound',
        'Back in code, add "play sound [coin] until done" inside your if block',
        'Test it! Collect coins and watch your score go up!'
      ],
      estimatedDuration: 35,
      resources: [
        'Tip: Right-click your coin and "duplicate" to make more coins!',
        'Challenge: Can you make some coins worth more points than others?',
        'Tip: Add a "glide" block to make coins move around!'
      ],
      unlockCondition: 'completion_of_mission_3',
    },
    {
      sequenceNumber: 5,
      title: 'Add Sound Effects and Music',
      storyIntro: "Coins collected! 🪙 Now let's make your game SOUND amazing! Great games have sounds that make every action feel powerful. A jump sound, footsteps, background music - these tiny details make games 10x more fun!",
      goal: 'Add a background music track and sound effects for jumping and collecting coins.',
      steps: [
        'Click on your hero sprite',
        'Go to the "Sounds" tab at the top',
        'Click "Choose a Sound" and browse the library',
        'Find a good jump sound (try searching "jump" or "boing")',
        'Go back to Code and find where you set y velocity for jumping',
        'Add "play sound [jump] until done" right after setting velocity',
        'Now for background music! Click on the Stage (bottom right)',
        'Go to Sounds and add a music track (try "Dance Around" or "Video Game 1")',
        'In the Stage\'s code, add "when green flag clicked"',
        'Add "forever" loop with "play sound [music] until done" inside',
        'The forever loop makes the music repeat!',
        'Test your game - you should hear music and jump sounds!',
        'Adjust volumes by clicking the sound and using the "Louder" or "Softer" buttons'
      ],
      estimatedDuration: 30,
      resources: [
        'Tip: Keep background music quieter than sound effects',
        'Tip: Short, snappy sounds work best for actions',
        'Challenge: Add different sounds for landing, or collecting different items!'
      ],
      unlockCondition: 'completion_of_mission_4',
    },
    {
      sequenceNumber: 6,
      title: 'Build Obstacles and Challenge',
      storyIntro: "Your game sounds great! 🎵 But it's a bit easy, isn't it? Real games have obstacles - things that make you think and react quickly. Today, we'll add dangerous obstacles that end the game if you touch them. This creates TENSION and makes winning feel amazing!",
      goal: 'Add moving obstacles that reset the game when touched.',
      steps: [
        'Create a new sprite for your obstacle (try a spiky ball, fire, or enemy)',
        'Make it a good size (not too big, not too small)',
        'Create a variable called "Lives" and set it to 3 at game start',
        'Add code to your obstacle: "when green flag clicked"',
        'Add "go to x: 240 y: -130" (starts on the right side)',
        'Add "forever" loop',
        'Inside, add "change x by -5" (moves left)',
        'Add "if x position < -240 then go to x: 240 y: -130" (resets when off screen)',
        'Now add danger! Add "if touching [hero] then"',
        'Inside: "change Lives by -1", "play sound [ouch or lose]", "go to x: 240"',
        'Click on the Stage and add: "if Lives < 1 then stop all"',
        'Test it! Can you survive the obstacles?',
        'Duplicate your obstacle to add more challenge!'
      ],
      estimatedDuration: 45,
      resources: [
        'Tip: Start with slow obstacles (-3 speed) then make them faster',
        'Tip: Add a "wait 2 seconds" before obstacles start moving',
        'Challenge: Make obstacles move in patterns (up and down, or wavy)'
      ],
      unlockCondition: 'completion_of_mission_5',
    },
    {
      sequenceNumber: 7,
      title: 'Create a Start Menu',
      storyIntro: "Your game is getting serious! 🎮 Professional games don't just... start. They have a cool title screen that builds excitement! Today, you'll create a start menu with your game's name and a Play button. This is the first thing players see!",
      goal: 'Create a title screen with your game name and a clickable Play button.',
      steps: [
        'Create a new variable called "Game State" (uncheck "show on stage")',
        'Create a new sprite for your title - click "Paint" to draw it yourself!',
        'Use the text tool to write your game\'s name in big, cool letters',
        'Add colors, effects, make it look AWESOME!',
        'Create another sprite for the Play button - draw a button shape with "PLAY" text',
        'On your title sprite, add: "when green flag clicked", "show", "go to x: 0 y: 50"',
        'On your Play button, add: "when green flag clicked", "show", "go to x: 0 y: -50"',
        'Add to Play button: "when this sprite clicked", "set Game State to playing"',
        'Then: "hide" (hides the button)',
        'On title sprite add: "when I receive [start game]", "hide"',
        'Add "broadcast [start game]" after setting Game State in play button',
        'On your hero, change "when green flag clicked" to "when I receive [start game]"',
        'Do the same for coins and obstacles!',
        'Test: You should see title, click Play, then the game starts!'
      ],
      estimatedDuration: 50,
      resources: [
        'Tip: Use bright, contrasting colors for your title',
        'Tip: Add a subtitle like "Press Play to Start!"',
        'Challenge: Add instructions on how to play on the title screen'
      ],
      unlockCondition: 'completion_of_mission_6',
    },
    {
      sequenceNumber: 8,
      title: 'Polish and Share Your Game',
      storyIntro: "🚀 FINAL MISSION! You've built an actual video game! Now it's time to polish it - add those finishing touches that make good games GREAT. Then, the most exciting part: sharing your creation with the world!",
      goal: "Add final polish to your game and share it with friends and family!",
      steps: [
        'Playtest your game 5 times and write down anything that feels weird or broken',
        'Fix those issues! Adjust speeds, positions, or sounds',
        'Add a Game Over screen: create a new sprite that says "Game Over" and your final score',
        'Make it show when Lives = 0, and hide at game start',
        'Add a "Play Again" button that broadcasts [restart] when clicked',
        'Add visual polish: Try adding particle effects when collecting coins (small stars that fade)',
        'Make sure all your code has good starting positions (everything resets properly)',
        'Click "See Project Page" at the top of Scratch',
        'Fill in the title, instructions, and description of your game',
        'Add some tags like "platformer" "beginner" "adventure"',
        'Click "Share" to make your game public!',
        'Copy the link and share it with family and friends!',
        'Ask 3 people to play and give you feedback',
        'CELEBRATE! 🎉 You just made a real video game!'
      ],
      estimatedDuration: 60,
      resources: [
        'Tip: Watch someone play your game without helping them - you\'ll learn a lot!',
        'Tip: Credits are nice! Add a "Made by [Your Name]" somewhere',
        'What\'s next? Check out the Scratch tutorials for more advanced techniques!',
        'You\'re now a game developer. Keep creating! 🌟'
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
        stepsJson: missionData.steps,
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
        stepsJson: missionData.steps,
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
  console.log(`  - ${missions.length} Missions`)
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
