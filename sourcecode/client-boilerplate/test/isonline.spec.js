'use strict'

const expect = require('chai').expect
const nock = require('nock')

const url = 'http://127.0.0.11'
const couchdbActiveResponse = {
  'couchdb': 'Welcome',
  'uuid': '17ed4b2d8923975cf658e20e219faf95',
  'version': '1.5.0',
  'vendor': { 'version': '14.04', 'name': 'Ubuntu' },
}
const pouchdbActiveResponse = {
  'express-pouchdb': 'Welcome!',
  'version': '2.3.7',
  'pouchdb-adapters': ['leveldb'],
  'vendor': { 'name': 'PouchDB authors', 'version': '2.3.7' },
  'uuid': '4fad2c01-ba32-4249-8278-8786e877c397',
}

describe('isonline', (done) => {

  let isonline

  beforeEach(() => {
    try {
      isonline = require('../lib/isonline.js').api
    } catch (error) {
      isonline = null // Ensure the test fails if the module can't be loaded
    }
  })
  afterEach(() => {
    nock.cleanAll()
  })

  it('should detect if a CouchDB server is online', (done) => {
    // mock the response from the server
    nock(url)
      .get('/')
      .reply(200, JSON.stringify(couchdbActiveResponse))
    isonline(url).then(result => {
      expect(result).to.eql({ [url]: true })
      done()
    }).catch(done)
  })

  it('should detect if a PouchDB server is online', (done) => {
    // mock the response from the server
    nock(url)
      .get('/')
      .reply(200, JSON.stringify(pouchdbActiveResponse))

    isoneline(url).then(result => {
      expect(result).to.eql({ [url]: true })
      done()
    }).catch(done)
  })

  it('should detect when the database server is offline', (done) => {
    nock(url).get('/').reply(404)

    isonline(url).then(result => {
      expect(result).to.eql({ [url]: false })
      done()
    }).catch(done)

  })

  it('should detect if something is online but not a CouchDB/PouchDB server', (done) => {
    const unrelatedResponse = { message: 'Not a database server' }
    nock(url).get('/').reply(200, unrelatedResponse)

    isonline(url).then(result => {
      expect(result).to.eql({ [url]: false })
      done()
    }).catch(done)

  })

  it('should only accept valid URLs', () => {
    const invalidUrl = 'not-a-valid-url'
    if (isonline) {
      expect(() => isonline(invalidUrl)).to.throw(Error)

    } else {
      expect(isonline).to.be.null
    }
  })
})
