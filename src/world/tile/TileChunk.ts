import { createNoise3D, NoiseFunction3D } from "simplex-noise";
import { Scene, TransformNode, Vector2, Vector3 } from "@babylonjs/core";
import Alea from "alea";
import { Seed } from "../seed";
import { DefaultSettings, getTileType } from "./Generator";

export class TileChunk extends TransformNode {
    public size: Vector2;
    public seed: string;
    public realSeed: Seed;
    public noise: NoiseFunction3D;

    public constructor(
        name: string,
        scene: Scene,
        seed: string,
        size = new Vector2(4, 4)
    ) {
        super(name, scene);

        this.size = size;
        this.seed = seed;
        this.realSeed = Alea(seed);
        this.noise = createNoise3D(this.realSeed);
    }

    public Generate() {
        const offsetX = this.position.x;
        const offsetZ = this.position.z;

        for (let x = 0; x < this.size.x; x++) {
            for (let z = 0; z < this.size.y; z++) {
                const ox = x + offsetX;
                const oz = z + offsetZ;

                const aox = x * 16 + offsetX;
                const aoz = z * 16 + offsetZ;

                const pos = new Vector3(aox, 0, aoz);
                const value = this.noise(ox, performance.now(), oz);

                console.log("Generating at: [" + ox + ", " + oz + "]");

                const tile = getTileType(
                    this.getScene(),
                    DefaultSettings,
                    value,
                    pos
                );

                tile.parent = this;
            }
        }
    }
}
