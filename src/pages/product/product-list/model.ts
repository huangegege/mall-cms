import { queryProductList, addProduct, setProductStatus } from './service';
import { ProductListData } from './data';
import { Reducer, AnyAction } from 'redux';
import { EffectsCommandMap } from 'dva';

export interface IStateType {
  data: ProductListData;
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
    // update: Effect;
    setStatus: Effect;
  };
  reducers: {
    save: Reducer<IStateType>;
  };
}

const Model: ModelType = {
  namespace: 'productList',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryProductList, payload);
      if (response.ok !== false) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *add({ payload }, { call, put }) {
      const response = yield call(addProduct, payload);
      if (response.ok !== false) {
        const res = yield call(queryProductList);
        yield put({
          type: 'save',
          payload: res,
        })
      }
    },
    *setStatus({ payload }, { call, put }) {
      const response = yield call(setProductStatus, payload);
      if (response.ok !== false) {
        const res = yield call(queryProductList, payload);
        yield put({
          type: 'save',
          payload: res,
        })
      }
    },
    // *update({ payload }, { call, put, select }) {
    // },
  },

  reducers: {
    save(state, action) {
      const { payload } = action;
      const data = {
        list: payload.data,
        pagination: {
          current: payload.pageNum,
          pageSize: payload.pageSize,
          total: payload.total,
        },
      }
      return {
        ...state,
        data,
      }
    },
  },
}

export default Model;
