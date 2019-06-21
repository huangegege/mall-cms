import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { FormComponentProps } from 'antd/es/form';
import { ColumnProps } from 'antd/es/table';
import { CategoryListItem } from './data';
import { Dispatch } from 'redux';
import { IStateType } from './model';
import styles from './style.less';
import { Form, Divider, Card, Button, Table, message, Alert } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import CreateForm from './components/CreateForm';
import SetNameForm from './components/SetNameForm';

interface CategoryListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  categoryList: IStateType;
}

interface CategoryListState {
  modalVisible: boolean;
  setNameModalVisible: boolean;
  categoryId: number;
  categoryName: string;
  parentCategoryId: number;
  parentCategoryName: string;
}

type TableColumnProps = ColumnProps<CategoryListItem>;

@connect(
  ({
    categoryList,
    loading,
  }: {
    categoryList: IStateType,
    loading: {
      models: {
        [key: string]: boolean,
      },
    },
  }) => ({
    categoryList,
    loading: loading.models.categoryList,
  }),
)
class CategoryList extends Component<CategoryListProps> {
  state: CategoryListState = {
    modalVisible: false,
    setNameModalVisible: false,
    categoryId: 0,
    categoryName: '',
    parentCategoryId: 0,
    parentCategoryName: '',
  }

  columns: TableColumnProps[] = [
    {
      title: '品类ID',
      dataIndex: 'id',
    },
    {
      title: '品类名称',
      dataIndex: 'name',
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => {this.setCategoryName(record.id, record.name)}}>修改名称</a>
          {
            this.state.parentCategoryId === 0 &&
            <Fragment>
              <Divider type="vertical" />
              <a onClick={() => {
                  this.queryChildrenCategory(record.id, record.name)
                }}
              >
                查看其子品类
              </a>
            </Fragment>
          }
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'categoryList/fetch',
    });
  }

  handleAdd = (fields: { name: string, parentId: number }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'categoryList/add',
      payload: {
        name: fields.name,
        parentId: fields.parentId,
      },
    });
    message.success('添加成功');
    this.handleModalVisible();
    this.setState({ parentCategoryId: 0, parentCategoryName: '' });
  }

  handleModalVisible = (flag?: boolean) => {
    this.setState({ modalVisible: !!flag });
  }

  handleSetNameModalVisible = (flag?: boolean) => {
    this.setState({ setNameModalVisible: !!flag });
  }

  setCategoryName = (categoryId: number, categoryName: string) => {
    this.setState({ categoryId, categoryName, setNameModalVisible: true });
  }

  handleSetName = (fields: { name: string }) => {
    const { dispatch } = this.props;
    const { categoryId, parentCategoryId } = this.state;
    dispatch({
      type: 'categoryList/update',
      payload: {
        id: categoryId,
        name: fields.name,
        parentId: parentCategoryId,
      },
    });
    message.success('修改品类名称成功');
    this.handleSetNameModalVisible();
  }

  queryChildrenCategory = (id: number, name: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'categoryList/fetch',
      payload: id,
    });
    this.setState({
      parentCategoryId: id,
      parentCategoryName: name,
    });
  }

  render() {
    const { categoryList: { rootCategoryList, data }, loading, form } = this.props;
    const {
      modalVisible,
      setNameModalVisible,
      parentCategoryId,
      parentCategoryName,
      categoryName,
    } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => {this.handleModalVisible(true)}}
              >
                添加品类
              </Button>
            </div>
            <div className={styles.tableAlert}>
              <Alert
                message={
                  <Fragment>
                    当前分类ID：
                    <a style={{ fontWeight: 600 }}>
                      {parentCategoryId}
                    </a>
                    &nbsp;&nbsp;&nbsp;
                    {
                      parentCategoryId !== 0 &&
                      <span>名称：<a>{parentCategoryName}</a></span>
                    }
              </Fragment>
                }
                type="info"
                showIcon
              />
            </div>
            <Table
              rowKey="id"
              columns={this.columns}
              dataSource={data}
              loading={loading}
            />
          </div>
        </Card>
        {
          modalVisible && <CreateForm
            handleAdd={this.handleAdd}
            handleModalVisible={this.handleModalVisible}
            modalVisible={modalVisible}
            categoryList={rootCategoryList}
            form={form}
          />
        }
        {
          setNameModalVisible && <SetNameForm
            name={categoryName}
            handleSetName={this.handleSetName}
            handleModalVisible={this.handleSetNameModalVisible}
            modalVisible={setNameModalVisible}
            form={form}
          />
        }
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<CategoryListProps>()(CategoryList);
