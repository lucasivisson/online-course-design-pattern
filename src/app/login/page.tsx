import { GraduationCap, BookOpen, LogIn } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Plataforma de Cursos Online</h1>
          <p className="text-gray-600 text-lg">Escolha como deseja acessar</p>
        </div>

        {/* Main Buttons */}
        <div className="space-y-4">
          <Link
            href="/professor"
            className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-lg">Entrar como Professor</span>
          </Link>

          <Link
            href="/aluno"
            className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <GraduationCap className="w-6 h-6" />
            <span className="text-lg">Entrar como Aluno</span>
          </Link>
        </div>

        {/* Login Button */}
        <div className="text-center pt-4">
          
        </div>

        {/* Footer */}
        <div className="text-center pt-8">
          <p className="text-sm text-gray-500">Uma plataforma simples e intuitiva para ensinar e aprender</p>
        </div>
      </div>
    </div>
  )
}
