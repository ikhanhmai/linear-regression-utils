import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    entry: './src/index.ts',
    resolve: true,
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react'],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
