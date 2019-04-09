// handling multiple audio on the page helpers
let _playedAudios = []

function each (arr, cb) {
  if (arr) {
    for (let i = 0, len = arr.length; i < len; i++) {
      if (arr[i] && cb(arr[i], i, arr)) {
        break
      }
    }
  }
}

export function stopAllOther (playing) {
  each(_playedAudios, soundCloudAudio => {
    if (soundCloudAudio._track.id && soundCloudAudio._track.id !== playing) {
      soundCloudAudio.stop()
    }
  })
}

export function addToPlayedStore (soundCloudAudio) {
  let isPresent = false

  each(_playedAudios, _soundCloudAudio => {
    if (_soundCloudAudio._track.id === soundCloudAudio._track.id) {
      isPresent = true
      return true
    }
  })

  if (!isPresent) {
    _playedAudios.push(soundCloudAudio)
  }
}

export function resetPlayedStore () {
  debugger

  each(_playedAudios, soundCloudAudio => {
    soundCloudAudio.stop()
  })

  _playedAudios = []
}
