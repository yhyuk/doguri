import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import TextArea from '../../components/common/TextArea';
import { formatJson, minifyJson, sortJsonKeys, validateJson } from './utils';

export default function JsonPrettier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState<'2' | '4' | 'tab'>('2');
  const [sortKeys, setSortKeys] = useState<'none' | 'asc' | 'desc'>('none');
  const [status, setStatus] = useState<{ valid: boolean; message: string }>({
    valid: true,
    message: '유효한 JSON'
  });

  useEffect(() => {
    if (!input) {
      setStatus({ valid: true, message: 'JSON을 입력하세요' });
      return;
    }

    const validation = validateJson(input);
    if (validation.valid) {
      setStatus({ valid: true, message: '유효한 JSON' });
    } else {
      setStatus({ valid: false, message: `JSON 오류: ${validation.error}` });
    }
  }, [input]);

  const handleFormat = () => {
    if (!input) return;

    try {
      let formatted = input;

      // 정렬 적용
      if (sortKeys !== 'none') {
        formatted = sortJsonKeys(formatted, sortKeys);
      } else {
        const indent = indentSize === 'tab' ? '\t' : parseInt(indentSize);
        formatted = formatJson(formatted, indent);
      }

      setOutput(formatted);
    } catch (error) {
      setOutput('');
      if (error instanceof Error) {
        setStatus({ valid: false, message: error.message });
      }
    }
  };

  const handleMinify = () => {
    if (!input) return;

    try {
      const minified = minifyJson(input);
      setOutput(minified);
    } catch (error) {
      setOutput('');
      if (error instanceof Error) {
        setStatus({ valid: false, message: error.message });
      }
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setStatus({ valid: true, message: 'JSON을 입력하세요' });
  };

  const handleCopy = async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      // 간단한 피드백 (실제로는 Toast 컴포넌트를 만들어 사용하는 것이 좋습니다)
      const button = document.getElementById('copy-button');
      if (button) {
        const originalText = button.textContent;
        button.textContent = '복사됨!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleExample = () => {
    const example = {
      name: "도구리",
      version: "1.0.0",
      tools: ["JSON Prettier", "Base64", "URL Encoder"],
      author: {
        name: "Doguri Team",
        email: "hello@doguri.kr"
      }
    };
    setInput(JSON.stringify(example));
  };

  const handleDownload = () => {
    if (!output) return;

    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        title="JSON 정리"
        description="JSON 형식을 보기 좋게 정리하고 검증합니다"
      />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* Options Panel */}
          <div className="bg-gray-50 rounded-lg p-5 mb-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 min-w-[80px]">
                  들여쓰기
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="indent"
                      value="2"
                      checked={indentSize === '2'}
                      onChange={(e) => setIndentSize(e.target.value as '2')}
                      className="text-blue-600"
                    />
                    2 spaces
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="indent"
                      value="4"
                      checked={indentSize === '4'}
                      onChange={(e) => setIndentSize(e.target.value as '4')}
                      className="text-blue-600"
                    />
                    4 spaces
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="indent"
                      value="tab"
                      checked={indentSize === 'tab'}
                      onChange={(e) => setIndentSize(e.target.value as 'tab')}
                      className="text-blue-600"
                    />
                    Tab
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 min-w-[80px]">
                  정렬
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      value="none"
                      checked={sortKeys === 'none'}
                      onChange={(e) => setSortKeys(e.target.value as 'none')}
                      className="text-blue-600"
                    />
                    없음
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      value="asc"
                      checked={sortKeys === 'asc'}
                      onChange={(e) => setSortKeys(e.target.value as 'asc')}
                      className="text-blue-600"
                    />
                    키 오름차순
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      value="desc"
                      checked={sortKeys === 'desc'}
                      onChange={(e) => setSortKeys(e.target.value as 'desc')}
                      className="text-blue-600"
                    />
                    키 내림차순
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Input/Output Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
            <div className="flex flex-col">
              <TextArea
                label="입력"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='{"name":"도구리","type":"utility"}를 입력하세요'
              />
              <div className="flex gap-3 mt-4">
                <Button onClick={handleFormat}>정리하기</Button>
                <Button onClick={handleMinify}>압축하기</Button>
                <Button variant="secondary" onClick={handleClear}>지우기</Button>
                <Button variant="secondary" onClick={handleExample}>예제</Button>
              </div>
            </div>

            <div className="flex flex-col">
              <TextArea
                label="결과"
                value={output}
                readOnly
                placeholder="정리된 JSON이 여기에 표시됩니다"
              />
              <div className="flex gap-3 mt-4">
                <Button id="copy-button" onClick={handleCopy}>복사</Button>
                <Button variant="secondary" onClick={handleDownload}>다운로드</Button>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="mt-6 bg-gray-50 rounded-md px-5 py-3 flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  status.valid ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className={status.valid ? 'text-gray-700' : 'text-red-600'}>
                {status.message}
              </span>
            </div>
            <div className="flex gap-6 text-gray-500">
              <span>입력: {new Blob([input]).size} bytes</span>
              <span>출력: {new Blob([output]).size} bytes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}