type DirectionName = "NORTH" | "EAST" | "SOUTH" | "WEST" | "NONE";

export default class Location {
    public static dir() {

    }

    public constructor(
        private readonly x: number,
        private readonly y: number,
    ) {}
}