---
mode: agent
description: 'Implementa a tarefa T-01: contratos internos de clima e estado.'
---

# Prompt de Implementação — T-01

Você é o **Coding Agent** do SDD Weather App. Implemente somente a tarefa
`T-01 — Definir contratos internos de clima e estado`.

## Contexto

O projeto é uma SPA React + Vite em TypeScript strict para consultar a API
Open-Meteo. A arquitetura separa apresentação (`src/components/`),
orquestração (`src/hooks/`), acesso a dados (`src/services/`) e funções puras
(`src/lib/`). Os componentes e hooks devem depender de contratos internos, sem
conhecer os nomes dos campos dos payloads da Open-Meteo.

As temperaturas meteorológicas serão armazenadas em Celsius. A unidade de
exibição será controlada separadamente por `Unit`. Valores meteorológicos
ausentes, nulos ou inválidos devem ser representados por `null`, nunca por
zero. Busca de cidades e consulta meteorológica possuem estados independentes.

## Escopo da tarefa

Criar os contratos TypeScript compartilhados para:

- cidade selecionada e seus dados geográficos;
- condições meteorológicas atuais;
- previsão diária de cinco dias;
- conjunto completo de dados meteorológicos;
- unidade de temperatura;
- estados assíncronos de busca e consulta meteorológica;
- causas classificáveis de erro: rede, API e timeout.

## Contratos obrigatórios

Implemente em `src/types/weather.ts` tipos equivalentes aos seguintes contratos,
preservando os nomes públicos e a semântica:

```ts
export type Unit = 'celsius' | 'fahrenheit';

export interface City {
  name: string;
  latitude: number;
  longitude: number;
  country: string | null;
  countryCode: string | null;
  region: string | null;
}

export interface CurrentWeather {
  temperatureC: number | null;
  weatherCode: number | null;
  humidityPercent: number | null;
  windSpeedKmh: number | null;
  pressureHpa: number | null;
  precipitationMm: number | null;
}

export interface ForecastDay {
  localDate: string;
  minTemperatureC: number | null;
  maxTemperatureC: number | null;
  weatherCode: number | null;
  precipitationMm: number | null;
}

export interface WeatherData {
  city: City;
  timeZone: string;
  receivedAt: string;
  current: CurrentWeather;
  forecast: ForecastDay[];
}
```

Defina também os estados discriminados:

```ts
export type QueryErrorKind = 'network' | 'api' | 'timeout';

export type SearchState =
  | { status: 'idle' }
  | { status: 'loading'; query: string }
  | { status: 'success'; results: City[] }
  | { status: 'empty' }
  | { status: 'error'; kind: QueryErrorKind; query: string };

export type WeatherState =
  | { status: 'idle' }
  | { status: 'loading'; city: City }
  | { status: 'success'; data: WeatherData }
  | { status: 'error'; kind: QueryErrorKind; city: City };
```

Se o código existente já tiver um tipo equivalente para a causa do erro,
reutilize-o em vez de criar um sinônimo incompatível, desde que os valores
`network`, `api` e `timeout` continuem representáveis. Não adicione tipos de
payload da Open-Meteo nesta tarefa.

## Critérios de aceite

- `src/types/weather.ts` exporta `Unit`, `City`, `CurrentWeather`,
  `ForecastDay`, `WeatherData`, `SearchState` e `WeatherState`.
- `City` preserva nome, latitude, longitude, país, código do país e região;
  os três últimos campos aceitam `null`.
- Todos os campos meteorológicos numéricos aceitam `number | null`; nenhum
  contrato transforma ausência em zero.
- `WeatherData` contém a cidade selecionada, o fuso IANA, `receivedAt`, clima
  atual e uma lista de `ForecastDay`.
- `SearchState` possui exatamente os estados `idle`, `loading`, `success`,
  `empty` e `error`; `WeatherState` possui `idle`, `loading`, `success` e
  `error`.
- O estado `loading` de busca carrega o termo consultado e o estado `loading`
  meteorológico carrega a cidade consultada.
- Os estados de erro carregam `kind` com `network`, `api` ou `timeout` e
  preservam o termo ou a cidade relacionados à operação.
- O TypeScript strict, o lint e o build não apresentam erros introduzidos pela
  tarefa.

## Arquivo permitido

Edite ou crie somente:

- `src/types/weather.ts`

Não crie ainda services, hooks, componentes, chamadas `fetch`, conversões,
mapeamentos de códigos ou testes de integração. Não altere configurações,
`README.md` ou arquivos fora do escopo.

## Validação

Depois da implementação, execute:

```bash
pnpm lint
pnpm build
pnpm test
```

Se algum comando falhar por uma causa preexistente e não relacionada ao T-01,
identifique-a claramente no resumo final. Não corrija tarefas posteriores para
fazer este prompt parecer concluído.

## Formato do retorno

Informe de forma concisa:

1. arquivo alterado;
2. contratos implementados;
3. comandos executados e seus resultados;
4. qualquer bloqueio ou risco restante.