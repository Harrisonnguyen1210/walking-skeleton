<script>
  import { countState } from "../states/countState.svelte.js";
</script>

<button onclick={() => countState.count++}>Count {countState.count}!</button>