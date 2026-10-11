import { formatearPrecio } from '../utils/formato'

/**
 * Carrito — Panel con el detalle de lo que el usuario seleccionó.
 *
 * El estado del carrito vive en App; aquí solo se dibuja y se avisa hacia
 * arriba de lo que el usuario quiere hacer.
 *
 * @param {Array}    props.lineas     Líneas: { videojuego, cantidad }.
 * @param {number}   props.unidades   Unidades totales.
 * @param {number}   props.total      Monto total.
 * @param {Function} props.onSumar    Suma una unidad.
 * @param {Function} props.onRestar   Resta una unidad.
 * @param {Function} props.onEliminar Quita una línea entera.
 * @param {Function} props.onVaciar   Vacía el carrito.
 */
function Carrito({ lineas, unidades, total, onSumar, onRestar, onEliminar, onVaciar }) {

  // Renderizado condicional: el mensaje de carrito vacío.
  if (lineas.length === 0) {
    return (
      <section id="panel-carrito" className="card shadow-sm" aria-label="Carrito de compras">
        <div className="card-body text-center py-5">
          <p className="h5 mb-2">Tu carrito está vacío</p>
          <p className="text-secondary mb-0">
            Agrega videojuegos desde el catálogo y aparecerán aquí.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="panel-carrito" className="card shadow-sm" aria-label="Carrito de compras">

      <div className="card-header bg-marca text-light d-flex justify-content-between align-items-center">
        <h2 className="h5 mb-0">Carrito de compras</h2>
        <span className="badge text-bg-warning">{unidades} unidad(es)</span>
      </div>

      <ul className="list-group list-group-flush">
        {lineas.map(({ videojuego, cantidad }) => (
          <li key={videojuego.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-start gap-3">

              <div>
                <p className="fw-semibold mb-1">{videojuego.nombre}</p>
                <p className="small text-secondary mb-0">
                  {cantidad} × {formatearPrecio(videojuego.precio)}
                </p>
              </div>

              <div className="text-end">
                <p className="fw-bold mb-1">
                  {formatearPrecio(videojuego.precio * cantidad)}
                </p>
                <div className="btn-group btn-group-sm" role="group"
                     aria-label={`Ajustar cantidad de ${videojuego.nombre}`}>
                  <button type="button" className="btn btn-outline-secondary"
                          onClick={() => onRestar(videojuego.id)}
                          aria-label={`Quitar una unidad de ${videojuego.nombre}`}>
                    −
                  </button>
                  <button type="button" className="btn btn-outline-secondary"
                          onClick={() => onSumar(videojuego.id)}
                          aria-label={`Agregar una unidad de ${videojuego.nombre}`}>
                    +
                  </button>
                  <button type="button" className="btn btn-outline-danger"
                          onClick={() => onEliminar(videojuego.id)}
                          aria-label={`Quitar ${videojuego.nombre} del carrito`}>
                    Quitar
                  </button>
                </div>
              </div>

            </div>
          </li>
        ))}
      </ul>

      <div className="card-footer">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="fw-semibold">Total</span>
          <span className="h4 fw-bold text-exito mb-0">{formatearPrecio(total)}</span>
        </div>
        <button type="button" className="btn btn-outline-danger w-100" onClick={onVaciar}>
          Vaciar carrito
        </button>
      </div>

    </section>
  )
}

export default Carrito
