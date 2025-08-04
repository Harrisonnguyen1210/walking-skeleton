<script>
  import { useCountState } from "../states/countState.svelte.js";
  const countState = useCountState();
</script>

<button onclick={() => countState.increment()}>
  Count {countState.count ?? "◌"}!
</button>