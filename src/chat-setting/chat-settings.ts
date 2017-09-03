import { Chat } from "../chat/chat";
import { ChatSetting } from "./chat-setting";
import { Validation } from "./functions/validation";
import { ChatSettingTemplate } from "./template/chat-setting-template";

/** Represents a single chat's settings. */
export class ChatSettings {

  /** This ChatSetting's settings. */
  public readonly settings = new Map<string, ChatSetting<any>>();

  constructor(settings: Array<ChatSetting<any>>) {
    settings.forEach((setting) => {
      this.settings.set(setting.template.name, setting);
    });
  }

  /**
   * Attempts to set the value of the setting with the supplied name. Will fail if any
   * of the following are true, otherwise will succeed:
   * - The setting is not known;
   * - The value does not pass the setting's coercer or its validator.
   * @param settingName The name of the setting to set the value of.
   * @param value The value to set the setting to.
   */
  public trySetFromString(settingName: string, value: string): Validation {
    const setting = this.settings.get(settingName);
    if (!setting) {
      return { success: false, message: "This setting does not exist!" };
    }
    return setting.trySetFromString(value);
  }

  /**
   * Used by JSON.stringify. Returns a literal representation of this.
   */
  public toJSON(): any {
    const json: any = {};
    this.settings.forEach((setting) => {
      json[setting.template.name] = setting.value;
    });
    return json;
  }

  /**
   * Attempts to get the value of the setting with the supplied name. Returns
   * undefined if the setting does not exist, though this should never happen.
   * @param settingName The name of the setting to get the value of.
   */
  public tryGet(settingName: string): any {
    const setting = this.settings.get(settingName);
    if (setting === undefined) {
      return undefined;
    }
    return setting.value;
  }
}
