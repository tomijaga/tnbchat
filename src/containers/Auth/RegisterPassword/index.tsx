import {FC} from 'react';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Button from 'antd/es/button';

const RegisterPassword: FC<{onFinish: (obj: any) => void}> = ({onFinish}) => {
  return (
    <Form onFinish={onFinish}>
      Enter Password
      <Form.Item name={'tnbchatPassword'}>
        <Input.Password />
      </Form.Item>
      <Form.Item name={'tnbchatPassword2'}>
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit">Submit Password</Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterPassword;
