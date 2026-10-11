/**
 * validacion.js — Reglas de validación de formularios.
 *
 * Cada validador recibe un valor y devuelve un mensaje de error (string) o
 * null si el valor es correcto. Son funciones puras: no tocan el DOM ni el
 * estado, solo deciden. Eso permite reutilizarlas en los dos formularios de
 * la aplicación y probarlas por separado.
 */

/**
 * Comprueba que un campo de texto no venga vacío.
 * @param {string} etiqueta Nombre legible del campo, para el mensaje.
 * @param {number} [minimo=0] Largo mínimo exigido.
 * @returns {(valor: string) => string|null}
 */
export function requerido(etiqueta, minimo = 0) {
  return (valor) => {
    const texto = String(valor ?? '').trim()

    if (texto === '') {
      return `${etiqueta} es obligatorio.`
    }

    if (minimo > 0 && texto.length < minimo) {
      return `${etiqueta} debe tener al menos ${minimo} caracteres.`
    }

    return null
  }
}

/**
 * Comprueba que el valor tenga forma de correo electrónico.
 *
 * El patrón es deliberadamente simple: exige texto, una arroba, un dominio y
 * una extensión de al menos dos letras. Validar correos con una expresión
 * exhaustiva no aporta nada aquí, porque la comprobación real es que el
 * mensaje llegue.
 * @returns {(valor: string) => string|null}
 */
export function correoValido() {
  const patron = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/

  return (valor) => {
    const texto = String(valor ?? '').trim()

    if (texto === '') {
      return 'El correo electrónico es obligatorio.'
    }

    if (!patron.test(texto)) {
      return 'Escribe un correo válido, por ejemplo nombre@correo.cl.'
    }

    return null
  }
}

/**
 * Comprueba que el valor sea un número dentro de un rango.
 * @param {string} etiqueta Nombre legible del campo.
 * @param {number} min Valor mínimo aceptado.
 * @param {number} max Valor máximo aceptado.
 * @returns {(valor: string|number) => string|null}
 */
export function numeroEnRango(etiqueta, min, max) {
  return (valor) => {
    const texto = String(valor ?? '').trim()

    if (texto === '') {
      return `${etiqueta} es obligatorio.`
    }

    const numero = Number(texto)

    if (Number.isNaN(numero)) {
      return `${etiqueta} debe ser un número.`
    }

    if (numero < min || numero > max) {
      return `${etiqueta} debe estar entre ${min} y ${max}.`
    }

    return null
  }
}

/**
 * Aplica un conjunto de reglas a un objeto de valores.
 * @param {object} valores Pares campo → valor.
 * @param {object} reglas  Pares campo → función validadora.
 * @returns {object} Pares campo → mensaje de error, solo de los que fallaron.
 */
export function validarFormulario(valores, reglas) {
  const errores = {}

  for (const campo of Object.keys(reglas)) {
    const mensaje = reglas[campo](valores[campo])
    if (mensaje) {
      errores[campo] = mensaje
    }
  }

  return errores
}
