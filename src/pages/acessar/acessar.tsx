import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import { Globe, Download, ArrowRight, Monitor, Smartphone, HardDrive, Zap, Info, Image as ImageIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

function Acessar() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative pt-28 pb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900"></div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 md:px-8">
          <div className="text-center">
            <h1 className="mb-4 text-3xl font-bold text-slate-800 md:text-4xl dark:text-slate-100">
              Escolha como acessar o PoliMap
            </h1>
            <p className="mx-auto text-base text-slate-600 md:text-lg dark:text-slate-300">
              Duas formas simples de começar a explorar a universidade
            </p>
          </div>
        </div>
      </section>

      {/* Access Options */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Browser Option */}
          <Card
            className={`group relative overflow-hidden border transition-all duration-300 ${
              hoveredCard === 'browser'
                ? 'border-blue-500 shadow-lg scale-[1.02]'
                : 'border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md'
            }`}
            onMouseEnter={() => setHoveredCard('browser')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardHeader className="pb-4 pt-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                  Recomendado
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Jogar no Navegador
              </CardTitle>
              <CardDescription className="text-sm text-slate-600 dark:text-slate-300">
                Acesso instantâneo, sem instalação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pb-6">
              <ul className="space-y-2.5">
                <li className="flex items-start gap-3">
                  <Zap className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Início imediato, sem espera
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Monitor className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Funciona em qualquer dispositivo
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Mobile e desktop compatíveis
                  </span>
                </li>
              </ul>

              <Button
                asChild
                size="lg"
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                <a
                  href="http://patitow.itch.io/polimap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  Jogar Agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Download Option */}
          <Card
            className={`group relative overflow-hidden border transition-all duration-300 ${
              hoveredCard === 'download'
                ? 'border-green-500 shadow-lg scale-[1.02]'
                : 'border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md'
            }`}
            onMouseEnter={() => setHoveredCard('download')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardHeader className="pb-4 pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                <Download className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Fazer Download
              </CardTitle>
              <CardDescription className="text-sm text-slate-600 dark:text-slate-300">
                Instale e tenha acesso offline
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pb-6">
              <ul className="space-y-2.5">
                <li className="flex items-start gap-3">
                  <HardDrive className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Funciona sem internet
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Performance otimizada
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Monitor className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Carregamento mais rápido
                  </span>
                </li>
              </ul>

              <Button
                asChild
                size="lg"
                className="w-full bg-green-600 text-white hover:bg-green-700"
              >
                <a
                  href="http://patitow.itch.io/polimap#download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  Baixar Agora
                  <Download className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Project Images Gallery */}
      <section className="border-t border-slate-200 bg-white py-16 dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <ImageIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h2 className="mb-3 text-2xl font-bold text-slate-800 dark:text-slate-100">
              Conheça o PoliMap
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Explore imagens do projeto e veja como funciona a plataforma
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <Carousel className="w-full overflow-hidden rounded-xl relative">
              <CarouselContent className="-ml-0">
                {[
                  'https://img.itch.zone/aW1hZ2UvMzcwMDQ0Ny8yMjAyMTM1My5wbmc=/original/XoXG7S.png',
                  'https://img.itch.zone/aW1hZ2UvMzcwMDQ0Ny8yMjAyMTM1Ni5wbmc=/original/VQB%2Fgk.png',
                  'https://img.itch.zone/aW1hZ2UvMzcwMDQ0Ny8yMjAyMTM1NC5wbmc=/original/xBi5oH.png',
                  'https://img.itch.zone/aW1hZ2UvMzcwMDQ0Ny8yMjAyMTM1NS5wbmc=/original/JqkIwZ.png',
                  'https://img.itch.zone/aW1hZ2UvMzcwMDQ0Ny8yMjAyMTM1Ny5wbmc=/original/Y6q61v.png',
                ].map((imageUrl, index) => (
                  <CarouselItem key={imageUrl} className={index === 0 ? 'pl-0 pr-2' : index === 4 ? 'pl-2 pr-0' : 'pl-2 pr-2'}>
                    <div className="aspect-video w-full overflow-hidden rounded-xl will-change-transform">
                      <img
                        src={imageUrl}
                        alt={`Screenshot do PoliMap ${index + 1}`}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105 will-change-transform"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800" />
              <CarouselNext className="right-4 bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="border-t border-slate-200 bg-white py-12 dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <div className="text-center">
            <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-100">
              Não sabe qual escolher?
            </h2>
            <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
              Se é sua primeira vez, recomendamos começar pelo navegador. É rápido, fácil e não requer instalação.
            </p>
          </div>
        </div>
      </section>

      {/* Learn More CTA */}
      <section className="border-t border-slate-200 bg-slate-50 py-16 dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto max-w-3xl px-4 text-center md:px-8">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
              <Info className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            </div>
          </div>
          <h2 className="mb-3 text-2xl font-bold text-slate-800 dark:text-slate-100">
            Quer saber mais sobre o projeto?
          </h2>
          <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
            Conheça a história, objetivos e desenvolvimento do PoliMap
          </p>
          <Button
            asChild
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Link to="/sobre" className="flex items-center justify-center">
              Ver Sobre o Projeto
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

export default Acessar
