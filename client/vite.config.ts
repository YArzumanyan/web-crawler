import { defineConfig, loadEnv } from "vite";
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: "/",
    plugins: [react()],
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    server: {
      proxy: {
        "/graphql": {
          target: env.SERVER_URL,
          changeOrigin: true,
          secure: false
        },
      },
    }
  }
})
