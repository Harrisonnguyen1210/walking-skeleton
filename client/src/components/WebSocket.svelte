<script>
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

    if (!import.meta.env.SSR) {
        openConnection();
    }
</script>

<p>Chat!</p>

<input type="text" bind:value={message} />
<button onclick={() => sendMessage()}>Send</button>

<ul>
    {#each messages as message}
        <li>{message.message}</li>
    {/each}
</ul>
