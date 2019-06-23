import React, { Component, Fragment } from 'react';
import { Table, Alert } from 'antd';
import { TableProps, ColumnProps, SorterResult } from 'antd/es/table';
import styles from './index.less';
import { ProductListItem } from '../../data';
import { TableCurrentDataSource } from 'antd/lib/table';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type StandardTableColumnProps = ColumnProps<ProductListItem> & {
  needTotal?: boolean;
  total?: number;
}

export interface StandardTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: StandardTableColumnProps[];
  data: {
    list: Array<ProductListItem>;
    pagination: StandardTableProps<ProductListItem>['pagination'];
  };
  selectedRows: ProductListItem[];
  onSelectRow: (rows: any) => void;
}

const initTotalList = (columns: StandardTableColumnProps[]) => {
  if (!columns) {
    return [];
  }
  const totalList: StandardTableColumnProps[] = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

interface StandardTableState {
  selectedRowKeys: string[] | number[];
  needTotalList: StandardTableColumnProps[];
}

class StandardTable extends Component<StandardTableProps<ProductListItem>, StandardTableState> {
  static getDerivedStateFromProps(nextProps: StandardTableProps<ProductListItem>) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
    }
    return null;
  }

  constructor(props: StandardTableProps<ProductListItem>) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }

  handleRowSelectChange = (selectedRowKeys: string[] | number[], selectedRows: ProductListItem[]) => {
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => {
        if (item.dataIndex !== undefined) {
          return sum + parseFloat(val[item.dataIndex]);
        }
        return sum;
      }, 0),
    }));

    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, needTotalList });
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    const { data, rowKey, ...rest } = this.props;
    const { list = [], pagination = false } = data || {};

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
    };

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={
              <Fragment>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                {
                  needTotalList.map((item) => (
                    <span style={{ marginLeft: 8 }} key={item.dataIndex}>
                      {item.title}
                      总计&nbsp;
                      <span style={{ fontWeight: 600 }}>
                        {item.total}
                      </span>
                    </span>
                  ))
                }
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                  清空
                </a>
              </Fragment>
            }
            type="info"
            showIcon
          />
        </div>
        <Table
          rowKey={rowKey || 'id'}
          rowSelection={rowSelection}
          dataSource={list}
          pagination={paginationProps}
          {...rest}
        />
      </div>
    )
  }
}

export default StandardTable;
