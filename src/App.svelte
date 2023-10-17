<script lang="ts">
    import { events } from "./stores/writeEvents";
    import Config from "@/components/Config.svelte";
    import View from "@/components/View.svelte";
    import Export from "@/components/Export.svelte";
    import About from "@/components/About.svelte";

    let activeTab: "start" | "calendar" | "export" | "about" = "start";
    events.subscribe((lst) => {
        if (lst.length > 0) {
            activeTab = "calendar";
        }
    });
</script>

<main class="container p-6">
    <h1 class="title">Fantasy Weather Generator</h1>
    <!-- svelte-ignore missing-declaration -->
    <p class="version subtitle">Version: {__APP_VERSION__}</p>

    <div class="tabs is-boxed">
        <ul>
            <li class="{activeTab === 'start' ? 'is-active' : ''}">
                <a on:click="{() => (activeTab = 'start')}">Generate</a>
            </li>
            <li class="{activeTab === 'calendar' ? 'is-active' : ''}">
                <a on:click="{() => (activeTab = 'calendar')}">View Calendar</a>
            </li>
            <li class="{activeTab === 'export' ? 'is-active' : ''}">
                <a on:click="{() => (activeTab = 'export')}">Save/Load</a>
            </li>
            <li class="{activeTab === 'about' ? 'is-active' : ''}">
                <a on:click="{() => (activeTab = 'about')}">About</a>
            </li>
        </ul>
    </div>

    {#if activeTab === "start"}
        <Config />
    {:else if activeTab === "calendar"}
        <View />
    {:else if activeTab === "export"}
        <Export />
    {:else if activeTab === "about"}
        <About />
    {/if}
</main>

<style>
</style>
