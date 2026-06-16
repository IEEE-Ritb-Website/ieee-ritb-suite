import chalk from "chalk";

export function oraMock(text: string) {
    return new Spinner(text);
}

export class Spinner {
    private text: string;
    private isTTY = process.stdout.isTTY;
    private interval: NodeJS.Timeout | null = null;
    private frameIndex = 0;
    private frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

    constructor(text: string) {
        this.text = text;
    }

    start() {
        if (this.isTTY) {
            process.stdout.write(`\r⠋ ${this.text}`);
            this.interval = setInterval(() => {
                this.frameIndex = (this.frameIndex + 1) % this.frames.length;
                process.stdout.write(`\r${this.frames[this.frameIndex]} ${this.text}`);
            }, 80);
        } else {
            console.log(chalk.yellow(`[RUNNING] ${this.text}...`));
        }
        return this;
    }

    succeed(text?: string) {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        const finalMsg = text || this.text;
        if (this.isTTY) {
            process.stdout.write(`\r\x1b[K${chalk.green("✔")} ${finalMsg}\n`);
        } else {
            console.log(chalk.green(`✔ ${finalMsg}`));
        }
    }

    fail(text?: string) {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        const finalMsg = text || this.text;
        if (this.isTTY) {
            process.stdout.write(`\r\x1b[K${chalk.red("✖")} ${finalMsg}\n`);
        } else {
            console.log(chalk.red(`✖ ${finalMsg}`));
        }
    }
}

export class StepLogger {
    private currentStep = 0;
    private steps: string[];
    private title: string;
    private isTTY = process.stdout.isTTY;
    private spinnerInterval: NodeJS.Timeout | null = null;
    private frameIndex = 0;
    private spinnerFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

    constructor(title: string, steps: string[]) {
        this.title = title;
        this.steps = steps;
        
        console.log(chalk.cyan.bold(`\n🚀 ${this.title}\n`));
        if (this.isTTY) {
            this.drawChecklist();
        }
    }

    private drawChecklist() {
        for (let i = 0; i < this.steps.length; i++) {
            if (i === this.currentStep) {
                const frame = this.spinnerInterval ? this.spinnerFrames[this.frameIndex] : "[-]";
                console.log(chalk.yellow(`  ${frame} ${this.steps[i]}`));
            } else if (i < this.currentStep) {
                console.log(chalk.green(`  ✔ ${this.steps[i]}`));
            } else {
                console.log(chalk.gray(`  [ ] ${this.steps[i]}`));
            }
        }
        console.log("");
    }

    private clearChecklist() {
        if (!this.isTTY) return;
        const lines = this.steps.length + 1;
        process.stdout.write(`\x1b[${lines}A\x1b[J`);
    }

    private updateActiveStepSpinner() {
        if (!this.isTTY || this.currentStep >= this.steps.length) return;
        const frame = this.spinnerFrames[this.frameIndex];
        const linesUp = (this.steps.length + 1) - this.currentStep;
        process.stdout.write(
            `\x1b[${linesUp}A` +
            `\r` +
            `\x1b[K` +
            chalk.yellow(`  ${frame} ${this.steps[this.currentStep]}`) +
            `\r` +
            `\x1b[${linesUp}B`
        );
    }

    startNextStep() {
        const stepName = this.steps[this.currentStep];
        if (this.isTTY) {
            this.clearChecklist();
            this.drawChecklist();
            if (!this.spinnerInterval) {
                this.frameIndex = 0;
                this.spinnerInterval = setInterval(() => {
                    this.frameIndex = (this.frameIndex + 1) % this.spinnerFrames.length;
                    this.updateActiveStepSpinner();
                }, 80);
            }
        } else {
            console.log(chalk.yellow(`[RUNNING] ${stepName}...`));
        }
    }

    succeedStep() {
        if (this.spinnerInterval) {
            clearInterval(this.spinnerInterval);
            this.spinnerInterval = null;
        }
        
        if (this.isTTY) {
            this.clearChecklist();
            this.currentStep++;
            this.drawChecklist();
        } else {
            const stepName = this.steps[this.currentStep];
            console.log(chalk.green(`  ✔ ${stepName} completed`));
            this.currentStep++;
        }
    }

    failStep(errorMsg: string) {
        if (this.spinnerInterval) {
            clearInterval(this.spinnerInterval);
            this.spinnerInterval = null;
        }
        
        const stepName = this.steps[this.currentStep];
        if (this.isTTY) {
            this.clearChecklist();
            for (let i = 0; i < this.steps.length; i++) {
                if (i === this.currentStep) {
                    console.log(chalk.red(`  ✖ ${this.steps[i]} (Failed: ${errorMsg})`));
                } else if (i < this.currentStep) {
                    console.log(chalk.green(`  ✔ ${this.steps[i]}`));
                } else {
                    console.log(chalk.gray(`  [ ] ${this.steps[i]}`));
                }
            }
            console.log("");
        } else {
            console.log(chalk.red(`  ✖ ${stepName} failed: ${errorMsg}`));
        }
    }
}
