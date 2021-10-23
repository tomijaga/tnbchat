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
  return (
    <Form onFinish={handleCreatePasswordForm}>
      Enter Password
      <Form.Item
        name={'password'}
        rules={[
          {
            required: true,
            message: 'Password cannot be empty',
          },
          {
            min: 8,
            message: 'Password must be at least 8 characters',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      Confirm Password
      <Form.Item
        name={'confirm'}
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({getFieldValue}) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit">Create Account</Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterPassword;
