import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite is the build tool that powers the dev server and bundles the app.
// This config just tells Vite to use the React plugin, which enables JSX.
export default defineConfig({
  plugins: [react()]
})
