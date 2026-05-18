# my-backstage

Instância [Backstage](https://backstage.io) para portal de desenvolvedores, com catálogo via GitHub Discovery, busca em Elasticsearch e plugin World Clock.

## Requisitos

- **Node.js** 22 ou 24
- **Yarn** 4.4.1 (definido em `packageManager` no `package.json`)
- **Docker** (PostgreSQL e Elasticsearch em desenvolvimento local)
- **OpenSSL** no PATH (para certificados TLS do Elasticsearch; vem com Git for Windows)

## Configuração

Crie um arquivo `.env` na raiz do repositório (não versionado). O comando `yarn start` carrega essas variáveis via `dotenv-cli`.

Exemplo:

```env
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_USER=backstage
POSTGRES_PASSWORD=backstage
POSTGRES_DB=backstage_main

GITHUB_TOKEN=ghp_...

# Mesmo valor de ELASTIC_PASSWORD em docker/elasticsearch/compose.env
ELASTICSEARCH_PASSWORD=elasticsearch_my_backstage
```

| Variável | Uso |
|----------|-----|
| `POSTGRES_*` | Banco do backend (`app-config.yaml`) |
| `GITHUB_TOKEN` | Integração GitHub (discovery de catálogo, scaffolder) |
| `ELASTICSEARCH_PASSWORD` | Motor de busca local |

## Infraestrutura local (Docker)

### PostgreSQL

```sh
docker compose -f docker/docker-compose.postgresql.yaml up -d
```

O compose usa as variáveis `POSTGRES_USER` e `POSTGRES_PASSWORD` do `.env`. O banco criado no container é `backstage_main` — use `POSTGRES_DB=backstage_main` no `.env`.

### Elasticsearch (busca)

1. Gere os certificados TLS (apenas na primeira vez):

   ```powershell
   .\scripts\generate-elasticsearch-local-certs.ps1
   ```

2. Ajuste a senha em `docker/elasticsearch/compose.env` se necessário (antes do primeiro `up`).

3. Suba o cluster:

   ```sh
   docker compose -f docker/docker-compose.elasticsearch.yml up -d
   ```

4. Defina `ELASTICSEARCH_PASSWORD` no `.env` com o mesmo valor de `ELASTIC_PASSWORD` em `docker/elasticsearch/compose.env`.

## Desenvolvimento

```sh
yarn install
yarn start
```

- Frontend: http://localhost:3000  
- Backend: http://localhost:7007  

Autenticação local usa o provider **guest**; o backend também inclui o módulo GitHub para outros fluxos de auth.

## Scripts úteis

| Comando | Descrição |
|---------|-----------|
| `yarn start` | Sobe frontend e backend em modo dev |
| `yarn build:all` | Build de todos os pacotes |
| `yarn test` | Testes do monorepo |
| `yarn lint` | Lint nos pacotes alterados desde `origin/master` |
| `yarn fix` | Correções automáticas do CLI |

## O que está configurado

- **Catálogo**: entidades locais em `examples/` e providers GitHub Discovery (`lucaspalharesbarbosa`, `edulucca`, `Nexus-Evolution-Tech`) — ver `app-config.yaml`.
- **Busca**: Elasticsearch 7.17 (Docker), não PostgreSQL.
- **Frontend**: `createApp` com catálogo na raiz (`/`), sidebar customizada em `packages/app/src/modules/nav/` e plugin [`@lucaspalharesbarbosa/backstage-plugin-world-clock-plugin`](https://www.npmjs.com/package/@lucaspalharesbarbosa/backstage-plugin-world-clock-plugin).

## Documentação

- [Backstage docs](https://backstage.io/docs)
- [GitHub Discovery](https://backstage.io/docs/integrations/github/discovery/)
- [Search — Elasticsearch](https://backstage.io/docs/features/search/search-engines)
