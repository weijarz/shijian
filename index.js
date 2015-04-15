'use strict'

function Shijian() {}

function addListener(event) {
    var listenerObj = {event: event}
    if (isFunction(arguments[1])) {
        // addListener(event, listener)
        listenerObj.func = arguments[1]
    } else {
        // addListener(event, thisArg, funcName, *args)
        listenerObj.thisArg = arguments[1]
        if (typeof listenerObj.thisArg != 'object')
            throw new TypeError('thisArg must be an object')
        listenerObj.funcName = arguments[2]
        if (typeof listenerObj.funcName != 'string')
            throw new TypeError('funcName must be a string')
        if (!listenerObj.funcName)
            throw new Error('funcName is required')
        listenerObj.args = slice.call(arguments, 3)
    }

    this.__shijian = this.__shijian || {}
    this.__shijian[event] = this.__shijian[event] || []
    this.__shijian[event].push(listenerObj)

    return listenerObj
}

function getListeners(event) {
    return (this.__shijian || {})[event] || []
}

Shijian.prototype.on = function(event, listener) {
    addListener.apply(this, arguments)
    return this
}

Shijian.prototype.once = function(event, listener) {
    var listenerObj = addListener.apply(this, arguments)
    listenerObj.once = true
    return this
}

Shijian.prototype.off = function() {
    if (!this.__shijian) return this

    var args = slice.call(arguments)
    var _this = this

    each(this.__shijian, function(listenerObjs) {
        each(listenerObjs, function(listenerObj) {
            var filter = {}
            if (typeof args[0] === 'string') {
                filter.event = args[0]
                if (isFunction(args[1])) {
                    // .off(event, listener)
                    filter.func = args[1]
                } else {
                    // .off(event, thisArg, [funcName])
                    filter.thisArg = args[1]
                    if (!filter.thisArg)
                        throw new TypeError('thisArg is required')
                    if (args[2])
                        filter.funcName = args[2]
                }
            } else {
                // .off(thisArg, [funcName])
                filter.thisArg = args[0]
                if (!filter.thisArg)
                    throw new TypeError('thisArg is required')
                if (args[2])
                    filter.funcName = args[1]
            }

            var unmatch = each(filter, function(v, k) {
                if (listenerObj[k] !== v)
                    return false
            })
            if (!unmatch) {
                // here we do not use index because it is inaccurate on remove objects
                arrayRemove(listenerObjs, listenerObj)
            }
        })
    })
    
    each(this.__shijian, function(listenerObjs, event) {
        if (!listenerObjs.length) {
            delete _this.__shijian[event]
        }
    })

    return this
}

Shijian.prototype.emit = function (event) {
    var listeners = slice.call(getListeners.call(this, event))
    var args = slice.call(arguments, 1)
    for (var i = 0; i < listeners.length; i++) {
        if (listeners[i].once)
            arrayRemove(getListeners.call(this, event), listeners[i])

        if (listeners[i].thisArg) {
            listeners[i].thisArg[listeners[i].funcName].apply(listeners[i].thisArg, listeners[i].args.concat(args))
        } else {
            listeners[i].func.apply(null, args)
        }
    }

    return this
}

var slice = Array.prototype.slice

function arrayRemove(arr, value) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === value) {
            arr.splice(i, 1)
            return true
        }
    }
}

function each(coll, callback) {
    var cont
    if (coll instanceof Array) {
        var arr = coll.slice() // support modify array entries in callback
        for (var i = 0; i < arr.length; i++) {
            cont = callback(arr[i], i)
            if (cont === false)
                break
        }
    } else {
        for(var propName in coll) {
            if (Object.prototype.hasOwnProperty.call(coll, propName)) {
                cont = callback(coll[propName], propName)
                if (cont === false)
                    break
            }
        }
    }

    return cont === false
}

function isFunction(obj) {
    return obj && Object.prototype.toString.call(obj) === '[object Function]'
}

module.exports = Shijian
