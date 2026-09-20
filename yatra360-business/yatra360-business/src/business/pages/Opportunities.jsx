import { useDashboard } from "../data/useDashboard.js";
import OpportunityCard from "../components/OpportunityCard.jsx";

export default function Opportunities() {
  const { opps, accepted, accept, unaccept } = useDashboard();
  return (
    <>
      <header className="y-page-head">
        <div><h1>AI opportunities</h1><p>Recommended actions, each traced back to the signal that produced it.</p></div>
        <span className="y-label">{opps.length} OPEN · {Object.keys(accepted).length} IN YOUR PLAN</span>
      </header>
      <div className="y-sheet y-one">
        <div className="y-col">
          <section className="y-mod">
            <p className="y-note">Plain-language actions generated from the city-wide models. Each one names the signal it came from, so you can disagree with it.</p>
            {opps.map((o) => (
              <OpportunityCard key={o.id} opp={o} accepted={!!accepted[o.id]} onAccept={accept} onRemove={unaccept} />))}
          </section>
        </div>
      </div>
    </>
  );
}
