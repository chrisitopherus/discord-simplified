import "reflect-metadata";
import { CommandClass, CommandInformation } from "../../types/commands";
import { MetadataKey } from "../../utility/metadata";

/**
 * Marks the class as a command.
 * @param commandInfo Information about the command.
 * @returns Decorator.
 */
export function Command(commandInfo: CommandInformation) {
    return function (constructor: CommandClass) {
        Reflect.defineMetadata(MetadataKey.Command, commandInfo, constructor);
    };
}