**Matemático** é um **nó do tipo modificador** utilizado para realizar operações matemáticas entre dois conjuntos de dados numéricos. As operações disponíveis incluem adição, subtração, multiplicação e divisões com arredondamento para baixo (piso) ou para cima (teto). É útil para representar modificadores, bônus, penalidades ou cálculos entre resultados distintos em jogos.

- **Tipo:** Modificador (nó intermediário)
- **Função:** Aplica uma operação matemática entre dois valores de entrada
- **Saída:** Resultado da operação matemática para cada execução

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
- **Padrão:** Matemática
- **Função:** Nome exibido no quadro de modelagem

### **Operação**

- **Tipo:** `Adição` | `Subtração` | `Multiplicação` | `Divisão (piso)` | `Divisão (teto)`
- **Padrão:** `Adição`
- **Função:** Define a operação matemática aplicada entre os dois valores

---

## **Exemplo de Uso**

**Cenário:** Simular o dano final causado por um jogador que rola um **1d6** de dano base, somado com 1d3 de bonus do modificador de força.

### **1. Propriedades dos nós Geradores de Dados:**

- Gerador de Dado do dano base: Valor Mínimo `1`, Valor Máximo `6`
- Gerador de Dado do bonus de força: Valor Mínimo `1`, Valor Máximo `3`

### **2. Propriedades do nó Matemático:**

- Operação: `Adição`

### **3. Conexão com outros nós:**

- Conecte **Gerador de Dado do dano base** ao nó **Matemático**
- Conecte **Gerador de Dado do bonus de força** ao nó **Matemático**
- Conecte **Matemático** ao nó **Histograma**

<img src="/node-crafter/doc-images/math.png" width="500px" alt="Exemplo de uso do nó Matemático"/>

---

## **Notas**

- Ideal para representar modificadores aplicados sobre resultados de rolagem ou cálculos entre diferentes fontes.
- O operador de **Divisão (piso)** realiza a divisão normal com arredondamento para baixo. Já o **Divisão (teto)** arredonda o resultado para cima.
