import { queryCategoryList, addCategory, setCategoryName } from './service';
import { CategoryListItem } from './data';
import { Reducer, AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';

export interface IStateType {
  rootCategoryList: CategoryListItem[];
  data: CategoryListItem[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: IStateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: IStateType;
  effects: {
    fetch: Effect;
    add: Effect;
    update: Effect;
  };
  reducers: {
    saveRoot: Reducer<IStateType>;
    save: Reducer<IStateType>;
  };
}

const Model: ModelType = {
  namespace: 'categoryList',

  state: {
    rootCategoryList: [],
    data: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryCategoryList, payload);
      if (payload === undefined || payload === 0) {
        yield put({
          type: 'saveRoot',
          payload: response,
        });
      }
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(addCategory, payload);
      if (response.ok !== false) {
        const res = yield call(queryCategoryList);
        yield put({
          type: 'save',
          payload: res,
        })
      }
    },
    *update({ payload }, { call, put, select }) {
      const response = yield call(setCategoryName, payload);
      if (response.ok !== false) {
        console.log('parentId', payload.parentId);
        const res = yield call(queryCategoryList, payload.parentId);
        yield put({
          type: 'save',
          payload: res,
        })
      }
    },
  },

  reducers: {
    saveRoot(state, action) {
      return {
        ...state,
        rootCategoryList: action.payload,
      }
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      }
    },
  },
}

export default Model;
