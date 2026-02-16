/**
 * Python API Bridge
 * 
 * This module generates Python code that provides a kid-friendly API
 * for controlling the game engine. The Python functions call into
 * JavaScript through Pyodide's js module.
 */

/**
 * The Python prelude that gets injected before the user's code.
 * This provides all the game API functions.
 */
export const PYTHON_GAME_API = `
# =============================================================================
# 🎮 GAME API - These functions control your game!
# =============================================================================

import js
from js import window
import builtins

# Get the game engine from JavaScript
def _get_engine():
    return window.gameEngine

# Store the original print function ONLY ONCE (prevent recursion on reload)
if not hasattr(builtins, '_dreampaths_original_print'):
    builtins._dreampaths_original_print = builtins.print

_original_print = builtins._dreampaths_original_print

# Override print to also show speech bubble
def print(*args, **kwargs):
    """Print to console AND show speech bubble on character"""
    # Call original print
    _original_print(*args, **kwargs)
    
    # Also show speech bubble if engine exists
    text = ' '.join(str(arg) for arg in args)
    if text and not text.startswith('['):  # Skip internal messages
        engine = _get_engine()
        if engine:
            engine.showSpeechBubble(str(text), 3000)

# Replace builtin print
builtins.print = print

# =============================================================================
# DISPLAY FUNCTIONS
# =============================================================================

def show_message(text):
    """Show a message on the game screen (centered)"""
    engine = _get_engine()
    if engine:
        engine.showMessage(str(text))
    _original_print(f"[Game] {text}")

def say(text):
    """Make your character say something in a speech bubble"""
    engine = _get_engine()
    if engine:
        engine.showSpeechBubble(str(text), 3000)
    _original_print(f"💬 {text}")

def show_score(score):
    """Update the score display"""
    engine = _get_engine()
    if engine:
        engine.showScore(int(score))

def show_lives(lives):
    """Update the lives display"""
    engine = _get_engine()
    if engine:
        engine.showLives(int(lives))

# =============================================================================
# THEME & SPRITES
# =============================================================================

def set_theme(theme_name):
    """Set the game theme: 'space', 'jungle', or 'city'"""
    engine = _get_engine()
    if engine:
        engine.setTheme(str(theme_name))
    print(f"[Theme] Set to {theme_name}")

def set_player_sprite(sprite_name):
    """Set the player sprite: 'robot', 'cat', 'knight', or 'astronaut'"""
    engine = _get_engine()
    if engine:
        engine.setPlayerSprite(str(sprite_name))
    print(f"[Sprite] Player is now {sprite_name}")

# =============================================================================
# PLAYER POSITION & MOVEMENT
# =============================================================================

def set_player_position(x, y):
    """Set the player's position"""
    engine = _get_engine()
    if engine:
        engine.setPlayerPosition(float(x), float(y))

def get_player_x():
    """Get the player's X position"""
    engine = _get_engine()
    if engine:
        return engine.getPlayerX()
    return 0

def get_player_y():
    """Get the player's Y position"""
    engine = _get_engine()
    if engine:
        return engine.getPlayerY()
    return 0

def set_player_x(x):
    """Set the player's X position"""
    engine = _get_engine()
    if engine:
        engine.setPlayerX(float(x))

def move(dx):
    """Move the player horizontally by dx pixels"""
    engine = _get_engine()
    if engine:
        engine.movePlayer(float(dx))

def move_player_y(dy):
    """Move the player vertically by dy pixels"""
    engine = _get_engine()
    if engine:
        engine.movePlayerY(float(dy))

def set_player_vy(vy):
    """Set the player's vertical velocity"""
    engine = _get_engine()
    if engine:
        engine.setPlayerVelocityY(float(vy))

# =============================================================================
# GROUND & COLLISION DETECTION
# =============================================================================

def is_on_ground():
    """Check if the player is on the ground"""
    engine = _get_engine()
    if engine:
        return engine.isOnGround()
    return False

def will_collide_below(vy):
    """Check if moving down by vy would hit a platform"""
    engine = _get_engine()
    if engine:
        return engine.willCollideBelow(float(vy))
    return False

def snap_to_platform():
    """Snap the player to the top of the platform below them"""
    engine = _get_engine()
    if engine:
        engine.snapToPlatform()

def collides_with(tag):
    """Check if the player collides with an object type: 'COIN', 'ENEMY', 'GOAL'"""
    engine = _get_engine()
    if engine:
        return engine.collidesWith(str(tag))
    return False

def remove_colliding(tag):
    """Remove the object the player is colliding with"""
    engine = _get_engine()
    if engine:
        engine.removeColliding(str(tag))

# =============================================================================
# LEVEL BUILDING
# =============================================================================

def add_platform(x, y, width, height):
    """Add a platform at position (x, y) with given size"""
    engine = _get_engine()
    if engine:
        engine.addPlatform(float(x), float(y), float(width), float(height))
    print(f"[Platform] Added at ({x}, {y})")

def load_platform_preset(preset_name):
    """Load a preset level: 'easy', 'medium', or 'hard'
    Returns a list of platform tuples: [(x, y, width, height), ...]"""
    engine = _get_engine()
    if engine:
        js_result = engine.loadPlatformPreset(str(preset_name))
        # Convert JavaScript array to Python list
        result = []
        for i in range(js_result.length):
            item = js_result[i]
            result.append((item[0], item[1], item[2], item[3]))
        return result
    # Fallback presets
    presets = {
        'easy': [(0, 300, 400, 40), (450, 280, 200, 40), (700, 260, 150, 40)],
        'medium': [(0, 300, 200, 40), (280, 260, 150, 40), (500, 220, 150, 40), (720, 180, 180, 40)],
        'hard': [(0, 300, 150, 40), (220, 250, 100, 40), (400, 200, 100, 40), (580, 150, 100, 40), (750, 120, 150, 40)]
    }
    return presets.get(preset_name, presets['easy'])

def add_coin(x, y):
    """Add a collectible coin at position (x, y)"""
    engine = _get_engine()
    if engine:
        engine.addCoin(float(x), float(y))
    print(f"[Coin] Added at ({x}, {y})")

def add_enemy(enemy_type, x, y):
    """Add an enemy at position (x, y)
    Types: 'slime', 'bat', 'robot'"""
    engine = _get_engine()
    if engine:
        engine.addEnemy(str(enemy_type), float(x), float(y))
    print(f"[Enemy] {enemy_type} added at ({x}, {y})")

def set_enemy_x(enemy_type, x):
    """Set an enemy's X position"""
    engine = _get_engine()
    if engine:
        engine.setEnemyX(str(enemy_type), float(x))

def set_enemy_position(enemy_type, x, y):
    """Set an enemy's position"""
    engine = _get_engine()
    if engine:
        engine.setEnemyPosition(str(enemy_type), float(x), float(y))

def add_goal(x, y):
    """Add the goal flag at position (x, y)"""
    engine = _get_engine()
    if engine:
        engine.addGoal(float(x), float(y))
    print(f"[Goal] Added at ({x}, {y})")

# =============================================================================
# SOUND
# =============================================================================

def play_sound(sound_name):
    """Play a sound effect: 'coin', 'jump', 'hurt', 'victory', 'game_over'"""
    engine = _get_engine()
    if engine:
        engine.playSound(str(sound_name))
    print(f"[Sound] {sound_name}")

# =============================================================================
# GAME STATE
# =============================================================================

def you_win():
    """Trigger the win state"""
    engine = _get_engine()
    if engine:
        engine.youWin()
    print("[Game] YOU WIN!")

def stop_game():
    """Stop the game loop"""
    engine = _get_engine()
    if engine:
        engine.stopGame()

def restart_level():
    """Restart the current level"""
    engine = _get_engine()
    if engine:
        engine.restart()
    print("[Game] Level restarted")

def reset_player_position():
    """Reset the player to their starting position"""
    engine = _get_engine()
    if engine:
        engine.resetPlayerPosition()

def freeze_enemies():
    """Stop all enemies from moving"""
    engine = _get_engine()
    if engine:
        engine.freezeEnemies()

def unlock_next_level():
    """Unlock the next level (called when winning)"""
    engine = _get_engine()
    if engine:
        engine.unlockNextLevel()
    print("[Game] Next level unlocked!")

# =============================================================================
# EVENT CALLBACKS
# =============================================================================

# Store callbacks for the game loop
_update_callbacks = []
_key_callbacks = {}

def on_update(callback):
    """Register a function to run every frame"""
    _update_callbacks.append(callback)
    
    # Register with the engine
    engine = _get_engine()
    if engine:
        # Create a JavaScript-compatible callback
        from pyodide.ffi import create_proxy
        proxy = create_proxy(callback)
        engine.onUpdate(proxy)

def on_key_down(key, callback):
    """Register a function to run when a key is pressed
    Keys: 'LEFT', 'RIGHT', 'UP', 'DOWN', 'SPACE'"""
    key = str(key).upper()
    if key not in _key_callbacks:
        _key_callbacks[key] = []
    _key_callbacks[key].append(callback)
    
    # Register with the engine
    engine = _get_engine()
    if engine:
        from pyodide.ffi import create_proxy
        proxy = create_proxy(callback)
        engine.onKeyDown(key, proxy)

def on_key_up(key, callback):
    """Register a function to run when a key is released"""
    key = str(key).upper()
    
    engine = _get_engine()
    if engine:
        from pyodide.ffi import create_proxy
        proxy = create_proxy(callback)
        engine.onKeyUp(key, proxy)

def is_key_pressed(key):
    """Check if a key is currently held down"""
    engine = _get_engine()
    if engine:
        return engine.isKeyPressed(str(key).upper())
    return False

# =============================================================================
# 🌟 SIMPLIFIED KID-FRIENDLY HELPERS
# =============================================================================

class Hero:
    """Easy-to-use hero controller"""
    
    def __init__(self):
        self._speed = 5
        self._jump_power = 15
    
    @property
    def x(self):
        """Get hero's X position"""
        return get_player_x()
    
    @property
    def y(self):
        """Get hero's Y position"""
        return get_player_y()
    
    @property
    def speed(self):
        return self._speed
    
    @speed.setter
    def speed(self, value):
        self._speed = value
    
    def move_right(self, speed=None):
        """Move the hero to the right"""
        move(speed or self._speed)
    
    def move_left(self, speed=None):
        """Move the hero to the left"""
        move(-(speed or self._speed))
    
    def jump(self, power=None):
        """Make the hero jump (only works on ground)"""
        if is_on_ground():
            set_player_vy(-(power or self._jump_power))
            play_sound('jump')
            return True
        return False
    
    def stop(self):
        """Stop the hero's movement"""
        pass  # Will be implemented with velocity control
    
    def say(self, text):
        """Make the hero say something"""
        say(str(text))
    
    def is_touching(self, what):
        """Check if hero is touching something: 'coin', 'enemy', 'goal'"""
        return collides_with(what.upper())

# Create a global hero instance
hero = Hero()

# =============================================================================
# 🎮 SIMPLE EVENT HANDLERS
# =============================================================================

def when_key_pressed(key, action):
    """Do something when a key is pressed
    
    Example:
        when_key_pressed('right', hero.move_right)
        when_key_pressed('space', hero.jump)
    """
    key = str(key).upper()
    # Map friendly names
    key_map = {
        'RIGHT': 'RIGHT',
        'LEFT': 'LEFT',
        'UP': 'UP',
        'DOWN': 'DOWN',
        'SPACE': 'SPACE',
        'JUMP': 'SPACE',
    }
    key = key_map.get(key, key)
    on_key_down(key, action)

def when_touching(what, action):
    """Do something when touching an object
    
    Example:
        when_touching('coin', collect_coin)
        when_touching('enemy', lose_life)
    """
    what = str(what).upper()
    def check_and_run():
        if collides_with(what):
            action()
    on_update(check_and_run)

def collect_coin():
    """Helper: Collect a coin and add to score"""
    if collides_with('COIN'):
        remove_colliding('COIN')
        global score
        try:
            score += 1
        except:
            score = 1
        show_score(score)
        play_sound('coin')
        print(f'Got a coin! Score: {score}')

def lose_life():
    """Helper: Lose a life when touching enemy"""
    global lives
    try:
        lives -= 1
    except:
        lives = 2
    show_lives(lives)
    play_sound('hurt')
    reset_player_position()
    if lives <= 0:
        show_message('💀 GAME OVER!')
        play_sound('game_over')
        restart_level()

# =============================================================================
# 🎯 GOAL HELPERS
# =============================================================================

def set_goal_type(goal_type):
    """Set how to win: 'reach_flag', 'collect_all_coins', 'defeat_enemies'
    
    Example:
        set_goal_type('reach_flag')
        set_goal_type('collect_all_coins')
    """
    global _win_goal
    _win_goal = goal_type
    print(f"[Goal] Win by: {goal_type}")

def check_win():
    """Check if the player has won based on goal type"""
    global _win_goal
    try:
        goal = _win_goal
    except:
        goal = 'reach_flag'
    
    if goal == 'reach_flag' or goal == 'reach_goal':
        if collides_with('GOAL'):
            return True
    elif goal == 'collect_all_coins':
        # Check if all coins collected
        pass
    
    return False

# =============================================================================
# 🎨 USER CONTENT LOADING
# =============================================================================

# Store for user's custom content (loaded from database)
_user_levels = {}
_user_sprites = {}
_user_enemies = {}

def load_my_level(level_name):
    """Load one of your custom levels by name
    
    Example:
        load_my_level("My Space Level")
    """
    engine = _get_engine()
    if engine and level_name in _user_levels:
        level = _user_levels[level_name]
        # Clear existing objects
        engine.restart()
        # Load platforms
        for p in level.get('platforms', []):
            add_platform(p['x'], p['y'], p['width'], p['height'])
        # Load coins
        for c in level.get('coins', []):
            add_coin(c['x'], c['y'])
        # Load enemies
        for e in level.get('enemies', []):
            add_enemy(e.get('type', 'slime'), e['x'], e['y'])
        # Load goal
        goal = level.get('goal')
        if goal:
            add_goal(goal['x'], goal['y'])
        # Set theme
        if level.get('theme'):
            set_theme(level['theme'])
        print(f"[Level] Loaded '{level_name}'!")
        return True
    print(f"[Level] '{level_name}' not found. Create it in the Level Designer!")
    return False

def load_my_enemy(enemy_name):
    """Load one of your custom enemies by name
    
    Example:
        load_my_enemy("Scary Monster")
    """
    if enemy_name in _user_enemies:
        enemy_data = _user_enemies[enemy_name]
        print(f"[Enemy] Loaded '{enemy_name}'!")
        return enemy_data
    print(f"[Enemy] '{enemy_name}' not found. Create it in the Sprite Designer!")
    return None

def add_my_enemy(enemy_name, x, y):
    """Add one of your custom enemies at a position
    
    Example:
        add_my_enemy("Scary Monster", 400, 260)
    """
    if enemy_name in _user_enemies:
        enemy_data = _user_enemies[enemy_name]
        # Add enemy with custom behavior
        engine = _get_engine()
        if engine:
            engine.addEnemy('custom', float(x), float(y))
            # The engine will use the custom sprite
        print(f"[Enemy] Added '{enemy_name}' at ({x}, {y})")
        return True
    print(f"[Enemy] '{enemy_name}' not found!")
    return False

def list_my_levels():
    """Show all your custom levels"""
    if _user_levels:
        print("📂 Your Levels:")
        for name in _user_levels:
            print(f"  - {name}")
    else:
        print("No custom levels yet! Create one in the Level Designer.")

def list_my_enemies():
    """Show all your custom enemies"""
    if _user_enemies:
        print("👾 Your Enemies:")
        for name in _user_enemies:
            print(f"  - {name}")
    else:
        print("No custom enemies yet! Create one in the Sprite Designer.")

# Internal function to register user content (called from JavaScript)
def _register_user_level(name, data):
    _user_levels[name] = data

def _register_user_enemy(name, data):
    _user_enemies[name] = data

# =============================================================================
# 🚀 QUICK START HELPERS
# =============================================================================

def setup_controls():
    """Set up basic arrow key controls for the hero
    
    Just call this to get started:
        setup_controls()
    """
    when_key_pressed('right', hero.move_right)
    when_key_pressed('left', hero.move_left)
    when_key_pressed('space', hero.jump)
    print("⌨️ Controls ready! Arrow keys to move, SPACE to jump!")

def setup_simple_game():
    """Set up a simple game with controls, coins, and enemies
    
    Example:
        setup_simple_game()
    """
    setup_controls()
    when_touching('coin', collect_coin)
    when_touching('enemy', lose_life)
    when_touching('goal', you_win)
    print("🎮 Simple game setup complete!")

# =============================================================================
# INITIALIZATION
# =============================================================================

# Initialize global variables
score = 0
lives = 3
_win_goal = 'reach_flag'

print("🎮 Game API loaded! Let's make a game!")
print("💡 Tip: Call setup_simple_game() for quick start!")
`;

/**
 * Get the complete Python code to run (API + user code)
 */
export function wrapUserCode(userCode: string): string {
  return `${PYTHON_GAME_API}

# =============================================================================
# YOUR CODE BELOW ⬇️
# =============================================================================

${userCode}
`;
}

/**
 * Get just the API code (for displaying to users or debugging)
 */
export function getPythonAPI(): string {
  return PYTHON_GAME_API;
}

