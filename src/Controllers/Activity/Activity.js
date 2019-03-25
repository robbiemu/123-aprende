import AsyncStorage from '@callstack/async-storage/lib'

import config from '@src/config/app'


export async function getProgress () {
  let inProgress
  try {
    inProgress = await AsyncStorage.getItem(config.constants.graphcool.progress)
    inProgress = JSON.parse(inProgress)
  } catch (e) {
    console.warn('error', e)
    inProgress = {[config.constants.activities.types.VocabularyPairs]: {}}
  } finally {
    if (inProgress === null || typeof inProgress !== 'object')
      inProgress = {}
    if (!inProgress.hasOwnProperty(config.constants.activities.types.VocabularyPairs))
      inProgress[config.constants.activities.types.VocabularyPairs] = {}
  }

  return inProgress
}
