export enum Command {
    UP = "UP",
    DOWN = "DOWN",
    ENTER = "ENTER",
    MOVE = "MOVE"
}
export class UserControl {
    static dict: {[C in Command]: boolean};
    static ongoingTouch: {identifier: number, clientX: number, clientY: number} | undefined;
    static init(): void {
        UserControl.dict = {
            [Command.UP]: false,
            [Command.DOWN]: false,
            [Command.ENTER]: false,
            [Command.MOVE]: false
        };
        // UserControl.ongoingTouch = undefined
        document.addEventListener("DOMContentLoaded", () => {
            document.addEventListener("keydown", UserControl.registerKeyInput(true));
            document.addEventListener("keyup", UserControl.registerKeyInput(false));
            
            const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
            canvas.addEventListener("touchstart", UserControl.handleTouchStart, false);
            canvas.addEventListener("touchend", UserControl.handleTouchEnd, false);
            // canvas.addEventListener("touchcancel", handleCancel, false);
            canvas.addEventListener("touchmove", UserControl.handleTouchMove, false);     
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
            case "Enter":
                UserControl.dict[Command.ENTER] = isKeyDown;
                break;
            }
        }
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