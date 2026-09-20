import { Link } from "react-router-dom";

/** Landing gate: visitor side vs business side. */
export default function RoleGate() {
  return (
    <div className="y-gate">
      <header className="y-gate-head">
        <div className="y-wordmark"><b>Yatra 360</b> <span>PUNE · MVP</span></div>
        <div className="y-gate-lede">
          <h1>Not just where to go — how, when and why.</h1>
          <p>One platform for the people visiting Pune and the people who make a living from them. Choose the side you are on.</p>
        </div>
      </header>
      <div className="y-gate-grid">
        <Link className="y-gate-card" to="/plan">
          <div><span className="y-gate-tag">For visitors</span><h2>Plan a trip</h2>
            <p>Build an itinerary that reads live weather, crowd levels and road conditions, then routes you around the queues.</p></div>
          <span className="y-go"><i />Continue as a visitor</span>
        </Link>
        <Link className="y-gate-card" to="/business/login">
          <div><span className="y-gate-tag">For businesses and civic bodies</span><h2>Grow with tourism</h2>
            <p>See where demand is heading in your own neighbourhood, who is arriving, and what to do about it before the wave lands.</p></div>
          <span className="y-go"><i />Open the business console</span>
        </Link>
      </div>
    </div>
  );
}
