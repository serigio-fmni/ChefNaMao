# OkCheff — PRD/EPR Completo

Documento consolidado para continuar o desenvolvimento do app **OkCheff** com Onspace/Codex, sem reconstruir o app do zero.

---

## 1. Visão geral do produto

### Nome do app

**OkCheff**

### Ideia central

O OkCheff é um app de receitas com IA que funciona como um **Chef pessoal**.

Ele ajuda o usuário a:

- descobrir receitas;
- usar ingredientes que já tem em casa;
- salvar ideias no Caderno;
- desbloquear receitas completas;
- criar lista de compras;
- cozinhar passo a passo;
- tirar dúvidas por texto;
- cozinhar por voz com o comando **OkCheff**;
- planejar eventos com receitas reservadas.

### Frase principal

> Cozinhe com um Chef ao seu lado, por texto ou por voz.

### Diferencial do app

O OkCheff não é apenas um app que mostra receitas.

Ele guia o usuário antes, durante e depois da receita:

- antes: ajuda a escolher o que cozinhar;
- no mercado: ajuda com lista de compras e substituições;
- na cozinha: guia passo a passo;
- durante dúvidas: responde por texto ou voz;
- em eventos: ajuda a planejar e reservar receitas.

### Público-alvo

O app é feito para pessoas que:

- querem cozinhar melhor;
- não sabem o que fazer com os ingredientes que têm;
- querem praticidade;
- gostam de receitas guiadas;
- têm medo de errar no preparo;
- querem ajuda durante a compra e a cozinha;
- querem cozinhar sem ficar tocando no celular;
- planejam jantares, datas especiais, marmitas ou refeições da família.

### Promessa do OkCheff

> Eu não estou sozinho cozinhando. Tem um Chef me guiando.

### Modelo principal do produto

O produto principal não são créditos.

O produto principal é:

> **Receitas guiadas com Chef.**

Existem dois níveis:

1. **Receita com ajuda do Chef**  
   Inclui ajuda por texto.

2. **Receita com OkCheff**  
   Inclui ajuda por voz + texto.

### Plataformas previstas

Primeira fase:

- Android;
- pagamento via **Google Play Billing**.

Futuro:

- iOS poderá ser avaliado depois;
- Web/PWA poderá ser avaliado depois.

### Estado atual do app

O app já existe visualmente e tem telas iniciais como:

- Descobrir;
- Na Geladeira;
- Inspiração;
- Caderno;
- Eventos;
- Chef Chat;
- Perfil;
- login;
- cards;
- receitas;
- lista de compras.

O trabalho agora não é começar do zero.

O trabalho é:

> Reformular as regras do produto e ajustar o app existente para seguir este PRD/EPR.

### Regra importante de construção

O app deve ser ajustado com cuidado.

Não é para reconstruir tudo do zero.

A execução futura deve ser feita assim:

1. revisar o que já existe;
2. comparar com o PRD/EPR;
3. ajustar por partes;
4. testar cada parte;
5. só depois avançar para a próxima.

---

## 2. Estrutura principal do app e telas

### Regra geral

O OkCheff já tem uma base visual criada na Onspace.

Por isso, a regra é:

> Não reconstruir do zero. Ajustar o app atual para seguir o novo modelo.

As telas atuais devem ser aproveitadas sempre que possível.

### Menu inferior principal

O app pode manter a estrutura atual:

1. **Descobrir**
2. **Caderno**
3. **Chef Chat**
4. **Perfil**

Regra importante:

> O Chef Chat não deve funcionar solto para receitas.

Se o usuário abrir o Chef Chat sem estar dentro de uma receita, o app deve perguntar:

> Sobre qual receita você quer falar?

E mostrar receitas do Caderno para escolher.

### Tela Descobrir

A tela **Descobrir** é a entrada principal do app.

Ela deve ter duas abas:

#### Na Geladeira

Para o usuário informar ingredientes que tem em casa.

Exemplo:

> frango, tomate, alho

O app gera cards de receitas possíveis.

#### Inspiração

Para o usuário escolher uma ocasião ou categoria.

Exemplos:

- jantar romântico;
- Dia das Mães;
- Dia dos Pais;
- aniversário;
- Natal;
- churrasco;
- almoço em família;
- receita rápida;
- vegetariana;
- vegana.

### Resultado da busca

Cada busca grátis gera:

- **3 cards de receita**;
- limite de **10 buscas por dia**;
- reset às **00:00 no horário local do usuário**.

O card mostra apenas uma ideia.

Não mostra receita completa.

### Card de receita

Cada card deve mostrar:

- imagem;
- nome da receita;
- descrição curta;
- tempo;
- porções;
- dificuldade;
- ingredientes sem quantidade;
- botão **Salvar no Caderno**.

O card não deve mostrar:

- quantidade dos ingredientes;
- lista de compras completa;
- modo de preparo completo;
- passo a passo.

### Caderno

O Caderno é o centro do app.

Ele deve ter 3 áreas:

1. **Ideias salvas**
2. **Receitas completas**
3. **Meus Eventos**

### Ideias salvas

Aqui ficam os cards que o usuário salvou.

São receitas ainda não desbloqueadas.

Cada item deve ter:

- imagem;
- nome;
- descrição curta;
- tempo;
- porções;
- dificuldade;
- ingredientes sem quantidade;
- botão **Ver lista de compras** ou **Desbloquear receita**.

Quando o usuário clicar nesse botão, a receita vira uma receita completa, se ele tiver direito disponível.

### Receitas completas

Aqui ficam receitas desbloqueadas.

Receita completa deve conter:

- imagem;
- nome;
- descrição;
- ingredientes com quantidade;
- lista de compras;
- modo de preparo;
- passo a passo;
- dicas do Chef;
- acesso offline;
- botão **Cozinhar agora**;
- botão **Tenho uma dúvida**;
- botão **Ativar OkCheff**, se tiver voz ativa.

Regra central:

> Receita completa salva no Caderno nunca expira.

### Meus Eventos

Eventos servem para planejar receitas para datas futuras.

Cada evento pode ter:

- nome do evento;
- data;
- receita associada;
- tipo de ajuda reservada;
- lembrete de compra;
- lembrete de preparo.

Exemplo:

> Jantar romântico — 18/06 — Risoto de camarão

### Perfil

A tela Perfil deve mostrar:

- nome do usuário;
- plano atual;
- receitas salvas;
- eventos;
- buscas grátis do dia;
- status do Premium;
- opção de login;
- preferências alimentares;
- página Como funciona;
- opção de assinatura/pacotes.

### Tela Como funciona

Deve explicar de forma simples:

- como funcionam as buscas grátis;
- o que é card;
- o que é Caderno;
- diferença entre ideia salva e receita completa;
- receita grátis mensal/bônus do mês;
- receita de boas-vindas;
- pacotes avulsos;
- Premium;
- diferença entre Chef por texto e OkCheff por voz;
- consulta offline;
- anúncios.

### Regra de navegação

Fluxo principal:

1. usuário pesquisa;
2. app mostra cards;
3. usuário salva card no Caderno;
4. usuário entra no Caderno;
5. usuário desbloqueia a receita;
6. app gera lista de compras + receita completa + passo a passo;
7. receita fica salva para sempre;
8. usuário pode cozinhar offline;
9. se tiver pacote ativo, pode usar Chef por texto ou voz.

---

## 3. Modelo grátis, receita mensal e boas-vindas

### Plano grátis

O usuário grátis pode usar o app para descobrir ideias de receitas.

Ele pode:

- fazer **10 pesquisas por dia**;
- receber **3 cards por pesquisa**;
- salvar cards no Caderno;
- acessar ideias salvas;
- criar eventos simples;
- ver anúncios;
- receber bônus/receitas grátis quando disponíveis.

As buscas grátis resetam todos os dias às:

> **00:00 no horário local do usuário.**

### O que o grátis não libera

No plano grátis, o usuário não pode acessar livremente:

- lista de compras completa;
- ingredientes com quantidade;
- receita completa;
- passo a passo completo;
- Chef por texto;
- OkCheff por voz;
- reserva de receita com Chef para evento.

Para isso, ele precisa de:

- receita bônus;
- pacote avulso;
- Premium Chef;
- Premium OkCheff.

### Receita grátis mensal / bônus

A receita grátis mensal não deve parecer uma obrigação fixa do app.

Ela deve ser tratada como:

> **Bônus do mês**

Esse bônus pode liberar uma receita completa, mas com regra controlada.

O bônus mensal deve priorizar:

- receita pronta;
- receita de cache;
- receita de evento;
- receita temática sugerida pelo app.

Exemplos:

- Dia dos Pais;
- jantar romântico;
- almoço de domingo;
- receita rápida da semana;
- sobremesa especial;
- receita econômica.

O objetivo é evitar que o bônus mensal gere custo alto sempre com receita totalmente personalizada.

### O que o bônus mensal inclui

A receita bônus inclui:

- imagem;
- título;
- descrição;
- ingredientes com quantidade;
- lista de compras;
- modo de preparo;
- passo a passo;
- dicas do Chef;
- acesso offline depois de salva.

Não inclui:

- Chef por texto;
- OkCheff por voz.

### Receita de boas-vindas

No primeiro uso, o usuário ganha uma experiência especial:

> **1 receita completa com OkCheff por voz, válida por 7 dias.**

Essa experiência serve para o usuário entender o valor principal do app.

### Como escolher a receita de boas-vindas

O usuário não precisa escolher imediatamente ao entrar.

Fluxo recomendado:

1. usuário entra no app;
2. faz algumas buscas;
3. salva ideias no Caderno;
4. o app mostra uma mensagem:

> Você tem 1 experiência grátis com OkCheff. Escolha uma receita para cozinhar por voz.

O app pode oferecer:

- uma receita salva no Caderno;
- uma receita parecida do cache;
- uma receita de evento;
- 3 sugestões prontas.

### Validade da boas-vindas

A experiência de boas-vindas vale por:

> **7 dias após ativar a receita.**

Durante esse período, o usuário pode usar:

- receita completa;
- lista de compras;
- passo a passo;
- Chef por texto;
- OkCheff por voz.

Depois dos 7 dias:

- a receita completa continua salva;
- o acesso offline continua;
- a ajuda por texto/voz expira.

### Anúncios no grátis

Usuário grátis vê anúncios.

Os anúncios podem aparecer em:

- tela inicial;
- resultados;
- Caderno;
- antes de desbloquear receita;
- antes do preparo;
- receita bônus.

Regra:

> Anúncio não pode atrapalhar a experiência de cozinhar passo a passo.

### Mensagens simples para o usuário

Quando acabar busca grátis:

> Você usou suas buscas grátis de hoje. Amanhã elas renovam.

Quando tentar desbloquear receita sem direito:

> Para ver a lista de compras e o passo a passo, escolha um pacote ou assine Premium.

Quando tentar usar Chef por texto:

> Para conversar com o Chef sobre esta receita, você precisa ter um pacote ativo.

Quando tentar usar voz:

> Para cozinhar por voz com OkCheff, escolha um pacote com voz ou assine Premium OkCheff.

---

## 4. Caderno, desbloqueio de receita e acesso offline

### Papel do Caderno

O **Caderno** é o centro do OkCheff.

Tudo que o usuário quiser guardar deve ir para o Caderno:

- ideias de receitas;
- receitas completas;
- receitas para eventos;
- receitas já cozinhadas;
- receitas com ajuda do Chef;
- receitas com OkCheff por voz.

### Abas do Caderno

O Caderno deve ter 3 áreas:

1. **Ideias salvas**
2. **Receitas completas**
3. **Meus Eventos**

### Ideias salvas

São cards salvos pelo usuário.

Ainda não são receitas completas.

Mostram apenas:

- imagem;
- nome;
- descrição curta;
- tempo;
- porções;
- dificuldade;
- ingredientes sem quantidade.

Botão principal:

> Ver lista de compras

ou

> Desbloquear receita

### Quando a receita é desbloqueada

A receita só vira completa quando o usuário clica em:

> Ver lista de compras

Nesse momento, o app verifica se o usuário tem direito disponível:

- bônus mensal;
- receita de boas-vindas;
- pacote avulso;
- Premium ativo;
- evento reservado.

### O que é gerado no desbloqueio

Ao desbloquear, o app deve gerar e salvar:

- ingredientes com quantidade;
- lista de compras;
- modo de preparo;
- passo a passo;
- dicas distribuídas;
- dica final do Chef;
- dados para consulta offline.

### Receita completa nunca expira

Regra central:

> Receita completa salva no Caderno nunca expira.

Mesmo que o plano acabe, o usuário continua vendo:

- ingredientes;
- lista de compras;
- modo de preparo;
- passo a passo;
- dicas;
- acesso offline.

### O que pode expirar

O que expira é o acesso ao Chef ao vivo:

- Chef por texto;
- OkCheff por voz;
- timers inteligentes;
- dúvidas durante o preparo;
- substituições em tempo real;
- ajuda no mercado.

### Acesso offline

Depois que a receita completa foi desbloqueada, ela deve funcionar offline com:

- lista de compras;
- ingredientes;
- modo de preparo;
- passo a passo;
- dicas já salvas.

Offline não funciona:

- chat com Chef;
- voz OkCheff;
- novas adaptações da receita;
- novas substituições inteligentes;
- geração de novas receitas.

### Dicas dentro da receita

As dicas devem aparecer durante a receita, não só no final.

Devem existir dicas em:

- lista de compras;
- ingredientes;
- modo de preparo;
- passo a passo;
- finalização.

Exemplo:

> Se não encontrar shiitake, pode usar shimeji ou cogumelo paris.

### Botões da receita completa

Uma receita completa deve ter:

- **Lista de compras**;
- **Ver preparo**;
- **Cozinhar agora**;
- **Tenho uma dúvida**;
- **Ativar OkCheff**;
- **Adicionar a evento**;
- **Marcar como feita**.

### Regra de segurança do produto

O usuário nunca deve perder uma receita já desbloqueada.

Mesmo que:

- cancele Premium;
- pacote expire;
- fique sem internet;
- mude de celular;
- use depois de meses.

Desde que esteja logado, a receita deve continuar no Caderno.

---

## 5. Chef por texto e Voz OkCheff

### Regra central

Todo atendimento do Chef precisa estar ligado a uma receita do Caderno.

Regra:

> O Chef nunca deve responder sobre uma receita solta sem saber qual receita o usuário está preparando.

### Chef por texto

O **Chef por texto** serve para tirar dúvidas dentro de uma receita.

Ele pode ajudar em:

- substituição de ingredientes;
- quantidade;
- ponto da comida;
- tempo de forno;
- troca de utensílio;
- dúvidas da lista de compras;
- dúvidas do passo a passo;
- adaptação simples da receita.

Exemplos:

> Não achei creme de leite. Posso usar outra coisa?

> Meu arroz ainda está duro. O que eu faço?

> Posso trocar frango por carne?

### Quando o Chef por texto aparece

O botão **Tenho uma dúvida** pode aparecer em:

- lista de compras;
- receita completa;
- modo de preparo;
- passo a passo;
- evento com receita associada.

Ao clicar, abre o chat já vinculado àquela receita.

### Chef Chat fora da receita

Se o usuário abrir a aba **Chef Chat** fora de uma receita, o app deve perguntar:

> Sobre qual receita você quer falar?

E mostrar opções do Caderno:

- receitas completas;
- receitas de eventos;
- receitas usadas recentemente.

Se não tiver receita completa, mostrar:

> Você ainda não tem uma receita completa no Caderno. Salve uma ideia e desbloqueie a receita para conversar com o Chef.

### Voz OkCheff

A **Voz OkCheff** é o principal diferencial do app.

Ela permite cozinhar sem tocar no celular.

Comando principal:

> OkCheff

A voz pode ser usada para:

- repetir passo;
- avançar para próximo passo;
- voltar passo;
- tirar dúvidas;
- pedir timer;
- perguntar substituições;
- pedir ajuda no mercado;
- confirmar ingredientes;
- adaptar pequenos detalhes.

### Voz sempre vinculada à receita

A Voz OkCheff também precisa estar ligada a uma receita do Caderno.

Se o usuário tentar usar voz fora de uma receita, o app pergunta:

> Qual receita você quer preparar com OkCheff?

E mostra receitas disponíveis no Caderno.

### Voz na lista de compras

A voz pode funcionar antes do preparo, durante a compra.

Exemplos:

> OkCheff, não achei shiitake.

> OkCheff, qual carne eu compro para moer?

> OkCheff, esse queijo serve?

### Voz no preparo

Durante o passo a passo, o usuário pode dizer:

> OkCheff, repete.

> OkCheff, próximo passo.

> OkCheff, volta.

> OkCheff, me avisa em 10 minutos.

> OkCheff, meu forno é fraco. O que faço?

### O que precisa de internet

Precisa de internet:

- Chef por texto;
- Voz OkCheff;
- respostas novas;
- substituições inteligentes;
- adaptação em tempo real;
- timers inteligentes se dependerem de notificação online.

### O que funciona offline

Funciona offline:

- receita completa;
- ingredientes;
- lista de compras;
- modo de preparo;
- passo a passo salvo;
- dicas já geradas;
- botão próximo/voltar/repetir texto salvo.

### Acesso por plano

Chef por texto funciona com:

- pacote “Receitas com ajuda do Chef”;
- pacote “Receitas com OkCheff”;
- Premium Chef;
- Premium OkCheff;
- receita de boas-vindas ativa.

Voz OkCheff funciona com:

- pacote “Receitas com OkCheff”;
- Premium OkCheff;
- receita de boas-vindas ativa.

### Regra de expiração

Quando o pacote ou Premium expira:

O usuário mantém:

- receita completa;
- lista de compras;
- passo a passo;
- dicas offline.

Mas perde:

- conversa com Chef;
- voz OkCheff;
- dúvidas ao vivo;
- ajuda no mercado por texto/voz.

---

## 6. Eventos, reservas e uso antes do evento

### Papel dos Eventos

A área **Eventos** serve para o usuário planejar receitas para datas especiais.

Exemplos:

- jantar romântico;
- Dia dos Pais;
- almoço em família;
- aniversário;
- ceia;
- churrasco;
- marmitas da semana;
- jantar com amigos.

### Evento simples

Criar evento simples é grátis.

O evento simples pode ter:

- nome do evento;
- data;
- horário opcional;
- receita associada;
- observações;
- lembrete de compra;
- lembrete de preparo.

Exemplo:

> Jantar romântico — 18/06 — Risoto de camarão

### Evento com receita reservada

O usuário pode reservar uma receita com ajuda do Chef para uma data futura.

Para reservar, ele precisa ter direito disponível:

- pacote avulso;
- Premium ativo;
- receita com OkCheff disponível;
- receita com Chef disponível.

Quando reserva, o app desconta esse direito do saldo/plano.

### Tipo de ajuda reservada

O evento guarda o tipo de ajuda comprado no momento da reserva.

Se reservou com **Chef por texto**, no evento terá:

- receita completa;
- lista de compras;
- passo a passo;
- chat por texto.

Se reservou com **OkCheff por voz**, no evento terá:

- tudo do Chef por texto;
- voz OkCheff;
- comandos de voz;
- timer;
- repetir passo;
- próximo passo por voz.

### Pode usar antes do evento

Regra fechada:

> Receita reservada para evento pode ser usada antes da data.

Motivo:

O usuário pode querer testar a receita antes.

Exemplo:

> Vou fazer antes em casa para treinar e não errar no dia.

Mesmo usando antes, a receita continua associada ao evento.

### No dia do evento

No dia do evento, o app deve lembrar o usuário:

> Hoje é o dia do seu evento. Sua receita está pronta no Caderno.

O usuário pode:

- abrir a receita;
- ver lista de compras;
- cozinhar agora;
- usar Chef por texto se reservado;
- usar OkCheff por voz se reservado.

### Se quiser trocar a receita

O usuário pode trocar a receita do evento.

Regra recomendada:

- se trocar por outra receita já completa, não gasta novo direito;
- se trocar por uma receita nova ainda não desbloqueada, precisa gastar um novo direito;
- se a ajuda do Chef já estava reservada, o app deve perguntar se ele quer transferir para a nova receita.

Mensagem:

> Você quer usar sua reserva de Chef nesta nova receita?

### Lembretes do evento

O app deve permitir lembretes simples:

- comprar ingredientes;
- descongelar algo;
- iniciar preparo;
- horário do evento.

Exemplos:

> Comprar ingredientes amanhã às 10h.

> Começar o preparo 2 horas antes.

### Evento sem pacote ativo

Mesmo sem pacote ativo, o usuário pode:

- criar evento simples;
- associar receita já salva;
- ver receita completa já desbloqueada;
- consultar lista de compras;
- cozinhar offline.

Mas não pode:

- reservar Chef;
- reservar OkCheff;
- desbloquear nova receita completa sem direito disponível.

### Botões possíveis em Eventos

Cada evento pode mostrar:

- **Ver receita**;
- **Lista de compras**;
- **Cozinhar agora**;
- **Reservar Chef**;
- **Reservar OkCheff**;
- **Editar evento**;
- **Trocar receita**;
- **Adicionar lembrete**.

---

## 7. Pacotes avulsos, Premium e pagamentos

### Modelo de venda

O OkCheff não deve vender “créditos” como produto principal.

O produto vendido é:

> Receitas guiadas com ajuda do Chef.

Existem dois tipos:

1. **Receitas com Chef**  
   Ajuda por texto.

2. **Receitas com OkCheff**  
   Ajuda por voz + texto.

### Pacotes avulsos

Pacotes avulsos são compras únicas.

Validade:

> 30 dias após a compra.

Durante esses 30 dias, o usuário também fica sem anúncios.

### Pacotes com Chef por texto

Nome sugerido:

> Pacote Chef

Descrição para o usuário:

> Para cozinhar com o Chef te ajudando por texto, desde a lista de compras até o preparo.

Opções:

- 3 receitas;
- 6 receitas;
- 10 receitas.

Inclui:

- desbloqueio de receita completa;
- lista de compras;
- passo a passo;
- dicas;
- Chef por texto;
- receitas salvas para sempre;
- sem anúncios por 30 dias.

### Pacotes com OkCheff por voz

Nome sugerido:

> Pacote OkCheff

Descrição para o usuário:

> Para cozinhar conversando com o Chef por voz, sem tocar no celular.

Opções:

- 3 receitas;
- 6 receitas;
- 10 receitas.

Inclui:

- tudo do Pacote Chef;
- voz OkCheff;
- comandos por voz;
- repetir passo;
- próximo passo;
- voltar passo;
- timer por voz;
- dúvidas por voz;
- sem anúncios por 30 dias.

### Premium Chef

Assinatura mensal.

Inclui:

- 20 receitas por mês;
- Chef por texto;
- busca por foto da geladeira/despensa;
- lista de compras;
- passo a passo;
- dicas;
- receitas salvas para sempre;
- eventos com reserva por texto;
- sem anúncios enquanto ativo.

Não inclui:

- voz OkCheff.

### Premium OkCheff

Assinatura mensal.

Inclui:

- 20 receitas por mês;
- tudo do Premium Chef;
- busca por foto da geladeira/despensa;
- voz OkCheff;
- comandos por voz;
- timer por voz;
- dúvidas por voz;
- eventos com reserva por voz;
- sem anúncios enquanto ativo.

### Busca por foto da geladeira/despensa

A busca por foto é um recurso Premium mensal.

O usuário Premium pode tirar uma foto da geladeira, despensa, bancada ou ingredientes disponíveis. O Chef analisa a imagem, identifica os ingredientes visíveis e sugere receitas possíveis sem o usuário precisar digitar.

Disponível para:

- Premium Chef;
- Premium OkCheff.

Regras:

- no Premium Chef, a foto gera receitas e permite ajuda por texto;
- no Premium OkCheff, a foto gera receitas e permite ajuda por texto + voz;
- a imagem serve apenas para identificar ingredientes e gerar sugestões;
- o app deve permitir o usuário confirmar ou corrigir os ingredientes identificados antes de gerar os cards;
- a busca por foto conta como uma busca/geração de receita Premium;
- se a imagem estiver ruim, o app deve pedir outra foto ou pedir confirmação manual.

Mensagem sugerida:

> Tire uma foto da sua geladeira e o Chef sugere o que dá para preparar.

### Regra de acúmulo

#### Pacote avulso

- vale por 30 dias;
- receitas não usadas expiram após 30 dias;
- receitas já desbloqueadas ficam salvas para sempre;
- anúncios removidos por 30 dias.

#### Premium

- libera 20 receitas por mês;
- renova mensalmente;
- receitas não usadas não acumulam;
- receitas desbloqueadas ficam salvas para sempre;
- anúncios removidos enquanto ativo.

### Uso em receita antiga

Pacote e Premium podem ser usados em:

- receita nova;
- receita antiga já salva;
- receita de evento;
- receita que o usuário quer repetir com ajuda do Chef.

Exemplo:

> O usuário já tem uma receita completa salva. Depois compra Pacote OkCheff. Agora pode usar voz nessa receita antiga enquanto o pacote estiver ativo.

### Pagamento

Primeira fase do app:

> Android com Google Play Billing.

Não vamos definir iPhone agora.

Valores dos planos:

> A definir depois.

O PRD/EPR deve deixar os produtos preparados, mas sem travar preço neste momento.

### Tela de compra

A tela de compra deve ter duas áreas:

1. **Comprar pacote avulso**
2. **Assinar Premium**

Ela deve explicar de forma simples:

- pacote avulso vale 30 dias;
- Premium renova todo mês;
- receitas completas ficam salvas para sempre;
- Chef por texto e voz dependem do plano ativo;
- pacote e Premium removem anúncios.

### Mensagens importantes

Ao tentar desbloquear receita:

> Para ver a lista de compras e o passo a passo, escolha um pacote ou assine Premium.

Ao tentar usar voz sem plano de voz:

> Para usar OkCheff por voz, escolha um pacote com voz ou assine Premium OkCheff.

Ao pacote vencer:

> Seu pacote venceu, mas suas receitas continuam salvas no Caderno.

Ao Premium vencer:

> Seu Premium terminou, mas suas receitas completas continuam salvas.

---

## 8. Anúncios, cache e geração de receitas

### Anúncios

Usuário grátis vê anúncios.

Usuário com pacote avulso fica sem anúncios por:

> 30 dias após a compra.

Usuário Premium fica sem anúncios enquanto a assinatura estiver ativa.

### Onde podem aparecer anúncios

Anúncios podem aparecer em:

- tela Descobrir;
- resultado dos cards;
- Caderno;
- tela de receita bônus;
- antes de desbloquear receita;
- antes de iniciar o preparo.

Regra importante:

> Não colocar anúncio no meio do passo a passo da receita.

Durante o preparo, a experiência precisa ser limpa.

### Cache de receitas

O cache deve ser usado para economizar custo e acelerar respostas.

Antes de gerar uma receita nova, o app deve procurar se já existe uma receita parecida.

Fluxo:

1. usuário faz busca;
2. app procura receitas parecidas no cache;
3. se encontrar boas opções, usa/adapta;
4. se não encontrar, gera nova receita com IA;
5. receita boa pode ser salva no cache para uso futuro.

### Cache vale para todos os planos

O cache pode ser usado em:

- cards grátis;
- receita bônus mensal;
- receita de boas-vindas;
- pacotes avulsos;
- Premium;
- eventos;
- receitas com Chef;
- receitas com OkCheff.

### O app não pode repetir sempre a mesma receita

Mesmo usando cache, o app deve variar.

Exemplo:

Se o usuário buscar sempre:

> ovo, queijo e coentro

O app não deve mostrar sempre omelete.

Pode variar com:

- ovos mexidos cremosos;
- tortilla simples;
- panqueca de ovo;
- bolinho de ovo na frigideira;
- omelete recheada;
- sugestão de adicionar tomate ou cebola.

### Geração dos cards

Cada busca gera 3 cards.

Cada card deve ter:

- imagem;
- nome;
- descrição curta;
- tempo;
- porções;
- dificuldade;
- ingredientes sem quantidade.

O card é apenas uma ideia.

Não deve gerar receita completa ainda.

### Geração da receita completa

A receita completa só é gerada quando o usuário clica em:

> Ver lista de compras

ou

> Desbloquear receita

Dentro do Caderno.

Nesse momento o app gera e salva:

- ingredientes com quantidade;
- lista de compras;
- modo de preparo;
- passo a passo;
- dicas;
- dados offline.

### Uso de IA

A IA deve ser usada para:

- criar cards;
- adaptar receitas;
- gerar lista de compras;
- montar passo a passo;
- criar dicas úteis;
- responder dúvidas por texto;
- responder dúvidas por voz;
- adaptar substituições.

Mas deve sempre respeitar o contexto da receita salva.

### Segurança das receitas

O app deve evitar receitas perigosas ou mal explicadas.

As receitas devem ter:

- tempos claros;
- temperaturas claras;
- ponto de cozimento claro;
- alertas simples quando necessário;
- cuidados com carne, frango, peixe e ovos;
- aviso para alergênicos quando fizer sentido.

Exemplo:

> Cozinhe o frango até não ficar rosado por dentro.

### Preferências do usuário

O app deve permitir salvar preferências como:

- vegetariano;
- vegano;
- sem lactose;
- sem glúten;
- baixo carboidrato;
- econômico;
- iniciante;
- cozinha rápida;
- restrições alimentares.

Essas preferências devem influenciar cards, receitas e dicas.

### Imagens das receitas

Na primeira fase, as imagens podem vir de:

- banco de imagens;
- imagens genéricas por categoria;
- imagens já existentes no app.

Geração de imagem por IA pode ficar para fase futura.

### Regra de custo

O app deve evitar gastar IA sem necessidade.

Por isso:

- card é leve;
- receita completa só gera no desbloqueio;
- cache é consultado antes;
- bônus mensal deve priorizar receita pronta/cache;
- chat e voz só funcionam com direito ativo.

---

## 9. Regras técnicas, dados, estados do usuário e permissões

### Regra geral

O app deve controlar claramente o que cada usuário pode acessar.

Estados principais:

1. usuário grátis;
2. usuário com bônus mensal;
3. usuário com boas-vindas ativa;
4. usuário com pacote Chef;
5. usuário com pacote OkCheff;
6. usuário Premium Chef;
7. usuário Premium OkCheff;
8. usuário com pacote expirado;
9. usuário com Premium cancelado/expirado.

### Dados do usuário

O app deve salvar:

- nome;
- e-mail/login;
- idioma;
- preferências alimentares;
- restrições;
- buscas grátis usadas no dia;
- data do último reset;
- plano atual;
- pacotes ativos;
- receitas desbloqueadas;
- eventos;
- histórico básico de uso.

### Dados das receitas

Cada receita deve ter dois níveis.

#### Card / ideia salva

Salva:

- imagem;
- título;
- descrição curta;
- tempo;
- porções;
- dificuldade;
- ingredientes sem quantidade;
- origem da busca;
- data em que foi salva.

#### Receita completa

Salva:

- tudo do card;
- ingredientes com quantidade;
- lista de compras;
- modo de preparo;
- passo a passo;
- dicas distribuídas;
- dica final;
- data de desbloqueio;
- tipo de desbloqueio;
- se tem Chef texto ativo;
- se tem OkCheff voz ativo;
- dados offline.

### Estados da receita

Uma receita pode estar como:

1. **Ideia salva**
2. **Completa**
3. **Completa com Chef ativo**
4. **Completa com OkCheff ativo**
5. **Completa com Chef expirado**
6. **Reservada para evento**
7. **Já feita**

Importante:

> A receita completa nunca volta a ser bloqueada.

Só a ajuda do Chef pode expirar.

### Dados dos eventos

Cada evento deve salvar:

- nome;
- data;
- horário opcional;
- receita associada;
- tipo de reserva;
- lembrete de compra;
- lembrete de preparo;
- observações;
- status do evento.

Tipos de reserva:

- sem Chef;
- Chef por texto;
- OkCheff por voz.

### Controle de acesso

O app deve verificar acesso antes de liberar:

- desbloqueio de receita;
- Chef por texto;
- OkCheff por voz;
- reserva de evento;
- remoção de anúncios.

A verificação deve considerar:

- bônus mensal;
- boas-vindas ativa;
- pacote avulso ativo;
- Premium ativo;
- reserva de evento.

### Reset diário

As buscas grátis resetam todos os dias às:

> 00:00 no horário local do usuário.

Após reset:

- buscas usadas voltam para zero;
- usuário grátis volta a ter 10 pesquisas.

### Reset mensal

O Premium renova mensalmente.

Na renovação:

- libera novamente 20 receitas;
- zera receitas usadas no ciclo anterior;
- não acumula saldo antigo.

O bônus mensal também deve ser liberado no novo mês, como campanha/bônus controlado pelo app.

### Permissões do Android

O app pode precisar pedir permissões para:

- microfone, para Voz OkCheff;
- câmera, para busca por foto da geladeira/despensa no Premium;
- notificações, para lembretes/timers;
- internet;
- armazenamento/cache local, se necessário para offline.

Regra:

> Pedir permissão apenas quando o usuário for usar a função.

Exemplo:

- pedir microfone só quando ativar OkCheff;
- pedir câmera só quando o usuário escolher buscar receita por foto;
- pedir notificação só quando criar lembrete/timer.

### Offline

O app deve salvar localmente receitas completas desbloqueadas.

Offline deve funcionar:

- abrir receita completa;
- ver ingredientes;
- ver lista de compras;
- marcar itens comprados;
- seguir passo a passo;
- voltar/próximo passo;
- ver dicas salvas.

Offline não deve funcionar:

- gerar nova receita;
- desbloquear receita nova;
- usar Chef por texto;
- usar OkCheff por voz;
- criar resposta nova de IA.

### Sincronização

Quando voltar a internet, o app deve sincronizar:

- receitas desbloqueadas;
- itens marcados na lista;
- receitas feitas;
- eventos;
- preferências;
- histórico básico.

### Regra contra perda de dados

O usuário não pode perder:

- receitas completas;
- eventos;
- listas;
- histórico importante;
- receitas reservadas.

Mesmo se trocar de celular, ao logar novamente o conteúdo deve voltar.

---

## 10. Telas, componentes e fluxo do usuário

### Fluxo principal do usuário

O fluxo principal do OkCheff deve ser:

1. usuário entra no app;
2. pesquisa por ingredientes ou inspiração;
3. recebe 3 cards;
4. salva uma ideia no Caderno;
5. entra no Caderno;
6. desbloqueia a receita completa;
7. vê lista de compras;
8. cozinha passo a passo;
9. usa Chef por texto ou OkCheff por voz, se tiver direito ativo.

### Tela inicial / Descobrir

A tela inicial deve mostrar:

- saudação com nome do usuário;
- abas **Na Geladeira** e **Inspiração**;
- campo para ingredientes;
- botão Premium para buscar por foto da geladeira/despensa;
- sugestões rápidas;
- botão para gerar cards;
- contador de buscas grátis do dia.

Exemplo:

> Você ainda tem 8 buscas grátis hoje.

### Aba Na Geladeira

Serve para o usuário informar o que tem em casa.

Campos:

- ingredientes disponíveis;
- preferência opcional;
- tipo de refeição opcional.

Exemplo:

> Tenho frango, arroz e cenoura.

O app retorna 3 cards possíveis.

### Aba Inspiração

Serve para o usuário escolher ideias prontas.

Categorias possíveis:

- receita rápida;
- almoço em família;
- jantar romântico;
- Dia dos Pais;
- marmita;
- sobremesa;
- café da manhã;
- vegetariana;
- econômica;
- saudável.

O app retorna 3 cards.

### Tela de resultados

Mostra os cards gerados.

Cada card tem:

- imagem;
- nome;
- descrição curta;
- tempo;
- porções;
- dificuldade;
- ingredientes sem quantidade;
- botão **Salvar no Caderno**.

Botões extras:

- **Gerar novas ideias**;
- **Ver Caderno**.

### Tela Caderno

O Caderno deve ser organizado em 3 abas:

1. **Ideias salvas**
2. **Receitas completas**
3. **Eventos**

### Tela Ideias salvas

Mostra cards ainda não desbloqueados.

Cada card tem:

- dados básicos;
- ingredientes sem quantidade;
- botão **Ver lista de compras**;
- botão **Remover**.

Ao clicar em **Ver lista de compras**, o app tenta desbloquear a receita.

### Tela Receitas completas

Mostra receitas já desbloqueadas.

Cada receita tem:

- imagem;
- nome;
- ingredientes completos;
- lista de compras;
- modo de preparo;
- botão **Cozinhar agora**;
- botão **Tenho uma dúvida**;
- botão **Ativar OkCheff**, se disponível;
- botão **Adicionar a evento**.

### Tela Lista de compras

Deve mostrar:

- ingredientes com quantidade;
- checkbox para marcar comprado;
- dica de substituição;
- botão **Tenho uma dúvida**;
- botão **Ativar OkCheff**, se disponível.

### Tela Cozinhar agora

Tela guiada, uma etapa por vez.

Deve mostrar:

- nome da receita;
- progresso da receita;
- etapa atual;
- dica da etapa;
- botão **Próximo passo**;
- botão **Voltar**;
- botão **Repetir**;
- botão **Ver ingredientes**;
- botão **Tenho uma dúvida**;
- botão **Ativar OkCheff**.

### Tela Chef Chat

Se estiver dentro de uma receita:

> Abre o chat daquela receita.

Se estiver fora de uma receita:

> Pergunta sobre qual receita o usuário quer falar.

Mostra receitas disponíveis no Caderno.

### Tela Voz OkCheff

A voz deve ser ativada dentro de uma receita.

Estados da voz:

- aguardando comando;
- ouvindo;
- respondendo;
- timer ativo;
- erro de permissão;
- sem internet;
- pacote indisponível.

Mensagem simples:

> Diga “OkCheff” para começar.

### Tela Eventos

Mostra eventos criados.

Cada evento tem:

- nome;
- data;
- receita associada;
- tipo de ajuda reservada;
- lembretes;
- botão **Ver receita**;
- botão **Cozinhar agora**;
- botão **Reservar Chef**;
- botão **Reservar OkCheff**.

### Tela Perfil

Deve mostrar:

- nome;
- e-mail;
- plano atual;
- buscas grátis restantes;
- receitas disponíveis no pacote;
- status Premium;
- preferências alimentares;
- botão **Como funciona**;
- botão **Comprar pacote / Premium**;
- sair da conta.

### Tela Premium / Comprar

Deve ter duas seções:

1. **Pacotes avulsos**
2. **Premium**

Sem linguagem de crédito.

Usar linguagem:

- receitas com Chef;
- receitas com OkCheff;
- cozinhar por voz;
- sem anúncios.

---

## 11. Mensagens do app, botões e comunicação com o usuário

### Tom de voz do OkCheff

O app deve falar de forma:

- simples;
- amigável;
- prática;
- sem termos técnicos;
- sem parecer robô;
- sem linguagem de “créditos”.

O usuário deve sentir:

> O Chef está me ajudando.

### Linguagem proibida

Evitar termos como:

- créditos;
- saldo técnico;
- tokens;
- consumo de IA;
- limite de API;
- pacote de requisições.

Usar termos como:

- receitas disponíveis;
- cozinhar com Chef;
- cozinhar com OkCheff;
- receita completa;
- ajuda por texto;
- ajuda por voz;
- bônus do mês.

### Botões principais

#### Busca

- **Gerar ideias**;
- **Buscar receitas**;
- **Ver mais ideias**;
- **Salvar no Caderno**.

#### Caderno

- **Ver lista de compras**;
- **Desbloquear receita**;
- **Cozinhar agora**;
- **Tenho uma dúvida**;
- **Ativar OkCheff**;
- **Adicionar a evento**.

#### Compra

- **Comprar pacote Chef**;
- **Comprar pacote OkCheff**;
- **Assinar Premium Chef**;
- **Assinar Premium OkCheff**.

### Mensagens de busca grátis

Quando ainda tem buscas:

> Você ainda tem 8 buscas grátis hoje.

Quando acabou:

> Você usou suas buscas grátis de hoje. Amanhã elas renovam.

Quando resetar:

> Suas buscas grátis foram renovadas.

### Mensagem para salvar card

Depois de salvar:

> Receita salva no seu Caderno.

Se já estiver salva:

> Essa receita já está no seu Caderno.

### Mensagem para desbloquear receita

Se tem direito disponível:

> Pronto! Sua receita completa foi salva no Caderno.

Se não tem direito:

> Para ver lista de compras, preparo e passo a passo, escolha um pacote ou assine Premium.

### Mensagem para receita completa

> Essa receita é sua. Ela fica salva no Caderno e você pode consultar quando quiser.

### Mensagem para Chef por texto

Se disponível:

> Pode perguntar. Estou aqui para te ajudar com esta receita.

Se não disponível:

> Para conversar com o Chef nesta receita, escolha um pacote Chef ou assine Premium.

### Mensagem para Voz OkCheff

Se disponível:

> Diga “OkCheff” para começar.

Se não disponível:

> Para cozinhar por voz, escolha um pacote OkCheff ou assine Premium OkCheff.

Sem permissão de microfone:

> Para usar a voz, permita o acesso ao microfone.

Sem internet:

> A voz precisa de internet para responder. Você ainda pode seguir o passo a passo offline.

### Mensagem para evento

Evento criado:

> Evento salvo. Sua receita ficou reservada para essa data.

Evento com Chef reservado:

> Chef reservado para este evento.

Evento com OkCheff reservado:

> OkCheff reservado para este evento.

Lembrete no dia:

> Hoje é o dia do seu evento. Sua receita está pronta no Caderno.

### Mensagem quando pacote vence

> Seu pacote venceu, mas suas receitas completas continuam salvas no Caderno.

### Mensagem quando Premium vence

> Seu Premium terminou, mas suas receitas completas continuam salvas.

### Mensagem para bônus do mês

> Você ganhou um bônus do mês: uma receita completa especial.

Botão:

> Ver receita bônus

### Mensagem de boas-vindas

> Você ganhou uma experiência grátis com OkCheff por voz. Escolha uma receita e cozinhe com o Chef por 7 dias.

Botão:

> Escolher minha receita grátis

### Mensagem da página Como funciona

Texto curto de entrada:

> O OkCheff te ajuda a encontrar receitas, salvar ideias no Caderno e cozinhar com ajuda do Chef por texto ou voz.

---

## 12. Regras finais e checklist antes da execução

### Regra principal do projeto

O OkCheff **não será reconstruído do zero**.

O app já existe na Onspace.

A próxima fase será:

> Ajustar o app atual para seguir este novo PRD/EPR.

### Ordem correta de execução futura

Quando chegar a hora de mandar para Onspace/Codex, a execução deve ser feita assim:

1. revisar telas atuais;
2. comparar com o PRD/EPR;
3. ajustar uma parte por vez;
4. testar;
5. só depois avançar.

Nada de pedir para o agente “refazer tudo”.

### Prioridade de construção

A ordem recomendada é:

1. ajustar modelo grátis;
2. ajustar cards;
3. ajustar Caderno;
4. ajustar desbloqueio de receita;
5. ajustar receita completa;
6. ajustar lista de compras;
7. ajustar passo a passo;
8. ajustar Chef Chat vinculado à receita;
9. ajustar Voz OkCheff vinculada à receita;
10. ajustar Eventos;
11. ajustar pacotes/Premium;
12. ajustar anúncios;
13. ajustar página Como funciona.

### O que precisa estar fechado antes dos prompts

Já está fechado:

- grátis com 10 buscas/dia;
- reset às 00:00 local;
- 3 cards por busca;
- card com ingredientes sem quantidade;
- salvar ideias no Caderno;
- receita completa só desbloqueia no Caderno;
- receita completa nunca expira;
- Chef/voz podem expirar;
- chat sempre vinculado à receita;
- voz sempre vinculada à receita;
- evento reservado pode ser usado antes;
- pagamento Android via Google Play Billing;
- preços ficam para depois;
- página Como funciona entra no app.

### O que ainda pode ficar para depois

Não precisa travar agora:

- valores dos pacotes;
- nomes comerciais finais dos planos;
- imagem gerada por IA;
- versão iPhone;
- versão web;
- campanhas específicas de bônus mensal;
- detalhes visuais finos.

### Checklist antes de gerar prompts

Antes de mandar qualquer prompt para agente, confirmar:

- o app atual está conectado ao GitHub;
- sabemos qual branch será usada;
- sabemos se será Onspace ou Codex;
- Supabase atual está acessível;
- login já funciona;
- banco atual tem ou não tabelas de receitas;
- app já tem sistema de anúncios ou ainda não;
- app já tem Google Play Billing ou ainda não;
- voz atual é só TTS ou já tem reconhecimento de fala.

### Regra para prompts futuros

Quando formos gerar prompts, será sempre:

> Um prompt por etapa.

Formato:

1. objetivo da etapa;
2. o que pode alterar;
3. o que não pode alterar;
4. regra de segurança;
5. teste esperado;
6. pedir plano antes de executar, se necessário.

---

## 13. Próxima etapa após este documento

Depois deste PRD/EPR consolidado, a próxima etapa é iniciar os prompts de execução.

A primeira etapa recomendada é:

> Auditoria do app atual no Codex/Onspace antes de qualquer alteração.

Objetivo da auditoria:

- entender o que já existe;
- identificar telas e arquivos principais;
- verificar banco/Supabase;
- verificar voz atual;
- verificar login;
- verificar cards;
- verificar Caderno;
- verificar Eventos;
- verificar anúncios;
- verificar pagamentos;
- gerar plano de execução sem alterar nada.

Regra:

> Primeiro analisar. Depois propor plano. Só executar após aprovação.



---

## Atualização — Receita por foto do prato pronto

Além da foto da geladeira/despensa, o Premium também deve incluir o recurso de **Receita por foto do prato pronto**.

### Objetivo

Permitir que o usuário tire foto de um prato que viu em restaurante, viagem, internet ou casa de outra pessoa e peça ao OkCheff uma receita parecida.

### Regra principal

O app não deve prometer descobrir a receita original exata do restaurante. A comunicação correta deve ser:

> Receita inspirada no prato da foto.

ou:

> Vou criar uma versão parecida para você preparar em casa.

### Como funciona

1. O usuário tira ou envia uma foto do prato pronto.
2. A IA analisa a imagem.
3. O app identifica o tipo provável de prato.
4. Quando possível, pode comparar com receitas conhecidas, banco interno/cache ou referências públicas.
5. O app sugere ingredientes prováveis.
6. O app pode oferecer opções de proteína/carne quando fizer sentido.
7. O usuário confirma ou ajusta.
8. O app gera cards ou receita completa, conforme o plano/direito ativo.

### Exemplo de uso

O usuário envia a foto de um prato de carne com molho e pimentões.

O app pode responder:

> Parece um ensopado de cordeiro irlandês com legumes e molho encorpado. Posso criar uma versão inspirada nesse prato para você fazer em casa.

### Opções de carne/proteína

Quando identificar um prato com carne, o app pode sugerir alternativas, por exemplo:

- cordeiro;
- carne bovina;
- frango;
- porco;
- peixe;
- cogumelos ou proteína vegetal, quando fizer sentido.

Exemplo:

> A versão mais parecida seria com cordeiro, mas também posso adaptar para carne bovina se for mais fácil encontrar.

### Disponibilidade por plano

Este recurso deve estar disponível no:

- Premium Chef;
- Premium OkCheff.

No Premium Chef, o usuário usa foto + ajuda por texto.

No Premium OkCheff, o usuário usa foto + texto + voz.

### Permissões

O app deve pedir permissão de câmera apenas quando o usuário usar esse recurso.

### Cuidado de comunicação

Evitar frases como:

> Esta é a receita original.

Usar frases como:

> Receita inspirada na imagem.
> Receita parecida com o prato da foto.
> Versão caseira baseada no que aparece na foto.
