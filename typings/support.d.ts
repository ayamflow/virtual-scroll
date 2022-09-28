export interface getSupportInterface {
    hasWheelEvent: boolean;
    hasMouseWheelEvent: boolean;
    hasTouch: boolean;
    hasTouchWin: any;
    hasPointer: boolean;
    hasKeyDown: boolean;
    isFirefox: boolean;
}

export declare function getSupport(): getSupportInterface;
