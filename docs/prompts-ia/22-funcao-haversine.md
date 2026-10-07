# Função Haversine e Filtro Espacial

## Prompt Original

> "Vamos iniciar a arquitetura da funcionalidade de Abertura de Ocorrências. O primeiro passo é construir a nossa 'régua matemática' para o filtro espacial anti-duplicidade.
> 
> Por favor, apresente um plano de ação detalhado que inclua:
> 
> A criação do ficheiro backend/src/utils/haversine.js.
> 
> A implementação da função calcularDistancia(lat1, lon1, lat2, lon2):
> 
> A função deve aplicar a Fórmula de Haversine para calcular a distância entre dois pontos globais.
> 
> O retorno deve ser a distância exata em metros.
> 
> O código deve ser amplamente comentado em português, explicando o passo a passo da matemática para fins educativos.
> 
> A criação do ficheiro docs/prompts-ia/22-funcao-haversine.md com este prompt e a explicação simples de como a fórmula funciona para estudantes.
> 
> Apresente APENAS o plano de ação e o código proposto para a minha validação. NÃO crie nenhum ficheiro antes da minha aprovação final."

---

## Como funciona a Fórmula de Haversine? (Explicação para Estudantes)

Quando queremos medir a distância entre dois pontos numa folha de papel plana, podemos usar uma régua ou aplicar o Teorema de Pitágoras. No entanto, o nosso planeta Terra não é plano; é (aproximadamente) uma esfera. 

Se tentarmos usar matemática "plana" (geometria euclidiana) para medir a distância entre duas cidades no globo, o resultado estará errado, porque uma linha reta acabaria por perfurar a Terra em vez de contornar a sua superfície curva.

A **Fórmula de Haversine** resolve este problema. Ela é uma equação trigonométrica especial desenhada para calcular distâncias ao longo de uma superfície esférica.

**O passo a passo simplificado:**

1. **Graus para Radianos:** O primeiro passo na programação é transformar os graus das coordenadas (latitude e longitude) em *radianos*, que é a unidade "nativa" que os computadores usam para trigonometria (senos e cossenos).
2. **Medir os Ângulos:** A fórmula começa por medir o "tamanho do ângulo" de separação entre o Ponto A e o Ponto B, usando as funções de seno (`sin`) e cosseno (`cos`).
3. **Calcular a Curva:** Através da combinação matemática das latitudes e longitudes, ela descobre a distância angular (o ângulo ao centro da Terra entre os dois pontos).
4. **Multiplicar pelo Raio:** Finalmente, sabendo a distância do ângulo, basta multiplicar esse valor pelo tamanho (raio) do planeta Terra (cerca de 6.371.000 metros). O resultado é a distância real percorrida na superfície do planeta.

Para o nosso sistema de "Abertura de Ocorrências", esta fórmula atua como uma "régua invisível". Sempre que um utilizador tenta registar um problema (como um buraco na estrada), o sistema usa esta fórmula para medir a distância até outros buracos já reportados. Se a distância for muito pequena (por exemplo, menos de 10 metros), o sistema pode avisar: "Atenção, este problema já deve ter sido registado!".
