export interface CategoryListItem {
  id: number;
  name: string;
  status: boolean;
  updateTime: number;
}

export interface AddCategoryParams {
  name: string;
  parentId: number;
}

export interface SetCategoryNameParams {
  id: number;
  name: string;
}
