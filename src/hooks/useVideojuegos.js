import { useState, useEffect, useCallback } from 'react'
import { rutaPublica } from '../utils/formato'

/**
 * useVideojuegos — Hook propio que carga el catálogo de videojuegos.
 *
 * Aquí vive el efecto secundario principal de la aplicación: la petición al
 * archivo JSON. Se encapsula en un hook para que quien lo use reciba el
 * resultado ya listo (videojuegos, cargando, error) sin ocuparse del fetch.
 *
 * El estado se expone junto a `setVideojuegos` porque la EFT pide poder
 * agregar y eliminar videojuegos de la lista: la carga inicial viene del
 * JSON, pero después el usuario puede modificarla.
 *
 * @returns {{videojuegos: Array, setVideojuegos: Function, cargando: boolean,
 *            error: string|null, recargar: Function}}
 */
export function useVideojuegos() {
  const [videojuegos, setVideojuegos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Cambiar este número fuerza que el efecto se repita: así funciona el
  // botón "Reintentar" sin recargar la página.
  const [intento, setIntento] = useState(0)

  /** Vuelve a lanzar la carga del catálogo. */
  const recargar = useCallback(() => setIntento((n) => n + 1), [])

  useEffect(() => {
    // Evita actualizar el estado si el componente se desmonta mientras la
    // petición sigue en vuelo.
    let ignorar = false

    async function cargar() {
      setCargando(true)
      setError(null)

      try {
        const respuesta = await fetch(rutaPublica('data/videojuegos.json'))

        // fetch solo falla ante errores de red: un 404 llega como respuesta
        // "correcta", así que hay que comprobarlo a mano.
        if (!respuesta.ok) {
          throw new Error(`El servidor respondió ${respuesta.status} (${respuesta.statusText}).`)
        }

        const datos = await respuesta.json()

        if (!datos || !Array.isArray(datos.videojuegos)) {
          throw new Error('El archivo JSON no contiene un arreglo "videojuegos".')
        }

        // Se descarta cualquier registro al que le falten campos obligatorios,
        // para que un dato mal formado no rompa el renderizado.
        const validos = datos.videojuegos.filter(
          (v) =>
            v &&
            typeof v.id === 'number' &&
            typeof v.nombre === 'string' &&
            typeof v.precio === 'number',
        )

        if (validos.length === 0) {
          throw new Error('Ningún videojuego del archivo tiene el formato esperado.')
        }

        if (!ignorar) {
          setVideojuegos(validos)
        }
      } catch (e) {
        console.error('No fue posible cargar el catálogo:', e)
        if (!ignorar) {
          setError(e.message)
          setVideojuegos([])
        }
      } finally {
        if (!ignorar) {
          setCargando(false)
        }
      }
    }

    cargar()

    // Función de limpieza: React la ejecuta al desmontar o antes de repetir.
    return () => {
      ignorar = true
    }
  }, [intento])

  return { videojuegos, setVideojuegos, cargando, error, recargar }
}
