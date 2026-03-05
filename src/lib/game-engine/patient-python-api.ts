/**
 * Python Patient Monitor API Bridge
 *
 * Injected before user code runs for patient monitor missions.
 * Bridges Python → window.patientEngine via Pyodide's js module.
 */

export const PYTHON_PATIENT_API = `
# =============================================================================
# 🏥 PATIENT MONITOR API - These functions control the medical monitor!
# =============================================================================

import js
from js import window
import builtins

# Get the patient engine from JavaScript
def _get_patient():
    return window.patientEngine

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
# VITALS CONTROL
# =============================================================================

def set_heart_rate(bpm):
    """Set the patient's heart rate in beats per minute"""
    patient = _get_patient()
    if patient:
        patient.setHeartRate(int(bpm))

def set_blood_pressure(systolic, diastolic):
    """Set blood pressure reading (e.g. set_blood_pressure(120, 80))"""
    patient = _get_patient()
    if patient:
        patient.setBloodPressure(int(systolic), int(diastolic))

def set_oxygen(percent):
    """Set oxygen saturation (0–100%)"""
    patient = _get_patient()
    if patient:
        patient.setOxygen(float(percent))

def get_reading(vital):
    """Get the current reading for a vital.
    Use: 'heart_rate', 'oxygen', 'bp_sys', or 'bp_dia'
    """
    patient = _get_patient()
    if patient:
        return float(patient.getReading(str(vital)))
    return 0

# =============================================================================
# ALERTS & TREATMENTS
# =============================================================================

def show_alert(message):
    """Flash a red alert banner on the monitor"""
    patient = _get_patient()
    if patient:
        patient.showAlert(str(message))
    _original_print(f"[ALERT] {message}")

def add_treatment(name):
    """Add a treatment entry to the treatment log"""
    patient = _get_patient()
    if patient:
        patient.addTreatment(str(name))
    _original_print(f"[Treatment] {name}")

def show_message(text):
    """Show a message (same as show_alert but used for general info)"""
    patient = _get_patient()
    if patient:
        patient.showAlert(str(text))
    _original_print(f"[Monitor] {text}")

# =============================================================================
# EVENT CALLBACKS
# =============================================================================

_reading_callbacks = []

def on_reading(callback):
    """Call this function every tick with the current vitals dictionary.

    Example:
        def check_vitals(vitals):
            hr = vitals['heart_rate']
            if hr > 100:
                show_alert("High heart rate!")

        on_reading(check_vitals)
    """
    _reading_callbacks.append(callback)
    patient = _get_patient()
    if patient:
        from pyodide.ffi import create_proxy
        proxy = create_proxy(callback)
        patient.onReading(proxy)

# =============================================================================
# GAME CONTROL
# =============================================================================

def start_monitor():
    """Start the patient monitor simulation"""
    patient = _get_patient()
    if patient:
        patient.start()

def stop_monitor():
    """Pause the monitor"""
    patient = _get_patient()
    if patient:
        patient.pause()

def reset_monitor():
    """Reset vitals to default values"""
    patient = _get_patient()
    if patient:
        patient.restart()
        patient.start()

# =============================================================================
# STATE RESET (called before every code run)
# =============================================================================

def _reset_patient_state():
    """Reset all Python globals and clear engine callbacks/events before each run."""
    global _reading_callbacks
    _reading_callbacks = []
    patient = _get_patient()
    if patient:
        patient.clearCallbacks()
        patient.clearEvents()

print("🏥 Patient Monitor API loaded! Let's check the vitals!")
`;

/**
 * Get the complete Python code to run (Patient API + user code).
 */
export function wrapPatientUserCode(userCode: string): string {
  return `${PYTHON_PATIENT_API}

# Reset state before user code runs
_reset_patient_state()

# =============================================================================
# YOUR CODE BELOW ⬇️
# =============================================================================

${userCode}
`;
}
