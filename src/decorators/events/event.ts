import { ClientEvents } from "discord.js";
import { DiscordEventHandler, EventHandler, EventInformation, EventInformationForDecorator } from "../../types/events";
import { MetadataKey } from "../../utility/metadata";

/**
 * Marks a method as an event handler.
 * @param eventName The name of the event that is handled.
 * @returns Decorator.
 */
export function On<K extends keyof ClientEvents = keyof ClientEvents>(eventInfo: EventInformationForDecorator<K>) {
    return function (target: EventHandler, propertyKey: string, descriptor: TypedPropertyDescriptor<DiscordEventHandler<K>>) {
        // Ensure the method has the correct signature
        const method = descriptor.value as DiscordEventHandler | undefined;
        if (!method) {
            throw new Error(`Method ${propertyKey} does not exist on ${target.constructor.name}`);
        }

        Reflect.defineMetadata(
            MetadataKey.OnEvent,
            {
                name: eventInfo.name,
                methodKey: propertyKey,
                once: eventInfo.once,
                handler: method,
                owner: target
            } satisfies EventInformation,
            target,
            propertyKey);
    };
}