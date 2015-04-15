var assert = require('assert')
var Shijian = require('../')

describe('Shijian', function() {
    var result
    function resetResult() {
        result.splice(0, result.length)
    }

    function listener1() { result.push(1) }
    function listener2() { result.push(2) }
    function listener3() { result.push(3) }
    function listener4() { result.push(4) }
    function listener5() { result.push(5) }
    function listenerArgs(a, b, c) { result.push(a + b + c) }

    function Class1() { this.val = 'class1' }
    Class1.prototype.listener1 = listener1
    Class1.prototype.listener2 = listener2
    Class1.prototype.listener3 = listener3
    Class1.prototype.listenerArgs = listenerArgs

    function Class2() { this.val = 'class2' }
    Class2.prototype.listener4 = listener4
    Class2.prototype.listener5 = listener5

    var obj1 = new Class1(), obj2 = new Class2()
    var events

    beforeEach(function() {
        events = new Shijian()
        result = []
    })

    describe('.on(event, listener', function() {
        it('Should call all listeners when it emits an event', function() {
            events.on('something', listener1)
            events.on('something', listener2)
            events.emit('something')
            events.emit('otherthing')
            assert.deepEqual(result, [1, 2])
        })
    })

    describe('.once(event, listener)', function() {
        it('Should call listener only one time', function () {
            events.once('something', listener1)
            events.once('something', listener2)
            events.emit('something')
            events.emit('something')
            assert.deepEqual(result, [1, 2])
        })
    }) 

    describe('.on(event, thisArg, funcName[, arg1[, arg2][, ...]]])', function() {
        it('Should call all listeners when it emits an event', function() {
            events.on('something', obj1, 'listener1')
            events.on('something', obj1, 'listener2')
            events.on('otherthing', obj1, 'listener3')
            events.on('something', obj2, 'listener4')
            events.on('something', obj2, 'listener5')

            events.emit('something')
            assert.deepEqual(result, [1, 2, 4, 5])
            
            resetResult()
            events.emit('otherthing')
            assert.deepEqual(result, [3])
        })
    })

    describe('.once(event, thisArg, funcName[, arg1[, arg2][, ...]]])', function() {
        it('Should call listener only one time', function () {
            events.once('something', obj1, 'listener1')
            events.once('something', obj1, 'listener2')
            events.emit('something')
            events.emit('something')
            assert.deepEqual(result, [1, 2])
        })
    }) 

    describe('auto bind with args', function() {
        it('Should call all listeners with args', function() {
            events.on('something', obj1, 'listenerArgs', 1, 2)
            events.emit('something', 3)
            assert.deepEqual(result, [6])
        })
    })

    describe('.off(event, listener)', function() {
        it('Should remove a listener', function() {
            events.on('something', listener1)
            events.on('something', listener2)
            events.on('otherthing', listener3)
            events.off('something', listener2)
            events.emit('something')
            assert.deepEqual(result, [1])
        })
    })

    describe('.off([event, ]thisArg[, funcName])', function() {
        beforeEach(function() {
            events.on('something', obj1, 'listener1')
            events.on('something', obj1, 'listener2')
            events.on('otherthing', obj1, 'listener3')
            events.on('something', obj2, 'listener4')
            events.on('something', obj2, 'listener5')
        })

        describe('.off(event, thisArg, funcName)', function() {
            it('Should remove a listener', function() {
                events.off('something', obj1, 'listener1')
                events.emit('something')
                assert.deepEqual(result, [2, 4, 5])
            })
        })

        describe('.off(event, thisArg)', function() {
            it('Should remove a listener', function() {
                events.off('something', obj1)
                events.emit('something')
                assert.deepEqual(result, [4, 5])
            })
        })

        describe('.off(thisArg)', function() {
            it('Should remove a listener', function() {
                events.off(obj1)
                events.emit('something')
                events.emit('otherthing')
                assert.deepEqual(result, [4, 5])
            })
        })
    })
})
