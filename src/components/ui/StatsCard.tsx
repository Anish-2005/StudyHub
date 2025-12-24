'use client';

import React from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'vscode-blue':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'vscode-success':
        return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'vscode-warning':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'vscode-error':
        return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'vscode-accent':
        return 'text-vscode-accent bg-vscode-accent/10 border-vscode-accent/30';
      default:
        return 'text-vscode-text bg-vscode-text/10 border-vscode-text/30';
    }
  };

  return (
    <div className={`p-3 sm:p-4 rounded-lg border ${getColorClasses(color)}`}>
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-vscode-text/70 truncate">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-vscode-text mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-full flex-shrink-0 ${getColorClasses(color)}`}>
          <div className="w-4 h-4 sm:w-6 sm:h-6">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
