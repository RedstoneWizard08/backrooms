import { Scene, Vector3 } from "three";
import { Box } from "./models/BoxTile";
import { PathType, randomRotation, randomType, Rotation } from "./util";
import { World } from "cannon-es";

export const isInsideXZ = (
    x: number,
    minX: number,
    maxX: number,
    z: number,
    minZ: number,
    maxZ: number
) => {
    return x >= minX && x <= maxX && z >= minZ && z <= maxZ;
};

export class BoxManager {
    public boxes: Box[];
    public scene: Scene;
    public debug = false;
    public world: World;

    public x: number;
    public z: number;

    public constructor(scene: Scene, world: World, x: number, z: number) {
        this.scene = scene;
        this.boxes = [];

        this.x = x;
        this.z = z;

        this.world = world;

        this.boxes.push(
            new Box(
                new Vector3(x, 0, z),
                randomType(),
                randomRotation(),
                this.world
            )
        );
    }

    public getUngeneratedBoxes() {
        const ungenerated: Box[] = [];

        for (const box of this.boxes) {
            if (!box.generated) ungenerated.push(box);
        }

        return ungenerated;
    }

    private findPos() {
        let x = this.x;
        let z = this.z;

        let found = true;

        while (found) {
            x += 16;
            z += 16;

            if (
                this.boxes.find((v) => v.position.x == x && v.position.z == z)
            ) {
                found = true;
            } else {
                found = false;
            }
        }

        return new Vector3(x, 0, z);
    }

    public generateBlanks() {
        const positions = [];

        for (let x = this.x; x < (this.x + 10) * 16; x += 16) {
            for (let z = this.z; z < (this.z + 10) * 16; z += 16) {
                if (Math.random() >= 0.6) positions.push(new Vector3(x, 0, z));
            }
        }

        for (const pos of positions) {
            if (
                !this.boxes.find(
                    (v) => v.position.x == pos.x && v.position.z == pos.z
                )
            ) {
                this.boxes.push(
                    new Box(pos, randomType(), randomRotation(), this.world)
                );
            }
        }
    }

    public generateFinalBlanks() {
        const positions = [];

        for (let x = this.x; x < (this.x + 10) * 16; x += 16) {
            for (let z = this.z; z < (this.z + 10) * 16; z += 16) {
                positions.push(new Vector3(x, 0, z));
            }
        }

        for (const pos of positions) {
            if (
                !this.boxes.find(
                    (v) => v.position.x == pos.x && v.position.z == pos.z
                )
            ) {
                this.boxes.push(
                    new Box(pos, PathType.CLEAR, Rotation.UP, this.world)
                );
            }
        }
    }

    public generate() {
        console.log("Generating blanks...");

        this.generateBlanks();

        console.log("Generating boxes...");

        while (this.boxes.length < 10 * 10) {
            console.log("boxes: " + this.boxes.length);

            if (this.getUngeneratedBoxes().length <= 0) {
                this.boxes.push(
                    new Box(
                        this.findPos(),
                        randomType(),
                        randomRotation(),
                        this.world
                    )
                );
                continue;
            }

            for (const box of this.getUngeneratedBoxes()) {
                if (box.neighbors.length == 0) {
                    box.generateNeighbors(this);

                    this.boxes.push(
                        ...box.neighbors.filter((v) =>
                            isInsideXZ(
                                v.position.x,
                                this.x,
                                this.x + 10,
                                v.position.z,
                                this.z,
                                this.z + 10
                            )
                        )
                    );
                }
            }
        }

        console.log("Generating final blanks...");

        this.generateFinalBlanks();

        console.log("boxes: " + this.boxes.length);
        console.log("Done!");
    }

    public async render() {
        for (const box of this.boxes) {
            await box.draw();

            if (!box.parent) this.scene.add(box);

            if (this.debug) box.drawConnections();
        }
    }
}
