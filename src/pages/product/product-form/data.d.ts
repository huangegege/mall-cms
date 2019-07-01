export interface ProductDetail {
  id: number;
  categoryId: number;
  name: string;
  subtitle: string;
  mainImage: string;
  subImages: string;
  detail: string;
  price: number | undefined;
  stock: number | undefined;
  status: number;
  createTime: Date;
  updateTime: Date;

  imageHost: string;
  parentCategoryId: number;
}

export interface CreateProductParams {
  categoryId: number;
  name: string;
  subtitle: string;
  mainImage: string;
  subImages: string;
  detail: string;
  price: number;
  stock: number;
  status: number;
}

export interface UpdateProductParams {
  id: number;
  product: Partial<CreateProductParams>;
}
