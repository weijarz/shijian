# Shijian

> 「事件」 A tiny event library that supports auto binding and batch remove listeners by binder.

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
        events.on('error', this, 'onError')
    }

    componentWillUnmount() {
        events.off(this) // remove all listeners from this instance
    }

    // `this` always point to the component instance
    onUpdate() {}
    onError() {}
}
```

## Mixin

```js
import Shijian from 'shijian'

class MyClass {}
Object.assign(MyClass.prototype, Shijian.proto)
var myObj = new MyClass()
myObj.emit('foo')
```

## Browsers supported
All modern browsers and Internet Explorer 8+.

## API

### Shijian#on(event, listener)
### Shijian#once(event, listener)
Adds a `listener` to the collection for a specified `event`.

- `event` - The name of the event you want to add.
- `listener` - Listener you want to add from given event.

### Shijian#on(event, thisArg, funcName[, arg1[, arg2][, ...]]])
### Shijian#once(event, thisArg, funcName[, arg1[, arg2][, ...]]])
Add a `listener` with auto-bind to `thisArg`.

- `event` - The name of the event you want to add.
- `thisArg` - The owner object.
- `funcName` - The callback function name of owner object.
- `arg1`, `arg2` - Extra arguments bind to the callback function.

### Shijian#off(event, listener)
Removes a `listener` from the collection for a specified `event`.

- `event` - The name of the event.
- `listener` - Listener you want to remove from the given event.

### Shijian#off([event, ]thisArg[, funcName])
Removes auto bind listeners.

- `event` - The name of the event.
- `thisArg` - The owner object.
- `funcName` - The callback function name.

### Shijian#emit(event, [arg1], [arg2], [...])
Execute each of the `listeners` collection in order with the given parameters.
All emitters emit the event `newListener` when new listeners are added.

- `event` - The name of the event you want to emit.

### Shijian.proto
A set of functions that can be mixed in to any object, giving the object 
the ability to bind and trigger custom named events.

## URL
https://www.github.com/weijarz/shijian

## License
Licensed under the MIT license.
