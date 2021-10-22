import {useEffect, useState, useCallback} from 'react';

import {useHistory} from 'react-router-dom';
import Button from 'antd/es/button';
import Card from 'antd/es/card';
import Col from 'antd/es/col';

import Form from 'antd/es/form';
import Input from 'antd/es/input';

import {Post} from 'components';
import Row from 'antd/es/row';
import {PaginatedTransactionEntry} from 'packages/thenewboston/src';

import {getPosts} from 'api';
import {MAX_ENCODED_POST_LENGTH} from 'constant';
import {useDispatch, useSelector} from 'react-redux';
import {setStateAuthData} from 'store/app';
import {getAuthData, getUserAccount, getUserAccountManager} from 'selectors';

import {encodePostMessage} from 'utils';
import {AuthStatus, LocalAuthData} from 'types';
import {TNBChatAccountManager} from 'utils/app';
import {localStore} from 'utils/storage';

import {verifyAuth} from 'dispatchers/auth';
import {mainnetBank} from 'api/node';

const Home = () => {
  const tnbchat = '06e51367ffdb5e3e3c31118596e0956a48b1ffde327974d39ce1c3d3685e30ab';

  const history = useHistory();
  const dispatch = useDispatch();
  const account = useSelector(getUserAccount);

  const {
    state: {isLoggedIn, showAuthModal, hasCreatedSeedPhrase},
  } = useSelector(getAuthData);

  const tnbChatAccountManager = useSelector(getUserAccountManager);

  const [encodedText, setEncodedText] = useState('');
  const [form] = Form.useForm();

  const [posts, setPosts] = useState<PaginatedTransactionEntry[]>([]);

  useEffect(() => {
    getPosts().then((results) => setPosts(results));
  }, []);

  const onFinish = async ({textInput}: any) => {
    if (textInput) {
      if (dispatch(verifyAuth)) {
        if (account) {
          console.log('Sending...', textInput);

          const tx = await tnbChatAccountManager!.makePost(encodedText, tnbchat);
          setEncodedText('');
          form.resetFields();

          setPosts((prev) => [tx, ...prev]);
        } else if (hasCreatedSeedPhrase) {
          dispatch(
            setStateAuthData({
              showAuthModal: true,
              authStatus: AuthStatus.create_account,
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
    }
  };

  const updateText = async (e: any) => {
    const value = e.target.value;
    const encoded_text = encodePostMessage(value);
    setEncodedText(await encoded_text);
  };

  const onFinishFailed = console.log;

  return (
    <>
      <Col span={24}>
        <Card>
          <Form form={form} name="post" onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
            <Row justify="center">
              <Col span={12}>
                <Form.Item name="textInput">
                  <Input.TextArea
                    // style={{
                    //   color: encodedText.length > MAX_ENCODED_POST_LENGTH ? 'red' : 'black',
                    // }}
                    onChange={updateText}
                    placeholder="Welcome to the blockchain... "
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
              <Button disabled={encodedText.length > MAX_ENCODED_POST_LENGTH} type="primary" htmlType="submit">
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
    </>
  );
};

export default Home;
