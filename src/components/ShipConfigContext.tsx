import { createContext, useContext, useState } from "react";

interface ShipConfig {
  engine: "ion" | "chemical" | "nuclear";
  hull: "lightweight" | "reinforced" | "stealth";
  payload: "science" | "cargo" | "weapons";
}

interface ShipConfigContextValue {
  config: ShipConfig;
  setConfig: (config: ShipConfig) => void;
}

const ShipConfigContext = createContext<ShipConfigContextValue | null>(null);

export function ShipConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ShipConfig>({
    engine: "ion",
    hull: "lightweight",
    payload: "science",
  });

  return (
    <ShipConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ShipConfigContext.Provider>
  );
}

export function useShipConfig() {
  const ctx = useContext(ShipConfigContext);
  if (!ctx) throw new Error("useShipConfig must be used within ShipConfigProvider");
  return ctx;
}
