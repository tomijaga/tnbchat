import 'antd/dist/antd.css';
import '../styles.css';
import '../App.css';

import {Account, AccountPaymentHandler, Bank, PaginatedTransactionEntry} from '../thenewboston/src';
import {useEffect, useState, useMemo} from 'react';

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
import {encode} from 'utils';
import Auth from './Auth';

const tnbchat = '06e51367ffdb5e3e3c31118596e0956a48b1ffde327974d39ce1c3d3685e30ab';
const sk = '25d9b8e19a450706e5acf868b9d81a2b2679c1753e9fec64087fa715f94c27a3';
const bankUrl = 'http://bank.tnbexplorer.com';

export default function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [isLoggedIn] = useState(false);
  const account = new Account(sk);
  const bank = useMemo(() => new Bank(bankUrl), []);
  const [tnbpay] = useState<AccountPaymentHandler>(new AccountPaymentHandler({account, bankUrl}));

  const {useBreakpoint} = Grid;
  const screens = useBreakpoint();
  // console.log(screens);
  const [encodedText, setEncodedText] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    if (!isLoggedIn) {
      const encryptedText = localStorage.getItem('encrypted_text');
      console.log({encryptedText});
      // If you have registered a password
      // Call Auth
      if (encryptedText) {
        setShowAuth(true);
      }
    }

    tnbpay.init();
  }, [isLoggedIn, tnbpay]);

  const onFinish = async ({textInput}: any) => {
    if (sk) return setShowAuth(true);

    if (textInput) {
      console.log('Sending...', textInput);
      const block = await tnbpay.sendCoins(tnbchat, 1, encodedText);
      setEncodedText('');
      form.resetFields();

      const tx: PaginatedTransactionEntry = {
        recipient: tnbchat,
        amount: 1,
        block,
        memo: encodedText,
        id: '122' + textInput.slice(0, 5),
      };
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
      setPosts(txs.results);
    };
    getPosts();
  }, [bank]);

  return (
    <div className="App">
      <Auth
        isLoggedIn={isLoggedIn}
        showModal={showAuth}
        onCancel={() => {
          setShowAuth(false);
        }}
      />

      <Router>
        <Switch>
          <Row justify="center" gutter={50}>
            <Col xl={5} lg={4} md={5} sm={3} xs={0}>
              <Row
                style={{
                  position: 'fixed',
                  // right: screens.xl ? "calc(50vw + 23vw)" : "80vw",
                  marginTop: '100px',
                }}
                justify="start"
              >
                <Col span={24}>
                  <Row gutter={[30, 30]} style={{width: '50vw'}}>
                    <Col span={24}>
                      <Menu mode="inline" inlineCollapsed={!screens.md} style={{color: 'rgba(0,0,0,.45)'}}>
                        <Menu.ItemGroup>
                          <Menu.Item>Home</Menu.Item>
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
                              style={{
                                color: encodedText.length > 64 ? 'red' : 'black',
                              }}
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
                        <Button disabled={encodedText.length > 64} type="primary" htmlType="submit">
                          Send
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

            <Col xl={7} lg={7} md={0}>
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
                      <Card>- account data -</Card>
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
