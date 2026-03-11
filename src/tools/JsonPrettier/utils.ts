export function formatJson(input: string, indent: number | string = 2): string {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, indent);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
}

export function minifyJson(input: string): string {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
}

export function sortJsonKeys(input: string, order: 'asc' | 'desc' = 'asc'): string {
  try {
    const parsed = JSON.parse(input);
    const sorted = sortObject(parsed, order);
    return JSON.stringify(sorted, null, 2);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
}

function sortObject(obj: any, order: 'asc' | 'desc'): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sortObject(item, order));
  }

  const sortedKeys = Object.keys(obj).sort((a, b) => {
    return order === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
  });

  const sortedObj: any = {};
  sortedKeys.forEach(key => {
    sortedObj[key] = sortObject(obj[key], order);
  });

  return sortedObj;
}

export function validateJson(input: string): { valid: boolean; error?: string } {
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid JSON'
    };
  }
}