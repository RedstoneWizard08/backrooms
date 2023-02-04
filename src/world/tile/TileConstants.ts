import { Scene, Texture } from "@babylonjs/core";

export class TileConstants {
    public static TILE_WIDTH = 16;
    public static TILE_DEPTH = 16;
    public static TILE_HEIGHT = 12;

    public static TILE_FLOOR_HEIGHT = 1;
    public static TILE_CEILING_HEIGHT = 1;
    public static TILE_WALL_HEIGHT = 10;

    public static TILE_FLOOR_SCALE = 6;
    public static TILE_CEILING_SCALE = 6;
    public static TILE_WALL_SCALE = 6;

    public static GetFloorTexture(scene: Scene) {
        const floorTex = new Texture("/textures/backrooms_floor_tex.png", scene);

        floorTex.uScale = this.TILE_FLOOR_SCALE;
        floorTex.vScale = this.TILE_FLOOR_SCALE;

        return floorTex;
    }

    public static GetCeilingTexture(scene: Scene) {
        const ceilingTex = new Texture("/textures/backrooms_floor_tex.png", scene);

        ceilingTex.uScale = this.TILE_CEILING_SCALE;
        ceilingTex.vScale = this.TILE_CEILING_SCALE;
        
        return ceilingTex;
    }

    public static GetWallTexture(scene: Scene) {
        const wallTex = new Texture("/textures/backrooms_wall_tex.png", scene);

        wallTex.uScale = this.TILE_WALL_SCALE;
        wallTex.vScale = this.TILE_WALL_SCALE;

        wallTex.wAng = Math.PI / 2;
        wallTex.vAng = Math.PI / 4;

        return wallTex;
    }
}