import { useState } from 'react'
import { formatearPrecio, rutaPublica } from '../utils/formato'

/** Secciones a las que apunta el menú. */
const SECCIONES = [
  { id: 'inicio', texto: 'Inicio' },
  { id: 'catalogo', texto: 'Catálogo' },
  { id: 'administrar', texto: 'Administrar' },
  { id: 'contacto', texto: 'Contacto' },
]

/**
 * Navbar — Barra de navegación del sitio.
 *
 * Usa el componente navbar de Bootstrap, que se colapsa en un botón
 * hamburguesa bajo el breakpoint lg. El menú se cierra solo al elegir una
 * sección, que es lo que se espera en móvil.
 *
 * El desplazamiento usa `scrollIntoView` del DOM en lugar de un enlace
 * ancla, para poder animarlo y para cerrar el menú en el mismo gesto.
 *
 * @param {number}   props.unidades        Unidades en el carrito.
 * @param {number}   props.total           Monto del carrito.
 * @param {boolean}  props.carritoVisible  Si el panel del carrito está abierto.
 * @param {Function} props.onToggleCarrito Alterna ese panel.
 */
function Navbar({ unidades, total, carritoVisible, onToggleCarrito }) {
  const [menuAbierto, setMenuAbierto] = useState(false)

  /** Lleva la vista a una sección y cierra el menú en móvil. */
  function irA(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMenuAbierto(false)
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-marca sticky-top shadow">
      <div className="container">

        <button
          type="button"
          className="navbar-brand btn btn-link d-flex align-items-center gap-2 text-decoration-none p-0"
          onClick={() => irA('inicio')}
        >
          <img
            src={rutaPublica('img/logo-pixelforge.svg')}
            alt="Logotipo de PixelForge Games"
            width="36"
            height="36"
          />
          <span className="fw-bold text-white">PixelForge Games</span>
        </button>

        {/* El carrito queda fuera del menú colapsable para seguir visible
            en móvil sin tener que desplegar la hamburguesa. */}
        <div className="d-flex align-items-center gap-2 order-lg-last">

          {/* Renderizado condicional: el total solo si hay algo en el carrito. */}
          {unidades > 0 && (
            <span className="text-warning fw-semibold d-none d-sm-inline">
              {formatearPrecio(total)}
            </span>
          )}

          <button
            type="button"
            className={`btn position-relative ${carritoVisible ? 'btn-warning' : 'btn-outline-light'}`}
            onClick={onToggleCarrito}
            aria-expanded={carritoVisible}
            aria-controls="panel-carrito"
          >
            {carritoVisible ? 'Ocultar carrito' : 'Ver carrito'}
            {unidades > 0 && (
              <span
                className="badge rounded-pill text-bg-danger position-absolute top-0 start-100 translate-middle"
                aria-label={`${unidades} unidades en el carrito`}
              >
                {unidades}
              </span>
            )}
          </button>

          <button
            className="navbar-toggler border-0"
            type="button"
            onClick={() => setMenuAbierto((a) => !a)}
            aria-expanded={menuAbierto}
            aria-controls="menu-principal"
            aria-label="Abrir o cerrar el menú de navegación"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        {/* Renderizado condicional del colapso: Bootstrap muestra el menú
            cuando la clase `show` está presente. */}
        <div className={`collapse navbar-collapse ${menuAbierto ? 'show' : ''}`} id="menu-principal">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {SECCIONES.map((s) => (
              <li className="nav-item" key={s.id}>
                <button
                  type="button"
                  className="nav-link btn btn-link text-start w-100"
                  onClick={() => irA(s.id)}
                >
                  {s.texto}
                </button>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </nav>
  )
}

export default Navbar
