import { Hono } from "@hono/hono";
import { serveStatic } from "@hono/hono/deno";

const app = new Hono();

const getItems = async () => {
  await new Promise((resolve) => setTimeout(resolve, 20));
  const items = Array.from(
    { length: 1000 },
    (_, i) => ({ id: i, name: `Item ${i}` }),
  );
  return items;
};

app.use("/public/*", serveStatic({ root: "." }));

app.get("/items", async (c) => {
  const items = await getItems();
  return c.json(items);
});

app.get("/ssr", async (c) => {
  const items = await getItems();

  return c.html(`<html>
    <head>
    </head>
    <body>
      <ul>
        ${items.map((item) => `<li>${item.name}</li>`).join("")}
      </ul>
    </body>
  </html>`);
});

export default app;
