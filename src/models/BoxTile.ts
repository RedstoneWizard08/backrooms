import { Object3D, Vector3 } from "three";
import { BoxManager } from "../BoxManager";
import {
    getReverseRotation,
    PathType,
    PathTypeAssociation,
    PathTypeT,
    randomRotation,
    randomType,
    Rotation,
} from "../util";

import { World, Body } from "cannon-es";

export class Box extends Object3D {
    public neighbors: Box[];
    public generated: boolean;
    public connectionPoints: Vector3[];
    public kind: number;
    public rot: Vector3;
    public world: World;

    public constructor(pos: Vector3, type: number, rot: Vector3, world: World) {
        super();

        this.world = world;
        this.kind = type;
        this.rotation.setFromVector3(rot);
        this.position.copy(pos);
        this.rot = rot;

        this.generated = false;
        this.neighbors = [];
        this.connectionPoints = [];

        this.calculateConnections();
    }

    public async draw() {
        const defaultOffset = { x: 0, y: 0, z: 0 };

        const myFn =
            PathTypeAssociation[
                Object.keys(PathTypeAssociation)[this.kind] as PathTypeT
            ];

        const me = await myFn(this.world);

        const phys1: Body = me.userData.phys1;
        const phys2: Body = me.userData.phys2;
        const phys3: Body = me.userData.phys3;
        const phys4: Body = me.userData.phys4;
        const phys5: Body = me.userData.phys5;

        phys1?.position.set(
            this.position.x + ((me.userData.offset4 || defaultOffset).x || 0),
            this.position.y + ((me.userData.offset4 || defaultOffset).y || 0),
            this.position.z + ((me.userData.offset4 || defaultOffset).z || 0)
        );

        phys2?.position.set(
            this.position.x + ((me.userData.offset1 || defaultOffset).x || 0),
            this.position.y + ((me.userData.offset1 || defaultOffset).y || 0),
            this.position.z + ((me.userData.offset1 || defaultOffset).z || 0)
        );

        phys3?.position.set(
            this.position.x + ((me.userData.offset2 || defaultOffset).x || 0),
            this.position.y + ((me.userData.offset2 || defaultOffset).y || 0),
            this.position.z + ((me.userData.offset2 || defaultOffset).z || 0)
        );

        phys4?.position.set(
            this.position.x + ((me.userData.offset3 || defaultOffset).x || 0),
            this.position.y + ((me.userData.offset3 || defaultOffset).y || 0),
            this.position.z + ((me.userData.offset3 || defaultOffset).z || 0)
        );

        phys5?.position.set(
            this.position.x + ((me.userData.offset5 || defaultOffset).x || 0),
            this.position.y + ((me.userData.offset5 || defaultOffset).y || 0),
            this.position.z + ((me.userData.offset5 || defaultOffset).z || 0)
        );
        
        // phys1?.quaternion.set(
        //     this.quaternion.x,
        //     this.quaternion.y,
        //     this.quaternion.z,
        //     this.quaternion.w
        // );

        // phys2?.quaternion.set(
        //     this.quaternion.x,
        //     this.quaternion.y,
        //     this.quaternion.z,
        //     this.quaternion.w
        // );

        // phys3?.quaternion.set(
        //     this.quaternion.x,
        //     this.quaternion.y,
        //     this.quaternion.z,
        //     this.quaternion.w
        // );

        // phys4?.quaternion.set(
        //     this.quaternion.x,
        //     this.quaternion.y,
        //     this.quaternion.z,
        //     this.quaternion.w
        // );

        // phys5?.quaternion.set(
        //     this.quaternion.x,
        //     this.quaternion.y,
        //     this.quaternion.z,
        //     this.quaternion.w
        // );

        this.add(me);
    }

    public drawConnections() {
        // TODO: Implement
        // drawConnections(
        //     this.position,
        //     this.type,
        //     this.rotation
        // );
    }

    public drawAll() {
        this.draw();
        this.drawConnections();
    }

    private generateNeighbor(mgr: BoxManager, point: Vector3) {
        const box = new Box(
            new Vector3(),
            randomType(),
            randomRotation(),
            this.world
        );

        const boxPos = new Vector3(
            this.position.x,
            this.position.y,
            this.position.z
        );

        if (point == Rotation.UP) boxPos.z -= 16;
        if (point == Rotation.DOWN) boxPos.z += 16;
        if (point == Rotation.LEFT) boxPos.x -= 16;
        if (point == Rotation.RIGHT) boxPos.x += 16;

        box.position.copy(boxPos);

        const boxExists =
            mgr.boxes.find((v) => v.position.equals(boxPos)) != undefined;

        console.log(
            "Pos: (" + boxPos.x + ", " + boxPos.y + ") | Exists: " + boxExists
        );

        if (boxExists) return;

        let tries = 0;
        let foundConnection = false;

        while (!foundConnection && tries < 4) {
            if (box.connectionPoints.includes(getReverseRotation(point)))
                foundConnection = true;

            if (foundConnection) break;

            box.rotate();
            box.calculateConnections();

            tries++;
        }

        if (!foundConnection) {
            box.kind = PathType.CLEAR;
        }

        this.neighbors.push(box);
    }

    public generateNeighbors(mgr: BoxManager) {
        const points = this.connectionPoints;

        this.generated = true;

        for (const point of points) {
            this.generateNeighbor(mgr, point);
        }
    }

    public rotate() {
        switch (this.rot) {
            case Rotation.UP:
                this.rotation.setFromVector3(Rotation.RIGHT);
                this.rot = Rotation.RIGHT;
                break;

            case Rotation.DOWN:
                this.rotation.setFromVector3(Rotation.LEFT);
                this.rot = Rotation.LEFT;
                break;

            case Rotation.LEFT:
                this.rotation.setFromVector3(Rotation.UP);
                this.rot = Rotation.UP;
                break;

            case Rotation.RIGHT:
                this.rotation.setFromVector3(Rotation.DOWN);
                this.rot = Rotation.DOWN;
                break;
        }

        this.calculateConnections();
    }

    public calculateConnections() {
        this.connectionPoints = [];

        switch (this.kind) {
            case PathType.HALF_STRAIGHT:
                this.connectionPoints.push(this.rot);
                break;

            case PathType.STRAIGHT:
                this.connectionPoints.push(
                    this.rot,
                    getReverseRotation(this.rot)
                );
                break;

            case PathType.CORNER:
                this.connectionPoints.push(this.rot);

                switch (this.rot) {
                    case Rotation.UP:
                        this.connectionPoints.push(this.rot);
                        break;

                    case Rotation.DOWN:
                        this.connectionPoints.push(this.rot);
                        break;

                    case Rotation.LEFT:
                        this.connectionPoints.push(this.rot);
                        break;

                    case Rotation.RIGHT:
                        this.connectionPoints.push(this.rot);
                        break;
                }

                break;

            case PathType.INTERSECTION:
                this.connectionPoints.push(this.rot);

                switch (this.rot) {
                    case Rotation.UP:
                    case Rotation.DOWN:
                        this.connectionPoints.push(
                            Rotation.LEFT,
                            Rotation.RIGHT
                        );
                        break;

                    case Rotation.LEFT:
                    case Rotation.RIGHT:
                        this.connectionPoints.push(Rotation.UP, Rotation.DOWN);
                        break;
                }

                break;

            case PathType.CROSS:
                this.connectionPoints.push(
                    Rotation.UP,
                    Rotation.DOWN,
                    Rotation.LEFT,
                    Rotation.RIGHT
                );

                break;
        }
    }
}
