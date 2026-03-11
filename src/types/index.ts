export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'text' | 'encoding' | 'conversion' | 'time';
  path: string;
  icon?: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  tools: Tool[];
}