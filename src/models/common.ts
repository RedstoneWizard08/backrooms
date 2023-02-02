import {
    BoxGeometry,
    Mesh,
    MeshStandardMaterial,
    RepeatWrapping,
    Texture,
    TextureLoader,
} from "three";

import { Body, Box, World, Vec3 } from "cannon-es";

export const loader = new TextureLoader();

export let floorTexture: Texture;
export let wallTexture: Texture;

export const preInit = async () => {
    floorTexture = await loader.loadAsync(import.meta.env.BASE_URL + "/textures/backrooms_floor_tex.png");

    wallTexture = await loader.loadAsync(import.meta.env.BASE_URL + "/textures/backrooms_wall_tex.png");

    floorTexture.wrapS = wallTexture.wrapS = RepeatWrapping;
    floorTexture.wrapT = wallTexture.wrapT = RepeatWrapping;
    floorTexture.repeat = wallTexture.repeat.set(6, 6);
};

export const createFloor = async (world: World) => {
    const geometry = new BoxGeometry(16, 1, 16, 1, 1, 1);

    const material = new MeshStandardMaterial({
        map: floorTexture,
        color: 0xffffff,
        emissive: 0x0,
    });

    const mesh = new Mesh(geometry, material);
    mesh.userData.isFloor = true;

    const body = new Body({
        type: Body.STATIC,
        shape: new Box(new Vec3(8, 0.5, 8)),
    });

    mesh.userData.physicsBody = body.id;
    mesh.userData.phys = body;

    world.addBody(body);

    return mesh;
};

export const createWall = async (world: World, len = 16) => {
    const geometry = new BoxGeometry(len, 8, 4, 1, 1, 1);

    const material = new MeshStandardMaterial({
        map: wallTexture,
        color: 0xffffff,
        emissive: 0x0,
    });

    const mesh = new Mesh(geometry, material);
    mesh.userData.isWall = true;

    const body = new Body({
        type: Body.STATIC,
        shape: new Box(new Vec3(len / 2, 4, 2)),
    });

    mesh.userData.physicsBody = body.id;
    mesh.userData.phys = body;

    world.addBody(body);

    return mesh;
};
