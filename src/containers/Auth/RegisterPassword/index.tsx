import {FC} from 'react';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import {useDispatch} from 'react-redux';
import {registerPassword} from 'dispatchers/auth';

const RegisterPassword: FC = () => {
  const dispatch = useDispatch();

  const handleCreatePasswordForm = ({password}: any) => {
    /**
     * This fn doesn't store the password
     * Instead it encrypts a known text and stores it in the browser
     *
     * Ownership can be verified if the user can decrypt the stored encrypted key
     */
    dispatch(registerPassword(password));
  };
  console.log('in register');
  return (
    <Form onFinish={handleCreatePasswordForm}>
      Enter Password
      <Form.Item name={'password'}>
        <Input.Password />
      </Form.Item>
      <Form.Item name={'password2'}>
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit">Create Account</Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterPassword;
