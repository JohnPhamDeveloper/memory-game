import React, { useEffect } from 'react';
import './Leaderboard.scss';

// const actualData = [
//   { username: 'cheeseburger', score: 1000 },
//   { username: 'bobby', score: 5552 },
//   { username: 'rolex', score: 5122 },
// ];

// actualData.sort((a, b) => (a.score < b.score ? 1 : -1));

const Leaderboard = ({ show, onClose, leaderboardData }) => {
  console.log('outside data');
  console.log(leaderboardData);

  useEffect(() => {
    console.log('leaderboard daa in');
    console.log(leaderboardData);
  }, [leaderboardData]);

  const renderUserDatas = () => {
    if (leaderboardData && leaderboardData.length > 0) {
      return leaderboardData.map(d => (
        <div key={d.username + d.score} className="leaderboard-user">
          <h2 className="leaderboard-user-name">{d.username}</h2>
          <p className="Leaderboard-user-score">{d.score}</p>
        </div>
      ));
    }

    return <></>;
  };

  return (
    <div
      className="leaderboard"
      style={
        show ? { pointerEvents: 'all', opacity: '1' } : { pointerEvents: 'none', opacity: '0' }
      }
    >
      <div className="leaderboard-display"> {renderUserDatas()}</div>

      <button className="button" onClick={onClose} type="button">
        Close
      </button>
    </div>
  );
};

export default Leaderboard;
