import { useState, useEffect } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import {
  MapPin,
  Navigation,
  QrCode,
  History,
  School,
  ArrowRight,
  GitBranch,
  Mail,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useClerk } from '@clerk/clerk-react'

function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const navigate = useNavigate()
  const { isSignedIn } = useClerk()

  const images = [
    'https://serdigital.com.br/educacaotransformadora/images/slider/poli1.jpg',
    'https://serdigital.com.br/educacaotransformadora/images/slider/poli2.jpg',
  ]

  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-slate-700 dark:text-slate-300" />,
      title: 'Localização Fácil',
      description: 'Encontre sua sala de aula com facilidade através de mapas interativos.',
    },
    {
      icon: <Navigation className="h-8 w-8 text-slate-700 dark:text-slate-300" />,
      title: 'Navegação Interativa',
      description:
        'Visualize caminhos posicionados fielmente à representação real da universidade.',
    },
    {
      icon: <QrCode className="h-8 w-8 text-slate-700 dark:text-slate-300" />,
      title: 'Posicionamento por QR Code',
      description: 'Leia um QR Code do PoliMap mais próximo e seja posicionado automaticamente.',
    },
    {
      icon: <History className="h-8 w-8 text-slate-700 dark:text-slate-300" />,
      title: 'História dos Blocos',
      description: 'Descubra a história de cada bloco da universidade e suas particularidades.',
    },
    {
      icon: <School className="h-8 w-8 text-slate-700 dark:text-slate-300" />,
      title: 'Conheça os Professores',
      description: 'Saiba mais sobre os professores e suas áreas de pesquisa.',
    },
  ]

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => {
        return (prevIndex + 1) % images.length
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [images.length])

  const handleStartExploring = () => {
    if (isSignedIn) {
      navigate('/play')
    } else {
      navigate('/sign-up')
    }
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative h-dvh w-full overflow-hidden">
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-slate-900/80 to-slate-800/60 dark:from-slate-950/90 dark:to-slate-900/70"></div>
        <img
          src={images[currentImageIndex] || '/placeholder.svg'}
          alt="Poli Campus"
          className="absolute inset-0 h-full w-full object-cover blur-md transition-opacity duration-1000"
        />
        <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 pt-16 text-center">
          <h2 className="mb-2 text-2xl font-light tracking-wider text-slate-200 md:text-4xl">
            SEJA BEM-VINDO AO
          </h2>
          <div className="mb-6 flex items-center text-5xl font-bold md:text-7xl">
            <img src="/polimap_text.svg" alt="PoliMap" className="h-16" />
          </div>
          <p className="mb-8 max-w-2xl text-lg text-slate-100 md:text-xl">
            O PoliMap é uma plataforma virtual interativa, responsável por facilitar a locomoção do
            estudante pela universidade.
          </p>
          {isSignedIn ? (
            <Link to="/play">
              <Button className="rounded-full bg-blue-500 px-8 py-6 text-lg text-white transition-all hover:scale-105 hover:bg-blue-600">
                Começar a Explorar <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Button
              onClick={handleStartExploring}
              className="rounded-full bg-blue-500 px-8 py-6 text-lg text-white transition-all hover:scale-105 hover:bg-blue-600"
            >
              Começar a Explorar <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-bold text-slate-800 md:text-4xl dark:text-slate-100">
              Conheça a universidade como a palma da sua mão
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              No PoliMap você pode localizar a sua sala de aula facilmente, podendo visualizar o
              caminho de forma interativa, por meio de mapas e sistemas de navegação via caminhos
              posicionados fielmente à representação real da universidade.
            </p>
            <p className="mb-8 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Não sabe onde exatamente você está no mapa? Sem problemas, leia um QR Code de PoliMap
              mais próximo e seja posicionado automaticamente.
            </p>
            <Link to="/sobre">
              <Button
                variant="outline"
                className="border-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
              >
                Saiba mais
              </Button>
            </Link>
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
      <section className="bg-slate-100 py-16 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-800 md:text-4xl dark:text-slate-100">
              Recursos do PoliMap
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-slate-600 dark:text-slate-300">
              Descubra a história de cada bloco da universidade, conheça seus professores e suas
              áreas de pesquisa. Visite as salas da universidade de uma forma totalmente nova.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl dark:bg-slate-700"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 p-3 dark:bg-slate-600">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-slate-800 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 py-20 text-white dark:from-slate-900 dark:to-black">
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
            <Button
              onClick={handleStartExploring}
              variant="outline"
              className="rounded-full bg-blue-500 px-8 py-6 text-lg text-white hover:bg-blue-600"
            >
              Começar Agora
            </Button>
            <Link to="/tutorial">
              <Button
                variant="outline"
                className="rounded-full bg-red-500 px-8 py-6 text-lg text-white hover:bg-red-800 hover:text-white"
              >
                Ver Tutorial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-800 md:text-4xl dark:text-slate-100">
            O que dizem os estudantes
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Veja como o PoliMap tem ajudado os alunos da universidade
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-4 flex items-center">
              <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <img
                  src="/placeholder.svg?height=48&width=48"
                  alt="Estudante"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-white">Ana Silva</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Engenharia Civil - 3º ano
                </p>
              </div>
            </div>
            <p className="text-slate-600 italic dark:text-slate-300">
              "O PoliMap me salvou no primeiro semestre! Consegui encontrar todas as salas sem me
              perder uma única vez."
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-4 flex items-center">
              <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <img
                  src="/placeholder.svg?height=48&width=48"
                  alt="Estudante"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-white">Pedro Santos</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Engenharia Elétrica - 2º ano
                </p>
              </div>
            </div>
            <p className="text-slate-600 italic dark:text-slate-300">
              "A função de QR Code é incrível! Sempre sei onde estou e para onde preciso ir.
              Economizo muito tempo entre as aulas."
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-4 flex items-center">
              <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <img
                  src="/placeholder.svg?height=48&width=48"
                  alt="Estudante"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-white">Juliana Costa</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Engenharia de Computação - 4º ano
                </p>
              </div>
            </div>
            <p className="text-slate-600 italic dark:text-slate-300">
              "Além de ajudar na localização, aprendi muito sobre a história da universidade. É uma
              ferramenta completa!"
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-100 py-8 dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <p className="text-slate-600 dark:text-slate-300">
                © {new Date().getFullYear()} PoliMap. Todos os direitos reservados.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/tutorial"
                className="text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white"
              >
                Tutorial
              </Link>
              <Link
                to="/sobre"
                className="text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white"
              >
                Sobre
              </Link>
              <a
                href="mailto:msdo@poli.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white"
              >
                <Mail className="h-4 w-4" />
                Contato via email
              </a>
              <a
                href="https://github.com/patitow"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white"
              >
                <GitBranch className="h-4 w-4" />
                Meu GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
