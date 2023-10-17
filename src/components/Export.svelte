<script lang="ts">
    import { events } from "@/stores/writeEvents";
    import { finalSeed } from "@/stores/writeFinalSeed";
    import Modal from "./Modal.svelte";
    import type { CalendarEvent } from "@/lib";

    let copied = false;
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify($events));
            copied = true;
        } catch (err) {
            alert(`Failed to copy: ${err}`);
        }
    };

    let showModal = false;
    let savedJson: string;

    const handleLoad = () => {
        const parsed = JSON.parse(savedJson) as CalendarEvent[];
        parsed.forEach((e: CalendarEvent) => {
            e.start = new Date(e.start);
            e.end = new Date(e.end);
        });
        $events = parsed;
        $events = $events;
        $finalSeed = null;
        showModal = false;
    };
</script>

<div class="level">
    <div class="level-left">
        <div class="level-item">
            <div class="control">
                <button class="button apButton" on:click="{copyToClipboard}">
                    {copied ? "Copied" : "Copy to clipboard"}
                </button>
            </div>
        </div>
        <div class="level-item">
            <div class="control">
                <button
                    class="button apButton"
                    on:click="{() => (showModal = true)}"
                >
                    Load saved JSON
                </button>
            </div>
        </div>
    </div>
</div>

<pre>
{JSON.stringify($events, null, 2)}
</pre>

<Modal
    title="Load JSON"
    show="{showModal}"
    buttons="{[
        {
            label: 'Load',
            style: 'is-success',
            callback: handleLoad,
        },
        {
            label: 'Close',
            callback: () => (showModal = false),
        },
    ]}"
>
    <div class="field">
        <label class="label" for="savedJSON">Paste saved JSON</label>
        <div class="control">
            <textarea class="textarea" id="savedJSON" bind:value="{savedJson}"
            ></textarea>
        </div>
    </div>
</Modal>
