import { App } from "./game";

window.addEventListener("load", async () => {
    await new App().run();
});
