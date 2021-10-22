import {FC, useState} from 'react';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import {useDispatch} from 'react-redux';
import {setStateAuthData, setSessionAuthData} from 'store/app';

import {Aes} from 'utils';
import {Typography} from 'antd';
import {verifyPassword} from 'dispatchers/auth';

const VerifyUser: FC = () => {
  const dispatch = useDispatch();
  const [isWrongPassword, setIsWrongPassword] = useState(false);

  const handleVerifyUser = ({password}: any) => {
    if (dispatch(verifyPassword(password))) {
      dispatch(
        setStateAuthData({
          showAuthModal: false,
          isLoggedIn: true,
        }),
      );
    }
  };

  return (
    <Form onFinish={handleVerifyUser}>
      Enter Password
      <Form.Item name={'password'}>
        <Input.Password />
      </Form.Item>
      {isWrongPassword && <Typography.Text type="danger">Wrong Password</Typography.Text>}
      <Form.Item>
        <Button htmlType="submit">Sign In</Button>
      </Form.Item>
    </Form>
  );
};

export default VerifyUser;
