import { writable } from "svelte/store";
import type { CalendarEvent } from "@/lib";

let initialState: CalendarEvent[] = [];
if (localStorage.getItem("events") !== null) {
    initialState = JSON.parse(
        localStorage.getItem("events")!,
    ) as CalendarEvent[];
    initialState.forEach((e) => {
        e.start = new Date(e.start);
        e.end = new Date(e.end);
    });
}

export const events = writable(initialState);

events.subscribe((v) => {
    localStorage.setItem("events", JSON.stringify(v));
});
