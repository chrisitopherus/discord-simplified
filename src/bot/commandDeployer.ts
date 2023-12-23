import { Collection, REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";
import { DiscordCommandInformation } from "../types/commands";

export class CommandDeployer {
    private readonly _commands: RESTPostAPIChatInputApplicationCommandsJSONBody[];
    constructor(commands: Collection<string, DiscordCommandInformation>) {
        this._commands = this.commandsToJSON(commands);
    }

    async deploy(info: { token: string, clientId: string, guildId?: string }) {
        // Construct and prepare an instance of the REST module
        const rest = new REST().setToken(info.token);
        try {
            console.info(`Started refreshing ${this._commands.length} application (/) commands.`);

            let data: unknown[] = [];

            if (info.guildId) {
                data = await rest.put(
                    Routes.applicationGuildCommands(info.clientId, info.guildId),
                    { body: this._commands },
                ) as unknown[];
            } else {
                data = await rest.put(
                    Routes.applicationCommands(info.clientId),
                    { body: this._commands },
                ) as unknown[];
            }

            console.info(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    }

    private commandsToJSON(commands: Collection<string, DiscordCommandInformation>) {
        const jsonCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
        for (const [, info] of commands) {
            jsonCommands.push(info.cmd.toJSON());
        }

        return jsonCommands;
    }
}