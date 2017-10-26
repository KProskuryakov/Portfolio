import Direction from "../Direction";
import West from "./West";

export default class East extends Direction {
    public constructor() {
        super("EAST", 1, 0);
    }

    public opposite(): Direction {
        return new West();
    }
}