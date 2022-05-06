<script>
    import { points_prompt_store, points_store, prompts_store, current_prompt_store, map_center_store, route_store } from '$lib/stores';
    import { createEventDispatcher } from 'svelte';
    import { goto } from '$app/navigation';

    const dispatch = createEventDispatcher();

  // When the user submits their prompt, this function pushes it to the backend and shows it as current prompt.
  async function submitPrompt(e) {

    // Getting the data from the form submission, which is only the "content" textarea right now.
    var formData = new FormData(e.target);


    // Sending all of this to the create_prompt endpoint
    const response = await fetch('/create_prompt', {
    method: 'post',
    body: formData
    })

    if (response.ok) {

    let response_json = await response.json();

    let prompts_array = $prompts_store;

    prompts_array.push(response_json[0]);

    $prompts_store = prompts_array;

    $current_prompt_store = response_json[0];

    let updated_url = window.location.origin + "?prompt=" + $current_prompt_store.id;

    // $page.url = updated_url;

    goto(updated_url);

    // We use an event dispatcher to bubble up the update prompt function to index.svelte

    dispatch('updateprompt', {
			// name: campaign_name,
      // impact: impact,
    //   perspective: perspective
	});

    }

    else {
    let response_json = await response.json();
    console.log(response_json);
    console.log(response_json.status);
    console.log(response.body);
    }

}

</script>

<main class="black">
<form on:submit|preventDefault={submitPrompt} style="margin: auto; max-width: 600px;">


    <header class="prompt-header">
    <a on:click={function() { $route_store = ""}}>Back</a>
    </header>
    
    <label>Enter your prompt</label>
    <textarea name="content" style="font-size: 16px; margin: 10px 0px; background: black; color: white; display: block; width: 100%;" rows=20></textarea>
    <button style="display: block; margin-left: auto;">Submit</button>
</form>
</main>

<style>

</style>