import { EventHandlerClass, EventInformation } from "../types/events";
import { MetadataKey } from "../utility/metadata";
import { EventRegistry } from "./eventRegistry";
export class EventLoader {
    static load(eventHandlers: EventHandlerClass[]) {
        const eventRegistry = new EventRegistry();

        eventHandlers.forEach((eventHandlerClass) => {
            const handlerInfo = Reflect.getMetadata(MetadataKey.EventHandler, eventHandlerClass) as string;
            if (!handlerInfo) {
                throw new Error("Encountered unknown (unmarked) handler: " + eventHandlerClass);
            }

            const eventHandler = new eventHandlerClass();

            // Register the event handler
            eventRegistry.registerEventHandler(eventHandlerClass);

            const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(eventHandler));
            // Load events
            methods.forEach((prop) => {
                const eventInfo = Reflect.getMetadata(MetadataKey.OnEvent, eventHandler, prop) as EventInformation;
                if (eventInfo) {
                    eventRegistry.registerEvent(eventHandlerClass, eventInfo.name, eventInfo);
                }
            });

        });

        return eventRegistry;
    }
}