import "reflect-metadata";
import { SubcommandGroupClass, SubcommandGroupInformation } from "../../types/commands";
import { MetadataKey } from "../../utility/metadata";

/**
 * Marks the class as a subcommand group.
 * @param commandInfo Information about the subcommand group.
 * @returns Decorator.
 */
export function Group(commandInfo: SubcommandGroupInformation) {
    return function (constructor: SubcommandGroupClass) {
        Reflect.defineMetadata(MetadataKey.SubCommandGroup, commandInfo, constructor);
    };
}