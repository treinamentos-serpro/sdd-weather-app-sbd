# Discovery — Aplicação de Previsão do Tempo

## Contexto

A empresa precisa de uma aplicação de previsão do tempo para que usuários consultem as condições meteorológicas de cidades de interesse, tanto no momento atual quanto para os próximos cinco dias. A experiência deve permitir localizar uma cidade, compreender as temperaturas na unidade escolhida e funcionar em dispositivos móveis.

O briefing define as capacidades centrais, mas ainda não especifica público prioritário, fonte e cobertura dos dados, conteúdo exato dos painéis, interpretação de “5 dias”, nem critérios de qualidade mensuráveis. Esta análise registra o escopo conhecido e separa decisões pendentes de suposições a validar antes da especificação detalhada.

## Requisitos Funcionais

- **RF1 — Buscar cidades:** o usuário deve poder informar uma cidade e selecionar uma correspondência para consultar. A busca e a seleção devem permitir distinguir cidades com nomes iguais quando os dados disponíveis oferecerem contexto suficiente, como estado/região e país.
- **RF2 — Consultar clima atual:** após selecionar uma cidade, a aplicação deve apresentar as condições atuais associadas àquela localização. As variáveis que compõem “clima atual” ainda precisam ser definidas.
- **RF3 — Consultar previsão:** a aplicação deve apresentar a previsão para cinco dias associada à cidade selecionada. A granularidade, as variáveis exibidas e se o dia atual conta como um dos cinco ainda precisam ser definidos.
- **RF4 — Alternar unidade:** o usuário deve poder alternar entre Celsius e Fahrenheit. A unidade selecionada deve ser aplicada de forma consistente às temperaturas mostradas no clima atual e na previsão.
- **RF5 — Atualizar consulta por cidade:** quando o usuário selecionar outra cidade, o clima atual e a previsão apresentados devem corresponder à nova seleção.

## Requisitos Não-Funcionais

Os itens abaixo são requisitos de qualidade derivados do objetivo do briefing. Metas numéricas são propostas iniciais para validação com produto e tecnologia, não compromissos já aprovados.

- **RNF1 — Responsividade:** a interface deve se adaptar a dispositivos móveis, mantendo legíveis os dados meteorológicos e utilizáveis os controles de busca e unidade. Confirmar larguras mínimas, navegadores e orientação suportados.
- **RNF2 — Usabilidade:** a busca, a seleção de cidade e a leitura do clima devem ser compreensíveis sem treinamento; o usuário deve conseguir identificar a cidade consultada e a unidade em uso.
- **RNF3 — Desempenho (proposta):** estabelecer um orçamento de tempo para busca e carregamento dos dados após a confirmação da cidade; sugestão inicial: exibir resultado ou estado de carregamento em até 1 segundo e dados em até 3 segundos em conexão típica. Validar com a equipe e com a fonte de dados escolhida.
- **RNF4 — Acessibilidade:** controles devem ser operáveis por teclado, ter nomes acessíveis e estados perceptíveis; conteúdo e controles devem manter contraste legível. Definir o nível de conformidade esperado, preferencialmente WCAG 2.2 AA.
- **RNF5 — Resiliência:** indisponibilidade da rede ou da fonte meteorológica não deve deixar a interface sem explicação; comunicar falhas e oferecer uma forma de tentar novamente. A política de cache e degradação offline permanece em aberto.
- **RNF6 — Compatibilidade:** a aplicação deve funcionar nos navegadores móveis e sistemas operacionais definidos para o público-alvo. A matriz de suporte ainda precisa ser acordada.
- **RNF7 — Clareza dos dados:** temperaturas devem sempre estar acompanhadas da unidade; datas e horários devem ser apresentados de forma não ambígua e coerente com o fuso horário da localização, sujeito à decisão de produto.

## Riscos

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| Fonte meteorológica indisponível, lenta ou sujeita a limites de uso | Média | Alto | Avaliar cobertura, limites e disponibilidade antes da escolha; prever timeout, mensagens claras, repetição manual e cache conforme política aprovada. |
| Busca retorna cidades homônimas ou localização incorreta | Alta | Alto | Apresentar região e país junto aos resultados e exigir seleção explícita quando houver ambiguidade; validar a localização selecionada antes de exibir dados. |
| Interpretação divergente de “previsão de 5 dias” | Alta | Médio | Definir se inclui hoje, intervalo de datas, granularidade e tratamento de fuso horário antes de aprovar a especificação. |
| Dados ou controles ficam difíceis de usar em telas pequenas | Média | Alto | Priorizar layout mobile, validar em dispositivos reais e testar os fluxos de busca, seleção e alternância de unidade em larguras móveis. |
| Conversão ou rótulo incorreto entre Celsius e Fahrenheit | Baixa | Alto | Definir fonte canônica dos dados e regra de arredondamento; validar conversões e assegurar que valores e rótulos mudem juntos. |
| Usuário interpreta previsão como observação atual ou dado desatualizado | Média | Alto | Diferenciar visualmente condição atual e previsão; informar horário de atualização e fuso quando aplicável, após confirmar disponibilidade desses dados. |

## Perguntas em Aberto

1. **Quais são os limites de uso, a cobertura geográfica, as condições de uso e a disponibilidade do Open-Meteo?** Impacto: afeta a confiabilidade, a cobertura das localidades buscadas e a forma de tratar limites ou indisponibilidade da fonte escolhida.
2. **Como a busca deve funcionar: correspondência exata, sugestões enquanto digita, tolerância a erros e suporte a acentos?** Impacto: determina a experiência de descoberta e os requisitos de busca e geocodificação.
3. **Como diferenciar cidades com o mesmo nome e qual nível geográfico será exibido (estado/região, país)?** Impacto: reduz consultas para a localização errada e define os dados necessários nos resultados.
4. **O que significa “clima atual” para o produto: quais variáveis e com que frequência de atualização?** Impacto: define conteúdo, dependências de dados e expectativa de atualidade.
5. **A previsão de hoje mais os quatro dias seguintes deve ser diária ou por hora, quais variáveis serão mostradas e as datas seguirão o fuso local da cidade?** Impacto: define o contrato dos dados, a apresentação da previsão e os critérios de aceite.
6. **A preferência de unidade escolhida pelo usuário deve persistir entre sessões no próprio dispositivo?** Impacto: define o comportamento após fechar ou recarregar o app, sem pressupor conta ou armazenamento no servidor.
7. **Quais países e localidades devem ser priorizados e quais convenções regionais, além da UI em pt-BR, devem ser usadas para datas, horários e números?** Impacto: influencia a cobertura da busca e a interpretação correta dos dados exibidos.
8. **Além da busca manual, deve haver opção de usar a localização do dispositivo?** Impacto: afeta permissões, privacidade e o fluxo inicial; a decisão de idioma e a ausência de autenticação não determinam esse comportamento.
9. **A aplicação deve manter dados em cache ou oferecer consulta offline?** Impacto: altera frescor dos dados, armazenamento, complexidade e comportamento durante falhas de conexão.
10. **Quais navegadores/dispositivos e metas de desempenho devem ser suportados?** Impacto: permite definir critérios verificáveis de compatibilidade, responsividade e latência.
11. **Favoritos, histórico de cidades ou compartilhamento de consultas fazem parte do escopo, considerando que não haverá autenticação nem persistência no servidor?** Impacto: pode exigir armazenamento local e novos fluxos; a decisão de não persistir dados no servidor limita as opções de sincronização entre dispositivos.

## Suposições

- A aplicação será usada principalmente para consultas rápidas de clima e planejamento próximo; isso deve ser validado com usuários ou stakeholders.
- A busca por cidade é o fluxo inicial, pois o briefing não solicita geolocalização automática.
- A previsão cobre hoje e os quatro dias seguintes; a granularidade e as variáveis exibidas ainda não estão definidas.
- O usuário poderá alternar a unidade durante a consulta; persistência da preferência não está implícita.
- A aplicação depende de conexão com a internet para obter dados atualizados; comportamento offline permanece em aberto.
- Autenticação e persistência de dados no servidor estão fora do escopo; favoritos e histórico ainda não foram decididos.
- Metas sugeridas de desempenho e acessibilidade servem como ponto de partida para discussão, não como critérios aprovados.

## Personas

### Planejadora da semana

- **Objetivo principal:** comparar a previsão dos próximos dias para organizar compromissos, deslocamentos e atividades.
- **Contexto de uso:** consulta no desktop para planejar e revisita no celular para conferir mudanças.
- **Métrica de sucesso:** consegue identificar rapidamente os dias mais adequados para seus planos, sem precisar consultar outra fonte.

### Pessoa decidindo como sair de casa

- **Objetivo principal:** saber as condições atuais e escolher roupa ou levar proteção contra chuva.
- **Contexto de uso:** principalmente no celular, em consultas rápidas antes de sair.
- **Métrica de sucesso:** encontra a cidade e entende a temperatura e a condição atual em uma única consulta.

### Viajante em preparação

- **Objetivo principal:** consultar a previsão de uma cidade de destino para preparar a viagem.
- **Contexto de uso:** desktop ou celular durante o planejamento e celular durante a viagem.
- **Métrica de sucesso:** seleciona corretamente a cidade de destino e obtém uma previsão de cinco dias clara para o período consultado.

## Decisões

- **Fonte de dados: Open-Meteo, sem API key.** Justificativa: permite obter geocodificação e dados meteorológicos sem exigir uma chave de API no cliente. Resolve a escolha inicial da fonte e a necessidade de credenciais; limites de uso, cobertura e disponibilidade ainda devem ser verificados.
- **“5 dias” = hoje + os quatro dias seguintes.** Justificativa: define um intervalo previsível para a consulta da previsão. Resolve a dúvida sobre incluir o dia atual; granularidade e variáveis exibidas ainda precisam ser definidas.
- **Unidade padrão: Celsius.** Justificativa: estabelece um padrão para a primeira consulta, alinhado ao idioma da interface. Resolve a dúvida sobre a unidade inicial; persistência da escolha do usuário não está definida por esta decisão.
- **Sem autenticação e sem persistência de servidor.** Justificativa: mantém o escopo focado em consultas sem conta ou dados associados a um perfil. Resolve a dúvida sobre login e armazenamento no servidor; não determina se preferências poderão ser guardadas localmente no dispositivo.
- **Idioma da UI: pt-BR.** Justificativa: padroniza os textos e a experiência inicial para o público definido. Resolve a dúvida sobre o idioma da interface; cobertura geográfica e convenções de data, hora e unidades além da unidade padrão continuam pendentes.
