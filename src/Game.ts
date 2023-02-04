import { Engine } from "@babylonjs/core";
import Ammo from "ammojs-typed";
import { XScene } from "./XScene";

export type SceneMap = Record<string, XScene>;
export type UninitializedSceneMap = Record<string, typeof XScene>;

export class Game {
    public uninitializedScenes: UninitializedSceneMap;
    public scenes: SceneMap;
    public currentScene?: XScene;

    public engine: Engine;

    private Ammo: typeof Ammo;

    public constructor(scenes: UninitializedSceneMap) {
        this.uninitializedScenes = scenes;
        this.scenes = {};

        this.Attach();
        this.Init();
    }

    public async Preload() {
        await Ammo.bind(this)(this);

        // @ts-ignore
        window.Ammo = this.Ammo;

        for (let i = 0; i < Object.keys(this.uninitializedScenes).length; i++) {
            const name = Object.keys(this.uninitializedScenes)[i];
            const sceneType = this.uninitializedScenes[name] as any;

            const scene = new sceneType(this.engine) as XScene;

            await scene.Preload();

            this.scenes[name] = scene;
        }
    }

    public getCanvas(append = false) {
        const existing = document.getElementById("__renderer_canvas_bjs");

        if (existing) return existing as HTMLCanvasElement;

        const canvas = document.createElement("canvas");

        canvas.id = "__renderer_canvas_bjs";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        if (append) document.body.appendChild(canvas);

        return canvas;
    }

    public LoadScene(scene: string) {
        if (!this.scenes[scene]) throw new ReferenceError("Unknown scene!");

        this.currentScene = this.scenes[scene];
        this.scenes[scene].Init();
    }

    public Init() {
        const canvas = this.getCanvas(true);
        this.engine = new Engine(canvas);
    }

    public Start() {
        this.engine.runRenderLoop(this.Update.bind(this));
    }

    public Update() {
        const delta = this.engine.getDeltaTime();

        this.currentScene?.Update(delta);
    }

    public Attach() {
        window.addEventListener("keydown", this.OnKeyDown.bind(this));
    }

    private OnKeyDown(ev: KeyboardEvent) {
        if (ev.which == 68 && ev.shiftKey) this.currentScene?.ToggleDebug();
    }
}
