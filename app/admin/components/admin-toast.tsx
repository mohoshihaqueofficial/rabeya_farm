import { Icon } from "./icons";

export default function AdminToast({ toast, onClose }: { toast: { text: string; tone: "success" | "error"; key: number } | null; onClose: () => void }) {
  if (!toast) return null;
  return <div key={toast.key} className={`admin-toast ${toast.tone}`} role={toast.tone === "error" ? "alert" : "status"}><span>{toast.tone === "success" ? <Icon name="check" size={15}/> : "!"}</span><p>{toast.text}</p><button type="button" onClick={onClose} aria-label="বন্ধ করুন">×</button></div>;
}
