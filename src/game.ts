import "./style.css";
import eruda from "eruda";
import { GUI } from "lil-gui";

import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Mesh,
    Object3D,
    Material,
    MeshStandardMaterial,
    sRGBEncoding,
    AmbientLight,
} from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { PointerLockControlsCannon } from "./controls";
import { BoxManager } from "./BoxManager";
import { World, Body, Box, Vec3 } from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { preInit } from "./models/common";

export const doSetWireframes = (scene: Object3D) => {
    for (const child of scene.children) {
        console.log(`Processing child ${child.name} of type ${child.type}...`);

        const childType = child.type.toString().toLowerCase();

        if (
            childType == "group" ||
            childType == "scene" ||
            childType == "object3d"
        )
            doSetWireframes(child);
        else if (childType == "mesh") {
            const meshChild = child as Mesh;

            Array.isArray(meshChild.material)
                ? meshChild.material.forEach(
                      (v: Material) =>
                          ((v as MeshStandardMaterial).wireframe = true)
                  )
                : ((meshChild.material as MeshStandardMaterial).wireframe =
                      true);
        }
    }
};

export class App {
    private scene: Scene;
    private camera: PerspectiveCamera;
    private renderer: WebGLRenderer;
    private controls: PointerLockControlsCannon;
    private physicsWorld: World;
    private gui: GUI;
    private debug: { update: () => void };
    private lastCallTime: number;
    private enableDebug = false;

    public constructor() {
        eruda.init();
        this.gui = new GUI();
        this.lastCallTime = 0;
    }

    public startUI() {
        const canvas = document.createElement("canvas");
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.className = "ui-canvas";

        document.body.appendChild(canvas);

        const ctx = canvas.getContext("2d")!;
        const commit = import.meta.env.VITE_COMMIT_HASH;

        ctx.fillStyle = "white";
        ctx.font = "12pt Arial";
        ctx.fillText(`The Backrooms Pre-Alpha Build | Rev. ${commit}`, 15, 30);
    }

    public async run() {
        await preInit();

        this.renderer = new WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.renderer.outputEncoding = sRGBEncoding;

        document.body.appendChild(this.renderer.domElement);

        this.startUI();

        this.scene = new Scene();

        // @ts-ignore
        window.scene = this.scene;

        this.physicsWorld = new World({
            gravity: new Vec3(0, -9.82, 0),
        });

        if (this.enableDebug)
            this.debug = CannonDebugger(this.scene, this.physicsWorld, {});

        this.camera = new PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.gui.add(this.camera.rotation, "x").listen();
        this.gui.add(this.camera.rotation, "y").listen();
        this.gui.add(this.camera.rotation, "z").listen();

        this.gui.hide();

        const body = new Body({
            mass: 5,
        });

        body.addShape(new Box(new Vec3(0.5, 0.5, 0.5)));
        body.position.set(10, 15, 4);
        body.linearDamping = 0.9;

        this.physicsWorld.addBody(body);

        const loader = new GLTFLoader();
        const model = await loader.loadAsync(import.meta.env.BASE_URL + "/gltf/HAZMAT.gltf");
        
        model.scene.scale.set(0.05, 0.05, 0.05);
        model.scene.position.set(15, 10, 8);

        this.scene.add(model.scene);

        this.controls = new PointerLockControlsCannon(this.camera, body, model.scene);
        this.scene.add(this.controls.getObject());

        const light = new AmbientLight(0x303030);
        this.scene.add(light);

        const boxm = new BoxManager(this.scene, this.physicsWorld, 0, 0);

        boxm.generate();

        await boxm.render();

        this.setupEvents();
        this.render();
    }

    public render() {
        requestAnimationFrame(this.render.bind(this));

        const time = performance.now() / 1000;
        const dt = time - this.lastCallTime;
        this.lastCallTime = time;

        this.controls.update(dt);
        this.physicsWorld.fixedStep();
        this.debug?.update();

        this.renderer.render(this.scene, this.camera);
    }

    private setupEvents() {
        this.controls.addEventListener("lock", this.onControlsLock.bind(this));

        this.controls.addEventListener(
            "unlock",
            this.onControlsUnlock.bind(this)
        );

        window.addEventListener("keydown", this.onKeyDown.bind(this));

        this.controls.connect();

        window.addEventListener("click", () => this.controls.lock());
    }

    private onControlsLock() {
        this.controls.enabled = true;
    }

    private onControlsUnlock() {
        this.controls.enabled = false;
    }

    private onKeyDown(ev: KeyboardEvent) {
        switch (ev.code) {
            case "Escape":
                this.controls.unlock();
                break;
        }
    }
}
