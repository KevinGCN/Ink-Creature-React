// ─────────────────────────────────────────────────────────────
// Importaciones necesarias:
// - useState: para manejar el estado local (imágenes, imagen ampliada)
// - useRef: para referenciar el input de archivo sin renderizar un botón nativo
// - useCallback: para memorizar funciones y evitar que se recreen en cada render
// ─────────────────────────────────────────────────────────────
import { useState, useRef, useCallback } from 'react'
import '../styles/gallery.css'

// ─────────────────────────────────────────────────────────────
// Interfaz que define la forma de cada imagen en la galería:
// - id: identificador único (opcional, las imágenes base no lo tienen)
// - src: ruta o URL de la imagen
// - alt: texto alternativo para accesibilidad
// - empleadoId: relaciona la imagen con un tatuador específico
// ─────────────────────────────────────────────────────────────
interface ImagenGaleria {
  id?: number
  src: string
  alt: string
  empleadoId: number
}

// ─────────────────────────────────────────────────────────────
// Imágenes predeterminadas que siempre aparecen en la galería.
// Estas NO se pueden eliminar (son la base del catálogo).
// Cada una está asociada a un empleado mediante empleadoId.
// ─────────────────────────────────────────────────────────────
const IMAGENES_BASE: ImagenGaleria[] = [
  { src: '/image/DBZ.jpg',        alt: 'Goku Y Vegeta',  empleadoId: 1 },
  { src: '/image/ladymaria.png',  alt: 'Lady Maria',     empleadoId: 2 },
  { src: '/image/mercy.png',      alt: 'Mercy',          empleadoId: 3 },
  { src: '/image/rem.png',        alt: 'Rem',            empleadoId: 4 },
  { src: '/image/kuromi.jpg',     alt: 'Kuromi',         empleadoId: 5 },
  { src: '/image/sorodita.png',   alt: 'Sorodita',       empleadoId: 6 },
  { src: '/image/arquemis.png',   alt: 'Arquemis',       empleadoId: 7 }
]

// ─────────────────────────────────────────────────────────────
// Función que combina las imágenes base con las subidas por el admin.
// - Lee las imágenes guardadas en localStorage (clave 'galeria').
// - Filtra duplicados: si una imagen guardada ya existe en la base, la omite.
// - Retorna primero las base y luego las adicionales al final.
// ─────────────────────────────────────────────────────────────
function cargarImagenes(): ImagenGaleria[] {
  const raw = localStorage.getItem('galeria')
  const guardadas: ImagenGaleria[] = raw ? JSON.parse(raw) : []
  const unicas = guardadas.filter(
    (img) => !IMAGENES_BASE.some((base) => base.src === img.src) 
  )
  return [...IMAGENES_BASE, ...unicas]
}

// ─────────────────────────────────────────────────────────────
// Helpers para leer el estado de autenticación desde localStorage,
// ya que el componente no usa useAuth directamente.
// ─────────────────────────────────────────────────────────────

// Retorna true si el usuario tiene la sesión activa
function estaLogueado(): boolean {
  return localStorage.getItem('logueado') === 'true'
}

// Retorna el objeto usuario guardado (o un objeto vacío si no hay sesión)
function obtenerUsuario(): { charge?: string } {
  return JSON.parse(localStorage.getItem('usuario') || '{}')
}

// ─────────────────────────────────────────────────────────────
// Props del componente:
// - onVerTatuador: callback opcional que recibe el empleadoId
//   cuando el usuario hace click en "Conoce al tatuador"
// ─────────────────────────────────────────────────────────────
interface GalleryProps {
  onVerTatuador?: (empleadoId: number) => void
}

export const Gallery = ({ onVerTatuador }: GalleryProps) => {

  // Lista de imágenes mostradas en pantalla.
  // Se inicializa con cargarImagenes() para cargar base + las del localStorage.
  const [imagenes, setImagenes] = useState<ImagenGaleria[]>(() => cargarImagenes())

  // Almacena el src de la imagen que está siendo vista en el visor ampliado.
  // null significa que el visor está cerrado.
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null)

  // Referencia al input type="file" oculto, accionado por el botón "Subir imagen".
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Determina si el usuario actual tiene permisos de administrador.
  // Solo pueden subir y eliminar imágenes los usuarios con charge 'CEO' o 'Admin'.
  const usuario = obtenerUsuario()
  const esAdmin =
    estaLogueado() &&
    (usuario.charge === 'CEO' || usuario.charge === 'Admin')

  // ── Abre el visor ampliado guardando el src de la imagen clicada
  const abrirImagen = (src: string) => setImagenAmpliada(src)

  // ── Cierra el visor ampliado limpiando el estado
  const cerrarImagen = () => setImagenAmpliada(null)

  // ── Maneja errores de carga de imagen:
  //    si una imagen no se puede cargar, reemplaza su src por un placeholder
  const handleImgError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/image/placeholder.jpg'
  }, [])

  // ── Llama al callback onVerTatuador con el empleadoId de la imagen.
  //    stopPropagation evita que el click también abra el visor ampliado.
  const verTatuador = useCallback((empleadoId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    onVerTatuador?.(empleadoId)
  }, [onVerTatuador])

  // ── Carga una imagen nueva desde el dispositivo del usuario (solo admins):
  //    1. Lee el archivo seleccionado con FileReader
  //    2. Convierte el archivo a base64 (readAsDataURL)
  //    3. Agrega la imagen al estado local y la persiste en localStorage
  //    4. Limpia el input para permitir subir la misma imagen otra vez
  const cargarImagen = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const nueva: ImagenGaleria = {
        id: Date.now(),           // ID único basado en timestamp
        src: reader.result as string,
        alt: 'Nueva imagen',
        empleadoId: 1,
      }

      // Actualiza el estado con la nueva imagen agregada al final
      const nuevasImagenes = [...imagenes, nueva]
      setImagenes(nuevasImagenes)

      // Persiste solo las imágenes adicionales en localStorage (no las base)
      const raw = localStorage.getItem('galeria')
      const existentes: ImagenGaleria[] = raw ? JSON.parse(raw) : []
      if (!existentes.some((img) => img.id === nueva.id)) {
        existentes.push(nueva)
        localStorage.setItem('galeria', JSON.stringify(existentes))
      }
    }
    reader.readAsDataURL(file) // Convierte el archivo a cadena base64
    e.target.value = ''        // Limpia el input para reutilizarlo
  }, [imagenes])

  // ── Elimina una imagen de la galería (solo admins):
  //    1. Bloquea la eliminación de imágenes base
  //    2. Filtra la imagen del estado local
  //    3. Actualiza localStorage eliminando solo esa imagen
  //    stopPropagation evita que se abra el visor al hacer click en eliminar
  const eliminarImagen = useCallback((img: ImagenGaleria, e: React.MouseEvent) => {
    e.stopPropagation()

    // Protección: las imágenes base no se pueden borrar
    if (IMAGENES_BASE.some((base) => base.src === img.src)) {
      alert('No puedes eliminar imagenes base')
      return
    }

    // Quita la imagen del estado visual
    const nuevasImagenes = imagenes.filter((i) => i.id !== img.id)
    setImagenes(nuevasImagenes)

    // Quita la imagen del localStorage
    const raw = localStorage.getItem('galeria')
    let guardadas: ImagenGaleria[] = raw ? JSON.parse(raw) : []
    guardadas = guardadas.filter((i) => i.id !== img.id)
    localStorage.setItem('galeria', JSON.stringify(guardadas))
  }, [imagenes])

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="gallery">
      <h1 className="gallery-title">Galeria</h1>

      {/* Botón "Subir imagen" visible solo para admins.
          Hace click programático en el input oculto. */}
      {esAdmin && (
        <div className="gallery-admin-actions">
          <button onClick={() => fileInputRef.current?.click()}>
            Subir imagen
          </button>
          {/* Input oculto que abre el selector de archivos del sistema */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"          // Solo permite archivos de imagen
            onChange={cargarImagen}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {/* Grid tipo masonry: recorre todas las imágenes y renderiza cada tarjeta.
          La key usa img.id si existe (imágenes subidas) o el index (imágenes base). */}
      <div className="gallery-grid">
        {imagenes.map((imagen, index) => (
          <div
            className="gallery-item"
            key={imagen.id ?? index}
            onClick={() => abrirImagen(imagen.src)} // Click en la tarjeta abre el visor
          >
            <img
              src={imagen.src}
              alt={imagen.alt}
              onError={handleImgError} // Si la imagen falla, muestra placeholder
            />

            {/* Botón que aparece al hacer hover sobre la tarjeta.
                Llama al callback para ver el perfil del tatuador asociado. */}
            <button
              className="btn-tatuador"
              onClick={(e) => verTatuador(imagen.empleadoId, e)}
            >
              Conoce al tatuador
            </button>

            {/* Botón de eliminar visible solo para admins al hacer hover.
                No se muestra en imágenes base (la función lo bloquea internamente). */}
            {esAdmin && (
              <button
                className="btn-eliminar"
                onClick={(e) => eliminarImagen(imagen, e)}
              >
                &#x2715; {/* Símbolo × */}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Visor de imagen ampliada: solo se renderiza cuando imagenAmpliada tiene valor.
          Un click en cualquier parte del overlay lo cierra. */}
      {imagenAmpliada && (
        <div className="gallery-viewer" onClick={cerrarImagen}>
          <img src={imagenAmpliada} alt="Imagen ampliada" />
        </div>
      )}
    </div>
  )
}