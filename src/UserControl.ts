export enum Command {
    UP = "UP",
    DOWN = "DOWN",
    LEFT = "LEFT",
    RIGHT = "RIGHT",
    ENTER = "ENTER",
    MOVE = "MOVE"
}
export class UserControl {
    static dict: {[C in Command]: boolean};
    static ongoingTouch: {identifier: number, clientX: number, clientY: number} | undefined;
    static scaleValue: number;
    static init(): void {
        UserControl.dict = {
            [Command.UP]: false,
            [Command.DOWN]: false,
            [Command.LEFT]: false,
            [Command.RIGHT]: false,
            [Command.ENTER]: false,
            [Command.MOVE]: false
        };
        document.addEventListener("DOMContentLoaded", () => {
            document.addEventListener("keydown", UserControl.registerKeyInput(true));
            document.addEventListener("keyup", UserControl.registerKeyInput(false));
            const canvas = document.getElementById("game-canvas");
            canvas?.addEventListener("touchstart", this.handleTouchCanvas);
            
            const upArrow = document.getElementById("up-arrow") as HTMLImageElement;
            const downArrow = document.getElementById("down-arrow") as HTMLImageElement;
            if (upArrow !== null && downArrow !== null) {
                upArrow.addEventListener("touchstart", this.handleTouchUpArrowStart);
                upArrow.addEventListener("touchend", this.handleTouchUpArrowEnd);
                downArrow.addEventListener("touchstart", this.handleTouchDownArrowStart);
                downArrow.addEventListener("touchend", this.handleTouchDownArrowEnd);
            }
            const playerSlider = document.getElementById("playerSlider") as HTMLInputElement;
            if (playerSlider !== null) {
                UserControl.dict[Command.MOVE] = true;
                playerSlider.addEventListener("input", this.handleSliderInput);
                this.scaleValue = Number.parseInt(playerSlider.value, 10);
            }
        });
    }
    
    private static registerKeyInput(isKeyDown: boolean) {
        return function(e: KeyboardEvent): void {
            e.preventDefault();
            switch (e.key) {
            case "ArrowUp":
                UserControl.dict[Command.UP] = isKeyDown;
                break;
            case "ArrowDown":
                UserControl.dict[Command.DOWN] = isKeyDown;
                break;
            case "ArrowLeft":
                UserControl.dict[Command.LEFT] = isKeyDown;
                break;
            case "ArrowRight":
                UserControl.dict[Command.RIGHT] = isKeyDown;
                break;
            case "Enter":
                UserControl.dict[Command.ENTER] = isKeyDown;
                break;
            }
        }
    }

    private static handleTouchCanvas(event: TouchEvent) {
        event.preventDefault();
        UserControl.dict[Command.ENTER] = true;
    }

    private static handleTouchUpArrowStart(event: TouchEvent) {
        event.preventDefault();
        UserControl.dict[Command.UP] = true;
        UserControl.dict[Command.ENTER] = true;
    }

    private static handleTouchUpArrowEnd(event: TouchEvent) {
        event.preventDefault();
        UserControl.dict[Command.UP] = false;
        UserControl.dict[Command.ENTER] = false;
    }

    private static handleTouchDownArrowStart(event: TouchEvent) {
        event.preventDefault();
        UserControl.dict[Command.DOWN] = true;
        UserControl.dict[Command.ENTER] = true;
    }

    private static handleTouchDownArrowEnd(event: TouchEvent) {
        event.preventDefault();
        UserControl.dict[Command.DOWN] = false;
        UserControl.dict[Command.ENTER] = false;
    }

    private static handleSliderInput(event: Event) {
        event.preventDefault();
        const target = event.target as HTMLInputElement;
        const scaleValue = Number.parseInt(target.value, 10);
        console.log(`scaleValue = ${scaleValue}`);
        UserControl.scaleValue = scaleValue;
    }

    private static handleTouchStart(event: TouchEvent) {
        event.preventDefault();
        const touch = event.changedTouches[0];
        UserControl.ongoingTouch = {
            identifier: touch.identifier,
            clientX: touch.clientX,
            clientY: touch.clientY
        };
        UserControl.dict[Command.MOVE] = true;
        UserControl.dict[Command.ENTER] = true;
    }

    private static handleTouchEnd(event: TouchEvent) {
        event.preventDefault();
        UserControl.ongoingTouch = undefined;
        // UserControl.dict[Command.UP] = false;
        // UserControl.dict[Command.DOWN] = false;
        UserControl.dict[Command.MOVE] = false;
        UserControl.dict[Command.ENTER] = false;
    }

    private static handleTouchMove(event: TouchEvent) {
        event.preventDefault();
        const touch = event.changedTouches[0];
        if (UserControl.ongoingTouch === undefined) {
            return;
        }
        if (touch.clientY < UserControl.ongoingTouch.clientY - 5) {
            UserControl.ongoingTouch = {
                identifier: touch.identifier,
                clientX: touch.clientX,
                clientY: touch.clientY
            }
        } else if (touch.clientY > UserControl.ongoingTouch.clientY + 5) {
            UserControl.ongoingTouch = {
                identifier: touch.identifier,
                clientX: touch.clientX,
                clientY: touch.clientY
            }
        }
    }
}