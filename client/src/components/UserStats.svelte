<script>
    import { useUserState } from "../states/userState.svelte.js";
    let userState = useUserState();
    let stats = $state("");

    const listenStats = async () => {
        const eventSource = new EventSource("/api/stats/sse-active-users");

        eventSource.onmessage = (event) => {
            stats = event.data;
        };
    };

    $effect(() => {
        if (!import.meta.env.SSR && userState.email) {
            listenStats();
        }
    });
</script>

{#if !userState.email}
    <a href="/auth/login">Login</a>
{:else}
    <p>{userState.email}</p>
    <p>{stats}</p>
{/if}
