import chai from 'chai'
import sinonChai from 'sinon-chai'
import sinon from 'sinon'

import { createStore } from 'redux'

import {
  suspendResumeEnhancer,
  suspendAction,
  resumeAction,
  triggerNotificationAction
} from '../src'

const { expect } = chai.use(sinonChai)

describe('suspendResumeEnhancer', () => {
  let store
  let subscribeSpy
  let reducerSpy
  let sandbox

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    subscribeSpy = sandbox.stub()
    reducerSpy = sandbox.stub().returns({})
    store = createStore(reducerSpy, suspendResumeEnhancer)
    store.subscribe(subscribeSpy)
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should wrap dispatch (reducers are still called) and notifies on dispatch by default', () => {
    store.dispatch({ type: 'SOME_ACTION' })
    store.dispatch({ type: 'SOME_OTHER_ACTION' })

    expect(reducerSpy).to.have.callCount(3)
    expect(reducerSpy).to.have.been.calledWith(undefined, { type: '@@redux/INIT' })
    expect(reducerSpy).to.have.been.calledWith({}, { type: 'SOME_ACTION' })
    expect(reducerSpy).to.have.been.calledWith({}, { type: 'SOME_OTHER_ACTION' })

    expect(subscribeSpy).to.have.callCount(2)
  })

  context('after suspendAction is dispatched', () => {
    beforeEach(() => {
      store.dispatch(suspendAction())
      store.dispatch({ type: "SOME_ACTION" })
      store.dispatch({ type: "SOME_OTHER_ACTION" })
    })

    it('should call reducers but not notify', () => {
      expect(reducerSpy).to.have.callCount(4)
      expect(subscribeSpy).to.have.callCount(0)
    })
  })

  context('after suspendAction and triggerAction are dispatched', () => {
    beforeEach(() => {
      store.dispatch(suspendAction())
      store.dispatch(triggerNotificationAction())
      store.dispatch({ type: "SOME_ACTION" })
      store.dispatch({ type: "SOME_OTHER_ACTION" })
    })

    it('should notify once on triggerNotificationAction only', () => {
      expect(subscribeSpy).to.have.callCount(1)
    })
  })

  context('after suspendAction and resumeAction are dispatched', () => {
    beforeEach(() => {
      store.dispatch(suspendAction())
      store.dispatch(resumeAction())
      store.dispatch({ type: "SOME_ACTION" })
      store.dispatch({ type: "SOME_OTHER_ACTION" })
    })

    it('should notify for all actions again', () => {
      expect(subscribeSpy).to.have.callCount(3) // once on resume, and the following two actions
    })
  })
})
