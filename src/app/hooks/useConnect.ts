import { useState, useEffect } from "react";
import { useMagicContext } from "../../components/magic/MagicProvider";

export function useConnect() {
  const [account, setAccount] = useState<string | null>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

    const { magic } = useMagicContext()

  useEffect(() => {
    const user = localStorage.getItem("user");
    setAccount(user);
  }, []);

  const connect = async () => {
    try {
      setLoading(true);
      const accounts = await magic?.wallet.connectWithUI();
      localStorage.setItem("user", accounts[0]);
      setAccount(accounts[0]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  return { account, setAccount, loading, setLoading, error, connect };
}
