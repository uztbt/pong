export class UserControl {
    static dict: {[C in Command]: boolean};
    static init(): void {
        this.dict = {
            [Command.UP]: false,
            [Command.DOWN]: false,
            [Command.ENTER]: false,
        };
        window.addEventListener("keydown", this.registerKeyInput(true));
        window.addEventListener("keyup", this.registerKeyInput(false));
    }
    
    private static registerKeyInput(isKeyDown: boolean) {
        return function(e: KeyboardEvent): void {
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
        e.preventDefault();
      }
    }
}

export enum Command {
    UP = "UP",
    DOWN = "DOWN",
    ENTER = "ENTER"
}