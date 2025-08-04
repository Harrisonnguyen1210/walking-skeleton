<script>
  import { useCountState } from "../states/countState.svelte.js";
  const counter = useCountState();
</script>

<button onclick={counter.increment}>Count {counter.count}!</button>