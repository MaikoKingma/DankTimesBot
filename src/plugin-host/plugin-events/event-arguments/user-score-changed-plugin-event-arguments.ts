import { BasicUser } from "../../../user/basic-user";
import { PluginEventArguments } from "../plugin-event-arguments";
import { Chat } from "../../../chat/chat";

/**
 * Event Arguments for the User Score Changed event.
 * Contains user and delta score.
 */
export class UserScoreChangedPluginEventArguments extends PluginEventArguments
{
  /**
   * User that changed score.
   */
  public readonly User: BasicUser;
  /**
   * Change in score.
   */
  public readonly ChangeInScore: number;

  /**
   * Constructor.
   * @param _user User that changed score.
   * @param _changeInScore Delta score.
   */
  constructor(_hostChat: Chat, _user: BasicUser, _changeInScore: number)
  {
    super(_hostChat);
    this.User = _user;
    this.ChangeInScore = _changeInScore;
  }
}