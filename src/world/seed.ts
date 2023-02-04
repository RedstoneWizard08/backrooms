export interface Seed {
    (): number;
    next(): number;
    uint32(): number;
    fract53(): number;
    version: string;
    args: any[];
    exportState(): [number, number, number, number];
    importState(state: [number, number, number, number]): void;
}
