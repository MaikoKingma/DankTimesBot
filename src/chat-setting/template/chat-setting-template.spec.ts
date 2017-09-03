import { assert } from "chai";
import "mocha";
import { Chat } from "../../chat/chat";
import { Validation } from "../functions/validation";
import { ChatSettingTemplate } from "./chat-setting-template";

function testValidator(newValue: number, oldValue: number): Validation {
  if (newValue === 5) {
    return { success: true, message: "successMessage" };
  }
  return { success: false, message: "errorMessage" };
}

function testCoercer(newValue: string): number | undefined {
  return 5;
}

function testConsequence(newValue: number, forChat: Chat): void {
  // Do nothing.
}

describe("ChatSettingTemplate.constructor", () => {

  it("Should correctly instantiate a new instance.", () => {
    const template = new ChatSettingTemplate("newsetting", "newdescription", 5, testCoercer, testValidator,
      testConsequence);
  });

  it("Should throw an error if the default value fails validation.", () => {
    assert.throws(() => new ChatSettingTemplate("newsetting", "newdescription", 10, testCoercer, testValidator,
      testConsequence));
  });
});
