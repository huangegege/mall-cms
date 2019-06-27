import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { ProductListItem, ProductListPagination, ProductListParams } from './data';
import { Dispatch } from 'redux';
import { IStateType } from './model';
import { ProductStatus } from './constant';
import styles from './style.less';
import { Form, Divider, Card, Button, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/lib/table';
import SearchForm from './components/SearchForm';
import Link from 'umi/link';

const getValue = (obj: { [x: string]: string[] }) => {
  return Object.keys(obj).map(key => obj[key]).join(',');
}

interface ProductListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  productList: IStateType;
}

interface ProductListState {
  selectedRows: Array<ProductListItem>;
  formValues: { [key: string]: string };
}

@connect(
  ({
    productList,
    loading,
  }: {
    productList: IStateType,
    loading: {
      models: {
        [key: string]: boolean,
      },
    },
  }) => ({
    productList,
    loading: loading.models.productList,
  }),
)
class CategoryList extends Component<ProductListProps, ProductListState> {
  state: ProductListState = {
    selectedRows: [],
    formValues: {},
  }

  columns: StandardTableColumnProps[] = [
    {
      title: '商品ID',
      dataIndex: 'id',
    },
    {
      title: '商品名称',
      dataIndex: 'name',
    },
    {
      title: '副标题',
      dataIndex: 'subtitle',
    },
    {
      title: '价格',
      dataIndex: 'price',
      needTotal: true,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      needTotal: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: [
        {
          text: '在售',
          value: '1',
        },
        {
          text: '已下架',
          value: '2',
        },
      ],
      render: (status) => {
        return status === ProductStatus.ON_SALE ? '在售' : '已下架'
      },
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => {this.setProductStatus(record.id, record.status)}}>
            {
              record.status === ProductStatus.ON_SALE ? '下架' : '上架'
            }
          </a>
          <Divider type="vertical" />
          <Link to={{ pathname: '/product/product-detail', state: { type: 'check', id: record.id } }}>查看</Link>
          <Divider type="vertical" />
          <Link to={{ pathname: '/product/product-detail', state: { type: 'edit', id: record.id } }}>编辑</Link>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'productList/fetch',
    });
  }

  setProductStatus = (productId: number, status: number) => {
    const { dispatch, form, productList: { data: { pagination } } } = this.props;
    if (status === ProductStatus.ON_SALE) {
      status = ProductStatus.OFF_SHELF;
    } else {
      status = ProductStatus.ON_SALE;
    }
    dispatch({
      type: 'productList/setStatus',
      payload: {
        productId,
        status,
        ...form.getFieldsValue(),
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
    message.success('操作成功');
  }

  checkProduct = (id: number) => {
    console.log(`checkProduct id: ${id}`);
  }

  editProduct = (id: number) => {
    console.log(`editProduct id: ${id}`);
  }

  handleSelectRows = (rows: ProductListItem[]) => {
    this.setState({ selectedRows: rows });
  }

  handleTableChange = (
    pagination: Partial<ProductListPagination>,
    filterArg: Record<keyof ProductListItem, string[]>,
    sorter: SorterResult<ProductListItem>,
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filterArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filterArg[key]);
      return newObj;
    }, {});

    const params: Partial<ProductListParams> = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'productList/fetch',
      payload: params,
    });
  }

  handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.setState({ formValues: fieldsValue });
      dispatch({
        type: 'productList/fetch',
        payload: fieldsValue,
      })
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({ formValues: {} });
    dispatch({
      type: 'productList/fetch',
    });
  }

  render() {
    const { loading, productList: { data }, form } = this.props;
    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableListForm}>
            <SearchForm
              handleSearch={this.handleSearch}
              handleFormReset={this.handleFormReset}
              form={form}
            />
          </div>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Link to={{ pathname: '/product/product-detail', state: { type: 'create' }}} >
                <Button icon="plus" type="primary">添加商品</Button>
              </Link>
            </div>
          </div>
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={data}
            columns={this.columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleTableChange}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<ProductListProps>()(CategoryList);
