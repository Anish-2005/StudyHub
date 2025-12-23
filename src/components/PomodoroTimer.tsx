'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface PomodoroTimerProps {
  className?: string;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ className = '' }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const workDuration = 25 * 60; // 25 minutes
  const breakDuration = 5 * 60; // 5 minutes
  const longBreakDuration = 15 * 60; // 15 minutes

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);

    if (!isBreak) {
      // Work session completed
      const newSessions = sessions + 1;
      setSessions(newSessions);

      // Every 4 sessions, take a long break
      if (newSessions % 4 === 0) {
        setTimeLeft(longBreakDuration);
        setIsBreak(true);
        // You could add a notification here
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Time for a long break!', {
            body: 'Great work! Take 15 minutes to relax.',
            icon: '/favicon.svg'
          });
        }
      } else {
        setTimeLeft(breakDuration);
        setIsBreak(true);
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Break time!', {
            body: 'Take 5 minutes to stretch and relax.',
            icon: '/favicon.svg'
          });
        }
      }
    } else {
      // Break completed, start work
      setTimeLeft(workDuration);
      setIsBreak(false);
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Break\'s over! Time to study.', {
          body: 'Time to get back to studying.',
          icon: '/favicon.svg'
        });
      }
    }
  }, [isBreak, sessions, setSessions, setTimeLeft, setIsBreak, setIsRunning, longBreakDuration, breakDuration, workDuration]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, handleTimerComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(workDuration);
    setIsBreak(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((isBreak ? (isBreak ? breakDuration : longBreakDuration) : workDuration) - timeLeft) /
                   (isBreak ? (isBreak ? breakDuration : longBreakDuration) : workDuration) * 100;

  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <h3 className="card-title flex items-center">
          <svg className="w-5 h-5 mr-3 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Pomodoro Timer
        </h3>
        <p className="card-description">
          {isBreak ? 'Take a break and recharge' : 'Focus on your studies'}
        </p>
      </div>

      <div className="text-center">
        {/* Circular Progress */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-secondary-700"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className={`transition-all duration-1000 ease-out ${
                isBreak ? 'text-success-500' : 'text-primary-500'
              }`}
              strokeLinecap="round"
            />
          </svg>

          {/* Timer display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-4xl font-bold mb-2 ${
              isBreak ? 'text-success-400' : 'text-primary-400'
            }`}>
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-secondary-500 font-medium">
              {isBreak ? 'Break Time' : 'Study Time'}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <button
            onClick={toggleTimer}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
              isRunning
                ? 'bg-accent-500 hover:bg-accent-600 text-white'
                : `bg-primary-500 hover:bg-primary-600 text-white`
            }`}
          >
            {isRunning ? (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pause
              </div>
            ) : (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l.707.707A1 1 0 0012.414 11H13m-3 3h1.586a1 1 0 01.707.293l.707.707A1 1 0 0012.414 14H13m3-7v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h1.586a1 1 0 01.707.293l.707.707A1 1 0 0010.414 7H11z" />
                </svg>
                Start
              </div>
            )}
          </button>

          <button
            onClick={resetTimer}
            className="px-4 py-3 bg-secondary-700 hover:bg-secondary-600 text-secondary-300 hover:text-secondary-200 rounded-xl font-semibold transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-secondary-800/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-primary-400">{sessions}</div>
            <div className="text-xs text-secondary-500">Sessions</div>
          </div>
          <div className="bg-secondary-800/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-success-400">
              {Math.floor(sessions * 25 / 60)}h {((sessions * 25) % 60)}m
            </div>
            <div className="text-xs text-secondary-500">Study Time</div>
          </div>
          <div className="bg-secondary-800/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-warning-400">
              {Math.floor((sessions * 5 + Math.floor(sessions / 4) * 10) / 60)}h {((sessions * 5 + Math.floor(sessions / 4) * 10) % 60)}m
            </div>
            <div className="text-xs text-secondary-500">Break Time</div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-primary-500/10 rounded-lg border border-primary-500/20">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-primary-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="text-sm font-semibold text-primary-300 mb-1">Study Tip</div>
              <div className="text-sm text-secondary-400">
                {isBreak
                  ? "Take a short walk, stretch, or practice deep breathing during breaks."
                  : "Focus on one task at a time. Put away distractions and stay present."
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;