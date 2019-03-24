import gql from 'graphql-tag'

import config from '@src/config/app'

export default class Page {
  constructor ({id, markdown, title, type, author} = {}) {
    this.id = id
    this.markdown = markdown
    this.title = title
    this.type = type
    this.author = author
  }

  static isValid (page) {
    return !!page.markdown && config.constants.pages.types.includes(page.type) &&
        ( ( page.type === config.constants.pages.types.Lesson && Page.hasVocabularyPairs(page) ) ||
            page.type !== config.constants.pages.types.Lesson )
  }

  static hasVocabularyPairs (page) {
    return page.markdown && /'\]\(vocabulary:\/\//.test(page.markdown)
  }

  static getVocabularyPairs (page) {
    return page
        .match(/'\]\(vocabulary:\/\/[^/]+\/([^/]+)/)
        .map(i => i)
        .slice(1)
  }


  static getPage = gql`
    query page ($id: ID) {
      Page (id: $id) {
        id,
        markdown,
        title,
        type
      }
    }
  `
}