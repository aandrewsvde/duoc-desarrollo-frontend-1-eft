import { useState, useRef, useCallback } from 'react'
import { validarFormulario } from '../utils/validacion'

/**
 * useFormulario — Hook propio con la mecánica común de los formularios.
 *
 * La aplicación tiene dos formularios (contacto y alta de videojuego) que
 * necesitan exactamente lo mismo: guardar lo que el usuario escribe, validar
 * contra un conjunto de reglas, mostrar los errores y limpiarse al enviar.
 * Encapsularlo aquí evita escribir esa lógica dos veces.
 *
 * Un detalle de accesibilidad: cuando la validación falla, el foco se mueve
 * al primer campo con error. Para eso se usa la API del DOM directamente
 * (`element.focus()`), que es la forma correcta de hacerlo en React.
 *
 * @param {object} valoresIniciales Pares campo → valor de partida.
 * @param {object} reglas           Pares campo → función validadora.
 * @param {Function} alEnviar       Se llama con los valores si todo es válido.
 * @returns {object} Estado y manejadores listos para conectar al formulario.
 */
export function useFormulario(valoresIniciales, reglas, alEnviar) {
  const [valores, setValores] = useState(valoresIniciales)
  const [errores, setErrores] = useState({})
  // Campos que el usuario ya visitó: solo a esos se les muestra el error,
  // para no llenar de rojo un formulario que todavía no ha tocado.
  const [visitados, setVisitados] = useState({})
  const [enviado, setEnviado] = useState(false)

  // Referencias a los campos, para poder enfocar el primero que falle.
  const refs = useRef({})

  /** Registra la referencia de un campo. Se usa como prop `ref`. */
  const registrarCampo = useCallback((campo) => (elemento) => {
    refs.current[campo] = elemento
  }, [])

  /** Actualiza un campo y revalida si ya había sido visitado. */
  function cambiar(campo, valor) {
    const nuevos = { ...valores, [campo]: valor }
    setValores(nuevos)
    setEnviado(false)

    if (visitados[campo]) {
      setErrores(validarFormulario(nuevos, reglas))
    }
  }

  /** Marca un campo como visitado y lo valida al salir de él. */
  function salirDe(campo) {
    setVisitados((v) => ({ ...v, [campo]: true }))
    setErrores(validarFormulario(valores, reglas))
  }

  /** Valida todo el formulario y, si pasa, ejecuta `alEnviar`. */
  function enviar(evento) {
    // Sin esto el navegador recargaría la página al enviar.
    evento.preventDefault()

    const nuevosErrores = validarFormulario(valores, reglas)
    setErrores(nuevosErrores)
    setVisitados(Object.fromEntries(Object.keys(reglas).map((c) => [c, true])))

    const campoConError = Object.keys(reglas).find((c) => nuevosErrores[c])

    if (campoConError) {
      // Lleva el foco al primer campo con problema: quien navega con teclado
      // o con lector de pantalla queda situado en lo que debe corregir.
      refs.current[campoConError]?.focus()
      setEnviado(false)
      return
    }

    alEnviar(valores)
    setValores(valoresIniciales)
    setVisitados({})
    setErrores({})
    setEnviado(true)
  }

  /** Devuelve el error visible de un campo, o null si no debe mostrarse. */
  function errorDe(campo) {
    return visitados[campo] ? (errores[campo] ?? null) : null
  }

  return {
    valores,
    errores,
    enviado,
    cambiar,
    salirDe,
    enviar,
    errorDe,
    registrarCampo,
    limpiarEnviado: () => setEnviado(false),
  }
}
