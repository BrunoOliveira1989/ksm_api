import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/**/*.ts', '!./src/test/**/*'],
  format: 'esm',
  outDir: 'dist',
  clean: true,
})
