<script>
  import { useCommentState } from "../states/commentState.svelte.js";
  const commentState = useCommentState();
</script>

<p>Total comments: {commentState.count}</p>