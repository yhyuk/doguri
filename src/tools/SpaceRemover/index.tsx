import { useState } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import TextArea from '../../components/common/TextArea';
import { processText, getTextStats } from './utils';
import type { SpaceRemoverMode } from './utils';

export default function SpaceRemover() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<SpaceRemoverMode>('all');

  const handleProcess = () => {
    if (!input) return;
    const result = processText(input, mode);
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
    setInput('  안녕하세요    공백    제거    도구입니다.  \n\n  여러   공백을   처리합니다.  ');
  };

  const inputStats = getTextStats(input);
  const outputStats = getTextStats(output);

  return (
    <div className="flex flex-col h-full">
      <Header
        title="공백 제거"
        description="텍스트의 공백을 다양한 방법으로 제거합니다"
      />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* Options Panel */}
          <div className="bg-gray-50 rounded-lg p-5 mb-6">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 min-w-[80px]">
                처리 방식
              </label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    value="all"
                    checked={mode === 'all'}
                    onChange={(e) => setMode(e.target.value as SpaceRemoverMode)}
                    className="text-blue-600"
                  />
                  모든 공백 제거
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    value="duplicate"
                    checked={mode === 'duplicate'}
                    onChange={(e) => setMode(e.target.value as SpaceRemoverMode)}
                    className="text-blue-600"
                  />
                  중복 공백 제거
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    value="trim"
                    checked={mode === 'trim'}
                    onChange={(e) => setMode(e.target.value as SpaceRemoverMode)}
                    className="text-blue-600"
                  />
                  앞뒤 공백 제거
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    value="linebreaks"
                    checked={mode === 'linebreaks'}
                    onChange={(e) => setMode(e.target.value as SpaceRemoverMode)}
                    className="text-blue-600"
                  />
                  줄바꿈 제거
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    value="preserve"
                    checked={mode === 'preserve'}
                    onChange={(e) => setMode(e.target.value as SpaceRemoverMode)}
                    className="text-blue-600"
                  />
                  단어 간 공백 유지
                </label>
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
                placeholder="공백이 포함된 텍스트를 입력하세요"
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
                placeholder="처리된 텍스트가 여기에 표시됩니다"
              />
              <div className="flex gap-3 mt-4">
                <Button id="copy-button" onClick={handleCopy}>복사</Button>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="mt-6 bg-gray-50 rounded-md px-5 py-3 flex justify-between items-center text-sm">
            <div className="flex gap-6 text-gray-600">
              <span>입력 공백: {inputStats.spaces}개</span>
              <span>출력 공백: {outputStats.spaces}개</span>
            </div>
            <div className="flex gap-6 text-gray-500">
              <span>입력: {inputStats.total} 문자</span>
              <span>출력: {outputStats.total} 문자</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
