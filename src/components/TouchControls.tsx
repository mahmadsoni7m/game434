import React, { useRef, useState, useEffect } from 'react';
import { Zap, AlertTriangle } from 'lucide-react';
import { Vector2 } from '../game/types';

interface TouchControlsProps {
  onMove: (vec: Vector2) => void;
  onDash: () => void;
  onNova: () => void;
  dashReady: boolean;
  novaReady: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onMove,
  onDash,
  onNova,
  dashReady,
  novaReady,
}) => {
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [touchActive, setTouchActive] = useState(false);
  const [knobPos, setKnobPos] = useState<Vector2>({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
    }
  }, []);

  if (!isTouchDevice) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setTouchActive(true);
    handleTouchMove(e);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const touch = e.touches[0];
    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const dist = Math.hypot(dx, dy);
    const knobRadius = 24;
    const maxRadius = Math.max(12, rect.width / 2 - knobRadius);

    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(dy, dx);
    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    setKnobPos({ x: knobX, y: knobY });
    onMove({
      x: knobX / maxRadius,
      y: knobY / maxRadius,
    });
  };

  const handleTouchEnd = () => {
    setTouchActive(false);
    setKnobPos({ x: 0, y: 0 });
    onMove({ x: 0, y: 0 });
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none flex justify-between items-end p-[max(14px,env(safe-area-inset-bottom))] pl-[max(14px,env(safe-area-inset-left))] pr-[max(14px,env(safe-area-inset-right))]">
      {/* Virtual Joystick */}
      <div
        ref={joystickBaseRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="touch-joystick rounded-full bg-slate-900/70 border-2 border-cyan-400/60 relative flex items-center justify-center pointer-events-auto touch-none shadow-[0_0_24px_rgba(6,182,212,0.18)]"
      >
        <div
          className="touch-joystick-knob rounded-full bg-cyan-400/90 border-2 border-white shadow-[0_0_14px_#38bdf8] pointer-events-none"
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          }}
        />
      </div>

      {/* Action Buttons for Mobile */}
      <div className="flex flex-col gap-3 pointer-events-auto touch-action-stack">
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            onNova();
          }}
          className={`touch-action-button touch-action-button-nova rounded-full flex items-center justify-center border ${
            novaReady
              ? 'bg-rose-600/90 border-white text-white shadow-[0_0_15px_#f43f5e]'
              : 'bg-slate-900/60 border-slate-700 text-slate-500'
          }`}
        >
          <AlertTriangle className="w-7 h-7" />
        </button>

        <button
          onTouchStart={(e) => {
            e.preventDefault();
            onDash();
          }}
          className={`touch-action-button touch-action-button-dash rounded-full flex items-center justify-center border ${
            dashReady
              ? 'bg-cyan-500/90 border-white text-slate-950 shadow-[0_0_15px_#38bdf8]'
              : 'bg-slate-900/60 border-slate-700 text-slate-500'
          }`}
        >
          <Zap className="w-8 h-8 fill-current" />
        </button>
      </div>
    </div>
  );
};
