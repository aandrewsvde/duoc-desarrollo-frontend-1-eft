import { useState, useEffect, useMemo } from 'react'

import Navbar from './components/Navbar'
import Portada from './components/Portada'
import FiltroCategorias from './components/FiltroCategorias'
import ListaVideojuegos from './components/ListaVideojuegos'
import FormularioVideojuego from './components/FormularioVideojuego'
import FormularioContacto from './components/FormularioContacto'
import Carrito from './components/Carrito'
import EstadoCarga from './components/EstadoCarga'
import Footer from './components/Footer'

import { useVideojuegos } from './hooks/useVideojuegos'
import { normalizar } from './utils/formato'

/**
 * App — Componente raíz.
 *
 * Concentra el estado que más de un componente necesita y lo reparte hacia
 * abajo por props. Los hijos solo avisan de lo que el usuario hizo; quien
 * decide cómo cambia el estado es siempre este componente. Eso mantiene un
 * único dueño por dato y evita que dos partes de la interfaz se contradigan.
 *
 * Hooks utilizados:
 *   - useVideojuegos : hook propio que encapsula el useEffect del fetch.
 *   - useState       : catálogo, carrito, filtros y visibilidad del carrito.
 *   - useEffect      : sincroniza el título de la pestaña con el carrito.
 *   - useMemo        : evita recalcular el filtrado en cada renderizado.
 */
function App() {

  // ---------------------------------------------------------------------
  // 1. ESTADO: catálogo cargado desde el JSON
  //    `setVideojuegos` se expone porque el usuario puede agregar y
  //    eliminar títulos después de la carga inicial.
  // ---------------------------------------------------------------------
  const { videojuegos, setVideojuegos, cargando, error, recargar } = useVideojuegos()

  // ---------------------------------------------------------------------
  // 2. ESTADO: carrito de compras
  //    Cada línea tiene la forma { videojuego, cantidad }.
  // ---------------------------------------------------------------------
  const [carrito, setCarrito] = useState([])

  // ---------------------------------------------------------------------
  // 3. ESTADO: filtros y controles de la interfaz
  // ---------------------------------------------------------------------
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('todas')
  const [carritoVisible, setCarritoVisible] = useState(false)
  // Mensaje de confirmación tras enviar el formulario de contacto.
  const [avisoContacto, setAvisoContacto] = useState(null)

  // ---------------------------------------------------------------------
  // 4. VALORES DERIVADOS
  //    No se guardan en estado: se calculan desde el estado existente, que
  //    es la única fuente de verdad. Así no pueden quedar desincronizados.
  // ---------------------------------------------------------------------

  const unidades = carrito.reduce((suma, linea) => suma + linea.cantidad, 0)

  const total = carrito.reduce(
    (suma, linea) => suma + linea.videojuego.precio * linea.cantidad,
    0,
  )

  // Categorías únicas del catálogo actual. Se recalculan si se agrega un
  // videojuego de una categoría nueva.
  const categorias = useMemo(
    () => [...new Set(videojuegos.map((v) => v.categoria))].sort(),
    [videojuegos],
  )

  // Catálogo tras aplicar búsqueda y categoría. useMemo evita repetir este
  // trabajo cuando el componente se renderiza por otra causa, como abrir el
  // carrito.
  const videojuegosFiltrados = useMemo(() => {
    const texto = normalizar(busqueda)

    return videojuegos.filter((videojuego) => {
      const coincideCategoria = categoria === 'todas' || videojuego.categoria === categoria
      const coincideTexto =
        texto === '' ||
        normalizar(videojuego.nombre).includes(texto) ||
        normalizar(videojuego.categoria).includes(texto) ||
        normalizar(videojuego.descripcion).includes(texto)

      return coincideCategoria && coincideTexto
    })
  }, [videojuegos, busqueda, categoria])

  // ---------------------------------------------------------------------
  // 5. EFECTO SECUNDARIO: el título de la pestaña refleja el carrito
  // ---------------------------------------------------------------------
  useEffect(() => {
    document.title =
      unidades > 0
        ? `(${unidades}) PixelForge Games`
        : 'PixelForge Games | Tienda de videojuegos'
  }, [unidades])

  // ---------------------------------------------------------------------
  // 6. ACCIONES SOBRE EL CATÁLOGO
  //    Todas crean un arreglo nuevo en lugar de modificar el existente:
  //    React detecta los cambios comparando referencias, así que mutar el
  //    estado anterior no provocaría un nuevo renderizado.
  // ---------------------------------------------------------------------

  /** Agrega un videojuego nuevo al principio del catálogo. */
  function agregarVideojuego(datos) {
    setVideojuegos((actual) => {
      // El id se calcula sobre el catálogo del momento para no repetirlo
      // aunque se hayan eliminado títulos antes.
      const siguienteId = actual.reduce((max, v) => Math.max(max, v.id), 0) + 1
      return [{ ...datos, id: siguienteId }, ...actual]
    })
  }

  /** Elimina un videojuego del catálogo y del carrito si estaba allí. */
  function eliminarVideojuego(id) {
    setVideojuegos((actual) => actual.filter((v) => v.id !== id))
    // Dejarlo en el carrito mostraría un producto que ya no existe.
    setCarrito((actual) => actual.filter((linea) => linea.videojuego.id !== id))
  }

  // ---------------------------------------------------------------------
  // 7. ACCIONES SOBRE EL CARRITO
  // ---------------------------------------------------------------------

  /** Agrega un videojuego al carrito; si ya estaba, suma una unidad. */
  function agregarAlCarrito(videojuego) {
    setCarrito((actual) => {
      const existente = actual.find((linea) => linea.videojuego.id === videojuego.id)

      if (existente) {
        return actual.map((linea) =>
          linea.videojuego.id === videojuego.id
            ? { ...linea, cantidad: linea.cantidad + 1 }
            : linea,
        )
      }

      return [...actual, { videojuego, cantidad: 1 }]
    })
  }

  /** Suma una unidad a una línea existente. */
  function sumarUnidad(id) {
    setCarrito((actual) =>
      actual.map((linea) =>
        linea.videojuego.id === id ? { ...linea, cantidad: linea.cantidad + 1 } : linea,
      ),
    )
  }

  /** Resta una unidad y elimina la línea si llega a cero. */
  function restarUnidad(id) {
    setCarrito((actual) =>
      actual
        .map((linea) =>
          linea.videojuego.id === id ? { ...linea, cantidad: linea.cantidad - 1 } : linea,
        )
        .filter((linea) => linea.cantidad > 0),
    )
  }

  /** Quita una línea del carrito sin importar su cantidad. */
  function quitarDelCarrito(id) {
    setCarrito((actual) => actual.filter((linea) => linea.videojuego.id !== id))
  }

  /** Deja el carrito sin productos. */
  function vaciarCarrito() {
    setCarrito([])
  }

  /** Unidades de un videojuego concreto, para pintar el estado del botón. */
  function cantidadEnCarrito(id) {
    const linea = carrito.find((l) => l.videojuego.id === id)
    return linea ? linea.cantidad : 0
  }

  /** Restablece búsqueda y categoría. */
  function limpiarFiltros() {
    setBusqueda('')
    setCategoria('todas')
  }

  /** Guarda el aviso que se muestra tras enviar el formulario de contacto. */
  function recibirContacto(datos) {
    // En un sitio real esto saldría hacia un servicio de correo; aquí basta
    // con confirmar al usuario que el mensaje quedó registrado.
    console.info('Mensaje de contacto validado:', datos)
    setAvisoContacto(datos.nombre)
  }

  // ---------------------------------------------------------------------
  // 8. INTERFAZ
  // ---------------------------------------------------------------------
  return (
    <div className="d-flex flex-column min-vh-100">

      <Navbar
        unidades={unidades}
        total={total}
        carritoVisible={carritoVisible}
        onToggleCarrito={() => setCarritoVisible((v) => !v)}
      />

      <main className="flex-grow-1">

        <Portada totalCatalogo={videojuegos.length} />

        <section id="catalogo" className="container py-5">

          <h2 className="h3 fw-bold text-marca">Catálogo de videojuegos</h2>
          <p className="text-secondary">
            Los videojuegos se cargan dinámicamente desde un archivo JSON y se
            renderizan como tarjetas de Bootstrap.
          </p>

          {/* Renderizado condicional: el panel del carrito aparece solo
              cuando el usuario lo pide desde la barra de navegación. */}
          {carritoVisible && (
            <div className="mb-4">
              <Carrito
                lineas={carrito}
                unidades={unidades}
                total={total}
                onSumar={sumarUnidad}
                onRestar={restarUnidad}
                onEliminar={quitarDelCarrito}
                onVaciar={vaciarCarrito}
              />
            </div>
          )}

          {/* Renderizado condicional: mientras carga o si hubo error se
              muestra EstadoCarga; el catálogo solo cuando hay datos. */}
          {cargando || error ? (
            <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
          ) : (
            <>
              <FiltroCategorias
                busqueda={busqueda}
                onBuscar={setBusqueda}
                categoria={categoria}
                onCategoria={setCategoria}
                categorias={categorias}
                totalMostrados={videojuegosFiltrados.length}
                totalCatalogo={videojuegos.length}
                onLimpiar={limpiarFiltros}
              />

              <ListaVideojuegos
                videojuegos={videojuegosFiltrados}
                onAgregar={agregarAlCarrito}
                onEliminar={eliminarVideojuego}
                cantidadEnCarrito={cantidadEnCarrito}
                onLimpiar={limpiarFiltros}
              />
            </>
          )}

        </section>

        {/* Sección de administración: alta de videojuegos en el catálogo. */}
        <section id="administrar" className="bg-light border-top py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-9">
                <h2 className="h3 fw-bold text-marca">Administrar catálogo</h2>
                <p className="text-secondary">
                  Agrega un título nuevo o elimínalo desde su tarjeta. Los
                  cambios se reflejan al instante porque la lista vive en el
                  estado de React.
                </p>
                {/* Renderizado condicional: el formulario necesita las
                    categorías, que solo existen con el catálogo cargado. */}
                {categorias.length > 0 && (
                  <FormularioVideojuego
                    onAgregar={agregarVideojuego}
                    categorias={categorias}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        <FormularioContacto onEnviar={recibirContacto} />

        {/* Renderizado condicional: confirmación personalizada tras contacto. */}
        {avisoContacto && (
          <div className="container pb-4">
            <div className="alert alert-info d-flex justify-content-between align-items-center"
                 role="status">
              <span>
                Gracias por tu mensaje, <strong>{avisoContacto}</strong>. Te
                responderemos al correo indicado.
              </span>
              <button type="button" className="btn-close"
                      aria-label="Cerrar aviso"
                      onClick={() => setAvisoContacto(null)}></button>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  )
}

export default App
