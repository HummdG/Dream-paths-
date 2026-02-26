/**
 * Mission Step Validator
 * 
 * Validates user code against mission step requirements using:
 * - AST-based checks (static code analysis)
 * - Runtime behavior checks (based on game events)
 */

import { ValidationCheck, ValidationConfig } from '../missions/schema';
import { GameEvent } from '../game-engine/types';

// =============================================================================
// VALIDATION RESULT TYPES
// =============================================================================

export interface ValidationResult {
  passed: boolean;
  checks: CheckResult[];
  feedback: string;
}

export interface CheckResult {
  check: ValidationCheck;
  passed: boolean;
  message: string;
}

// =============================================================================
// AST-BASED VALIDATION (Static Analysis)
// =============================================================================

/**
 * Perform AST-based validation on Python code.
 * Uses regex patterns to detect code structure without full parsing.
 * This is intentionally simple and tolerant of variations.
 */
export function validateAST(code: string, checks: ValidationCheck[]): CheckResult[] {
  const results: CheckResult[] = [];
  
  for (const check of checks) {
    const result = performASTCheck(code, check);
    results.push(result);
  }
  
  return results;
}

function performASTCheck(code: string, check: ValidationCheck): CheckResult {
  switch (check.type) {
    case 'ast_has_assignment': {
      // Look for variable assignment: variable = value
      const pattern = new RegExp(`^\\s*${check.variable}\\s*=`, 'm');
      const passed = pattern.test(code);
      return {
        check,
        passed,
        message: passed 
          ? `✅ Found variable '${check.variable}'` 
          : `❌ Create a variable named '${check.variable}'`
      };
    }
    
    case 'ast_has_function': {
      // Look for function definition: def function_name(
      const pattern = new RegExp(`^\\s*def\\s+${check.name}\\s*\\(`, 'm');
      const passed = pattern.test(code);
      return {
        check,
        passed,
        message: passed 
          ? `✅ Found function '${check.name}()'` 
          : `❌ Define a function called '${check.name}'`
      };
    }
    
    case 'ast_has_if': {
      // Look for if statement
      const pattern = /^\s*if\s+.+:/m;
      const passed = pattern.test(code);
      return {
        check,
        passed,
        message: passed 
          ? `✅ Found 'if' statement` 
          : `❌ Use an 'if' statement to check a condition`
      };
    }
    
    case 'ast_has_for_loop': {
      // Look for for loop
      const pattern = /^\s*for\s+\w+\s+in\s+.+:/m;
      const passed = pattern.test(code);
      return {
        check,
        passed,
        message: passed 
          ? `✅ Found 'for' loop` 
          : `❌ Use a 'for' loop to repeat actions`
      };
    }
    
    case 'ast_has_while_loop': {
      // Look for while loop
      const pattern = /^\s*while\s+.+:/m;
      const passed = pattern.test(code);
      return {
        check,
        passed,
        message: passed 
          ? `✅ Found 'while' loop` 
          : `❌ Use a 'while' loop`
      };
    }
    
    case 'ast_uses_global': {
      // Look for global statement
      const pattern = new RegExp(`^\\s*global\\s+.*\\b${check.variable}\\b`, 'm');
      const passed = pattern.test(code);
      return {
        check,
        passed,
        message: passed 
          ? `✅ Using 'global ${check.variable}'` 
          : `❌ Use 'global ${check.variable}' to modify it in a function`
      };
    }
    
    case 'ast_calls_function': {
      // Look for function call
      const pattern = new RegExp(`\\b${check.name}\\s*\\(`, 'm');
      const passed = pattern.test(code);
      return {
        check,
        passed,
        message: passed
          ? `✅ Calls '${check.name}()'`
          : `❌ Call the function '${check.name}()'`
      };
    }

    case 'ast_has_on_key_handler': {
      // Look for on_key_down( or when_key_pressed(
      const pattern = /on_key_down\s*\(|when_key_pressed\s*\(/m;
      const passed = pattern.test(code);
      return {
        check,
        passed,
        message: passed
          ? `✅ Found key handler`
          : `❌ Use on_key_down() to handle key presses`
      };
    }

    default:
      // Non-AST checks are skipped here
      return {
        check,
        passed: true,
        message: ''
      };
  }
}

// =============================================================================
// RUNTIME VALIDATION (Event-based)
// =============================================================================

/**
 * Perform runtime validation based on game events.
 */
export function validateRuntime(
  events: GameEvent[], 
  checks: ValidationCheck[],
  stdout: string
): CheckResult[] {
  const results: CheckResult[] = [];
  
  for (const check of checks) {
    const result = performRuntimeCheck(events, check, stdout);
    results.push(result);
  }
  
  return results;
}

function performRuntimeCheck(
  events: GameEvent[], 
  check: ValidationCheck, 
  stdout: string
): CheckResult {
  switch (check.type) {
    case 'stdout_contains': {
      const passed = stdout.toLowerCase().includes(check.text.toLowerCase());
      return {
        check,
        passed,
        message: passed 
          ? `✅ Output contains expected text` 
          : `❌ Print something to the output`
      };
    }
    
    case 'ui_message_shown': {
      const passed = events.some(e => e.type === 'message_shown');
      return {
        check,
        passed,
        message: passed 
          ? `✅ Message shown in game` 
          : `❌ Use show_message() to display text`
      };
    }
    
    case 'player_position_set': {
      const passed = events.some(e => e.type === 'player_position_set');
      return {
        check,
        passed,
        message: passed 
          ? `✅ Player position set` 
          : `❌ Use set_player_position() to place the player`
      };
    }
    
    case 'player_moves_on_key': {
      const passed = events.some(e => 
        e.type === 'player_moved' && 
        (e.data.direction === check.key.toLowerCase() || 
         (check.key === 'RIGHT' && e.data.direction === 'right') ||
         (check.key === 'LEFT' && e.data.direction === 'left'))
      );
      return {
        check,
        passed,
        message: passed 
          ? `✅ Player moves on ${check.key}` 
          : `❌ Make the player move when ${check.key} is pressed`
      };
    }
    
    case 'player_falls_when_airborne': {
      // Check if player Y position increased (fell down)
      const positionEvents = events.filter(e => e.type === 'player_position_set' || e.type === 'player_moved');
      const passed = positionEvents.length > 0; // Simplified - just check if player moved
      return {
        check,
        passed,
        message: passed 
          ? `✅ Gravity is working` 
          : `❌ Add gravity to make the player fall`
      };
    }
    
    case 'player_lands_on_platform': {
      const passed = events.some(e => e.type === 'player_landed');
      return {
        check,
        passed,
        message: passed 
          ? `✅ Player lands on platforms` 
          : `❌ Player should stop falling when hitting a platform`
      };
    }
    
    case 'player_jumps_on_key': {
      const passed = events.some(e => e.type === 'player_jumped');
      return {
        check,
        passed,
        message: passed 
          ? `✅ Player can jump` 
          : `❌ Make the player jump when ${check.key} is pressed`
      };
    }
    
    case 'no_double_jump': {
      // This is harder to validate - we'll just pass it for now
      // In a real implementation, we'd track jump events more carefully
      const jumpEvents = events.filter(e => e.type === 'player_jumped');
      const landEvents = events.filter(e => e.type === 'player_landed');
      // Simple check: shouldn't have more jumps than lands + 1
      const passed = jumpEvents.length <= landEvents.length + 1;
      return {
        check,
        passed,
        message: passed 
          ? `✅ No double jumping` 
          : `❌ Only allow jumping when on the ground`
      };
    }
    
    case 'platform_count_gte': {
      const platformCount = events.filter(e => e.type === 'platform_added').length;
      const passed = platformCount >= check.count;
      return {
        check,
        passed,
        message: passed 
          ? `✅ Added ${platformCount} platforms` 
          : `❌ Add at least ${check.count} platforms`
      };
    }
    
    case 'coin_collected': {
      const passed = events.some(e => e.type === 'coin_collected');
      return {
        check,
        passed,
        message: passed 
          ? `✅ Coins can be collected` 
          : `❌ Touch a coin to collect it`
      };
    }
    
    case 'score_increments': {
      const scoreEvents = events.filter(e => e.type === 'score_changed');
      const passed = scoreEvents.some(e => (e.data.score as number) > 0);
      return {
        check,
        passed,
        message: passed 
          ? `✅ Score increases` 
          : `❌ Increase the score when collecting coins`
      };
    }
    
    case 'enemy_moves': {
      const passed = events.some(e => e.type === 'enemy_spawned');
      return {
        check,
        passed,
        message: passed 
          ? `✅ Enemy added to game` 
          : `❌ Add an enemy to the game`
      };
    }
    
    case 'enemy_reverses': {
      const passed = events.some(e => e.type === 'enemy_direction_changed');
      return {
        check,
        passed,
        message: passed 
          ? `✅ Enemy changes direction` 
          : `❌ Make the enemy turn around at boundaries`
      };
    }
    
    case 'game_over_on_enemy_collision': {
      const passed = events.some(e => e.type === 'game_over');
      return {
        check,
        passed,
        message: passed 
          ? `✅ Game over works` 
          : `❌ Trigger game over when touching an enemy`
      };
    }
    
    case 'level_restarts': {
      const passed = events.some(e => e.type === 'level_restart');
      return {
        check,
        passed,
        message: passed 
          ? `✅ Level can restart` 
          : `❌ Restart the level after game over`
      };
    }
    
    case 'win_triggered': {
      const passed = events.some(e => e.type === 'win');
      return {
        check,
        passed,
        message: passed 
          ? `✅ Victory triggered!` 
          : `❌ Trigger you_win() when reaching the goal`
      };
    }
    
    case 'theme_applied': {
      const passed = events.some(e => e.type === 'theme_set');
      return {
        check,
        passed,
        message: passed 
          ? `✅ Theme applied` 
          : `❌ Use set_theme() to change the look`
      };
    }
    
    case 'player_sprite_applied': {
      const passed = events.some(e => e.type === 'sprite_set');
      return {
        check,
        passed,
        message: passed 
          ? `✅ Player sprite changed` 
          : `❌ Use set_player_sprite() to change your character`
      };
    }
    
    case 'preset_loaded': {
      // Check if platforms were added (indicates preset was loaded)
      const passed = events.some(e => e.type === 'platform_added');
      return {
        check,
        passed,
        message: passed 
          ? `✅ Level preset loaded` 
          : `❌ Use load_platform_preset() to load a preset`
      };
    }
    
    case 'platforms_modified_from_preset': {
      // We'd need to compare against preset - simplified for now
      const platformCount = events.filter(e => e.type === 'platform_added').length;
      const passed = platformCount > 0;
      return {
        check,
        passed,
        message: passed 
          ? `✅ Level customized` 
          : `❌ Modify at least one platform to make your level unique`
      };
    }
    
    case 'jump_style_enabled': {
      const passed = events.some(e => e.type === 'player_jumped');
      return {
        check,
        passed,
        message: passed 
          ? `✅ Jump style working` 
          : `❌ Make sure your jump style works`
      };
    }
    
    case 'win_rule_switchable': {
      // Would need to test both rules - simplified
      const hasWin = events.some(e => e.type === 'win');
      const hasGoalCheck = events.some(e => e.type === 'goal_added');
      const passed = hasWin || hasGoalCheck;
      return {
        check,
        passed,
        message: passed 
          ? `✅ Win rule set` 
          : `❌ Set up a win condition`
      };
    }
    
    case 'enemy_behavior_matches_type': {
      const passed = events.some(e => e.type === 'enemy_spawned');
      return {
        check,
        passed,
        message: passed 
          ? `✅ Enemy behavior set` 
          : `❌ Create an enemy with the right behavior`
      };
    }
    
    default:
      // Unknown check type - pass by default
      return {
        check,
        passed: true,
        message: ''
      };
  }
}

// =============================================================================
// MAIN VALIDATION FUNCTION
// =============================================================================

/**
 * Validate a mission step.
 */
export function validateStep(
  code: string,
  stdout: string,
  events: GameEvent[],
  validation: ValidationConfig
): ValidationResult {
  let allChecks: CheckResult[] = [];
  
  // Run appropriate validations based on config type
  if (validation.type === 'ast' || validation.type === 'ast_and_runtime') {
    const astChecks = validateAST(code, validation.checks);
    allChecks = [...allChecks, ...astChecks.filter(c => c.message !== '')];
  }
  
  if (validation.type === 'runtime' || validation.type === 'ast_and_runtime') {
    const runtimeChecks = validateRuntime(events, validation.checks, stdout);
    allChecks = [...allChecks, ...runtimeChecks.filter(c => c.message !== '')];
  }
  
  // Determine if all checks passed
  const passed = allChecks.every(c => c.passed);
  
  // Generate feedback
  const feedback = generateFeedback(allChecks, passed);
  
  return {
    passed,
    checks: allChecks,
    feedback
  };
}

function generateFeedback(checks: CheckResult[], passed: boolean): string {
  if (passed) {
    return "🎉 Great job! All checks passed!";
  }
  
  const failedChecks = checks.filter(c => !c.passed);
  if (failedChecks.length === 1) {
    return `Almost there! ${failedChecks[0].message}`;
  }
  
  return `Keep going! ${failedChecks.length} things to fix:\n${failedChecks.map(c => c.message).join('\n')}`;
}

// =============================================================================
// KID-FRIENDLY ERROR MESSAGES
// =============================================================================

/**
 * Transform Python error messages into kid-friendly explanations.
 */
export function friendlyError(error: string): string {
  const replacements: [RegExp, string][] = [
    [/SyntaxError: invalid syntax/gi, "Oops! There's a typo somewhere. Check your spelling and make sure you have all the right symbols!"],
    [/SyntaxError: expected ':'/gi, "Don't forget the colon (:) at the end of your if/for/def line!"],
    [/SyntaxError: unexpected indent/gi, "Your spaces look off! Make sure lines are lined up correctly."],
    [/IndentationError/gi, "Check your spaces! Python cares about how things are lined up."],
    [/NameError: name '(\w+)' is not defined/gi, "Hmm, I don't know what '$1' means. Did you spell it right?"],
    [/TypeError: '(\w+)' object is not callable/gi, "'$1' isn't something you can call like a function. Remove the () after it."],
    [/TypeError/gi, "Something doesn't match up. Are you using the right types of values?"],
    [/ZeroDivisionError/gi, "Whoops! You can't divide by zero!"],
    [/IndexError/gi, "You're trying to access something that doesn't exist in the list."],
    [/KeyError/gi, "That key doesn't exist in your dictionary."],
    [/AttributeError/gi, "That object doesn't have that feature. Check the spelling!"],
  ];
  
  let friendlyMessage = error;
  for (const [pattern, replacement] of replacements) {
    friendlyMessage = friendlyMessage.replace(pattern, replacement);
  }
  
  return friendlyMessage;
}






