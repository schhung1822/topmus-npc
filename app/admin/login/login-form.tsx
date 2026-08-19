"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type LoginState } from "../actions";

const initialState: LoginState = {};
const inputClasses =
  "mt-2 h-14 w-full rounded-2xl border border-[#ded4e2] bg-white px-4 text-sm text-[#321d38] outline-none transition placeholder:text-[#b1a5b4] focus:border-[#9a2aa4] focus:ring-4 focus:ring-[#9a2aa4]/10";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="mt-1 h-14 w-full cursor-pointer rounded-2xl border-0 bg-[linear-gradient(90deg,#5b0d76,#a128aa,#e03dc9)] px-5 text-sm font-extrabold text-white shadow-[0_13px_28px_rgba(126,28,142,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_17px_34px_rgba(126,28,142,0.28)] disabled:cursor-wait disabled:opacity-65 disabled:hover:translate-y-0" type="submit" disabled={pending}>
      {pending ? "Đang xác thực..." : "Đăng nhập vào quản trị"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="grid gap-5" action={formAction}>
      <label className="text-xs font-extrabold text-[#55405b]" htmlFor="username">
        Tên đăng nhập
        <input className={inputClasses} id="username" name="username" type="text" autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder="Nhập tên đăng nhập" required autoFocus />
      </label>

      <label className="relative text-xs font-extrabold text-[#55405b]" htmlFor="password">
        Mật khẩu
        <input className={`${inputClasses} pr-16`} id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Nhập mật khẩu" required />
        <button className="absolute right-3 bottom-3.5 h-8 cursor-pointer rounded-lg border-0 bg-[#f5ecf7] px-2.5 text-[10px] font-extrabold text-[#792283] transition hover:bg-[#eedcf2]" type="button" aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} aria-pressed={showPassword} onClick={() => setShowPassword((current) => !current)}>
          {showPassword ? "Ẩn" : "Hiện"}
        </button>
      </label>

      {state.error ? (
        <p className="flex items-start gap-2 rounded-xl border border-[#f4cec8] bg-[#fff1ee] px-3.5 py-3 text-xs leading-5 text-[#a43a2c]" role="alert" aria-live="polite"><span className="grid size-[18px] shrink-0 place-items-center rounded-full bg-[#a43a2c] text-[10px] font-black text-white">!</span>{state.error}</p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
