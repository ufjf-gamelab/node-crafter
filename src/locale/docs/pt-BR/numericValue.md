**Valor Numérico** é um **nó de processamento (conversor)** projetado para transformar dados simbólicos em dados quantitativos. Ele atua como um tradutor que recebe um símbolo (ou uma lista deles vinda de um **Pool Simbólico**) e atribui a cada um um valor numérico específico com base em um dicionário de conversão definido pelo usuário.

Este nó é essencial para converter categorias qualitativas (como "Ouro", "Prata", "Bronze") em valores que podem ser processados por operadores matemáticos, comparadores de grandeza ou nós estatísticos.

* **Tipo:** Processamento / Conversor
* **Função:** Atribui e soma valores numéricos a símbolos correspondentes.
* **Entrada:** Um símbolo individual ou uma lista de símbolos (Pool).
* **Saída:** Valor numérico total (soma dos valores dos símbolos processados).

---

### **Propriedades**

#### **ID do Nó**

* **Tipo:** Texto
* **Padrão:** ID aleatório
* **Função:** Identificador único do nó no fluxo.

#### **Status**

* **Tipo:** `Finalizado` | `Ocioso` | `Erro` | `Aguardando Entrada`
* **Padrão:** `Ocioso`
* **Função:** Indica se o nó já recebeu os símbolos e concluiu a conversão.

#### **Nome**

* **Tipo:** Texto
* **Padrão:** Valor Numérico
* **Função:** Nome exibido no quadro de modelagem.

#### **Dicionário de Valores (De-Para)**

* **Tipo:** Tupla de Símbolo e Valor (Texto | Número Decimal/Inteiro)
* **Símbolo (Texto):** O nome do símbolo esperado na entrada.
* **Valor (Número):** O valor numérico que este símbolo representa.


* **Padrão:** `["A", 1]`
* **Função:** Mapeia quanto vale cada símbolo para o cálculo final.

#### **Tratamento de Símbolos Ausentes**

* **Comportamento:** Fixo em `0`
* **Função:** Caso o nó receba um símbolo que não esteja presente no **Dicionário de Valores**, o valor atribuído a ele será automaticamente **zero**, sem interromper a execução do fluxo ou gerar erro.

---

### **Exemplo de Uso**

**Cenário:** Calcular o valor total em moedas de um "Saque de Tesouro" gerado por um Pool Simbólico.

#### **1. Configuração do Dicionário:**

| Símbolo (Chave) | Valor Numérico |
| --- | --- |
| Moeda de Cobre | 1 |
| Moeda de Prata | 10 |
| Moeda de Ouro | 100 |

#### **2. Processamento:**

Se o nó de entrada (**Pool Simbólico**) enviar uma lista contendo:
`[Moeda de Ouro, Moeda de Ouro, Moeda de Prata, Item Quebrado]`

O nó **Valor Numérico** realizará o cálculo:


* **Resultado Final de Saída:** `210`

---

### **Notas**

* **Soma Automática:** Se o nó receber uma lista de símbolos (um pool), ele entregará automaticamente a soma total de todos os valores correspondentes.
* **Compatibilidade:** O resultado de saída (número) é compatível com nós de **Operadores Matemáticos**, **Comparadores** e **Gráficos**.
* **Resiliência:** Graças ao tratamento de símbolos ausentes fixado em 0, o nó garante que a cadeia de processamento não quebre mesmo que o Pool gere símbolos inesperados.