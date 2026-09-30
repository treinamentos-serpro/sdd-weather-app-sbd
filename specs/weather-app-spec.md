# Especificação de Produto — Aplicação de Previsão do Tempo

## Overview

Aplicação web de consulta meteorológica para quem precisa entender as condições
atuais de uma cidade ou planejar os próximos dias. A pessoa usuária busca e
seleciona uma cidade, consulta o clima atual e a previsão de hoje mais os quatro
dias seguintes e alterna a unidade de temperatura entre Celsius e Fahrenheit.

- **Público:** pessoas que decidem como sair de casa, planejam a semana ou se
  preparam para viajar.
- **Idioma inicial:** pt-BR.
- **Fonte de dados decidida:** Open-Meteo, para geocodificação e dados
  meteorológicos, sem exigir chave de API.
- **Acesso:** sem autenticação e sem persistência de dados no servidor.
- **Unidade inicial:** Celsius.
- **Objetivo:** permitir identificar a cidade correta e compreender suas
  condições atuais e a previsão de curto prazo, inclusive em dispositivos
  móveis.

Os campos meteorológicos e a janela de previsão estão definidos nesta versão.
As perguntas em aberto registram políticas ainda pendentes, como frescor dos
dados, cobertura geográfica e aprovação das metas candidatas de qualidade.

## Functional Requirements

- **RF1 — Buscar e selecionar cidade:** permitir informar o nome de uma cidade,
  consultar correspondências e selecionar a localização desejada. Quando houver
  informação disponível, os resultados devem incluir estado/região e país para
  distinguir cidades homônimas. A busca é iniciada explicitamente pela pessoa
  usuária. Remover espaços no início e no fim do termo antes da consulta e
  comparar nomes sem distinguir letras acentuadas de suas versões sem acento,
  sem tolerância a erros de digitação. Exibir no máximo cinco resultados, em
  ordem alfabética crescente pelo nome da cidade; manter a grafia retornada para
  exibição. A versão inicial usa busca manual; sugestões durante a digitação
  não fazem parte do escopo.
- **RF2 — Consultar clima atual:** após a seleção, apresentar condições atuais
  referentes à cidade escolhida: temperatura, condição meteorológica, umidade,
  velocidade do vento em km/h, pressão em hPa e precipitação em mm. Umidade é
  expressa em porcentagem. Exibir cada temperatura na unidade selecionada e
  mostrar a data e hora em que a resposta foi recebida, no fuso da cidade,
  identificada como horário da consulta. A consulta ocorre ao selecionar uma
  cidade ou ao repetir uma consulta; atualização automática periódica não faz
  parte desta versão.
- **RF3 — Consultar previsão de cinco dias:** apresentar a previsão diária de
  hoje e dos quatro dias seguintes para a cidade selecionada, usando o fuso
  horário local da cidade para determinar o dia. Cada dia inclui temperatura
  mínima, temperatura máxima, condição meteorológica e precipitação. Datas são
  apresentadas em formato dd/MM/aaaa.
- **RF4 — Alternar unidade de temperatura:** permitir alternar entre Celsius e
  Fahrenheit e aplicar a escolha a todas as temperaturas do clima atual e da
  previsão, sem nova consulta meteorológica. Celsius é a unidade inicial; a
  escolha permanece durante a sessão atual, inclusive ao trocar de cidade, e é
  reiniciada para Celsius após recarregar ou abrir uma nova sessão. Exibir
  temperaturas com uma casa decimal, arredondando empates para longe de zero;
  usar vírgula como separador decimal na interface pt-BR.
- **RF5 — Atualizar consulta ao trocar de cidade:** ao selecionar outra cidade,
  substituir os dados atuais e a previsão pelos dados correspondentes à nova
  localização, sem manter informação da cidade anterior como se fosse atual.
  Se houver consultas concorrentes, somente a resposta da seleção mais recente
  pode atualizar os dados exibidos.
- **RF6 — Comunicar estados da consulta:** informar quando a busca ou a consulta
  meteorológica estiver carregando, quando não houver correspondências e quando
  ocorrer uma falha. Em falhas recuperáveis, oferecer uma ação para tentar
  novamente. Falhas de geocodificação devem ser diferenciadas de uma busca sem
  resultados. Cada chamada de geocodificação ou meteorológica sem resposta após
  10 segundos deve ser tratada como timeout, encerrar seu estado de carregamento
  e oferecer nova tentativa. Respostas que cheguem após o timeout não devem
  alterar a interface.

## Personas

### Marina — Planejadora da semana

- **Objetivo:** comparar a previsão dos próximos dias para organizar
  compromissos, deslocamentos e atividades.
- **Contexto:** planeja no desktop e consulta novamente no celular.
- **Sucesso:** identifica rapidamente os dias mais adequados para seus planos.

### Rafael — Pessoa decidindo como sair de casa

- **Objetivo:** conhecer as condições atuais para escolher roupa ou levar
  proteção contra chuva.
- **Contexto:** consulta rápida, principalmente pelo celular, antes de sair.
- **Sucesso:** encontra a cidade e entende a temperatura e a condição atual em
  uma consulta.

### Camila — Viajante em preparação

- **Objetivo:** consultar a previsão da cidade de destino para preparar a
  viagem.
- **Contexto:** planeja no desktop ou celular e consulta durante a viagem pelo
  celular.
- **Sucesso:** seleciona o destino correto e obtém uma previsão clara para cinco
  dias.

## User Stories

- **US1:** Como Marina, planejadora da semana, quero consultar a previsão diária
  de hoje e dos quatro dias seguintes para organizar meus compromissos e
  deslocamentos.
  **Requisitos:** RF3.
- **US2:** Como Rafael, que decide como sair de casa, quero buscar e selecionar
  minha cidade para entender as condições meteorológicas atuais antes de sair.
  **Requisitos:** RF1, RF2.
- **US3:** Como Camila, viajante em preparação, quero distinguir cidades com
  nomes iguais e selecionar meu destino para consultar a previsão da localização
  correta.
  **Requisitos:** RF1, RF3, RF5.
- **US4:** Como Rafael, que decide como sair de casa, quero alternar entre
  Celsius e Fahrenheit para interpretar a temperatura na unidade que conheço.
  **Requisitos:** RF4.
- **US5:** Como Marina, planejadora da semana, quero receber uma mensagem clara
  e poder tentar novamente quando uma consulta falhar para continuar meu
  planejamento.
  **Requisitos:** RF1, RF6.

## Acceptance Criteria

Os critérios abaixo usam Given/When/Then (Dado/Quando/Então) e descrevem
resultados observáveis. Os exemplos de data e hora usam relógio fixo de teste e
fuso local da cidade selecionada.

### RF1 — Buscar e selecionar cidade

**AC1.1 — Exibir resultados da busca**

- **Given** a resposta da busca contém, nesta ordem, as cidades Zeta, Echo,
  Charlie, Alpha, Foxtrot, Bravo e Delta
- **When** a pessoa usuária envia uma busca que retorna esses resultados
- **Then** a aplicação exibe exatamente cinco resultados selecionáveis
- **And** os nomes exibidos, nesta ordem, são Alpha, Bravo, Charlie, Delta e
  Echo
- **And** cada resultado exibe o nome da cidade e os dados de região/estado e
  país disponíveis na resposta

**AC1.2 — Selecionar uma cidade**

- **Given** a lista de resultados contém "Springfield, Illinois, Estados Unidos"
- **When** a pessoa usuária seleciona esse resultado
- **Then** essa localização fica definida como a cidade consultada

**AC1.3 — Busca sem resultados**

- **Given** a geocodificação retorna zero resultados para "Cidade inexistente"
- **When** a pessoa usuária envia a busca por "Cidade inexistente"
- **Then** a aplicação exibe "Nenhuma cidade encontrada"
- **And** não exibe uma mensagem de erro
- **And** o campo de busca continua disponível para uma nova consulta
- **And** nenhuma consulta meteorológica é iniciada
- **And** resultados de uma busca anterior não são apresentados como resultados
  da busca atual

**AC1.4 — Input vazio ou composto por espaços**

- **Given** o campo de busca está vazio ou contém somente espaços
- **When** a pessoa usuária envia a busca
- **Then** a aplicação exibe "Digite uma cidade"
- **And** nenhuma chamada de geocodificação é iniciada

**AC1.5 — Termo com acentos e caracteres especiais**

- **Given** o campo contém "  São Paulo  " ou "  Sao Paulo  "
- **When** a pessoa usuária envia a busca
- **Then** a aplicação remove espaços externos e retorna o mesmo conjunto de
  cidades para as duas grafias
- **And** exibe os nomes das cidades com a grafia retornada pela geocodificação
- **And** não exibe uma mensagem de erro quando a consulta termina sem
  correspondências

**AC1.6 — Falha da geocodificação**

- **Given** a chamada de geocodificação termina com erro de rede ou erro da
  fonte, sem atingir o limite de timeout
- **When** a aplicação recebe a falha
- **Then** exibe "Não foi possível buscar cidades. Tente novamente."
- **And** oferece a ação "Tentar novamente"
- **And** não inicia consulta meteorológica

**AC1.7 — Menos de cinco resultados**

- **Given** a geocodificação retorna entre uma e quatro cidades
- **When** a pessoa usuária conclui a busca
- **Then** a aplicação exibe todas as cidades retornadas, em ordem alfabética
  crescente pelo nome
- **And** não exibe espaços reservados para resultados inexistentes

**AC1.8 — Termo com erro de digitação**

- **Given** a busca por "Lisboaa" retorna zero correspondências
- **When** a pessoa usuária envia a busca
- **Then** a aplicação exibe "Nenhuma cidade encontrada"
- **And** não sugere automaticamente "Lisboa"
- **And** não exibe uma mensagem de erro

**AC1.9 — Repetir uma busca com falha**

- **Given** a mensagem de falha da geocodificação e a ação "Tentar novamente"
  estão visíveis
- **When** a pessoa usuária aciona "Tentar novamente"
- **Then** a aplicação repete a chamada de geocodificação com o mesmo termo
- **And** exibe "Carregando..." enquanto aguarda
- **And** se a repetição falhar, encerra o carregamento e mantém a mensagem de
  falha e a ação disponíveis

**AC1.10 — Timeout da geocodificação**

- **Given** uma chamada de geocodificação permanece sem resposta por 10 segundos
- **When** o limite de timeout é atingido
- **Then** a aplicação encerra o carregamento
- **And** exibe "A busca expirou. Tente novamente."
- **And** oferece a ação "Tentar novamente"
- **And** uma resposta que chega depois do timeout não preenche nem substitui a
  lista de resultados

### RF2 — Consultar clima atual

**AC2.1 — Exibir os dados de clima atual disponíveis**

- **Given** "Lisboa, Portugal" está selecionada e a consulta retorna temperatura
  de 18 °C, condição "Céu limpo", umidade de 60%, vento de 10 km/h, pressão de
  1013 hPa, precipitação de 0 mm e horário da consulta 30/09/2026 às 14:30 no
  fuso Europe/Lisbon
- **When** os dados de clima atual são carregados
- **Then** a aplicação identifica a localização como "Lisboa, Portugal"
- **And** exibe temperatura como "18,0 °C", umidade como "60%", velocidade do
  vento como "10 km/h", pressão como "1013 hPa" e precipitação como "0 mm"
- **And** exibe a condição como "Céu limpo"
- **And** exibe "Consulta realizada em 30/09/2026 às 14:30" no fuso Europe/Lisbon

**AC2.2 — Resposta com campo ausente ou inválido**

- **Given** a resposta de clima atual contém um campo ausente, nulo ou não
  numérico para um valor meteorológico
- **When** os dados são carregados
- **Then** a aplicação indica "—" para esse campo
- **And** exibe os outros campos retornados
- **And** não substitui o campo ausente por zero

### RF3 — Consultar previsão de cinco dias

**AC3.1 — Exibir a janela de cinco dias**

- **Given** o relógio de teste indica 30/09/2026 em Europe/Lisbon e "Lisboa,
  Portugal" está selecionada
- **When** a previsão é carregada
- **Then** a aplicação exibe exatamente cinco entradas diárias, para
  30/09/2026, 01/10/2026, 02/10/2026, 03/10/2026 e 04/10/2026
- **And** cada entrada exibe data, temperatura mínima, temperatura máxima,
  condição e precipitação retornadas para aquele dia
- **And** cada temperatura exibe a unidade em uso e a precipitação exibe "mm"
- **And** as datas e valores são associados pelo mesmo dia local, sem duplicar,
  omitir ou reordenar as cinco datas

**AC3.2 — Resposta parcial da previsão**

- **Given** a resposta de um dia não contém temperatura mínima
- **When** a previsão é exibida
- **Then** a temperatura mínima desse dia é indicada por "—"
- **And** a temperatura máxima, condição e precipitação disponíveis continuam
  sendo exibidas
- **And** a temperatura ausente não é substituída por zero

**AC3.3 — Previsão associada à cidade selecionada**

- **Given** a resposta de previsão está associada a "Lisboa, Portugal"
- **When** a previsão é exibida
- **Then** a localização identificada na consulta é "Lisboa, Portugal"
- **And** as cinco entradas exibidas correspondem à resposta dessa localização

### RF4 — Alternar unidade de temperatura

**AC4.1 — Alternar de Celsius para Fahrenheit**

- **Given** o clima atual e a previsão são exibidos em Celsius e incluem o valor
  de 18,0 °C
- **When** a pessoa usuária seleciona Fahrenheit
- **Then** todos os valores de temperatura atuais e previstos são exibidos em
  Fahrenheit
- **And** cada temperatura de 18,0 °C passa a ser exibida como 64,4 °F
- **And** os valores convertidos usam uma casa decimal e vírgula como separador
  decimal
- **And** nenhuma nova consulta de clima ou previsão é iniciada

**AC4.2 — Alternar de Fahrenheit para Celsius**

- **Given** o clima atual e a previsão são exibidos em Fahrenheit e incluem o
  valor de 64,0 °F
- **When** a pessoa usuária seleciona Celsius
- **Then** todos os valores de temperatura atuais e previstos são exibidos em
  Celsius
- **And** cada temperatura de 64,0 °F passa a ser exibida como 17,8 °C
- **And** os valores convertidos usam uma casa decimal e vírgula como separador
  decimal
- **And** nenhuma nova consulta de clima ou previsão é iniciada

**AC4.3 — Arredondar empate para longe de zero**

- **Given** a resposta contém 31,91 °F e a interface está na unidade Fahrenheit
- **When** a pessoa usuária seleciona Celsius
- **Then** a temperatura é exibida como -0,1 °C após conversão e arredondamento

**AC4.4 — Unidade padrão**

- **Given** não há uma unidade previamente selecionada disponível
- **When** uma consulta meteorológica é exibida
- **Then** todas as temperaturas são exibidas em Celsius

### RF5 — Atualizar consulta ao trocar de cidade

**AC5.1 — Carregar dados da nova cidade**

- **Given** "Lisboa, Portugal" está selecionada e seus dados estão exibidos
- **When** a pessoa usuária seleciona "Porto, Portugal" e a consulta termina
- **Then** a localização exibida é "Porto, Portugal"
- **And** o clima atual e a previsão exibidos correspondem à resposta de Porto
- **And** a unidade selecionada antes da troca de cidade permanece aplicada

**AC5.2 — Consulta da nova cidade ainda pendente**

- **Given** os dados de "Lisboa, Portugal" estão exibidos
- **When** a pessoa usuária seleciona "Porto, Portugal" e a consulta ainda não
  terminou
- **Then** a aplicação indica que a consulta de Porto está carregando
- **And** não identifica os dados de Lisboa como dados de Porto

**AC5.3 — Respostas de consultas concorrentes chegam fora de ordem**

- **Given** a pessoa usuária selecionou Lisboa e depois Porto antes de qualquer
  consulta terminar
- **When** a resposta de Porto chega primeiro e a resposta de Lisboa chega por
  último
- **Then** a localização e os dados exibidos continuam sendo os de Porto

### RF6 — Comunicar estados da consulta

**AC6.1 — Busca em andamento**

- **Given** uma busca foi enviada e ainda não retornou
- **When** a aplicação aguarda os resultados
- **Then** a aplicação exibe "Carregando..."

**AC6.2 — Falha na consulta meteorológica**

- **Given** uma consulta de clima atual ou previsão termina com falha de rede ou
  da fonte de dados
- **When** a aplicação recebe a falha
- **Then** exibe "Não foi possível carregar os dados. Tente novamente."
- **And** exibe uma ação "Tentar novamente"

**AC6.3 — Timeout de consulta meteorológica**

- **Given** uma consulta meteorológica permanece sem resposta por 10 segundos
- **When** o limite de timeout é atingido
- **Then** a aplicação encerra o estado de carregamento
- **And** exibe "A consulta expirou. Tente novamente."
- **And** oferece a ação "Tentar novamente"
- **And** uma resposta que chega depois do timeout não substitui o estado de erro

**AC6.4 — Repetir uma consulta com falha**

- **Given** a mensagem de falha e a ação "Tentar novamente" estão visíveis
- **When** a pessoa usuária aciona "Tentar novamente"
- **Then** a aplicação inicia novamente a consulta que falhou
- **And** exibe "Carregando..." enquanto aguarda a resposta
- **And** ao receber uma resposta bem-sucedida, exibe os dados consultados e
  remove a mensagem de falha
- **And** se a nova tentativa também falhar, remove o carregamento, mantém a
  mensagem de erro e mantém disponível a ação "Tentar novamente"

## Non-Functional Requirements

- **RNF1 — Responsividade:** nos viewports de 320 px, 768 px e 1280 px, em
  busca, resultados, dados e controle de unidade devem permanecer legíveis e
  operáveis sem rolagem horizontal da página. Em viewports móveis, validar
  retrato e paisagem.
- **RNF2 — Acessibilidade:** cumprir WCAG 2.2 nível AA. Todos os controles devem
  ter nome acessível, ser operáveis por teclado, apresentar foco visível e
  comunicar estados sem depender somente de cor. O release exige verificação
  automatizada sem violações críticas e revisão manual de todos os fluxos por
  teclado e leitor de tela.
- **RNF3 — Desempenho:** após uma ação de busca ou seleção, apresentar loading
  em até 1 segundo; em teste automatizado com resposta simulada das APIs em até
  500 ms, apresentar os dados ou erro em até 3 segundos desde a ação. Registrar
  os tempos em cada execução de teste; a meta de produção e o perfil de rede
  continuam pendentes de aprovação.
- **RNF4 — Clareza e atualidade dos dados:** todas as temperaturas exibem unidade;
  condição atual e previsão são identificadas separadamente; datas usam
  dd/MM/aaaa e o fuso local da cidade; o horário em que a resposta foi recebida
  é exibido com o fuso da cidade e identificado como horário da consulta, não
  como horário de observação meteorológica.
- **RNF5 — Resiliência:** falhas da rede ou da fonte meteorológica devem ser
  comunicadas sem travar a interface e devem permitir nova tentativa. A versão
  inicial não oferece consulta offline nem dados em cache como fallback.
- **RNF6 — Compatibilidade:** validar a versão atual e a anterior dos seguintes
  navegadores estáveis: Chrome, Edge e Firefox em desktop; Safari em macOS e
  iOS; Chrome em Android. A matriz é a proposta v1 e deve ser aprovada antes do
  release.
- **RNF7 — Localização:** textos da interface devem estar em pt-BR; datas usam
  dd/MM/aaaa, separador decimal vírgula e temperaturas em °C ou °F conforme a
  unidade selecionada.

## Edge Cases

| Situação | Comportamento esperado |
| --- | --- |
| Busca vazia ou só com espaços | Exibir "Digite uma cidade"; não chamar geocodificação. |
| Nenhuma cidade correspondente | Exibir "Nenhuma cidade encontrada"; não selecionar cidade nem chamar APIs meteorológicas; limpar resultados anteriores. |
| Acentos, pontuação ou espaços externos | Comparar nomes sem distinção de acentos, remover espaços externos e exibir a grafia retornada; consulta sem correspondências mostra estado vazio, não erro. |
| Erro de digitação | Não aplicar correspondência aproximada nem sugerir automaticamente outra cidade; exibir estado vazio quando não houver correspondência exata após normalização de acentos. |
| Mais de cinco correspondências | Exibir somente os cinco primeiros após ordenação alfabética crescente pelo nome da cidade. |
| Cidades homônimas | Exibir contexto geográfico disponível e exigir seleção explícita; não iniciar previsão antes da seleção. |
| Falha ou timeout de geocodificação | Encerrar loading, comunicar a falha específica e permitir repetir a busca com o mesmo termo. |
| Falha ou timeout meteorológico | Encerrar loading da chamada afetada, comunicar falha e permitir repeti-la; ignorar respostas que cheguem após o timeout. |
| Campo meteorológico ausente, nulo ou inválido | Mostrar "—" para o campo; nunca converter ausência em zero; manter os demais campos válidos. |
| Troca de cidade com chamadas concorrentes | Aplicar somente respostas da seleção mais recente. |
| Troca de unidade | Atualizar todos os valores e rótulos sem nova consulta meteorológica. |
| Virada do dia ou mudança de horário sazonal | Determinar as cinco datas no fuso local da cidade e exibir uma entrada por data local, sem datas duplicadas ou omitidas. |

## Assumptions

- O fluxo inicial é a busca manual por cidade; geolocalização automática não foi
  incluída na versão inicial.
- A janela de previsão é hoje mais os quatro dias seguintes, conforme decisão
  registrada no discovery.
- Celsius é a unidade padrão da primeira consulta.
- A unidade escolhida dura apenas a sessão atual e volta a Celsius após
  recarregar ou iniciar uma nova sessão.
- A aplicação depende de conexão para obter dados atualizados; consulta offline
  e fallback por cache não fazem parte da versão inicial.
- Não há autenticação nem persistência de dados no servidor.
- O público valoriza consultas rápidas e leitura em dispositivos móveis; validar
  com stakeholders e usuários.
- Os campos descritos em RF2 e RF3 são o contrato de conteúdo desta versão; a
  interpretação da precipitação e o mapeamento de condições meteorológicas
  dependem de confirmação.
- O limite de timeout é 10 segundos. Metas de responsividade, matriz de
  navegadores e perfil de rede de produção ainda precisam de aprovação final.
- O horário apresentado indica quando a aplicação consultou os dados; não
  garante a idade ou o horário de observação dos dados meteorológicos.

## Risks

| Risco | Impacto | Mitigação prevista |
| --- | --- | --- |
| Indisponibilidade, lentidão ou limites de uso da Open-Meteo | Consultas incompletas ou indisponíveis | Confirmar cobertura, limites e disponibilidade; comunicar falhas e permitir nova tentativa. |
| Seleção de cidade homônima incorreta | Dados de outra localização podem orientar decisões | Exibir contexto geográfico disponível e exigir seleção explícita quando houver ambiguidade. |
| Interpretação inconsistente de condições ou precipitação | Usuário pode entender incorretamente os dados | Aprovar mapeamento dos códigos meteorológicos e definição de precipitação antes do release. |
| Dados antigos apresentados como atuais | Usuário pode tomar decisões com base em observação antiga | Exibir horário de recebimento da resposta sem apresentá-lo como horário da observação; aprovar limite de idade máxima dos dados. |
| Datas incoerentes em mudança de dia ou horário sazonal | Usuário pode interpretar incorretamente a janela prevista | Calcular datas no fuso da cidade e incluir casos de transição de horário nos testes. |
| Conversão ou rótulo de unidade incorreto | Interpretação errada de temperaturas | Verificar consistência de todas as temperaturas e seus rótulos nos dois modos. |
| Resposta antiga sobrescreve dados da cidade selecionada mais recentemente | Usuário pode ver dados da localização errada | Cobrir respostas fora de ordem nos testes e aceitar somente resultados da seleção ativa. |
| Interface difícil de usar em telas pequenas | Falha nos fluxos móveis prioritários | Validar busca, leitura e alternância de unidade em dispositivos móveis e larguras acordadas. |
| Falha de rede sem orientação adequada | Usuário não sabe se deve aguardar ou repetir | Estados claros de carregamento e erro, com ação de nova tentativa. |

## Out of Scope

- Autenticação, contas e perfis de usuário.
- Persistência de dados no servidor.
- Geolocalização automática do dispositivo.
- Persistência local entre sessões, incluindo preferências de unidade,
  favoritos e histórico de cidades.
- Atualização automática periódica dos dados.
- Alertas meteorológicos e notificações push.
- Idiomas além de pt-BR na versão inicial.
- Consulta offline e uso de cache como fallback.

## Open Questions

As decisões abaixo bloqueiam a aprovação para produção. Os requisitos e cenários
que dependem delas devem ser tratados como candidatos até que produto e
responsáveis pela fonte de dados confirmem as respostas.

1. **Cobertura geográfica:** definir países prioritários e quais campos de
   região/estado e país a experiência garante para desambiguação.
2. **Semântica dos dados:** aprovar o mapeamento dos códigos meteorológicos para
   rótulos pt-BR e se precipitação representa total acumulado ou somente chuva.
3. **Frescor:** definir idade máxima aceitável e comportamento quando a fonte
   não fornecer horário de observação ou os dados excederem esse limite.
4. **Open-Meteo:** confirmar termos de uso, limites, cobertura e disponibilidade
   para o tráfego esperado, incluindo o comportamento quando limites forem
   atingidos.
5. **Metas de release:** aprovar viewports, matriz de navegadores/sistemas,
   perfil de rede para produção, metas de desempenho e timeout de 10 segundos.

## Rastreabilidade

Cada intervalo de IDs AC abaixo inclui os dois extremos.

| User Story | Requisitos funcionais | Acceptance Criteria | Requisitos não-funcionais relevantes |
| --- | --- | --- | --- |
| US1 — Marina (planejadora da semana) | RF3 | AC3.1-AC3.3 | RNF1, RNF2, RNF3, RNF4, RNF5, RNF6, RNF7 |
| US2 — Rafael (decidindo como sair de casa) | RF1, RF2 | AC1.1-AC1.8, AC2.1-AC2.2 | RNF1, RNF2, RNF3, RNF4, RNF5, RNF6, RNF7 |
| US3 — Camila (viajante em preparação) | RF1, RF3, RF5 | AC1.1-AC1.2, AC3.1, AC3.3, AC5.1-AC5.3 | RNF1, RNF2, RNF3, RNF4, RNF5, RNF6, RNF7 |
| US4 — Rafael (decidindo como sair de casa) | RF4 | AC4.1-AC4.4 | RNF1, RNF2, RNF4, RNF6, RNF7 |
| US5 — Marina (planejadora da semana) | RF1, RF6 | AC1.6, AC1.9-AC1.10, AC6.1-AC6.4 | RNF1, RNF2, RNF3, RNF5, RNF6, RNF7 |