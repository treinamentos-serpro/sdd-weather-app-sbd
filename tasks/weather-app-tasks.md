# Tarefas de Implementação — Weather App

Backlog granular derivado de [`plans/weather-app-plan.md`](../plans/weather-app-plan.md)
e rastreado à [especificação](../specs/weather-app-spec.md). A sequência
canônica de execução está abaixo; as seções seguintes mantêm o detalhamento de
cada tarefa e seus critérios de aceite. Cada item mantém uma responsabilidade
principal, envolve no máximo um ou dois arquivos relevantes e pode ser
implementado e validado isoladamente. Os critérios de aceite devem ser
verificados por teste automatizado, inspeção objetiva ou execução documentada.

## Ordem de implementação

As tarefas de teste ficam depois da integração para separar construção do
produto e sua validação. A infraestrutura de teste e as fixtures são preparadas
no início da entrega de testes, antes dos testes que dependem delas.

1. **Tipos:** T-01.
2. **Funções puras:** T-04, T-06, T-08, T-10.
3. **Services:** T-12, T-14, T-16.
4. **Hook:** T-18, T-20, T-21, T-23.
5. **Componentes:** T-25, T-27, T-29, T-31, T-33, T-35.
6. **Integração:** T-37.
7. **Testes:** T-02, T-03, T-05, T-07, T-09, T-11, T-13, T-15, T-17,
   T-19, T-22, T-24, T-26, T-28, T-30, T-32, T-34, T-36, T-38, T-39,
   T-40, T-41, T-42.
8. **Hardening:** T-43, T-44, T-45.

### Dependências entre fases

- T-01 é a base dos tipos usados nas demais camadas.
- T-04, T-06, T-08 e T-10 dependem somente dos contratos e alimentam os
  services e componentes.
- T-12 fornece o transporte comum; T-14 depende de T-04 e T-12; T-16 depende
  de T-08, T-10 e T-12.
- T-18 inicia o hook de busca; T-20 depende do Forecast; T-21 adiciona a regra
  de concorrência; T-23 adiciona a unidade.
- T-25, T-27, T-29, T-31, T-33 e T-35 consomem apenas o hook e os utilitários
  necessários; T-37 integra esses componentes.
- T-02 e T-03 são executadas no começo da fase de testes. As demais tarefas de
  teste dependem da implementação que validam e, quando necessário, de T-02 e
  T-03.
- T-43 e T-44 dependem dos testes integrados/E2E; T-45 encerra o backlog após
  responsividade, acessibilidade e hardening.

## Entrega 1 — Fundação e contratos

### T-01 — Definir contratos internos de clima e estado

- **Descrição:** Criar tipos para cidade, clima atual, previsão diária, dados meteorológicos, unidade e estados independentes de busca e consulta.
- **Critérios de aceite:**
  - `City`, `CurrentWeather`, `ForecastDay`, `WeatherData` e `Unit` refletem o plano.
  - Valores meteorológicos aceitam `null` sem usar zero como substituto.
  - Busca inclui `idle`, `loading`, `success`, `empty` e `error`; clima inclui `idle`, `loading`, `success` e `error`.
  - Erros distinguem rede, API e timeout.
- **Dependências:** Nenhuma.
- **Arquivos prováveis:** `src/types/weather.ts`.
- **Tipo:** Infra

### T-02 — Configurar o ambiente de testes

- **Descrição:** Preparar Vitest, Testing Library, DOM e setup compartilhado para testes sem rede real.
- **Critérios de aceite:**
  - Um teste mínimo executa com `pnpm test`.
  - O ambiente fornece DOM e matchers necessários aos componentes.
  - Mocks de serviços podem ser usados por hooks e componentes.
- **Dependências:** T-01.
- **Arquivos prováveis:** `vite.config.ts`, `package.json`.
- **Tipo:** Infra

### T-03 — Criar utilitários de fixtures de teste

- **Descrição:** Centralizar cidades e payloads mínimos reutilizáveis pelos testes de serviço, hook e UI.
- **Critérios de aceite:**
  - Fixtures representam cidade selecionada, resposta de geocoding e resposta de Forecast.
  - Há fixture de resposta parcial e de erro recuperável.
  - As fixtures não fazem chamadas de rede.
- **Dependências:** T-01, T-02.
- **Arquivos prováveis:** `tests/fixtures/weather.ts`.
- **Tipo:** Test

## Entrega 2 — Funções de domínio

### T-04 — Implementar normalização e ordenação de cidades

- **Descrição:** Criar funções puras para trim, comparação sem acentos, ordenação pt-BR e limite de cinco resultados.
- **Critérios de aceite:**
  - Termos com espaços externos são normalizados.
  - Grafias acentuadas e não acentuadas são equivalentes para comparação.
  - Resultados são ordenados pelo nome e limitados a cinco após a ordenação.
  - A grafia e o contexto geográfico retornados são preservados.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/cities.ts`.
- **Tipo:** Data

### T-05 — Testar regras de cidades

- **Descrição:** Cobrir as regras de normalização, ordenação, limite e preservação dos dados geográficos.
- **Critérios de aceite:**
  - Há casos para trim, acentos, sete resultados e de um a quatro resultados.
  - A ordenação esperada é alfabética crescente.
  - O teste confirma que nenhum campo geográfico é perdido.
- **Dependências:** T-02, T-03, T-04.
- **Arquivos prováveis:** `tests/lib/cities.test.ts`.
- **Tipo:** Test

### T-06 — Implementar conversão e formatação de temperatura

- **Descrição:** Criar funções puras para conversão Celsius/Fahrenheit, arredondamento e exibição localizada.
- **Critérios de aceite:**
  - Celsius é a unidade interna.
  - A exibição usa uma casa decimal, vírgula pt-BR e símbolo correto.
  - Empates são arredondados para longe de zero, inclusive negativos.
  - `null` e valores inválidos são exibidos como `—`.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/temperature.ts`.
- **Tipo:** Data

### T-07 — Testar unitariamente conversão e formatação de temperatura

- **Descrição:** Criar testes unitários isolados para conversão, arredondamento, valores parciais e locale.
- **Critérios de aceite:**
  - Inclui 18 °C → 64,4 °F e 64 °F → 17,8 °C.
  - Inclui empate negativo, uma casa decimal e vírgula pt-BR.
  - Inclui `null`, `NaN` e unidade inicial Celsius.
  - Os testes não renderizam componentes, não usam React e não fazem chamadas de rede.
- **Dependências:** T-02, T-03, T-06.
- **Arquivos prováveis:** `tests/lib/temperature.test.ts`.
- **Tipo:** Test

### T-08 — Implementar mapeamento de códigos meteorológicos

- **Descrição:** Centralizar códigos WMO, rótulos pt-BR e identificadores de apresentação.
- **Critérios de aceite:**
  - Códigos conhecidos retornam condições em pt-BR.
  - Código desconhecido, nulo ou inválido retorna `—`.
  - A função não depende de React nem faz I/O.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/weatherCodes.ts`.
- **Tipo:** Data

### T-09 — Testar mapeamento de códigos meteorológicos

- **Descrição:** Cobrir códigos conhecidos, desconhecidos e ausentes.
- **Critérios de aceite:**
  - Os rótulos principais usados nos exemplos da spec estão cobertos.
  - O fallback `—` é verificado para entradas desconhecidas ou inválidas.
- **Dependências:** T-02, T-08.
- **Arquivos prováveis:** `tests/lib/weatherCodes.test.ts`.
- **Tipo:** Test

### T-10 — Implementar formatação de datas e horário por fuso

- **Descrição:** Criar funções puras para datas locais diárias e horário de recebimento em fuso IANA.
- **Critérios de aceite:**
  - `YYYY-MM-DD` não é interpretado como UTC.
  - Datas diárias são exibidas como `dd/MM/aaaa`.
  - `receivedAt` é formatado no fuso da cidade, sem usar `current.time`.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/dateTime.ts`.
- **Tipo:** Data

### T-11 — Testar datas locais e horários sazonais

- **Descrição:** Validar formatação diária, horário recebido e viradas de dia/fuso.
- **Critérios de aceite:**
  - Há testes determinísticos para `Europe/Lisbon` e uma virada de dia.
  - Há teste de mudança de horário sazonal.
  - A saída usa o formato pt-BR esperado.
- **Dependências:** T-02, T-03, T-10.
- **Arquivos prováveis:** `tests/lib/dateTime.test.ts`.
- **Tipo:** Test

## Entrega 3 — Integração com Open-Meteo

### T-12 — Criar cliente HTTP com timeout classificável

- **Descrição:** Implementar helper interno de `fetch` com `AbortController`, limite de dez segundos e classificação de falhas.
- **Critérios de aceite:**
  - Cada chamada possui seu próprio abort controller.
  - O timeout ocorre após 10 segundos e produz causa identificável.
  - Erros de transporte não são confundidos com timeout.
  - O helper não importa React nem mantém estado visual.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/services/weatherService.ts`.
- **Tipo:** Data

### T-13 — Testar service com `fetch` mockado

- **Descrição:** Testar o cliente HTTP e os services usando mock de `globalThis.fetch`, sem Open-Meteo real.
- **Critérios de aceite:**
  - Cada chamada verifica método, URL e parâmetros através do mock de `fetch`.
  - O timeout é testado com relógio falso em 10 segundos.
  - Erros de rede, HTTP/API e timeout têm classificações distintas.
  - Uma resposta posterior ao abort não vira sucesso.
  - O mock é restaurado ao fim de cada teste e nenhum teste depende de rede externa.
- **Dependências:** T-02, T-03, T-12.
- **Arquivos prováveis:** `tests/services/weatherService.test.ts`.
- **Tipo:** Test

### T-14 — Implementar busca de geocoding

- **Descrição:** Implementar a operação de geocoding, seus parâmetros, validação de payload e adaptação para `City`.
- **Critérios de aceite:**
  - Usa termo normalizado, `count=100`, `language=pt` e `format=json`.
  - Resposta válida sem resultados retorna lista vazia.
  - Resultados são adaptados com campos ausentes como `null`, ordenados e limitados a cinco.
  - Payload estruturalmente inválido e erro declarado pela API são erros de API.
- **Dependências:** T-04, T-12.
- **Arquivos prováveis:** `src/services/weatherService.ts`.
- **Tipo:** Data

### T-15 — Testar busca de geocoding

- **Descrição:** Verificar URL, parâmetros, adaptação, ordenação, vazio e erros da busca.
- **Critérios de aceite:**
  - O teste inspeciona a URL e todos os parâmetros obrigatórios.
  - Cobre zero, um e mais de cinco resultados.
  - Cobre campos geográficos ausentes, HTTP/API inválida e rede.
- **Dependências:** T-03, T-05, T-13, T-14.
- **Arquivos prováveis:** `tests/services/geocoding.test.ts`.
- **Tipo:** Test

### T-16 — Implementar mapeamento de Forecast

- **Descrição:** Implementar a operação Forecast e mapear clima atual e cinco dias para `WeatherData`.
- **Critérios de aceite:**
  - A URL solicita campos atuais/diários, cinco dias, timezone automático e unidades métricas.
  - Cada índice de `daily.time` mantém seus valores associados.
  - São exigidas cinco datas locais válidas e únicas.
  - Campos meteorológicos ausentes, nulos ou não finitos tornam-se `null`.
  - `receivedAt` é criado no recebimento e o `City` selecionado é preservado.
- **Dependências:** T-01, T-08, T-10, T-12.
- **Arquivos prováveis:** `src/services/weatherService.ts`.
- **Tipo:** Data

### T-17 — Testar mapeamento de Forecast

- **Descrição:** Validar parâmetros, associação dos cinco dias, campos parciais e payload inválido.
- **Critérios de aceite:**
  - O teste verifica todos os parâmetros da URL Forecast.
  - Cinco datas são mantidas na ordem local e uma janela incompleta falha.
  - Cobre números ausentes, nulos e não finitos sem substituir por zero.
  - Confirma que `receivedAt` não usa `current.time`.
- **Dependências:** T-03, T-11, T-13, T-16.
- **Arquivos prováveis:** `tests/services/forecast.test.ts`.
- **Tipo:** Test

## Entrega 4 — Orquestração de estado

### T-18 — Implementar estado e ações de busca no hook

- **Descrição:** Implementar no `useWeather` a validação, busca, retry e estados da operação de cidades.
- **Critérios de aceite:**
  - Termo vazio não chama serviço e produz “Digite uma cidade”.
  - Nova busca limpa resultados anteriores e expõe loading.
  - Sem resultados produz `empty` sem iniciar Forecast.
  - Retry reutiliza o mesmo termo e erro preserva sua causa.
- **Dependências:** T-04, T-14.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`.
- **Tipo:** Data

### T-19 — Testar estado e retry de busca no hook

- **Descrição:** Cobrir transições da operação de busca com o serviço mockado.
- **Critérios de aceite:**
  - Há testes para vazio, loading, success, empty, erro e timeout.
  - Retry chama o serviço com o mesmo termo.
  - Resultados anteriores são limpos em busca sem correspondências.
- **Dependências:** T-02, T-03, T-18.
- **Arquivos prováveis:** `tests/hooks/useWeather-search.test.ts`.
- **Tipo:** Test

### T-20 — Implementar seleção e estado de Forecast no hook

- **Descrição:** Implementar seleção explícita, loading, success, erro, timeout, retry e limpeza dos dados meteorológicos.
- **Critérios de aceite:**
  - Forecast só começa após seleção explícita.
  - Dados da cidade anterior são limpos durante nova consulta.
  - Sucesso publica cinco dias e resposta parcial como success.
  - Retry usa a mesma cidade e causa.
- **Dependências:** T-16, T-18.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`.
- **Tipo:** Data

### T-21 — Implementar descarte de operações obsoletas

- **Descrição:** Adicionar identificadores de operação para impedir que buscas ou seleções antigas publiquem resultados.
- **Critérios de aceite:**
  - Uma resposta antiga não substitui o estado da busca mais recente.
  - Uma seleção antiga não substitui o Forecast da seleção mais recente.
  - A regra continua válida após timeout e retry.
- **Dependências:** T-18, T-20.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`.
- **Tipo:** Data

### T-22 — Testar seleção, retry e concorrência no hook

- **Descrição:** Validar o ciclo meteorológico e respostas fora de ordem com serviços mockados.
- **Critérios de aceite:**
  - Há testes para loading, success, erro, timeout, retry e resposta parcial.
  - A nova seleção limpa dados antigos.
  - Respostas fora de ordem não alteram a cidade mais recente.
- **Dependências:** T-03, T-19, T-20, T-21.
- **Arquivos prováveis:** `tests/hooks/useWeather-weather.test.ts`.
- **Tipo:** Test

### T-23 — Implementar unidade de temperatura no hook

- **Descrição:** Manter unidade inicial em Celsius e expor mudança de unidade sem alterar dados ou disparar requests.
- **Critérios de aceite:**
  - A unidade inicial e após reload é Celsius.
  - A unidade permanece ao trocar de cidade na sessão.
  - A alternância altera apenas o estado/valor derivado de apresentação.
- **Dependências:** T-06, T-20.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`.
- **Tipo:** Data

### T-24 — Testar unidade e ausência de novas chamadas

- **Descrição:** Verificar conversão de todas as temperaturas e chamadas feitas durante a alternância.
- **Critérios de aceite:**
  - Temperatura atual e mínimas/máximas dos cinco dias mudam de unidade.
  - A alternância não chama geocoding nem Forecast.
  - A unidade permanece ao trocar de cidade.
- **Dependências:** T-02, T-07, T-22, T-23.
- **Arquivos prováveis:** `tests/hooks/useWeather-unit.test.ts`.
- **Tipo:** Test

## Entrega 5 — Interface e composição

### T-25 — Implementar formulário de busca

- **Descrição:** Criar o formulário manual com input, label, submit e callbacks de busca/retry.
- **Critérios de aceite:**
  - A busca ocorre somente no submit.
  - O componente recebe estados por props e não acessa API.
  - Input, label e botão têm nomes acessíveis.
- **Dependências:** T-18.
- **Arquivos prováveis:** `src/components/SearchForm.tsx`.
- **Tipo:** UI

### T-26 — Testar componente de busca nos estados de loading e erro

- **Descrição:** Validar o `SearchForm` nos estados de loading e erro, além de submit, teclado e retry.
- **Critérios de aceite:**
  - Submit envia o termo informado.
  - Input vazio mostra “Digite uma cidade” sem chamar callback de busca.
  - Loading desabilita ou sinaliza o submit e exibe “Carregando...”.
  - Erro e timeout exibem mensagem específica e ação “Tentar novamente”.
- **Dependências:** T-02, T-19, T-25.
- **Arquivos prováveis:** `tests/components/SearchForm.test.tsx`.
- **Tipo:** Test

### T-27 — Implementar lista de resultados de cidade

- **Descrição:** Renderizar resultados e emitir seleção sem acessar o serviço.
- **Critérios de aceite:**
  - Exibe até cinco resultados com nome, região e país disponíveis.
  - Cada resultado é selecionável por mouse e teclado.
  - Estado sem resultados é distinguido de erro.
- **Dependências:** T-18.
- **Arquivos prováveis:** `src/components/CityResults.tsx`.
- **Tipo:** UI

### T-28 — Testar componente de resultados no estado vazio

- **Descrição:** Validar o `CityResults` no estado vazio, além da renderização, seleção e nomes acessíveis.
- **Critérios de aceite:**
  - A ordem recebida é preservada e não há sexto item.
  - Região/país ausentes não criam conteúdo incorreto.
  - Seleção funciona por teclado e emite a cidade correta.
  - O estado `empty` exibe “Nenhuma cidade encontrada”, não exibe erro e não cria itens selecionáveis.
- **Dependências:** T-02, T-27.
- **Arquivos prováveis:** `tests/components/CityResults.test.tsx`.
- **Tipo:** Test

### T-29 — Implementar mensagens de estado e retry

- **Descrição:** Criar apresentação reutilizável para loading, erro de busca, erro de clima, timeout e vazio.
- **Critérios de aceite:**
  - Mensagens de busca e clima são distintas.
  - Timeout exibe mensagem específica para cada operação.
  - Retry possui nome acessível, funciona por teclado e usa região semântica.
- **Dependências:** T-18, T-20.
- **Arquivos prováveis:** `src/components/QueryStatus.tsx`.
- **Tipo:** UI

### T-30 — Testar componentes nos estados loading, erro e vazio

- **Descrição:** Criar a matriz de testes dos componentes de status para loading, erro, timeout e vazio.
- **Critérios de aceite:**
  - Loading exibe “Carregando...” em uma região `status` acessível.
  - Erro de busca, erro de clima e timeout exibem mensagens distintas em região `alert` ou equivalente.
  - Vazio exibe “Nenhuma cidade encontrada” sem ação de retry indevida.
  - Retry chama apenas a operação correspondente e todos os estados funcionam por teclado.
- **Dependências:** T-02, T-29.
- **Arquivos prováveis:** `tests/components/QueryStatus.test.tsx`.
- **Tipo:** Test

### T-31 — Implementar controle de unidade

- **Descrição:** Criar controle Celsius/Fahrenheit com estado visual e callback.
- **Critérios de aceite:**
  - Celsius aparece selecionado inicialmente.
  - Alternância funciona por teclado e comunica unidade atual.
  - O componente não executa consultas.
- **Dependências:** T-23.
- **Arquivos prováveis:** `src/components/UnitControl.tsx`.
- **Tipo:** UI

### T-32 — Testar controle de unidade

- **Descrição:** Validar seleção inicial, interação por teclado, foco e callback.
- **Critérios de aceite:**
  - O controle tem nomes acessíveis e foco visível.
  - Cada mudança emite a unidade selecionada.
  - Não há callback de rede embutido no componente.
- **Dependências:** T-02, T-31.
- **Arquivos prováveis:** `tests/components/UnitControl.test.tsx`.
- **Tipo:** Test

### T-33 — Implementar painel de clima atual

- **Descrição:** Renderizar localização, condições atuais, métricas, unidades e horário da consulta.
- **Critérios de aceite:**
  - Temperatura, condição, umidade, vento, pressão e precipitação aparecem com unidades.
  - Campos nulos aparecem como `—`.
  - Condição e horário usam os utilitários de domínio e o fuso da cidade.
- **Dependências:** T-06, T-08, T-10, T-20, T-31.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`.
- **Tipo:** UI

### T-34 — Testar painel de clima atual

- **Descrição:** Validar conteúdo completo, resposta parcial e acessibilidade do painel.
- **Critérios de aceite:**
  - O cenário de Lisboa exibe valores e horário esperados.
  - Campos inválidos não viram zero.
  - Headings/landmarks e leitura acessível estão presentes.
- **Dependências:** T-02, T-33.
- **Arquivos prováveis:** `tests/components/CurrentWeather.test.tsx`.
- **Tipo:** Test

### T-35 — Implementar lista de previsão de cinco dias

- **Descrição:** Renderizar datas, mínimas, máximas, condição e precipitação de cada dia.
- **Critérios de aceite:**
  - Exatamente cinco entradas aparecem na ordem local.
  - Temperaturas respeitam unidade e formatação pt-BR.
  - Campos parciais exibem `—` sem ocultar os demais.
- **Dependências:** T-06, T-08, T-10, T-20, T-31.
- **Arquivos prováveis:** `src/components/ForecastList.tsx`.
- **Tipo:** UI

### T-36 — Testar lista de previsão

- **Descrição:** Validar janela, associação de valores, unidade e acessibilidade dos cinco dias.
- **Critérios de aceite:**
  - As cinco datas esperadas são exibidas sem duplicação ou omissão.
  - Cada entrada mostra condição e precipitação correspondentes.
  - Uma temperatura ausente aparece como `—` sem remover o dia.
- **Dependências:** T-02, T-35.
- **Arquivos prováveis:** `tests/components/ForecastList.test.tsx`.
- **Tipo:** Test

### T-37 — Compor App com hook e componentes

- **Descrição:** Ligar `App.tsx` ao `useWeather`, formulário, resultados, estados, unidade e painéis.
- **Critérios de aceite:**
  - A UI não importa nem chama o serviço diretamente.
  - Busca, seleção, Forecast e unidade são conectados pelos callbacks corretos.
  - Estados independentes são renderizados sem esconder o formulário.
- **Dependências:** T-25, T-27, T-29, T-31, T-33, T-35.
- **Arquivos prováveis:** `src/App.tsx`.
- **Tipo:** UI

### T-38 — Testar composição da aplicação

- **Descrição:** Validar o fluxo integrado da composição com serviços mockados.
- **Critérios de aceite:**
  - Buscar, selecionar e visualizar dados funciona em sequência.
  - Retry de busca e Forecast chama a operação correta.
  - Loading, erro, vazio e success permanecem acessíveis.
- **Dependências:** T-19, T-22, T-26, T-28, T-30, T-32, T-34, T-36, T-37.
- **Arquivos prováveis:** `tests/App.test.tsx`.
- **Tipo:** Test

## Entrega 6 — Testes E2E e qualidade da interface

### T-39 — Configurar fixtures e interceptação E2E

- **Descrição:** Preparar Playwright e rotas determinísticas para geocoding e Forecast.
- **Critérios de aceite:**
  - As rotas Open-Meteo são interceptadas com `page.route`.
  - Existem respostas reutilizáveis de sucesso, vazio e erro.
  - Os testes não dependem de rede externa.
- **Dependências:** T-37.
- **Arquivos prováveis:** `tests/e2e/fixtures.ts`, `playwright.config.ts`.
- **Tipo:** Test

### T-40 — Testar fluxo E2E principal em desktop e mobile

- **Descrição:** Cobrir o fluxo principal em navegador desktop e viewport mobile, usando as rotas interceptadas.
- **Critérios de aceite:**
  - O fluxo buscar → selecionar → visualizar clima/previsão → alternar unidade passa em viewport desktop e em viewport mobile de 320 px.
  - O fluxo principal valida textos observáveis e cinco entradas diárias em ambos os viewports.
  - A troca de unidade altera as temperaturas sem nova rota Forecast.
  - A cidade selecionada aparece associada aos dados exibidos.
  - O viewport mobile não apresenta rolagem horizontal e mantém busca, seleção e controle de unidade operáveis.
- **Dependências:** T-38, T-39.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`.
- **Tipo:** Test

### T-41 — Testar cenários E2E de vazio, erro e concorrência

- **Descrição:** Cobrir cidade homônima, nenhum resultado, retry e respostas fora de ordem.
- **Critérios de aceite:**
  - Cidade homônima permite distinguir região/país antes da seleção.
  - Nenhum resultado não inicia Forecast.
  - Erro e timeout oferecem retry funcional.
  - A seleção mais recente vence quando respostas chegam fora de ordem.
- **Dependências:** T-39, T-40.
- **Arquivos prováveis:** `tests/e2e/weather-errors.spec.ts`.
- **Tipo:** Test

### T-42 — Validar responsividade e acessibilidade E2E

- **Descrição:** Testar viewports, orientação móvel, rolagem e navegação por teclado.
- **Critérios de aceite:**
  - Fluxos principais passam em 320, 768 e 1280 px, incluindo retrato e paisagem móvel.
  - Não há rolagem horizontal e controles permanecem operáveis.
  - Verificação automatizada não encontra violações críticas.
  - A revisão manual de teclado e leitor de tela fica registrada.
- **Dependências:** T-40, T-41.
- **Arquivos prováveis:** `tests/e2e/responsive.spec.ts`.
- **Tipo:** Test

## Entrega 7 — Hardening e entrega

### T-43 — Adicionar regressões de timeout e respostas tardias

- **Descrição:** Consolidar testes de regressão para timeout, abort e descarte de respostas no limite.
- **Critérios de aceite:**
  - Busca e Forecast encerram loading após dez segundos.
  - Resposta tardia não preenche nem substitui a UI.
  - Retry continua possível após timeout.
- **Dependências:** T-13, T-19, T-22, T-41.
- **Arquivos prováveis:** `tests/services/weatherService-timeout.test.ts`, `tests/hooks/useWeather-stale.test.ts`.
- **Tipo:** Test

### T-44 — Revisar mensagens e limpeza de dados antigos

- **Descrição:** Corrigir inconsistências finais entre hook e componentes em erros, seleção e loading.
- **Critérios de aceite:**
  - Rede, API e timeout usam mensagens recuperáveis adequadas ao fluxo.
  - Nova seleção não mostra clima antigo como atual.
  - Busca vazia/sem resultados nunca inicia Forecast.
  - Loading aparece imediatamente após cada ação principal.
- **Dependências:** T-38, T-41, T-43.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`, `src/components/QueryStatus.tsx`.
- **Tipo:** Data

### T-45 — Executar gates e registrar pendências de release

- **Descrição:** Executar lint, build e testes e documentar riscos ainda dependentes de decisões de produto ou provedor.
- **Critérios de aceite:**
  - `pnpm lint`, `pnpm build` e `pnpm test` passam sem erro.
  - A matriz de navegadores e limitações de cobertura ficam registradas.
  - Permanecem explícitas as pendências sobre precipitação, códigos, cobertura, frescor e metas de produção.
  - Testes automatizados não exigem chave de API nem rede externa.
- **Dependências:** T-42, T-44.
- **Arquivos prováveis:** `README.md`.
- **Tipo:** Infra

## Rastreabilidade

Os códigos abaixo referenciam requisitos funcionais (RF), requisitos não
funcionais (RNF) e critérios de aceitação (AC) da spec. Quando uma tarefa é de
infraestrutura ou de teste transversal, a relação indica o requisito que ela
viabiliza ou verifica.

| Tarefa | Requisitos relacionados |
| --- | --- |
| T-01 | RF1–RF6; contratos de dados e estados descritos na spec |
| T-02 | Apoio transversal aos RF1–RF6 e à estratégia de testes |
| T-03 | Apoio transversal aos testes de RF1–RF6 |
| T-04 | RF1; AC1.4, AC1.5, AC1.7 e AC1.8 |
| T-05 | RF1; AC1.1, AC1.5, AC1.7 |
| T-06 | RF2, RF3 e RF4; AC2.1, AC3.1, AC4.1 |
| T-07 | RF4; AC4.1, AC4.2 e AC4.3 |
| T-08 | RF2 e RF3; AC2.1, AC3.1 e AC3.2 |
| T-09 | RF2 e RF3; AC2.1, AC3.1 e AC3.2 |
| T-10 | RF2 e RF3; AC2.1 e AC3.1 |
| T-11 | RF2 e RF3; AC2.1, AC3.1 e AC3.3 |
| T-12 | RF6; AC1.10 e AC6.1 |
| T-13 | RF6; AC1.6, AC1.10, AC6.1 e AC6.2 |
| T-14 | RF1; AC1.1, AC1.3, AC1.5 e AC1.7 |
| T-15 | RF1; AC1.1, AC1.3, AC1.5, AC1.6 e AC1.7 |
| T-16 | RF2 e RF3; AC2.1, AC2.2, AC3.1 e AC3.2 |
| T-17 | RF2 e RF3; AC2.1, AC2.2, AC3.1 e AC3.2 |
| T-18 | RF1 e RF6; AC1.3, AC1.4, AC1.6, AC1.9 e AC1.10 |
| T-19 | RF1 e RF6; AC1.3, AC1.4, AC1.6, AC1.9 e AC1.10 |
| T-20 | RF2, RF3, RF5 e RF6; AC2.1, AC2.2, AC3.1, AC3.2, AC5.1, AC6.2, AC6.3 e AC6.4 |
| T-21 | RF5 e RF6; AC5.1, AC5.2 e AC6.2 |
| T-22 | RF2, RF3, RF5 e RF6; AC2.2, AC3.2, AC5.1, AC5.2, AC6.2, AC6.3 e AC6.4 |
| T-23 | RF4; AC4.1, AC4.2, AC4.3 e AC4.4 |
| T-24 | RF4; AC4.1, AC4.2, AC4.3 e AC4.4 |
| T-25 | RF1 e RF6; AC1.4, AC1.6, AC1.9 e AC1.10 |
| T-26 | RF1 e RF6; AC1.4, AC1.6, AC1.9 e AC1.10 |
| T-27 | RF1; AC1.1, AC1.2, AC1.3 e AC1.7 |
| T-28 | RF1; AC1.1, AC1.2, AC1.3 e AC1.7 |
| T-29 | RF1 e RF6; AC1.3, AC1.6, AC1.9, AC1.10, AC6.1, AC6.2, AC6.3 e AC6.4 |
| T-30 | RF1 e RF6; AC1.3, AC1.6, AC1.9, AC1.10, AC6.1, AC6.2, AC6.3 e AC6.4 |
| T-31 | RF4; AC4.1, AC4.2 e AC4.4 |
| T-32 | RF4; AC4.1, AC4.2 e requisitos de acessibilidade |
| T-33 | RF2; AC2.1 e AC2.2 |
| T-34 | RF2; AC2.1 e AC2.2 |
| T-35 | RF3 e RF4; AC3.1, AC3.2, AC4.1 e AC4.2 |
| T-36 | RF3 e RF4; AC3.1, AC3.2, AC4.1 e AC4.2 |
| T-37 | RF1–RF6; AC1.1–AC6.4 |
| T-38 | RF1–RF6; AC1.1–AC6.4 |
| T-39 | Estratégia E2E para RF1–RF6; isolamento de rede externa |
| T-40 | RF1–RF4; AC1.1, AC1.2, AC2.1, AC3.1 e AC4.1; RNF1 e RNF2 |
| T-41 | RF1, RF5 e RF6; AC1.3, AC1.6, AC1.9, AC1.10, AC5.1, AC6.2, AC6.3 e AC6.4 |
| T-42 | Requisitos de responsividade, acessibilidade e compatibilidade; RNF1, RNF2 e RNF6 |
| T-43 | RF6; AC1.10, AC6.1, AC6.2, AC6.3 e AC6.4 |
| T-44 | RF1, RF5 e RF6; AC1.3, AC1.6, AC1.10, AC5.1, AC6.1, AC6.2, AC6.3 e AC6.4 |
| T-45 | RNF1–RNF7 e decisões pendentes registradas na spec |

## Requisitos funcionais por tarefa

Esta tabela parte dos RF1–RF6 definidos na spec e lista as tarefas que os
implementam ou verificam. Tarefas de implementação aparecem junto das tarefas
de teste para tornar a cobertura executável.

| Requisito funcional | Tarefas relacionadas |
| --- | --- |
| **RF1 — Buscar e selecionar cidade** | T-04, T-05, T-14, T-15, T-18, T-19, T-25, T-26, T-27, T-28, T-29, T-30, T-37, T-38, T-40, T-41 e T-44 |
| **RF2 — Consultar clima atual** | T-06, T-08, T-09, T-10, T-11, T-16, T-17, T-20, T-22, T-33, T-34, T-37, T-38 e T-40 |
| **RF3 — Consultar previsão de cinco dias** | T-06, T-08, T-09, T-10, T-11, T-16, T-17, T-20, T-22, T-35, T-36, T-37, T-38 e T-40 |
| **RF4 — Alternar unidade de temperatura** | T-06, T-07, T-23, T-24, T-31, T-32, T-35, T-36, T-37, T-38 e T-40 |
| **RF5 — Atualizar consulta ao trocar de cidade** | T-20, T-21, T-22, T-23, T-24, T-37, T-38, T-41 e T-44 |
| **RF6 — Comunicar estados da consulta** | T-12, T-13, T-18, T-19, T-20, T-22, T-25, T-26, T-29, T-30, T-37, T-38, T-41, T-43 e T-44 |

### Requisitos sem tarefa correspondente

Nenhum requisito funcional está sem tarefa correspondente. RF1–RF6 possuem
implementação, critérios de aceite e pelo menos uma tarefa de teste ou
integração associada. As decisões pendentes da spec sobre precipitação,
cobertura geográfica, frescor dos dados e metas de produção permanecem
registradas em T-45, mas não bloqueiam a cobertura funcional do backlog.

## Prioridade e tamanho

**Prioridade:** P0 é necessário para o primeiro caminho utilizável; P1 é
importante para robustez, acessibilidade e release; P2 pode ser concluído após
o MVP sem bloquear o uso principal. **Tamanho:** M representa uma unidade
moderada, normalmente limitada a um arquivo; G representa trabalho
transversal, integração ou uma suíte com mais cenários.

| Tarefa | Prioridade | Tamanho |
| --- | --- | --- |
| T-01 | P0 | M |
| T-02 | P1 | M |
| T-03 | P1 | M |
| T-04 | P0 | M |
| T-05 | P1 | M |
| T-06 | P0 | M |
| T-07 | P0 | M |
| T-08 | P0 | M |
| T-09 | P1 | M |
| T-10 | P0 | M |
| T-11 | P1 | M |
| T-12 | P0 | G |
| T-13 | P0 | M |
| T-14 | P0 | M |
| T-15 | P1 | M |
| T-16 | P0 | G |
| T-17 | P1 | M |
| T-18 | P0 | G |
| T-19 | P0 | M |
| T-20 | P0 | G |
| T-21 | P0 | M |
| T-22 | P0 | M |
| T-23 | P0 | M |
| T-24 | P0 | M |
| T-25 | P0 | M |
| T-26 | P0 | M |
| T-27 | P0 | M |
| T-28 | P0 | M |
| T-29 | P0 | M |
| T-30 | P0 | M |
| T-31 | P0 | M |
| T-32 | P1 | M |
| T-33 | P0 | M |
| T-34 | P1 | M |
| T-35 | P0 | M |
| T-36 | P1 | M |
| T-37 | P0 | G |
| T-38 | P0 | G |
| T-39 | P0 | M |
| T-40 | P0 | G |
| T-41 | P1 | G |
| T-42 | P2 | G |
| T-43 | P1 | M |
| T-44 | P1 | M |
| T-45 | P1 | M |

## Sequência de fatias verticais

As fatias abaixo priorizam uma demonstração observável ao fim de cada etapa.
T-37 deve ser executada incrementalmente em cada fatia, mesmo sendo uma única
tarefa de composição; assim, a primeira integração pode exibir a busca antes
de todos os painéis meteorológicos estarem completos.

1. **Fatia 1 — Buscar uma cidade:** T-01, T-04, T-12, T-14, T-18, T-25,
  T-27, T-29 e T-37. Entrega input, resultados ordenados, estados básicos e
  seleção explícita visíveis.
2. **Fatia 2 — Exibir clima atual:** T-06, T-08, T-10, T-16, T-20, T-21,
  T-33 e a segunda etapa de T-37. Entrega cidade selecionada, métricas atuais,
  condição e horário da consulta.
3. **Fatia 3 — Exibir previsão e unidade:** T-23, T-31, T-35 e a terceira
  etapa de T-37. Entrega cinco dias, conversão Celsius/Fahrenheit e atualização
  sem nova consulta.
4. **Fatia 4 — Tornar o caminho confiável:** T-02, T-03, T-07, T-13, T-19,
  T-22, T-24, T-26, T-28, T-30 e T-38. Entrega testes unitários, service com
  `fetch` mockado, estados de loading/erro/vazio e integração local protegida.
5. **Fatia 5 — Validar no navegador:** T-05, T-09, T-11, T-15, T-17, T-32,
  T-34, T-36, T-39, T-40 e T-41. Entrega cobertura de regras de domínio,
  componentes, fluxo E2E principal, retry, vazio e concorrência.
6. **Fatia 6 — Preparar release:** T-42, T-43, T-44 e T-45. Entrega matriz
  responsiva/de navegadores, regressões de timeout, revisão de mensagens e
  gates finais documentados.

Essa sequência permite apresentar uma busca funcional primeiro, sem esperar a
previsão completa, e mantém cada fatia exercitável antes de ampliar o escopo.