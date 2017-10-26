import Direction from "../Direction";

export default class None extends Direction {
    public constructor() {
        super("NONE", 1, 0);
    }

    public opposite(): Direction {
        throw new Error("Direction NONE has no opposite");
    }
}