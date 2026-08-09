"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authFetch } from "@/lib/auth";

interface SettingsData {
  displayName: string;
  language: string;
  defaultPersona: string;
  autoGenerateTitle: boolean;
  theme: string;
  compactSidebar: boolean;
  emailNotifications: boolean;
  inAppSound: boolean;
  tradingGoal: string;
  tradingBackground: string;
  communicationStyle: string;
  tradingInstrument: string;
  tradingStruggle: string;
}

const DEFAULTS: SettingsData = {
  displayName: "",
  language: "en",
  defaultPersona: "",
  autoGenerateTitle: true,
  theme: "dark",
  compactSidebar: false,
  emailNotifications: true,
  inAppSound: true,
  tradingGoal: "",
  tradingBackground: "",
  communicationStyle: "",
  tradingInstrument: "",
  tradingStruggle: "",
};

interface SettingsContextValue {
  data: SettingsData;
  setField: <K extends keyof SettingsData>(
    key: K,
    value: SettingsData[K],
  ) => void;
  isDirty: boolean;
  isLoading: boolean;
  isSaving: boolean;
  save: () => Promise<boolean>;
  reset: () => void;
  refetch: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [original, setOriginal] = useState<SettingsData>(DEFAULTS);
  const [data, setData] = useState<SettingsData>(DEFAULTS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
      );
      if (res.ok) {
        const user = await res.json();
        const loaded: SettingsData = {
          displayName: user.name ?? "",
          language: user.language ?? "id",
          defaultPersona: user.defaultPersona ?? "",
          autoGenerateTitle: user.autoGenerateTitle ?? true,
          theme: user.theme ?? "dark",
          compactSidebar: user.compactSidebar ?? false,
          emailNotifications: user.emailNotifications ?? true,
          inAppSound: user.inAppSound ?? true,
          tradingGoal: user.tradingGoal ?? "",
          tradingBackground: user.tradingBackground ?? "",
          communicationStyle: user.communicationStyle ?? "",
          tradingInstrument: user.tradingInstrument ?? "",
          tradingStruggle: user.tradingStruggle ?? "",
        };
        setOriginal(loaded);
        setData(loaded);
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const setField: SettingsContextValue["setField"] = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const isDirty = JSON.stringify(data) !== JSON.stringify(original);

  const save = async () => {
    setIsSaving(true);
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.displayName,
            language: data.language,
            defaultPersona: data.defaultPersona,
            autoGenerateTitle: data.autoGenerateTitle,
            theme: data.theme,
            compactSidebar: data.compactSidebar,
            emailNotifications: data.emailNotifications,
            inAppSound: data.inAppSound,
            tradingGoal: data.tradingGoal,
            tradingBackground: data.tradingBackground,
            communicationStyle: data.communicationStyle,
            tradingInstrument: data.tradingInstrument,
            tradingStruggle: data.tradingStruggle,
          }),
        },
      );
      if (res.ok) {
        setOriginal(data);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to save settings:", err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const reset = () => setData(original);

  return (
    <SettingsContext.Provider
      value={{
        data,
        setField,
        isDirty,
        isLoading,
        isSaving,
        save,
        reset,
        refetch: fetchSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
