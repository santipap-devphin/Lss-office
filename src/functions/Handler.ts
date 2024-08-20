export function nullToEmpty<T>(data: T): T {
  let temp = data as Record<string, any>;
  for (let key in temp) {
    if (temp[key] === null) {
      temp[key] = "";
    }
  }
  return temp as T;
}
