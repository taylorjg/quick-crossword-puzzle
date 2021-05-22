// Merriam-Webster, Incorporated
// https://dictionaryapi.com/
// https://dictionaryapi.com/products/api-collegiate-thesaurus
// https://dictionaryapi.com/products/json

const axios = require('axios')

const C = require('./constants')

const configure = (MW_DICTIONARY_KEY, MW_THESAURUS_KEY) => {

  const MW_URL = 'https://www.dictionaryapi.com/api/v3'

  const DICTIONARY_AXIOS_CONFIG = {
    baseURL: `${MW_URL}/references/collegiate/json`,
    params: {
      key: MW_DICTIONARY_KEY
    }
  }

  const THESAURUS_AXIOS_CONFIG = {
    baseURL: `${MW_URL}/references/thesaurus/json`,
    params: {
      key: MW_THESAURUS_KEY
    }
  }

  const getPossibles = async (word, answerLength) => {
    const url = `/${word.toLowerCase()}`
    const response = await axios.get(url, THESAURUS_AXIOS_CONFIG)
    const possibles = response.data
      .flatMap(entry => entry.meta.syns.flatMap(syns => syns))
      .filter(possible => possible.length === answerLength)
      .filter(possible => Array.from(possible).every(ch => C.LOWERCASSE_ALPHABET.includes(ch)))
    return Array.from(new Set(possibles).values())
  }

  return {
    getPossibles
  }
}

module.exports = configure
