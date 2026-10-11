/**
 * FiltroCategorias — Búsqueda por texto y filtro por categoría.
 *
 * Los controles son "controlados": su valor lo manda el estado que vive en
 * App y cada cambio se comunica hacia arriba por props. Así el filtro tiene
 * un único dueño y no puede desincronizarse de lo que se ve en la grilla.
 *
 * Las categorías llegan como prop porque se derivan del catálogo, que puede
 * crecer cuando el usuario agrega un videojuego.
 *
 * @param {string}   props.busqueda       Texto buscado.
 * @param {Function} props.onBuscar       Nuevo texto.
 * @param {string}   props.categoria      Categoría activa.
 * @param {Function} props.onCategoria    Nueva categoría.
 * @param {string[]} props.categorias     Categorías disponibles.
 * @param {number}   props.totalMostrados Videojuegos visibles.
 * @param {number}   props.totalCatalogo  Videojuegos del catálogo.
 * @param {Function} props.onLimpiar      Restablece los filtros.
 */
function FiltroCategorias({
  busqueda,
  onBuscar,
  categoria,
  onCategoria,
  categorias,
  totalMostrados,
  totalCatalogo,
  onLimpiar,
}) {
  const hayFiltros = busqueda !== '' || categoria !== 'todas'

  return (
    <section className="mb-4" aria-label="Filtros del catálogo">

      <div className="row g-3 align-items-end">
        <div className="col-12 col-md-5">
          <label className="form-label small fw-semibold" htmlFor="campo-busqueda">
            Buscar videojuego
          </label>
          <input
            id="campo-busqueda"
            type="search"
            className="form-control"
            placeholder="Escribe el nombre de un juego…"
            value={busqueda}
            onChange={(e) => onBuscar(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label small fw-semibold" htmlFor="filtro-categoria">
            Categoría
          </label>
          <select
            id="filtro-categoria"
            className="form-select"
            value={categoria}
            onChange={(e) => onCategoria(e.target.value)}
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-3">
          {/* Renderizado condicional: limpiar solo tiene sentido si hay filtros. */}
          {hayFiltros && (
            <button type="button" className="btn btn-outline-secondary w-100" onClick={onLimpiar}>
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Atajos por categoría: la misma acción que el desplegable, a un clic. */}
      <div className="d-flex flex-wrap gap-2 mt-3">
        <button
          type="button"
          className={`btn btn-sm ${categoria === 'todas' ? 'btn-marca' : 'btn-outline-secondary'}`}
          onClick={() => onCategoria('todas')}
        >
          Todas
        </button>
        {categorias.map((c) => (
          <button
            key={c}
            type="button"
            className={`btn btn-sm ${categoria === c ? 'btn-marca' : 'btn-outline-secondary'}`}
            onClick={() => onCategoria(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="text-secondary small mb-0 mt-3" aria-live="polite">
        Mostrando {totalMostrados} de {totalCatalogo} videojuego(s).
      </p>

    </section>
  )
}

export default FiltroCategorias
