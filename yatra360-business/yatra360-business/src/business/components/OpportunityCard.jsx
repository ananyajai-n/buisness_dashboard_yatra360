export default function OpportunityCard({ opp, accepted, onAccept, onRemove, onDismiss }) {
  return (
    <article className="y-opp">
      <div className="y-opp-top"><h4>{opp.title}</h4><span className="y-win">{opp.window}</span></div>
      <p className="y-opp-body">{opp.body}</p>
      <p className="y-why">{opp.signal}</p>
      <div className="y-opp-actions">
        {accepted ? (
          <>
            <span className="y-tagged">Added to your plan</span>
            <button className="y-btn y-btn-ghost" onClick={() => onRemove(opp.id)}>Remove</button>
          </>) : (
          <>
            <button className="y-btn y-btn-primary" onClick={() => onAccept(opp.id)}>Add to plan</button>
            <button className="y-btn" onClick={() => onDismiss?.(opp.id)}>Not for us</button>
          </>)}
        <span className="y-conf">confidence <i><b style={{ width: `${opp.confidence}%` }} /></i> {opp.confidence}%</span>
      </div>
    </article>
  );
}
