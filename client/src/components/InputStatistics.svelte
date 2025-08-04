<!-- implement functionality for input statistics here -->
<script>
    let inputValue = "";
    let numbers = [];
    let sum = 0;
    let count = 0;

    const updateStats = () => {
        sum = numbers.reduce((a, b) => a + b, 0);
        count = numbers.length;
    };

    const addNumber = () => {
        numbers = [...numbers, parseFloat(inputValue)];
        updateStats();
        inputValue = "";
    };
</script>

<input type="number" bind:value={inputValue} />
<button onclick={addNumber}>Add</button>

<ul>
    {#each numbers as num}
        <li>{num}</li>
    {/each}
</ul>

<p>Sum: {sum}</p>
<p>Total numbers: {count}</p>
