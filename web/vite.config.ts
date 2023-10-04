import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import {lezer} from "@lezer/generator/rollup"

export default defineConfig({
  plugins: [solid(), lezer()],
  base: "/type-safari/lib",
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: "src/main.tsx",
      name: 'TypeSafari',
      // the proper extensions will be added
      fileName: 'type-safari',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        "./src/shared.css"
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {},
      },
    },
  },
})
