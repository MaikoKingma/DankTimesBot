import { ChatRegistry } from "../chat/chat-registry";
import { DankTimeScheduler } from "../dank-time-scheduler/dank-time-scheduler";
import { DankTime } from "../dank-time/dank-time";
import { Release } from "../release";
import { TelegramClient } from "../telegram-client/telegram-client";
import * as util from "../util/util";

/** Holds functions that take a 'msg' and a 'match' parameter, and return string messages. */
export class TelegramBotCommands {

  constructor(private readonly tgClient: TelegramClient,
              private readonly chatRegistry: ChatRegistry,
              private readonly scheduler: DankTimeScheduler,
              private readonly releaseLog: Release[],
              private readonly version: string) {
  }

  /**
   * Sets a specified chat setting to a new value.
   * @param msg The message object from the Telegram api.
   * @param match The regex matched object from the Telegram api.
   * @returns The response.
   */
  public set(msg: any, match: any): string {
    const split = match.input.split(" ");
    if (split.length < 3) {
      return "Not enough arguments! Format: /set [setting] [value]";
    }
    const chat = this.chatRegistry.getOrCreateChat(msg.chat.id);
    const validation = chat.settings.trySetFromString(split[1], split[2]);
    return validation.message;
  }

  /**
   * Resets the scores of the specified chat.
   * @param msg The message object from the Telegram api.
   * @param match The regex matched object from the Telegram api.
   * @returns The response.
   */
  public resetChat(msg: any, match: any): string {
    this.chatRegistry.getOrCreateChat(msg.chat.id).awaitingResetConfirmation = msg.from.id;
    return "Are you sure? Type 'yes' to confirm.";
  }

  /**
   * Prints the current settings of the chat identified in the msg object.
   * @param msg The message object from the Telegram api.
   * @param match The regex matched object from the Telegram api.
   * @returns The response.
   */
  public chatSettings(msg: any, match: any): string {
    const chat = this.chatRegistry.getOrCreateChat(msg.chat.id);
    let settings = "<b>--- SETTINGS ---</b>\n";
    chat.settings.settings.forEach((setting) => {
      settings += `\n<b>${setting.template.name}:</b> ${setting.value}`;
    });
    return settings;
  }

  /**
   * Prints the NORMAL dank times of the chat identified in the msg object.
   * @param msg The message object from the Telegram api.
   * @param match The regex matched object from the Telegram api.
   * @returns The response.
   */
  public dankTimes(msg: any, match: any): string {
    let dankTimes = "<b>--- DANK TIMES ---</b>\n";
    const chat = this.chatRegistry.getOrCreateChat(msg.chat.id);
    for (const time of chat.dankTimes) {
      dankTimes +=
        `\ntime: ${util.padNumber(time.hour)}:${util.padNumber(time.minute)}:00    points: ${time.points}    texts:`;
      for (const text of time.texts) {
        dankTimes += ` ${text}`;
      }
    }
    return dankTimes;
  }

  /**
   * Prints the leaderboard of the chat identified in the msg object.
   * @param msg The message object from the Telegram api.
   * @param match The regex matched object from the Telegram api.
   * @returns The response.
   */
  public leaderBoard(msg: any, match: any): string {
    return this.chatRegistry.getOrCreateChat(msg.chat.id).generateLeaderboard();
  }

  /**
   * Prints the available commands to the chat identified in the msg object.
   * @param msg The message object from the Telegram api.
   * @param match The regex matched object from the Telegram api.
   * @returns The response.
   */
  public help(msg: any, match: any): string {
    let help = "<b>--- AVAILABLE COMMANDS ---</b>\n";
    this.tgClient.commands.forEach((command) => help += "\n/" + command.name + " - " + command.description);
    return help;
  }

  /**
   * Adds a new dank time to the chat.
   * @param msg The message object from the Telegram api.
   * @param match The regex matched object from the Telegram api.
   * @returns The response.
   */
  public addTime(msg: any, match: any): string {

    // Split string and ensure it contains at least 4 items.
    const split = match.input.split(" ");
    if (split.length < 5) {
      return "Not enough arguments! Format: /addtime [hour] [minute] [points] [text1] [text2] etc.";
    }

    // Identify and verify arguments.
    const hour = Number(split[1]);
    const minute = Number(split[2]);
    const points = Number(split[3]);
    const texts = split.slice(4);
    if (isNaN(hour)) {
      return "The hour must be a number!";
    }
    if (isNaN(minute)) {
      return "The minute must be a number!";
    }
    if (isNaN(points)) {
      return "The points must be a number!";
    }

    // Subscribe new dank time for the chat, replacing any with the same hour and minute.
    try {
      const dankTime = new DankTime(hour, minute, texts, points);
      const chat = this.chatRegistry.getOrCreateChat(msg.chat.id);
      chat.addDankTime(dankTime);

      // Reschedule notifications just to make sure, if applicable.
      if (chat.settings.tryGet("running")) {
        if (chat.settings.tryGet("notifications")) {
          this.scheduler.unscheduleDankTime(chat, dankTime);
          this.scheduler.scheduleDankTime(chat, dankTime);
        }
        if (chat.settings.tryGet("autoleaderboards")) {
          this.scheduler.unscheduleAutoLeaderboard(chat, dankTime);
          this.scheduler.scheduleAutoLeaderboard(chat, dankTime);
        }
      }
      return "Added the new time!";
    } catch (err) {
      return err.message;
    }
  }

  /**
   * Removes a dank time from the chat.
   * @param msg The message object from the Telegram api.
   * @param match The regex matched object from the Telegram api.
   * @returns The response.
   */
  public removeTime(msg: any, match: any): string {

    // Split string and ensure it contains at least 2 items.
    const split = match.input.split(" ");
    if (split.length < 3) {
      return "Not enough arguments! Format: /removetime [hour] [minute]";
    }

    // Identify and verify arguments.
    const hour = Number(split[1]);
    const minute = Number(split[2]);
    if (isNaN(hour)) {
      return "The hour must be a number!";
    }
    if (isNaN(minute)) {
      return "The minute must be a number!";
    }

    // Remove dank time if it exists, otherwise just send an info message.
    const chat = this.chatRegistry.getOrCreateChat(msg.chat.id);
    const dankTime = chat.getDankTime(hour, minute);

    if (dankTime !== null && chat.removeDankTime(hour, minute)) {
      this.scheduler.unscheduleDankTime(chat, dankTime);
      this.scheduler.unscheduleAutoLeaderboard(chat, dankTime);
      return "Removed the time!";
    } else {
      return "No dank time known with that hour and minute!";
    }
  }

  /**
   * Gets the entire release log, formatted neatly.
   * @param msg The message object from the Telegram api.
   * @param match The regex matched object from the Telegram api.
   * @returns The response.
   */
  public getReleaseLog(msg: any, match: any): string {
    let reply = "<b>--- RELEASES ---</b>\n";
    this.releaseLog.forEach((release) => {
      reply += "\n";
      reply += "<b>Version:</b> " + release.version + "\n";
      reply += "<b>Date:</b> " + release.date + "\n";
      reply += "<b>Changes:</b>\n";
      release.changes.forEach((change) => {
        reply += "- " + change + "\n";
      });
    });
    return reply;
  }
}
