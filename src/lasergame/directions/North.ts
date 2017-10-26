import Direction from "../Direction";
import South from "./South";

export default class North extends Direction {
    public constructor() {
        super("NORTH", 0, -1);
    }

    public opposite(): Direction {
        return new South();
    }
}
