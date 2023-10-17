<script lang="ts">
    import { events } from "@/stores/writeEvents";
    import { finalSeed } from "@/stores/writeFinalSeed";
    import type { CalendarEvent } from "@/lib";
    import Modal from "./Modal.svelte";
    import Calendar from "@event-calendar/core";
    import TimeGrid from "@event-calendar/time-grid";
    import DayGrid from "@event-calendar/day-grid";
    import ListGrid from "@event-calendar/list";

    const earliest = new Date(
        Math.min(...$events.map((e) => e.start.getTime())),
    );

    let showModal = false;
    let clicked: CalendarEvent;
    const handleClick = (info: { [k: string]: any; event: CalendarEvent }) => {
        clicked = info.event;
        showModal = true;
    };

    let plugins = [TimeGrid, DayGrid, ListGrid];
    let options = {
        view: "timeGridWeek",
        events: $events,
        date: earliest,
        headerToolbar: {
            start: "title",
            center: "",
            end: "dayGridMonth,timeGridWeek,listMonth today prev,next",
        },
        eventClick: handleClick,
    };
</script>

{#if $events.length === 0}
    <p>No events have been generated.</p>
{:else}
    {#if $finalSeed !== null}
        <p>
            Seed: <code>{$finalSeed.seed}</code>, Climate: {$finalSeed.climate}
        </p>
    {:else}
        <p>Events were manually loaded and are not tied to a specific seed.</p>
    {/if}
    <p>
        Some special events may have more detailed descriptions not visible on
        the calendar. Click on an event to expand it.
    </p>
    <hr />
    <Calendar plugins="{plugins}" options="{options}" />
{/if}

<Modal
    title="Event Details"
    show="{showModal}"
    buttons="{[
        {
            label: 'Close',
            callback: () => (showModal = false),
        },
    ]}"
>
    {#if clicked !== undefined}
        <table class="table">
            <tr>
                <th>Title</th>
                <td>{clicked.title}</td>
            </tr>
            <tr>
                <th>All day?</th>
                <td>{clicked.allDay ? "Yes" : "No"}</td>
            </tr>
            <tr>
                <th>Start</th>
                <td>{clicked.start}</td>
            </tr>
            <tr>
                <th>End</th>
                <td>{clicked.end}</td>
            </tr>
            <tr>
                <th>Details</th>
                <td>
                    {#if "extendedProps" in clicked && clicked.extendedProps !== undefined && clicked.extendedProps.description !== undefined}
                        {clicked.extendedProps.description}
                    {:else}
                        None
                    {/if}
                </td>
            </tr>
        </table>
    {/if}
</Modal>
