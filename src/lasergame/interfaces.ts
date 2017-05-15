import Ending from './classes/ending';

export interface PathsList {
    [index: number]: Array<Ending>;
    length: number;
}