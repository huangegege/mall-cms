import React from 'react';
import { Input, Modal, Form, Select } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { CategoryListItem } from '../data';

const FormItem = Form.Item;
const Option = Select.Option;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  categoryList: CategoryListItem[];
  handleAdd: (
    fieldsValue: {
      name: string,
      parentId: number,
    },
  ) => void;
  handleModalVisible: () => void;
}

const CreateForm: React.SFC<CreateFormProps> = props => {
  const { modalVisible, categoryList, form, handleAdd, handleModalVisible } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    })
  }

  return (
    <Modal
      destroyOnClose
      title="添加品类"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属品类">
        {
          form.getFieldDecorator(
            'parentId',
            {
              rules: [{ required: true, message: '请选择所属品类' }],
            },
          )(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择所属品类"
            >
              <Option value="0">/所有</Option>
                {
                    categoryList.map((category) => {
                        return (
                          <Option value={category.id} key={category.id}>
                            /所有/{category.name}
                          </Option>
                        );
                    })
                }
            </Select>,
          )
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="品类名称">
        {
          form.getFieldDecorator(
            'name',
            {
              rules: [{ required: true, message: '请输入品类名称' }],
            },
          )(<Input placeholder="请输入品类名称" />)
        }
      </FormItem>
    </Modal>
  );
}

export default CreateForm;
