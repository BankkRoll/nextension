/// <reference types="node" />
declare function initialize(): Promise<void>;
declare class CustomError extends Error {
    code: string;
    message: string;
    constructor(code: string, message: string);
}
declare function createError(code: string, message: string): CustomError;
type Spinner = NodeJS.Timeout;
declare function log(message: string, type?: 'info' | 'error' | 'warning' | 'spinner' | 'success' | 'highlight', spinner?: Spinner): void;
declare function createSpinner(text: string): Spinner;
declare function stopSpinner(spinner: Spinner): void;
declare function clearConsole(): void;
declare function pressAnyKeyToContinue(prompt?: string): Promise<void>;
export { CustomError, createError, log, createSpinner, stopSpinner, clearConsole, pressAnyKeyToContinue, initialize };
