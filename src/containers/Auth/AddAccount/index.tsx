import {FC} from 'react';
import Col from 'antd/es/col';
import Button from 'antd/es/button';
import Row from 'antd/es/row';
import Form from 'antd/es/form';
import {Input} from 'antd';
import {Aes} from 'utils';
import {useDispatch, useSelector} from 'react-redux';
import {getAuthData} from 'selectors';
import {setAuthData} from 'store/app';
import {AuthStatus} from 'types';
import {AccountManager} from 'utils/account-manager';

import NewAccount from './NewAccount';

export const AddAccount: FC = () => {
  const dispatch = useDispatch();
  const {authStatus, passwordHash} = useSelector(getAuthData);

  const importForm = () => {
    const handleAccountImport = ({signingKey, username}: any) => {
      if (!signingKey || signingKey.length < 64) throw new Error('Signing Key is Invalid');

      if (passwordHash === null)
        return dispatch(
          setAuthData({
            authStatus: AuthStatus.verify_password,
          }),
        );

      const signing_key_hash = new Aes({hash: passwordHash}).ctrEncryption(signingKey);

      const accountManager = new AccountManager({hash: passwordHash});

      accountManager.importAddress(signing_key_hash, username);
    };

    return (
      <Form onFinish={handleAccountImport}>
        <Form.Item label={'Signing Key'} name={'signingKey'}>
          <Input.Password />
        </Form.Item>
        <Form.Item label={'Username'} name={'username'}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit">Import Account</Button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <Row gutter={[40, 40]} justify="center">
      <Col>{authStatus === AuthStatus.create_account ? <NewAccount /> : importForm()}</Col>
    </Row>
  );
};

export default AddAccount;
