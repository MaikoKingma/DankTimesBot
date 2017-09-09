import { Chat } from "../../chat/chat";

/**
 * Plugin Event Messages are used to communicate data
 * between a Plugin Host and its associated plugins.
 */
export abstract class PluginEventArguments
{
  /**
   * Chat associated with this plugin's plugin host.
   */
  public readonly HostChat: Chat;

  constructor(_hostChat: Chat)
  {
    this.HostChat = _hostChat;
  }
}
