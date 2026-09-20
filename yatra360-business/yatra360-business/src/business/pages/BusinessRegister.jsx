import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthSplitLayout from "../components/AuthSplitLayout.jsx";
import { useBusinessAuth } from "../auth/AuthContext.jsx";
import { businessPath } from "../config.js";

const CATEGORIES = ["Café & restaurant", "Sweets & snacks", "Homestay / hotel", "Guide & tour operator", "Retail & crafts", "Transport & rentals"];
const LOCALITIES = ["Kasba Peth", "Shaniwar Peth", "Deccan Gymkhana", "Koregaon Park", "Camp", "Kothrud", "Viman Nagar", "Hadapsar"];
const SEGMENTS = ["Family", "Solo", "Couples", "Groups", "Walk-in", "Pre-booked"];
const STEPS = ["Identity", "Location", "Offering"];

export default function BusinessRegister() {
  const { signUp } = useBusinessAuth();
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [err, setErr] = useState(null);
  const [f, setF] = useState({
    name: "", category: CATEGORIES[1], phone: "", email: "",
    locality: LOCALITIES[0], address: "", capacity: "40",
    segments: ["Family", "Walk-in"], hours: "09:00–22:00", password: "",
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const validate = () => {
    if (step === 1) {
      if (!f.name.trim()) return "Enter the name your business trades under.";
      if (!/^\S+@\S+\.\S+$/.test(f.email)) return "That email address is incomplete — check the domain.";
    }
    if (step === 2) {
      if (!f.address.trim()) return "Add a street address so we can place you inside a demand radius.";
      if (!/^\d+$/.test(f.capacity)) return "Peak capacity should be a number, e.g. 40.";
    }
    if (step === 3) {
      if (!f.segments.length) return "Pick at least one visitor type you serve.";
      if (f.password.length < 8) return "Passwords need at least 8 characters.";
    }
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return setErr(v);
    setErr(null);
    if (step < 3) return setStep(step + 1);
    await signUp(f.email, f.password, {
      name: f.name, category: f.category, locality: f.locality,
      address: f.address, capacity: Number(f.capacity), segments: f.segments, hours: f.hours,
    });
    nav(businessPath("app/overview"));
  };

  return (
    <AuthSplitLayout
      title="Register your business"
      intro="Three short steps. Once you are listed, tourist itineraries can route demand to your street."
      steps={
        <div className="y-steps">
          {STEPS.map((s, i) => (
            <div key={s} className={"y-step" + (step === i + 1 ? " on" : step > i + 1 ? " done" : "")}>
              <b>{i + 1}</b> {s}
            </div>))}
        </div>}
      footer={<>Already registered? <Link to={businessPath("login")}>Sign in</Link></>}
    >
      <form onSubmit={submit} noValidate>
        {err && <div className="y-err">{err}</div>}

        {step === 1 && (
          <fieldset>
            <div className="y-field"><label htmlFor="rn">Business name</label>
              <input id="rn" value={f.name} onChange={set("name")} placeholder="As it appears on your signboard" /></div>
            <div className="y-row2">
              <div className="y-field"><label htmlFor="rc">What you run</label>
                <select id="rc" value={f.category} onChange={set("category")}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
              <div className="y-field"><label htmlFor="rp">Phone</label>
                <input id="rp" inputMode="tel" value={f.phone} onChange={set("phone")} placeholder="+91" /></div>
            </div>
            <div className="y-field"><label htmlFor="re">Work email</label>
              <input id="re" type="email" value={f.email} onChange={set("email")} placeholder="you@business.in" />
              <p className="y-hint">Used for sign-in and for the daily demand brief. One account per outlet.</p></div>
          </fieldset>)}

        {step === 2 && (
          <fieldset>
            <div className="y-field"><label htmlFor="rl">Locality</label>
              <select id="rl" value={f.locality} onChange={set("locality")}>{LOCALITIES.map((c) => <option key={c}>{c}</option>)}</select>
              <p className="y-hint">Your demand radius is drawn 1.5 km around this point.</p></div>
            <div className="y-field"><label htmlFor="ra">Street address</label>
              <textarea id="ra" rows="3" value={f.address} onChange={set("address")} placeholder="Shop number, lane, landmark" /></div>
            <div className="y-field"><label htmlFor="rcap">Seats or rooms you can serve at peak</label>
              <input id="rcap" inputMode="numeric" value={f.capacity} onChange={set("capacity")} />
              <p className="y-hint">Capacity is what turns a crowd forecast into an actual recommendation.</p></div>
          </fieldset>)}

        {step === 3 && (
          <fieldset>
            <div className="y-field"><label>Who you serve best</label>
              <div className="y-chips">
                {SEGMENTS.map((s) => {
                  const on = f.segments.includes(s);
                  return <button type="button" key={s} className="y-chip" aria-pressed={on}
                    onClick={() => setF({ ...f, segments: on ? f.segments.filter((x) => x !== s) : [...f.segments, s] })}>{s}</button>;
                })}
              </div>
              <p className="y-hint">We match these against the segment mix arriving in your radius.</p></div>
            <div className="y-field"><label htmlFor="rh">Opening hours</label>
              <input id="rh" value={f.hours} onChange={set("hours")} /></div>
            <div className="y-field"><label htmlFor="rpw">Create a password</label>
              <input id="rpw" type="password" autoComplete="new-password" value={f.password} onChange={set("password")} placeholder="At least 8 characters" /></div>
          </fieldset>)}

        <div className="y-form-actions">
          {step > 1 && <button type="button" className="y-btn" onClick={() => setStep(step - 1)}>Back</button>}
          <button className="y-btn y-btn-primary">{step < 3 ? "Continue" : "Create business account"}</button>
          <span className="y-label">Step {step} of 3</span>
        </div>
      </form>
    </AuthSplitLayout>
  );
}
