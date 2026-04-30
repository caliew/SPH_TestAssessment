import { useState, useCallback } from "react";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useApi = <T, Args extends any[]>(
  apiFunc: (...args: Args) => Promise<T>,
  options: { 
    onSuccess?: (data: T, args: Args) => void; 
    onError?: (error: string, args: Args) => void 
  } = {}
) => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: Args) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const data = await apiFunc(...args);
        setState({ data, loading: false, error: null });
        options.onSuccess?.(data, args);
        return data;
      } catch (err: any) {
        const errorMessage = err.message || "An unexpected error occurred";
        setState({ data: null, loading: false, error: errorMessage });
        options.onError?.(errorMessage, args);
        throw err;
      }
    },
    [apiFunc, options]
  );

  return { ...state, execute };
};
