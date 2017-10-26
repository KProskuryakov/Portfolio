import Direction from "./Direction";

export default interface Movable {
    move(dir: Direction): void;
}