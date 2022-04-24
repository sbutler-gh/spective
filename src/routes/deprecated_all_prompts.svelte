<script>
    import { points_prompt_store, points_store, prompts_store, current_prompt_store, route_store } from '$lib/stores';
</script>

<main class="black">
    <header class="prompt-header">
    <a href="/">Back</a>
    <a href="/add_prompt" style="margin-left: auto; display: block;">Add Prompt</a>
    </header>
    {#each $prompts_store as prompt}
        <p id="prompt" style="max-width: 600px; margin: auto; padding: 20px;">{prompt.content}</p>
        <!-- <button>+ Add New</button> -->
        <hr style="color: white">
    {/each}
</main>

<style>

</style>