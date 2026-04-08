import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import JsonPrettier from './tools/JsonPrettier';
import SpaceRemover from './tools/SpaceRemover';
import CommaFormatter from './tools/CommaFormatter';
import TextCase from './tools/TextCase';
import TextCounter from './tools/TextCounter';
import Base64 from './tools/Base64';
import UrlEncoder from './tools/UrlEncoder';
import UnitConverter from './tools/UnitConverter';
import CurrencyExchange from './tools/CurrencyExchange';
import WorldTimeKorea from './tools/WorldTimeKorea';
import WorldTimeUTC from './tools/WorldTimeUTC';
import HashGenerator from './tools/HashGenerator';
import UuidGenerator from './tools/UuidGenerator';
import PasswordGenerator from './tools/PasswordGenerator';
import RegexTester from './tools/RegexTester';
import DiffChecker from './tools/DiffChecker';
import MarkdownConverter from './tools/MarkdownConverter';
import CronGenerator from './tools/CronGenerator';
import ColorPicker from './tools/ColorPicker';
import DateCalculator from './tools/DateCalculator';
import AgeCalculator from './tools/AgeCalculator';
import RandomPicker from './tools/RandomPicker';
import QRGenerator from './tools/QRGenerator';
import JwtDecoder from './tools/JwtDecoder';
import BaseConverter from './tools/BaseConverter';
import ImageConverter from './tools/ImageConverter';
import EnvEditor from './tools/EnvEditor';
import HttpStatusCode from './tools/HttpStatusCode';
import Home from './pages/Home';
import LogoShowcase from './components/LogoShowcase';
import Changelog from './pages/Changelog';

function App() {
  return (
    <BrowserRouter basename="/doguri">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="json-prettier" element={<JsonPrettier />} />
          <Route path="space-remover" element={<SpaceRemover />} />
          <Route path="comma-formatter" element={<CommaFormatter />} />
          <Route path="text-case" element={<TextCase />} />
          <Route path="regex-tester" element={<RegexTester />} />
          <Route path="diff-checker" element={<DiffChecker />} />
          <Route path="markdown-converter" element={<MarkdownConverter />} />
          <Route path="text-counter" element={<TextCounter />} />

          <Route path="base64" element={<Base64 />} />
          <Route path="url-encoder" element={<UrlEncoder />} />

          <Route path="hash-generator" element={<HashGenerator />} />
          <Route path="uuid-generator" element={<UuidGenerator />} />
          <Route path="password-generator" element={<PasswordGenerator />} />

          <Route path="unit-converter" element={<UnitConverter />} />
          <Route path="currency-exchange" element={<CurrencyExchange />} />

          <Route path="world-time-korea" element={<WorldTimeKorea />} />
          <Route path="world-time-utc" element={<WorldTimeUTC />} />
          <Route path="date-calculator" element={<DateCalculator />} />
          <Route path="age-calculator" element={<AgeCalculator />} />

          <Route path="random-picker" element={<RandomPicker />} />

          <Route path="cron-generator" element={<CronGenerator />} />
          <Route path="color-picker" element={<ColorPicker />} />
          <Route path="qr-generator" element={<QRGenerator />} />

          <Route path="jwt-decoder" element={<JwtDecoder />} />
          <Route path="base-converter" element={<BaseConverter />} />
          <Route path="image-converter" element={<ImageConverter />} />
          <Route path="env-editor" element={<EnvEditor />} />
          <Route path="http-status-code" element={<HttpStatusCode />} />

          {/* 변경 이력 페이지 */}
          <Route path="changelog" element={<Changelog />} />

          {/* 로고 쇼케이스 (숨겨진 페이지) */}
          <Route path="logo-showcase" element={<LogoShowcase />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;