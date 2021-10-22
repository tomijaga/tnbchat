import {useState} from 'react';
import {useHistory} from 'react-router-dom';
import Card from 'antd/es/card';
import Col from 'antd/es/col';
import Dropdown from 'antd/es/dropdown';

import Menu from 'antd/es/menu';
import Row from 'antd/es/row';
import CaretDownOutlined from '@ant-design/icons/CaretDownOutlined';
import message from 'antd/es/message';

import {DeleteAccountModal} from 'components';
import GettingStarted from './gettingStarted';
import {useDispatch, useSelector} from 'react-redux';
import {setStateAuthData} from 'store/app';
import {verifyAuth} from 'dispatchers';
import {getUserAccount, getUserAccounts, getAuthData} from 'selectors';

import {getPfp} from 'utils';
import {AuthStatus} from 'types';
import Typography from 'antd/es/typography';

const MenuBar = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    state: {hasCreatedSeedPhrase},
  } = useSelector(getAuthData);
  const account = useSelector(getUserAccount);
  const accounts = useSelector(getUserAccounts);

  const [showGettingStarted, setShowGettingStarted] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  return (
    <>
      <DeleteAccountModal
        visible={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        accountNumber={account?.account_number!}
      />

      <GettingStarted visible={showGettingStarted} onClose={() => setShowGettingStarted(false)} />
      <Row
        style={{
          position: 'sticky',
          top: '0px',
          // right: screens.xl ? "calc(50vw + 23vw)" : "80vw",
        }}
        justify="start"
      >
        <Col style={{margin: '50px 20px'}}>
          <Typography.Title level={5}>Decentralized Chat App</Typography.Title>
        </Col>
        <Col span={24}>
          <Row gutter={[30, 30]}>
            <Col span={24}>
              {Object.keys(accounts).length ? (
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item
                        onClick={() => {
                          if (Object.keys(accounts).length >= 5) {
                            return message.error("You can't Create or Import more than 5 Accounts");
                          }

                          dispatch(
                            setStateAuthData({
                              showAuthModal: true,
                              authStatus: AuthStatus.import_account,
                            }),
                          );
                        }}
                      >
                        Import Account
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => {
                          dispatch(
                            setStateAuthData({
                              showManageAccountsModal: true,
                            }),
                          );
                        }}
                      >
                        Manage Accounts
                      </Menu.Item>

                      <Menu.Item
                        danger
                        onClick={() => {
                          setShowDeleteAccountModal(true);
                        }}
                      >
                        Remove {account?.username}
                      </Menu.Item>
                    </Menu>
                  }
                  placement="bottomLeft"
                >
                  <Card style={{borderRadius: '10px'}} size="small">
                    <Row justify="space-between" align="bottom">
                      <Col>
                        <Row align="bottom" gutter={5}>
                          <Col>
                            <img
                              width="25px"
                              src={getPfp(account?.account_number!)}
                              alt="avatar"
                              style={{borderRadius: '2px'}}
                            />{' '}
                          </Col>
                          <Col>{account?.username}</Col>
                        </Row>
                      </Col>
                      <Col>
                        <CaretDownOutlined />
                      </Col>
                    </Row>
                  </Card>
                </Dropdown>
              ) : (
                <Card
                  hoverable
                  style={{borderRadius: '10px'}}
                  size="small"
                  onClick={() => {
                    if (dispatch(verifyAuth)) {
                      if (!hasCreatedSeedPhrase) {
                        dispatch(
                          setStateAuthData({
                            authStatus: AuthStatus.create_account,
                            showAuthModal: true,
                          }),
                        );
                      } else {
                        dispatch(
                          setStateAuthData({
                            showManageAccountsModal: true,
                          }),
                        );
                      }
                    }
                  }}
                >
                  <Row justify="space-between" align="bottom">
                    <Col>
                      <Row align="bottom" gutter={5}>
                        <Col>{!hasCreatedSeedPhrase ? 'Create Seed Phrase' : 'Create an Account'}</Col>
                        <Col>
                          <img
                            width="20px"
                            src={`https://robohash.org/DECENTRALIZED_CHAT_APP.png?sets=set3`}
                            alt="avatar"
                            style={{borderRadius: '2px'}}
                          />{' '}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card>
              )}
            </Col>
            <Col span={24}>
              <Menu
                mode="inline"
                //  inlineCollapsed={!screens.md}
              >
                <Menu.ItemGroup>
                  <Menu.Item
                    key={1}
                    onClick={() => {
                      history.push('/home');
                    }}
                  >
                    Home
                  </Menu.Item>
                  <Menu.Item
                    key="menu-profile-option"
                    onClick={() => {
                      history.push(`/accounts/${account?.account_number}`);
                    }}
                  >
                    Profile
                  </Menu.Item>
                  {/* <Menu.Item>Channels</Menu.Item> */}
                  {/* <Menu.Item>Gov Proposals</Menu.Item> */}
                  {/* <Menu.Item>Wallet</Menu.Item> */}
                </Menu.ItemGroup>
                <Menu.ItemGroup>
                  {/* <Menu.Item>Messages</Menu.Item> */}
                  {/* <Menu.Item>Settings</Menu.Item> */}
                </Menu.ItemGroup>
              </Menu>
            </Col>

            <Col span={24}>
              <Menu
              // inlineCollapsed={!screens.md}
              >
                <Menu.Item onClick={() => setShowGettingStarted(true)}>Getting Started</Menu.Item>
              </Menu>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default MenuBar;
