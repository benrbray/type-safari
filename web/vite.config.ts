import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import {lezer} from "@lezer/generator/rollup"

export default defineConfig({
  plugins: [solid(), lezer()],
})
