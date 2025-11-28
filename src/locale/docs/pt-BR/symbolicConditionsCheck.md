**Verificador de Condições Simbólicas** é um nó lógico de validação projetado para analisar o resultado de sorteios. Ele recebe conjuntos de símbolos sorteados (gerados especificamente pelo nó **Sacar Símbolos**) e determina se cada sorteio atende a requisitos de quantidade pré-definidos.

Sua função principal é transformar listas complexas de itens em uma métrica binária de **Sucesso (Cumpriu os requisitos)** ou **Falha (Não cumpriu)**, permitindo que o nó **Histograma** calcule a probabilidade percentual exata de obter a combinação desejada.

* **Tipo:** Lógico / Validador
* **Função:** Filtra resultados de saques, convertendo listas de símbolos em status de Sucesso ou Falha com base em regras de quantidade.
* **Entrada:** Lista de Símbolos Sorteados (proveniente do nó **Sacar Símbolos**).
* **Saída:** Fluxo de dados binários classificados como "Sucesso" ou "Falha" para cálculo estatístico.

---

### **Propriedades**

#### **ID do Nó**
* **Tipo:** Texto
* **Padrão:** ID aleatório
* **Função:** Identificador único do nó

#### **Status**
* **Tipo:** `Finalizado` | `Ocioso` | `Erro` | `Carregando` | `Faltando dados`
* **Padrão:** `Ocioso`
* **Função:** Indica o estado atual do processamento lógico.

#### **Nome**
* **Tipo:** Texto
* **Padrão:** Verificador de Condições
* **Função:** Nome exibido no quadro de modelagem.

#### **Condições**
* **Tipo:** Lista de Regras (Símbolo, Operador, Quantidade)
    * **Símbolo (Texto):** O identificador do símbolo a ser verificado no saque (ex: "Carta Ás", "Moeda").
    * **Tipo de Condição (Operador):** A regra matemática a ser aplicada.
        * `>=` (Maior ou Igual): O saque deve conter pelo menos X deste símbolo.
        * `<=` (Menor ou Igual): O saque deve conter no máximo X deste símbolo.
        * `=` (Igual): O saque deve conter exatamente X deste símbolo.
    * **Quantidade (Número Inteiro):** O valor de referência para a comparação.
* **Lógica Interna (AND):** Todas as condições listadas devem ser verdadeiras simultaneamente para que o resultado seja considerado um **Sucesso**.

---

### **Exemplo de Uso**

**Cenário:** Calcular a chance percentual de conseguir um "Full House" (3 Reis e 2 Damas) em uma mão de 5 cartas.

#### **1. Configuração do Fluxo:**
`[Pool: Baralho]` $\rightarrow$ `[Sacar: 5 Cartas]` $\rightarrow$ `[Verificador]` $\rightarrow$ `[Histograma]`

#### **2. Regras do Verificador:**
* Rei `=` 3
* Dama `=` 2

#### **3. Interpretação do Gráfico (Histograma):**
Ao processar milhares de simulações, o Histograma exibirá duas barras de distribuição percentual:

* **Barra de Falha (0):** Indica a porcentagem de vezes que a mão **não** atendeu aos requisitos (ex: 99.8%).
* **Barra de Sucesso (1):** Indica a porcentagem de vezes que a mão **atendeu** exatamente aos requisitos (ex: 0.2%).
* *A leitura direta da barra de Sucesso fornece a probabilidade estatística do evento ocorrer.*

---

### **Notas**

* **Dependência de Entrada:** Este nó **exige** uma entrada do tipo lista (array), como a fornecida pelo nó **Sacar Símbolos**.
* **Visualização:** A separação no gráfico é binária. Mesmo que o saque tenha "quase" acertado (ex: 2 Reis e 2 Damas), ele será contabilizado integralmente na porcentagem de **Falha**.
* **Validação Estrita:** A verificação diferencia maiúsculas de minúsculas e espaços no nome dos símbolos.