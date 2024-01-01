import { Collection, CommandInteraction, SlashCommandBuilder } from "discord.js";
/**
 * Defines the structure of a discord slash command handler.
 */
export type DiscordCommandHandler = (interaction: CommandInteraction) => Promise<any>;

/**
 * Defines the structure of discord commands.
 */
export interface DiscordCommand {
    [option: string]: any;
    execute?: DiscordCommandHandler;
}

/**
 * Defines the structure of discord subcommands.
 */
export interface DiscordSubcommand {
    [option: string]: any;
    execute: DiscordCommandHandler;
}

/**
 * Defines the structure of discord subcommand groups.
 */
export interface DiscordSubcommandGroup { }

/**
 * Defines the information about a command.
 */
export interface CommandInformation {
    /**
     * Name of the command.
     */
    name: string;
    /**
     * Description of the command.
     */
    description: string;
    /**
     * Specify subcommands for the command.
     */
    subcommands?: SubcommandClass[];
    /**
     * Specify subcommand groups for the command.
     */
    groups?: SubcommandGroupClass[];
    /**
     * Specify a whitelist for the commands.
     */
    whitelist?: WhitelistInformation;
}

/**
 * Represents a whitelist for a command.
 */
export interface WhitelistInformation {
    /**
     * Specify ids that are allowed to use the command.
     */
    ids: string[];
    /**
     * Specify the message creator for interaction that are not whitelisted.
     */
    messageCreator: WhitelistMessageCreator;
    /**
     * Specify if the message should be sent as an `Ephemeral` response.
     */
    ephemeral?: boolean;
}

/**
 * Represents a message creator for interaction that are not whitelisted.
 */
export type WhitelistMessageCreator = (interaction: CommandInteraction) => string;

/**
 * Defines the information about a subcommand.
 */
export interface SubcommandInformation {
    name: string;
    description: string;
}

/**
 * Defines the information about a subcommand group.
 */
export interface SubcommandGroupInformation {
    name: string;
    description: string;
    subcommands: SubcommandClass[];
}

/**
 * Defines all available option types.
 */
export type OptionType = "String" | "Integer" | "Boolean" | "Number" | "User" | "Channel" | "Role" | "Mentionable" | "Attachment";

/**
 * Defines the base option information that is common to all.
 */
export interface BaseOptionInfo {
    description: string;
    isRequired: boolean;
}

/**
 * Defines the structure of an option choice.
 */
export interface OptionChoice<Type extends string | number> {
    name: string;
    value: Type;
}

/**
 * Defines the structure of an option with optional choices.
 */
export interface StringOptionInfo extends BaseOptionInfo {
    type: "String";
    choices?: OptionChoice<string>[];
}

/**
 * Defines the structure of an option with optional choices.
 */
export interface NumberOptionInfo extends BaseOptionInfo {
    type: "Number";
    choices?: OptionChoice<number>[];
}

/**
 * Defines the structure of an option with optional choices.
 */
export interface IntegerOptionInfo extends BaseOptionInfo {
    type: "Integer";
    choices?: OptionChoice<number>[];
}

type OptionInfoWithChoices = StringOptionInfo | NumberOptionInfo | IntegerOptionInfo;


/**
 * Defines the structure of an option without choices.
 */
export interface OptionInfoWithoutChoices extends BaseOptionInfo {
    type: "Boolean" | "User" | "Channel" | "Role" | "Mentionable" | "Attachment";
}

/**
 * Defines the information about an option.
 */
export type OptionInfo = OptionInfoWithChoices | OptionInfoWithoutChoices;

/**
 * Defines the structure of an command class.
 */
export type CommandClass = new () => DiscordCommand;

/**
 * Defines the structure of an subcommand class.
 */
export type SubcommandClass = new () => DiscordSubcommand;

/**
 * Defines the structure of an subcommand group class.
 */
export type SubcommandGroupClass = new () => DiscordSubcommandGroup;

/**
 * Defines the information about the finished discord command.
 */
export interface DiscordCommandInformation {
    cmd: SlashCommandBuilder;
    options: Map<string, OptionInfo>;
    command: DiscordCommand;
    subcommands: Collection<string, DiscordSubcommandInformation>;
    groups: Collection<string, DiscordSubcommandGroupInformation>;
    whitelist: Required<WhitelistInformation> | undefined;
}

/**
 * Defines the information about the finished discord subcommand.
 */
export interface DiscordSubcommandInformation {
    options: Map<string, OptionInfo>;
    command: DiscordSubcommand;
}

/**
 * Defines the information about the finished discord subcommand group.
 */
export interface DiscordSubcommandGroupInformation {
    command: DiscordSubcommandGroup;
    subcommands: Collection<string, DiscordSubcommandInformation>;
}