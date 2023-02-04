import {
    Color3,
    CreateBoxVertexData,
    Mesh,
    PhysicsImpostor,
    Scene,
    StandardMaterial,
} from "@babylonjs/core";
import { TileConstants } from "../TileConstants";

export class TileWall extends Mesh {
    public constructor(name: string, scene: Scene, length = 16) {
        super(name, scene);

        const vertexData = CreateBoxVertexData({
            width: 1,
            depth: length,
            height: TileConstants.TILE_WALL_HEIGHT,
        });

        vertexData.applyToMesh(this);

        const wallMaterial = new StandardMaterial("wallMaterial", scene);

        wallMaterial.diffuseTexture = TileConstants.GetWallTexture(scene);
        wallMaterial.diffuseColor = new Color3(1, 1, 1);

        this.material = wallMaterial;

        this.physicsImpostor = new PhysicsImpostor(
            this,
            PhysicsImpostor.BoxImpostor,
            { mass: 0, restitution: 0.9 },
            scene
        );

        this.position.y += TileConstants.TILE_WALL_HEIGHT / 2 + 0.5;

        this.checkCollisions = true;
    }
}
