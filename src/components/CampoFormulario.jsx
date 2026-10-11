/**
 * CampoFormulario — Un campo de formulario con etiqueta y mensaje de error.
 *
 * Los dos formularios de la aplicación necesitan la misma estructura:
 * etiqueta, control, estado visual de error y texto explicativo asociado.
 * Tenerlo en un componente evita repetir ese marcado campo por campo y
 * garantiza que todos se comporten igual.
 *
 * El control se conecta con su mensaje de error mediante `aria-describedby`
 * y `aria-invalid`, que es lo que permite a un lector de pantalla anunciar
 * el problema.
 *
 * @param {string}   props.id        Identificador del control.
 * @param {string}   props.etiqueta  Texto de la etiqueta visible.
 * @param {string}   props.valor     Valor actual.
 * @param {Function} props.onCambiar Se llama con el nuevo valor.
 * @param {Function} props.onSalir   Se llama al perder el foco.
 * @param {string}   [props.error]   Mensaje de error, o null.
 * @param {string}   [props.tipo]    Tipo de input. 'textarea' usa <textarea>.
 * @param {string}   [props.ayuda]   Texto de apoyo bajo el campo.
 * @param {object}   [props.resto]   Atributos extra para el control.
 */
function CampoFormulario({
  id,
  etiqueta,
  valor,
  onCambiar,
  onSalir,
  error,
  tipo = 'text',
  ayuda,
  refCampo,
  ...resto
}) {
  const idError = `${id}-error`
  const idAyuda = `${id}-ayuda`

  // Solo se describe con los ids que realmente existen en el DOM.
  const descritoPor = [error ? idError : null, ayuda ? idAyuda : null]
    .filter(Boolean)
    .join(' ')

  const propsComunes = {
    id,
    ref: refCampo,
    value: valor,
    onChange: (e) => onCambiar(e.target.value),
    onBlur: onSalir,
    // is-invalid es la clase de Bootstrap que pinta el borde rojo.
    className: `form-control ${error ? 'is-invalid' : ''}`,
    'aria-invalid': error ? 'true' : 'false',
    'aria-describedby': descritoPor || undefined,
    ...resto,
  }

  return (
    <div className="mb-3">
      <label className="form-label fw-semibold" htmlFor={id}>
        {etiqueta}
      </label>

      {tipo === 'textarea' ? (
        <textarea {...propsComunes} rows={4} />
      ) : (
        <input type={tipo} {...propsComunes} />
      )}

      {/* Renderizado condicional: el texto de ayuda se oculta cuando hay un
          error, para que el mensaje importante no compita con él. */}
      {ayuda && !error && (
        <p id={idAyuda} className="form-text mb-0">
          {ayuda}
        </p>
      )}

      {/* Renderizado condicional: el error solo existe si la validación falló. */}
      {error && (
        <p id={idError} className="invalid-feedback d-block mb-0">
          {error}
        </p>
      )}
    </div>
  )
}

export default CampoFormulario
