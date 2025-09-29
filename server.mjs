import express from "express";
import { MultiServerManager } from "@modelcontextprotocol/sdk/client";

const app = express();
const port = process.env.PORT || 10000;

app.get("/", (_, res) => res.send("OK")); // healthcheck

app.get("/mcp/tools", async (_, res) => {
  try {
    const manager = new MultiServerManager({ name: "demo-client", version: "1.0.0" }, {});
    await manager.addServer("rentcast", {
      type: "sse",
      url: "https://developers.rentcast.io/mcp",
      headers: { "X-Api-Key": process.env.RENTCAST_API_KEY }
    });

    const client = manager.getClient("rentcast");
    await client.connect();
    const tools = await client.listTools();
    await client.close();

    res.json(tools);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err?.message || err) });
  }
});

app.listen(port, () => {
  console.log(`Server listening on :${port}`);
});
