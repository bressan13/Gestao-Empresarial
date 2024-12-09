import React from 'react';
import { DayPicker } from 'react-day-picker';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import 'react-day-picker/dist/style.css';

interface CalendarProps {
  selectedDate?: Date;
  onSelect?: (date: Date) => void;
  events?: Array<{
    date: Date;
    title: string;
    type: 'task' | 'meeting' | 'deadline';
  }>;
}

export function Calendar({ selectedDate, onSelect, events = [] }: CalendarProps) {
  const footer = selectedDate ? (
    <p className="mt-4 text-gray-600 dark:text-gray-300">
      Data selecionada: {format(selectedDate, 'dd/MM/yyyy')}
    </p>
  ) : (
    <p className="mt-4 text-gray-600 dark:text-gray-300">Selecione uma data</p>
  );

  const eventDates = events.map((event) => event.date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
    >
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onSelect}
        locale={ptBR}
        footer={footer}
        modifiers={{
          event: eventDates,
        }}
        modifiersStyles={{
          event: {
            fontWeight: 'bold',
            color: 'var(--primary-600)',
            textDecoration: 'underline',
          },
        }}
        className="!font-sans"
        classNames={{
          day: 'text-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors',
          selected: 'bg-primary-600 text-white hover:bg-primary-700',
          today: 'text-primary-600 font-bold',
        }}
      />
      {events.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-semibold text-gray-700 dark:text-gray-200">
            Eventos do Dia
          </h4>
          {events
            .filter(
              (event) =>
                selectedDate &&
                format(event.date, 'yyyy-MM-dd') ===
                  format(selectedDate, 'yyyy-MM-dd')
            )
            .map((event, index) => (
              <div
                key={index}
                className="p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
              >
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {event.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {format(event.date, 'HH:mm')}
                </p>
              </div>
            ))}
        </div>
      )}
    </motion.div>
  );
}