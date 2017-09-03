import { Chat } from "../../chat/chat";
import { DankTimeScheduler } from "../../dank-time-scheduler/dank-time-scheduler";

/**
 * Contains consequences for some of the default chat settings.
 */
export class Consequences {

  constructor(private readonly scheduler: DankTimeScheduler) {
  }

  public autoLeaderboards(newValue: boolean, chat: Chat): void {
    if (newValue && chat.settings.tryGet("running")) {
      this.scheduler.scheduleAutoLeaderboardsOfChat(chat);
    } else {
      this.scheduler.unscheduleAutoLeaderboardsOfChat(chat);
    }
  }

  public dailyRandomFrequency(newValue: number, chat: Chat): void {
    chat.randomDankTimes.splice(newValue);

    if (chat.settings.tryGet("running")) {
      this.scheduler.unscheduleRandomDankTimesOfChat(chat);
      this.scheduler.scheduleRandomDankTimesOfChat(chat);

      if (chat.settings.tryGet("autoleaderboards")) {
        this.scheduler.unscheduleAutoLeaderboardsOfChat(chat);
        this.scheduler.scheduleAutoLeaderboardsOfChat(chat);
      }
    }
  }

  public notifications(newValue: boolean, chat: Chat): void {
    if (newValue && chat.settings.tryGet("running")) {
      this.scheduler.scheduleDankTimesOfChat(chat);
    } else {
      this.scheduler.unscheduleDankTimesOfChat(chat);
    }
  }

  public pointsPerRandomTime(newValue: number, chat: Chat): void {
    chat.randomDankTimes.forEach((time) => {
      time.points = newValue;
    });
  }

  public running(newValue: boolean, chat: Chat): void {
    if (newValue) {
      this.scheduler.scheduleAllOfChat(chat);
    } else {
      this.scheduler.unscheduleAllOfChat(chat);
    }
  }

  public timezone(newValue: string, chat: Chat): void {
    this.scheduler.unscheduleAllOfChat(chat);
    this.scheduler.scheduleAllOfChat(chat);
  }
}
