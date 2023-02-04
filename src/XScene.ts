import { Scene } from "@babylonjs/core";

export abstract class XScene extends Scene {
    public async Preload() {
        // This is blank to let others fill this in, but it's optional.
    }

    public Init() {
        // This is where scenes will create objects.
    }

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public Update(deltaTime: number) {
        // Called on each frame update.

        this.render();
    }

    public ToggleDebug() {
        if (this.debugLayer.isVisible())
            this.debugLayer.hide();
        else this.debugLayer.show();
    }
}
