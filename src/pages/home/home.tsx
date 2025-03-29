'use client'

import { useState, useEffect } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { MapPin, Navigation, QrCode, History, School, ArrowRight } from 'lucide-react'

function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const images = [
    'https://serdigital.com.br/educacaotransformadora/images/slider/poli1.jpg',
    'https://serdigital.com.br/educacaotransformadora/images/slider/poli2.jpg',
  ]

  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-slate-700" />,
      title: 'Localização Fácil',
      description: 'Encontre sua sala de aula com facilidade através de mapas interativos.',
    },
    {
      icon: <Navigation className="h-8 w-8 text-slate-700" />,
      title: 'Navegação Interativa',
      description:
        'Visualize caminhos posicionados fielmente à representação real da universidade.',
    },
    {
      icon: <QrCode className="h-8 w-8 text-slate-700" />,
      title: 'Posicionamento por QR Code',
      description: 'Leia um QR Code do PoliMap mais próximo e seja posicionado automaticamente.',
    },
    {
      icon: <History className="h-8 w-8 text-slate-700" />,
      title: 'História dos Blocos',
      description: 'Descubra a história de cada bloco da universidade e suas particularidades.',
    },
    {
      icon: <School className="h-8 w-8 text-slate-700" />,
      title: 'Conheça os Professores',
      description: 'Saiba mais sobre os professores e suas áreas de pesquisa.',
    },
  ]

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => {
        console.log(prevIndex + 1, images.length)
        return (prevIndex + 1) % images.length
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-dvh w-full overflow-hidden">
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-slate-900/80 to-slate-800/60"></div>
        <img
          src={images[currentImageIndex]}
          alt="Poli Campus"
          className="absolute inset-0 h-full w-full object-cover blur-md transition-opacity duration-1000"
        />
        <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 pt-16 text-center">
          <h2 className="jaro mb-2 text-2xl font-light tracking-wider text-slate-200 md:text-4xl">
            SEJA BEM-VINDO AO
          </h2>
          <div className="mb-6 flex items-center text-5xl font-bold md:text-7xl">
            <img src="/polimap_text.svg" alt="PoliMap" className="h-16" />
          </div>
          <p className="mb-8 max-w-2xl text-lg text-slate-100 md:text-xl">
            O PoliMap é uma plataforma virtual interativa, responsável por facilitar a locomoção do
            estudante pela universidade.
          </p>
          <Button className="rounded-full bg-blue-500 px-8 py-6 text-lg text-white transition-all hover:scale-105 hover:bg-blue-600">
            Começar a Explorar <ArrowRight className="ml-2 h-12 w-12" />
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-bold text-slate-800 md:text-4xl">
              Conheça a universidade como a palma da sua mão
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-slate-600">
              No PoliMap você pode localizar a sua sala de aula facilmente, podendo visualizar o
              caminho de forma interativa, por meio de mapas e sistemas de navegação via caminhos
              posicionados fielmente à representação real da universidade.
            </p>
            <p className="mb-8 text-lg leading-relaxed text-slate-600">
              Não sabe onde exatamente você está no mapa? Sem problemas, leia um QR Code de PoliMap
              mais próximo e seja posicionado automaticamente.
            </p>
            <Button
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Saiba mais
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl shadow-2xl">
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-video overflow-hidden rounded-xl">
                      <img
                        src={image || '/placeholder.svg'}
                        alt={`Campus da Poli ${index + 1}`}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-100 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-800 md:text-4xl">
              Recursos do PoliMap
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-slate-600">
              Descubra a história de cada bloco da universidade, conheça seus professores e suas
              áreas de pesquisa. Visite as salas da universidade de uma forma totalmente nova.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 p-3">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-slate-800">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 py-20 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Pronto para explorar a universidade?
          </h2>
          <p className="mx-auto mb-8 max-w-3xl text-lg text-slate-300">
            Venha conhecer a nossa universidade como a palma da sua mão! No PoliMap você pode viver
            a universidade em um ambiente virtual simplificado, facilitando a identificação de
            lugares chave, e viabilizando sua locomoção mais eficiente!
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/10 hover:text-secondary rounded-full px-8 py-6 text-lg">
              Começar Agora
            </Button>
            <Button
              variant="outline"
              className="border-primary text-secondary-foreground hover:bg-secondary/10 hover:text-secondary rounded-full px-8 py-6 text-lg"
            >
              Ver Tutorial
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-800 md:text-4xl">
            O que dizem os estudantes
          </h2>
          <p className="text-lg text-slate-600">
            Veja como o PoliMap tem ajudado os alunos da universidade
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
            <div className="mb-4 flex items-center">
              <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-slate-200">
                <img
                  src="/placeholder.svg?height=48&width=48"
                  alt="Estudante"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Ana Silva</h4>
                <p className="text-sm text-slate-500">Engenharia Civil - 3º ano</p>
              </div>
            </div>
            <p className="text-slate-600 italic">
              "O PoliMap me salvou no primeiro semestre! Consegui encontrar todas as salas sem me
              perder uma única vez."
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
            <div className="mb-4 flex items-center">
              <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-slate-200">
                <img
                  src="/placeholder.svg?height=48&width=48"
                  alt="Estudante"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Pedro Santos</h4>
                <p className="text-sm text-slate-500">Engenharia Elétrica - 2º ano</p>
              </div>
            </div>
            <p className="text-slate-600 italic">
              "A função de QR Code é incrível! Sempre sei onde estou e para onde preciso ir.
              Economizo muito tempo entre as aulas."
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
            <div className="mb-4 flex items-center">
              <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-slate-200">
                <img
                  src="/placeholder.svg?height=48&width=48"
                  alt="Estudante"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Juliana Costa</h4>
                <p className="text-sm text-slate-500">Engenharia de Computação - 4º ano</p>
              </div>
            </div>
            <p className="text-slate-600 italic">
              "Além de ajudar na localização, aprendi muito sobre a história da universidade. É uma
              ferramenta completa!"
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
