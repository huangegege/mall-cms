import { ProductStatus } from './constant';

export interface ProductListItem {
  id: number;
  name: string;
  subtitle: string;
  price: number;
  status: number;
}

export interface ProductListPagination {
  current: number;
  pageSize: number;
  total: number;
}

export interface ProductListData {
  list: ProductListItem[];
  pagination: Partial<ProductListPagination>;
}

export interface QueryProductParams {
  categoryId?: number,
  keyword?: string,
  pageNum?: number;
  pageSize?: number;
}

export interface ProductListParams {
  sorter: string;
  status: number;
  categoryId: number;
  keyword: string;
  pageNum: number;
  pageSize: number;
}

export interface AddProductParams {
  name: string;
  parentId: number;
}

export interface SetProductStatusParams {
  productId: number;
  status: ProductStatus;
}
