// @flow
// eslint-disable-next-line import/order
import type { Saga } from 'redux-saga'
import { select, put, call, takeEvery } from 'redux-saga/effects'
import { fetchAuth } from 'services/api'
import { openModal, closeModal } from '../ModalManeger/actions'
import {
  loginFailure,
  endLoading,
  clearError,
  setAuth,
  setAccount,
  setRefreshToken,
} from './actions'
import * as Actions from './constants'
import { makeSelectInfo } from './selectors'

export function* getToken(): Saga<*> {
  const info = yield select(makeSelectInfo())
  // TODO: username & passwordがなければLogin Pageを開く
  const { accessToken } = yield call(fetchAuth, info)
  return accessToken
}

function* authorize({ username, password }): Saga<void> {
  // エラーを非表示
  yield put(clearError())
  try {
    const { user: account, refreshToken } = yield call(fetchAuth, {
      username,
      password,
    })
    yield put(setAuth(username, password))
    yield put(setAccount(account))
    yield put(closeModal())
    yield put(setRefreshToken(refreshToken))
  } catch (err) {
    yield put(loginFailure())
  } finally {
    yield put(endLoading())
  }
}

function* logout(): Saga<void> {
  yield put(endLoading())
  // ログインモーダルを表示
  yield put(openModal('Login'))
}

function* root(): Saga<void> {
  yield takeEvery(Actions.LOGIN_REQUEST, authorize)
  yield takeEvery(Actions.LOGOUT, logout)
}

export default root
