import Direction from "../Direction";
import East from "./East";

export default class West extends Direction {
    public constructor() {
        super("WEST", 1, 0);
    }

    public opposite(): Direction {
        return new East();
    }
}