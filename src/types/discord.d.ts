import "discord.js";
import { Collection } from "discord.js";
import { DiscordCommandInformation } from "./commands";

declare module "discord.js" {
    interface Client {
        /**
        * Stores the commands as a collection of commands.
        */
        commands?: Collection<string, DiscordCommandInformation>;
    }
}