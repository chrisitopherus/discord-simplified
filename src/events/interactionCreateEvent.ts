import { CacheType, CommandInteraction, CommandInteractionOptionResolver, Interaction } from "discord.js";
import { On } from "../decorators/events/event";
import { EventHandler } from "../decorators/events/eventHandler";
import { OptionResolver } from "../commands/optionResolver";
import { DiscordCommandInformation } from "../types/commands";

@EventHandler
export class InteractionCreateHandler {
    @On({
        name: "interactionCreate",
        once: false
    })
    async interactionCreateHandler(interaction: Interaction<CacheType>) {
        if (!interaction.client.commands) return;
        if (!interaction.isChatInputCommand()) return;
        const commandData = interaction.client.commands.get(interaction.commandName);

        if (!commandData) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        if (commandData.whitelist && !commandData.whitelist.ids.includes(interaction.user.id)) {
            await interaction.reply({
                content: commandData.whitelist.messageCreator(interaction),
                ephemeral: commandData.whitelist.ephemeral
            });
            
            return;
        }

        const options = interaction.options as CommandInteractionOptionResolver;
        const resolver = new OptionResolver(options);
        const group = options.getSubcommandGroup();
        try {
            if (group !== null) {
                await this.handleGroupInteraction(commandData, group, options, interaction, resolver);
                return;
            }

            let subcommand: string | undefined;
            try {
                subcommand = options.getSubcommand();
            }
            catch (err) {
                // No subcommands
            }

            if (subcommand !== undefined) {
                await this.handleSubcommandInteraction(commandData, subcommand, interaction, resolver);
                return;
            }

            await this.handleRawInteraction(commandData, interaction, resolver);
        } catch (error: any) {
            console.error(error);
            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true });
                } else {
                    await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
                }
            } catch (err: any) {
                console.error(error);
            }
        }
    }

    async handleRawInteraction(commandInformation: DiscordCommandInformation, interaction: CommandInteraction, resolver: OptionResolver) {
        resolver.resolve(commandInformation.command, commandInformation.options);
        if (commandInformation.command.execute) {
            await commandInformation.command.execute(interaction);
        }
    }

    async handleSubcommandInteraction(commandInformation: DiscordCommandInformation, subCommand: string, interaction: CommandInteraction, resolver: OptionResolver) {
        const subcommandData = commandInformation.subcommands.get(subCommand);
        if (!subcommandData) {
            return;
        }

        if (subcommandData.whitelist && !subcommandData.whitelist.ids.includes(interaction.user.id)) {
            await interaction.reply({
                content: subcommandData.whitelist.messageCreator(interaction),
                ephemeral: subcommandData.whitelist.ephemeral
            });
            
            return;
        }

        resolver.resolve(subcommandData.command, subcommandData.options);
        await subcommandData.command.execute(interaction);
    }

    async handleGroupInteraction(commandInformation: DiscordCommandInformation, group: string, options: CommandInteractionOptionResolver, interaction: CommandInteraction, resolver: OptionResolver) {
        const groupCommandData = commandInformation.groups.get(group);
        if (!groupCommandData) {
            return;
        }

        if (groupCommandData.whitelist && !groupCommandData.whitelist.ids.includes(interaction.user.id)) {
            await interaction.reply({
                content: groupCommandData.whitelist.messageCreator(interaction),
                ephemeral: groupCommandData.whitelist.ephemeral
            });
            
            return;
        }

        let subcommand: string | undefined;
        try {
            subcommand = options.getSubcommand();
        }
        catch (err) {
            // No subcommands
        }

        if (subcommand === undefined) {
            return;
        }

        const subcommandData = groupCommandData.subcommands.get(subcommand);
        if (!subcommandData) {
            return;
        }

        if (subcommandData.whitelist && !subcommandData.whitelist.ids.includes(interaction.user.id)) {
            await interaction.reply({
                content: subcommandData.whitelist.messageCreator(interaction),
                ephemeral: subcommandData.whitelist.ephemeral
            });
            
            return;
        }

        resolver.resolve(subcommandData.command, subcommandData.options);
        await subcommandData.command.execute(interaction);
    }
}