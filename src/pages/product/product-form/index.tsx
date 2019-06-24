import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Form, Input, Select, Button, Card, InputNumber, Row, Col } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './style.less';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { IStateType } from './model';
import { CategoryListItem } from '../category-list/data';
import { ProductDetail } from './data';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

interface ProductFormProps extends FormComponentProps {
  firstCategoryList: CategoryListItem[],
  secondCategoryList: CategoryListItem[],
  productDetail: ProductDetail,
  submitting: boolean;
  dispatch: Dispatch<any>;
}

interface ProductFormState {
  firstCategoryId: number,
  secondCategoryId: number,
}

@connect(
  (
    {
      productForm,
      loading,
    }: {
      productForm: IStateType,
      loading: { effects: { [key: string]: boolean } },
    }) => ({
    firstCategoryList: productForm.firstCategoryList,
    secondCategoryList: productForm.secondCategoryList,
    productDetail: productForm.productDetail,
    submitting: loading.effects['productForm/submit'],
  }),
)
class ProductForm extends Component<ProductFormProps, ProductFormState> {
  state: ProductFormState = {
    firstCategoryId: -1,
    secondCategoryId: -1,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'productForm/getFirstCategoryList',
    })
  }

  handleSubmit = (e: React.FormEvent) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'productForm/submit',
          payload: values,
        });
      }
    });
  }

  onFirstCategoryChange = (value: number) => {
    const { dispatch } = this.props;
    this.setState({ firstCategoryId: value });
    dispatch({
      type: 'productForm/getSecondCategoryList',
      payload: value,
    })
  }

  onSecondCategoryChange = (value: number) => {
    this.setState({ secondCategoryId: value });
  }

  render() {
    const {
      submitting,
      form: { getFieldDecorator, getFieldValue },
      firstCategoryList,
      secondCategoryList,
      productDetail,
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="product-form.name.label" />}>
              {
                getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'product-form.name.required' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'product-form.name.placeholder' })} />)
              }
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="product-form.desc.label" />}>
              {
                getFieldDecorator('subtitle', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'product-form.desc.required' }),
                    },
                  ],
                })(<Input placeholder={formatMessage({ id: 'product-form.desc.placeholder' })} />)
              }
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="product-form.category.label" />}>
              <Row gutter={8}>
                <Col span={12}>
                  <Select placeholder="请选择一级品类" onChange={this.onFirstCategoryChange}>
                    {
                      firstCategoryList.map(category => (
                        <Option value={category.id} key={category.id}>{category.name}</Option>
                      ))
                    }
                  </Select>
                </Col>
                {
                  secondCategoryList.length > 0 &&
                  <Col span={12}>
                    <Select placeholder="请选择二级品类" onChange={this.onSecondCategoryChange}>
                      {
                        secondCategoryList.map(category => (
                          <Option value={category.id} key={category.id}>{category.name}</Option>
                        ))
                      }
                    </Select>
                  </Col>
                }
              </Row>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<ProductFormProps>()(ProductForm);
