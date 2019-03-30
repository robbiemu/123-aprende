import gql from 'graphql-tag'

import config from '@src/config/app'

export default class Activity {
  constructor ({id, json, title, type, author} = {}) {
    this.id = id
    this.json = json
    this.title = title
    this.type = type
    this.author = author
  }

  static isValid (activity) {
    const baseValidity =  !!activity.json && config.constants.activities.types.includes(activity.type)
    if(!baseValidity) 
      return false

    if(activity.type === config.constants.activities.types.VocabularyPairs) {
      return Array.isArray(activity.json) && activity.json.every(item => {
        return ['id', 'es', 'en'].every(property => {
          let validity = item.hasOwnProperty(property)
          if(property === 'id')
            return validity
          return ['glyphs', 'number'].every(p2 => item[property].hasOwnProperty(p2))
        })
      })
    }

    if(activity.type === config.constants.activities.types.VideoSubmission || activity.type === config.constants.activities.types.AudioSubmission) {
      activity.json.hasOwnProperty('id') && activity.json.hasOwnProperty('markdown') && activity.json.hasOwnProperty('feed')
    } 

    return true
  }

  static getActivity = gql`
    query activity ($id: ID) {
      Activity (id: $id) {
        id,
        json,
        title,
        type
      }
    }
  `
}