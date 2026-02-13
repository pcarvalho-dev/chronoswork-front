'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface CustomDatePickerProps {
  value: string | undefined; // formato: YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  min?: string;
  max?: string;
}

export default function CustomDatePicker({
  value,
  onChange,
  placeholder = 'Selecione uma data',
  required = false,
  disabled = false,
  className = '',
  id,
  name,
  min,
  max,
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0, width: 0, openUp: false });
  const [showMonthSelect, setShowMonthSelect] = useState(false);
  const [showYearSelect, setShowYearSelect] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const monthSelectRef = useRef<HTMLDivElement>(null);
  const yearSelectRef = useRef<HTMLDivElement>(null);

  // Format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
  };

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const pickerHeight = 420; // approximate calendar height
    const spaceBelow = window.innerHeight - rect.bottom - 8;
    const spaceAbove = rect.top - 8;
    const openUp = spaceBelow < pickerHeight && spaceAbove > spaceBelow;

    setPickerPosition({
      top: openUp ? rect.top - 8 : rect.bottom + 8,
      left: rect.left,
      width: Math.max(rect.width, 320),
      openUp,
    });
  }, []);

  // Calculate picker position and handle external scroll
  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const handleScroll = (event: Event) => {
      const target = event.target as Node;
      // Don't close if scrolling inside the picker or its sub-dropdowns
      if (
        (pickerRef.current && pickerRef.current.contains(target)) ||
        (monthSelectRef.current && monthSelectRef.current.contains(target)) ||
        (yearSelectRef.current && yearSelectRef.current.contains(target))
      ) {
        return;
      }
      setIsOpen(false);
      setShowMonthSelect(false);
      setShowYearSelect(false);
    };

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  // Close picker when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Close month/year selects if clicking outside them
      if (monthSelectRef.current && !monthSelectRef.current.contains(target)) {
        setShowMonthSelect(false);
      }
      if (yearSelectRef.current && !yearSelectRef.current.contains(target)) {
        setShowYearSelect(false);
      }

      // Close main picker if clicking outside
      if (
        containerRef.current && !containerRef.current.contains(target) &&
        pickerRef.current && !pickerRef.current.contains(target)
      ) {
        setIsOpen(false);
        setShowMonthSelect(false);
        setShowYearSelect(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Initialize current month based on value
  useEffect(() => {
    if (value) {
      const date = new Date(value + 'T00:00:00');
      setCurrentMonth(date);
    }
  }, [value]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleDateSelect = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    onChange(`${year}-${month}-${day}`);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    handleDateSelect(today);
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
  };

  // Generate calendar days
  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isDateSelected = (date: Date) => {
    if (!value) return false;
    const selectedDate = new Date(value + 'T00:00:00');
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isDateDisabled = (date: Date) => {
    if (min) {
      const minDate = new Date(min + 'T00:00:00');
      if (date < minDate) return true;
    }
    if (max) {
      const maxDate = new Date(max + 'T00:00:00');
      if (date > maxDate) return true;
    }
    return false;
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const handleMonthChange = (month: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), month));
    setShowMonthSelect(false);
  };

  const handleYearChange = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth()));
    setShowYearSelect(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Hidden native input for form compatibility */}
      <input
        type="date"
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* Custom date picker trigger */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          w-full px-4 py-3 border border-white/30 rounded-xl
          bg-white/50 backdrop-blur-md
          focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400/50
          transition-all duration-300 cursor-pointer
          flex items-center justify-between
          text-left
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/60'}
        `}
        style={{
          boxShadow: '0 4px 16px rgba(31, 38, 135, 0.08)',
        }}
      >
        <span className={value ? 'text-warmGrey-900' : 'text-warmGrey-500'}>
          {value ? formatDate(value) : placeholder}
        </span>
        <svg
          className="w-5 h-5 text-warmGrey-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>

      {/* Custom calendar picker - rendered in portal */}
      {isOpen && typeof window !== 'undefined' && createPortal(
        <div
          ref={pickerRef}
          className="fixed py-4 px-4 bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl shadow-xl"
          style={{
            top: pickerPosition.openUp ? undefined : `${pickerPosition.top}px`,
            bottom: pickerPosition.openUp ? `${window.innerHeight - pickerPosition.top}px` : undefined,
            left: `${pickerPosition.left}px`,
            width: `${pickerPosition.width}px`,
            boxShadow: '0 12px 40px rgba(31, 38, 135, 0.2)',
            zIndex: 9999,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 gap-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 rounded-lg hover:bg-warmGrey-100 transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5 text-warmGrey-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center gap-2 flex-1 justify-center">
              {/* Month selector */}
              <div ref={monthSelectRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowMonthSelect(!showMonthSelect);
                    setShowYearSelect(false);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-warmGrey-200 bg-white/80 hover:bg-white text-sm font-semibold text-warmGrey-900 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all cursor-pointer flex items-center gap-1"
                >
                  {monthNames[currentMonth.getMonth()]}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showMonthSelect && (
                  <div className="absolute top-full left-0 mt-1 w-40 bg-white/95 backdrop-blur-lg border border-warmGrey-200 rounded-lg shadow-xl max-h-60 overflow-y-auto overscroll-contain z-[10000]">
                    {monthNames.map((month, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleMonthChange(index)}
                        className={`w-full px-3 py-2 text-left text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          index === currentMonth.getMonth()
                            ? 'bg-gradient-to-r from-primary-50 to-cyan-50 text-primary-700 font-medium'
                            : 'text-warmGrey-800 hover:bg-warmGrey-100'
                        }`}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Year selector */}
              <div ref={yearSelectRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowYearSelect(!showYearSelect);
                    setShowMonthSelect(false);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-warmGrey-200 bg-white/80 hover:bg-white text-sm font-semibold text-warmGrey-900 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all cursor-pointer flex items-center gap-1"
                >
                  {currentMonth.getFullYear()}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showYearSelect && (
                  <div className="absolute top-full left-0 mt-1 w-24 bg-white/95 backdrop-blur-lg border border-warmGrey-200 rounded-lg shadow-xl max-h-60 overflow-y-auto overscroll-contain z-[10000]">
                    {yearOptions.map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => handleYearChange(year)}
                        className={`w-full px-3 py-2 text-left text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          year === currentMonth.getFullYear()
                            ? 'bg-gradient-to-r from-primary-50 to-cyan-50 text-primary-700 font-medium'
                            : 'text-warmGrey-800 hover:bg-warmGrey-100'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-warmGrey-100 transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5 text-warmGrey-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-medium text-warmGrey-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {generateCalendar().map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const selected = isDateSelected(date);
              const today = isToday(date);
              const dateDisabled = isDateDisabled(date);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => !dateDisabled && handleDateSelect(date)}
                  disabled={dateDisabled}
                  className={`
                    aspect-square rounded-lg text-sm font-medium transition-all duration-150
                    ${selected
                      ? 'bg-gradient-to-r from-primary-500 to-cyan-500 text-white shadow-md'
                      : today
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : dateDisabled
                      ? 'text-warmGrey-300 cursor-not-allowed'
                      : 'text-warmGrey-800 hover:bg-warmGrey-100'
                    }
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-warmGrey-200">
            <button
              type="button"
              onClick={handleToday}
              className="px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              Hoje
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1.5 text-sm font-medium text-warmGrey-600 hover:bg-warmGrey-100 rounded-lg transition-colors"
            >
              Limpar
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
