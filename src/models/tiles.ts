import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from "three";
import { createFloor, createWall } from "./common";
import { Body, World } from "cannon-es";

export const createClearTile = async (world: World) => {
    const group = new Group();
    const floor = await createFloor(world);

    const geom = new BoxGeometry(2, 0.5, 1);
    const isOn = Math.random() <= 0.6;
    const mat = new MeshStandardMaterial({
        color: isOn ? 0xffff00 : 0x3c3c3c,
        emissive: isOn ? 0xffff00 : 0x3c3c3c,
        emissiveIntensity: 0.5,
    });

    const box = new Mesh(geom, mat);
    box.position.y = 8;

    const ceiling = await createFloor(world);
    ceiling.position.y = 8.5;
    ceiling.userData.phys.position.y = 8.5;
    group.userData.offset5 = { y: 8.5 };

    group.add(floor, box, ceiling);

    group.userData.isTile = true;

    group.userData.phys1 = floor.userData.phys;
    group.userData.phys5 = ceiling.userData.phys;

    return group;
};

export const createHalfSplitTile = async (world: World) => {
    const group = new Group();

    const floor = await createFloor(world);
    const wall = await createWall(world, 8);

    wall.position.y = 4.5;
    wall.position.z -= 4;

    const physWall: Body = wall.userData.phys;

    physWall.position.set(wall.position.x, wall.position.y, wall.position.z);

    physWall.position.y = 4.5;
    physWall.position.z -= 4;

    const geom = new BoxGeometry(2, 0.5, 1);
    const isOn = Math.random() <= 0.6;
    const mat = new MeshStandardMaterial({
        color: isOn ? 0xffff00 : 0x3c3c3c,
        emissive: isOn ? 0xffff00 : 0x3c3c3c,
        emissiveIntensity: 0.5,
    });

    const box = new Mesh(geom, mat);
    box.position.y = 8;

    const ceiling = await createFloor(world);
    ceiling.position.y = 8.5;
    ceiling.userData.phys.position.y = 8.5;
    group.userData.offset5 = { y: 8.5 };
    group.userData.phys5 = ceiling.userData.phys;

    group.add(floor, wall, ceiling);

    group.userData.isTile = true;

    group.userData.phys1 = floor.userData.phys;
    group.userData.phys2 = wall.userData.phys;

    group.userData.offset1 = { y: 4.5, z: -4 };

    group.userData.wall1 = wall;

    return group;
};

export const createSplitTile = async (world: World) => {
    const group = new Group();

    const floor = await createFloor(world);
    const wall = await createWall(world);

    wall.position.y = 4.5;

    const physWall: Body = wall.userData.phys;

    physWall.position.set(wall.position.x, wall.position.y, wall.position.z);

    physWall.position.y = 4.5;

    const geom = new BoxGeometry(2, 0.5, 1);
    const isOn = Math.random() <= 0.6;
    const mat = new MeshStandardMaterial({
        color: isOn ? 0xffff00 : 0x3c3c3c,
        emissive: isOn ? 0xffff00 : 0x3c3c3c,
        emissiveIntensity: 0.5,
    });

    const box = new Mesh(geom, mat);
    box.position.y = 8;

    const ceiling = await createFloor(world);
    ceiling.position.y = 8.5;
    ceiling.userData.phys.position.y = 8.5;
    group.userData.offset5 = { y: 8.5 };
    group.userData.phys5 = ceiling.userData.phys;

    group.add(floor, wall, ceiling);

    group.userData.isTile = true;

    group.userData.phys1 = floor.userData.phys;
    group.userData.phys2 = wall.userData.phys;

    group.userData.offset1 = { y: 4.5 };

    group.userData.wall1 = wall;

    return group;
};

export const createIntersectionTile = async (world: World) => {
    const group = new Group();

    const floor = await createFloor(world);
    const wall = await createWall(world);
    const wall2 = await createWall(world);

    wall.position.y = wall2.position.y = 4.5;
    wall2.rotateY(Math.PI / 2);

    const physWall: Body = wall.userData.phys;
    const physWall2: Body = wall2.userData.phys;

    physWall.position.set(wall.position.x, wall.position.y, wall.position.z);

    physWall2.position.set(
        wall2.position.x,
        wall2.position.y,
        wall2.position.z
    );

    physWall.position.y = physWall2.position.y = 4.5;

    physWall2.quaternion.setFromEuler(
        wall2.rotation.x,
        wall2.rotation.y,
        wall2.rotation.z
    );

    const geom = new BoxGeometry(2, 0.5, 1);
    const isOn = Math.random() <= 0.6;
    const mat = new MeshStandardMaterial({
        color: isOn ? 0xffff00 : 0x3c3c3c,
        emissive: isOn ? 0xffff00 : 0x3c3c3c,
        emissiveIntensity: 0.5,
    });

    const box = new Mesh(geom, mat);
    box.position.y = 8;

    const ceiling = await createFloor(world);
    ceiling.position.y = 8.5;
    ceiling.userData.phys.position.y = 8.5;
    group.userData.offset5 = { y: 8.5 };
    group.userData.phys5 = ceiling.userData.phys;

    group.add(floor, wall, wall2, ceiling);

    group.userData.isTile = true;

    group.userData.phys1 = floor.userData.phys;
    group.userData.phys2 = wall.userData.phys;
    group.userData.phys3 = wall2.userData.phys;

    group.userData.offset1 = { y: 4.5 };
    group.userData.offset2 = { y: 4.5 };

    group.userData.wall1 = wall;
    group.userData.wall2 = wall2;

    return group;
};

export const createCornerTile = async (world: World) => {
    const group = new Group();

    const floor = await createFloor(world);
    const wall = await createWall(world, 8);
    const wall2 = await createWall(world, 8);

    wall.position.y = wall2.position.y = 4.5;

    wall2.rotateY(Math.PI / 2);

    wall.position.z -= 4;
    wall2.position.x += 4;

    const physWall: Body = wall.userData.phys;
    const physWall2: Body = wall2.userData.phys;

    physWall.position.set(wall.position.x, wall.position.y, wall.position.z);

    physWall2.position.set(
        wall2.position.x,
        wall2.position.y,
        wall2.position.z
    );

    physWall.position.y = physWall2.position.y = 4.5;

    physWall2.quaternion.setFromEuler(
        wall2.rotation.x,
        wall2.rotation.y,
        wall2.rotation.z
    );

    physWall.position.z -= 4;
    physWall2.position.x += 4;

    const geom = new BoxGeometry(2, 0.5, 1);
    const isOn = Math.random() <= 0.6;
    const mat = new MeshStandardMaterial({
        color: isOn ? 0xffff00 : 0x3c3c3c,
        emissive: isOn ? 0xffff00 : 0x3c3c3c,
        emissiveIntensity: 0.5,
    });

    const box = new Mesh(geom, mat);
    box.position.y = 8;

    const ceiling = await createFloor(world);
    ceiling.position.y = 8.5;
    ceiling.userData.phys.position.y = 8.5;
    group.userData.offset5 = { y: 8.5 };
    group.userData.phys5 = ceiling.userData.phys;

    group.add(floor, wall, wall2, ceiling);

    group.userData.isTile = true;

    group.userData.phys1 = floor.userData.phys;
    group.userData.phys2 = wall.userData.phys;
    group.userData.phys3 = wall2.userData.phys;

    group.userData.offset1 = { y: 4.5, z: -4 };
    group.userData.offset2 = { y: 4.5, x: 4 };

    group.userData.wall1 = wall;
    group.userData.wall2 = wall2;

    return group;
};

export const createUTurnTile = async (world: World) => {
    const group = new Group();

    const floor = await createFloor(world);
    const wall = await createWall(world);
    const wall2 = await createWall(world);
    const wall3 = await createWall(world);

    wall.position.y = wall2.position.y = 4.5;

    wall2.rotateY(Math.PI / 2);
    wall3.rotateY(Math.PI / 2);

    wall.position.z = -6;
    wall2.position.x = -6;
    wall3.position.x = 6;

    const physWall: Body = wall.userData.phys;
    const physWall2: Body = wall2.userData.phys;
    const physWall3: Body = wall3.userData.phys;

    physWall.position.set(wall.position.x, wall.position.y, wall.position.z);

    physWall2.position.set(
        wall2.position.x,
        wall2.position.y,
        wall2.position.z
    );

    physWall3.position.set(
        wall3.position.x,
        wall3.position.y,
        wall3.position.z
    );

    physWall.position.y = physWall2.position.y = 4.5;

    physWall2.quaternion.setFromEuler(
        wall2.rotation.x,
        wall2.rotation.y,
        wall2.rotation.z
    );

    physWall3.quaternion.setFromEuler(
        wall3.rotation.x,
        wall3.rotation.y,
        wall3.rotation.z
    );

    physWall.position.z = -6;
    physWall2.position.x = -6;
    physWall3.position.x = 6;

    const geom = new BoxGeometry(2, 0.5, 1);
    const isOn = Math.random() <= 0.6;
    const mat = new MeshStandardMaterial({
        color: isOn ? 0xffff00 : 0x3c3c3c,
        emissive: isOn ? 0xffff00 : 0x3c3c3c,
        emissiveIntensity: 0.5,
    });

    const box = new Mesh(geom, mat);
    box.position.y = 8;

    const ceiling = await createFloor(world);
    ceiling.position.y = 8.5;
    ceiling.userData.phys.position.y = 8.5;
    group.userData.offset5 = { y: 8.5 };
    group.userData.phys5 = ceiling.userData.phys;

    group.add(floor, wall, wall2, wall3, ceiling);

    group.userData.isTile = true;

    group.userData.phys1 = floor.userData.phys;
    group.userData.phys2 = wall.userData.phys;
    group.userData.phys3 = wall2.userData.phys;
    group.userData.phys4 = wall3.userData.phys;

    group.userData.offset1 = { y: 4.5, z: -6 };
    group.userData.offset2 = { y: 4.5, x: -6 };
    group.userData.offset3 = { x: 6 };

    group.userData.wall1 = wall;
    group.userData.wall2 = wall2;
    group.userData.wall3 = wall3;

    return group;
};

export const createCrossTile = async (world: World) => {
    const group = new Group();

    const floor = await createFloor(world);
    const wall = await createWall(world);
    const wall2 = await createWall(world);

    wall.position.y = wall2.position.y = 4.5;
    wall2.rotateY(Math.PI / 2);

    wall.position.z = -6;

    const physWall: Body = wall.userData.phys;
    const physWall2: Body = wall2.userData.phys;

    physWall.position.set(wall.position.x, wall.position.y, wall.position.z);

    physWall2.position.set(
        wall2.position.x,
        wall2.position.y,
        wall2.position.z
    );

    physWall.position.y = physWall2.position.y = 4.5;

    physWall2.quaternion.setFromEuler(
        wall2.rotation.x,
        wall2.rotation.y,
        wall2.rotation.z
    );

    physWall.position.z = -6;

    const geom = new BoxGeometry(2, 0.5, 1);
    const isOn = Math.random() <= 0.6;
    const mat = new MeshStandardMaterial({
        color: isOn ? 0xffff00 : 0x3c3c3c,
        emissive: isOn ? 0xffff00 : 0x3c3c3c,
        emissiveIntensity: 0.5,
    });

    const box = new Mesh(geom, mat);
    box.position.y = 8;

    const ceiling = await createFloor(world);
    ceiling.position.y = 8.5;
    ceiling.userData.phys.position.y = 8.5;
    group.userData.offset5 = { y: 8.5 };
    group.userData.phys5 = ceiling.userData.phys;

    group.add(floor, wall, wall2, ceiling);

    group.userData.isTile = true;

    group.userData.phys1 = floor.userData.phys;
    group.userData.phys2 = wall.userData.phys;
    group.userData.phys3 = wall2.userData.phys;

    group.userData.offset1 = { y: 4.5, z: -6 };
    group.userData.offset2 = { y: 4.5 };

    group.userData.wall1 = wall;
    group.userData.wall2 = wall2;

    return group;
};
