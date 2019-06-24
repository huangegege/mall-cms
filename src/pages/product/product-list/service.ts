import request from '@/utils/request';
import { QueryProductParams, AddProductParams, SetProductStatusParams } from './data';

export const queryProductList = async (params: QueryProductParams) => {
  return request.get('/product/search', { params });
}

export const setProductStatus = async (params: SetProductStatusParams) => {
  return request.put(`/product/manage/status/${params.productId}`, {
    data: { status: params.status},
  });
}

export const addProduct = async (params: AddProductParams) => {
  return request.post(`/product/manage/${params.name}/${params.parentId}`);
}
