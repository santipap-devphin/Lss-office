const useGuid = (): { generateId: Function } => {
  return {
    generateId: () : string => {
      return Date.now().toString(36) + Math.random().toString(36).substring(2);
    },
  };
};
export { useGuid };
