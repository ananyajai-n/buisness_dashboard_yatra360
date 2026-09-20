import { Link } from "react-router-dom";
import RotatingPlates from "./RotatingPlates.jsx";
import { EXIT_TO_TOURIST } from "../config.js";

/** Form on the left, living visual panel on the right. Stacks under 860px. */
export default function AuthSplitLayout({ title, intro, steps, children, footer }) {
  return (
    <div className="y-split">
      <section className="y-split-form">
        {EXIT_TO_TOURIST.startsWith("http")
          ? <a className="y-btn y-btn-ghost y-back" href={EXIT_TO_TOURIST}>Back to Yatra 360</a>
          : <Link className="y-btn y-btn-ghost y-back" to={EXIT_TO_TOURIST}>Back to Yatra 360</Link>}
        <h1 className="y-auth-title">{title}</h1>
        <p className="y-auth-sub">{intro}</p>
        {steps}
        {children}
        {footer && <p className="y-form-foot">{footer}</p>}
      </section>
      <RotatingPlates />
    </div>
  );
}
