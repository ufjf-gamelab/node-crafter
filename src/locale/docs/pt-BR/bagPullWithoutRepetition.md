**Sacar Bolsa Sem Repetição** é um **nó do tipo modificador** utilizado para simular sorteios em que **cada símbolo pode ser retirado apenas uma vez por jogada**. Inspirado no conceito de uma bolsa de onde são retiradas bolas ou fichas e os elementos **não retornam** para a bolsa após serem sorteados. A saída é uma **pool simbólica**, contendo os elementos sorteados em ordem de retirada.

- **Tipo:** Modificador (nó intermediário)
- **Função:** Sorteia símbolos sem reposição de um gerador simbólico
- **Saída:** Pool simbólica (lista de símbolos retirados em ordem)

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
- **Padrão:** Sacar Bolsa Sem Repetição
- **Função:** Nome exibido no quadro de modelagem

### **Quantidade de saques**

- **Tipo:** Inteiro
- **Padrão:** `2`
- **Função:** Define quantos símbolos serão retirados da bolsa por jogada

---

## **Exemplo de Uso**

**Cenário:** Em um jogo de sorte, o jogador retira **3 fichas de uma bolsa** contendo `"Fogo"`, `"Água"`, `"Terra"` e `"Ar"`. Os símbolos são sorteados **sem reposição**, ou seja, não podem ser repetidos na mesma jogada.

### **1. Propriedades do Gerador Simbólico:**

- Faces: `"Fogo"`, `"Água"`, `"Terra"`, `"Ar"`

### **2. Propriedades do Sacar Bolsa Sem Repetição:**

- Quantidade de saques: `3`

### **3. Conexões:**

- Conecte o **Gerador Simbólico** ao nó **Sacar Bolsa Sem Repetição**
- Conecte o **Sacar Bolsa Sem Repetição** ao nó **Histograma** ou a outro nó de análise

<img src="/node-crafter/doc-images/bag-pull-without-repetition.png" alt="Exemplo de uso do nó Sacar Bolsa Sem Repetição" width="500px"/>

---

## **Notas**

- Ideal para representar sorteios **sem reposição**, como puxar cartas, fichas ou elementos únicos.
- Garante que **nenhum símbolo se repita na mesma jogada**.
- Funciona apenas com entrada do tipo **gerador simbólico**.
- A ordem dos símbolos sorteados é **mantida na pool de saída**.
