import { useState } from 'react';

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

interface JsonTreeViewProps {
  data: JsonValue;
  /** null이면 depth<2 기본 펼침, true/false면 전체 펼침/접힘 */
  forceOpen: boolean | null;
  /** 값이 바뀔 때마다 트리를 리마운트해 forceOpen을 재적용 */
  remountKey: number;
}

const INDENT_WIDTH = 20; // px per depth level

function valueClass(value: JsonValue): string {
  if (typeof value === 'string') return 'text-green-600';
  if (typeof value === 'number') return 'text-blue-600';
  if (typeof value === 'boolean') return 'text-purple-600';
  if (value === null) return 'text-gray-400';
  return 'text-gray-800';
}

function renderPrimitive(value: JsonValue): string {
  if (typeof value === 'string') return `"${value}"`;
  if (value === null) return 'null';
  return String(value);
}

interface NodeProps {
  nodeKey?: string | number;
  value: JsonValue;
  depth: number;
  isLast: boolean;
  /** null이면 depth<2 기본 펼침, true/false면 강제 펼침/접힘 */
  forceOpen: boolean | null;
}

function TreeNode({ nodeKey, value, depth, isLast, forceOpen }: NodeProps) {
  const defaultOpen = forceOpen === null ? depth < 2 : forceOpen;
  const [open, setOpen] = useState(defaultOpen);

  const isObject = typeof value === 'object' && value !== null;
  const isArray = Array.isArray(value);
  const paddingLeft = depth * INDENT_WIDTH;

  const keyLabel =
    nodeKey !== undefined ? (
      <span className="text-gray-700 font-medium">
        {typeof nodeKey === 'string' ? `"${nodeKey}"` : nodeKey}
      </span>
    ) : null;

  // 원시값(leaf)
  if (!isObject) {
    return (
      <div
        className="flex items-start hover:bg-blue-50/50 rounded px-1 leading-6"
        style={{ paddingLeft }}
      >
        <span className="inline-block w-4 shrink-0" />
        {keyLabel}
        {keyLabel && <span className="text-gray-400 mr-1">:</span>}
        <span className={valueClass(value)}>{renderPrimitive(value)}</span>
        {!isLast && <span className="text-gray-400">,</span>}
      </div>
    );
  }

  const entries: [string | number, JsonValue][] = isArray
    ? (value as JsonValue[]).map((v, i) => [i, v])
    : Object.entries(value as { [key: string]: JsonValue });

  const openBracket = isArray ? '[' : '{';
  const closeBracket = isArray ? ']' : '}';
  const count = entries.length;

  return (
    <div>
      <div
        className="flex items-start hover:bg-blue-50/50 rounded px-1 leading-6 cursor-pointer select-none"
        style={{ paddingLeft }}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="inline-block w-4 shrink-0 text-gray-400">
          {count > 0 ? (open ? '▼' : '▶') : ''}
        </span>
        {keyLabel}
        {keyLabel && <span className="text-gray-400 mr-1">:</span>}
        <span className="text-gray-500">{openBracket}</span>
        {!open && (
          <span className="text-gray-400 italic mx-1">
            {count}
            {isArray ? ' items' : ' keys'}
          </span>
        )}
        {!open && <span className="text-gray-500">{closeBracket}</span>}
        {!open && !isLast && <span className="text-gray-400">,</span>}
      </div>

      {open && (
        <div className="relative">
          {/* depth 가이드 세로선 — 어느 블록에 속한 줄인지 한눈에 보이게 */}
          <div
            className="absolute top-0 bottom-0 border-l border-gray-200"
            style={{ left: paddingLeft + 8 }}
          />
          {entries.map(([k, v], idx) => (
            <TreeNode
              key={String(k)}
              nodeKey={isArray ? undefined : k}
              value={v}
              depth={depth + 1}
              isLast={idx === entries.length - 1}
              forceOpen={forceOpen}
            />
          ))}
          <div
            className="flex items-start leading-6 px-1"
            style={{ paddingLeft }}
          >
            <span className="inline-block w-4 shrink-0" />
            <span className="text-gray-500">{closeBracket}</span>
            {!isLast && <span className="text-gray-400">,</span>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function JsonTreeView({ data, forceOpen, remountKey }: JsonTreeViewProps) {
  return (
    <div className="h-full overflow-auto p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50">
      <TreeNode key={remountKey} value={data} depth={0} isLast forceOpen={forceOpen} />
    </div>
  );
}
