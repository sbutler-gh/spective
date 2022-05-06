<script>
    import { points_prompt_store, points_store, prompts_store, current_prompt_store, route_store } from '$lib/stores';
    import { createEventDispatcher } from 'svelte';
    import {page} from '$app/stores'
import { goto } from '$app/navigation';

const dispatch = createEventDispatcher();

    function updatePrompt(e) {
        console.log(e.target.id);
        $current_prompt_store = e.target.id;

        $current_prompt_store = $prompts_store.find(prompt => prompt.id == e.target.id);

        console.log($current_prompt_store.content);

        let updated_url = window.location.origin + "?prompt=" + e.target.id;

        // $page.url = updated_url;

        goto(updated_url);

            dispatch('updateprompt', {
			// name: campaign_name,
      // impact: impact,
    //   perspective: perspective
	});
    }
</script>

<main class="black">
    <header class="prompt-header">
    <a on:click={function() { $route_store = ""}}>Back</a>
    <a on:click={function() { $route_store = "AddPrompt"}} style="margin-left: auto; display: block;">Add Prompt</a>
    </header>
    {#each $prompts_store as prompt}
        <p id={prompt.id} on:click={updatePrompt} style="max-width: 600px; margin: auto; padding: 20px; cursor: pointer;">{prompt.content}</p>
        <!-- <button>+ Add New</button> -->
        <hr style="color: white">
    {/each}
</main>

<style>

</style>