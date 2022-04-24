import { writable } from "svelte/store";

let points_store = writable([
        ]
);

let prompts_store = writable();

let points_prompt_store = writable([
]
);

let current_prompt_store = writable();

export { points_store, prompts_store, points_prompt_store, current_prompt_store };