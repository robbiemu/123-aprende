// modified from npm soundcloud-audio for react'native
import React from 'react'
import { Text } from 'react-native'
import { Audio } from 'expo'
import uuid from 'uuid/v4'

const SOUNDCLOUD_API_URL = 'https://api.soundcloud.com'

let styles = {
  link: {}
}

let anchor
let keys = 'protocol hostname host pathname port search hash href'.split(' ')
function _parseURL (url) {
  if (!anchor) {
    anchor = (
      <Text key={uuid()} style={styles.link} onPress={() => openUrl(url || '')}>
        {url}
      </Text>
    )
  }

  let result = {}

  for (var i = 0, len = keys.length; i < len; i++) {
    var key = keys[i]
    result[key] = anchor[key]
  }

  return result
}

function _appendQueryParam (url, param, value) {
  var U = _parseURL(url)
  var regex = /\?(?:.*)$/
  var chr = regex.test(U.search) ? '&' : '?'
  var result =
    U.protocol +
    '//' +
    U.host +
    U.port +
    U.pathname +
    U.search +
    chr +
    param +
    '=' +
    value +
    U.hash

  return result
}

export default class SoundCloudAudio {
  constructor (clientId, apiUrl) {
    if (!clientId && !apiUrl) {
      console.info('SoundCloud API requires clientId or custom apiUrl')
    }

    this._events = {}

    this._clientId = clientId
    this._baseUrl = apiUrl || SOUNDCLOUD_API_URL

    this.playing = false
    this.duration = 0

    this.audio = new Audio.Sound()
    this.currentUri = null
  }

  resolve (url, callback) {
    var resolveUrl =
      this._baseUrl + '/resolve.json?url=' + encodeURIComponent(url)

    if (this._clientId) {
      resolveUrl = _appendQueryParam(resolveUrl, 'client_id', this._clientId)
    }

    this._json(
      resolveUrl,
      function (data) {
        this.cleanData()

        if (Array.isArray(data)) {
          data = { tracks: data }
        }

        if (data.tracks) {
          data.tracks = data.tracks.map(this._transformTrack.bind(this))
          this._playlist = data
        } else {
          this._track = this._transformTrack(data)

          // save timings
          var U = _parseURL(url)
          this._track.stream_url += U.hash
        }

        this.duration =
          data.duration && !isNaN(data.duration)
            ? data.duration / 1000 // convert to seconds
            : 0 // no duration is zero

        callback(data)
      }.bind(this)
    )
  }

  on (e, fn) {
    this._events[e] = fn
  }

  off (e, fn) {
    this._events[e] = null
  }

  preload (streamUrl, preloadType) {
    this._track = { stream_url: streamUrl }

    const uri = this._clientId
      ? _appendQueryParam(streamUrl, 'client_id', this._clientId)
      : streamUrl

    this.audio.loadAsync(uri).then((...args) =>
      this._events['loadedmetadata'].forEach(eventBinding => {
        try {
          eventBinding(args)
        } catch (e) {
          console.warn(e)
        }
      })
    )
    this.currentUri = uri
  }

  async play (options) {
    options = options || {}
    var src

    if (options.streamUrl) {
      src = options.streamUrl
    } else if (this._playlist) {
      var length = this._playlist.tracks.length

      if (length) {
        if (options.playlistIndex === undefined) {
          this._playlistIndex = this._playlistIndex || 0
        } else {
          this._playlistIndex = options.playlistIndex
        }

        // be silent if index is out of range
        if (this._playlistIndex >= length || this._playlistIndex < 0) {
          this._playlistIndex = 0
          return
        }

        src = this._playlist.tracks[this._playlistIndex].stream_url
      }
    } else if (this._track) {
      src = this._track.stream_url
    }

    if (!src) {
      throw new Error(
        'There is no tracks to play, use `streamUrl` option or `load` method'
      )
    }

    if (this._clientId) {
      src = _appendQueryParam(src, 'client_id', this._clientId)
    }

    if (src !== this.currentUri) {
      try {
        await this.audio.loadAsync(src).then((...args) =>
          this._events['loadedmetadata'].forEach(eventBinding => {
            try {
              eventBinding(args)
            } catch (e) {
              console.warn(e)
            }
          })
        )
      } catch (e) {
        return
      }
    }

    this.currentUri = src

    return this.audio
      .playAsync()
      .then(() => (this.playing = src))
      .then((...args) =>
        this._events['playing'].forEach(eventBinding => {
          try {
            eventBinding(args)
          } catch (e) {
            console.warn(e)
          }
        })
      )
  }

  pause () {
    return this.audio
      .pauseAsync()
      .then(() => (this.playing = false))
      .then((...args) =>
        this._events['pause'].forEach(eventBinding => {
          try {
            eventBinding(args)
          } catch (e) {
            console.warn(e)
          }
        })
      )
  }

  unbindAll () {
    for (var e in this._events) {
      var fn = this._events[e]
      if (fn) {
        this.off(e, fn)
      }
    }
  }

  stop () {
    this.audio
      .stopAsync()
      .then(() => (this.playing = false))
      .then((...args) =>
        this._events['ended'].forEach(eventBinding => {
          try {
            eventBinding(args)
          } catch (e) {
            console.warn(e)
          }
        })
      )
  }

  next (options) {
    options = options || {}
    var tracksLength = this._playlist.tracks.length

    if (this._playlistIndex >= tracksLength - 1) {
      if (options.loop) {
        this._playlistIndex = -1
      } else {
        return
      }
    }

    if (this._playlist && tracksLength) {
      return this.play({ playlistIndex: ++this._playlistIndex })
    }
  }

  previous () {
    if (this._playlistIndex <= 0) {
      return
    }

    if (this._playlist && this._playlist.tracks.length) {
      return this.play({ playlistIndex: --this._playlistIndex })
    }
  }

  seek (e) {
    if (!(this.audio.canPlay || this.audio.canPrepare || this.audio.canStop)) {
      return false
    }

    var percent =
      e.offsetX / e.target.offsetWidth ||
      (e.layerX - e.target.offsetLeft) / e.target.offsetWidth

    this._events['seeking'].forEach(eventBinding => {
      try {
        eventBinding(args)
      } catch (e) {
        console.warn(e)
      }
    })

    this.audio
      .setPositionAsync(percent * (this.audio.duration || 0))
      .then((...args) =>
        ['seeked', 'timeupdate'].forEach(event =>
          this._events[event].forEach(eventBinding => {
            try {
              eventBinding(args)
            } catch (e) {
              console.warn(e)
            }
          })
        )
      )
  }

  cleanData () {
    this._track = null
    this._playlist = null
  }

  setVolume (volumePercentage) {
    if (!(this.audio.canPlay || this.audio.canPrepare || this.audio.canStop)) {
      return
    }

    this.audio.setVolumeAsync(volumePercentage).then((...args) =>
      this._events['volumechange'].forEach(eventBinding => {
        try {
          eventBinding(args)
        } catch (e) {
          console.warn(e)
        }
      })
    )
  }

  setTime (seconds) {
    if (!(this.audio.canPlay || this.audio.canPrepare || this.audio.canStop)) {
      return
    }

    this.audio.setPositionAsync(seconds).then((...args) =>
      this._events['timeupdate'].forEach(eventBinding => {
        try {
          eventBinding(args)
        } catch (e) {
          console.warn(e)
        }
      })
    )
  }

  _json (url, callback) {
    var xhr = new XMLHttpRequest()

    xhr.open('GET', url)
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var resp = {}
          try {
            resp = JSON.parse(xhr.responseText)
          } catch (err) {
            // fail silently
          }
          callback(resp)
        }
      }
    }

    xhr.send(null)
  }

  _transformTrack = function (track) {
    if (this._baseUrl !== SOUNDCLOUD_API_URL) {
      track.original_stream_url = track.stream_url
      track.stream_url = track.stream_url.replace(
        SOUNDCLOUD_API_URL,
        this._baseUrl
      )
    }

    return track
  }
}
