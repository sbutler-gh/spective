<script>
    import { points_prompt_store, points_store, prompts_store, current_prompt_store, map_center_store, route_store } from '$lib/stores';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    // dispatch('closeintromodal', {
	// 		// name: campaign_name,
    //   // impact: impact,
    // //   perspective: perspective
	// });

  // When the user submits their prompt, this function pushes it to the backend and shows it as current prompt.
//   async function submitPrompt(e) {

//     // Getting the data from the form submission, which is only the "content" textarea right now.
//     var formData = new FormData(e.target);


//     // Sending all of this to the create_prompt endpoint
//     const response = await fetch('/create_prompt', {
//     method: 'post',
//     body: formData
//     })

//     if (response.ok) {

//     let response_json = await response.json();

//     let prompts_array = $prompts_store;

//     prompts_array.push(response_json[0]);

//     $prompts_store = prompts_array;

//     $current_prompt_store = response_json[0];

//     // We use an event dispatcher to bubble up the update prompt function to index.svelte

//     dispatch('updateprompt', {
// 			// name: campaign_name,
//       // impact: impact,
//     //   perspective: perspective
// 	});

//     }

//     else {
//     let response_json = await response.json();
//     console.log(response_json);
//     console.log(response_json.status);
//     console.log(response.body);
//     }

// }

</script>

<main class="modal">
<h3 style="text-align: center;">Welcome!</h3>

<p>With this tool, you can respond to prompts, gather community sentiments, create resource maps, conduct participatory budgeting surveys, and all sorts of activities.</p>
<p><strong>Add a response:</strong> To add a response to a prompt, click the <strong>+ Add Response button</strong>.  Then select a location on the map for your response, and enter your content in the form.</p>
<p><strong>Create a prompt:</strong> To create your own prompt, click <strong>Add Prompt</strong> in the top-right corner.  Then enter your prompt in the form, and click Submit.  Others can now submit responses specific to your prompt.</p>
<p><strong>Change prompts:</strong>To view different prompts and responses, click <strong>All Prompts</strong> in the top-left corner.  Look at the list of prompts, and select any prompt you'd like to view.</p>

<button on:click={function() {dispatch('closeintromodal', {})}} style="margin: auto; text-align: center; display: block; font-size: 18px;">Enter</button>

<span style="position: absolute; top: 4px; right: 4px;" on:click={function() {dispatch('closeintromodal', {})}}>
  <!-- <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-check" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <circle cx="12" cy="12" r="9" />
  <path d="M9 12l2 2l4 -4" />
</svg> -->
<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <line x1="18" y1="6" x2="6" y2="18" />
  <line x1="6" y1="6" x2="18" y2="18" />
</svg>
</span>
</main>

<style>

</style>