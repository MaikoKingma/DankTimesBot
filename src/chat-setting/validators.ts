import { Validation } from "./validation";

// This file contains all the validators used by ChatSettingTemplates.

export function autoLeaderboards(newValue: boolean, currentValue: boolean): Validation {
  return {
    message: newValue ? "Enabled automatic leaderboard posting!"
      : "Disabled automatic leaderboard posting!", success: true,
  };
}

export function dailyRandomFrequency(newValue: number, currentValue: number): Validation {
  if (newValue < 0 || newValue > 24) {
    return { success: false, message: "Frequency must be a whole number between 0 and 24!" };
  }
  return { success: true, message: "Updated daily frequency of random dank times!" };
}

export function firstNotifications(newValue: boolean, currentValue: boolean): Validation {
  return {
    message: newValue ? "Enabled announcements for first users to score!"
      : "Disabled announcements for first users to score!", success: true,
  };
}

export function hardcoreMode(newValue: boolean, currentValue: boolean): Validation {
  return {
    message: newValue ? "Enabled hardcore mode! Every day, those who did not score the previous day are punished!"
      : "Disabled hardcore mode!", success: true,
  };
}

export function modifier(newValue: number, currentValue: number): Validation {
  if (newValue < 1 || newValue > 10) {
    return { success: false, message: "Multiplier must be a number between 1 and 10!" };
  }
  return { success: true, message: "Updated multiplier!" };
}

export function notifications(newValue: boolean, currentValue: boolean): Validation {
  return {
    message: newValue ? "Enabled normal dank time notifications!"
      : "Disabled normal dank time notifications! (Random dank time notifications remain enabled.)",
    success: true,
  };
}

export function pointsPerRandomTime(newValue: number, currentValue: number): Validation {
  if (newValue < 1 || newValue > 100) {
    return { success: false, message: "Points must be a whole number between 1 and 100!" };
  }
  return { success: true, message: "Updated points for random dank times!" };
}

export function running(newValue: boolean, currentValue: boolean): Validation {
  if (newValue === currentValue) {
    const errorMsg = newValue ? "Bot is already running!" : "Bot is already stopped!";
    return { success: false, message: errorMsg };
  }
  const successMsg = newValue ? "Bot is now running! Hit '/help' for available commands."
    : "Bot is now stopped! Hit '/set running true' to restart.";
  return { success: true, message: successMsg };
}

export function timezone(newValue: string, currentValue: string): Validation {
  return { success: true, message: "Updated timezone!" };
}
