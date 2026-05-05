import { useState, useRef, useCallback } from 'react'
import './gallery.css'

interface ImagenGaleria {
  id?: number
  src: string
  alt: string
  empleadoId: number
}

const IMAGENES_BASE: ImagenGaleria[] = [
  { src: '/image/DBZ.jpg',        alt: 'Goku Y Vegeta',  empleadoId: 1 },
  { src: '/image/arquemis.png',   alt: 'Arquemis',       empleadoId: 1 },
  { src: '/image/ladymaria.png',  alt: 'Lady Maria',     empleadoId: 2 },
  { src: '/image/mercy.png',      alt: 'Mercy',          empleadoId: 3 },
  { src: '/image/rem.png',        alt: 'Rem',            empleadoId: 4 },
  { src: '/image/kuromi.jpg',     alt: 'Kuromi',         empleadoId: 5 },
  { src: '/image/sorodita.png',   alt: 'Sorodita',       empleadoId: 6 },
]

function cargarImagenes(): ImagenGaleria[] {
  const raw = localStorage.getItem('galeria')
  const guardadas: ImagenGaleria[] = raw ? JSON.parse(raw) : []
  const unicas = guardadas.filter(
    (img) => !IMAGENES_BASE.some((base) => base.src === img.src)
  )
  return [...IMAGENES_BASE, ...unicas]
}

function estaLogueado(): boolean {
  return localStorage.getItem('logueado') === 'true'
}

function obtenerUsuario(): { charge?: string } {
  return JSON.parse(localStorage.getItem('usuario') || '{}')
}

interface GalleryProps {
  onVerTatuador?: (empleadoId: number) => void
}

export const Gallery = ({ onVerTatuador }: GalleryProps) => {
  const [imagenes, setImagenes] = useState<ImagenGaleria[]>(() => cargarImagenes())
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const usuario = obtenerUsuario()
  const esAdmin =
    estaLogueado() &&
    (usuario.charge === 'CEO' || usuario.charge === 'Admin')

  const abrirImagen = (src: string) => setImagenAmpliada(src)
  const cerrarImagen = () => setImagenAmpliada(null)

  const handleImgError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/image/placeholder.jpg'
  }, [])

  const verTatuador = useCallback((empleadoId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    onVerTatuador?.(empleadoId)
  }, [onVerTatuador])

  const cargarImagen = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const nueva: ImagenGaleria = {
        id: Date.now(),
        src: reader.result as string,
        alt: 'Nueva imagen',
        empleadoId: 1,
      }
      const nuevasImagenes = [...imagenes, nueva]
      setImagenes(nuevasImagenes)

      const raw = localStorage.getItem('galeria')
      const existentes: ImagenGaleria[] = raw ? JSON.parse(raw) : []
      if (!existentes.some((img) => img.id === nueva.id)) {
        existentes.push(nueva)
        localStorage.setItem('galeria', JSON.stringify(existentes))
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }, [imagenes])

  const eliminarImagen = useCallback((img: ImagenGaleria, e: React.MouseEvent) => {
    e.stopPropagation()
    if (IMAGENES_BASE.some((base) => base.src === img.src)) {
      alert('No puedes eliminar imagenes base')
      return
    }
    const nuevasImagenes = imagenes.filter((i) => i.id !== img.id)
    setImagenes(nuevasImagenes)

    const raw = localStorage.getItem('galeria')
    let guardadas: ImagenGaleria[] = raw ? JSON.parse(raw) : []
    guardadas = guardadas.filter((i) => i.id !== img.id)
    localStorage.setItem('galeria', JSON.stringify(guardadas))
  }, [imagenes])

  return (
    <div className="gallery">
      <h1 className="gallery-title">Galeria</h1>

      {esAdmin && (
        <div className="gallery-admin-actions">
          <button onClick={() => fileInputRef.current?.click()}>
            Subir imagen
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={cargarImagen}
            style={{ display: 'none' }}
          />
        </div>
      )}

      <div className="gallery-grid">
        {imagenes.map((imagen, index) => (
          <div
            className="gallery-item"
            key={imagen.id ?? index}
            onClick={() => abrirImagen(imagen.src)}
          >
            <img
              src={imagen.src}
              alt={imagen.alt}
              onError={handleImgError}
            />

            <button
              className="btn-tatuador"
              onClick={(e) => verTatuador(imagen.empleadoId, e)}
            >
              Conoce al tatuador
            </button>

            {esAdmin && (
              <button
                className="btn-eliminar"
                onClick={(e) => eliminarImagen(imagen, e)}
              >
                &#x2715;
              </button>
            )}
          </div>
        ))}
      </div>

      {imagenAmpliada && (
        <div className="gallery-viewer" onClick={cerrarImagen}>
          <img src={imagenAmpliada} alt="Imagen ampliada" />
        </div>
      )}
    </div>
  )
}
