import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import Image from 'antd/es/image';
import Tabs from 'antd/es/tabs';
import Tooltip from 'antd/es/tooltip';

import Card from 'antd/es/card';
import Button from 'antd/es/button';

import Col from 'antd/es/col';
import Typography from 'antd/es/typography';
import {Post} from 'components';
import Row from 'antd/es/row';
import Grid from 'antd/es/grid';
import {getPosts} from 'api';
import {mainnetBank, testnetBank} from 'api/node';
import {UserData} from 'types';
import {PaginatedTransactionEntry} from 'thenewboston/src';

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
  const screens = useBreakpoint();
  const [profileData, setProfileData] = useState<Partial<ProfileData>>({});
  const [posts, setPosts] = useState<PaginatedTransactionEntry[]>([]);

  let accountNumber = useParams<ProfileParams>().account_number;

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

      const testnetPV = await testnetBank.getBankPV();
      const testnet = {balance: (await testnetPV.getAccountBalance(accountNumber)).balance ?? 0};

      const mainnetPV = await mainnetBank.getBankPV();
      const mainnet = {balance: (await mainnetPV.getAccountBalance(accountNumber)).balance ?? 0};

      setProfileData({testnet, mainnet, username});
    };

    getUserAccountInfo();
  }, [accountNumber]);
  console.log({screens});

  return (
    <Row justify="center">
      <Col xl={11} lg={13} md={16} sm={19} xs={24} span={24}>
        <Row justify="center">
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
                <Image src={`https://robohash.org/${accountNumber}.png?sets=set1,set3,set4,set5`} />
              </Card>

              <Row justify="space-between" align="middle">
                <Col span={24} style={{height: '15px'}}>
                  <Button
                    style={{marginLeft: '150px', fontSize: screens.xs ? 'smaller' : 'small'}}
                    shape="round"
                    target="_blank"
                    href={`https://tnbexplorer.com/testnet/account/${accountNumber}`}
                  >
                    <Typography.Text ellipsis>View {screens.sm && 'Account'} on TnbExplorer</Typography.Text>
                  </Button>
                </Col>
                <Col style={{paddingTop: '40px', paddingLeft: '20px'}}>
                  <Card.Meta
                    title={`User-${accountNumber.slice(0, 4)}`}
                    description={
                      <Tooltip title={<Typography.Text copyable> {accountNumber}</Typography.Text>}>
                        @{accountNumber.slice(0, 4)}..{accountNumber.slice(-4)}
                      </Tooltip>
                    }
                  />
                </Col>
                <Col style={{paddingTop: '40px'}}>
                  Mainnet Balance: {profileData.mainnet?.balance?.toLocaleString()}
                  <br />
                  Testnet Balance: {profileData.testnet?.balance?.toLocaleString()}
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
        </Row>
      </Col>
    </Row>
  );
};

export default Profile;
