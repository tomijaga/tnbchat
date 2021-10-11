import {FC} from 'react';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import {useDispatch, useSelector} from 'react-redux';
import {setAuthData} from 'store/app';
import {getAuthData} from 'selectors';
import {Aes} from 'utils';
import {AuthStatus} from 'types';

const RegisterPassword: FC = () => {
  const dispatch = useDispatch();
  const {authStatus} = useSelector(getAuthData);

  const handleCreatePasswordForm = ({tnbchatPassword}: any) => {
    /**
     * This fn doesn't store the password
     * Instead it encrypts a known text and stores it in the browser
     *
     * Ownership can be verified if the user can decrypt the stored encrypted key
     */

    const aes = new Aes({password: tnbchatPassword});
    const plainText = process.env.REACT_APP_PLAIN_TEXT;
    if (!plainText) throw new Error("The Website's Plaintext is empty");
    const encryptedText = aes.ctrEncryption(plainText);

    if (encryptedText) {
      localStorage.setItem('encrypted_text', JSON.stringify(encryptedText));

      if (authStatus === AuthStatus.register_password) {
        dispatch(
          setAuthData({
            authStatus: AuthStatus.create_account,
            passwordHash: aes.hashInHex,
          }),
        );
      } else if (authStatus === AuthStatus.verify_password) {
        dispatch(
          setAuthData({
            authStatus: AuthStatus.none,
            passwordHash: aes.hashInHex,
            showAuthModal: false,
          }),
        );
      }
    } else {
      throw new Error('Key could not be Encrypted');
    }
  };

  return (
    <Form onFinish={handleCreatePasswordForm}>
      Enter Password
      <Form.Item name={'tnbchatPassword'}>
        <Input.Password />
      </Form.Item>
      <Form.Item name={'tnbchatPassword2'}>
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit">Create Account</Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterPassword;
