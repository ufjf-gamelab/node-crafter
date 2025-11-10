**Pool de Geradores Simbólicos** é um **nó do tipo modificador** utilizado para agrupar os resultados de dois nós **Gerador Simbólico** em um único conjunto. Ele permite combinar execuções simbólicas paralelas, como o sorteio de dois símbolos diferentes em uma única jogada.

- **Tipo:** Modificador (nó intermediário)
- **Função:** Agrupa os valores de dois nós simbólicos em um único conjunto
- **Saída:** Lista de pares de símbolos agrupados por execução

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
- **Padrão:** Pool de Geradores Simbólicos
- **Função:** Nome exibido no quadro de modelagem

---

## **Exemplo de Uso**

**Cenário:** Simular o sorteio de dois símbolos aleatórios representando cartas de um baralho personalizado com figuras diferentes.

### **1. Propriedades dos Geradores Simbólicos:**

- Gerador A: Faces = `Coração`, `Espada`, `Estrela`
- Gerador B: Faces = `Cubo`, `Chave`, `Lua`

### **2. Conexão com outros nós:**

- Conecte o **Gerador Simbólico A** ao nó **Pool de Geradores Simbólicos**
- Conecte o **Gerador Simbólico B** ao nó **Pool de Geradores Simbólicos**
- Conecte a **Pool de Geradores Simbólicos** ao nó **Histograma**

<img src="/node-crafter/doc-images/symbolic-generator-pool.png" width="500px" alt="Exemplo de uso do Pool de Geradores Simbólicos"/>

---

## **Notas**

- Ideal para representar sorteios paralelos de múltiplos elementos simbólicos.
- Requer obrigatoriamente nós do tipo **Gerador Simbólico** como entrada.
- Não é compatível com operações numéricas ou nós que dependem de valores quantitativos.
