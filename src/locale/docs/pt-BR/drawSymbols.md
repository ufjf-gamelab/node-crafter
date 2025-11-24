**Sacar Símbolos** é um **nó do tipo modificador** (intermediário) utilizado para simular sorteios onde símbolos são retirados do pool de entrada. Dependendo da configuração, os símbolos podem retornar ao pool após cada saque (**com reposição**) ou serem removidos durante a duração da tentativa (**sem reposição**). A saída é um conjunto de combinações ou permutações de símbolos.

* **Tipo:** Modificador (nó intermediário)
* **Função:** Retira uma quantidade definida de símbolos de um **Pool Simbólico**, retornando-os ou removendo-os com base na configuração de Reposição.
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
* **Padrão:** Sacar símbolos
* **Função:** Nome exibido no quadro de modelagem

#### **Quantidade de Saques**

* **Tipo:** Inteiro
* **Padrão:** `2`
* **Função:** Define quantos símbolos serão retirados do pool por jogada.

#### **Reposição**

* **Tipo:** Booleano (`True` | `False`)
* **Padrão:** `False`
* **Função:** Define se o símbolo sorteado retorna ao pool antes do próximo saque.
    * Se **`True`** (Com Reposição): O símbolo retorna ao pool após ser sorteado. A mesma instância específica de um símbolo pode ser sorteada múltiplas vezes em uma única jogada.
    * Se **`False`** (Sem Reposição): O símbolo é removido do pool durante a jogada atual. A mesma instância específica não pode ser sorteada novamente.
    * **Restrição:** Se definido como **`False`**, ocorrerá um **Erro** se a **Quantidade de Saques** for maior que o número total de elementos no **Pool Simbólico**.

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

#### **2. Propriedades do Sacar símbolos:**

* Quantidade de Saques: `2`
* Reposição: `False`
* Ordem Importa?: `False` (Combinação)

#### **3. Resultado (Combinações Possíveis):**

O nó irá gerar resultados como: `{Ás, Ás}`, `{Ás, Rei}`, `{Ás, Rainha}`, `{Rei, Rainha}`.

*(Nota: Se **Reposição** fosse `True`, um resultado como `{Rei, Rei}` seria possível, mesmo havendo apenas 1 Rei no pool).*

#### **4. Conexões:**

* Conecte o **Pool Simbólico** (com a configuração acima) ao nó **Sacar símbolos**.
* Conecte o **Sacar símbolos** ao nó **Histograma** para analisar a frequência das combinações.

---

### **Notas**

* Este nó lida com saques de **pools ponderados**, o que o torna ideal para simular sorteios de baralhos, inventários ou caixas de itens.
* **Condição de Erro:** Se **Reposição** estiver definida como `False`, certifique-se de que a **Quantidade de Saques** não exceda o tamanho total do pool, caso contrário, o nó retornará um status de `Erro`.
* Se a propriedade **Ordem Importa?** for `True`, a saída será uma **Permutação** (sequência ordenada).