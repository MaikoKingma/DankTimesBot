import { ChatSettingTemplate } from "./chat-setting-template";
import * as coercers from "./coercers";
import * as validators from "./validators";

// This file contains all ChatSettingTemplates used by ChatSettings to create settings from.

export const ChatSettingTemplates: Array<ChatSettingTemplate<any>> = [

  new ChatSettingTemplate("autoleaderboards",
    "Whether a leaderboard is posted 1 minute after every dank time",
    true, validators.autoLeaderboards, coercers.toBoolean),

  new ChatSettingTemplate("firstnotifications", "Whether the first user to score is announced",
    true, validators.firstNotifications, coercers.toBoolean),

  new ChatSettingTemplate("hardcoreMode", "Whether users who haven't scored in the last 24 hours are punished",
    false, validators.hardcoreMode, coercers.toBoolean),

  new ChatSettingTemplate("modifier", "Multiplier applied to the score of the first user to score",
    2, validators.modifier, coercers.toNumber),

  new ChatSettingTemplate("notifications", "Whether notifications are sent for dank times",
    true, validators.notifications, coercers.toBoolean),

  new ChatSettingTemplate("randomtimepoints", "Points random dank times are worth",
    10, validators.pointsPerRandomTime, coercers.toWholeNumber),

  new ChatSettingTemplate("randomtimefrequency", "Number of random dank times to generate each day",
    1, validators.dailyRandomFrequency, coercers.toWholeNumber),

  new ChatSettingTemplate("running", "Whether the bot is running",
    false, validators.running, coercers.toBoolean),

  new ChatSettingTemplate("timezone", "Timezone users are in", "Europe/Amsterdam",
    validators.timezone, coercers.toTimezone),
];
