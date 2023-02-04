import { Tile } from "../Tile";
import { TileFloor } from "../components/TileFloor";
import { TileLight } from "../components/TileLight";

export class TileEmpty extends Tile {
    public CreateChildren() {
        const isLightOn = Math.random() < 0.9;

        const floor = new TileFloor(this.name + "__floor", this.getScene());

        const light = new TileLight(
            this.name + "__light",
            this.getScene(),
            isLightOn
        );

        floor.parent = this;
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
                [floor, light];
    }
}
