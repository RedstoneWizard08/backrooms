import { CircleGeometry, Mesh, MeshBasicMaterial, Vector3 } from "three";
import { Rotation } from "./util";

export const BOX_WIDTH = 16;
export const BOX_HEIGHT = 16;

export const drawConnection = (
    pos: Vector3,
    rotation = Rotation.UP,
    isMain = false
) => {
    const { x, z } = pos;

    const topMiddle = [x + BOX_WIDTH / 2, z];

    const bottomMiddle = [
        x + BOX_WIDTH / 2,
        z + BOX_HEIGHT,
    ];

    const leftMiddle = [x, z + BOX_HEIGHT / 2];

    const rightMiddle = [
        x + BOX_WIDTH,
        z + BOX_HEIGHT,
    ];

    const geom = new CircleGeometry(2, 32);
    const mat = new MeshBasicMaterial({ color: 0x0ecefe });
    
    if (isMain)
        mat.color.setHex(0x5cff5c);
    
    const circle = new Mesh(geom, mat);

    switch (rotation) {
        case Rotation.UP:
            circle.position.set(topMiddle[0] + 2, 6, topMiddle[1] - 2);
            break;

        case Rotation.DOWN:
            circle.position.set(topMiddle[0] + 2, 6, bottomMiddle[1] + 2);
            break;

        case Rotation.LEFT:
            circle.position.set(leftMiddle[0] - 2, 6, leftMiddle[1] - 2);
            break;

        case Rotation.RIGHT:
            circle.position.set(rightMiddle[0] + 2, 6, rightMiddle[1] - 2);
            break;
    }
};
