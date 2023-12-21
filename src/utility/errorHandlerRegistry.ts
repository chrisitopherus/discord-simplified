import { AnyFunction } from "../types/utility";

/**
 * Represents all possible error types.
 */
export enum ErrorType {
    UnknownCommandInInteraction = 0,
    UnhandledErrorInInteraction = 1
}

export class ErrorHandlerRegistry {
    private static _errorHandlers: Map<ErrorType, (...args: any[]) => unknown> = new Map();

    static register (type: ErrorType, handler: AnyFunction<Promise<void>>) {
        this._errorHandlers.set(type, handler);
    }

    static async call(type: ErrorType, ...args: any[]) {
        const handler = this._errorHandlers.get(type);
        if (!handler) throw new Error("No handler for error type " + type);
        await handler(...args);
    }
}