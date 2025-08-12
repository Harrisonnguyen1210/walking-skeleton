import { Hono } from "@hono/hono";
import { serveStatic } from "@hono/hono/deno";
import { streamSSE } from "jsr:@hono/hono@4.6.5/streaming";
import { upgradeWebSocket } from "@hono/hono/deno";
import { auth } from "./auth.js";

const app = new Hono();
const streams = new Set();
const sockets = new Set();
const socketsToNames = new Map();
const channels = new Map();

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

app.get(
  "/api/ws-chat",
  upgradeWebSocket((c) => {
    return {
      onOpen: (event, ws) => {
        sockets.add(ws);
        socketsToNames.set(ws, `User ${Math.floor(1000 * Math.random())}`);
      },
      onMessage(event, ws) {
        const name = socketsToNames.get(ws);
        const message = JSON.parse(event.data);
        message.date = Date.now();
        message.message = `${name}: ${message.message}`;

        for (const socket of sockets) {
          socket.send(
            JSON.stringify(message),
          );
        }
      },
      onClose: (event, ws) => {
        sockets.delete(ws);
        socketsToNames.delete(ws);
        ws.close();
      },
      onError: (event, ws) => {
        sockets.delete(ws);
        socketsToNames.delete(ws);
        ws.close();
      },
    };
  }),
);

app.get(
  "/api/chat",
  upgradeWebSocket((c) => {
    return {
      onMessage(event, ws) {
        try {
          const data = JSON.parse(event.data);

          // Handle subscribing to a channel
          if (data.subscribe) {
            const channelName = data.subscribe;

            if (!channels.has(channelName)) {
              channels.set(channelName, new Set());
            }

            // Add this WebSocket connection to the channel
            channels.get(channelName).add(ws);
            return;
          }

          // Handle sending messages to a channel
          if (data.channel && data.message) {
            const channelName = data.channel;
            const message = data.message;

            if (channels.has(channelName)) {
              for (const socket of channels.get(channelName)) {
                socket.send(
                  JSON.stringify({
                    channel: channelName,
                    message,
                  }),
                );
              }
            }
          }
        } catch (e) {
          console.error("Invalid message format:", e);
        }
      },

      onClose(event, ws) {
        // Remove the closed WebSocket from all channels
        for (const subs of channels.values()) {
          subs.delete(ws);
        }
        ws.close();
      },

      onError(event, ws) {
        // Cleanup on error
        for (const subs of channels.values()) {
          subs.delete(ws);
        }
        ws.close();
      },
    };
  }),
);

app.get("/api/lgtm-test", (c) => {
  console.log("Hello log collection :)");
  return c.json({ message: "Hello, world!" });
});

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

export default app;
