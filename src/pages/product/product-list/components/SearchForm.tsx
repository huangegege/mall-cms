import React from 'react';
import { Input, Form, Row, Col, Button } from 'antd';
import { FormComponentProps } from 'antd/es/form';

const FormItem = Form.Item;

interface SearchFormProps extends FormComponentProps {
  handleSearch: (event: React.FocusEvent) => void;
  handleFormReset: () => void;
}

const CreateForm: React.SFC<SearchFormProps> = props => {
  const { form, handleSearch, handleFormReset } = props;
  const { getFieldDecorator } = form;

  return (
    <Form onSubmit={handleSearch} layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
          <FormItem label="品类ID">
            {getFieldDecorator('categoryId')(<Input placeholder="请输入品类ID" />)}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem label="商品名称">
            {getFieldDecorator('keyword')(<Input placeholder="请输入商品名称" />)}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <Button type="primary" htmlType="submit">查询</Button>
          <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>重置</Button>
        </Col>
      </Row>
    </Form>
  );
}

export default CreateForm;
