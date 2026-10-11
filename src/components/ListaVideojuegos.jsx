import VideojuegoCard from './VideojuegoCard'

/**
 * ListaVideojuegos — Grilla responsiva de tarjetas.
 *
 * Recorre la lista que recibe y delega cada elemento en VideojuegoCard. El
 * filtrado ocurre antes, en App: este componente solo dibuja lo que le pasan.
 *
 * La grilla usa el sistema de columnas de Bootstrap: una columna en móvil,
 * dos en tablet y tres en escritorio.
 *
 * @param {Array}    props.videojuegos      Los que deben mostrarse.
 * @param {Function} props.onAgregar        Agrega al carrito.
 * @param {Function} props.onEliminar       Quita del catálogo.
 * @param {Function} props.cantidadEnCarrito Unidades de un id dado.
 * @param {Function} props.onLimpiar        Restablece los filtros.
 */
function ListaVideojuegos({ videojuegos, onAgregar, onEliminar, cantidadEnCarrito, onLimpiar }) {

  // Renderizado condicional: si ningún videojuego pasa el filtro, en vez de
  // una grilla vacía se explica qué pasó y se ofrece una salida.
  if (videojuegos.length === 0) {
    return (
      <div className="alert alert-info text-center" role="status">
        <p className="fw-semibold mb-2">Ningún videojuego coincide con tu búsqueda.</p>
        <p className="small mb-3">Prueba con otra categoría o revisa el catálogo completo.</p>
        <button type="button" className="btn btn-outline-primary" onClick={onLimpiar}>
          Ver todo el catálogo
        </button>
      </div>
    )
  }

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {videojuegos.map((videojuego) => {
        const cantidad = cantidadEnCarrito(videojuego.id)
        return (
          <VideojuegoCard
            // key permite a React identificar cada tarjeta entre renderizados.
            key={videojuego.id}
            videojuego={videojuego}
            enCarrito={cantidad > 0}
            cantidad={cantidad}
            onAgregar={onAgregar}
            onEliminar={onEliminar}
          />
        )
      })}
    </div>
  )
}

export default ListaVideojuegos
