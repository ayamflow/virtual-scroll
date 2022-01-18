import Emitter from 'tiny-emitter'
import { getSupport } from './support'
import { keyCodes } from './keycodes'

const EVT_ID = 'virtualscroll'
var support

export default class VirtualScroll {
    #options
    #el
    #emitter
    #event
    #touchStart
    #bodyTouchAction

    constructor(options) {
        this.#el = window
        if (options && options.el) {
            this.#el = options.el
            delete options.el
        }
        
        if (!support) support = getSupport()

        this.#options = Object.assign(
            {
                mouseMultiplier: 1,
                touchMultiplier: 2,
                firefoxMultiplier: 15,
                keyStep: 120,
                preventTouch: false,
                unpreventTouchClass: 'vs-touchmove-allowed',
                useKeyboard: true,
                useTouch: true
            },
            options
        )

        this.#emitter = new Emitter()
        this.#event = {
            y: 0,
            x: 0,
            deltaX: 0,
            deltaY: 0
        }
        this.#touchStart = {
            x: null,
            y: null
        }
        this.#bodyTouchAction = null

        if (this.#options.passive !== undefined) {
            this.listenerOptions = { passive: this.#options.passive }
        }
    }

    _notify(e) {
        var evt = this.#event
        evt.x += evt.deltaX
        evt.y += evt.deltaY

        this.#emitter.emit(EVT_ID, {
            x: evt.x,
            y: evt.y,
            deltaX: evt.deltaX,
            deltaY: evt.deltaY,
            originalEvent: e
        })
    }

    _onWheel = (e) => {
        var options = this.#options
        var evt = this.#event

        // In Chrome and in Firefox (at least the new one)
        evt.deltaX = e.wheelDeltaX || e.deltaX * -1
        evt.deltaY = e.wheelDeltaY || e.deltaY * -1

        // for our purpose deltamode = 1 means user is on a wheel mouse, not touch pad
        // real meaning: https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent#Delta_modes
        if (support.isFirefox && e.deltaMode === 1) {
            evt.deltaX *= options.firefoxMultiplier
            evt.deltaY *= options.firefoxMultiplier
        }

        evt.deltaX *= options.mouseMultiplier
        evt.deltaY *= options.mouseMultiplier

        this._notify(e)
    }

    _onMouseWheel = (e) => {
        var evt = this.#event

        // In Safari, IE and in Chrome if 'wheel' isn't defined
        evt.deltaX = e.wheelDeltaX ? e.wheelDeltaX : 0
        evt.deltaY = e.wheelDeltaY ? e.wheelDeltaY : e.wheelDelta

        this._notify(e)
    }

    _onTouchStart = (e) => {
        var t = e.targetTouches ? e.targetTouches[0] : e
        this.#touchStart.x = t.pageX
        this.#touchStart.y = t.pageY
    }

    _onTouchMove = (e) => {
        var options = this.#options
        if (
            options.preventTouch &&
            !e.target.classList.contains(options.unpreventTouchClass)
        ) {
            e.preventDefault()
        }

        var evt = this.#event

        var t = e.targetTouches ? e.targetTouches[0] : e

        evt.deltaX = (t.pageX - this.#touchStart.x) * options.touchMultiplier
        evt.deltaY = (t.pageY - this.#touchStart.y) * options.touchMultiplier

        this.#touchStart.x = t.pageX
        this.#touchStart.y = t.pageY

        this._notify(e)
    }

    _onKeyDown = (e) => {
        var evt = this.#event
        evt.deltaX = evt.deltaY = 0
        var windowHeight = window.innerHeight - 40

        switch (e.keyCode) {
            case keyCodes.LEFT:
            case keyCodes.UP:
                evt.deltaY = this.#options.keyStep
                break

            case keyCodes.RIGHT:
            case keyCodes.DOWN:
                evt.deltaY = -this.#options.keyStep
                break
            case keyCodes.SPACE:
                evt.deltaY = windowHeight * (e.shiftKey ? 1 : -1)
                break
            default:
                return
        }

        this._notify(e)
    }

    _bind() {
        if (support.hasWheelEvent) {
            this.#el.addEventListener(
                'wheel',
                this._onWheel,
                this.listenerOptions
            )
        }

        if (support.hasMouseWheelEvent) {
            this.#el.addEventListener(
                'mousewheel',
                this._onMouseWheel,
                this.listenerOptions
            )
        }

        if (support.hasTouch && this.#options.useTouch) {
            this.#el.addEventListener(
                'touchstart',
                this._onTouchStart,
                this.listenerOptions
            )
            this.#el.addEventListener(
                'touchmove',
                this._onTouchMove,
                this.listenerOptions
            )
        }

        if (support.hasPointer && support.hasTouchWin) {
            this.#bodyTouchAction = document.body.style.msTouchAction
            document.body.style.msTouchAction = 'none'
            this.#el.addEventListener('MSPointerDown', this._onTouchStart, true)
            this.#el.addEventListener('MSPointerMove', this._onTouchMove, true)
        }

        if (support.hasKeyDown && this.#options.useKeyboard) {
            document.addEventListener('keydown', this._onKeyDown)
        }
    }

    _unbind() {
        if (support.hasWheelEvent) {
            this.#el.removeEventListener('wheel', this._onWheel)
        }

        if (support.hasMouseWheelEvent) {
            this.#el.removeEventListener('mousewheel', this._onMouseWheel)
        }

        if (support.hasTouch) {
            this.#el.removeEventListener('touchstart', this._onTouchStart)
            this.#el.removeEventListener('touchmove', this._onTouchMove)
        }

        if (support.hasPointer && support.hasTouchWin) {
            document.body.style.msTouchAction = this.#bodyTouchAction
            this.#el.removeEventListener(
                'MSPointerDown',
                this._onTouchStart,
                true
            )
            this.#el.removeEventListener(
                'MSPointerMove',
                this._onTouchMove,
                true
            )
        }

        if (support.hasKeyDown && this.#options.useKeyboard) {
            document.removeEventListener('keydown', this._onKeyDown)
        }
    }

    on(cb, ctx) {
        this.#emitter.on(EVT_ID, cb, ctx)

        var events = this.#emitter.e
        if (events && events[EVT_ID] && events[EVT_ID].length === 1)
            this._bind()
    }

    off(cb, ctx) {
        this.#emitter.off(EVT_ID, cb, ctx)

        var events = this.#emitter.e
        if (!events[EVT_ID] || events[EVT_ID].length <= 0) this._unbind()
    }

    destroy() {
        this.#emitter.off()
        this._unbind()
    }
}