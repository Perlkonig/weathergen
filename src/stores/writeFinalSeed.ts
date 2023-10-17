import { writable } from "svelte/store";

type FullSeed = {
    seed: string;
    climate: "arid" | "temperate" | "tropical";
};

let initialState: FullSeed | null = null;
if (localStorage.getItem("finalSeed") !== null) {
    initialState = JSON.parse(localStorage.getItem("finalSeed")!) as FullSeed;
}

export const finalSeed = writable(initialState);

finalSeed.subscribe((v) => {
    localStorage.setItem("finalSeed", JSON.stringify(v));
});
