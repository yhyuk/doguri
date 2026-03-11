import { useState } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import TextArea from '../../components/common/TextArea';
import { processBatch, getFormatStats } from './utils';
import type { SeparatorType } from './utils';

export default function CommaFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [separator, setSeparator] = useState<SeparatorType>('comma');
  const [removeMode, setRemoveMode] = useState(false);

  const handleProcess = () => {
    if (!input) return;
    const result = processBatch(input, separator, removeMode);
    setOutput(result);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const handleCopy = async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
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
    setInput('1234567\n890123.45\n금액: 1000000원\n총합: 9876543.21');
  };

  const stats = getFormatStats(input, output);

  return (
    <div className="flex flex-col h-full">
      <Header
        title="콤마 추가"
        description="숫자에 천단위 구분자를 추가하거나 제거합니다"
      />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* Options Panel */}
          <div className="bg-gray-50 rounded-lg p-5 mb-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 min-w-[80px]">
                  구분자
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="separator"
                      value="comma"
                      checked={separator === 'comma'}
                      onChange={(e) => setSeparator(e.target.value as SeparatorType)}
                      className="text-blue-600"
                      disabled={removeMode}
                    />
                    콤마 (,)
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="separator"
                      value="space"
                      checked={separator === 'space'}
                      onChange={(e) => setSeparator(e.target.value as SeparatorType)}
                      className="text-blue-600"
                      disabled={removeMode}
                    />
                    공백 ( )
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="separator"
                      value="period"
                      checked={separator === 'period'}
                      onChange={(e) => setSeparator(e.target.value as SeparatorType)}
                      className="text-blue-600"
                      disabled={removeMode}
                    />
                    마침표 (.)
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 min-w-[80px]">
                  처리 방식
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="mode"
                      value="add"
                      checked={!removeMode}
                      onChange={() => setRemoveMode(false)}
                      className="text-blue-600"
                    />
                    구분자 추가
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="mode"
                      value="remove"
                      checked={removeMode}
                      onChange={() => setRemoveMode(true)}
                      className="text-blue-600"
                    />
                    구분자 제거
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
                placeholder="숫자를 입력하세요 (여러 줄 가능)"
              />
              <div className="flex gap-3 mt-4">
                <Button onClick={handleProcess}>처리하기</Button>
                <Button variant="secondary" onClick={handleClear}>지우기</Button>
                <Button variant="secondary" onClick={handleExample}>예제</Button>
              </div>
            </div>

            <div className="flex flex-col">
              <TextArea
                label="결과"
                value={output}
                readOnly
                placeholder="처리된 숫자가 여기에 표시됩니다"
              />
              <div className="flex gap-3 mt-4">
                <Button id="copy-button" onClick={handleCopy}>복사</Button>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="mt-6 bg-gray-50 rounded-md px-5 py-3 flex justify-between items-center text-sm">
            <div className="flex gap-6 text-gray-600">
              <span>숫자 개수: {stats.inputNumbers}개</span>
              <span>줄 수: {stats.lines}줄</span>
            </div>
            <div className="flex gap-6 text-gray-500">
              <span>입력: {stats.inputLength} 문자</span>
              <span>출력: {stats.outputLength} 문자</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
