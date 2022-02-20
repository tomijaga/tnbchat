import {useEffect, useState} from 'react';

import Button from 'antd/es/button';
import Card from 'antd/es/card';
import Col from 'antd/es/col';

import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Progress from 'antd/es/progress';
import message from 'antd/es/message';
import GifOutlined from '@ant-design/icons/GifOutlined';
import PictureOutlined from '@ant-design/icons/PictureOutlined';
import axios from 'axios';
import {Post} from 'components';
import Row from 'antd/es/row';
import Upload from 'antd/es/upload';
// import 'emoji-mart/css/emoji-mart.css';
// import {Picker} from 'emoji-mart';
import {PaginatedTransactionEntry} from 'packages/thenewboston/src';

import {getPosts, PostData} from 'api';
import {MAX_POST_LENGTH, channels} from 'constant';
import {useDispatch, useSelector} from 'react-redux';
import {setStateAuthData} from 'store/app';
import {getAuthData, getUserAccount, getUserAccountManager} from 'selectors';

import {encodePostMessage} from 'utils';
import {AuthStatus} from 'types';

import {verifyAuth} from 'dispatchers/auth';
import {storeOnIpfs} from 'utils/ipfs';
import {nanoid} from 'nanoid';

const Home = () => {
  const tnbchat_main_channel = process.env.NODE_ENV === 'production' ? channels.general : channels.dev;
  const [form] = Form.useForm();

  const [inputText, _setInputText] = useState('');
  const setInputText = (value: string) => {
    form.setFields([{name: 'textInput', value}]);
    _setInputText(value);
  };
  const dispatch = useDispatch();
  const account = useSelector(getUserAccount);

  const {
    state: {hasCreatedSeedPhrase},
  } = useSelector(getAuthData);

  const tnbChatAccountManager = useSelector(getUserAccountManager);

  const [posts, setPosts] = useState<PostData[]>([]);

  const [isSending, setIsSending] = useState(false);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [uploadFiles, setUploadFiles] = useState<any[]>([]);

  useEffect(() => {
    getPosts().then((results) => setPosts(results));
  }, []);

  const sendPostToNetwork = async ({textInput}: {textInput: string}) => {
    if (textInput) {
      if (dispatch(verifyAuth)) {
        if (account) {
          setIsSending(true);
          console.log('Sending...', textInput);

          const tx = await tnbChatAccountManager!.makePost(tnbchat_main_channel, textInput);
          form.resetFields();

          setPosts((prev) => [...prev, tx]);
          setIsSending(false);
          message.success('Message Sent');
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

  const onFinishFailed = console.log;

  return (
    <Row>
      <Col>
        <Row style={{position: 'relative', overflow: 'auto'}}>
          {posts.map((tx) => (
            <Col span={24} key={tx.id}>
              {<Post data={tx} />}
            </Col>
          ))}
        </Row>
      </Col>
      <Col span={24} style={{position: 'sticky', bottom: '0px', zIndex: 10}}>
        <Card size="small">
          <Form form={form} name="post" onFinish={sendPostToNetwork} onFinishFailed={onFinishFailed} autoComplete="off">
            <Row gutter={20} align="top">
              <Col flex="1 0 auto">
                <Form.Item name="textInput">
                  <Input.TextArea
                    autoSize={{maxRows: 10}}
                    placeholder="Welcome to the blockchain..."
                    allowClear
                    value={inputText}
                    onChange={({target: {value}}) => {
                      setInputText(value);
                    }}
                    maxLength={MAX_POST_LENGTH}
                    bordered={false}
                    showCount={{
                      formatter: ({count, maxLength}) => `${count ?? 0} / ${MAX_POST_LENGTH}`,
                    }}
                    autoFocus
                    // onPressEnter={({currentTarget: {value}}) => {
                    //   if (value) {
                    //     sendPostToNetwork({textInput: value});
                    //   }
                    // }}
                  />
                </Form.Item>
              </Col>
              <Col flex="0 0 auto">
                <Form.Item>
                  <Upload
                    customRequest={console.log}
                    showUploadList
                    {...{
                      name: 'file',
                      headers: {
                        authorization: 'authorization-text',
                      },
                      onChange: async (info) => {
                        console.log(info);
                        // const data = new FormData();
                        const data = await info.file.originFileObj;
                        setUploadFiles((prev) => [...prev, data]);

                        if (info.file.status !== 'uploading') {
                          console.log(info.file, info.fileList);
                        }
                        if (info.file.status === 'done') {
                          message.success(`${info.file.name} file uploaded successfully`);
                        } else if (info.file.status === 'error') {
                          message.error(`${info.file.name} file upload failed.`);
                        }
                      },
                    }}
                  >
                    <Button
                      style={{border: 'none'}}
                      icon={<PictureOutlined style={{fontSize: '16px'}} />}
                      size="small"
                    />
                  </Upload>
                </Form.Item>

                <Button icon={<GifOutlined style={{fontSize: '16px'}} />} size="small" />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '0px',
                  }}
                  // autoFocus={true}
                  // onClick={(e) => (e.currentTarget as any).stopPropagation()}
                  // onBlur={() => setShowEmojiPicker(false)}
                >
                  {/* <Picker
                    perLine={100}
                    // onClick={(emoji, e) => e.stopPropagation()}
                    autoFocus
                    style={{width: '340px', display: showEmojiPicker ? '' : 'none'}}
                    theme="auto"
                    onSelect={({native}: any) => {
                      setInputText(inputText.concat(native));
                    }}
                  /> */}
                </div>
                <Button
                  onClick={(e) => {
                    setShowEmojiPicker((prev) => !prev);
                  }}
                  icon={'🙂'}
                  size="small"
                ></Button>
              </Col>
              <Col flex="0 0 auto">
                <Button shape="round" loading={isSending} type="primary" htmlType="submit">
                  Post
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Home;
