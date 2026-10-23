"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { ExpiredSession } from "@/components/layout/ExpiredSession";
import { useTokenValidation } from "@/hooks/useTokenValidation";
import type { TokenPayload } from "@/types/token";

interface SessionContextType {
  token: TokenPayload | null;
  setSessionExpired: () => void;
}

const SessionContext = createContext<SessionContextType>({
  token: null,
  setSessionExpired: () => {},
});

export const useSession = () => useContext(SessionContext);

interface AppProvidersProps {
  children: ReactNode;
  token: TokenPayload | null;
  initialExpired?: boolean;
}

export function SessionProvider({
  children,
  token,
  initialExpired = false,
}: AppProvidersProps) {
  // Estado de expiração da sessão inicializado via prop (ex: do middleware/SSR)
  const [isExpired, setIsExpired] = useState<boolean>(initialExpired);

  // Monitoramento em segundo plano (polling a cada 1 min)
  useTokenValidation(1, isExpired, () => setIsExpired(true));

  if (isExpired) {
    return (
      <div className="h-screen w-screen bg-background flex items-center justify-center">
        <ExpiredSession />
      </div>
    );
  }

  return (
    <SessionContext.Provider
      value={{
        token,
        setSessionExpired: () => setIsExpired(true),
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
