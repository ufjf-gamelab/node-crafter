**Sacar sem Reposição** é um **nó do tipo modificador** (intermediário) utilizado para simular sorteios onde **cada símbolo é retirado do pool de entrada apenas uma vez** dentro de uma mesma execução. Este nó se baseia no conceito de retirar elementos de um conjunto (**Pool Simbólico**) e **não os retornar** para sorteios subsequentes na mesma jogada. A saída é um conjunto de combinações ou permutações de símbolos.

* **Tipo:** Modificador (nó intermediário)
* **Função:** Retira uma quantidade definida de símbolos de um **Pool Simbólico** sem repetir o mesmo elemento.
* **Entrada:** **Pool Simbólico** (Símbolo e Quantidade)
* **Saída:** Lista de combinações/permutações (Gerador Simbólico)

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
* **Padrão:** Sacar sem Reposição
* **Função:** Nome exibido no quadro de modelagem

#### **Quantidade de Saques**

* **Tipo:** Inteiro
* **Padrão:** `2`
* **Função:** Define quantos símbolos serão retirados do pool por jogada. Este valor deve ser menor ou igual ao número total de elementos no pool de entrada.

#### **Ordem Importa?**

* **Tipo:** Booleano (`True` | `False`)
* **Padrão:** `False`
* **Função:** Define se a ordem dos símbolos retirados afeta o resultado final.
    * Se **`True`** (Permutação): A saída considera sequências como **AB** e **BA** como resultados **distintos**.
    * Se **`False`** (Combinação): A saída considera sequências como **AB** e **BA** como o **mesmo** resultado.

---

### **Exemplo de Uso**

**Cenário:** Em um jogo, sorteia-se **2 cartas** de um mini-baralho contendo 2 cartas "Ás", 1 carta "Rei" e 1 carta "Rainha".

#### **1. Configuração do Pool Simbólico (Entrada):**

| Símbolo | Quantidade |
| :--- | :--- |
| Ás | 2 |
| Rei | 1 |
| Rainha | 1 |

* *(Total de 4 cartas no pool.)*

#### **2. Propriedades do Sacar sem Reposição:**

* Quantidade de Saques: `2`
* Ordem Importa?: `False` (Combinação)

#### **3. Resultado (Combinações Possíveis):**

O nó irá gerar resultados como: `{Ás, Ás}`, `{Ás, Rei}`, `{Ás, Rainha}`, `{Rei, Rainha}`.

#### **4. Conexões:**

* Conecte o **Pool Simbólico** (com a configuração acima) ao nó **Sacar sem Reposição**.
* Conecte o **Sacar sem Reposição** ao nó **Histograma** para analisar a frequência das combinações.

---

### **Notas**

* Este nó lida com sorteios sem reposição de **pools ponderados**, o que o torna ideal para simular sorteios de baralhos, inventários ou caixas de itens.
* Se a propriedade **Ordem Importa?** for `True`, a saída será uma **Permutação** (sequência ordenada).
* A **Quantidade de Saques** não pode exceder o número total de itens disponíveis no pool.

---