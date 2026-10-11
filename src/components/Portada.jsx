import { rutaPublica } from '../utils/formato'

/**
 * Portada — Sección de bienvenida del sitio.
 *
 * Es la primera sección a la que apunta la barra de navegación. Presenta la
 * tienda y da dos accesos directos al resto del contenido.
 *
 * @param {number} props.totalCatalogo Videojuegos disponibles ahora mismo.
 */
function Portada({ totalCatalogo }) {

  /** Lleva la vista a una sección del documento. */
  function irA(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="inicio" className="portada text-light py-5">
      <div className="container">
        <div className="row align-items-center g-4">

          <div className="col-lg-8">
            <h1 className="display-5 fw-bold text-warning">PixelForge Games</h1>
            <p className="lead mb-3">
              Tienda de videojuegos en línea: lanzamientos, ofertas y clásicos
              para PC, PlayStation, Xbox y Nintendo Switch.
            </p>
            <p className="mb-4">
              {/* Renderizado condicional: el conteo solo cuando ya hay datos. */}
              {totalCatalogo > 0
                ? `${totalCatalogo} títulos disponibles con despacho a todo Chile.`
                : 'Preparando el catálogo…'}
            </p>
            <div className="d-flex flex-wrap gap-2">
              <button type="button" className="btn btn-warning fw-semibold px-4"
                      onClick={() => irA('catalogo')}>
                Ver catálogo
              </button>
              <button type="button" className="btn btn-outline-light px-4"
                      onClick={() => irA('contacto')}>
                Contáctanos
              </button>
            </div>
          </div>

          <div className="col-lg-4 text-center d-none d-lg-block">
            <img
              src={rutaPublica('img/logo-pixelforge.svg')}
              alt=""
              width="180"
              height="180"
              className="img-fluid"
            />
          </div>

        </div>
      </div>
    </section>
  )
}

export default Portada
