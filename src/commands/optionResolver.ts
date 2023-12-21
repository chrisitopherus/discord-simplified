import { CommandInteractionOptionResolver } from "discord.js";
import { DiscordCommand, DiscordSubcommand, OptionInfo, OptionType } from "../types/commands";

export class OptionResolver {
    constructor(private _options: CommandInteractionOptionResolver) { }

    resolve(command: DiscordCommand | DiscordSubcommand, options: Map<string, OptionInfo>) {
        for (const [prop, option] of options.entries()) {
            const value = this.getOption(prop, option.type);
            command["prop"] = value;
        }
    }

    private getOption(name: string, type: OptionType) {
        switch (type) {
            case "String": return this._options.getString(name);
            case "Number": return this._options.getNumber(name);
            case "Integer": return this._options.getInteger(name);
            case "Boolean": return this._options.getBoolean(name);
            case "Attachment": return this._options.getAttachment(name);
            case "Channel": return this._options.getChannel(name);
            case "Mentionable": return this._options.getMentionable(name);
            case "Role": return this._options.getRole(name);
            case "User": return this._options.getUser(name);
            default: throw new Error("Unknown option type: " + type);
        }
    }
}