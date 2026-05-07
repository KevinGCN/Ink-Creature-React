import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <div className="flex flex-col gap-4 w-52 bg-zinc-900 p-4 rounded-2xl text-white">
      <Link
        to="/"
        className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800 transition"
      >
        <span>🏠</span>
        <span>Inicio</span>
      </Link>

      <Link
        to="/Gallery"
        className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800 transition"
      >
        <span>🎨</span>
        <span>Tatuajes</span>
      </Link>

      <Link
        to="/Workers"
        className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800 transition"
      >
        <span>🧑‍🎨</span>
        <span>Tatuadores</span>
      </Link>

      <Link
        to="/Schedules"
        className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800 transition"
      >
        <span>📅</span>
        <span>Citas</span>
      </Link>

      <Link
        to="/Information"
        className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800 transition"
      >
        <span>ℹ️</span>
        <span>Información</span>
      </Link>
      <Link 
      to="/Profile"
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800 transition"
      >
        <span>🙋🏼</span>
        <span>Perfil</span>
      </Link>
    </div>
  )
}
