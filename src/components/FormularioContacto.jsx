import CampoFormulario from './CampoFormulario'
import { useFormulario } from '../hooks/useFormulario'
import { requerido, correoValido } from '../utils/validacion'

/**
 * FormularioContacto — Formulario para escribir al administrador del sitio.
 *
 * Pide nombre, correo y mensaje, y valida los tres antes de dar por enviado
 * el formulario. La validación corre en dos momentos:
 *   - al salir de un campo, para avisar temprano;
 *   - al enviar, que es la comprobación que realmente bloquea.
 *
 * Si algo falla, no se envía nada, se muestra el error bajo cada campo y el
 * foco salta al primero con problema.
 *
 * @param {Function} props.onEnviar Se llama con los datos ya validados.
 */
function FormularioContacto({ onEnviar }) {

  // Reglas de validación: una por campo. Viven en utils/validacion.js para
  // poder reutilizarlas y probarlas por separado.
  const reglas = {
    nombre: requerido('El nombre', 3),
    email: correoValido(),
    mensaje: requerido('El mensaje', 10),
  }

  const form = useFormulario(
    { nombre: '', email: '', mensaje: '' },
    reglas,
    (valores) => onEnviar?.(valores),
  )

  return (
    <section id="contacto" className="py-5 bg-light border-top">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">

            <h2 className="h3 fw-bold text-marca">Contacto</h2>
            <p className="text-secondary">
              ¿Buscas un título que no está en el catálogo? Escríbenos y te
              respondemos dentro de un día hábil.
            </p>

            <div className="card shadow-sm">
              <div className="card-body">

                {/* Renderizado condicional: el aviso de éxito aparece solo
                    después de un envío válido. */}
                {form.enviado && (
                  <div className="alert alert-success" role="status">
                    <strong>¡Mensaje enviado!</strong> Gracias por escribirnos,
                    te responderemos pronto.
                  </div>
                )}

                <form onSubmit={form.enviar} noValidate>

                  <CampoFormulario
                    id="contacto-nombre"
                    etiqueta="Nombre"
                    valor={form.valores.nombre}
                    onCambiar={(v) => form.cambiar('nombre', v)}
                    onSalir={() => form.salirDe('nombre')}
                    error={form.errorDe('nombre')}
                    refCampo={form.registrarCampo('nombre')}
                    ayuda="Al menos 3 caracteres."
                    autoComplete="name"
                    placeholder="Ej.: Agustín Andrews"
                  />

                  <CampoFormulario
                    id="contacto-email"
                    etiqueta="Correo electrónico"
                    tipo="email"
                    valor={form.valores.email}
                    onCambiar={(v) => form.cambiar('email', v)}
                    onSalir={() => form.salirDe('email')}
                    error={form.errorDe('email')}
                    refCampo={form.registrarCampo('email')}
                    ayuda="Lo usaremos solo para responderte."
                    autoComplete="email"
                    placeholder="nombre@correo.cl"
                  />

                  <CampoFormulario
                    id="contacto-mensaje"
                    etiqueta="Mensaje"
                    tipo="textarea"
                    valor={form.valores.mensaje}
                    onCambiar={(v) => form.cambiar('mensaje', v)}
                    onSalir={() => form.salirDe('mensaje')}
                    error={form.errorDe('mensaje')}
                    refCampo={form.registrarCampo('mensaje')}
                    ayuda="Cuéntanos en qué podemos ayudarte (mínimo 10 caracteres)."
                    placeholder="Escribe tu consulta…"
                  />

                  <button type="submit" className="btn btn-warning fw-semibold px-4">
                    Enviar mensaje
                  </button>

                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default FormularioContacto
