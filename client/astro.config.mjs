import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import deno from "@deno/astro-adapter";
import mdx from "@astrojs/mdx";

export default defineConfig({
  adapter: deno(),
  integrations: [svelte(), mdx()],
});