import { Collection, Client } from "discord.js";
import { CommandRegistry } from "../commands/commandRegistry";
import { BotConfig } from "../types/bot";
import { CommandLoader } from "../commands/commandLoader";
import { DiscordCommandInformation } from "../types/commands";
import { EventLoader } from "../events/eventLoader";
import { EventRegistry } from "../events/eventRegistry";
import { InteractionCreateHandler } from "../events/interactionCreateEvent";
import { ErrorHandlerRegistry, ErrorType } from "../utility/errorHandlerRegistry";
import { CommandDeployer } from "./commandDeployer.js";
/**
 * Wrapper for discord.js's Client class.
 */
export class Bot {
    public readonly client: Client;
    public commands: Collection<string, DiscordCommandInformation> | undefined;
    private readonly _commandDeployer: CommandDeployer | undefined;
    private readonly _configuration: BotConfig;
    private readonly _cmdLoader = CommandLoader;
    private readonly _eventLoader = EventLoader;
    private _commandRegistry: CommandRegistry | undefined;
    private _eventRegistry: EventRegistry | undefined;
    private readonly _errorHandlerRegistry = ErrorHandlerRegistry;

    public constructor(configuration: BotConfig) {
        this._configuration = configuration;
        this.client = new Client(this._configuration.client);
        if (this._configuration.commands) {
            this._commandRegistry = this._cmdLoader.load(this._configuration.commands);
            this.initializeCommands();
            if (this.commands) {
                this._commandDeployer = new CommandDeployer(this.commands);
            }
        }

        const events = [InteractionCreateHandler];
        if (this._configuration.events) {
            this._eventRegistry = this._eventLoader.load([...this._configuration.events, ...events]);
            this.initializeEvents();
        }

        if (configuration.interactionCreateErrorHandler) {
            this._errorHandlerRegistry.register(ErrorType.UnhandledErrorInInteraction, configuration.interactionCreateErrorHandler);
            this._errorHandlerRegistry.register(ErrorType.UnknownCommandInInteraction, configuration.interactionCreateErrorHandler);
        }
    }

    /**
     * Tries to login with the specified token.
     * @param token The bot's discord token.
     * @returns Whether the login was successful.
     */
    public async login(token: string) {
        return await this.client.login(token);
    }

    /**
     * Deploys the commands of the bot.
     * @param info The needed information about the deployment.
     */
    public async deploy(info: { token: string, clientId: string, guildId?: string }) {
        if (this._commandDeployer === undefined) {
            throw new Error("Bot has no valid commands.");
        }

        await this._commandDeployer.deploy(info);
    }

    /**
     * Initializing event binding.
     */
    private initializeEvents() {
        const events = this._eventRegistry?.toDiscordEvents();
        if (!events) return;
        for (const event of events) {
            if (event.once) {
                this.client.once(event.name, event.handler.bind(event.owner));
            } else {
                this.client.on(event.name, event.handler.bind(event.owner));
            }
        }
    }

    /**
     * Initializing the commands for later usage.
     */
    private initializeCommands() {
        this.commands = this._commandRegistry?.toDiscordCommands();
        if (!this.commands) return;

        this.client.commands = this.commands;

    }
}