/**
 * Converte graus para radianos.
 * A matemática trigonométrica em JavaScript (como Math.sin, Math.cos) 
 * espera valores em radianos e não em graus.
 * 
 * @param {number} graus - O valor em graus.
 * @returns {number} O valor convertido em radianos.
 */
function grausParaRadianos(graus) {
    return graus * (Math.PI / 180);
}

/**
 * Calcula a distância em metros entre duas coordenadas geográficas (latitude e longitude)
 * utilizando a Fórmula de Haversine.
 * 
 * A Fórmula de Haversine é uma importante equação usada em navegação, 
 * fornecendo distâncias entre dois pontos numa esfera a partir das suas 
 * latitudes e longitudes.
 * 
 * @param {number} lat1 - Latitude do ponto 1 em graus decimais.
 * @param {number} lon1 - Longitude do ponto 1 em graus decimais.
 * @param {number} lat2 - Latitude do ponto 2 em graus decimais.
 * @param {number} lon2 - Longitude do ponto 2 em graus decimais.
 * @returns {number} A distância entre os dois pontos em metros.
 */
function calcularDistancia(lat1, lon1, lat2, lon2) {
    // O raio médio da Terra é de aproximadamente 6371 quilómetros (ou 6.371.000 metros).
    const RAIO_TERRA_METROS = 6371000;

    // Passo 1: Converter as diferenças de latitude e longitude para radianos
    const dLat = grausParaRadianos(lat2 - lat1);
    const dLon = grausParaRadianos(lon2 - lon1);

    // Converter também as latitudes originais para radianos para o cálculo
    const lat1Rad = grausParaRadianos(lat1);
    const lat2Rad = grausParaRadianos(lat2);

    // Passo 2: Aplicar a Fórmula de Haversine
    // A fórmula matemática é:
    // a = sin²(Δlat/2) + cos(lat1) * cos(lat2) * sin²(Δlon/2)
    // 'a' representa o quadrado de metade do comprimento da corda entre os dois pontos.
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    // Passo 3: Calcular a distância angular em radianos (c)
    // c = 2 * atan2(√a, √(1−a))
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Passo 4: Calcular a distância final
    // Distância = Raio da Terra * distância angular
    const distanciaMetros = RAIO_TERRA_METROS * c;

    return distanciaMetros;
}

module.exports = {
    calcularDistancia,
    grausParaRadianos // Exportado opcionalmente caso seja útil noutro local
};
