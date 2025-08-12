import React from 'react'
import MatchCard from './MatchCard';

function MatchGrid({matches}) {
  return (
    <section className="px-4 py-8">
    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map((match, index) => (
        <MatchCard key={index} match={match} />
      ))}
    </div>
  </section>
  );
}

export default MatchGrid
