import 'antd/dist/antd.css';
import '../styles.css';
import '../App.css';

import {Bank, PaginatedTransactionEntry} from '../thenewboston/src';
import {useEffect, useState, useMemo, useCallback} from 'react';

import {BrowserRouter as Router, Switch} from 'react-router-dom';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import Button from 'antd/es/button';
import Card from 'antd/es/card';
import Col from 'antd/es/col';
import Form from 'antd/es/form';
import Grid from 'antd/es/grid';
import Input from 'antd/es/input';
import Menu from 'antd/es/menu';
import {Post} from 'components';
import Row from 'antd/es/row';
import {MAX_ENCODED_POST_LENGTH} from 'constant';
import {useDispatch, useSelector} from 'react-redux';
import {setAuthData} from 'store/app';
import {getAuthData} from 'selectors';

import {encode} from 'utils';
import Auth from './Auth';
import {AuthStatus} from 'types';
import {TNBChatAccount} from 'utils/app';
import {AccountManager} from 'utils/account-manager';
import {LocalStorage} from 'utils/localStorage';

const tnbchat = '06e51367ffdb5e3e3c31118596e0956a48b1ffde327974d39ce1c3d3685e30ab';
// const sk = '25d9b8e19a450706e5acf868b9d81a2b2679c1753e9fec64087fa715f94c27a3';
const bankUrl = 'http://bank.tnbexplorer.com';

export default function App() {
  const dispatch = useDispatch();
  const {isLoggedIn, showAuthModal, passwordHash} = useSelector(getAuthData);

  const [tnbChatAccount, setTnbChatAccount] = useState<TNBChatAccount | null>(null);
  const bank = useMemo(() => new Bank(bankUrl), []);

  const {useBreakpoint} = Grid;
  const screens = useBreakpoint();
  // console.log(screens);
  const [encodedText, setEncodedText] = useState('');
  const [form] = Form.useForm();

  const isRegistered = useCallback(() => {
    return new LocalStorage().getItem('encrypted_text');
  }, []);

  const isVerified = useCallback(() => {
    return isRegistered() && passwordHash;
  }, [isRegistered, passwordHash]);

  useEffect(() => {
    if (!isLoggedIn) {
      const encryptedText = localStorage.getItem('encrypted_text');

      // If you have registered a password
      // Call Auth
      if (encryptedText) {
        dispatch(
          setAuthData({
            showAuthModal: true,
            authStatus: AuthStatus.verify_password,
          }),
        );
      }
    }
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    console.log('Hash changed ...');
    if (isVerified()) {
      const accountManager = new AccountManager({hash: passwordHash!});
      const sk = accountManager.getAccountSigningKey();

      console.log('Called get account sk ...');

      if (sk) {
        console.log('tnbchatObject was updated ...');

        setTnbChatAccount(new TNBChatAccount(sk));
      }
    } else {
      setTnbChatAccount(null);
    }
  }, [passwordHash, isVerified]);

  const onFinish = async ({textInput}: any) => {
    if (!isLoggedIn) {
      if (isRegistered()) {
        return dispatch(
          setAuthData({
            authStatus: AuthStatus.verify_password,
            showAuthModal: true,
          }),
        );
      }
      return dispatch(
        setAuthData({
          authStatus: AuthStatus.register_password,
          showAuthModal: true,
        }),
      );
    }

    if (textInput) {
      console.log('Sending...', textInput);

      const tx = await tnbChatAccount!.makePost(encodedText, tnbchat);
      setEncodedText('');
      form.resetFields();

      setPosts((prev) => [tx, ...prev]);
    }
  };

  const updateText = async (e: any) => {
    const value = e.target.value;
    const encoded_text = encode(value);
    setEncodedText(await encoded_text);
  };

  const onFinishFailed = console.log;

  const [posts, setPosts] = useState<PaginatedTransactionEntry[]>([]);
  useEffect(() => {
    const getPosts = async () => {
      const txs = await bank.getTransactions({
        limit: 100,
        recipient: tnbchat,
      });

      const pendingPosts: {[x: string]: PaginatedTransactionEntry} = {};
      const completedPosts = txs.results
        .reverse()
        .reduce((completePosts: PaginatedTransactionEntry[], tx: PaginatedTransactionEntry) => {
          if (!tx.memo) tx.memo = '';
          const sender = tx.block.sender;

          const pendingPost = pendingPosts[sender];
          if (pendingPost) {
            pendingPost.memo += tx.memo;
            if (tx.memo.length < 64) {
              delete pendingPosts[sender];
            }
          } else {
            completePosts.push(tx);
          }
          if (tx.memo.length === 64) {
            pendingPosts[sender] = tx;
          }

          return completePosts;
        }, [])
        .reverse();

      setPosts(completedPosts);
    };
    getPosts();
  }, [bank]);

  return (
    <div className="App">
      <Auth
        isLoggedIn={isLoggedIn}
        showAuthModal={showAuthModal}
        onCancel={() => {
          dispatch(
            setAuthData({
              showAuthModal: true,
            }),
          );
        }}
      />

      <Router>
        <Switch>
          <Row justify="center" gutter={50}>
            <Col xl={5} lg={4} md={5} sm={3} span={0}>
              <Row
                style={{
                  position: 'fixed',
                  // right: screens.xl ? "calc(50vw + 23vw)" : "80vw",
                }}
                justify="start"
              >
                <Col style={{margin: '50px 20px'}}>TnbChat</Col>
                <Col span={24}>
                  <Row gutter={[30, 30]} style={{width: '50vw'}}>
                    <Col span={24}>
                      <Card>- account data -</Card>
                    </Col>
                    <Col span={24}>
                      <Menu mode="inline" inlineCollapsed={!screens.md} style={{color: 'rgba(0,0,0,.45)'}}>
                        <Menu.ItemGroup>
                          <Menu.Item key={1}>Home</Menu.Item>
                          <Menu.Item>Channels</Menu.Item>
                          <Menu.Item>Gov Proposals</Menu.Item>
                          <Menu.Item>Wallet</Menu.Item>
                        </Menu.ItemGroup>
                        <Menu.ItemGroup>
                          <Menu.Item>Profile</Menu.Item>
                          <Menu.Item>Messages</Menu.Item>
                          <Menu.Item>Settings</Menu.Item>
                          <Menu.Item>Help</Menu.Item>
                        </Menu.ItemGroup>
                      </Menu>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col xl={11} lg={13} md={16} sm={19} xs={24} span={24}>
              <Row justify="center">
                <Col span={24}>
                  <Card>
                    <Form
                      form={form}
                      name="post"
                      onFinish={onFinish}
                      onFinishFailed={onFinishFailed}
                      autoComplete="off"
                    >
                      <Row justify="center">
                        <Col span={12}>
                          <Form.Item name="textInput">
                            <Input.TextArea
                              // style={{
                              //   color: encodedText.length > MAX_ENCODED_POST_LENGTH ? 'red' : 'black',
                              // }}
                              onChange={updateText}
                              placeholder="What's Happening?"
                              showCount
                              allowClear
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Input.TextArea
                            disabled={true}
                            value={encodedText}
                            placeholder="What's going on under the hood?"
                            showCount
                          />
                        </Col>
                      </Row>

                      <Form.Item>
                        <Button
                          disabled={encodedText.length > MAX_ENCODED_POST_LENGTH}
                          type="primary"
                          htmlType="submit"
                        >
                          Post
                        </Button>
                      </Form.Item>
                    </Form>
                  </Card>
                </Col>
                {posts.map((tx) => (
                  <Col span={24} key={tx.id}>
                    {<Post data={tx} />}
                  </Col>
                ))}
              </Row>
            </Col>

            <Col xl={7} lg={7} md={0} span={0}>
              <Row>
                <Col
                  span={24}
                  style={{
                    position: 'fixed',
                    left: screens.lg ? 'calc(50vw + 23vw)' : 'calc(50vw + 13vw)',
                  }}
                >
                  <Row gutter={[30, 30]}>
                    <Col span={24}>
                      <Input prefix={<SearchOutlined style={{color: 'rgba(0,0,0,.45)'}} />} />
                    </Col>

                    <Col span={24}>
                      <Card>- tnb data -</Card>
                    </Col>

                    <Col span={24}>
                      <Card>- tnb blog posts -</Card>
                    </Col>
                    <Col span={24}>
                      <Card>- Footer -</Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Switch>
      </Router>
    </div>
  );
}
