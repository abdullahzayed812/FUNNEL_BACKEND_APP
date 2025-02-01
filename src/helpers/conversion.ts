export function toCamelCase(obj: any) {
  if (!obj || typeof obj !== "object") return obj;

  return Object.keys(obj).reduce((acc: any, key: string) => {
    const camelKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
    acc[camelKey] = obj[key];
    return acc;
  }, {});
}
