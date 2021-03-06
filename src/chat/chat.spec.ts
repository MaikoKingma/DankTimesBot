import { assert } from "chai";
import "mocha";
import * as moment from "moment-timezone";
import { User } from "../user/user";
import * as util from "../util/util";
import { Chat } from "./chat";

describe("Chat.hardcoreModeCheck", () => {
  const now = moment().unix();
  const nowMinus24Hours = now - (24 * 60 * 60);
  const nowMinusAlmost24Hours = nowMinus24Hours + 1;

  it("should not punish a user if hardcore mode is disabled", () => {
    const startingScore = 10;
    const user = new User(0, "user0", startingScore, nowMinus24Hours, false, 0);
    const users = new Map<number, User>();
    users.set(user.id, user);
    const chat = new Chat(0, "Europe/Amsterdam", true, 0, 10, 0, 0, users, [], [], false, 2, false, false, false);
    chat.hardcoreModeCheck(now);
    assert.equal(user.score, startingScore);
  });

  it("should not punish a user if hardcore mode is enabled but he scored in the last 24 hours", () => {
    const startingScore = 10;
    const user = new User(0, "user0", startingScore, nowMinusAlmost24Hours, false, 0);
    const users = new Map<number, User>();
    users.set(user.id, user);
    const chat = new Chat(0, "Europe/Amsterdam", true, 0, 10, 0, 0, users, [], [], false, 2, false, false, true);
    chat.hardcoreModeCheck(now);
    assert.equal(user.score, startingScore);
  });

  it("should punish a user if hardcore mode is enabled and he did not score in the last 24 hours", () => {
    const user = new User(0, "user0", 10, nowMinus24Hours, false, 0);
    const users = new Map<number, User>();
    users.set(user.id, user);
    const chat = new Chat(0, "Europe/Amsterdam", true, 0, 10, 0, 0, users, [], [], false, 2, false, false, true);
    chat.hardcoreModeCheck(now);
    assert.equal(user.score, 0);
  });
});

describe("Chat.generateRandomDankTimes", () => {

  it("should generate correct # of random dank times with correct hours, minutes, and texts", () => {
    const chat = new Chat(0);
    chat.numberOfRandomTimes = 10;
    chat.pointsPerRandomTime = 10;

    chat.generateRandomDankTimes().forEach((time) => {
      assert.isAtLeast(time.hour, 0);
      assert.isAtMost(time.hour, 23);
      assert.isAtLeast(time.minute, 0);
      assert.isAtMost(time.minute, 59);
      assert.equal(time.points, chat.pointsPerRandomTime);
      assert.equal(time.texts[0], util.padNumber(time.hour) + util.padNumber(time.minute));
    });
  });
});
