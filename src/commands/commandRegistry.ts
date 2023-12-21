import { Collection } from "discord.js";
import { CommandClass, CommandInformation, DiscordCommandInformation, OptionInfo, SubcommandClass, SubcommandGroupClass, SubcommandInformation, SubcommandGroupInformation } from "../types/commands";
import { CommandBuilder } from "./commandBuilder";

export interface CommandRegistryItem {
    constructor: CommandClass;
    information: CommandInformation;
    options: Map<string, OptionInfo>;
    subcommands: Map<SubcommandClass, SubcommandRegistryItem>;
    groups: Map<SubcommandGroupClass, SubcommandGroupRegistryItem>,
}

export interface SubcommandRegistryItem {
    constructor: SubcommandClass;
    information: SubcommandInformation;
    options: Map<string, OptionInfo>;
}

export interface SubcommandGroupRegistryItem {
    constructor: SubcommandGroupClass;
    information: SubcommandGroupInformation;
    subcommands: Map<SubcommandClass, SubcommandRegistryItem>;
}

export class CommandRegistry {
    private _commands = new Map<CommandClass, CommandRegistryItem>();
    private _commandBuilder = CommandBuilder;

    registerCommand(command: CommandClass, information: CommandInformation) {
        const cmd = this._commands.get(command);
        if (cmd) {
            cmd.information = information;
        } else {
            this._commands.set(
                command,
                {
                    constructor: command,
                    information,
                    options: new Map(),
                    subcommands: new Map(),
                    groups: new Map()
                });
        }
    }

    registerOption(command: CommandClass, optionKey: string, optionInfo: OptionInfo) {
        const cmd = this._commands.get(command);
        if (!cmd) {
            throw new Error("Encountered option \"" + optionKey + "\" declaration outside of a command.");
        }

        cmd.options.set(optionKey, optionInfo);
    }

    registerSubcommand(command: CommandClass, subcommand: SubcommandClass, subcommandInfo: SubcommandInformation) {
        const cmd = this._commands.get(command);
        if (!cmd) {
            throw new Error("Encountered subcommand \"" + subcommand + "\" which is no part of command " + subcommand + ".");
        }

        cmd.subcommands.set(subcommand, {
            constructor: subcommand,
            information: subcommandInfo,
            options: new Map()
        });
    }

    registerSubcommandOption(command: CommandClass, subcommand: SubcommandClass, optionKey: string, optionInfo: OptionInfo) {
        const cmd = this._commands.get(command);
        if (!cmd) {
            throw new Error("Encountered subcommand \"" + subcommand + "\" which is no part of command " + command + ".");
        }

        const subcmd = cmd.subcommands.get(subcommand);
        if (!subcmd) {
            throw new Error("Encountered option \"" + optionKey + "\" declaration outside of a command.");
        }

        subcmd.options.set(optionKey, optionInfo);
    }

    registerSubcommandGroup(command: CommandClass, group: SubcommandGroupClass, groupInfo: SubcommandGroupInformation) {
        const cmd = this._commands.get(command);
        if (!cmd) {
            throw new Error("Encountered group \"" + group + "\" which is no part of command " + command + ".");
        }

        cmd.groups.set(group, {
            constructor: group,
            information: groupInfo,
            subcommands: new Map()
        });
    }

    registerSubcommandOfGroup(command: CommandClass, group: SubcommandGroupClass, subcommand: SubcommandClass, subcommandInfo: SubcommandInformation) {
        const cmd = this._commands.get(command);
        if (!cmd) {
            throw new Error("Encountered subcommand \"" + subcommand + "\" which is no part of command " + command + ".");
        }

        const groupOfSubcommand = cmd.groups.get(group);
        if (!groupOfSubcommand) {
            throw new Error("Encountered group \"" + group + "\" which is no part of command " + command + ".");
        }
        groupOfSubcommand.subcommands.set(subcommand, {
            constructor: subcommand,
            information: subcommandInfo,
            options: new Map()
        });
    }

    registerSubcommandOptionOfGroup(command: CommandClass, group: SubcommandGroupClass, subcommand: SubcommandClass, optionKey: string, optionInfo: OptionInfo) {
        const cmd = this._commands.get(command);
        if (!cmd) {
            throw new Error("Encountered subcommand \"" + subcommand + "\" which is no part of command " + command + ".");
        }

        const groupOfSubcommand = cmd.groups.get(group);
        if (!groupOfSubcommand) {
            throw new Error("Encountered group \"" + group + "\" which is no part of command " + command + ".");
        }

        const subcmd = groupOfSubcommand.subcommands.get(subcommand);
        if (!subcmd) {
            throw new Error("Encountered option \"" + optionKey + "\" declaration outside of a group.");
        }

        subcmd.options.set(optionKey, optionInfo);
    }

    isRegistered(constructor: CommandClass): boolean {
        return this._commands.has(constructor);
    }

    toDiscordCommands() {
        const collection = new Collection<string, DiscordCommandInformation>();
        for (const [cmd, info] of this._commands.entries()) {
            const command = new cmd();
            const cmdInformation = this._commandBuilder.build(command, info);
            collection.set(cmdInformation.cmd.name, cmdInformation);
        }

        return collection;
    }
}