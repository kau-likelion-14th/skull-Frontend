function StatCard({ icon, title, statistics }) {
  return (
    <div className="stat-card">
      <div className="stat-title">
        <span>{icon}</span> {title}
      </div>

      <div className="stat-value">
        {statistics?.value}
        <span>{statistics?.unit}</span>
      </div>
    </div>
  );
}

export default StatCard;
