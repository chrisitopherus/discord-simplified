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
            // Error Handler
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
                await this.handlesubcommandInteraction(commandData, subcommand, interaction, resolver);
                return;
            }

            await this.handleRawInteraction(commandData, interaction, resolver);
        } catch (err: any) {
            // Error Handling
            throw new Error(err.message);
        }
    }

    async handleRawInteraction(commandInformation: DiscordCommandInformation, interaction: CommandInteraction, resolver: OptionResolver) {
        resolver.resolve(commandInformation.command, commandInformation.options);
        if (commandInformation.command.execute) {
            await commandInformation.command.execute(interaction);
        } else {
            // Error Handler
        }
    }

    async handlesubcommandInteraction(commandInformation: DiscordCommandInformation, subCommand: string, interaction: CommandInteraction, resolver: OptionResolver) {
        const subCommandData = commandInformation.subcommands.get(subCommand);
        if (!subCommandData) {
            // Error Handler
            return;
        }

        resolver.resolve(subCommandData.command, subCommandData.options);
        await subCommandData.command.execute(interaction);
    }

    async handleGroupInteraction(commandInformation: DiscordCommandInformation, group: string, options: CommandInteractionOptionResolver, interaction: CommandInteraction, resolver: OptionResolver) {
        const groupCommandData = commandInformation.groups.get(group);
        if (!groupCommandData) {
            // Error Handler
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
            // Error Handler
            return;
        }

        const subcommandData = groupCommandData.subcommands.get(subcommand);
        if (!subcommandData) {
            // Error Handler
            return;
        }

        resolver.resolve(subcommandData.command, subcommandData.options);
        await subcommandData.command.execute(interaction);
    }
}