import React from 'react';
import { Input, Modal, Form } from 'antd';
import { FormComponentProps } from 'antd/es/form';

const FormItem = Form.Item;

interface SetNameFormProps extends FormComponentProps {
  modalVisible: boolean;
  name: string;
  handleSetName: (
    fieldsValue: {
      name: string,
    },
  ) => void;
  handleModalVisible: () => void;
}

const SetNameForm: React.SFC<SetNameFormProps> = props => {
  const { modalVisible, name, form, handleSetName, handleModalVisible } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleSetName(fieldsValue);
    })
  }

  return (
    <Modal
      destroyOnClose
      title="修改品类名称"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="品类名称">
        {
          form.getFieldDecorator(
            'name',
            {
              initialValue: name,
              rules: [{ required: true, message: '请输入品类名称' }],
            },
          )(<Input placeholder="请输入品类名称" />)
        }
      </FormItem>
    </Modal>
  );
}

export default SetNameForm;
