import { Mesh, Scene, Vector3 } from "@babylonjs/core";

export abstract class Tile extends Mesh {
    public constructor(name: string, scene: Scene, position = Vector3.Zero()) {
        super(name, scene);

        this.CreateChildren();
        this.position.copyFrom(position);
    }

    public abstract CreateChildren(): void;
}
