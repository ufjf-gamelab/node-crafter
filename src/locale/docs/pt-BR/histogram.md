**Histograma** é um **nó do tipo visualização** que exibe os resultados da simulação como um gráfico de barras. Ele mostra com que frequência diferentes resultados ocorrem nas suas simulações descritas no modelo.

- **Tipo:** Visualizador (nó final na cadeia)
- **Função:** Cria gráficos a partir dos dados da simulação modelada
- **Saída:** Gráfico de barras que demonstra as frequências dos resultados

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
- **Padrão:** Histograma
- **Função:** Nome exibido no quadro de modelagem e no gráfico gerado

### **Ordenação**

- **Tipo:** Ascendente | Descendente
- **Padrão:** Ascendente
- **Função:** Define a ordem dos valores exibidos no grafico de barras do histograma

---

## **Exemplo de Uso**

**Cenário:** Simular um ataque básico em um RPG que usa um dado de 6 faces (1d6) e requer um valor mínimo de 4 para acerto.

### **1. Propriedades do Gerador de Dado:**

- Valor Mínimo: `1`
- Valor Máximo: `6`

### **2. Propriedades do Dado Sucesso:**

- Sucesso igual ou maior que: `4`

### **3. Conexão com outros nós:**

- Conecte **Gerador de Dado** ao nó **Dado Sucesso**
- Conecte **Dado Sucesso** ao nó **Histograma**

<img src="/node-crafter/doc-images/generator-success.png" width="500px" alt="Gerador de Dado → Dado Sucesso → Histograma"/>

---

## **Notas**

- O Histograma deve ser sempre colocado **por último** na cadeia de nós
- É necessário que esteja conectado à saída de outro nó
