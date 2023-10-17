import { writable } from "svelte/store";

let initialState = 30;
if (localStorage.getItem("defaultDays") !== null) {
    initialState = JSON.parse(localStorage.getItem("defaultDays")!);
}

export const defaultDays = writable(initialState);

defaultDays.subscribe((v) => {
    localStorage.setItem("defaultDays", JSON.stringify(v));
});
