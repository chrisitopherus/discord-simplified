import { CommandClass, CommandInformation, OptionInfo, SubcommandGroupClass, SubcommandGroupInformation, SubcommandInformation } from "../types/commands";
import { MetadataKey } from "../utility/metadata";
import { CommandRegistry } from "./commandRegistry";
export class CommandLoader {
    static load(commands: CommandClass[]) {
        const cmdRegistry = new CommandRegistry();

        commands.forEach((commandClass) => {
            const commandInfo = Reflect.getMetadata(MetadataKey.Command, commandClass) as CommandInformation;
            if (!commandInfo) {
                throw new Error("Encountered unknown (unmarked) command: " + commandClass);
            }

            const command = new commandClass();

            // Register the command
            cmdRegistry.registerCommand(commandClass, commandInfo);

            // Load options
            Object.getOwnPropertyNames(command).forEach((prop) => {
                const optionInfo = Reflect.getMetadata(MetadataKey.Option, command, prop) as OptionInfo;
                if (optionInfo) {
                    cmdRegistry.registerOption(commandClass, prop, optionInfo);
                }
            });

            // Load subcommands
            this.loadSubcommands(cmdRegistry, commandClass, commandInfo);

            // Load groups
            this.loadSubcommandGroups(cmdRegistry, commandClass, commandInfo);
        });

        return cmdRegistry;
    }

    private static loadSubcommands(cmdRegistry: CommandRegistry, commandClass: CommandClass, commandInfo: CommandInformation) {
        if (commandInfo.subcommands === undefined) return;
        commandInfo.subcommands.forEach((subcommandClass) => {
            const subCommandInfo = Reflect.getMetadata(MetadataKey.SubCommand, subcommandClass) as SubcommandInformation;
            if (!subCommandInfo) {
                throw new Error("Encountered unknown (unmarked) subcommand: " + subcommandClass);
            }

            const command = new subcommandClass();
            // Register the command
            cmdRegistry.registerSubcommand(commandClass, subcommandClass, subCommandInfo);

            // Load options
            Object.getOwnPropertyNames(command).forEach((prop) => {
                const optionInfo = Reflect.getMetadata(MetadataKey.Option, command, prop);
                if (optionInfo) {
                    cmdRegistry.registerSubcommandOption(commandClass, subcommandClass, prop, optionInfo);
                }
            });
        });
    }

    private static loadSubcommandsOfGroup(cmdRegistry: CommandRegistry, commandClass: CommandClass, groupClass: SubcommandGroupClass, groupInfo: SubcommandGroupInformation) {
        groupInfo.subcommands.forEach((subcommandClass) => {
            const subCommandInfo = Reflect.getMetadata(MetadataKey.SubCommand, subcommandClass) as SubcommandInformation;
            if (!subCommandInfo) {
                throw new Error("Encountered unknown (unmarked) subcommand: " + subcommandClass);
            }

            const command = new subcommandClass();
            // Register the command
            cmdRegistry.registerSubcommandOfGroup(commandClass, groupClass, subcommandClass, subCommandInfo);

            // Load options
            Object.getOwnPropertyNames(command).forEach((prop) => {
                const optionInfo = Reflect.getMetadata(MetadataKey.Option, command, prop) as OptionInfo;
                if (optionInfo) {
                    cmdRegistry.registerSubcommandOptionOfGroup(commandClass, groupClass, subcommandClass, prop, optionInfo);
                }
            });
        });
    }

    private static loadSubcommandGroups(cmdRegistry: CommandRegistry, commandClass: CommandClass, commandInfo: CommandInformation) {
        if (commandInfo.groups === undefined) return;
        commandInfo.groups.forEach((groupClass) => {
            const groupInfo = Reflect.getMetadata(MetadataKey.SubCommandGroup, groupClass) as SubcommandGroupInformation;
            if (!groupInfo) {
                throw new Error("Encountered unknown (unmarked) group: " + groupClass);
            }

            // register group
            cmdRegistry.registerSubcommandGroup(commandClass, groupClass, groupInfo);

            this.loadSubcommandsOfGroup(cmdRegistry, commandClass, groupClass, groupInfo);
        });
    }
}