// src/utils/caseConverter.ts

// Converte uma string de camelCase ou PascalCase para snake_case
export function toSnakeCase(str: string): string {
  return str
    // insere _ antes de letras maiúsculas
    .replace(/([A-Z])/g, '_$1')
    // transforma tudo em minúsculo
    .toLowerCase()
    // remove possíveis _ no começo
    .replace(/^_/, '');
}

// Converte todas as chaves de um objeto para snake_case (recursivo)
export function objectKeysToSnakeCase<T extends Record<string, any>>(obj: T): Record<string, any> {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    // se não for objeto simples, retorna como está
    return obj;
  }

  const newObj: Record<string, any> = {};

  Object.keys(obj).forEach((key) => {
    const snakeKey = toSnakeCase(key);
    const value = obj[key];

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      newObj[snakeKey] = objectKeysToSnakeCase(value); // recursão
    } else if (Array.isArray(value)) {
      newObj[snakeKey] = value.map((item) =>
        typeof item === 'object' && item !== null
          ? objectKeysToSnakeCase(item)
          : item
      );
    } else {
      newObj[snakeKey] = value;
    }
  });

  return newObj;
}
