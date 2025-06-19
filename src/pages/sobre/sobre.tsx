'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Download,
  GraduationCap,
  Users,
  Target,
  Lightbulb,
  Award,
  BookOpen,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'

function Sobre() {
  const objectives = [
    {
      icon: <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: 'Facilitar a Navegação',
      description: 'Ajudar estudantes a se localizarem facilmente no campus universitário.',
    },
    {
      icon: <Users className="h-6 w-6 text-green-600 dark:text-green-400" />,
      title: 'Melhorar a Experiência',
      description: 'Proporcionar uma experiência mais agradável e eficiente na universidade.',
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />,
      title: 'Inovação Tecnológica',
      description: 'Aplicar tecnologias modernas para resolver problemas reais do dia a dia.',
    },
  ]

  const features = [
    'Mapas interativos em 3D',
    'Sistema de navegação inteligente',
    'Informações históricas dos blocos',
    'Perfis dos professores e pesquisadores',
    'Interface intuitiva e responsiva',
    'Compatibilidade multiplataforma',
  ]

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900"></div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-4 text-sm">
              <GraduationCap className="mr-2 h-4 w-4" />
              Projeto de Monografia
            </Badge>
            <h1 className="mb-6 text-4xl font-bold text-slate-800 md:text-6xl dark:text-slate-100">
              Sobre o PoliMap
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-lg text-slate-600 md:text-xl dark:text-slate-300">
              Uma plataforma virtual interativa desenvolvida como projeto de monografia, criada para
              revolucionar a forma como os estudantes navegam pelo campus universitário.
            </p>
            <Button
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => {
                // Scroll para a seção de download da monografia
                document.getElementById('monografia')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Baixar Monografia
              <FileText className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Project Overview */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-bold text-slate-800 md:text-4xl dark:text-slate-100">
              O Projeto
            </h2>
            <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
              <p>
                O PoliMap nasceu da necessidade real observada no campus universitário: a
                dificuldade de novos estudantes em se localizarem e navegarem pelos diversos blocos
                e salas da universidade.
              </p>
              <p>
                Desenvolvido como projeto de monografia, o PoliMap combina tecnologias modernas de
                desenvolvimento web e game design para criar uma experiência única e intuitiva de
                navegação virtual.
              </p>
              <p>
                O projeto vai além de um simples mapa digital, oferecendo uma experiência imersiva
                que inclui informações históricas, perfis de professores e um sistema inovador de
                navegação inteligente.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 p-8 dark:from-blue-900/30 dark:to-blue-800/30">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="mb-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
                    2025
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    Ano de Desenvolvimento
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-3xl font-bold text-blue-600 dark:text-blue-400">6+</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    Meses de Pesquisa
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
                    100+
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    Horas de Desenvolvimento
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-3xl font-bold text-blue-600 dark:text-blue-400">1</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">Campus Mapeado</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="bg-slate-100 py-16 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-800 md:text-4xl dark:text-slate-100">
              Objetivos do Projeto
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-slate-600 dark:text-slate-300">
              Os principais objetivos que nortearam o desenvolvimento do PoliMap
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {objectives.map((objective, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                    {objective.icon}
                  </div>
                  <CardTitle className="text-xl text-slate-800 dark:text-white">
                    {objective.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-slate-600 dark:text-slate-300">
                    {objective.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-bold text-slate-800 md:text-4xl dark:text-slate-100">
              Funcionalidades Desenvolvidas
            </h2>
            <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">
              O PoliMap oferece um conjunto abrangente de funcionalidades pensadas para atender às
              necessidades reais dos usuários.
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                    <div className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400"></div>
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src="/placeholder.svg?height=400&width=500"
              alt="PoliMap Interface"
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Monografia Download Section */}
      <section
        id="monografia"
        className="bg-gradient-to-r from-slate-800 to-slate-900 py-20 text-white dark:from-slate-900 dark:to-black"
      >
        <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">Acesse a Monografia Completa</h2>
          <p className="mx-auto mb-8 max-w-3xl text-lg text-slate-300">
            Conheça todos os detalhes do desenvolvimento do PoliMap, desde a concepção até a
            implementação. A monografia apresenta a metodologia, tecnologias utilizadas, resultados
            obtidos e conclusões do projeto.
          </p>

          <Card className="mx-auto max-w-2xl border-white/20 bg-white/10 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center justify-center text-white">
                <Award className="mr-2 h-6 w-6" />
                Documento Acadêmico
              </CardTitle>
              <CardDescription className="text-slate-300">
                Trabalho de Conclusão de Curso - Engenharia de Computação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Autor:</span>
                  <div className="font-semibold text-white">Matheus Souza de Oliveira</div>
                </div>
                <div>
                  <span className="text-slate-400">Ano:</span>
                  <div className="font-semibold text-white">2025</div>
                </div>
                <div>
                  <span className="text-slate-400">Orientador:</span>
                  <div className="font-semibold text-white">Prof. Dr. Hemir Da Cunha Santiago </div>
                </div>
                <div>
                  <span className="text-slate-400">Formato:</span>
                  <div className="font-semibold text-white">PDF</div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {
                  // Placeholder para o link de download da monografia
                  alert('Link para download da monografia será configurado em breve!')
                }}
              >
                <Download className="mr-2 h-5 w-5" />
                Baixar Monografia (PDF)
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Technologies Used */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="text-center">
          <h2 className="mb-6 text-3xl font-bold text-slate-800 md:text-4xl dark:text-slate-100">
            Tecnologias Utilizadas
          </h2>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
            O PoliMap foi desenvolvido utilizando tecnologias modernas e robustas
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {[
              'React',
              'TypeScript',
              'Godot',
              'Tailwind CSS',
              'Node.js',
              'WebGL',
              'Blender',
              'Responsive Design',
            ].map((tech, index) => (
              <div
                key={index}
                className="rounded-lg bg-white p-4 shadow-md transition-transform hover:scale-105 dark:bg-slate-800"
              >
                <span className="font-semibold text-slate-700 dark:text-slate-300">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-slate-100 py-16 dark:bg-slate-800">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
          <h2 className="mb-6 text-3xl font-bold text-slate-800 md:text-4xl dark:text-slate-100">
            Pronto para explorar o PoliMap?
          </h2>
          <p className="mx-auto mb-8 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
            Experimente agora mesmo a plataforma que está revolucionando a navegação universitária.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => (window.location.href = '/acessar')}
            >
              Começar a Usar
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-slate-300 text-slate-700 hover:bg-slate-200 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              onClick={() => (window.location.href = '/')}
            >
              Voltar ao Início
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Sobre
