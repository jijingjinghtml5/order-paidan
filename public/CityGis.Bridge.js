/**
  *
    对外接口转发模块
  *
  @module 接口转发模块
  @author wzs 2017/09/22
*/
/* eslint-disable */

window.CityGis = (function ($Core) {
  return $Core
})(window.CityGis || {});

(function ($, $Core) {
  var definePropertyWorks = (function () {
    try {
      return 'x' in Object.defineProperty({}, 'x', {})
      } catch (e) {
      return false
      }
  })()
  var defineProperties = Object.defineProperties
  if (!definePropertyWorks || !(defineProperties !== undefined && defineProperties !== null)) {
    defineProperties = function (o) {
      return o
      };
  }
  $Core.MapSocket = MapSocket
  function MapSocket(options) {
    this._create = function (options) {
      var that = this
          options = $.extend({ host: '192.168.29.100', port: 59001, clientId: 'testmap', group: 'groupA', onMessage: function (msg) { console.log(msg) } }, options)
      this.ready = $.Deferred()
          try {
        this.client = new msc.Client({ host: options.host, port: options.port }, options.clientId)

              this.client.connect()

        this.client.onConnect(function () {
          that.ready.resolve(this)
              })

              this.client.join(options.group)
              this.client.onMessage(options.onMessage)
          } catch (ex) {
        console.log('未引用msc插件,无法初始化socket通讯')
              that.ready.reject(ex.message)
          }
      return this
      }
    this.send = function (options) {
      var that = this
          this.ready.then(function () {
        that.client.pub({
          sceneId: options.sceneId,
          targetClientIds: options.targetClientIds,
          data: options.data
        })
          })
      }
    this.broadcast = function(options) {
      var that = this
          this.ready.then(function () {
        that.client.pub({
          sceneId: options.sceneId,
          data: options.data
        }, options.group)
          })
    }
    return this._create(options)
  }
  $Core.Event = Event
  
      function Event() {
    this._listeners = []
          this._scopes = []
          this._toRemove = []
          this._insideRaiseEvent = false
      }

  defineProperties(Event.prototype, {
    numberOfListeners: {
      get: function () {
        return this._listeners.length - this._toRemove.length
              }
    }
  })
      Event.prototype.addEventListener = function (listener, scope) {
    if (typeof listener === 'function') {
      this._listeners.push(listener)
              this._scopes.push(scope)

              var event = this
              return function () {
        event.removeEventListener(listener, scope)
              };
    }
  }
      Event.prototype.removeEventListener = function (listener, scope) {
    if (typeof listener === 'function') {
      var listeners = this._listeners
              var scopes = this._scopes

              var index = -1
              for (var i = 0; i < listeners.length; i++) {
        if (listeners[i] === listener && scopes[i] === scope) {
          index = i
                      break;
        }
      }

      if (index !== -1) {
        if (this._insideRaiseEvent) {
          this._toRemove.push(index)
                      listeners[index] = undefined
                      scopes[index] = undefined
                  } else {
          listeners.splice(index, 1)
                      scopes.splice(index, 1)
                  }
        return true
              }
    }
    return false
      };

  function compareNumber(a, b) {
    return b - a
      }
  Event.prototype.raiseEvent = function () {
    this._insideRaiseEvent = true

          var i
          var listeners = this._listeners
          var scopes = this._scopes
          var length = listeners.length

          for (i = 0; i < length; i++) {
      var listener = listeners[i]
              if (listener && listener != null) {
        listeners[i].apply(scopes[i], arguments)
              }
    }
    var toRemove = this._toRemove
          length = toRemove.length
          if (length > 0) {
      toRemove.sort(compareNumber)
              for (i = 0; i < length; i++) {
        var index = toRemove[i]
                  listeners.splice(index, 1)
                  scopes.splice(index, 1)
              }
      toRemove.length = 0
          }

    this._insideRaiseEvent = false
      };


  $Core.Bridge = Bridge
 
  function Bridge(options) {
    this.commandQueue = []
      var that = this
    
      var iframeId = options.id
      var url = options.url
      this._onReady = options.onReady
      if (window.attachEvent) {
      window.attachEvent('message', praseMessage)
      } else if (window.addEventListener) {
      window.addEventListener('message', praseMessage, false)
      }

    function praseMessage(evt) {
      try {
        var command = JSON.parse(evt.data)
              var data = command.data
              if (command.action && command.action !== '') {
          if (command.action == 'MapReady' && that._onReady) {
            that._onReady.call(that)
                  } else if (command.action == 'Camera') {
            if (that._cameraDeferred) {
              that._cameraDeferred.resolve(command.data)
                      }
          }
          else
            {that.raiseEvent(command);}
        }
      } catch (error) {
        console.log('未注册该方法' + error)
      }
    }
    this.Invoke = function (arg) {
      if (arg == undefined)
        {return;}
      if (this.iframe === undefined) {
        this.commandQueue.push(arg)
              return;
      }
      console.log(arg)
          this.iframe.postMessage(JSON.stringify(arg), this.domain)
         
      };
    this.getCamera = function () {
      this._cameraDeferred = new $.Deferred()
          this.Invoke({
        'ActionName': 'getCamera'
      })
          return this._cameraDeferred
          
      }
    $.extend(this, new $Core.Event())
		$(function () {
			that._iframeEle = document.getElementById(iframeId)
			$('#' + iframeId).attr('src', url)
			$('#' + iframeId).ready(function () {
				if (that._iframeEle) {
					that.iframe = that._iframeEle.contentWindow
					that.domain = that._iframeEle.src ? that._iframeEle.src : '*';
				}				
			})
		})
  };
})($, CityGis)
