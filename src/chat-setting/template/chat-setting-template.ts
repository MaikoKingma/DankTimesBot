import { Chat } from "../../chat/chat";
import { Validation } from "../functions/validation";

/** Describes an arbitrary setting every chat should have. */
export class ChatSettingTemplate<T> {

  /**
   * Constructs a new template. Ensures the default value passes the validator by
   * throwing an error if it does not, as that would be an application-breaking bug.
   * @param name The setting's name, e.g. 'multiplier'.
   * @param description The setting's description, e.g. 'sets the multiplier for the first user to score'.
   * @param defaultValue The setting's default value, e.g. '2'.
   * @param coercer The coercer used for coercing string values to this template's type.
   * @param validator The validator used for validating new values for the setting, e.g. ensuring the value
   * is greater than 1.
   * @param consequence The consequence, if any, for the chat of which a setting is being set.
   * @throws Error if the default value fails validation.
   */
  constructor(public readonly name: string,
              public readonly description: string,
              public readonly defaultValue: T,
              public readonly coercer: ((newValue: string) => T | undefined),
              public readonly validator: ((newValue: T, currentValue?: T) => Validation),
              public readonly consequence?: ((newValue: T, forChat: Chat) => void)) {
    const validation = this.validator(defaultValue);
    if (!validation.success) {
      throw new Error(`Default value does not pass validator! Message: '${validation.message}'`);
    }
  }
}
