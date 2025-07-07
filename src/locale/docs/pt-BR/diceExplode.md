**Explosão de Dado** é um **nó do tipo modificador** utilizado para contar quantas vezes uma determinada face (valor) de explosão aparece consecutivamente nos dados de entrada. Esse tipo de mecânica é comum em jogos onde certos resultados de dados provocam rerrolagens adicionais ou "explosões".

- **Tipo:** Modificador (nó intermediário)
- **Função:** Conta quantas explosões de dados ocorrem com base em um valor específico
- **Saída:** Quantidade de explosões em cada execução

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
- **Padrão:** Explosão de Dado
- **Função:** Nome exibido no quadro de modelagem

### **Explode face**

- **Tipo:** Inteiro
- **Padrão:** `1`
- **Função:** Valor que representa a face de explosão

---

## **Exemplo de Uso**

**Cenário:** Simular o acerto de um jogador que precisa causar múltiplos danos sempre que obtém `6` em uma rolagem de **1d6**.

### **1. Propriedades do Gerador de Dados:**

- Valor Mínimo: `1`
- Valor Máximo: `6`

### **2. Propriedades do Explosão de Dado:**

- Explode: `6`

### **3. Conexão com outros nós:**

- Conecte o **Gerador de Dado** ao nó **Explosão de Dado**
- Conecte o **Explosão de Dado** ao nó **Histograma**

<img src="/node-crafter/doc-images/dice-explode.png" width="500px" alt="Exemplo de uso do Explosão de Dado"/>

---

## **Notas**

- Ideal para representar jogos que utilizam mecânicas de rerrolagem ou “explosões” baseadas em um valor específico.
- Pode ser combinado com o nó **Pool de Dado** para simular múltiplas rolagens simultâneas com explosões sendo contadas por grupo.
- A lógica de contagem registra o número de explosões consecutivas. Quando a face de explosão aparece em sequência, a contagem é acumulada. Assim que a sequência é quebrada, o valor é registrado no histograma. Por exemplo, se em uma série de rolagens uma pool retorna duas faces `6` seguidas e depois um `4`, será contabilizada uma explosão com valor `2` no eixo X do histograma.
