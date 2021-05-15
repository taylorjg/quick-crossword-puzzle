// Oxford University Press
// https://developer.oxforddictionaries.com/
// https://developer.oxforddictionaries.com/documentation/getting_started
// https://developer.oxforddictionaries.com/documentation

const axios = require('axios')

const configure = (OUP_API_ID, OUP_API_KEY) => {

  const OUP_URL = 'https://od-api.oxforddictionaries.com/api/v2'

  const AXIOS_CONFIG = {
    baseURL: OUP_URL,
    headers: {
      app_id: OUP_API_ID,
      app_key: OUP_API_KEY
    },
    params: {
      strictMatch: false
    }
  }

  const makeThesaurusUrl = word =>
    `/thesaurus/en/${word.toLowerCase()}`

  const getPossibles = async (word, answerLength) => {
    return []
  }

  return {
    getPossibles
  }
}

module.exports = configure
