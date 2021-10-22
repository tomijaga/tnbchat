import {FC, useCallback, useEffect} from 'react';
import Modal from 'antd/es/modal';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Divider from 'antd/es/divider';

import Button from 'antd/es/button';
import message from 'antd/es/message';

import {getUserAccounts, getAuthData} from 'selectors';
import {AuthStatus} from 'types';
import {useDispatch, useSelector} from 'react-redux';
import {verifyAuth} from 'dispatchers/auth';
import {createAccount, fetchAndStoreAccountBalance, removeAllUserAccounts} from 'dispatchers/account';
import {setStateAuthData} from 'store/app';

import {ManagedAccount} from './ManagedAccount';

const AccountsManager: FC = () => {
  const dispatch = useDispatch();
  const accounts = useSelector(getUserAccounts);
  const {
    state: {showManageAccountsModal},
  } = useSelector(getAuthData);

  const updateAccountBalances = useCallback(() => {
    console.log('Called ...');
    console.log({accounts});
    Object.keys(accounts).forEach((accountNumber: string) => {
      console.log('Fetching Account Balance of ', accounts[accountNumber].username);
      dispatch(fetchAndStoreAccountBalance(accountNumber));
    });
  }, [accounts, dispatch]);

  useEffect(() => {
    if (showManageAccountsModal === true) updateAccountBalances();
  }, [showManageAccountsModal, updateAccountBalances]);

  const displayManagedAccounts = () => {
    const accountKeys = Object.keys(accounts);

    if (accountKeys.length) {
      return accountKeys.map((key: string) => {
        return (
          <Col span={24}>
            <ManagedAccount userAccount={accounts[key]} />
          </Col>
        );
      });
    }
    return <Col>No Accounts</Col>;
  };

  return (
    <Modal
      title={`Manage Accounts - ${Object.keys(accounts).length}`}
      closable
      centered
      footer={null}
      visible={showManageAccountsModal}
      onCancel={() => {
        dispatch(
          setStateAuthData({
            showManageAccountsModal: false,
          }),
        );
      }}
    >
      <Row>
        <Col>
          <span style={{position: 'relative', top: '-5px'}}>Switch between accounts</span>

          <Row style={{height: '300px', overflow: 'auto'}} align="top">
            {displayManagedAccounts()}
          </Row>
        </Col>

        <Col span={24}>
          <span style={{position: 'relative', top: '15px'}}>Create or import a max of 5 accounts</span>
          <Divider orientation="left" plain={false} style={{fontSize: 'small'}}></Divider>
          <Row gutter={20} justify="center">
            <Col span={10}>
              <Button
                style={{width: '100%'}}
                type="text"
                onClick={() => {
                  if (Object.keys(accounts).length >= 5) {
                    return message.error("You can't Create or Import more than 5 Accounts");
                  }
                  if (dispatch(verifyAuth)) {
                    dispatch(createAccount);
                    message.success(`Created New Account`);
                  }
                }}
              >
                Create Account
              </Button>
            </Col>

            <Col span={10}>
              <Button
                style={{width: '100%'}}
                type="text"
                onClick={() => {
                  if (Object.keys(accounts).length >= 5) {
                    return message.error("You can't Create or Import more than 5 Accounts");
                  }

                  if (dispatch(verifyAuth)) {
                    dispatch(
                      setStateAuthData({
                        showAuthModal: true,
                        authStatus: AuthStatus.import_account,
                      }),
                    );
                  }
                }}
              >
                Import Account
              </Button>
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <Divider />
          <Button
            type="text"
            danger
            style={{width: '100%'}}
            onClick={() => {
              if (dispatch(removeAllUserAccounts)) {
                message.info(`All Accounts have been removed`);
              }
            }}
          >
            Remove All Accounts
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};

export default AccountsManager;
