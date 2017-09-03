import { Chat } from "../../chat/chat";
import { ChatSettings } from "../chat-settings";
import { ChatSettingTemplate } from "./chat-setting-template";

// This file contains all ChatSettingTemplates used by ChatSettings to create settings from.

// To add a new Chat setting, all you need to do is add a new entry in this file. At most,
// you will have to create a validator function, and if you want to parse a string value
// to something more exotic than a number, boolean, or timezone, a coercer function as well.

export class ChatSettingTemplates {

  public readonly templates: Array<ChatSettingTemplate<any>>;

  constructor(templates?: Array<ChatSettingTemplate<any>>) {
    this.templates = templates ? templates : [];
  }

  public createSettings(forChat: Chat): ChatSettings {
    
  }
}
