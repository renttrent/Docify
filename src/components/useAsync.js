import { useState } from "react";

export function useAsync(req) {
  const [state, setState] = useState({
    pending: false,
    error: null,
    data: null,
  });

  async function call(params) {
    setState((state) => ({
      ...state,
      pending: true,
      data: null,
      error: null,
    }));

    try {
      const data = await req(params);

      setState((state) => ({
        ...state,
        pending: false,
        data,
      }));

      return { data };
    } catch (error) {
      setState((state) => ({
        ...state,
        pending: false,
        error,
      }));

      return { error };
    }
  }

  return {
    ...state,
    call,
  };
}

export default useAsync;
