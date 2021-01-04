virtual-scroll
=====

A **2kb gzipped** low-level library to create custom scrollers with touch and keyboard support.
This is heavily inspired by Bartek Drozdz VirtualScroll util. See his [article](http://www.everyday3d.com/blog/index.php/2014/08/18/smooth-scrolling-with-virtualscroll/) for reference.

### Features
- Can create multiple instances with different elements as targets
- Let you do the actual scrolling logic: use CSS Transforms, WebGL animation or anything you like
- Native arrow keys support and shift/space support mimicking default browser behaviour

For high-level libraries based off **virtual-scroll**, check [locomotive-scroll](https://github.com/locomotivemtl/locomotive-scroll) or [smooth-scrolling](https://github.com/baptistebriel/smooth-scrolling).

### Installation
```
npm i virtual-scroll -S
```

### Usage & API
#### Constructor
- `new VirtualScroll(options)`
  - `el`: the target element for mobile touch events. *Defaults to window.*
  - `mouseMultiplier`: General multiplier for all mousewheel (including Firefox). *Default to 1.*
  - `touchMultiplier`: Mutiply the touch action by this modifier to make scroll faster than finger movement. *Defaults to 2.*
  - `firefoxMultiplier`: Firefox on Windows needs a boost, since scrolling is very slow. *Defaults to 15.*
  - `keyStep`: How many pixels to move with each key press. *Defaults to 120.*
  - `preventTouch`: If true, automatically call `e.preventDefault` on touchMove. *Defaults to false.*
  - `unpreventTouchClass`: Elements with this class won't `preventDefault` on touchMove. For instance, useful for a scrolling text inside a VirtualScroll-controled element. *Defaults to `vs-touchmove-allowed`*.
  - `passive`: if used, will use [passive events declaration](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Improving_scrolling_performance_with_passive_listeners) for the wheel and touch listeners. Can be true or false. *Defaults to undefined.*
  - `useKeyboard`: if true, allows to use arrows to navigate, and space to jump from one screen. *Defaults to true*
  - `useTouch`: if true, uses touch events to simulate scrolling. *Defaults to true*

#### Methods
- `instance.on(callback, context)`
Listen to the scroll event using the specified callback and optional context.

- `instance.off(callback, context)`
Remove the listener.

- `instance.destroy()`
Remove all events and unbind the DOM listeners.

Events note:
Each instance will listen only once to any DOM listener. These listener are enabled/disabled automatically. However, it's a good practice to always call `destroy()` on your VirtualScroll instance, especially if you are working with a SPA.

#### Event
When a scroll event happens, all the listeners attached with *instance.on(callback, context)* will get triggered with the following event:
```js
{
	x, // total distance scrolled on the x axis
	y, // total distance scrolled on the y axis
	deltaX, // distance scrolled since the last event on the x axis
	deltaY, // distance scrolled since the last event on the y axis
	originalEvent // the native event triggered by the pointer device or keyboard
}
```

### Example
```js
import VirtualScroll from 'virtual-scroll'

const scroller = new VirtualScroll()
scroller.on(event => {
	wrapper.style.transform = `translateY(${event.y}px)`
})

```

### License
MIT.
