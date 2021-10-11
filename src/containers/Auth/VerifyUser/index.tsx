import {FC, useState} from 'react';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import {useDispatch} from 'react-redux';
import {setAuthData} from 'store/app';

import {Aes} from 'utils';
import {Typography} from 'antd';

const VerifyUser: FC = () => {
  const dispatch = useDispatch();
  const [isWrongPassword, setIsWrongPassword] = useState(false);

  const handleVerifyUser = ({tnbchatPassword}: any) => {
    const aes = new Aes({password: tnbchatPassword});

    const encryptedText = JSON.parse(localStorage.getItem('encrypted_text')!);
    const decryptedText = aes.ctrDecryption(encryptedText);
    console.log({decryptedText});
    if (decryptedText === process.env.REACT_APP_PLAIN_TEXT) {
      console.log('Success!!!');
      dispatch(
        setAuthData({
          passwordHash: aes.hashInHex,
          showAuthModal: false,
          isLoggedIn: true,
        }),
      );
    } else {
      setIsWrongPassword(true);
      console.log('Wrong Password');
    }
  };

  return (
    <Form onFinish={handleVerifyUser}>
      Enter Password
      <Form.Item name={'tnbchatPassword'}>
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
