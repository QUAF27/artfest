import React from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

// Deterministic 21x21 QR-like matrix generator for robust offline visual QR display
export const QRCodeView: React.FC<QRCodeProps> = ({ value, size = 128, className = '' }) => {
  const hash = Array.from(value).reduce((acc, char, i) => acc + char.charCodeAt(0) * (i + 1), 0);
  const matrixSize = 21;
  const cells: boolean[][] = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(false));

  // Corner finder patterns (7x7)
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 || // Outer ring
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)      // Inner box
        ) {
          cells[startY + r][startX + c] = true;
        }
      }
    }
  };

  drawFinder(0, 0); // Top-left
  drawFinder(matrixSize - 7, 0); // Top-right
  drawFinder(0, matrixSize - 7); // Bottom-left

  // Timing patterns
  for (let i = 8; i < matrixSize - 8; i++) {
    cells[6][i] = i % 2 === 0;
    cells[i][6] = i % 2 === 0;
  }

  // Populate data pseudo-randomly using hash and character codes
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      // Skip finder zones
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= matrixSize - 8;
      const inBottomLeft = r >= matrixSize - 8 && c < 8;
      if (!inTopLeft && !inTopRight && !inBottomLeft) {
        const seedVal = (hash * (r + 1) * 31 + (c + 1) * 17 + value.charCodeAt((r + c) % value.length)) % 100;
        cells[r][c] = seedVal > 48;
      }
    }
  }

  const cellSize = size / matrixSize;

  return (
    <div className={`inline-block p-2 bg-white rounded border border-neutral-200 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width={size} height={size} fill="#ffffff" />
        {cells.map((row, r) =>
          row.map((active, c) =>
            active ? (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize}
                height={cellSize}
                fill="#0f172a"
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
};
