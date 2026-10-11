# PixelForge Games — Tienda de videojuegos

**Evaluación Final Transversal** · Desarrollo Frontend I (PFY2201)
Autor: **Agustín Andrews**

Sitio de comercio electrónico para una tienda de videojuegos, construido con **React 19**,
**Vite 8** y **Bootstrap 5.3**. Muestra un catálogo cargado dinámicamente, permite filtrarlo por
categoría, administrar los títulos, agregar productos a un carrito y enviar un mensaje de contacto
con validación.

**Sitio en línea:** https://aandrewsvde.github.io/duoc-desarrollo-frontend-1-eft/

---

## Índice

1. [Requisitos previos](#requisitos-previos)
2. [Instalación](#instalación)
3. [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
4. [Guía de uso](#guía-de-uso)
5. [Estructura del proyecto](#estructura-del-proyecto)
6. [Decisiones técnicas](#decisiones-técnicas)
7. [Publicación en GitHub Pages](#publicación-en-github-pages)
8. [Solución de problemas](#solución-de-problemas)

---

## Requisitos previos

| Herramienta | Versión mínima | Cómo comprobarlo |
|---|---|---|
| Node.js | 20.19 o superior (LTS recomendada) | `node -v` |
| npm | 10 o superior | `npm -v` |

Si no tienes Node.js, descárgalo desde [nodejs.org](https://nodejs.org/). No hace falta instalar
nada más: todas las dependencias, incluida Bootstrap, se resuelven con npm.

Versiones usadas durante el desarrollo: Node 22.23.2, npm 10.9.8, React 19.3.0, Vite 8.3.4,
Bootstrap 5.3.8.

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/aandrewsvde/duoc-desarrollo-frontend-1-eft.git

# 2. Entrar a la carpeta del proyecto
cd duoc-desarrollo-frontend-1-eft

# 3. Instalar las dependencias
npm install
```

El paso 3 descarga React, Vite y Bootstrap en `node_modules/`. Tarda alrededor de un minuto la
primera vez.

---

## Cómo ejecutar el proyecto

```bash
npm run dev
```

Vite imprime la URL en la terminal. El proyecto está configurado para GitHub Pages, así que la
aplicación se sirve en:

```
http://localhost:5173/duoc-desarrollo-frontend-1-eft/
```

Esa es la misma ruta que en producción, a propósito: cualquier problema de rutas aparece en local
y no al desplegar.

### Todos los comandos disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Genera el build de producción en `dist/` |
| `npm run preview` | Sirve el build tal como quedará publicado |
| `npm run lint` | Revisa el código con oxlint |
| `npm run deploy` | Compila y publica en la rama `gh-pages` |

---

## Guía de uso

### Explorar el catálogo

Los videojuegos se cargan al abrir la página. Cada tarjeta muestra **imagen, nombre, precio y
descripción**, además de su categoría y el stock disponible.

### Filtrar

Hay tres formas de acotar el catálogo, y se combinan entre sí:

- **Buscador:** escribe parte del nombre, la categoría o la descripción. No distingue tildes, así
  que escribir `orbita` encuentra *Órbita Cero*.
- **Desplegable de categoría:** elige una de las seis categorías.
- **Botones de categoría:** el mismo filtro a un clic.

El botón **Limpiar filtros** aparece solo cuando hay algún filtro activo. Si ninguna combinación
devuelve resultados, el sitio lo explica y ofrece volver al catálogo completo.

### Comprar

- **Agregar al carrito**: el botón cambia a *En el carrito (n)* y se pone verde.
- **Ver carrito** (barra superior): abre el detalle, con el total y los controles `−`, `+` y
  *Quitar* por línea.
- El contador de la barra y el título de la pestaña del navegador se actualizan solos.

### Administrar el catálogo

En la sección **Administrar**:

- **Agregar un videojuego**: completa nombre, categoría, precio, portada y descripción. El título
  aparece de inmediato al inicio de la grilla.
- **Eliminar un videojuego**: con el botón *Eliminar del catálogo* de cada tarjeta. Si estaba en el
  carrito, también se quita de ahí.

> Los cambios viven en el estado de React, así que se pierden al recargar la página. El archivo
> JSON no se modifica.

### Contactar

El formulario de la sección **Contacto** pide nombre, correo y mensaje, y valida los tres antes de
dar por enviado nada:

| Campo | Regla |
|---|---|
| Nombre | Obligatorio, mínimo 3 caracteres |
| Correo | Obligatorio y con formato `nombre@dominio.ext` |
| Mensaje | Obligatorio, mínimo 10 caracteres |

Los errores aparecen bajo cada campo y el foco salta al primero con problema. Solo cuando todo es
válido se muestra la confirmación.

---

## Estructura del proyecto

```
duoc-desarrollo-frontend-1-eft/
├── index.html                  Documento raíz donde monta React
├── vite.config.js              Configuración de Vite y base de GitHub Pages
├── package.json                Dependencias y scripts
├── public/
│   ├── data/videojuegos.json   Catálogo que se carga con fetch
│   └── img/                    Logotipo y portadas (SVG)
├── src/
│   ├── main.jsx                Punto de entrada; importa Bootstrap
│   ├── App.jsx                 Estado central y composición de la página
│   ├── index.css               Identidad visual sobre Bootstrap
│   ├── components/             11 componentes reutilizables
│   │   ├── Navbar.jsx              Barra de navegación y carrito
│   │   ├── Portada.jsx             Sección de bienvenida
│   │   ├── FiltroCategorias.jsx    Buscador y filtros
│   │   ├── ListaVideojuegos.jsx    Grilla de tarjetas
│   │   ├── VideojuegoCard.jsx      Tarjeta individual
│   │   ├── FormularioVideojuego.jsx  Alta en el catálogo
│   │   ├── FormularioContacto.jsx    Mensaje al administrador
│   │   ├── CampoFormulario.jsx     Campo con etiqueta y error
│   │   ├── Carrito.jsx             Panel del carrito
│   │   ├── EstadoCarga.jsx         Carga y errores
│   │   └── Footer.jsx              Pie de página
│   ├── hooks/
│   │   ├── useVideojuegos.js   Carga del catálogo (useEffect + fetch)
│   │   └── useFormulario.js    Mecánica común de los dos formularios
│   └── utils/
│       ├── formato.js          Precio, normalización de texto, rutas
│       └── validacion.js       Reglas de validación puras
└── capturas/                   Capturas de la aplicación funcionando
```

17 archivos de código, 1.656 líneas.

---

## Decisiones técnicas

### HTML semántico y maquetación

El marcado usa `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<address>` y `<footer>`,
con un solo `<h1>` y jerarquía de encabezados sin saltos. La maquetación la resuelve el sistema de
cuadrículas de Bootstrap (`row`, `col`, `row-cols-*`), que está construido sobre Flexbox; los
ajustes propios de `index.css` se limitan a los colores de marca.

| Dispositivo | Ancho | Tarjetas por fila | Barra de navegación |
|---|---|---|---|
| Móvil | < 768 px | 1 | Colapsada (hamburguesa) |
| Tablet | 768 – 991 px | 2 | Colapsada (hamburguesa) |
| Escritorio | ≥ 992 px | 3 | Desplegada |

### Componentes de Bootstrap

Navbar con colapso, cards, formularios (`form-control`, `form-select`, `is-invalid`,
`invalid-feedback`), alertas, insignias, grupos de botones, spinner y listas.

### Generación dinámica del contenido

El catálogo no está escrito en el HTML: se pide con `fetch` a `public/data/videojuegos.json` y se
recorre con `.map()` para producir una tarjeta por título. Cada vez que cambia el estado —un
filtro, un alta, una eliminación, un cambio en el carrito— React vuelve a calcular ese recorrido y
actualiza el DOM.

Donde el framework no alcanza se usa la API del DOM directamente, que es la forma correcta de
hacerlo en React:

- `document.getElementById(...).scrollIntoView()` en `Navbar.jsx` y `Portada.jsx`, para el
  desplazamiento entre secciones.
- `element.focus()` en `useFormulario.js`, para llevar el foco al primer campo inválido.
- `document.title` en `App.jsx`, para reflejar el carrito en la pestaña del navegador.

### React: estado, props y modularidad

El estado vive en `App.jsx` y baja por props; los componentes hijos avisan hacia arriba mediante
funciones que también reciben por props. Así cada dato tiene un único dueño y dos partes de la
interfaz no pueden contradecirse.

| Estado | Dónde | Para qué |
|---|---|---|
| `videojuegos` | `useVideojuegos.js` | El catálogo; se puede ampliar y reducir |
| `cargando`, `error` | `useVideojuegos.js` | Situación de la petición |
| `carrito` | `App.jsx` | Líneas seleccionadas |
| `busqueda`, `categoria` | `App.jsx` | Filtros activos |
| `carritoVisible` | `App.jsx` | Panel del carrito abierto o cerrado |
| `avisoContacto` | `App.jsx` | Confirmación tras el formulario |
| `menuAbierto` | `Navbar.jsx` | Menú colapsado en móvil |
| `valores`, `errores`, `visitados`, `enviado` | `useFormulario.js` | Estado de cada formulario |

Las acciones nunca modifican el arreglo existente: crean uno nuevo con `map`, `filter` o
propagación, porque React detecta los cambios comparando referencias.

Dos hooks propios evitan duplicación: `useVideojuegos` encapsula la carga de datos y
`useFormulario` la mecánica que comparten los dos formularios (valores, validación, errores, foco
y limpieza). El componente `CampoFormulario` hace lo mismo con el marcado de los campos.

### Renderizado condicional

Botón que pasa de *Agregar al carrito* a *En el carrito (n)*; insignia de stock; mensaje de carrito
vacío; *Ver carrito* ⇄ *Ocultar carrito*; indicador de carga ⇄ alerta de error; aviso de búsqueda
sin resultados; botón de limpiar filtros; mensajes de error de cada campo; confirmaciones de envío.

---

## Publicación en GitHub Pages

La clave está en `base`, dentro de `vite.config.js`:

```js
base: '/duoc-desarrollo-frontend-1-eft/'
```

Sin eso, el despliegue sube correctamente pero el navegador busca los archivos JS y CSS en la raíz
del dominio y la página sale en blanco.

```bash
npm run deploy
```

El script compila y sube `dist/` a la rama `gh-pages`. Después, en **Settings → Pages** del
repositorio, selecciona la rama `gh-pages` y la carpeta `/ (root)`.

---

## Solución de problemas

| Síntoma | Causa probable | Solución |
|---|---|---|
| La página sale en blanco al desplegar | `base` no coincide con el nombre del repositorio | Corrige `base` en `vite.config.js` y vuelve a desplegar |
| `npm install` falla | Versión de Node demasiado antigua | Actualiza a Node 20.19 o superior |
| Aparece "No pudimos cargar el catálogo" | El archivo JSON no se alcanzó | Pulsa *Reintentar*; si persiste, revisa que exista `public/data/videojuegos.json` |
| El puerto 5173 está ocupado | Otro proceso lo está usando | `npm run dev -- --port 5174` |
| `git push` devuelve 403 | El token no tiene permiso de escritura | Concede **Contents: Read and write** al token, o usa SSH |

---

## Nota sobre el contenido

Los nombres de los videojuegos, los precios y los datos de la tienda son **ficticios** y fueron
creados para esta evaluación. Las portadas son archivos SVG generados para el proyecto.
