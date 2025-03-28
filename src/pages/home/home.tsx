import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPlugin,
  CarouselPrevious,
} from '@/components/ui/carousel'
import './home.css'
import { Card, CardContent } from '@/components/ui/card'

function Home() {
  const plugin = CarouselPlugin()
  const images = [
    'https://serdigital.com.br/educacaotransformadora/images/slider/poli1.jpg',
    'https://serdigital.com.br/educacaotransformadora/images/slider/poli2.jpg',
  ]
  return (
    <div className="h-dvh w-dvw overflow-x-hidden overflow-y-auto pt-16">
      <section className="jaro flex h-40 w-full flex-col items-center justify-center">
        <h2 className="text-primary text-4xl">SEJA BEM-VINDO AO</h2>
        <span className="flex text-5xl">
          <h1 className="text-blue-500">POLI</h1>
          <h1 className="text-red-500">MAP</h1>
        </span>
      </section>
      <section className="flex w-full flex-col items-center justify-center gap-4">
        <Carousel
          plugins={[plugin.current]}
          className="w-full max-w-xs"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <span>
          Venha conhecer a nossa universidade como a palma da sua mão! 
          <br />
          No PoliMap você pode viver a
          universidade em um ambiente virtual simplificado, facilitando a identificação de lugares
          chave, e viabilizando sua locomoção mais eficiente!
        </span>
      </section>
    </div>
  )
}

export default Home
