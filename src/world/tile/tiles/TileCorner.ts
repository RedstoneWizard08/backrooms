import { Axis } from "@babylonjs/core";
import { Tile } from "../Tile";
import { TileFloor } from "../components/TileFloor";
import { TileLight } from "../components/TileLight";
import { TileWall } from "../components/TileWall";

export class TileCorner extends Tile {
    public CreateChildren() {
        const isLightOn = Math.random() < 0.9;

        const floor = new TileFloor(this.name + "__floor", this.getScene());
        const wall = new TileWall(this.name + "__wall", this.getScene(), 8.5);
        const wall2 = new TileWall(this.name + "__wall2", this.getScene(), 7.5);
        const light = new TileLight(this.name + "__light", this.getScene(), isLightOn);

        wall.position.z -= 3.75;
        wall2.position.x += 4.25;
        wall2.rotate(Axis.Y, Math.PI / 2);

        floor.parent = this;
        wall.parent = this;
        wall2.parent = this;
        light.parent = this;

        const lightObj1 = this.getScene().getLightByName(
            this.name + "__light__lightObject_1"
        )!;

        const lightObj2 = this.getScene().getLightByName(
            this.name + "__light__lightObject_2"
        )!;

        const lightObj3 = this.getScene().getLightByName(
            this.name + "__light__lightObject_3"
        )!;

        const lightObj4 = this.getScene().getLightByName(
            this.name + "__light__lightObject_4"
        )!;

        lightObj1.includedOnlyMeshes =
            lightObj2.includedOnlyMeshes =
            lightObj3.includedOnlyMeshes =
            lightObj4.includedOnlyMeshes =
                [floor, wall, wall2, light];
    }
}
