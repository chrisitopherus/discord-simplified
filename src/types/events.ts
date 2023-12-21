import { ClientEvents } from "discord.js";

/**
 * Defines the structure of an event handler. (All objects are valid.)
 */
export interface EventHandler { }

/**
 * Defines the structure of an event handler. (All classes are valid.)
 */
export type EventHandlerClass = new () => EventHandler;

/**
 * Defines the structure of the handler signature based on the event.
 */
export type DiscordEventHandler<T extends keyof ClientEvents = keyof ClientEvents> = (...args: ClientEvents[T]) => Promise<void>;

/**
 * Defines the information about an event.
 */
export interface EventInformation {
    name: keyof ClientEvents;
    once: boolean;
    methodKey: string;
    handler: DiscordEventHandler;
    owner: EventHandler;
}

/**
 * Defines the information about an event for an decorator setup.
 */
export interface EventInformationForDecorator<K extends keyof ClientEvents = keyof ClientEvents> {
    name: K;
    once: boolean;
}