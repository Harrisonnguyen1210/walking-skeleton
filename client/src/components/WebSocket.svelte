<script>
    import { useUserState } from "../states/userState.svelte.js";
    let userState = useUserState();
    let message = $state("");
    let messages = $state([]);
    let connection = "";

    const reconnect = () => {
        setTimeout(() => {
            connection.close();
            openConnection();
        }, 500);
    };

    const openConnection = async () => {
        connection = new WebSocket("/api/ws-chat");

        connection.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            messages = [newMessage, ...messages];
            messages = messages.slice(0, 10);
        };

        connection.onclose = () => {
            reconnect();
        };

        connection.onerror = () => {
            reconnect();
        };
    };

    const sendMessage = async () => {
        connection.send(JSON.stringify({ message }));
        message = "";
    };

    $effect(() => {
        if (userState.email) {
            openConnection();
        }
    });
</script>

{#if !userState.email}
    <p>
        Chatting is only for authenticated users. <a href="/auth/login">Login</a
        >
        or
        <a href="/auth/register">Register</a>.
    </p>
{:else}
    <p>Chat!</p>

    <input type="text" bind:value={message} />
    <button onclick={() => sendMessage()}>Send</button>

    <ul>
        {#each messages as message}
            <li>{message.message}</li>
        {/each}
    </ul>
{/if}
