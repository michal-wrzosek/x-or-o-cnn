import React from 'react';
import styled from 'styled-components';

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;

const Canvas = styled.canvas`
  width: ${CANVAS_WIDTH}px;
  height: ${CANVAS_HEIGHT}px;
  border: 1px solid #000;
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const getMousePosition = (
  event: MouseEvent,
  canvasRef: React.RefObject<HTMLCanvasElement>
): { x: number, y: number } => {
  if (!canvasRef || !canvasRef.current) return { x: 0, y: 0 };
  const canvas = canvasRef.current;
  const { top, left } = canvas.getBoundingClientRect();
  return {
    x: event.clientX - left,
    y: event.clientY - top,
  }
};

const draw = (event: MouseEvent, canvasRef: React.RefObject<HTMLCanvasElement>) => {
  if (!canvasRef || !canvasRef.current) return;
  const ctx = canvasRef.current.getContext('2d');
  if (!ctx) return;
  
  const { x, y } = getMousePosition(event, canvasRef);

  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

const finishDrawing = (event: MouseEvent, canvasRef: React.RefObject<HTMLCanvasElement>) => {
  if (!canvasRef || !canvasRef.current) return;
  const ctx = canvasRef.current.getContext('2d');
  if (!ctx) return;
  ctx.beginPath();
}

export const CanvasContainer = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  // Drawing
  let drawing = false;
  React.useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      drawing = true;
      draw(event, canvasRef);
    }
    const handleMouseUp = (event: MouseEvent) => {
      drawing = false;
      finishDrawing(event, canvasRef);
    }
    const handleMouseMove = (event: MouseEvent) => {
      if (!drawing) return;
      draw(event, canvasRef);
    };

    if (canvasRef && canvasRef.current) {
      canvasRef.current.addEventListener('mousedown', handleMouseDown);
      canvasRef.current.addEventListener('mouseup', handleMouseUp);
      canvasRef.current.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (canvasRef && canvasRef.current) {
        canvasRef.current.removeEventListener('mousedown', handleMouseDown);
        canvasRef.current.removeEventListener('mouseup', handleMouseUp);
        canvasRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    }
  });

  React.useEffect(() => {
    if (canvasRef && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
    }
  });

  return (
    <Wrapper>
      <Canvas
        ref={canvasRef}
      />
    </Wrapper>
  );
};
