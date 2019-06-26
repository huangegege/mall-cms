import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Form, Input, Select, Button, Card, InputNumber, Row, Col, Upload, Icon, Modal, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './style.less';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { IStateType } from './model';
import { CategoryListItem } from '../category-list/data';
import { ProductDetail } from './data';
import { getBase64 } from '@/utils/utils';
import { EditorState, convertToRaw, ContentState, convertFromHTML } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

const FormItem = Form.Item;
const { Option } = Select;

interface ProductFormProps extends FormComponentProps {
  firstCategoryList: CategoryListItem[],
  secondCategoryList: CategoryListItem[],
  productDetail: ProductDetail,
  submitting: boolean;
  dispatch: Dispatch<any>;
  history: any;
}

interface ProductFormState {
  firstCategoryId: number,
  secondCategoryId: number,
  previewVisible: boolean,
  previewImage: string,
  fileList: any[],
  detail: string,
  richFileList: any[],
  editorState: any,
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
    firstCategoryId: 0,
    secondCategoryId: 0,
    previewVisible: false,
    previewImage: '',
    fileList: [],
    detail: '',
    richFileList: [],
    editorState: EditorState.createEmpty(),
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'productForm/getFirstCategoryList',
    })
  }

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { firstCategoryId, secondCategoryId, fileList, editorState } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (fileList.length === 0) {
          message.warning('请至少上传一张图片');
          return;
        }
        const subImages: any[] = [];
        fileList.forEach(file => {
          subImages.push(file.response.uri);
        });
        const detail = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        const productData = {
          ...values,
          categoryId: secondCategoryId || firstCategoryId || 0,
          subImages: subImages.join(','),
          detail,
        }
        dispatch({
          type: 'productForm/submit',
          payload: productData,
          callback: this.submitSuccess,
        });
      }
    });
  }

  submitSuccess = () => {
    this.props.history.push('/product/product-list');
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

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }: any) => {
    this.setState({ fileList });
  };

  onEditorStateChange = (editorState: any) => {
    console.log('onEditorStateChange', editorState);
    this.setState({ editorState });
  }

  uploadImageCallBack = (file: any) => {
    console.log('uploadImageCallBack');
    const { dispatch } = this.props;
    return new Promise(
      (resolve, reject) => {
        dispatch({
          type: 'productForm/upload',
          payload: file,
          callback: (data: any) => {
            console.log('data', data);
            resolve({ data: { link: data.url } });
          },
        })
      },
    );
  }

  render() {
    const {
      submitting,
      form: { getFieldDecorator, getFieldValue },
      firstCategoryList,
      secondCategoryList,
      productDetail,
    } = this.props;

    const { fileList, previewVisible, previewImage, detail, editorState } = this.state;

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

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );

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
            <FormItem {...formItemLayout} label={<FormattedMessage id="product-form.price.label" />}>
              {
                getFieldDecorator('price', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'product-form.price.required' }),
                    },
                  ],
                })(<InputNumber style={{ width: '100%' }} placeholder={formatMessage({ id: 'product-form.price.placeholder' })} />)
              }
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="product-form.stock.label" />}>
              {
                getFieldDecorator('stock', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'product-form.stock.required' }),
                    },
                  ],
                })(<InputNumber style={{ width: '100%' }} placeholder={formatMessage({ id: 'product-form.stock.placeholder' })} />)
              }
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="product-form.image.label" />}>
              <Upload
                action="/api/product/upload"
                listType="picture-card"
                fileList={fileList}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
              >
                {fileList.length >= 4 ? null : uploadButton}
              </Upload>
              <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="product-form.detail.label" />}>
              <div className={styles.editorWrapper}>
                <Editor
                  editorState={editorState}
                  editorClassName="wysiwyg-editor-wrapper"
                  onEditorStateChange={this.onEditorStateChange}
                  toolbar={{ image: { uploadCallback: this.uploadImageCallBack } }}
                />
              </div>
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="form-basic-form.form.submit" />
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<ProductFormProps>()(ProductForm);
