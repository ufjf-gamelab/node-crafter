# **Selecionar Maior Dado**

**Selecionar Maior Dado** é um **nó do tipo modificador** utilizado para transformar uma **pool numérica** em uma **lista simples contendo apenas o maior valor de cada jogada**. Sua principal função é filtrar a pool e manter apenas o maior resultado em cada simulação, sendo útil em situações onde se deseja considerar apenas o melhor valor entre múltiplas rolagens.

- **Tipo:** Modificador (nó intermediário)
- **Função:** Seleciona o maior valor de uma pool numérica em cada jogada
- **Saída:** Lista simples de valores numéricos

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
- **Padrão:** Selecionar Maior Dado
- **Função:** Nome exibido no quadro de modelagem

---

## **Exemplo de Uso**

**Cenário:** Em um teste de habilidade, um jogador rola **3 dados de seis faces (3d6)** e o **maior valor** entre eles é utilizado para verificar se houve sucesso (≥ 4).

### **1. Propriedades do nó Gerador de Dado:**

- Valor Mínimo: `1`
- Valor Máximo: `6`

### **2. Propriedades do nó Pool de Dado:**

- Quantidade: `3`

### **3. Propriedades do nó Dado Sucesso:**

- Sucesso se maior ou igual a: `4`

### **4. Conexões:**

- Conecte o **Gerador de Dado** ao nó **Pool de Dado**
- Conecte o **Pool de Dado** ao nó **Selecionar Maior Dado**
- Conecte o **Selecionar Maior Dado** ao nó **Dado Sucesso**
- Conecte o **Dado Sucesso** ao nó **Histograma**

<img src="/node-crafter/doc-images/select-highest-dice.png" alt="Exemplo de uso do nó Selecionar Maior Dado" width="500px"/>

---

## **Notas**

- Ideal para situações em que apenas o **melhor resultado** entre múltiplas rolagens deve ser considerado.
- Frequentemente utilizado em sistemas com **mecânicas de vantagem**, acertos críticos ou efeitos similares.
- Pode ser combinado com o **Pool de Dado** e qualquer nó que produza uma pool numérica.
