import { PluginEventArguments } from "../plugin-event-arguments";
import { Chat } from "../../../chat/chat";

export class TimerTickPluginEventArguments extends PluginEventArguments
{
  /**
   * Timer Tick event.
   */
  constructor(_hostChat: Chat)
  {
    super(_hostChat);
  }
}