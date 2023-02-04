import {
    Color3,
    CreateBoxVertexData,
    Mesh,
    PhysicsImpostor,
    PointLight,
    Scene,
    Sound,
    StandardMaterial,
    Vector3,
} from "@babylonjs/core";
import { TileConstants } from "../TileConstants";

export class TileLight extends Mesh {
    public lights: PointLight[];
    public audio: Sound;

    public constructor(name: string, scene: Scene, on = true) {
        super(name, scene);

        const vertexData = CreateBoxVertexData({
            width: 4,
            depth: 2,
            height: 1,
        });

        vertexData.applyToMesh(this);

        this.physicsImpostor = new PhysicsImpostor(
            this,
            PhysicsImpostor.BoxImpostor,
            { mass: 0, restitution: 0.9 },
            scene
        );

        const lightMaterial = new StandardMaterial("lightMaterial", scene);
        lightMaterial.diffuseColor = new Color3(
            248 / 255,
            222 / 255,
            126 / 255
        );

        this.material = lightMaterial;
        this.position.y +=
            TileConstants.TILE_HEIGHT - TileConstants.TILE_CEILING_HEIGHT * 1.5;
        this.checkCollisions = true;

        const light = new PointLight(
            this.name + "__lightObject_1",
            new Vector3(0, -1, 0),
            scene
        );

        const light2 = new PointLight(
            this.name + "__lightObject_2",
            new Vector3(6, -1, 0),
            scene
        );

        const light3 = new PointLight(
            this.name + "__lightObject_3",
            new Vector3(-6, -1, 0),
            scene
        );

        const light4 = new PointLight(
            this.name + "__lightObject_4",
            new Vector3(0, -1, 4),
            scene
        );

        light.parent = light2.parent = light3.parent = light4.parent = this;

        light.intensity =
            light2.intensity =
            light3.intensity =
            light4.intensity =
                1;

        this.lights = [light, light2, light3, light4];

        this.Flicker();

        this.audio = new Sound(this.name + "__hum", "/sounds/flourescent.ogg", scene, null, {
            offset: 2,
            length: 10,
            loop: true,
            autoplay: true,
            volume: 0.125,
            spatialSound: true,
            rolloffFactor: 128,
        });

        this.audio.attachToMesh(this);

        if (!on) this.Off();
    }

    public Flicker() {
        const timeout = (Math.random() * 64 * 1000) + 180000;

        setTimeout(this.OnFlicker.bind(this), timeout);
    }

    public OnFlicker() {
        if (this.isOn) {
            this.Off();
        }

        setTimeout(this.FinishFlicker.bind(this), 200);
    }

    public FinishFlicker(again = true) {
        if (!this.isOn) {
            this.On();
        }

        if (again) this.Flicker();
    }

    public get isOn() {
        let isOn = false;

        for (const light of this.lights) {
            if (light.intensity > 0)
                isOn = true;
        }

        return isOn;
    }

    public On() {
        for (const light of this.lights) {
            light.intensity = 1;
        }

        this.audio.play();
    }

    public Off() {
        for (const light of this.lights) {
            light.intensity = 0;
        }

        this.audio.stop();
    }
}
