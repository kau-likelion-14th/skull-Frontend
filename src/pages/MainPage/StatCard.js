function StatCard({ icon, title, value, unit }) {
  return (
    <div className="stat-card">
      <div className="stat-title">
        <span>{icon}</span> {title}
      </div>
      <div className="stat-value">
        {value} <span>{unit}</span>
      </div>
    </div>
  );
}

export default StatCard; 