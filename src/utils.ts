let kleur: any;
let cliSpinners: any;
import readline from 'readline';

async function initialize() {
    const importPromises = [
        import('kleur').then((kleurModule) => kleur = kleurModule),
        import('cli-spinners').then((cliSpinnersModule) => cliSpinners = cliSpinnersModule),
    ];

    try {
        await Promise.all(importPromises);
    } catch (error) {
        console.error('Failed to import modules:', error);
    }
}

class CustomError extends Error {
    constructor(public code: string, public message: string) {
        super(message);
    }
}

function createError(code: string, message: string): CustomError {
    return new CustomError(code, message);
}

let frameIndex = 0;
type Spinner = NodeJS.Timeout;

function log(message: string, type: 'info' | 'error' | 'warning' | 'spinner' | 'success' | 'highlight' = 'info', spinner?: Spinner) {
    const timestamp = new Date().toLocaleTimeString();
    const largeSpinnerFrame = cliSpinners.dots.frames[frameIndex] + ' ' + cliSpinners.dots.frames[frameIndex] + ' ' + cliSpinners.dots.frames[frameIndex];
    switch (type) {
        case 'info':
            console.log(kleur.blue(`[${timestamp} INFO]: ${message}`));
            break;
        case 'error':
            console.error(kleur.red(`[${timestamp} ERROR]: ${message}`));
            break;
        case 'warning':
            console.warn(kleur.yellow(`[${timestamp} WARNING]: ${message}`));
            break;
        case 'success':
            console.log(kleur.green(`[${timestamp} SUCCESS]: ${message}`));
            break;
        case 'highlight':
            console.log(kleur.magenta().bold(`[${timestamp} LOG]: ${message}`));
            break;
        case 'spinner':
            process.stdout.write(`\r${kleur.cyan().bold(message)} ${largeSpinnerFrame}`);
            frameIndex = (frameIndex + 1) % cliSpinners.dots.frames.length;
            break;
    }
}

function createSpinner(text: string): Spinner {
    return setInterval(() => {
        log(kleur.magenta().bold(text), 'spinner');
    }, cliSpinners.dots.interval);
}


function stopSpinner(spinner: Spinner) {
    clearInterval(spinner);
}

function clearConsole() {
    process.stdout.write('\x1Bc');
}

function pressAnyKeyToContinue(prompt = 'Press any key to continue...'): Promise<void> {
    return new Promise(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(prompt, () => {
            rl.close();
            resolve();
        });
    });
}

export { CustomError, createError, log, createSpinner, stopSpinner, clearConsole, pressAnyKeyToContinue, initialize };
