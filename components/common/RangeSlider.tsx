import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Budget } from '../../types';

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  initialValues: Budget;
  onChange: (values: Budget) => void;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({ min, max, step, initialValues, onChange }) => {
  const [minVal, setMinVal] = useState(initialValues.min ?? min);
  const [maxVal, setMaxVal] = useState(initialValues.max ?? max);
  const minValRef = useRef<HTMLInputElement>(null);
  const maxValRef = useRef<HTMLInputElement>(null);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback((value: number) =>
    Math.round(((value - min) / (max - min)) * 100), [min, max]);

  // Set width of the range to decrease from the left side
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(+maxValRef.current.value); // Preceding with `+` converts the value from type string to type number

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(maxVal);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxVal, getPercent]);

  // Get min and max values when their state changes
  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  return (
    <div className="w-full mt-12 mb-4">
      <div className="relative h-10 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          ref={minValRef}
          onChange={(event) => {
            const value = Math.min(+event.target.value, maxVal - step);
            setMinVal(value);
          }}
          className="thumb thumb--zindex-3"
          style={{ zIndex: minVal > max - 100 ? 5 : 3 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          ref={maxValRef}
          onChange={(event) => {
            const value = Math.max(+event.target.value, minVal + step);
            setMaxVal(value);
          }}
          className="thumb thumb--zindex-4"
        />

        <div className="relative w-full">
          <div className="slider__track absolute w-full h-1.5 bg-ion-gray-medium rounded-full z-10" />
          <div ref={range} className="slider__range absolute h-1.5 bg-ion-blue rounded-full z-20" />
        </div>
      </div>
      <div className="flex justify-between mt-4 text-sm text-ion-gray-dark font-medium">
        <span>{formatCurrency(minVal)}</span>
        <span>{formatCurrency(maxVal)}</span>
      </div>
       <style>{`
          .thumb {
              pointer-events: none;
              position: absolute;
              height: 0;
              width: 100%;
              outline: none;
              -webkit-appearance: none;
              -moz-appearance: none;
              appearance: none;
              background-color: transparent;
          }
          .thumb::-webkit-slider-thumb {
              -webkit-appearance: none;
              -moz-appearance: none;
              appearance: none;
              pointer-events: all;
              width: 24px;
              height: 24px;
              background-color: #fff;
              border-radius: 50%;
              border: 3px solid #0033A0;
              cursor: pointer;
              box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.1);
              margin-top: -10px; /* center thumb on the track */
          }
          .thumb::-moz-range-thumb {
              -webkit-appearance: none;
              -moz-appearance: none;
              appearance: none;
              pointer-events: all;
              width: 24px;
              height: 24px;
              background-color: #fff;
              border-radius: 50%;
              border: 3px solid #0033A0;
              cursor: pointer;
          }
      `}</style>
    </div>
  );
};
