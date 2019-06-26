import { CreateProductParams, UpdateProductParams } from './data';
import request from '@/utils/request';

export const createProduct = async (params: CreateProductParams) => {
  return request.post('/product/manage', { data: params });
}

export const updateProduct = async (params: UpdateProductParams) => {
  return request.put(`/product/${params.id}`, { data: params });
}

export const uploadFile = async (file: any) => {
  const form = new FormData();
  form.append('file', file);
  return request.post('/product/upload', {
    data: form,
  })
}

export const getProductDetail = async (id: number) => {
  return request.get(`/product/${id}`);
}
