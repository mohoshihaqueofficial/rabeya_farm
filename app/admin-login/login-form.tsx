"use client";

import { useActionState, useState } from "react";
import { loginAdmin, type LoginState } from "./actions";

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAdmin, {});
  const [show, setShow] = useState(false);
  return <form action={action} className="admin-login-form">
    <input type="hidden" name="next" value={next}/>
    <label className="form-field"><span>ইউজারনেম</span><input name="username" required autoComplete="username" autoCapitalize="none" spellCheck={false} autoFocus/></label>
    <label className="form-field"><span>পাসওয়ার্ড</span>
      <div className="password-field"><input name="password" type={show ? "text" : "password"} required autoComplete="current-password"/><button type="button" onClick={() => setShow(!show)} aria-label={show ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}>{show ? "লুকান" : "দেখান"}</button></div>
    </label>
    {state.error && <p className="admin-login-error" role="alert">{state.error}</p>}
    <button className="admin-primary" type="submit" disabled={pending}>{pending ? "যাচাই করা হচ্ছে…" : "লগইন করুন"}</button>
  </form>;
}
