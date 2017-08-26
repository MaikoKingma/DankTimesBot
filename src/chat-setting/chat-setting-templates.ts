import { DankTimeScheduler } from "../dank-time-scheduler/dank-time-scheduler";
import { ChatSettingTemplate } from "./chat-setting-template";
import * as coercers from "./coercers";
import { Consequences } from "./consequences";
import * as validators from "./validators";

// This file contains all ChatSettingTemplates used by ChatSettings to create settings from.

// To add a new Chat setting, all you need to do is add a new entry in this file. At most,
// you will have to create a validator function, and if you want to parse a string value
// to something more exotic than a number, boolean, or timezone, a coercer function as well.

export class ChatSettingTemplates {

  private readonly consequences: Consequences;
  // tslint:disable-next-line:member-ordering
  public readonly templates: Array<ChatSettingTemplate<any>> = [

    new ChatSettingTemplate("autoleaderboards", "Whether a leaderboard is posted 1 minute after every dank time",
      true, coercers.toBoolean, validators.autoLeaderboards, this.consequences.autoLeaderboards),

    new ChatSettingTemplate("firstnotifications", "Whether the first user to score is announced",
      true, coercers.toBoolean, validators.firstNotifications),

    new ChatSettingTemplate("hardcoremode", "Whether users who haven't scored in the last 24 hours are punished",
      false, coercers.toBoolean, validators.hardcoreMode),

    new ChatSettingTemplate("modifier", "Multiplier applied to the score of the first user to score",
      2, coercers.toNumber, validators.modifier),

    new ChatSettingTemplate("notifications", "Whether notifications are sent for dank times",
      true, coercers.toBoolean, validators.notifications, this.consequences.notifications),

    new ChatSettingTemplate("randomtimepoints", "Points random dank times are worth",
      10, coercers.toWholeNumber, validators.pointsPerRandomTime, this.consequences.pointsPerRandomTime),

    new ChatSettingTemplate("randomtimefrequency", "Number of random dank times to generate each day",
      1, coercers.toWholeNumber, validators.dailyRandomFrequency, this.consequences.dailyRandomFrequency),

    new ChatSettingTemplate("running", "Whether the bot is running",
      false, coercers.toBoolean, validators.running, this.consequences.running),

    new ChatSettingTemplate("timezone", "Timezone users are in",
      "Europe/Amsterdam", coercers.toTimezone, validators.timezone, this.consequences.timezone),
  ];

  constructor(consequences: Consequences | DankTimeScheduler) {
    this.consequences = consequences instanceof Consequences ? consequences : new Consequences(consequences);
  }
}
