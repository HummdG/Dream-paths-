/**
 * Python Rocket API Bridge
 *
 * Injected before user code runs for rocket missions.
 * Bridges Python → window.rocketEngine via Pyodide's js module.
 */

export const PYTHON_ROCKET_API = `
# =============================================================================
# 🚀 ROCKET API - These functions control your rocket!
# =============================================================================

import js
from js import window
import builtins

# Get the rocket engine from JavaScript
def _get_rocket():
    return window.rocketEngine

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
# THRUST & DIRECTION
# =============================================================================

def set_thrust(power):
    """Set engine burn power: 0 = off, 100 = full blast"""
    rocket = _get_rocket()
    if rocket:
        rocket.setThrust(int(power))

def set_direction(angle):
    """Set rocket nose direction in degrees (0–360, 90 = straight up)"""
    rocket = _get_rocket()
    if rocket:
        rocket.setDirection(float(angle))

# =============================================================================
# TELEMETRY
# =============================================================================

def get_altitude():
    """Get current altitude in km"""
    rocket = _get_rocket()
    if rocket:
        return int(rocket.getAltitude())
    return 0

def get_fuel():
    """Get remaining fuel as a percentage (0–100)"""
    rocket = _get_rocket()
    if rocket:
        return int(rocket.getFuel())
    return 100

# =============================================================================
# DISPLAY
# =============================================================================

def show_message(text):
    """Show a message on the rocket HUD"""
    rocket = _get_rocket()
    if rocket:
        rocket.showMessage(str(text))
    _original_print(f"[Rocket] {text}")

# =============================================================================
# EVENT CALLBACKS
# =============================================================================

_update_callbacks = []

def on_update(callback):
    """Call this function every engine tick.

    Example:
        def check_altitude():
            alt = get_altitude()
            if alt >= 400:
                show_message("Orbit reached!")

        on_update(check_altitude)
    """
    _update_callbacks.append(callback)
    rocket = _get_rocket()
    if rocket:
        from pyodide.ffi import create_proxy
        proxy = create_proxy(callback)
        rocket.onUpdate(proxy)

# =============================================================================
# GAME CONTROL
# =============================================================================

def launch():
    """Start the rocket engine (begin the simulation)"""
    rocket = _get_rocket()
    if rocket:
        rocket.start()

def stop_rocket():
    """Pause the rocket simulation"""
    rocket = _get_rocket()
    if rocket:
        rocket.pause()

def restart_rocket():
    """Restart the rocket from the launch pad"""
    rocket = _get_rocket()
    if rocket:
        rocket.restart()
        rocket.start()

# =============================================================================
# STATE RESET (called before every code run)
# =============================================================================

def _reset_rocket_state():
    """Reset all Python globals and clear engine callbacks/events before each run."""
    global _update_callbacks
    _update_callbacks = []
    rocket = _get_rocket()
    if rocket:
        rocket.clearCallbacks()
        rocket.clearEvents()

print("🚀 Rocket API loaded! Ready for launch!")
`;

/**
 * Get the complete Python code to run (Rocket API + user code).
 */
export function wrapRocketUserCode(userCode: string): string {
  return `${PYTHON_ROCKET_API}

# Reset state before user code runs
_reset_rocket_state()

# =============================================================================
# YOUR CODE BELOW ⬇️
# =============================================================================

${userCode}
`;
}
