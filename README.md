# 🚀 Projeto Promoção Escalonada

Sistema desenvolvido pelo setor de **Tecnologia da Informação da Comal** para automatizar a criação de promoções escalonadas no ERP **WinThor**, considerando preços promocionais, quantidades mínimas e diferentes planos de pagamento.

A aplicação permite calcular automaticamente os percentuais necessários para atingir um preço promocional definido, gerando um arquivo `.txt` compatível com a importação de dados da **Rotina 561 do WinThor**.

---

## 📋 Sobre o Projeto

O **Projeto Promoção Escalonada** surgiu da necessidade de simplificar e automatizar o processo de cadastramento de promoções no ERP WinThor.

O sistema realiza consultas ao banco de dados para obter informações dos produtos e planos de pagamento, executa os cálculos necessários e gera um arquivo de importação contendo os percentuais promocionais.

### 🎯 Objetivos

- Automatizar o cálculo de percentuais promocionais.
- Permitir a definição de preços promocionais para produtos.
- Considerar quantidades mínimas para aplicação das promoções.
- Calcular os percentuais para aproximadamente **120 planos de pagamento**.
- Reduzir o trabalho manual no cadastramento de promoções.
- Minimizar erros de cálculo e inconsistências nos preços.
- Gerar arquivos `.txt` para importação na Rotina 561 do WinThor.

---

## ⚠️ Problemática

O ERP **WinThor** disponibiliza a **Rotina 561**, responsável pelo cadastramento de promoções.

Entretanto, essa rotina apresenta uma limitação operacional: os descontos promocionais são configurados por meio de **percentuais**, e não diretamente pelo preço final desejado.

Além disso, cada plano de pagamento pode apresentar condições comerciais diferentes, alterando o valor final do produto.

### Exemplo do problema

Considere um produto com as seguintes condições:

| Informação                 | Valor            |
| -------------------------- | ---------------- |
| Preço base                 | R$ 100,00        |
| Preço promocional desejado | R$ 85,00         |
| Plano de pagamento A       | Sem acréscimo    |
| Plano de pagamento B       | Acréscimo de 10% |
| Plano de pagamento C       | Acréscimo de 15% |

Para que o produto alcance o preço promocional de **R$ 85,00**, é necessário calcular um percentual de desconto específico para cada plano de pagamento.

Na utilização convencional da Rotina 561, esse processo exige cálculos manuais, tornando o cadastramento de promoções trabalhoso, especialmente quando envolve diversos produtos e aproximadamente 120 planos de pagamento.

### Principais dificuldades

- Necessidade de calcular manualmente os descontos.
- Diferentes preços conforme o plano de pagamento.
- Grande quantidade de combinações entre produtos e planos.
- Maior possibilidade de erros humanos.
- Tempo elevado para cadastrar promoções em grande escala.

---

## 💡 Solução Desenvolvida

Para solucionar esse problema, o setor de **TI da Comal** desenvolveu uma aplicação capaz de automatizar o processo de criação das promoções.

O sistema consulta os produtos e planos de pagamento diretamente no banco de dados, realiza os cálculos necessários e gera um arquivo `.txt` estruturado para importação na Rotina 561.

### 🔄 Fluxo de Funcionamento

```text
┌─────────────────────────────┐
│       Banco de Dados        │
│          WinThor            │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│     Consulta de Produtos    │
│    e Planos de Pagamento    │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│    Definição dos Preços     │
│         Promocionais       │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│    Cálculo Automático dos   │
│   Percentuais de Desconto   │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      Geração do Arquivo     │
│            .TXT             │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│     Importação no WinThor   │
│         Rotina 561          │
└─────────────────────────────┘
```

---

## ⚙️ Regras de Negócio

A principal regra de negócio consiste em calcular o percentual de desconto necessário para que determinado produto alcance o preço promocional desejado, independentemente do plano de pagamento utilizado.

Para isso, são consideradas três informações:

1. **Preço de tabela:** valor base do produto, conforme a tabela associada ao plano.
2. **Taxa do plano:** percentual de acréscimo ou ajuste aplicado ao preço de tabela.
3. **Preço promocional:** valor final desejado para o produto.

### 📐 Fórmulas Utilizadas

**1. Cálculo do valor do produto no plano de pagamento**

```text
Valor do Plano = Preço de Tabela × (1 + Taxa do Plano / 100)
```

**2. Cálculo do percentual promocional**

```text
Desconto (%) = ((Valor do Plano - Preço Promocional) / Valor do Plano) × 100
```

O resultado representa o percentual de desconto necessário para atingir o preço promocional definido.

### 🧮 Exemplo Prático

Considere um produto com preço base de **R$ 100,00** e preço promocional desejado de **R$ 85,00**.

| Plano   | Acréscimo | Valor no Plano | Desconto Calculado |
| ------- | --------: | -------------: | -----------------: |
| Plano A |        0% |      R$ 100,00 |         15,000000% |
| Plano B |       10% |      R$ 110,00 |         22,727273% |
| Plano C |       15% |      R$ 115,00 |         26,086957% |

Observe que, embora os planos apresentem valores diferentes, os percentuais calculados permitem alcançar aproximadamente o mesmo preço promocional de **R$ 85,00**, respeitando os arredondamentos aplicados.

---

## 💻 Implementação das Regras de Negócio

As regras de cálculo foram implementadas em **TypeScript**, utilizando funções responsáveis por identificar a tabela de preços, aplicar as taxas dos planos e determinar os percentuais promocionais.

### 1️⃣ Identificação do Preço de Tabela

Cada plano de pagamento possui um identificador `numpr`, utilizado para determinar qual preço de tabela deve ser considerado.

```typescript
import { ProductsDTO } from "@/types/promotion";

/**
 * Retorna o preço de tabela correspondente
 * ao número da tabela associado ao plano (1 a 7).
 */
export function getValorTabelaPorNumpr(
  produto: ProductsDTO,
  numpr: number,
): number {
  switch (numpr) {
    case 1:
      return produto.ptabela1;
    case 2:
      return produto.ptabela2;
    case 3:
      return produto.ptabela3;
    case 4:
      return produto.ptabela4;
    case 5:
      return produto.ptabela5;
    case 6:
      return produto.ptabela6;
    case 7:
      return produto.ptabela7;
    default:
      return produto.ptabela1;
  }
}
```

### 2️⃣ Cálculo do Valor no Plano de Pagamento

Após identificar o preço de tabela, o sistema aplica o percentual de ajuste do plano de pagamento.

```typescript
/**
 * Calcula o valor do produto no plano de pagamento,
 * aplicando a taxa pertxfim.
 *
 * O resultado é arredondado para duas casas decimais.
 */
export function calcularValorNoPlano(
  valorTabela: number,
  pertxfim: number,
): number {
  const taxa = pertxfim || 0;

  const valorCalculado = valorTabela * (1 + taxa / 100);

  return Number(valorCalculado.toFixed(2));
}
```

**Exemplo:**

```typescript
const valorTabela = 100;
const taxaPlano = 10;

const resultado = calcularValorNoPlano(valorTabela, taxaPlano);

console.log(resultado);
// Resultado: 110.00
```

### 3️⃣ Cálculo do Percentual Promocional

Com o valor do produto no plano definido, o sistema calcula o percentual necessário para alcançar o preço promocional.

```typescript
/**
 * Calcula o percentual de desconto necessário
 * para atingir o preço promocional desejado.
 *
 * Fórmula:
 * ((valorPlano - valorPromocao) / valorPlano) * 100
 */
export function calcularPctPromocao(
  valorPlano: number,
  valorPromocao: number,
): number {
  if (valorPlano === 0) return 0;

  const resultado = ((valorPlano - valorPromocao) / valorPlano) * 100;

  return Number(resultado.toFixed(6));
}
```

**Exemplo:**

```typescript
const valorPlano = 110;
const valorPromocao = 85;

const percentual = calcularPctPromocao(valorPlano, valorPromocao);

console.log(percentual);
// Resultado: 22.727273
```

Esse percentual será utilizado na geração dos dados promocionais para importação no WinThor.

---

## 📄 Geração do Arquivo TXT

A **Rotina 561 do WinThor** permite a importação de informações promocionais por meio de arquivos `.txt`.

Aproveitando essa funcionalidade, o projeto automatiza a geração do arquivo com os dados calculados para cada produto e plano de pagamento.

### Como funciona?

Após realizar os cálculos, a aplicação:

1. Organiza os produtos selecionados.
2. Associa cada produto aos planos de pagamento.
3. Calcula o percentual promocional correspondente.
4. Estrutura os dados conforme o layout de importação utilizado.
5. Gera um arquivo `.txt` para importação na Rotina 561.

### 📦 Importação de Múltiplos Produtos

Uma das principais vantagens da solução é a possibilidade de processar **diversos produtos em uma única operação**.

Dessa forma, o sistema elimina a necessidade de calcular e cadastrar manualmente os percentuais de cada combinação entre produto e plano de pagamento.

O arquivo gerado concentra as informações necessárias para realizar a importação das promoções no ERP.

---

## 📈 Benefícios da Solução

| Benefício                | Descrição                                                 |
| ------------------------ | --------------------------------------------------------- |
| ⚡ Automação             | Elimina cálculos repetitivos e manuais.                   |
| 🎯 Precisão              | Padroniza os cálculos dos percentuais promocionais.       |
| ⏱️ Produtividade         | Reduz o tempo necessário para preparar promoções.         |
| 📦 Processamento em lote | Permite trabalhar com múltiplos produtos.                 |
| 🔄 Integração            | Utiliza o mecanismo de importação da Rotina 561.          |
| 💰 Consistência          | Considera as particularidades de cada plano de pagamento. |
| 🛠️ Manutenção            | Centraliza as regras de cálculo em funções reutilizáveis. |

---

## 🏢 Desenvolvimento

Projeto desenvolvido pelo setor de **Tecnologia da Informação da Comal**, com foco na automação de processos internos e na melhoria da eficiência operacional.

A solução demonstra como a integração entre consultas ao banco de dados, regras de negócio e geração automatizada de arquivos pode simplificar processos existentes em sistemas ERP.

---

## 📝 Considerações Finais

O **Projeto Promoção Escalonada** transforma um processo anteriormente manual em um fluxo automatizado, permitindo calcular os percentuais promocionais de diversos produtos e planos de pagamento de maneira padronizada.

Por meio da geração de arquivos compatíveis com a Rotina 561 do WinThor, a aplicação contribui para a redução de tarefas repetitivas, a minimização de erros operacionais e o aumento da produtividade no cadastramento de promoções.

---

**Desenvolvido pelo setor de TI da Comal.**
