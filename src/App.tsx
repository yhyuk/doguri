import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import JsonPrettier from './tools/JsonPrettier';
import SpaceRemover from './tools/SpaceRemover';
import CommaFormatter from './tools/CommaFormatter';
import UnitConverter from './tools/UnitConverter';
import CurrencyExchange from './tools/CurrencyExchange';
import WorldTimeKorea from './tools/WorldTimeKorea';
import WorldTimeUTC from './tools/WorldTimeUTC';
import LogoShowcase from './components/LogoShowcase';

function App() {
  return (
    <BrowserRouter basename="/doguri">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/json-prettier" replace />} />
          <Route path="json-prettier" element={<JsonPrettier />} />
          <Route path="space-remover" element={<SpaceRemover />} />
          <Route path="comma-formatter" element={<CommaFormatter />} />
          <Route path="unit-converter" element={<UnitConverter />} />
          <Route path="currency-exchange" element={<CurrencyExchange />} />
          <Route path="world-time-korea" element={<WorldTimeKorea />} />
          <Route path="world-time-utc" element={<WorldTimeUTC />} />

          {/* 로고 쇼케이스 (숨겨진 페이지) */}
          <Route path="logo-showcase" element={<LogoShowcase />} />

          {/* 추후 다른 도구들 추가 */}
          <Route path="text-case" element={<div className="p-8">대소문자 변환 (준비중)</div>} />
          <Route path="base64" element={<div className="p-8">Base64 (준비중)</div>} />
          <Route path="url-encoder" element={<div className="p-8">URL 인코딩 (준비중)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;