import {FC} from 'react';
import Col from 'antd/es/col';
import Button from 'antd/es/button';
import Row from 'antd/es/row';
import Form from 'antd/es/form';
import {Input} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {getAuthData, getUserAccounts} from 'selectors';
import {Account} from 'packages/thenewboston/src';

import {setStateAuthData} from 'store/app';
import {AuthStatus} from 'types';

import NewAccount from './NewAccount';
import {importAccount} from 'dispatchers/account';
import {verifyAuth} from 'dispatchers/auth';
import {hexPattern} from 'utils';

export const AddAccount: FC = () => {
  const dispatch = useDispatch();
  const {
    state: {authStatus},
  } = useSelector(getAuthData);

  const accounts = useSelector(getUserAccounts);

  const importForm = () => {
    const handleAccountImport = ({signingKey}: any) => {
      if (!signingKey || signingKey.length < 64) throw new Error('Signing Key is Invalid');

      if (dispatch(verifyAuth)) {
        dispatch(importAccount({signingKey}));
        dispatch(
          setStateAuthData({
            showAuthModal: false,
          }),
        );
      }
    };

    return (
      <Form onFinish={handleAccountImport}>
        <Form.Item
          requiredMark={false}
          label={'Signing Key'}
          name={'signingKey'}
          rules={[
            {len: 64, message: 'Signing Key must have 64 character'},
            {pattern: hexPattern, message: 'Singing Key must be in hex format'},
            {required: true, message: 'Singing Key is Required'},
            {
              validator: (_, signingKey) => {
                const acc = new Account(signingKey);
                if (accounts[acc.accountNumberHex]) {
                  return Promise.reject(new Error('This account already exists'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        {/* <Form.Item label={'Username'} name={'username'}>
          <Input />
        </Form.Item> */}
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
