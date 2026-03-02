/**
 * Python Snake API Bridge
 *
 * Injected before user code runs for snake missions.
 * Bridges Python → window.snakeEngine via Pyodide's js module.
 */

export const PYTHON_SNAKE_API = `
# =============================================================================
# 🐍 SNAKE API - These functions control your snake game!
# =============================================================================

import js
from js import window
import builtins

# Get the snake engine from JavaScript
def _get_snake():
    return window.snakeEngine

# Store the original print function ONLY ONCE (prevent recursion on reload)
if not hasattr(builtins, '_dreampaths_original_print'):
    builtins._dreampaths_original_print = builtins.print

_original_print = builtins._dreampaths_original_print

# Override print so it shows in the output panel
def print(*args, **kwargs):
    """Print to the output panel"""
    _original_print(*args, **kwargs)

builtins.print = print

# =============================================================================
# DIRECTION CONTROL
# =============================================================================

def set_direction(direction):
    """Set the snake's direction: 'UP', 'DOWN', 'LEFT', 'RIGHT'"""
    snake = _get_snake()
    if snake:
        snake.setDirection(str(direction).upper())

def get_direction():
    """Get the snake's current direction"""
    snake = _get_snake()
    if snake:
        return str(snake.getDirection())
    return 'RIGHT'

# =============================================================================
# GAME INFO
# =============================================================================

def get_score():
    """Get the current score"""
    snake = _get_snake()
    if snake:
        return int(snake.getScore())
    return 0

def get_snake_length():
    """Get how many segments the snake has"""
    snake = _get_snake()
    if snake:
        return int(snake.getSnakeLength())
    return 3

def get_snake_head():
    """Get the snake head position as (x, y) tuple (grid coordinates)"""
    snake = _get_snake()
    if snake:
        head = snake.getSnakeHead()
        return (int(head.x), int(head.y))
    return (0, 0)

def get_food_position():
    """Get the food position as (x, y) tuple (grid coordinates)"""
    snake = _get_snake()
    if snake:
        pos = snake.getFoodPosition()
        return (int(pos.x), int(pos.y))
    return (0, 0)

# =============================================================================
# DISPLAY
# =============================================================================

def show_message(text):
    """Show a message on the snake game screen"""
    snake = _get_snake()
    if snake:
        snake.showMessage(str(text))
    _original_print(f"[Snake] {text}")

def set_snake_color(color):
    """Set the snake's color — use a hex code like '#ff0000' or a name like 'lime'"""
    snake = _get_snake()
    if snake:
        snake.setSnakeColor(str(color))

def set_background_color(color):
    """Set the background color"""
    snake = _get_snake()
    if snake:
        snake.setBackgroundColor(str(color))

# =============================================================================
# GAME CONTROL
# =============================================================================

def set_game_speed(ms):
    """Set how fast the snake moves — ms per step (lower = faster, e.g. 100)"""
    snake = _get_snake()
    if snake:
        snake.setGameSpeed(int(ms))

def stop_game():
    """Stop (pause) the snake game"""
    snake = _get_snake()
    if snake:
        snake.pause()

def restart_snake():
    """Restart the snake game from the beginning"""
    snake = _get_snake()
    if snake:
        snake.restart()
        snake.start()

# =============================================================================
# EVENT CALLBACKS
# =============================================================================

# Python-side callback lists (so we can clear them cleanly)
_tick_callbacks = []
_food_callbacks = []
_game_over_callbacks = []

def on_tick(callback):
    """Call this function every game tick (each step the snake moves)

    Example:
        def my_tick():
            print(f"Score: {get_score()}")

        on_tick(my_tick)
    """
    _tick_callbacks.append(callback)
    snake = _get_snake()
    if snake:
        from pyodide.ffi import create_proxy
        proxy = create_proxy(callback)
        snake.onTick(proxy)

def on_key_down(key, callback):
    """Call this function when an arrow key is pressed.
    Keys: 'UP', 'DOWN', 'LEFT', 'RIGHT'

    Example:
        on_key_down('UP', lambda: set_direction('UP'))
    """
    key_upper = str(key).upper()
    snake = _get_snake()
    if snake:
        from pyodide.ffi import create_proxy
        proxy = create_proxy(callback)
        snake.onKeyDown(key_upper, proxy)

def on_food_eaten(callback):
    """Call this function each time the snake eats food.

    Example:
        def ate_food():
            print(f"Yum! Score: {get_score()}")

        on_food_eaten(ate_food)
    """
    _food_callbacks.append(callback)
    snake = _get_snake()
    if snake:
        from pyodide.ffi import create_proxy
        proxy = create_proxy(callback)
        snake.onFoodEaten(proxy)

def on_game_over(callback):
    """Call this function when the game ends.

    Example:
        def died():
            show_message(f"Game Over! Score: {get_score()}")

        on_game_over(died)
    """
    _game_over_callbacks.append(callback)
    snake = _get_snake()
    if snake:
        from pyodide.ffi import create_proxy
        proxy = create_proxy(callback)
        snake.onGameOver(proxy)

# =============================================================================
# STATE RESET (called before every code run)
# =============================================================================

def _reset_snake_state():
    """Reset all Python globals and clear engine callbacks/events before each run."""
    global _tick_callbacks, _food_callbacks, _game_over_callbacks
    _tick_callbacks = []
    _food_callbacks = []
    _game_over_callbacks = []
    snake = _get_snake()
    if snake:
        snake.clearCallbacks()
        snake.clearEvents()

print("🐍 Snake API loaded! Let's write some Python!")
`;

/**
 * Get the complete Python code to run (Snake API + user code).
 */
export function wrapSnakeUserCode(userCode: string): string {
  return `${PYTHON_SNAKE_API}

# Reset state before user code runs
_reset_snake_state()

# =============================================================================
# YOUR CODE BELOW ⬇️
# =============================================================================

${userCode}
`;
}
