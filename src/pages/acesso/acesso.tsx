import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Globe, Download, ArrowRight, Monitor, Smartphone, Gamepad2, HardDrive } from 'lucide-react'

function Acesso() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900"></div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold text-slate-800 md:text-6xl dark:text-slate-100">
              Como você quer acessar o PoliMap?
            </h1>
            <p className="mx-auto mb-12 max-w-3xl text-lg text-slate-600 md:text-xl dark:text-slate-300">
              Escolha a melhor forma de explorar a universidade. Jogue diretamente no seu navegador
              ou faça o download para ter acesso offline.
            </p>
          </div>
        </div>
      </section>

      {/* Access Options */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Browser Option */}
          <Card
            className={`group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl ${
              hoveredCard === 'browser'
                ? 'border-blue-500 shadow-xl'
                : 'border-slate-200 dark:border-slate-700'
            }`}
            onMouseEnter={() => setHoveredCard('browser')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-900/20 dark:to-blue-800/20"></div>
            <CardHeader className="relative z-10 pb-4">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                Jogar no Navegador
              </CardTitle>
              <CardDescription className="text-lg text-slate-600 dark:text-slate-300">
                Acesse instantaneamente sem downloads
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Monitor className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300">
                    Funciona em qualquer dispositivo
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300">
                    Compatível com mobile e desktop
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Gamepad2 className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300">
                    Experiência completa online
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  <strong>Recomendado para:</strong> Primeira experiência, acesso rápido,
                  dispositivos com pouco espaço de armazenamento.
                </p>
              </div>

              <a
                href="http://patitow.itch.io/polimap"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button
                  size="lg"
                  className="w-full bg-blue-600 text-white transition-all hover:scale-105 hover:bg-blue-700 cursor-pointer"
                >
                  Jogar Agora no Navegador
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* Download Option */}
          <Card
            className={`group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl ${
              hoveredCard === 'download'
                ? 'border-green-500 shadow-xl'
                : 'border-slate-200 dark:border-slate-700'
            }`}
            onMouseEnter={() => setHoveredCard('download')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-green-900/20 dark:to-green-800/20"></div>
            <CardHeader className="relative z-10 pb-4">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                <Download className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                Fazer Download
              </CardTitle>
              <CardDescription className="text-lg text-slate-600 dark:text-slate-300">
                Tenha o PoliMap sempre disponível
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <HardDrive className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300">
                    Acesso offline completo
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Monitor className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300">Melhor performance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Gamepad2 className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300">
                    Sem dependência de internet
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  <strong>Recomendado para:</strong> Uso frequente, ambientes com internet limitada,
                  melhor experiência de jogo.
                </p>
              </div>

              <Button
                asChild
                size="lg"
                className="w-full bg-green-600 text-white transition-all hover:scale-105 hover:bg-green-700"
              >
                <a
                  href="https://drive.google.com/drive/folders/12WekLUy89n_vVxszXsv0okOwqtr5Aysz?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  Baixar PoliMap
                  <Download className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Additional Info */}
      <section className="bg-slate-100 py-16 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center">
            <h2 className="mb-6 text-3xl font-bold text-slate-800 md:text-4xl dark:text-slate-100">
              Dúvidas sobre qual opção escolher?
            </h2>
            <div className="mx-auto max-w-4xl">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-slate-700">
                  <h3 className="mb-3 text-xl font-semibold text-slate-800 dark:text-white">
                    Primeira vez usando?
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Recomendamos começar com a versão do navegador para conhecer o PoliMap sem
                    compromisso. É rápido e fácil!
                  </p>
                </div>
                <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-slate-700">
                  <h3 className="mb-3 text-xl font-semibold text-slate-800 dark:text-white">
                    Usuário frequente?
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    O download oferece a melhor experiência, com carregamento mais rápido e acesso
                    offline para usar a qualquer momento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Acesso
