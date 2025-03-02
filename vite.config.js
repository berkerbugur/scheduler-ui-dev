import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        open: true,
        host: true,
        port: 3000,
        cors: {
            origin: "http://localhost:9080",
            methods: ["PUT", "POST", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
            preflightContinue: true
        }
    },
})
