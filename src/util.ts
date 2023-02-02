import { Group, Vector3 } from "three";
import {
    createClearTile,
    createCornerTile,
    createCrossTile,
    createHalfSplitTile,
    createIntersectionTile,
    createSplitTile,
} from "./models/tiles";

import { World } from "cannon-es";

export const Rotation = {
    UP: new Vector3(),
    RIGHT: new Vector3(0, Math.PI / 2, 0),
    DOWN: new Vector3(0, Math.PI, 0),
    LEFT: new Vector3(0, -Math.PI / 2, 0),
};

export const randomRotation = () => {
    const rots: (keyof typeof Rotation)[] = ["UP", "RIGHT", "DOWN", "LEFT"];

    return Rotation[rots[Math.floor(Math.random() * rots.length)]];
};

export const getReverseRotation = (rot: Vector3) => {
    if (rot == Rotation.UP) return Rotation.DOWN;

    if (rot == Rotation.DOWN) return Rotation.UP;

    if (rot == Rotation.LEFT) return Rotation.RIGHT;

    if (rot == Rotation.RIGHT) return Rotation.LEFT;

    throw new ReferenceError("Unknown rotation!");
};

export type PathTypeT =
    | "HALF_STRAIGHT"
    | "STRAIGHT"
    | "CORNER"
    | "INTERSECTION"
    | "CROSS";

export interface IPathType {
    HALF_STRAIGHT: number;
    STRAIGHT: number;
    CORNER: number;
    INTERSECTION: number;
    CROSS: number;
    CLEAR: number;
}

export const PathType: IPathType = {
    HALF_STRAIGHT: 0,
    STRAIGHT: 1,
    CORNER: 2,
    INTERSECTION: 3,
    CROSS: 4,
    CLEAR: 5,
};

export interface IPathTypeAssociation {
    HALF_STRAIGHT: (world: World) => Promise<Group>;
    STRAIGHT: (world: World) => Promise<Group>;
    CORNER: (world: World) => Promise<Group>;
    INTERSECTION: (world: World) => Promise<Group>;
    CROSS: (world: World) => Promise<Group>;
    CLEAR: (world: World) => Promise<Group>;
}

export const PathTypeAssociation: IPathTypeAssociation = {
    HALF_STRAIGHT: createHalfSplitTile,
    STRAIGHT: createSplitTile,
    CORNER: createCornerTile,
    INTERSECTION: createIntersectionTile,
    CROSS: createCrossTile,
    CLEAR: createClearTile,
};

export const randomType = () => {
    return PathType[
        Object.keys(PathType)[
            Math.floor(Math.random() * Object.keys(PathType).length)
        ] as PathTypeT
    ];
};
