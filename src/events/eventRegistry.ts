import { EventHandler, EventHandlerClass, EventInformation,  } from "../types/events";
export interface EventRegistryItem {
    instance: EventHandler;
    events: Map<string, EventInformation>;
}

export class EventRegistry {
    private _events = new Map<EventHandlerClass, EventRegistryItem>();
    registerEventHandler(constructor: EventHandlerClass) {
        const event = this._events.get(constructor);
        if (!event) {
            this._events.set(constructor, { instance: new constructor(), events: new Map() });
        }
    }

    registerEvent(constructor: EventHandlerClass, eventKey: string, eventInfo: EventInformation) {
        const event = this._events.get(constructor);
        if (!event) {
            throw new Error("Encountered event \"" + eventKey + "\" declaration outside of a command.");
        }

        event.events.set(eventKey, eventInfo);
    }

    isRegistered(constructor: EventHandlerClass): boolean {
        return this._events.has(constructor);
    }

    toDiscordEvents() {
        const events: EventInformation[] = [];
        for (const item of this._events.entries()) {
            for (const event of item[1].events.entries()) {
                events.push(event[1]);
            }
        }

        return events;
    }
}