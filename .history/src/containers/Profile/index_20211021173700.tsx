import {ReactNode, useEffect, useState} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import Image from 'antd/es/image';
import Tabs from 'antd/es/tabs';
import Tooltip from 'antd/es/tooltip';

import Card from 'antd/es/card';
import Button from 'antd/es/button';

import Col from 'antd/es/col';
import Typography from 'antd/es/typography';

import {useDispatch, useSelector} from 'react-redux';
import {getUserAccount, getUserAccounts} from 'selectors';
import {AccountNumber, Post} from 'components';
import message from 'antd/es/message';

import Row from 'antd/es/row';
import Grid from 'antd/es/grid';
import {getPosts} from 'api';
import {mainnetBank, testnetBank} from 'api/node';
import {UserData} from 'types';
import {PaginatedTransactionEntry} from 'packages/thenewboston/src';
import {getPfp} from 'utils';
import {
  fetchAndStoreAccountBalance,
  removeUserAccount,
  storeAccountCoins,
  switchUserAccount,
} from 'dispatchers/account';

const {TabPane} = Tabs;
const {useBreakpoint} = Grid;

interface ProfileParams {
  account_number: string;
}

interface ProfileData extends UserData {
  testnet: {
    balance: number;
  };
  mainnet: {
    balance: number;
  };
}
const Profile = () => {
  let accountNumber = useParams<ProfileParams>().account_number;

  const history = useHistory();
  const dispatch = useDispatch();
  const currUserAccount = useSelector(getUserAccount);
  const accounts = useSelector(getUserAccounts);

  const profileIsOwnedByUser = !!accounts[accountNumber];

  const screens = useBreakpoint();
  const [profileData, setProfileData] = useState<Partial<ProfileData>>({});
  const [posts, setPosts] = useState<PaginatedTransactionEntry[]>([]);

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

      if (profileIsOwnedByUser) {
        await dispatch(fetchAndStoreAccountBalance(accountNumber));

        const currAccount = accounts[accountNumber];
        setProfileData({
          username,
        });
      } else {
        const testnetPV = await testnetBank.getBankPV();
        const testnet = {balance: (await testnetPV.getAccountBalance(accountNumber)).balance ?? 0};

        const mainnetPV = await mainnetBank.getBankPV();
        const mainnet = {balance: (await mainnetPV.getAccountBalance(accountNumber)).balance ?? 0};

        setProfileData({testnet, mainnet, username});

        dispatch(storeAccountCoins(accountNumber, {testnet: testnet.balance, mainnet: mainnet.balance}));
      }
    };

    getUserAccountInfo();
  }, [accountNumber, profileIsOwnedByUser]);

  const renderProfileButtons = () => {
    let components: ReactNode;
    if (currUserAccount?.account_number === accountNumber) {
      components = (
        <Button
          danger
          style={{fontSize: screens.xs ? 'smaller' : 'small'}}
          onClick={() => {
            if (dispatch(removeUserAccount(accountNumber))) {
              message.info(`${currUserAccount.username} has been removed`);
              // history.push('/home');
            }
          }}
        >
          Remove Account
        </Button>
      );
    } else if (accounts[accountNumber]) {
      components = (
        <Button
          style={{fontSize: screens.xs ? 'smaller' : 'small'}}
          onClick={() => {
            const currUsername = currUserAccount?.username;
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
  return (
    <>
      <Col span={24}>
        <Card cover={<div style={{backgroundColor: 'deepskyblue', height: '150px'}} />}>
          <Card
            size="small"
            hoverable
            style={{
              position: 'absolute',
              lineHeight: '0px',
              margin: '0px',
              padding: '0px',
              borderRadius: '1em',
              width: '120px',
              height: '120px',
              top: '100px',
              left: '24px',
            }}
          >
            <Image src={getPfp(accountNumber)} />
          </Card>

          <Row justify="space-between" align="middle">
            <Col span={24} style={{paddingLeft: '150px'}}>
              <Row justify="end" gutter={[20, 10]}>
                <Col>
                  <Button
                    style={{fontSize: screens.xs ? 'smaller' : 'small'}}
                    shape="round"
                    target="_blank"
                    href={`https://tnbexplorer.com/testnet/account/${accountNumber}`}
                  >
                    View {screens.sm ? 'Account' : ' '} on TnbExplorer
                  </Button>
                </Col>
                <Col>{renderProfileButtons()}</Col>
              </Row>
            </Col>

            <Col style={{paddingTop: '40px', paddingLeft: '20px'}}>
              <Card.Meta
                title={`User-${accountNumber.slice(0, 4)}`}
                description={<AccountNumber accountNumber={accountNumber} />}
              />
            </Col>
            <Col style={{paddingTop: '40px'}}>
              Mainnet Balance:{' '}
              {profileIsOwnedByUser
                ? accounts[accountNumber].mainnet_balance
                : profileData.mainnet?.balance?.toLocaleString()}
              <br />
              Testnet Balance:{' '}
              {profileIsOwnedByUser
                ? accounts[accountNumber].testnet_balance
                : profileData.testnet?.balance?.toLocaleString()}
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
