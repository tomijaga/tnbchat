import {useState} from 'react';
import {useHistory} from 'react-router-dom';
import Card from 'antd/es/card';
import Col from 'antd/es/col';
import Dropdown from 'antd/es/dropdown';
import Button from 'antd/es/button';
import Menu from 'antd/es/menu';
import Row from 'antd/es/row';
import CaretDownOutlined from '@ant-design/icons/CaretDownOutlined';
import message from 'antd/es/message';

import {DeleteAccountModal, CustomTags, ProfilePicture} from 'components';
import GettingStarted from './gettingStarted';
import {useDispatch, useSelector} from 'react-redux';
import {setStateAuthData} from 'store/app';
import {lockApp, unlockApp, verifyAuth} from 'dispatchers';
import {getUserAccount, getUserAccounts, getAuthData, getUserProfiles} from 'selectors';

import {AuthStatus} from 'types';
import Typography from 'antd/es/typography';
import Tooltip from 'antd/es/tooltip';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCoffee, faLock, faLockOpen} from '@fortawesome/free-solid-svg-icons';

const MenuBar = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    state: {hasCreatedSeedPhrase, isLoggedIn},
  } = useSelector(getAuthData);
  const account = useSelector(getUserAccount);
  const accounts = useSelector(getUserAccounts);

  const profiles = useSelector(getUserProfiles);
  const profile = account?.account_number ? profiles[account?.account_number] : null;

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
        <Col style={{margin: '50px 0px'}}>
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
                      <Col span={20} flex="1 1 100px">
                        <Row align="bottom" gutter={5}>
                          <Col>
                            {account?.account_number && (
                              <ProfilePicture accountNumber={account?.account_number} size={'small'} />
                            )}
                          </Col>
                          <Col>
                            <Typography.Text ellipsis style={{fontSize: 'small'}} strong>
                              {' '}
                              {profile?.display_name}{' '}
                            </Typography.Text>
                          </Col>
                        </Row>
                      </Col>
                      <Col flex="0 0 auto" span={2}>
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
                    key={'channels'}
                    onClick={() => {
                      history.push('/channels');
                    }}
                  >
                    Channels
                  </Menu.Item>
                  <Menu.SubMenu title="Governance" key="governance">
                    <Menu.Item
                      key="governance/voting"
                      onClick={() => {
                        history.push('/governance/voting');
                      }}
                    >
                      Voting {<CustomTags type="gov" />}
                    </Menu.Item>
                    <Menu.Item
                      key="governance/boosting"
                      onClick={() => {
                        history.push('/governance/boosting');
                      }}
                    >
                      Node Boosting
                    </Menu.Item>
                    <Menu.Item
                      key="governance/proposals"
                      onClick={() => {
                        history.push('/governance/proposals');
                      }}
                    >
                      Proposals
                    </Menu.Item>
                  </Menu.SubMenu>
                </Menu.ItemGroup>
                <Menu.ItemGroup>
                  {hasCreatedSeedPhrase && (
                    <>
                      <Menu.Item
                        key="menu-profile-option"
                        onClick={() => {
                          history.push(`/accounts/${account?.account_number}`);
                        }}
                      >
                        Profile / Wallet
                      </Menu.Item>
                      <Menu.Item
                        key={'messages'}
                        onClick={() => {
                          history.push('/messages');
                        }}
                      >
                        Messages
                      </Menu.Item>
                      {/* <Menu.Item
                        key={'wallet'}
                        onClick={() => {
                          history.push('/wallet');
                        }}
                      >
                        Wallet
                      </Menu.Item> */}

                      <Menu.Item
                        key={'settings'}
                        onClick={() => {
                          history.push('/settings');
                        }}
                      >
                        Settings
                      </Menu.Item>
                    </>
                  )}
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

            <Col span={24}>
              <Tooltip
                title={
                  isLoggedIn ? (
                    <>{<FontAwesomeIcon icon={faLock} />} Lock App</>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faLockOpen} /> Unlock App
                    </>
                  )
                }
              >
                <Button
                  block
                  icon={<FontAwesomeIcon icon={isLoggedIn ? faLockOpen : faLock} />}
                  onClick={() => {
                    if (isLoggedIn) {
                      dispatch(lockApp);
                    } else {
                      dispatch(unlockApp);
                    }
                  }}
                >
                  &nbsp;&nbsp;
                  {isLoggedIn ? 'Unclocked' : 'App is Locked'}
                </Button>
              </Tooltip>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default MenuBar;
