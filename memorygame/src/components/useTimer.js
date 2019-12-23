import { useEffect, useState, useRef } from 'react';

const useTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [timeText, setTimeText] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    const secondsText = ('0' + (seconds % 60)).slice(-2);
    const minutesText = ('0' + (Math.floor(seconds / 60) % 60)).slice(-2);
    const hoursText = ('0' + Math.floor(seconds / 3600)).slice(-2);
    setTimeText(`${hoursText}:${minutesText}:${secondsText}`);
  }, [seconds]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds(oldSeconds => oldSeconds + 1);
    }, 1000);
    return () => {
      clearInterval(timerRef);
    };
  }, []);

  return [timeText];
};

export default useTimer;
