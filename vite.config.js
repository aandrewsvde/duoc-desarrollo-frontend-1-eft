import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Configuración de Vite.
 *
 * `base` es lo que permite publicar en GitHub Pages: el sitio no se sirve
 * desde la raíz del dominio sino desde
 *   https://<usuario>.github.io/<repositorio>/
 * Si no coincide con esa ruta, el despliegue sube bien pero el navegador
 * busca los archivos JS y CSS en la raíz y la página sale en blanco.
 *
 * Se deja fijo (no condicional) a propósito: así `npm run dev` y
 * `npm run preview` sirven la aplicación en la misma ruta que producción y
 * cualquier problema del base path se detecta en local, no al desplegar.
 *
 * IMPORTANTE: si se renombra el repositorio en GitHub hay que actualizar
 * este valor y `homepage` en package.json.
 *
 * https://vite.dev/config/
 */
export default defineConfig({
  plugins: [react()],
  base: '/duoc-desarrollo-frontend-1-eft/',
})
