import { Drawable } from "./Drawable";
import { Players } from "./Players";

export class Line extends Drawable {}

export class EndLine extends Line {
    ownedBy: Players
    constructor (w: number, h: number, x: number, y: number, ownedBy: Players) {
        super(w, h, x, y);
        this.ownedBy = ownedBy;
    }
}