const loadRemaining = async () => {
    const list = document.getElementById("list");
    const items = await fetch("http://localhost:8000/items/remaining");
    const json = await items.json();
  
    document.getElementById("last")?.remove();
  
    for (const item of json) {
      const li = document.createElement("li");
      li.textContent = item.name;
      list.appendChild(li);
    }
  };
  
  export { loadRemaining };