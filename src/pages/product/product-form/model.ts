import { message } from 'antd';
import { createProduct, updateProduct, getProductDetail, uploadFile } from './service';
import { EffectsCommandMap } from 'dva';
import { AnyAction, Reducer } from 'redux';
import { ProductDetail } from './data';
import { CategoryListItem } from '../category-list/data';
import { queryCategoryList } from '../category-list/service';

export interface IStateType {
  productDetail: ProductDetail;
  firstCategoryList: CategoryListItem[];
  secondCategoryList: CategoryListItem[];
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
    getFirstCategoryList: Effect;
    getSecondCategoryList: Effect;
    getProductDetail: Effect;
    upload: Effect;
  };
  reducers: {
    saveFirstCategoryList: Reducer<IStateType>;
    saveSecondCategoryList: Reducer<IStateType>;
    saveProductDetail: Reducer<IStateType>;
    resetProductDetail: Reducer<IStateType>;
  }
}

const initDetailState = {
  id: 0,
  categoryId: 0,
  name: '',
  subtitle: '',
  mainImage: '',
  subImages: '',
  detail: '',
  price: undefined,
  stock: undefined,
  status: 1,
  createTime: new Date(),
  updateTime: new Date(),
  imageHost: '',
  parentCategoryId: 0,
};

const Model: ModelType = {
  namespace: 'productForm',

  state: {
    productDetail: { ...initDetailState },
    firstCategoryList: [],
    secondCategoryList: [],
  },

  effects: {
    *submit({ payload, callback }, { call }) {
      let submitFunc: any;
      if (payload.id == null) {
        submitFunc = createProduct;
      } else {
        submitFunc = updateProduct;
      }
      yield call(submitFunc, payload);
      message.success('提交成功');
      if (callback) callback();
    },
    *getFirstCategoryList({ payload }, { call, put }) {
      const response = yield call(queryCategoryList);
      yield put({
        type: 'saveFirstCategoryList',
        payload: response,
      });
    },
    *getSecondCategoryList({ payload }, { call, put }) {
      const response = yield call(queryCategoryList, payload);
      yield put({
        type: 'saveSecondCategoryList',
        payload: response,
      });
    },
    *getProductDetail({ payload, callback }, { call, put }) {
      const response = yield call(getProductDetail, payload);
      yield put({
        type: 'saveProductDetail',
        payload: response,
      });
      if (callback) callback(response);
    },
    *upload({ payload, callback }, { call, put }) {
      const response = yield call(uploadFile, payload);
      callback(response);
    },
  },
  reducers: {
    saveFirstCategoryList(state, action) {
      return {
        ...state,
        firstCategoryList: action.payload,
      }
    },
    saveSecondCategoryList(state, action) {
      return {
        ...state,
        secondCategoryList: action.payload,
      }
    },
    saveProductDetail(state, action) {
      return {
        ...state,
        productDetail: action.payload,
      }
    },
    resetProductDetail(state) {
      return {
        ...state,
        productDetail: { ...initDetailState },
      }
    },
  },
}

export default Model;
