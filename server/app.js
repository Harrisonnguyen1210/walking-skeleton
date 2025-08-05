import { Hono } from "@hono/hono";
import { serveStatic } from "@hono/hono/deno";
import { streamSSE } from "jsr:@hono/hono@4.6.5/streaming";

const app = new Hono();
const streams = new Set();

const getItems = async () => {
  await new Promise((resolve) => setTimeout(resolve, 20));
  const items = Array.from(
    { length: 1000 },
    (_, i) => ({ id: i, name: `Item ${i}` }),
  );
  return items;
};

const getInitialItems = async () => {
  await new Promise((resolve) => setTimeout(resolve, 20));
  return Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }));
};
const getRemainingItems = async () => {
  await new Promise((resolve) => setTimeout(resolve, 20));
  return Array.from(
    { length: 900 },
    (_, i) => ({ id: i + 100, name: `Item ${i + 100}` }),
  );
};

app.use("/public/*", serveStatic({ root: "." }));

app.get("/items", async (c) => {
  const items = await getItems();
  return c.json(items);
});

app.get("/api", (c) => {
  return c.text("Hello new path!");
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

app.get("/items/remaining", async (c) => {
  const items = await getRemainingItems();
  return c.json(items);
});

app.get("/hybrid", async (c) => {
  const items = await getInitialItems();

  return c.html(`<html>
    <head>
      <script>
        document.addEventListener("DOMContentLoaded", () => {
          const observer = new IntersectionObserver((entries, obs) => {
            if (entries[0].isIntersecting) {
              import("/public/loadRemaining.js").then((module) => {
                module.loadRemaining();
              });
              obs.disconnect();
            }
          });

          observer.observe(document.getElementById('last'));
        });
      </script>
    </head>
    <body>
      <ul id="list">
        ${items.map((item) => `<li>${item.name}</li>`).join("")}
        <li id="last">Loading...</li>
      </ul>
    </body>
  </html>`);
});

const broadcastActiveUsers = () => {
  const message = `Active users: ${streams.size}`;
  for (const stream of streams) {
    stream.writeSSE({
      data: message,
    });
  }
};

app.get("/api/stats/sse-active-users", (c) => {
  return streamSSE(c, async (stream) => {
    streams.add(stream);

    broadcastActiveUsers();

    while (!stream.aborted && !stream.closed) {
      await stream.sleep(1000);
    }

    streams.delete(stream);
    broadcastActiveUsers();
  });
});

export default app;
