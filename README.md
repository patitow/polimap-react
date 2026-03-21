# PoliMap

![PoliMap Logo](public/polimap_text.svg)

> **Uma plataforma virtual interativa para facilitar a navegação no campus universitário**

O PoliMap é um projeto de monografia desenvolvido para revolucionar a forma como os estudantes navegam pelo campus universitário. Combinando tecnologias modernas de desenvolvimento web e game design, oferece uma experiência única e intuitiva de navegação virtual em 3D.

## 🎯 Sobre o Projeto

O PoliMap nasceu da necessidade real observada no campus universitário: a dificuldade de novos estudantes em se localizarem e navegarem pelos diversos blocos e salas da universidade. O projeto vai além de um simples mapa digital, oferecendo uma experiência imersiva que inclui:

- **Mapas interativos em 3D** construídos com fidelidade à representação real da universidade
- **Sistema de navegação inteligente** para encontrar o melhor caminho
- **Informações históricas dos blocos** e suas particularidades
- **Interface intuitiva e responsiva** compatível com múltiplas plataformas

## ✨ Funcionalidades

### 🗺️ Navegação Inteligente

- Localização fácil de salas de aula através de mapas interativos
- Visualização de caminhos posicionados fielmente à representação real da universidade
- Obtenção do melhor caminho para o destino de forma facilitada

### 📍 Sistema de Localização

- Navegação automatizada por pontos de interesse
- Interface para inserção manual de localização e reposicionamento

### 🏛️ Informações Históricas

- História de cada bloco da universidade
- Descoberta das particularidades de cada espaço

## 🚀 Como Acessar

### Opção 1: Navegador (recomendado para primeira experiência)

- **Acesso instantâneo** sem downloads
- **Compatível** com qualquer dispositivo
- **Experiência completa** online
- [🎮 Jogar no navegador (itch.io)](https://patitow.itch.io/polimap)

**Deploy institucional (produção):** [polimap.vercel.app](https://polimap.vercel.app/)

### Opção 2: Download (recomendado para uso frequente)

- **Acesso offline** completo (quando disponível na build)
- **Melhor performance** e carregamento mais rápido
- [📥 Baixar PoliMap (Google Drive)](https://drive.google.com/drive/folders/12WekLUy89n_vVxszXsv0okOwqtr5Aysz?usp=sharing)

## 🛠️ Tecnologias Utilizadas

### Frontend (interface web)

- **React** — interfaces de utilizador
- **TypeScript** — JavaScript tipado
- **Tailwind CSS** — estilos utilitários
- **Vite** — build rápida
- **Radix UI** — componentes acessíveis
- **Lucide React** — ícones

### Motor 3D / conteúdo

- **Godot Engine** — runtime e exportação WebGL
- **WebGL** — renderização no navegador
- **Blender** — modelagem 3D dos ambientes

### Desenvolvimento

- **Node.js** — runtime JavaScript
- **ESLint** — lint
- **Prettier** — formatação
- **Design responsivo**

## 📚 Documentação académica

Este trabalho foi desenvolvido no âmbito de **Trabalho de Conclusão de Curso** em Engenharia de Computação.

### Informações da monografia

- **Autor:** Matheus Souza de Oliveira
- **Orientador:** Prof. Dr. Hemir da Cunha Santiago
- **Ano:** 2025
- **Formato:** PDF

[📖 Baixar monografia (PDF)](https://drive.google.com/file/d/1kSh8eq2SGvpclyhiqme_581CpPTZCr7P/view?usp=sharing)

## 🏗️ Estrutura do projeto

```
polimap-react/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── navbar/          # Barra de navegação
│   │   ├── theme-toggler/   # Alternador de tema
│   │   └── ui/              # Componentes de interface
│   ├── pages/               # Páginas da aplicação
│   │   ├── home/
│   │   ├── acesso/
│   │   ├── sobre/
│   │   └── tutorial/
│   ├── providers/
│   └── lib/
├── public/                  # Ficheiros estáticos
└── dist/                    # Build de produção (gerado)
```

## 🚀 Instalação e desenvolvimento

### Pré-requisitos

- Node.js 18 ou superior
- Yarn

### Instalação

```bash
git clone https://github.com/patitow/polimap-react.git
cd polimap-react
yarn install
```

### Scripts

```bash
yarn dev       # Servidor de desenvolvimento
yarn build     # Build de produção
yarn lint      # ESLint
yarn format    # Prettier
yarn preview   # Pré-visualizar o build
```

## 📁 Repositórios relacionados

- **Frontend (React):** [patitow/polimap-react](https://github.com/patitow/polimap-react)
- **Motor Godot:** [patitow/polimap-godot](https://github.com/patitow/polimap-godot)
- **Projeto Godot completo (backup / assets):** [Google Drive](https://drive.google.com/drive/folders/1FQtqfgjIJe6PsUChLlpXqWQRLFPh2vDR?usp=drive_link)

## 🤝 Contribuição

Sugestões e melhorias são bem-vindas via *issues* ou *pull requests*. Mantém a licença MIT e respeita a atribuição dos autores em trabalhos derivados.

## 📞 Contato

- **LinkedIn:** [linkedin.com/in/patitow](https://www.linkedin.com/in/patitow/)
- **GitHub:** [@patitow](https://github.com/patitow)
- **Itch.io:** [PoliMap](https://patitow.itch.io/polimap)

## 📄 Licença

Este repositório é distribuído sob a **licença MIT**. Consulte o ficheiro [`LICENSE`](LICENSE) para o texto integral. O código pode ser reutilizado conforme os termos da licença; **marcas, logotipos institucionais ou materiais de terceiros** incluídos no projeto podem ter restrições próprias — verifica a origem de cada asset antes de republicar.

A licença MIT aplica-se ao **código-fonte** disponibilizado aqui. A **monografia** e outros documentos académicos seguem as regras da instituição e dos autores quanto à citação e reprodução.

---

**PoliMap** — Conheça a universidade como a palma da sua mão.
