import { ClientOptions } from "discord.js";
import { CommandClass } from "./commands";
import { EventHandlerClass } from "./events";

/**
 * Defines the bot configuration.
 */
export interface BotConfig {
    client: ClientOptions;
    events?: EventHandlerClass[];
    commands?: CommandClass[];
}