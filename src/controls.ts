import {
    Camera,
    Euler,
    EventDispatcher,
    Object3D,
    Quaternion,
    Vector3,
    Event as TEvent,
    Group,
} from "three";

import { Body, Vec3 } from "cannon-es";

export class PointerLockControlsCannon extends EventDispatcher {
    public enabled: boolean;
    public cannonBody: Body;
    public velocityFactorD: number;
    public jumpVelocity: number;
    public pitchObject: Object3D;
    public yawObject: Object3D;
    public quaternion: Quaternion;

    public moveForward: boolean;
    public moveBackward: boolean;
    public moveLeft: boolean;
    public moveRight: boolean;

    public canJump: boolean;

    public velocity: Vec3;
    public inputVelocity: Vector3;
    public euler: Euler;

    public lockEvent: TEvent;
    public unlockEvent: TEvent;

    public isLocked: boolean;
    public sprint: boolean;
    public mesh: Group;

    public get velocityFactor() {
        return this.sprint ? this.velocityFactorD * 2 : this.velocityFactorD;
    }

    public constructor(camera: Camera, cannonBody: Body, mesh: Group) {
        super();

        this.enabled = false;

        this.cannonBody = cannonBody;
        this.mesh = mesh;

        // var eyeYPos = 2 // eyes are 2 meters above the ground
        this.velocityFactorD = 0.2;
        this.jumpVelocity = 10;

        this.pitchObject = new Object3D();
        this.pitchObject.add(camera);

        this.yawObject = new Object3D();
        this.yawObject.position.y = 2;
        this.yawObject.add(this.pitchObject);

        this.quaternion = new Quaternion();

        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        this.canJump = false;
        this.sprint = false;

        this.cannonBody.angularFactor = new Vec3(0, 1, 0);

        const contactNormal = new Vec3();
        const upAxis = new Vec3(0, 1, 0);

        this.cannonBody.addEventListener("collide", (event: any) => {
            const { contact } = event;

            if (contact.bi.id === this.cannonBody.id) {
                contact.ni.negate(contactNormal);
            } else {
                contactNormal.copy(contact.ni);
            }

            if (contactNormal.dot(upAxis) > 0.5) {
                this.canJump = true;
            }
        });

        this.velocity = this.cannonBody.velocity;

        this.inputVelocity = new Vector3();
        this.euler = new Euler();

        this.lockEvent = { type: "lock" };
        this.unlockEvent = { type: "unlock" };

        this.connect();
    }

    public connect() {
        document.addEventListener("mousemove", this.onMouseMove.bind(this));

        document.addEventListener(
            "pointerlockchange",
            this.onPointerlockChange.bind(this)
        );

        document.addEventListener(
            "pointerlockerror",
            this.onPointerlockError.bind(this)
        );

        document.addEventListener("keydown", this.onKeyDown.bind(this));
        document.addEventListener("keyup", this.onKeyUp.bind(this));
    }

    public disconnect() {
        document.removeEventListener("mousemove", this.onMouseMove.bind(this));

        document.removeEventListener(
            "pointerlockchange",
            this.onPointerlockChange.bind(this)
        );

        document.removeEventListener(
            "pointerlockerror",
            this.onPointerlockError.bind(this)
        );

        document.removeEventListener("keydown", this.onKeyDown.bind(this));
        document.removeEventListener("keyup", this.onKeyUp.bind(this));
    }

    public dispose() {
        this.disconnect();
    }

    public lock() {
        document.body.requestPointerLock();
    }

    public unlock() {
        document.exitPointerLock();
    }

    public onPointerlockChange() {
        if (document.pointerLockElement) {
            this.dispatchEvent(this.lockEvent);

            this.isLocked = true;
        } else {
            this.dispatchEvent(this.unlockEvent);

            this.isLocked = false;
        }
    }

    public onPointerlockError() {
        console.error(
            "PointerLockControlsCannon: Unable to use Pointer Lock API"
        );
    }

    public onMouseMove(event: MouseEvent) {
        if (!this.enabled) {
            return;
        }

        const { movementX, movementY } = event;

        this.yawObject.rotation.y -= movementX * 0.002;
        this.pitchObject.rotation.x -= movementY * 0.002;

        this.pitchObject.rotation.x = Math.max(
            -Math.PI / 2,
            Math.min(Math.PI / 2, this.pitchObject.rotation.x)
        );
    }

    public onKeyDown(event: KeyboardEvent) {
        switch (event.code) {
            case "KeyW":
            case "ArrowUp":
                this.moveForward = true;
                break;

            case "KeyA":
            case "ArrowLeft":
                this.moveLeft = true;
                break;

            case "KeyS":
            case "ArrowDown":
                this.moveBackward = true;
                break;

            case "KeyD":
            case "ArrowRight":
                this.moveRight = true;
                break;

            case "Space":
                if (this.canJump) {
                    this.velocity.y = this.jumpVelocity;
                }

                this.canJump = false;
                break;

            case "ShiftLeft":
            case "ShiftRight":
                this.sprint = true;
                break;
        }
    }

    public onKeyUp(event: KeyboardEvent) {
        switch (event.code) {
            case "KeyW":
            case "ArrowUp":
                this.moveForward = false;
                break;

            case "KeyA":
            case "ArrowLeft":
                this.moveLeft = false;
                break;

            case "KeyS":
            case "ArrowDown":
                this.moveBackward = false;
                break;

            case "KeyD":
            case "ArrowRight":
                this.moveRight = false;
                break;

            case "ShiftLeft":
            case "ShiftRight":
                this.sprint = false;
                break;
        }
    }

    public getObject() {
        return this.yawObject;
    }

    public getDirection() {
        const vector = new Vector3(0, 0, -1);

        vector.applyQuaternion(this.quaternion);

        return vector;
    }

    public update(delta: number) {
        if (this.enabled === false) {
            return;
        }

        delta *= 1000;
        delta *= 0.1;

        this.inputVelocity.set(0, 0, 0);

        if (this.moveForward) {
            this.inputVelocity.z = -this.velocityFactor * delta;
        }
        if (this.moveBackward) {
            this.inputVelocity.z = this.velocityFactor * delta;
        }

        if (this.moveLeft) {
            this.inputVelocity.x = -this.velocityFactor * delta;
        }
        if (this.moveRight) {
            this.inputVelocity.x = this.velocityFactor * delta;
        }

        this.euler.x = this.pitchObject.rotation.x;
        this.euler.y = this.yawObject.rotation.y;
        this.euler.order = "XYZ";

        this.quaternion.setFromEuler(this.euler);
        this.inputVelocity.applyQuaternion(this.quaternion);

        this.velocity.x += this.inputVelocity.x;
        this.velocity.z += this.inputVelocity.z;

        this.yawObject.position.set(
            this.cannonBody.position.x,
            this.cannonBody.position.y,
            this.cannonBody.position.z
        );

        this.cannonBody.quaternion.setFromEuler(
            0,
            this.yawObject.rotation.y,
            0
        );

        this.mesh.visible = false;

        this.mesh.position.set(
            this.cannonBody.position.x,
            this.cannonBody.position.y - 0.25,
            this.cannonBody.position.z
        );

        this.mesh.quaternion.set(
            this.cannonBody.quaternion.x,
            this.cannonBody.quaternion.y,
            this.cannonBody.quaternion.z,
            this.cannonBody.quaternion.w
        );
    }
}
