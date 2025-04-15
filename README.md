# Visa Platform - Web Client

Frontend da plataforma Visa, desenvolvido com Next.js, TypeScript e TailwindCSS.

## Pré-requisitos

- Node.js 20.x ou superior
- npm 10.x ou superior

## Instalação

1. Clone o repositório
2. Navegue até a pasta do projeto

```bash
cd visa-platform/web-client
```

3. Instale as dependências

```bash
npm install
```

4. Copie o arquivo .env.example para .env.local e configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

## Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000).

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria uma build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa verificação de lint
- `npm run format` - Formata os arquivos usando Prettier

## Estrutura do Projeto

- `/src/app` - Rotas e páginas da aplicação (App Router)
- `/src/components` - Componentes reutilizáveis
- `/src/lib` - Bibliotecas e utilitários
- `/src/types` - Tipos TypeScript
- `/public` - Arquivos estáticos

## Testes

Os testes serão implementados usando Jest e React Testing Library.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
