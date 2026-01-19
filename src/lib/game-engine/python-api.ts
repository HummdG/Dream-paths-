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

# Get the game engine from JavaScript
def _get_engine():
    return window.gameEngine

# =============================================================================
# DISPLAY FUNCTIONS
# =============================================================================

def show_message(text):
    """Show a message on the game screen"""
    engine = _get_engine()
    if engine:
        engine.showMessage(str(text))
    print(f"[Game] {text}")

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
# INITIALIZATION
# =============================================================================

print("🎮 Game API loaded! Let's make a game!")
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

