import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { sound } from '../utils/sound';
import { hsbToHex, getTextColor, scoreHsb } from '../utils/color';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

export function PickerScreen() {
  const { currentHsb, pickerHsb, setPickerHsb, submitRound } = useGameStore();
  const [h, s, b] = pickerHsb;
  
  const bgColor = hsbToHex(h, s, b);
  const textColor = getTextColor(h, s, b);

  const handleSubmit = () => {
    sound.click();
    const score = scoreHsb(currentHsb, pickerHsb);
    submitRound(score, pickerHsb);
  };

  return (
    <motion.div 
      className="flex flex-col h-full w-full relative overflow-hidden transition-colors duration-75"
      style={{ backgroundColor: bgColor, color: textColor }}
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <div className="flex-1 flex flex-col p-6 pb-24">
        <div className="mb-8 text-center">
          <h2 className="text-sm font-bold tracking-widest uppercase opacity-70 mb-2">Recreate</h2>
          <div className="font-mono text-xl font-medium tracking-tight opacity-50">
            H:{Math.round(h)} S:{Math.round(s)} B:{Math.round(b)}
          </div>
        </div>

        <div className="flex-1 flex gap-4 justify-center items-stretch max-w-sm mx-auto w-full">
          <Slider 
            type="hue" 
            value={h} 
            max={360} 
            onChange={(val) => setPickerHsb([val, s, b])} 
            color={textColor} 
          />
          <Slider 
            type="saturation" 
            value={s} 
            max={100} 
            hue={h} 
            brightness={b} 
            onChange={(val) => setPickerHsb([h, val, b])} 
            color={textColor} 
          />
          <Slider 
            type="brightness" 
            value={b} 
            max={100} 
            hue={h} 
            saturation={s} 
            onChange={(val) => setPickerHsb([h, s, val])} 
            color={textColor} 
          />
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center px-8 z-20">
        <button
          onClick={handleSubmit}
          className="group flex items-center justify-center gap-2 w-full max-w-xs py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-2xl"
          style={{ backgroundColor: textColor, color: bgColor }}
        >
          <Check className="w-5 h-5" />
          Submit Color
        </button>
      </div>
    </motion.div>
  );
}

interface SliderProps {
  type: 'hue' | 'saturation' | 'brightness';
  value: number;
  max: number;
  hue?: number;
  saturation?: number;
  brightness?: number;
  onChange: (val: number) => void;
  color: string;
}

function Slider({ type, value, max, hue = 0, saturation = 100, brightness = 100, onChange, color }: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const getGradient = () => {
    if (type === 'hue') {
      return 'linear-gradient(to top, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)';
    }
    if (type === 'saturation') {
      const fullColor = hsbToHex(hue, 100, brightness);
      const grayColor = hsbToHex(hue, 0, brightness);
      return `linear-gradient(to top, ${grayColor}, ${fullColor})`;
    }
    if (type === 'brightness') {
      const fullColor = hsbToHex(hue, saturation, 100);
      return `linear-gradient(to top, #000000, ${fullColor})`;
    }
    return '';
  };

  const handleMove = (clientY: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    let y = clientY - rect.top;
    y = Math.max(0, Math.min(y, rect.height));
    const percentage = 1 - y / rect.height; // Invert so bottom is 0
    const newValue = percentage * max;
    
    if (Math.abs(newValue - value) > max * 0.01) {
      sound.tick();
    }
    onChange(newValue);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    handleMove(e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (isDragging.current) {
      handleMove(e.clientY);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const percentage = (value / max) * 100;

  return (
    <div className="flex-1 flex flex-col items-center gap-3">
      <div className="text-xs font-bold tracking-widest uppercase opacity-50">
        {type[0]}
      </div>
      <div 
        ref={trackRef}
        className="relative w-12 flex-1 rounded-full overflow-hidden shadow-inner cursor-pointer touch-none"
        style={{ background: getGradient(), border: `2px solid ${color}40` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div 
          className="absolute left-0 right-0 h-8 rounded-full shadow-md pointer-events-none transition-transform duration-75"
          style={{ 
            bottom: `${percentage}%`, 
            transform: 'translateY(50%) scale(1.1)',
            backgroundColor: color,
            border: `4px solid ${hsbToHex(hue, type === 'saturation' ? value : saturation, type === 'brightness' ? value : brightness)}`
          }}
        />
      </div>
    </div>
  );
}
