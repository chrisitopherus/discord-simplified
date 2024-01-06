import { Collection, SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandNumberOption, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";
import { DiscordCommand, DiscordCommandInformation, DiscordSubcommandGroupInformation, DiscordSubcommandInformation, OptionInfo, WhitelistInformation } from "../types/commands";
import { CommandRegistryItem, SubcommandRegistryItem, SubcommandGroupRegistryItem } from "./commandRegistry";

interface OptionData {
    prop: string;
    info: OptionInfo;
}

export class CommandBuilder {
    static build(command: DiscordCommand, data: CommandRegistryItem): DiscordCommandInformation {
        const subcommandCollection = new Collection<string, DiscordSubcommandInformation>();
        const groupCollection = new Collection<string, DiscordSubcommandGroupInformation>();
        const cmdBuilder = new SlashCommandBuilder()
            .setName(data.information.name)
            .setDescription(data.information.description);
        for (const option of data.options.entries()) {
            this.createOption(cmdBuilder, { prop: option[0], info: option[1] });
        }

        for (const [subcommand, item] of data.subcommands.entries()) {
            subcommandCollection.set(item.information.name, {
                command: new subcommand(),
                options: item.options
            });

            cmdBuilder.addSubcommand(this.createSubcommand(item));
        }

        for (const [group, groupItem] of data.groups.entries()) {
            const groupSubcommandCollection = new Collection<string, DiscordSubcommandInformation>();

            const groupBuilder = this.createSubcommandGroup(groupItem);
            for (const [subcommand, item] of groupItem.subcommands.entries()) {
                groupSubcommandCollection.set(item.information.name, {
                    command: new subcommand(),
                    options: item.options
                });

                groupBuilder.addSubcommand(this.createSubcommand(item));
            }

            cmdBuilder.addSubcommandGroup(groupBuilder);

            groupCollection.set(groupItem.information.name, {
                command: new group(),
                subcommands: groupSubcommandCollection
            });
        }

        return {
            cmd: cmdBuilder,
            command,
            options: data.options,
            subcommands: subcommandCollection,
            groups: groupCollection,
            whitelist: data.whitelist ? this.transformToRequiredWhitelist(data.whitelist) : undefined
        };
    }

    private static createSubcommand(data: SubcommandRegistryItem) {
        const builder = new SlashCommandSubcommandBuilder()
            .setName(data.information.name)
            .setDescription(data.information.description);
        for (const option of data.options.entries()) {
            this.createOption(builder, { prop: option[0], info: option[1] });
        }

        return builder;
    }

    private static createSubcommandGroup(data: SubcommandGroupRegistryItem) {
        return new SlashCommandSubcommandGroupBuilder()
            .setName(data.information.name)
            .setDescription(data.information.description);
    }

    private static transformToRequiredWhitelist(whitelist: WhitelistInformation): Required<WhitelistInformation> {
        return {
            ids: whitelist.ids,
            messageCreator: whitelist.messageCreator,
            ephemeral: whitelist.ephemeral ? true : false
        };
    }

    private static createOption(cmdBuilder: SlashCommandSubcommandBuilder | SlashCommandBuilder, data: OptionData) {
        switch (data.info.type) {
            case "String": return this.createStringOption(cmdBuilder, data);
            case "Number": return this.createNumberOption(cmdBuilder, data);
            case "Integer": return this.createIntegerOption(cmdBuilder, data);
            case "Boolean": return this.createBooleanOption(cmdBuilder, data);
            case "User": return this.createUserOption(cmdBuilder, data);
            case "Channel": return this.createChannelOption(cmdBuilder, data);
            case "Attachment": return this.createAttachmentOption(cmdBuilder, data);
            case "Mentionable": return this.createMentionableOption(cmdBuilder, data);
            case "Role": return this.createRoleOption(cmdBuilder, data);
            default: throw new Error("Unknown option type");
        }
    }

    private static createStringOption(cmdBuilder: SlashCommandBuilder | SlashCommandSubcommandBuilder, data: OptionData) {
        if (data.info.type !== "String") {
            throw new Error("Only String options are supported.");
        }

        const option = new SlashCommandStringOption()
            .setName(data.prop)
            .setDescription(data.info.description)
            .setRequired(data.info.isRequired);

        if (data.info.choices && data.info.choices.length > 0) {
            option.addChoices(...data.info.choices);
        }

        cmdBuilder.addStringOption(option);
    }

    private static createNumberOption(cmdBuilder: SlashCommandBuilder | SlashCommandSubcommandBuilder, data: OptionData) {
        if (data.info.type !== "Number") {
            throw new Error("Only Number options are supported.");
        }

        const option = new SlashCommandNumberOption()
            .setName(data.prop)
            .setDescription(data.info.description)
            .setRequired(data.info.isRequired);

        if (data.info.min !== undefined) {
            option.setMinValue(data.info.min);
        }

        if (data.info.max !== undefined) {
            option.setMaxValue(data.info.max);
        }

        if (data.info.choices && data.info.choices.length > 0) {
            option.addChoices(...data.info.choices);
        }

        cmdBuilder.addNumberOption(option);
    }

    private static createIntegerOption(cmdBuilder: SlashCommandBuilder | SlashCommandSubcommandBuilder, data: OptionData) {
        if (data.info.type !== "Integer") {
            throw new Error("Only Integer options are supported.");
        }

        const option = new SlashCommandIntegerOption()
            .setName(data.prop)
            .setDescription(data.info.description)
            .setRequired(data.info.isRequired);

        if (data.info.min !== undefined) {
            option.setMinValue(data.info.min);
        }

        if (data.info.max !== undefined) {
            option.setMaxValue(data.info.max);
        }

        if (data.info.choices && data.info.choices.length > 0) {
            option.addChoices(...data.info.choices);
        }

        cmdBuilder.addIntegerOption(option);
    }

    private static createBooleanOption(cmdBuilder: SlashCommandBuilder | SlashCommandSubcommandBuilder, data: OptionData) {
        cmdBuilder.addBooleanOption(option => option
            .setName(data.prop)
            .setDescription(data.info.description)
            .setRequired(data.info.isRequired));
    }

    private static createUserOption(cmdBuilder: SlashCommandBuilder | SlashCommandSubcommandBuilder, data: OptionData) {
        cmdBuilder.addUserOption(option => option
            .setName(data.prop)
            .setDescription(data.info.description)
            .setRequired(data.info.isRequired));
    }

    private static createChannelOption(cmdBuilder: SlashCommandBuilder | SlashCommandSubcommandBuilder, data: OptionData) {
        cmdBuilder.addChannelOption(option => option
            .setName(data.prop)
            .setDescription(data.info.description)
            .setRequired(data.info.isRequired));
    }

    private static createAttachmentOption(cmdBuilder: SlashCommandBuilder | SlashCommandSubcommandBuilder, data: OptionData) {
        cmdBuilder.addAttachmentOption(option => option
            .setName(data.prop)
            .setDescription(data.info.description)
            .setRequired(data.info.isRequired));
    }

    private static createMentionableOption(cmdBuilder: SlashCommandBuilder | SlashCommandSubcommandBuilder, data: OptionData) {
        cmdBuilder.addMentionableOption(option => option
            .setName(data.prop)
            .setDescription(data.info.description)
            .setRequired(data.info.isRequired));
    }

    private static createRoleOption(cmdBuilder: SlashCommandBuilder | SlashCommandSubcommandBuilder, data: OptionData) {
        cmdBuilder.addRoleOption(option => option
            .setName(data.prop)
            .setDescription(data.info.description)
            .setRequired(data.info.isRequired));
    }
}