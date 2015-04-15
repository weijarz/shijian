# Shijian

> 「事件」 A tiny event library that supports auto binding and bulk unsubscribe by consumer.

## Classic usage

```js
import Shijian from 'shijian'

var events = new Shijian()

function say(name) {
    alert(`Hello, ${name}!`)
}

events.on('name', say)
events.emit('name', 'Jessie')
events.off('name', say)
```

## Auto binding

```js
import React from 'react'
import Shijian from 'shijian'

var events = new Shijian()

class MyComponent extends React.Component {
    
    componentDidMount() {
        events.on('update', this, 'onUpdate')
              .on('error', this, 'onError')
    }

    componentWillUnmount() {
        events.off(this) // remove all listeners from this component instance
    }

    // `this` value is bound to the component instance
    onUpdate() {}
    onError() {}
}
```

## Mixin

```js
import Shijian from 'shijian'

class Cat {}
Object.assign(Cat.prototype, Shijian.prototype)
var cat = new Cat()
myObj.emit('meow')
```

## Supported browsers
All modern browsers and Internet Explorer 6+.

## API

### Shijian#on(event, listener)
### Shijian#once(event, listener)
Adds a `listener` to the end of the listeners array for the specified `event`.

- `event`: string - The name of the event you want to add.
- `listener`: function - Listener you want to add from given event.

### Shijian#on(event, thisArg, funcName, *args)
### Shijian#once(event, thisArg, funcName, *args)
Adds an auto-bind `listener` to the end of the listeners array for the specified `event`.

- `event`: string - The name of the event you want to add.
- `thisArg`: object - The consumer object.
- `funcName`: string - The listener function name of consumer object.
- `args` - Arguments to prepend to listener function.

### Shijian#off(event, listener)
Remove a `listener` from the listener array for the specified `event`.

- `event`: string - The name of the event.
- `listener`: function - Listener you want to remove from the given event.

### Shijian#off([event], thisArg, [funcName])
Bulk remove auto-bind listeners.

- `event`: string - The name of the event.
- `thisArg`: object - The consumer object.
- `funcName`: string - The callback function name.

### Shijian#emit(event, *args)
Execute each of the listeners in order with the supplied arguments. 

- `event`: string - The name of the event you want to emit.
- `args` - Arguments to the listener function.

## URL
https://www.github.com/weijarz/shijian

## License
Licensed under the MIT license.
