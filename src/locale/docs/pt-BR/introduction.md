Olá! Bem-vindo ao **Node Crafter**, uma ferramenta visual para modelagem de regras de jogos, desenvolvida com o objetivo de auxiliar na criação e balanceamento de jogos com elementos probabilísticos — especialmente aqueles que utilizam **rolagens de dados**.  
Inspirado por ferramentas como o **[McDie](https://gengelstein.itch.io/mcdie)** e o **[AnyDice](https://anydice.com/)**, o Node Crafter oferece uma **interface visual e intuitiva**, onde você pode construir regras de jogo por meio de **nós e conexões**, simulando seus comportamentos e observando os efeitos através de **gráficos e estatísticas**.

---

## Como funciona o sistema

- No **canto esquerdo da tela**, estão listados todos os **nós disponíveis**.
- Ao clicar em uma das opções, o nó é adicionado ao centro do quadro.
- Selecionando um nó, suas **propriedades** serão exibidas no **canto direito**, podendo ser customizadas conforme a modelagem desejada.
- Na parte **inferior central da tela**, está localizada a **barra de tarefas**, onde você pode iniciar a simulação e visualizar os **resultados** obtidos com base na modelagem realizada no quadro.

---

## Estrutura básica de uma modelagem

Toda modelagem deve começar com um **nó gerador** — podendo ser do tipo **Gerador de Dado** ou **Gerador Simbólico**.  
A partir dele, você pode utilizar **nós modificadores** para alterar os valores conforme as regras que deseja implementar.  
No final do fluxo, o uso do **nó Histograma** é obrigatório, pois ele é responsável por **exibir graficamente** os resultados da simulação.

---

## Exemplo prático: ataque com vantagem no D&D

Para ilustrar o uso do sistema, foi escolhida a modelagem de uma situação clássica do RPG **[Dungeons & Dragons](https://wikipedia.org/wiki/Dungeons_%26_Dragons)**: a realização de um **ataque com vantagem**, com **bônus fixo** e verificação de **acerto crítico**.

Segundo as regras do D&D 5ª Edição:

- Um ataque com vantagem permite rolar **dois dados d20** e considerar o **maior resultado**;
- A esse valor é adicionado um **bônus fixo de ataque** (neste exemplo, +4);
- Se o total for igual ou superior à **classe de armadura (CA)** do alvo (definida como **15** neste exemplo), o ataque é considerado bem-sucedido;
- Um **acerto crítico** ocorre se **qualquer uma das rolagens** resultar em um **20 natural**.

### Como modelar isso no Node Crafter:

1. Crie um nó **Gerador de Dado** configurado como um **d20**;
2. Conecte-o a um nó **Pool de Dados**, representando as duas rolagens simultâneas;
3. Conecte o **Pool de Dados** a um nó **Selecionar Maior Dado**, que filtra o valor mais alto;
4. A partir desse resultado, crie dois fluxos paralelos:
   - **Primeiro fluxo:**
     - Some **+4** usando os nós **Matemático** e **Inteiro**;
     - Avalie o total com um **nó de Sucesso**, verificando se o valor é **≥ 15**;
   - **Segundo fluxo:**
     - Compare o valor original com **20** usando um **nó de Comparação Lógica** com a operação de **igualdade**, identificando o **acerto crítico**.

<img src="/node-crafter/doc-images/dnd-model.png" width="100%" alt="Exemplo da modelagem descrita"/>

---

## Agradecimento

Agradecemos por utilizar o **Node Crafter**!  
Se possível, contribua respondendo ao **[questionário](https://forms.gle/sUBEc2Pwr3dAd5MT9)** que faz parte desta pesquisa.  
Sua participação é essencial para o aprimoramento do sistema.
