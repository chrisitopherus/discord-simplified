import { CacheType, ChatInputCommandInteraction, ClientOptions } from "discord.js";
import { CommandClass } from "./commands";
import { EventHandlerClass } from "./events";
import { ErrorType } from "../utility/errorHandlerRegistry";

/**
 * Defines the signature of an interaction error handler.
 */
export type InteractionErrorHandler = (interaction: ChatInputCommandInteraction<CacheType>, type: ErrorType, error: Error) => Promise<void>;

/**
 * Defines the bot configuration.
 */
export interface BotConfig {
    client: ClientOptions;
    interactionCreateErrorHandler?: InteractionErrorHandler;
    events?: EventHandlerClass[];
    commands?: CommandClass[];
}