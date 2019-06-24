import { CreateProductParams, UpdateProductParams } from './data';
import request from '@/utils/request';

export const createProduct = async (params: CreateProductParams) => {
  return request.post('/product', { data: params });
}

export const updateProduct = async (params: UpdateProductParams) => {
  return request.put(`/product/${params.id}`, { data: params });
}

export const getProductDetail = async (id: number) => {
  return request.get(`/product/${id}`);
}
