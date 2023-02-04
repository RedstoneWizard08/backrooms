import { Scene, Vector3 } from "@babylonjs/core";
import { TileCorner } from "./tiles/TileCorner";
import { TileCross } from "./tiles/TileCross";
import { TileEmpty } from "./tiles/TileEmpty";
import { TileHalfWall } from "./tiles/TileHalfWall";
import { TileIntersection } from "./tiles/TileIntersection";
import { TileSplit } from "./tiles/TileSplit";

export type Range = [number, number];

export interface GeneratorSettings {
    halfWallTile: Range;
    splitTile: Range;
    cornerTile: Range;
    crossTile: Range;
    intersectionTile: Range;
    emptyTile: Range;
}

export const DefaultSettings: GeneratorSettings = {
    /**
     * [ ] [ ] [ ]
     * [ ] [-] [ ]
     * [ ] [+] [ ]
     */
    halfWallTile: [0.0, 0.3],

    /**
     * [ ] [+] [ ]
     * [ ] [+] [ ]
     * [ ] [+] [ ]
     */
    splitTile: [0.3, 0.5],

    /**
     * [ ] [ ] [ ]
     * [ ] [+] [+]
     * [ ] [+] [ ]
     */
    cornerTile: [0.5, 0.7],

    /**
     * [ ] [+] [ ]
     * [ ] [+] [+]
     * [ ] [+] [ ]
     */
    crossTile: [0.7, 0.8],

    /**
     * [ ] [+] [ ]
     * [+] [+] [+]
     * [ ] [+] [ ]
     */
    intersectionTile: [0.8, 0.9],

    /**
     * [ ] [ ] [ ]
     * [ ] [ ] [ ]
     * [ ] [ ] [ ]
     */
    emptyTile: [0.9, 1],
};

export const getTileType = (
    scene: Scene,
    settings: GeneratorSettings,
    noiseValue: number,
    position: Vector3
) => {
    if (
        noiseValue > settings.halfWallTile[0] &&
        noiseValue <= settings.halfWallTile[1]
    )
        return new TileHalfWall(crypto.randomUUID(), scene, position);

    if (
        noiseValue > settings.splitTile[0] &&
        noiseValue <= settings.splitTile[1]
    )
        return new TileSplit(crypto.randomUUID(), scene, position);

    if (
        noiseValue > settings.cornerTile[0] &&
        noiseValue <= settings.cornerTile[1]
    )
        return new TileCorner(crypto.randomUUID(), scene, position);

    if (
        noiseValue > settings.crossTile[0] &&
        noiseValue <= settings.crossTile[1]
    )
        return new TileCross(crypto.randomUUID(), scene, position);

    if (
        noiseValue > settings.intersectionTile[0] &&
        noiseValue <= settings.intersectionTile[1]
    )
        return new TileIntersection(crypto.randomUUID(), scene, position);

    return new TileEmpty(crypto.randomUUID(), scene, position);
};
