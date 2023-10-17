<script lang="ts">
    import { nanoid } from "nanoid";
    import { events } from "@/stores/writeEvents";
    import { finalSeed } from "@/stores/writeFinalSeed";
    import { genWeather } from "@/lib";
    import { DateInput } from "date-picker-svelte";

    let seed = nanoid();
    let startDate = new Date(new Date().getFullYear(), 0, 1);
    let numDays: number = 30;
    let climate: "arid" | "temperate" | "tropical" = "temperate";

    const handleGenerate = () => {
        $finalSeed = { seed, climate };
        events.set(genWeather(seed, numDays, startDate, climate));
    };
</script>

<article>
    <div class="field">
        <label class="label" for="seed">Random number generator seed</label>
        <div class="control">
            <input class="input" type="text" name="seed" bind:value="{seed}" />
        </div>
        <p class="help">
            The same seed and climate choice will produce the same weather
            sequence.
        </p>
    </div>
    <div class="field">
        <label class="label" for="climateChoice">General climate</label>
        <div class="control">
            <label class="radio">
                <input
                    type="radio"
                    name="climate"
                    bind:group="{climate}"
                    value="arid"
                />
                Arid
            </label>
            <label class="radio">
                <input
                    type="radio"
                    name="climate"
                    bind:group="{climate}"
                    value="temperate"
                />
                Temperate
            </label>
            <label class="radio">
                <input
                    type="radio"
                    name="climate"
                    bind:group="{climate}"
                    value="tropical"
                />
                Tropical
            </label>
        </div>
        <p class="help">
            The same seed and climate type will produce the same weather
            sequence.
        </p>
    </div>
    <div class="field">
        <label class="label" for="numDays">Number of days to generate</label>
        <div class="control">
            <input
                class="input"
                type="number"
                name="numDays"
                bind:value="{numDays}"
                min="1"
            />
        </div>
    </div>
    <div class="field">
        <label class="label" for="startDate">Start date</label>
        <div class="control">
            <DateInput bind:value="{startDate}" format="yyyy-MM-dd" />
        </div>
    </div>

    <div class="control">
        <button class="button apButton" on:click="{handleGenerate}"
            >Generate weather</button
        >
    </div>
</article>
