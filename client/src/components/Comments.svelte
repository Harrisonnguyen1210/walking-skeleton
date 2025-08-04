<!-- add something here-->
<script>
    import { commentState } from "../states/commentState.svelte.js";
    let newComment = "";
    const addComment = () => {
        commentState.comments.push(newComment);
        newComment = "";
    };
</script>

<input
    type="text"
    bind:value={newComment}
/>
<button onclick={addComment}>Add</button>
<ul>
    {#each commentState.comments as comment}
        <li>{comment}</li>
    {/each}
</ul>
