import "reflect-metadata";
import { EventHandlerClass } from "../../types/events";
import { MetadataKey } from "../../utility/metadata";

/**
 * Marks a class as an event handler for discord events.
 * @param constructor The class.
 */
export function EventHandler(constructor: EventHandlerClass) {
    Reflect.defineMetadata(MetadataKey.EventHandler, "EventHandler", constructor);
}