**OR Lógico** é um **nó do tipo modificador** utilizado para realizar a operação lógica **OU** entre dois valores binários (verdadeiro ou falso). Ele retorna verdadeiro se pelo menos uma das entradas for verdadeira, e falso apenas quando ambas forem falsas.

- **Tipo:** Modificador (nó intermediário)
- **Função:** Aplica a operação lógica OR (OU)
- **Saída:** Valor binário (verdadeiro ou falso)

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
- **Padrão:** OR Lógico
- **Função:** Nome exibido no quadro de modelagem

---

## **Exemplo de Uso**

**Cenário:** Verificar se um jogador teve sucesso em **pelo menos uma** das duas condições rolando 2d10:

- Ter rolado um valor par
- Ter atingido a meta de sucesso (por exemplo, rolar um número maior ou igual a `8`)

### **1. Propriedades do Gerador de Dado:**

- Valor Mínimo `1`
- Valor Máximo `10`

### **2. Propriedades do Dado Sucesso:**

- Sucesso igual ou maior que: `8`

### **2. Conexões:**

- Conecte o **Dado gerador** ao **Dado Sucesso**
- Conecte o **Dado gerador** ao **Dado é Par**
- Conecte o **Dado Sucesso** ao **OR Lógico**
- Conecte o **Dado é Par** ao **OR Lógico**
- Conecte o **OR Lógico** ao **Histograma**

<img src="/node-crafter/doc-images/or-logical.png" alt="Exemplo de uso do nó OR Lógico"/>

---

## **Notas**

- Ideal para criar condições compostas em que **basta uma das condições ser verdadeira**.
- Funciona exclusivamente com entradas binárias (verdadeiro/falso).
- Pode ser combinado com nós como **Dado Sucesso**, **Comparação Lógica de Dado**, **Dado entre intervalo** para criar lógicas mais complexas.
