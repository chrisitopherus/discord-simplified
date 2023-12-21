import "reflect-metadata";
import { CommandClass, OptionInfo } from "../../types/commands";
import { MetadataKey } from "../../utility/metadata";

/**
 * Marks a property as an option for a command.
 * @param optionInfo Information about the option.
 * @returns Decorator.
 */
export function Option(optionInfo: OptionInfo) {
    return function (target: any, propertyKey: string) {
        Reflect.defineMetadata(MetadataKey.Option, optionInfo, target as CommandClass, propertyKey);
    };
}