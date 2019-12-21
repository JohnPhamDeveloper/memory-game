import React, { useEffect } from 'react';
import Modal from './Modal';
import './Leaderboard.scss';

const Leaderboard = ({ show, onClose, leaderboardData }) => {
  const renderUserDatas = () => {
    if (leaderboardData && leaderboardData.length > 0) {
      return leaderboardData.map(d => (
        <div key={d.username + d.score} className="leaderboard-user">
          <h2 className="leaderboard-user-name">{d.username}</h2>
          <p className="leaderboard-user-score">{d.score}</p>
        </div>
      ));
    }

    return <></>;
  };

  return (
    <Modal show={show} onClose={onClose}>
      {renderUserDatas()}
    </Modal>
  );
};

export default Leaderboard;
