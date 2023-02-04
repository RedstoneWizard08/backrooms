import {
    AmmoJSPlugin,
    Engine,
    FreeCamera,
    Vector3,
} from "@babylonjs/core";
// import { TileChunk } from "../world/tile/TileChunk";

import { XScene } from "../XScene";

export class MainScene extends XScene {
    public constructor(engine: Engine) {
        super(engine);

        const gravity = new Vector3(0, -9.81, 0);
        const ammo = new AmmoJSPlugin();

        this.enablePhysics(gravity, ammo);
    }

    public Init() {
        const camera = new FreeCamera("camera1", new Vector3(34, 32, -64), this);

        camera.setTarget(new Vector3(34, 26, -50));
        camera.attachControl(this.getEngine().getRenderingCanvas(), true);
        camera.checkCollisions = true;

        // const chunk = new TileChunk("chunk", this, "hlfbscr4wieodsn");
        
        // window.addEventListener("click", () => chunk.Generate());
    }
}
