import { formatearPrecio, rutaPublica } from '../utils/formato'

/**
 * VideojuegoCard — Tarjeta de un videojuego.
 *
 * Muestra imagen, nombre, precio y descripción, que son los cuatro datos que
 * pide el caso. Todo llega por props: el mismo componente sirve para
 * cualquier videojuego del catálogo, incluidos los que agrega el usuario.
 *
 * @param {object}   props.videojuego Datos a mostrar.
 * @param {boolean}  props.enCarrito  Si ya está en el carrito.
 * @param {number}   props.cantidad   Unidades en el carrito.
 * @param {Function} props.onAgregar  Agrega al carrito.
 * @param {Function} props.onEliminar Quita el videojuego del catálogo.
 */
function VideojuegoCard({ videojuego, enCarrito, cantidad, onAgregar, onEliminar }) {
  const sinStock = videojuego.stock === 0

  return (
    <div className="col">
      <article className="card h-100 shadow-sm tarjeta-videojuego">

        <img
          src={rutaPublica(videojuego.imagen)}
          className="card-img-top"
          alt={`Portada del videojuego ${videojuego.nombre}`}
          loading="lazy"
        />

        <div className="card-body d-flex flex-column">

          <p className="mb-2">
            <span className="badge text-bg-secondary">{videojuego.categoria}</span>{' '}
            {/* Renderizado condicional: la insignia cambia según el stock. */}
            {sinStock ? (
              <span className="badge text-bg-danger">Sin stock</span>
            ) : (
              <span className="badge text-bg-success">Stock: {videojuego.stock}</span>
            )}
          </p>

          <h3 className="card-title h5">{videojuego.nombre}</h3>
          <p className="card-text small text-secondary">{videojuego.descripcion}</p>

          <p className="h4 fw-bold text-exito mt-auto mb-3">
            {formatearPrecio(videojuego.precio)}
          </p>

          <div className="d-grid gap-2">
            {/* Renderizado condicional: el botón cambia de texto y de color
                cuando el videojuego ya está en el carrito. */}
            <button
              type="button"
              className={`btn fw-semibold ${enCarrito ? 'btn-success' : 'btn-warning'}`}
              onClick={() => onAgregar(videojuego)}
              disabled={sinStock}
            >
              {sinStock
                ? 'No disponible'
                : enCarrito
                  ? `En el carrito (${cantidad}) · Agregar otro`
                  : 'Agregar al carrito'}
            </button>

            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => onEliminar(videojuego.id)}
              aria-label={`Eliminar ${videojuego.nombre} del catálogo`}
            >
              Eliminar del catálogo
            </button>
          </div>

        </div>
      </article>
    </div>
  )
}

export default VideojuegoCard
