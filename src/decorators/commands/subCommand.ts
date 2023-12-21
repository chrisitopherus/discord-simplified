import "reflect-metadata";
import { SubcommandClass, SubcommandInformation } from "../../types/commands";
import { MetadataKey } from "../../utility/metadata";

/**
 * Marks the class as a subcommand.
 * @param commandInfo Information about the subcommand.
 * @returns Decorator.
 */
export function Subcommand(commandInfo: SubcommandInformation) {
    return function (constructor: SubcommandClass) {
        Reflect.defineMetadata(MetadataKey.SubCommand, commandInfo, constructor);
    };
}