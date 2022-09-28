import { TinyEmitter } from "tiny-emitter";

export interface VirtualScrollOptions {
    el?: HTMLElement;
    mouseMultiplier?: number;
    touchMultiplier?: number;
    firefoxMultiplier?: number;
    keyStep?: number;
    preventTouch?: boolean;
    unpreventTouchClass?: string;
    passive?: boolean;
    useKeyboard?: boolean;
    useTouch?: boolean;
}

export type VirtualTouchEvent = TouchEvent | Touch;

export default class VirtualScroll {
    private options: VirtualScrollOptions

    private el: HTMLElement | Window

    private emitter: TinyEmitter

    private event: {
      y: number,
      x: number,
      deltaX: number,
      deltaY: number
    }

    private touchStart: {
      x: number | null,
      y: number | null
    }

    private bodyTouchAction: CSSStyleDeclaration["touchAction"] | null

    listenerOptions?: {
      passive: boolean;
    };

    constructor(options?: VirtualScrollOptions);

    private _notify(e: WheelEvent | VirtualTouchEvent | KeyboardEvent): void;

    private _onWheel: (e: WheelEvent) => void;

    private _onMouseWheel: (e: WheelEvent) => void;

    private _onTouchStart: (e: VirtualTouchEvent) => void;

    private _onTouchMove: (e: VirtualTouchEvent) => void;

    private _onKeyDown: (e: KeyboardEvent) => void;

    private _bind(): void;

    private _unbind(): void;

    public on(cb: any, ctx: any): void;

    public off(cb: any, ctx: any): void;

    public destroy(): void;
}
