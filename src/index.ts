// decorators
export { Command } from "./decorators/commands/command";
export { Subcommand } from "./decorators/commands/subCommand";
export { Group } from "./decorators/commands/group";
export { Option } from "./decorators/commands/option";
export { On } from "./decorators/events/event";
export { EventHandler } from "./decorators/events/eventHandler";

// error handling
export { ErrorType } from "./utility/errorHandlerRegistry";
export type { InteractionErrorHandler } from "./types/bot";

// helpers
export type { DiscordCommand, DiscordSubcommand, DiscordSubcommandGroup } from "./types/commands";

// bot
export { Bot } from "./bot/bot";
export type { BotConfig } from "./types/bot";