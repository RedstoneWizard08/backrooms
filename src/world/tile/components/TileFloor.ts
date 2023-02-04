import {
    Color3,
    CreateBoxVertexData,
    Mesh,
    PhysicsImpostor,
    Scene,
    StandardMaterial,
} from "@babylonjs/core";

import { TileConstants } from "../TileConstants";

export class TileFloor extends Mesh {
    public constructor(name: string, scene: Scene) {
        super(name, scene);

        const vertexData = CreateBoxVertexData({
            width: TileConstants.TILE_WIDTH,
            depth: TileConstants.TILE_DEPTH,
            height: TileConstants.TILE_FLOOR_HEIGHT,
        });

        vertexData.applyToMesh(this);

        const groundMaterial = new StandardMaterial("groundMaterial", scene);

        groundMaterial.diffuseTexture = TileConstants.GetFloorTexture(scene);
        groundMaterial.diffuseColor = new Color3(1, 1, 1);

        this.material = groundMaterial;

        this.physicsImpostor = new PhysicsImpostor(
            this,
            PhysicsImpostor.BoxImpostor,
            { mass: 0, restitution: 0.9 },
            scene
        );
    }
}
