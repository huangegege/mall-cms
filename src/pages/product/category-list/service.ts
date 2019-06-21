import request from '@/utils/request';
import { AddCategoryParams, SetCategoryNameParams } from './data';

export const queryCategoryList = async (id: number = 0) => {
  return request.get(`/category/${id}`);
}

export const addCategory = async (params: AddCategoryParams) => {
  return request.post(`/category/${params.name}/${params.parentId}`);
}

export const setCategoryName = async (params: SetCategoryNameParams) => {
  return request.put(`/category/name/${params.id}/${params.name}`);
}
