import React from 'react';
import StatCard from './StatCard';

function Status() {
  const stats = [
    { icon: "🔥", title: "연속 달성일", value: "0", unit: "일" },
    { icon: "🎯", title: "최근 30일 달성률", value: "0", unit: "%" },
    { icon: "⭐", title: "가장 많이 완료한 요일", value: "토요일", unit: "" }
  ];

  return (
    <div className="status">
      {stats.map((item, idx) => (
        <StatCard key={idx} {...item} />
      ))}
    </div>
  );
}

export default Status;