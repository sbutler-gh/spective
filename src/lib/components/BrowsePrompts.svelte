<script>
    import { points_prompt_store, points_store, prompts_store, current_prompt_store } from '$lib/stores';
</script>

{#each $prompts_store as prompt}
<div style="background: black; color: white;">
    <p id="prompt" style="max-width: 600px; margin: auto;">{prompt.content}</p>
    <!-- <button>+ Add New</button> -->
  </div>
  <hr>
{/each}