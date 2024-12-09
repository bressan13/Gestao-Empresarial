import React from 'react';
import { motion } from 'framer-motion';
import { Tooltip } from './Tooltip';

interface KPICardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  color: string;
  tooltip?: string;
}

export function KPICard({ title, value, description, icon, color, tooltip }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative"
    >
      <Tooltip content={tooltip}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
              {title}
            </h3>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {description}
              </p>
            )}
          </div>
          <div className={`${color} opacity-80`}>{icon}</div>
        </div>
      </Tooltip>
    </motion.div>
  );
}