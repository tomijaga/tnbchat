import {ReactNode, useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import Image from 'antd/es/image';
import Tabs from 'antd/es/tabs';
import Form from 'antd/es/form';
import Card from 'antd/es/card';
import Button from 'antd/es/button';
import Modal from 'antd/es/modal';
import Col from 'antd/es/col';
import Input from 'antd/es/input';
import {useDispatch, useSelector} from 'react-redux';
import {getUserAccountBalances, getUserAccount, getUserAccounts, getUserProfiles} from 'selectors';
import {AccountNumber, Post, DeleteAccountModal} from 'components';
import message from 'antd/es/message';
import axios from 'axios';
import LinkOutlined from '@ant-design/icons/LinkOutlined';
import GlobalOutlined from '@ant-design/icons/GlobalOutlined';
import EnvironmentOutlined from '@ant-design/icons/EnvironmentOutlined';
import MailOutlined from '@ant-design/icons/MailOutlined';

import tinyUrl from 'tinyurl';
import {Link} from 'react-router-dom';
import tnbLogo from 'assets/tnbLogo/30px.png';
import {ReactComponent as TnbLogo} from 'assets/tnb3.svg';
import Icon from '@ant-design/icons/lib/components/Icon';

import Row from 'antd/es/row';
import Grid from 'antd/es/grid';
import {getPosts, getUserProfile, PostData} from 'api';
import {currentNetworkBank, mainnetBank, testnetBank} from 'api/node';
import {Dict, IpfsProfileData, UserData} from 'types';

import {getDefaultPfp, TNBChatAccountManager} from 'utils';
import {fetchAndStoreAccountBalance, storeAccountCoins, switchUserAccount} from 'dispatchers/account';
import {Typography} from 'antd';
import {setAccountBalance, setUserProfile} from 'store';

const {TabPane} = Tabs;
const {useBreakpoint} = Grid;

interface ProfileParams {
  account_number: string;
}

const Profile = () => {
  let accountNumber = useParams<ProfileParams>().account_number;

  const dispatch = useDispatch();
  const selectedManagedAccount = useSelector(getUserAccount);

  const accounts = useSelector(getUserAccounts);

  const profiles = useSelector(getUserProfiles);
  const profile = profiles[accountNumber];

  const balances = useSelector(getUserAccountBalances);
  const balance = balances[accountNumber];

  const [profileIsOwnedByUser, setProfileIsOwnedByUser] = useState(!!accounts[accountNumber]);
  const [form] = Form.useForm();

  const screens = useBreakpoint();

  const [posts, setPosts] = useState<PostData[]>([]);

  const [editProfileModal, showEditProfileModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  useEffect(() => {
    const isOwned = !!accounts[accountNumber];
    if (isOwned === profileIsOwnedByUser) {
      return;
    } else {
      setProfileIsOwnedByUser(isOwned);
    }
  }, [accounts, profileIsOwnedByUser, accountNumber]);

  useEffect(() => {
    const getUserAccountInfo = async () => {
      //   const apiProfileData: Partial<ProfileData> = {};
      let username: string = '';

      if (accountNumber && accountNumber.length < 64) {
        username = accountNumber;
      }

      getPosts({account_number: accountNumber}).then((results) => {
        setPosts(results);
      });

      getUserProfile(accountNumber).then((profileResponse) => {
        if (profileResponse && profileResponse?.ipfs_data) {
          dispatch(setUserProfile({account_number: accountNumber, ...profileResponse.ipfs_data}));
        }
      });

      const testnetPV = await testnetBank.getBankPV();
      const testnet_balance = (await testnetPV.getAccountBalance(accountNumber)).balance ?? 0;

      const mainnetPV = await mainnetBank.getBankPV();
      const mainnet_balance = (await mainnetPV.getAccountBalance(accountNumber)).balance ?? 0;

      dispatch(setAccountBalance({account_number: accountNumber, testnet_balance, mainnet_balance}));
    };

    getUserAccountInfo();
  }, [accountNumber, profileIsOwnedByUser, dispatch]);

  const renderProfileButtons = () => {
    let components: ReactNode;
    if (selectedManagedAccount?.account_number === accountNumber) {
      components = (
        <Button
          type="dashed"
          style={{fontSize: screens.xs ? 'smaller' : 'small'}}
          onClick={() => showEditProfileModal(true)}
        >
          Edit Profile
        </Button>
      );
    } else if (accounts[accountNumber]) {
      components = (
        <Button
          style={{fontSize: screens.xs ? 'smaller' : 'small'}}
          onClick={() => {
            const currUsername = selectedManagedAccount?.username;
            const nextUsername = accounts[accountNumber].username;

            dispatch(switchUserAccount(accountNumber));

            message.info(`Switched  ${currUsername} -> ${nextUsername}`);
          }}
        >
          Switch Account
        </Button>
      );
    }
    return components;
  };

  const [newPfpLink, setNewPfpLink] = useState('');
  const [newBannerLink, setNewBannerLink] = useState('');

  const bannerRef = useRef<Input>(null);
  const pfpRef = useRef<Input>(null);

  const verifyAndDisplayImage = async (url: string, callback: (url: string) => void) => {
    if (url) {
      try {
        const {status} = await axios.get(url);
        if (status === 200) {
          callback(url);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const displayImageOnBlur =
    (callback: (url: string) => void) =>
    ({target: {value}}: any) => {
      verifyAndDisplayImage(value, callback);
    };

  const displayImageOnPaste = (callback: (url: string) => void) => (e: any) => {
    const value = e.clipboardData?.getData('Text');
    verifyAndDisplayImage(value, callback);
  };

  const removeImageOnEmpty =
    (callback: (url: string) => void) =>
    ({target: {value}}: any) => {
      if (!value) {
        callback('');
      }
    };

  const saveUserProfile = async (data: IpfsProfileData) => {
    const sk_for_user_profiles = process.env?.REACT_APP_ONCHAIN_USER_PROFILES;
    if (sk_for_user_profiles && sk_for_user_profiles.length === 64) {
      const profile_account = new TNBChatAccountManager(sk_for_user_profiles);
      const user_account_number = selectedManagedAccount?.account_number;
      if (user_account_number) {
        if (data.banner_url && data.banner_url.length > 20 && !data.banner_url.includes('https://tinyurl.com')) {
          const shortenedUrl = await tinyUrl.shorten(data.banner_url);
          console.log(shortenedUrl);
          data.banner_url = shortenedUrl;
        }

        if (data.pfp_url && data.pfp_url.length > 20 && !data.pfp_url.includes('https://tinyurl.com')) {
          const shortenedUrl = await tinyUrl.shorten(data.pfp_url);
          console.log(shortenedUrl);
          data.pfp_url = shortenedUrl;
        }

        try {
          const profileResponse = await profile_account.createProfile(user_account_number, data);
          if (profileResponse.ipfs_data) {
            dispatch(setUserProfile({account_number: accountNumber, ...profileResponse.ipfs_data}));
            message.success('Profile Successfully Updated');
          }
        } catch (e) {
          message.error('Error Saving Profile');
          console.error(e);
        }
      }
    }
  };

  return (
    <>
      <Modal
        visible={editProfileModal}
        onCancel={() => showEditProfileModal(false)}
        title="Edit Your Public Profile"
        okText="Save"
        onOk={async () => {
          try {
            await form.validateFields();
            form.submit();
            showEditProfileModal(false);
          } catch (e) {
            console.error(e);
          }
        }}
        centered
      >
        <Row style={{overflowY: 'auto', maxHeight: '60vh'}}>
          <Col span={24}>
            <Card
              hoverable
              style={{height: '100px'}}
              cover={
                <Image
                  onClick={() => {
                    (bannerRef?.current as any)?.scrollIntoView?.();
                    bannerRef?.current?.focus();
                  }}
                  style={{height: '100px'}}
                  preview={{mask: <LinkOutlined />, visible: false}}
                  src={newBannerLink || profile?.banner_url || 'https://tinyurl.com/3y8h846f'}
                  alt="error retrieving image"
                />
              }
            />
            <Card
              size="small"
              hoverable
              style={{
                position: 'absolute',
                borderRadius: '1em',
                width: '100px',
                height: '100px',
                top: '40px',
                left: '24px',
                overflow: 'hidden',
              }}
              cover={
                <Image
                  onClick={() => {
                    (pfpRef?.current as any)?.scrollIntoView?.();
                    pfpRef?.current?.focus();
                  }}
                  preview={{mask: <LinkOutlined />, visible: false}}
                  src={newPfpLink || profile?.pfp_url || getDefaultPfp(accountNumber)}
                  alt="error retrieving image"
                />
              }
            />
          </Col>

          <Col span={24} style={{marginTop: '60px'}}>
            <Form form={form} layout="vertical" onFinish={saveUserProfile}>
              <Form.Item rules={[{type: 'url'}]} initialValue={profile?.banner_url} name="banner_url" label="Banner">
                <Input
                  ref={bannerRef}
                  type="url"
                  placeholder="https://robohash.org/banner.png"
                  onPaste={displayImageOnPaste(setNewBannerLink)}
                  onBlur={displayImageOnBlur(setNewBannerLink)}
                  onChange={removeImageOnEmpty(setNewBannerLink)}
                  autoComplete="false"
                />
              </Form.Item>
              <Form.Item rules={[{type: 'url'}]} initialValue={profile?.pfp_url} name="pfp_url" label="Image">
                <Input
                  ref={pfpRef}
                  type="url"
                  placeholder={'https://robohash.org/pfp.png'}
                  onPaste={displayImageOnPaste(setNewPfpLink)}
                  onBlur={displayImageOnBlur(setNewPfpLink)}
                  onChange={removeImageOnEmpty(setNewPfpLink)}
                  autoComplete="false"
                />
              </Form.Item>

              <Form.Item initialValue={profile?.display_name} name="display_name" label="Display Name">
                <Input maxLength={50} autoComplete="false" />
              </Form.Item>

              <Form.Item initialValue={profile?.bio} name="bio" label="Bio">
                <Input.TextArea maxLength={150} showCount autoComplete="false" />
              </Form.Item>

              <Form.Item initialValue={profile?.location} name="location" label="Location">
                <Input maxLength={50} autoComplete="false" />
              </Form.Item>

              <Form.Item initialValue={profile?.country_code} name="country_code" label="2-letter country code">
                <Input maxLength={2} autoCapitalize={'true'} autoComplete="false" />
              </Form.Item>

              <Form.Item
                initialValue={profile?.website_url}
                name="website_url"
                label="Website"
                rules={[{type: 'url', validateTrigger: ['onBlur']}]}
              >
                <Input type="url" autoComplete="false" maxLength={100} />
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Modal>
      <DeleteAccountModal
        accountNumber={accountNumber}
        visible={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
      />
      <Col span={24}>
        <Card
          cover={
            <Image
              preview={false}
              style={{height: '150px'}}
              src={profile?.banner_url || 'https://tinyurl.com/3y8h846f'}
            />
          }
        >
          <Card
            size="small"
            style={{
              position: 'absolute',
              borderRadius: '1em',
              width: '120px',
              height: '120px',
              top: '100px',
              left: '24px',
              overflow: 'hidden',
            }}
            cover={<Image src={profile?.pfp_url || getDefaultPfp(accountNumber)} />}
          />

          <Row justify="space-between" gutter={[20, 20]} align="middle">
            <Col span={24} style={{paddingLeft: screens.sm ? '200px' : '130px'}}>
              <Row justify="end" align="middle" gutter={[20, 10]}>
                <Col>
                  <Button
                    shape="circle"
                    target="_blank"
                    href={`https://tnbexplorer.com/testnet/account/${accountNumber}`}
                    icon={
                      <img
                        width="15px"
                        src="https://raw.githubusercontent.com/open-blockchain-explorer/tnbexplorer/master/public/logo192.png"
                      />
                    }
                  />
                </Col>

                <Col>
                  <Button shape="circle" href={`https://tnbexplorer.com/testnet/account/${accountNumber}`}>
                    <MailOutlined width={15} />
                  </Button>
                </Col>
                <Col>{renderProfileButtons()}</Col>
              </Row>
            </Col>

            <Col span={24} style={{marginTop: '10px'}}>
              <Card.Meta
                title={
                  <Row gutter={[10, 10]} align="middle">
                    <Col>
                      <strong>{profile?.display_name || 'Update Profile'}</strong>
                    </Col>

                    <Col style={{fontSize: 'small'}} span={12}>
                      <AccountNumber accountNumber={accountNumber} />
                    </Col>
                  </Row>
                }
                description={
                  profile?.bio && profile?.display_name ? profile?.bio : '' // ||  'User has not setup a Public Profile'
                }
              />
            </Col>
            {(profile?.website_url || profile?.country_code || profile?.location) && (
              <Col>
                <Row align="middle" gutter={[20, 10]}>
                  {profile?.website_url && (
                    <Col>
                      <LinkOutlined />{' '}
                      <a style={{wordBreak: 'break-all'}} target="_blank" href={profile?.website_url}>
                        {profile?.website_url?.split('://')[1]}
                      </a>
                    </Col>
                  )}

                  {profile?.country_code && (
                    <Col>
                      <GlobalOutlined /> {profile?.country_code}
                    </Col>
                  )}
                  {profile?.location && (
                    <Col>
                      <EnvironmentOutlined /> {profile?.location}
                    </Col>
                  )}
                </Row>
              </Col>
            )}

            <Col flex="1 0 auto">
              <Row gutter={[20, 20]}>
                <Col flex="1 0 auto">
                  <Card style={{textAlign: 'center'}} size="small">
                    <img width="15px" src={tnbLogo} />{' '}
                    <Typography.Text strong>{balance?.mainnet_balance.toLocaleString()}</Typography.Text>
                    <br />
                    <Typography.Text style={{fontSize: '11px'}}>Main Network</Typography.Text>
                  </Card>
                </Col>

                <Col flex="1 0 auto">
                  <Card size="small" style={{textAlign: 'center'}}>
                    <Icon size={75} component={TnbLogo} />{' '}
                    <Typography.Text strong>{balance?.testnet_balance.toLocaleString()}</Typography.Text>
                    <br />
                    <Typography.Text style={{fontSize: '11px'}}>Test Network</Typography.Text>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Col>

      <Col span={24}>
        <Tabs type="card">
          <TabPane tab="Posts" key="posts">
            {posts.length ? (
              posts.map((tx) => <Post data={tx} key={tx.id} />)
            ) : (
              <Card>User has not made any posts</Card>
            )}
          </TabPane>

          <TabPane tab="Replies" key="replies">
            <Card>User has not responded to any posts</Card>
          </TabPane>
          <TabPane tab="Likes" key="likes">
            <Card>User has not liked any posts</Card>
          </TabPane>
        </Tabs>
      </Col>
    </>
  );
};

export default Profile;
