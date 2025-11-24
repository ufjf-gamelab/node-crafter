**Sacar Até** é um **nó do tipo modificador** (intermediário) utilizado para simular a persistência ou calcular a probabilidade de ocorrência baseada em tentativas. Ele realiza saques repetidos no pool de entrada até que uma **meta específica de símbolos** (Condições de Parada) seja acumulada. A saída deste nó não são os símbolos em si, mas sim **quantas rodadas de saques foram necessárias** para atingir a condição definida.

* **Tipo:** Modificador (nó intermediário)
* **Função:** Sorteia repetidamente de um **Pool Simbólico** até atingir as metas definidas. Retorna o número total de tentativas realizadas.
* **Entrada:** **Pool Simbólico** (Símbolo e Quantidade)
* **Saída:** Número Inteiro (Quantidade de Tentativas)

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
* **Padrão:** Sacar Até
* **Função:** Nome exibido no quadro de modelagem

#### **Quantidade de Saques**

* **Tipo:** Inteiro
* **Padrão:** `2`
* **Função:** Define quantos símbolos são retirados do pool **por tentativa**.
    * Exemplo: Se definido como `10`, cada "tentativa" consome 10 símbolos do pool de uma única vez para verificar se os objetivos foram atingidos.

#### **Reposição**

* **Tipo:** Booleano (`True` | `False`)
* **Padrão:** `False`
* **Função:** Define se os símbolos sorteados retornam ao pool para a próxima rodada de saque.
    * Se **`True`** (Com Reposição): Os símbolos retornam ao pool após cada verificação. O pool nunca se esgota, permitindo simulações infinitas até o sucesso.
    * Se **`False`** (Sem Reposição): Os símbolos são removidos permanentemente do pool a cada saque.
    * **Restrição:** Se definido como `False`, o nó interromperá a execução se o pool ficar vazio antes que os objetivos sejam alcançados.

#### **Condições de Parada**

* **Tipo:** Lista de Objetivos (Símbolo + Quantidade)
* **Função:** Define a meta que deve ser alcançada para interromper o ciclo de saques.
    * **Símbolo:** O nome do item que se deseja obter.
    * **Quantidade:** O número de unidades desse símbolo que precisam ser acumuladas.
    * **Lógica:** O nó continuará sacando até que **todas** as quantidades de **todos** os símbolos listados tenham sido coletadas.

---

### **Exemplo de Uso**

**Cenário:** Queremos saber quantas vezes precisamos jogar uma moeda até conseguir acumular **2 "Caras"**.

#### **1. Configuração do Pool Simbólico (Entrada):**

| Símbolo | Quantidade |
| :--- | :--- |
| Cara | 1 |
| Coroa | 1 |

#### **2. Propriedades do Sacar Até:**

* **Quantidade de Saques:** `1` (Joga uma moeda por vez)
* **Reposição:** `True` (A moeda retorna para a mão após ser jogada)
* **Condições de Parada:**
    * Símbolo: `Cara`, Quantidade: `2`

#### **3. Resultado (Saída):**

O nó simulará o processo internamente (ex: Coroa, Coroa, Cara, Coroa, Cara).
* **Saída:** `5` (Foram necessárias 5 jogadas para acumular as 2 Caras necessárias).

#### **4. Conexões:**

* Conecte o **Pool Simbólico** ao nó **Sacar Até**.
* A saída deste nó é um número. Conecte-o a um **Histograma** para visualizar a distribuição estatística do esforço necessário (ex: média de tentativas para o sucesso).

---

### **Notas**

* A saída deste nó é estritamente **numérica**. Ele não repassa a lista de símbolos sorteados, apenas o número inteiro representando o esforço (quantidade de rodadas).
* Ao utilizar **Sem Reposição**, certifique-se de que o pool contém símbolos suficientes para atingir a meta, caso contrário o processo falhará ou parará prematuramente.
* A propriedade **Quantidade de Saques** influencia diretamente a velocidade do sucesso. Sacar 5 itens por vez geralmente atinge a meta em menos "rodadas" do que sacar 1 por vez.