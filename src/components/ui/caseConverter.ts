
// src/components/ui/caseConverter.ts

export function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  } else if (obj && typeof obj === 'object') {
    const newObj: any = {};
    Object.keys(obj).forEach((key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      newObj[camelKey] = toCamelCase(obj[key]);
    });
    return newObj;
  }
  return obj;
}

export function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  } else if (obj && typeof obj === 'object') {
    const newObj: any = {};
    Object.keys(obj).forEach((key) => {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      newObj[snakeKey] = toSnakeCase(obj[key]);
    });
    return newObj;
  }
  return obj;
}
