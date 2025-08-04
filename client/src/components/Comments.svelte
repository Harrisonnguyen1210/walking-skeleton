<script>
  import { useCommentState } from "../states/commentState.svelte.js";
  const commentState = useCommentState();

  let comment = $state("");
  const addComment = () => {
    commentState.add(comment);
    comment = "";
  };
</script>

<h2>Add comment</h2>

<input type="text" bind:value={comment} /><br/>
<button onclick={addComment}>Add comment</button>

<h2>Comments</h2>

<ul>
  {#each commentState.comments as comment}
    <li>{comment}</li>
  {/each}
</ul>
