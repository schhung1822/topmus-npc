type GtagCommand =
  | [command: "js", date: Date]
  | [command: "set", params: Record<string, unknown>]
  | [command: "config", targetId: string, config?: Record<string, unknown>]
  | [command: "event", eventName: string, params?: Record<string, unknown>];

interface Window {
  dataLayer?: unknown[];
  gtag?: (...args: GtagCommand) => void;
}
