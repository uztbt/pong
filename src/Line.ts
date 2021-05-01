import { Drawable } from "./Drawable";
import { Players } from "./Players";

export class Line extends Drawable {}

export class EndLine extends Line {
    ownedBy: Players
    constructor (x: number, y: number, w: number, h: number, ownedBy: Players) {
        super(x, y, w, h);
        this.ownedBy = ownedBy;
    }
}