**Mesclar Pools de Dado** é um **nó do tipo modificador** utilizado para unir duas **pools numéricas de entrada** em uma única **pool de saída**. Ele realiza a mesclagem dos valores de ambas as pools, mantendo as múltiplas rolagens simultâneas em um único agrupamento. Permitindo representar situações em que diferentes tipos de dado devem ser tratados como um único conjunto.

- **Tipo:** Modificador (nó intermediário)
- **Função:** Mescla os valores de duas pools numéricas em uma única pool
- **Saída:** Pool numérica

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
- **Padrão:** Mesclar Pools de Dado
- **Função:** Nome exibido no quadro de modelagem

---

## **Exemplo de Uso**

**Cenário:** Em um sistema de ataque, o jogador rola **2d6** de dano físico e **1d8** de dano mágico. Para aplicar efeitos de soma dos valores, as duas pools precisam ser unificadas.

### **1. Propriedades dos Geradores de Dado:**

- Dado A: Mínimo `1`, Máximo `6`
- Dado B: Mínimo `1`, Máximo `8`

### **2. Propriedades das Pools de Dado:**

- Pool A: Quantidade `2`
- Pool B: Quantidade `1`

### **3. Conexões:**

- Conecte o **Dado A** ao **Pool A**
- Conecte o **Dado B** ao **Pool B**
- Conecte **Pool A** ao **Mesclar Pools de Dado**
- Conecte **Pool B** ao **Mesclar Pools de Dado**
- Conecte o **Mesclar Pools de Dado** ao nó **Pool Soma de Dado**
- Conecte o **Pool Soma de Dado** ao nó **Histograma**

<img src="/node-crafter/doc-images/merge-dice-pools.png" alt="Exemplo de uso do nó Mesclar Pools de Dado" width="500px"/>

---

## **Notas**

- Ideal para **agrupar rolagens simultâneas de diferentes tipos de dado** em uma única pool.
- Permite que operações e modificadores sejam aplicados de forma unificada sobre pools distintas.
- Funciona apenas com **entradas do tipo pool numérica**.
