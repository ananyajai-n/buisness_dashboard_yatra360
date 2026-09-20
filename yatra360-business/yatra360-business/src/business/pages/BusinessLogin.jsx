import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthSplitLayout from "../components/AuthSplitLayout.jsx";
import { useBusinessAuth } from "../auth/AuthContext.jsx";
import { businessPath } from "../config.js";

export default function BusinessLogin() {
  const { signIn } = useBusinessAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ email: "", password: "" });
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!f.email || !f.password) return setErr("Enter both your work email and password to sign in.");
    setBusy(true); setErr(null);
    const res = await signIn(f.email, f.password);
    setBusy(false);
    if (res?.error) return setErr(res.error.message);
    nav(businessPath("app/overview"));
  };

  return (
    <AuthSplitLayout
      title="Business console"
      intro="Sign in to see demand, visitor profiles and recommended actions for your own block."
      footer={<>No account yet? <Link to={businessPath("register")}>Register your business</Link></>}
    >
      <form onSubmit={submit} noValidate>
        {err && <div className="y-err">{err}</div>}
        <div className="y-field">
          <label htmlFor="le">Work email</label>
          <input id="le" type="email" autoComplete="username" placeholder="you@business.in"
            value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        </div>
        <div className="y-field">
          <label htmlFor="lp">Password</label>
          <input id="lp" type="password" autoComplete="current-password" placeholder="••••••••"
            value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        </div>
        <div className="y-form-actions">
          <button className="y-btn y-btn-primary" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
          <button type="button" className="y-btn" onClick={async () => {
            await signIn("owner@kakahalwai.in", "demo-account");
            nav(businessPath("app/overview"));
          }}>Use demo account</button>
        </div>
      </form>
    </AuthSplitLayout>
  );
}
