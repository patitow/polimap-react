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

- Navegação automatizada por pontos de interesse;
- Interface para inserção manual de localização e reposicionamento.

### 🏛️ Informações Históricas

- História de cada bloco da universidade;
- Descoberta das particularidades de cada espaço.

## 🚀 Como Acessar

### Opção 1: Navegador (Recomendado para primeira experiência)

- **Acesso instantâneo** sem downloads
- **Compatível** com qualquer dispositivo
- **Experiência completa** online
- [🎮 Jogar Agora no Navegador](http://patitow.itch.io/polimap)

### Opção 2: Download (Recomendado para uso frequente)

- **Acesso offline** completo
- **Melhor performance** e carregamento mais rápido
- **Sem dependência** de internet
- [📥 Baixar PoliMap](https://drive.google.com/drive/folders/12WekLUy89n_vVxszXsv0okOwqtr5Aysz?usp=sharing)

## 🛠️ Tecnologias Utilizadas

### Frontend (Interface Web)

- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset tipado do JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Vite** - Build tool moderna e rápida
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones modernos

### Game Engine (Experiência 3D)

- **Godot Engine** - Engine de jogos 2D/3D
- **WebGL** - Renderização gráfica no navegador
- **Blender** - Modelagem 3D dos ambientes

### Desenvolvimento

- **Node.js** - Runtime JavaScript
- **ESLint** - Linter para qualidade de código
- **Prettier** - Formatador de código
- **Responsive Design** - Design adaptável

## 📚 Documentação Acadêmica

Este projeto foi desenvolvido como **Trabalho de Conclusão de Curso** em Engenharia de Computação.

### Informações da Monografia

- **Autor:** Matheus Souza de Oliveira
- **Orientador:** Prof. Dr. Hemir Da Cunha Santiago
- **Ano:** 2025
- **Formato:** PDF

[📖 Baixar Monografia Completa](https://drive.google.com/file/d/1kSh8eq2SGvpclyhiqme_581CpPTZCr7P/view?usp=sharing)

## 🏗️ Estrutura do Projeto

```
polimap-js-client/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── navbar/         # Barra de navegação
│   │   ├── theme-toggler/  # Alternador de tema
│   │   └── ui/            # Componentes de interface
│   ├── pages/             # Páginas da aplicação
│   │   ├── home/          # Página inicial
│   │   ├── acesso/        # Página de acesso
│   │   ├── sobre/         # Página sobre o projeto
│   │   └── tutorial/      # Página de tutorial
│   ├── providers/         # Provedores de contexto
│   └── lib/              # Utilitários
├── public/               # Arquivos estáticos
└── dist/                # Build de produção
```

## 🚀 Instalação e Desenvolvimento

### Pré-requisitos

- Node.js (versão 18 ou superior)
- Yarn (gerenciador de pacotes)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/patitow/polimap-js-client.git

# Entre no diretório
cd polimap-js-client

# Instale as dependências
yarn install
```

### Scripts Disponíveis

```bash
# Desenvolvimento
yarn dev          # Inicia servidor de desenvolvimento

# Build
yarn build        # Gera build de produção

# Linting
yarn lint         # Executa ESLint

# Formatação
yarn format       # Formata código com Prettier

# Preview
yarn preview      # Visualiza build de produção
```

## 📁 Repositórios Relacionados

- **Frontend (React):** [polimap-js-client](https://github.com/patitow/polimap-js-client)
- **Game Engine (Godot):** [polimap-godot](https://github.com/patitow/polimap-godot)
- **Projeto Godot Completo:** [Drive](https://drive.google.com/drive/folders/1FQtqfgjIJe6PsUChLlpXqWQRLFPh2vDR?usp=drive_link)

## 🤝 Contribuição

Este é um projeto acadêmico desenvolvido como monografia. Para sugestões ou melhorias, entre em contato através dos canais disponíveis.

## 📞 Contato

- **LinkedIn:** [linkedin.com/in/patitow](https://www.linkedin.com/in/patitow/)
- **GitHub:** [@patitow](https://github.com/patitow)
- **Itch.io:** [PoliMap Game](http://patitow.itch.io/polimap)

## 📄 Licença

Este projeto foi desenvolvido como trabalho acadêmico. Todos os direitos reservados.

---

**PoliMap** - Conheça a universidade como a palma da sua mão! 🎓✨
