import { register } from './service';
import { Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { AnyAction } from 'redux';

export interface IStateType {
  ok: boolean;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: IStateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: IStateType;
  effects: {
    submit: Effect;
  };
  reducers: {
    registerHandle: Reducer<IStateType>;
  };
}

const Model: ModelType = {
  namespace: 'userRegister',

  state: {
    ok: false,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(register, payload);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      console.log('ok', payload.ok);
      return {
        ...state,
        ok: payload.ok !== false,
      };
    },
  },
};

export default Model;
