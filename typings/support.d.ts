export interface VirtualScrollSupport {
  hasWheelEvent: boolean;
  hasMouseWheelEvent: boolean;
  hasTouch: boolean;
  hasTouchWin: boolean;
  hasPointer: boolean;
  hasKeyDown: boolean;
  isFirefox: boolean;
}

export function getSupport(): VirtualScrollSupport;
