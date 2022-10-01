import { TinyEmitter } from "tiny-emitter";

export interface VirtualScrollDeclaration {
    element: Element | HTMLElement | Window;
    options: {
        /**
         * The target element for mobile touch events.
         * Defaults to window.
         */
        el?: VirtualScrollDeclaration['element'] | null;

        /**
         * General multiplier for all mousewheel (including Firefox).
         * Default to 1.
         */
        mouseMultiplier?: number;

        /**
         * Mutiply the touch action by this modifier to make scroll faster than finger movement.
         * Defaults to 2.
         */
        touchMultiplier?: number;

        /**
         * Firefox on Windows needs a boost, since scrolling is very slow.
         * Defaults to 15.
         */
        firefoxMultiplier?: number;

        /**
         * How many pixels to move with each key press.
         * Defaults to 120.
         */
        keyStep?: number;

        /**
         * If true, automatically call e.preventDefault on touchMove.
         * Defaults to false. 
         */
        preventTouch?: boolean;

        /**
         * Elements with this class won't preventDefault on touchMove.
         * For instance, useful for a scrolling text inside a VirtualScroll-controled element.
         * Defaults to vs-touchmove-allowed.
         */
        unpreventTouchClass?: string;

        /**
         * If used, will use passive events declaration for the wheel and touch listeners. 
         * Can be true or false. Defaults to undefined.
         * 
         * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scrolling_performance_with_passive_listeners
         */
        passive?: boolean;

        /**
         * If true, allows to use arrows to navigate, and space to jump from one screen.
         * Defaults to true
         */
        useKeyboard?: boolean;

        /**
         * If true, uses touch events to simulate scrolling.
         * Defaults to true
         */
        useTouch?: boolean;
    };
    event: {
        y: number,
        x: number,
        deltaX: number,
        deltaY: number
    }
    touchStart: {
        x: number | null,
        y: number | null
    }
    touchEvent: TouchEvent | Touch
    listenerOptions: {
        passive: boolean;
    }
}

export default class VirtualScroll {
    private options: VirtualScrollDeclaration["options"]

    private el: VirtualScrollDeclaration["element"] | Window

    private emitter: TinyEmitter

    private event: VirtualScrollDeclaration["event"]

    private touchStart: VirtualScrollDeclaration["touchStart"]

    private bodyTouchAction: CSSStyleDeclaration["touchAction"] | null

    listenerOptions?: VirtualScrollDeclaration["listenerOptions"];

    constructor(options?: VirtualScrollDeclaration["options"]);

    private _notify(e: WheelEvent | VirtualScrollDeclaration["touchEvent"] | KeyboardEvent): void;

    private _onWheel: (e: WheelEvent) => void;

    private _onMouseWheel: (e: WheelEvent) => void;

    private _onTouchStart: (e: VirtualScrollDeclaration["touchEvent"]) => void;

    private _onTouchMove: (e: VirtualScrollDeclaration["touchEvent"]) => void;

    private _onKeyDown: (e: KeyboardEvent) => void;

    private _bind(): void;

    private _unbind(): void;

    public on(cb: any, ctx?: any): void;

    public off(cb: any, ctx?: any): void;

    public destroy(): void;
}
