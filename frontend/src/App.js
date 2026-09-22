// ==============================================================
// Arquivo: App.js  —  Componente Raiz do Frontend ZELUS
// ==============================================================
// O App é o componente "pai" de toda a aplicação.
// É aqui que ficará a configuração de rotas (qual página mostrar
// dependendo do endereço na barra do navegador) e o layout
// global (ex: barra de navegação que aparece em todas as páginas).
//
// ATENÇÃO: Este arquivo ainda não contém lógica funcional.
// Ele serve como esqueleto documentado para a próxima etapa.
// ==============================================================

// -- Importação do React --
// Necessário em todo componente React para usar a sintaxe JSX (<div>, <p>, etc.)
// import React from 'react';

// -- Importação do BrowserRouter e Routes (React Router DOM) --
// O React Router permite criar navegação entre páginas sem recarregar o browser.
// BrowserRouter: envolve a aplicação e habilita o sistema de rotas.
// Routes: é o "container" que agrupa todas as rotas.
// Route: define o caminho (URL) e qual componente/página exibir.
// import { BrowserRouter, Routes, Route } from 'react-router-dom';

// -- Importação futura das páginas --
// Quando as páginas forem criadas, elas serão importadas aqui.
// Exemplo:
// import HomePage from './pages/HomePage';
// import OcorrenciasPage from './pages/OcorrenciasPage';

// ==============================================================
// DEFINIÇÃO DO COMPONENTE APP
// ==============================================================

// Um componente funcional é uma função JavaScript que retorna JSX (HTML + JS).
// function App() {
//   return (
//     // BrowserRouter habilita o sistema de roteamento em toda a aplicação
//     <BrowserRouter>
//
//       {/* Aqui virá o componente de Navbar (barra de navegação global) */}
//
//       {/* Routes decide qual página renderizar baseado na URL atual */}
//       <Routes>
//
//         {/* Rota para a página inicial (caminho "/") */}
//         {/* <Route path="/" element={<HomePage />} /> */}
//
//         {/* Rota para a página de ocorrências */}
//         {/* <Route path="/ocorrencias" element={<OcorrenciasPage />} /> */}
//
//       </Routes>
//     </BrowserRouter>
//   );
// }

// -- Exportação do componente --
// "export default" torna o App disponível para ser importado em index.js.
// export default App;
