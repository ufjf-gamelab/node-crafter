**Dado Entre Intervalo** é um **nó do tipo modificador** responsável por verificar se os valores de entrada estão dentro de um intervalo definido (inclusive nos limites). Ele é útil para representar condições que exigem que um valor esteja entre dois limites para ser considerado um sucesso.

- **Tipo:** Modificador (nó intermediário)
- **Função:** Verifica se o valor está entre dois limites definidos
- **Saída:** Verdadeiro (sucesso) se dentro do intervalo, Falso (falha) se fora

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
- **Padrão:** Dado Entre Intervalo
- **Função:** Nome exibido no quadro de modelagem

### **Valor Mínimo**

- **Tipo:** Inteiro
- **Padrão:** `1`
- **Função:** Limite inferior do intervalo (inclusive)

### **Valor Máximo**

- **Tipo:** Inteiro
- **Padrão:** `2`
- **Função:** Limite superior do intervalo (inclusive)

---

## **Exemplo de Uso**

**Cenário:** Simular um teste de resistência em que o valor só é considerado sucesso se estiver entre `3` e `5`, inclusive.

### **1. Propriedades do Gerador de Dado:**

- Valor Mínimo: `1`
- Valor Máximo: `6`

### **2. Propriedades do Dado Entre Intervalo:**

- Valor Mínimo: `3`
- Valor Máximo: `5`

### **3. Conexão com outros nós:**

- Conecte **Gerador de Dado** ao nó **Dado Entre Intervalo**
- Conecte **Dado Entre Intervalo** ao nó **Histograma**

<img src="/node-crafter/doc-images/dice-between-interval.png" width="500px" alt="Exemplo de uso do Dado Entre Intervalo"/>

---

## **Notas**

- Útil para representar testes de faixa, como condições específicas de sucesso ou falha em jogos.
- Pode ser combinado com outros modificadores do tipo lógico como OR (ou) e AND (e) para construir regras mais complexas.
