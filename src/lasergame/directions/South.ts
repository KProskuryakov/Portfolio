import Direction from "../Direction";
import North from "./North";

export default class South extends Direction {
    public constructor() {
        super("SOUTH", 0, 1);
    }

    public opposite(): Direction {
        return new North();
    }
}