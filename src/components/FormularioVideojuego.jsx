import CampoFormulario from './CampoFormulario'
import { useFormulario } from '../hooks/useFormulario'
import { requerido, numeroEnRango } from '../utils/validacion'
import { rutaPublica } from '../utils/formato'

/** Portadas disponibles para asignar a un videojuego nuevo. */
const PORTADAS = [
  { archivo: 'img/juego-neon-racer.svg', nombre: 'Azul' },
  { archivo: 'img/juego-reino-cristal.svg', nombre: 'Morada' },
  { archivo: 'img/juego-orbita-cero.svg', nombre: 'Turquesa' },
  { archivo: 'img/juego-bosque-runas.svg', nombre: 'Verde' },
  { archivo: 'img/juego-tactica-urbana.svg', nombre: 'Ámbar' },
  { archivo: 'img/juego-puzzle-prisma.svg', nombre: 'Magenta' },
]

/**
 * FormularioVideojuego — Alta de un videojuego en el catálogo.
 *
 * Es la contraparte del botón de eliminar: entre los dos permiten modificar
 * la lista que maneja el estado, que es lo que pide la actividad. Reutiliza
 * el mismo hook y el mismo componente de campo que el formulario de
 * contacto; lo único propio son las reglas de validación.
 *
 * @param {Function} props.onAgregar   Recibe el videojuego ya validado.
 * @param {string[]} props.categorias  Categorías existentes, para el select.
 */
function FormularioVideojuego({ onAgregar, categorias }) {

  const reglas = {
    nombre: requerido('El nombre', 3),
    categoria: requerido('La categoría'),
    precio: numeroEnRango('El precio', 1, 500000),
    descripcion: requerido('La descripción', 15),
  }

  const form = useFormulario(
    {
      nombre: '',
      categoria: categorias[0] ?? 'Acción',
      precio: '',
      descripcion: '',
      imagen: PORTADAS[0].archivo,
    },
    reglas,
    (valores) => {
      // El id se genera aquí porque el formulario no debe conocer el resto
      // del catálogo; App resuelve la inserción en la lista.
      onAgregar({
        nombre: valores.nombre.trim(),
        categoria: valores.categoria,
        precio: Number(valores.precio),
        descripcion: valores.descripcion.trim(),
        imagen: valores.imagen,
        stock: 1,
        plataforma: 'PC',
        clasificacion: 'Para todo público',
      })
    },
  )

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-marca text-light">
        <h3 className="h6 mb-0">Agregar un videojuego al catálogo</h3>
      </div>

      <div className="card-body">

        {/* Renderizado condicional: confirmación tras un alta correcta. */}
        {form.enviado && (
          <div className="alert alert-success py-2" role="status">
            Videojuego agregado al catálogo.
          </div>
        )}

        <form onSubmit={form.enviar} noValidate>
          <div className="row">

            <div className="col-md-6">
              <CampoFormulario
                id="juego-nombre"
                etiqueta="Nombre"
                valor={form.valores.nombre}
                onCambiar={(v) => form.cambiar('nombre', v)}
                onSalir={() => form.salirDe('nombre')}
                error={form.errorDe('nombre')}
                refCampo={form.registrarCampo('nombre')}
                placeholder="Ej.: Cielo Partido"
              />
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="juego-categoria">
                  Categoría
                </label>
                <select
                  id="juego-categoria"
                  className="form-select"
                  value={form.valores.categoria}
                  onChange={(e) => form.cambiar('categoria', e.target.value)}
                  ref={form.registrarCampo('categoria')}
                >
                  {categorias.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-6">
              <CampoFormulario
                id="juego-precio"
                etiqueta="Precio"
                tipo="number"
                valor={form.valores.precio}
                onCambiar={(v) => form.cambiar('precio', v)}
                onSalir={() => form.salirDe('precio')}
                error={form.errorDe('precio')}
                refCampo={form.registrarCampo('precio')}
                ayuda="En pesos chilenos, entre 1 y 500.000."
                min="1"
                placeholder="19990"
              />
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="juego-imagen">
                  Portada
                </label>
                <div className="d-flex align-items-center gap-3">
                  <select
                    id="juego-imagen"
                    className="form-select"
                    value={form.valores.imagen}
                    onChange={(e) => form.cambiar('imagen', e.target.value)}
                  >
                    {PORTADAS.map((p) => (
                      <option key={p.archivo} value={p.archivo}>{p.nombre}</option>
                    ))}
                  </select>
                  {/* Vista previa: cambia en cuanto se elige otra portada. */}
                  <img
                    src={rutaPublica(form.valores.imagen)}
                    alt="Vista previa de la portada elegida"
                    width="56"
                    height="42"
                    className="rounded border"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>

            <div className="col-12">
              <CampoFormulario
                id="juego-descripcion"
                etiqueta="Descripción"
                tipo="textarea"
                valor={form.valores.descripcion}
                onCambiar={(v) => form.cambiar('descripcion', v)}
                onSalir={() => form.salirDe('descripcion')}
                error={form.errorDe('descripcion')}
                refCampo={form.registrarCampo('descripcion')}
                ayuda="Mínimo 15 caracteres."
                placeholder="De qué trata el juego…"
              />
            </div>

          </div>

          <button type="submit" className="btn btn-warning fw-semibold">
            Agregar al catálogo
          </button>
        </form>
      </div>
    </div>
  )
}

export default FormularioVideojuego
