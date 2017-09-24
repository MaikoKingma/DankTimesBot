import { AbstractPlugin } from "./plugin/plugin";
import { PLUGIN_EVENT } from "./plugin-events/plugin-event-types";
import { PrePostMessagePluginEventArguments } from "./plugin-events/event-arguments/pre-post-message-plugin-event-arguments";
import { UserScoreChangedPluginEventArguments } from "./plugin-events/event-arguments/user-score-changed-plugin-event-arguments";
import { LeaderboardResetPluginEventArguments } from "./plugin-events/event-arguments/leaderboard-reset-plugin-event-arguments";
import { TimerTickPluginEventArguments } from "./plugin-events/event-arguments/timer-tick-plugin-event-arguments";
import { LeaderboardLine } from "../leaderboard/leaderboard-line";
import { LeaderboardEditPluginEventArguments } from "./plugin-events/event-arguments/leaderboard-edit-plugin-event-arguments";

/**
 * Class exposing the Plugin Host concept.
 * Plugins are managed by a Plugin Host, which controls
 * messaging to, from and between plugins. It also
 * keeps track of the general state of a plugin.
 */
export class PluginHost
{
  /**
   * Collection of plugins currently running.
   */
  public readonly Plugins: AbstractPlugin[];

  /**
   * Create a new Plugin Host.
   * The Plugin Host will not by itself try and
   * find compatible plugins. Instead, it requests
   * a list of plugins to be provided.
   * @param _plugins List of plugins this PluginHost should manage.
   */
  constructor(_plugins: AbstractPlugin[]) 
  {
    this.Plugins = _plugins;

    // Activate all plugins until a mechanism to enable/disable has been created.
    this.Plugins.forEach(plugin => plugin.Enabled = true);
  }

  /* Overload List */
  public Trigger(_event: PLUGIN_EVENT.PLUGIN_EVENT_PRE_MESSAGE, _input: PrePostMessagePluginEventArguments): string[];
  public Trigger(_event: PLUGIN_EVENT.PLUGIN_EVENT_POST_MESSAGE, _input: PrePostMessagePluginEventArguments): string[];
  public Trigger(_event: PLUGIN_EVENT.PLUGIN_EVENT_USER_CHANGED_SCORE, _input: UserScoreChangedPluginEventArguments): string[];
  public Trigger(_event: PLUGIN_EVENT.PLUGIN_EVENT_LEADERBOARD_RESET, _input: LeaderboardResetPluginEventArguments): string[];
  public Trigger(_event: PLUGIN_EVENT.PLUGIN_EVENT_TIMER_TICK, _input: TimerTickPluginEventArguments): string[];
  public Trigger(_event: PLUGIN_EVENT.PLUGIN_EVENT_LEADERBOARD_EDIT, _input: LeaderboardEditPluginEventArguments): LeaderboardLine[];
  /**
   * Trigger a certain event on this Plugin Host's plugins.
   * @param _event Event to trigger.
   * @param _input Data input.
   */
  public Trigger(_event: PLUGIN_EVENT, _input: any): any
  {
    switch (_event)
    {
      case PLUGIN_EVENT.PLUGIN_EVENT_LEADERBOARD_EDIT:
      {
        console.log("case leaderbaord edit");
        return (<LeaderboardLine[]>[]).concat(this.Plugins.map(output => output.Trigger(_event, _input)));
      }
      default:
      {
        return (<string[]>[]).concat(this.Plugins.map(output => output.Trigger(_event, _input)));
      }
    }
  }
}