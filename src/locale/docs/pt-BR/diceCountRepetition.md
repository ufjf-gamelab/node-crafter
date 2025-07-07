**Contar Repetição de Dado** é um **nó do tipo modificador** utilizado para contar quantas vezes um valor específico (face) aparece entre os resultados gerados por um **Gerador de Dado**. Ele é útil para representar mecânicas baseadas em frequência de resultados, como acertos múltiplos em rolagens.

- **Tipo:** Modificador (nó intermediário)
- **Função:** Conta a quantidade de vezes que uma face específica aparece nos resultados
- **Saída:** Número de repetições da face desejada em cada execução

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
- **Padrão:** Contar Repetição de Dado
- **Função:** Nome exibido no quadro de modelagem

### **Face**

- **Tipo:** Inteiro
- **Padrão:** `1`
- **Função:** Valor que será contado entre os resultados das rolagens

---

## **Exemplo de Uso**

**Cenário:** Simular o acerto critico de um jogador que ataca com **2d20** e o valor `20` representa um acerto crítico.

### **1. Propriedades dos Geradores de Dados:**

- Gerador de Dado A: Valor Mínimo `1`, Valor Máximo `20`
- Gerador de Dado B: Valor Mínimo `1`, Valor Máximo `20`

### **2. Propriedades do Contar Repetição de Dado:**

- Face: `20`

### **3. Conexão com outros nós:**

- Conecte **Dado de Dado A** ao nó **Pool de Dado**
- Conecte **Dado de Dado B** ao nó **Pool de Dado**
- Conecte **Pool de Dado** ao nó **Histograma**

<img src="/node-crafter/doc-images/critical-count.png" width="500px" alt="Exemplo de uso do Contar Repetição de Dado"/>

---

## **Notas**

- Ideal para representar sistemas de jogo que exigem a contagem de acertos específicos.
- Pode ser combinado com o nó **Pool de Dado** para agrupar rolagens simultâneas e criar condições complexas de sucesso.
- Quando utilizado em conjunto com o **Pool de Dado**, a contagem leva em consideração quantas vezes a face escolhida aparece em cada iteração. Ou seja, se uma pool de 2 dados resultar em ambos mostrando a face selecionada, a contagem será registrada como `2` no eixo X do histograma.
