O **Pool Simbólico** é um **nó do tipo gerador** utilizado para criar valores simbólicos aleatórios com base em um conjunto de **símbolos e suas quantidades (pesos) definidas pelo usuário**. Ao contrário do **Gerador Simbólico** simples, este nó permite simular sorteios com probabilidades desiguais, sendo ideal para representar a distribuição real de elementos como baralhos com múltiplas cópias de cartas, inventários com diferentes raridades de itens, ou resultados com maior chance de ocorrência.

* **Tipo:** Gerador (nó inicial)
* **Função:** Gera aleatoriamente um dos valores simbólicos definidos, respeitando as quantidades especificadas para cada símbolo (sorteio ponderado).
* **Saída:** Um valor simbólico por execução
* **Saída:** Lista de valores aleatórios (pool) dentro dos símbolos definidos e suas quantidades

---

### **Propriedades**

#### **ID do Nó**

* **Tipo:** Texto
* **Padrão:** ID aleatório
* **Função:** Identificador único do nó

#### **Status**

* **Tipo:** `Finalizado` | `Ocioso` | `Erro` | `Carregando` | `Faltando dados`
* **Padrão:** `Ocioso`
* **Função:** Indica o estado atual do nó

#### **Nome**

* **Tipo:** Texto
* **Padrão:** Pool Simbólico
* **Função:** Nome exibido no quadro de modelagem

#### **Símbolos**

* **Tipo:** Tupla de Símbolo e Peso (Texto | Número Inteiro)
    * **Símbolo (Texto):** O valor simbólico possível a ser sorteado.
    * **Quantidade (Número Inteiro):** O peso ou a quantidade de vezes que o símbolo existe no pool.
* **Padrão:** `[A, 1], [B, 1]`
* **Função:** Define os símbolos possíveis e o **peso de cada um** ao ser sorteado.
* **Observação:** Pelo menos um símbolo com quantidade maior que zero é obrigatório.

---

### **Exemplo de Uso**

**Cenário:** Simular o sorteio de itens de uma "caixa de tesouro" que contém 5 "Poções Comuns", 3 "Armaduras Raras" e 1 "Espada Lendária".

#### **1. Propriedades do Pool Simbólico:**

| Símbolo | Quantidade |
| :--- | :--- |
| Poção Comum | 5 |
| Armadura Rara | 3 |
| Espada Lendária | 1 |

* *(Total de 9 itens no pool. A "Poção Comum" tem $\approx 55.6\%$ de chance de ser sorteada.)*

#### **2. Conexão com outros nós:**

* Conecte o **Pool Simbólico** diretamente ao nó **Histograma** para visualizar a distribuição de sorteios ao longo de múltiplas execuções, ou a um nó de **Saque** para rastrear a frequência de combinações de items.

---

### **Notas**

* Ideal para simular sistemas de sorteio ponderados (como "loot boxes", drops de itens) onde a frequência de cada resultado não é igual.
* Não é compatível com nós que exigem valores numéricos, como operadores matemáticos, lógicos ou comparação de valores de grandeza.