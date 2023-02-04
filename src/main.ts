import eruda from "eruda";

eruda.init();

import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";

import { Game } from "./Game";
import { MainScene } from "./scene/MainScene";

import "./style.css";

export const main = async () => {
    const game = new Game({
        main: MainScene,
    });

    await game.Preload();

    game.LoadScene("main");
    
    game.Start();
};

main();
