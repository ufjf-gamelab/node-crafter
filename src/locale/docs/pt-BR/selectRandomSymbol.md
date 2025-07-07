**Selecionar Símbolo Aleatório** é um **nó do tipo modificador** utilizado para transformar uma **Pool Simbólica** (composta por valores de texto) em uma **lista simples contendo apenas um valor por jogada**, selecionado de forma aleatória. Sua principal função é filtrar os múltiplos valores contidos em uma pool simbólica para um único valor representativo por jogada, mantendo o fator aleatório.

- **Tipo:** Modificador (nó intermediário)
- **Função:** Seleciona aleatoriamente um valor por jogada dentro de uma pool simbólica
- **Saída:** Lista simples de valores simbólicos

---

## **Propriedades**

### **ID do Nó**

- **Tipo:** Texto
- **Padrão:** ID aleatório
- **Função:** Identificador único do nó

### **Status**

- **Tipo:** `Finalizado` | `Ocioso` | `Erro` | `Carregando` | `Faltando dados`
- **Padrão:** `Ocioso`
- **Função:** Indica o estado atual do nó

### **Nome**

- **Tipo:** Texto
- **Padrão:** Selecionar Símbolo Aleatório
- **Função:** Nome exibido no quadro de modelagem

---

## **Exemplo de Uso**

**Cenário:** Em um jogo de cartas, um jogador recebe 3 cartas aleatórias de uma pilha simbólica contendo "Espada", "Escudo" e "Poção". Para cada jogada, apenas **um dos símbolos** será selecionado aleatoriamente como ação principal.

### **1. Propriedades do nó Gerador Simbólico:**

- Valores possíveis: `"Espada"`, `"Escudo"`, `"Poção"`

### **2. Propriedades do nó Pool Simbólica:**

- Quantidade: `3`

### **3. Conexões:**

- Conecte o **Gerador Simbólico** ao nó **Pool Simbólica**
- Conecte o **Pool Simbólica** ao nó **Selecionar Símbolo Aleatório**
- Conecte o **Selecionar Símbolo Aleatório** ao nó **Histograma**

<img src="/node-crafter/doc-images/select-random-symbol.png" alt="Exemplo de uso do nó Selecionar Símbolo Aleatório" width="500px"/>

---

## **Notas**

- Ideal para situações onde múltiplos elementos simbólicos são gerados em uma **pool**, mas apenas **um deve ser escolhido aleatoriamente**.
- Pode ser usado para representar efeitos como "escolher uma carta", "selecionar uma ação aleatória", ou "pegar um item da mochila".
- Funciona apenas com entradas do tipo **Pool Simbólica**.
- É uma forma de transformar uma pool simbólica em uma lista simples, permitindo o uso com nós que **não suportam entrada do tipo pool**.
