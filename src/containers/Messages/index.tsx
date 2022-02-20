import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Card from 'antd/es/card';
import Col from 'antd/es/col';
import Row from 'antd/es/row';
import Divider from 'antd/es/divider';
import Typography from 'antd/es/typography';
import Tooltip from 'antd/es/tooltip';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import Menu from 'antd/es/menu';
import Form from 'antd/es/form';
import Empty from 'antd/es/empty';
import alertMessage from 'antd/es/message';
import {nanoid} from 'nanoid';
import {PageLayout, MessageInfoCard, Post, Message} from 'components';
import {storeOnIpfs} from 'utils/ipfs';
import {useDispatch, useSelector} from 'react-redux';
import {
  getDirectMessageRecipients,
  getAllDirectMessagesWithRecipient,
  getUserAccount,
  getUserAccountManager,
  getAuthData,
} from 'selectors';
import {verifyAuth} from 'dispatchers';
import {Account, PaginatedTransactionEntry} from 'packages/thenewboston/src';
import {getMessages} from 'api';
import {MessageData} from 'api/message';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCoffee, faLock, faLockOpen} from '@fortawesome/free-solid-svg-icons';
import {setNewDirectMessage} from 'store/messages';
import SelectRecipientModal from './SelectRecipient';
import {MessagePageContext} from './context';
import useApp from 'hooks/useApp';
import {useHistory} from 'react-router-dom';

const Messages = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const [form] = Form.useForm();

  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const [messages, setMessages] = useState<MessageData[]>([]);
  const {
    state: {isLoggedIn},
  } = useSelector(getAuthData);

  const {tnbchatSDK, verifyUserAccount} = useApp();

  const account = useSelector(getUserAccount);
  const allRecipients = useSelector(getDirectMessageRecipients);

  const [recipient, setRecipient] = useState(
    allRecipients?.length ? allRecipients[allRecipients.length - 1].recipient : '',
  );

  useEffect(() => {
    const recipientQueryParam = searchParams.get('recipient');
    if (recipientQueryParam) {
      setRecipient(recipientQueryParam);
    }
  }, []);

  useEffect(() => {
    history.push(`/messages?recipient=${recipient}`);
  }, [recipient]);

  useEffect(() => {
    verifyUserAccount();
  }, [verifyUserAccount, recipient]);

  const [showSelectRecipientModal, setShowSelectRecipientModal] = useState(false);
  const messagesWithRecipient = useSelector(getAllDirectMessagesWithRecipient(recipient));
  const recipientExists = !!messagesWithRecipient;
  console.log({recipientExists, allRecipients});

  useEffect(() => {
    console.log({account: account?.account_number, recipient});

    if (account?.account_number && recipient) {
      // getMessages(account.account_number, recipient).then((results) => {
      //   setMessages(results);
      //   if (!recipientExists && results.length) {
      //     dispatch(setNewDirectMessage({recipient, user: account.account_number, contents: results, retrieved_data: {sent: }}));
      //   }
      // });
    }
  }, [getMessages, recipient]);

  useEffect(() => {
    setMessages([]);
    setRecipient(allRecipients?.length ? allRecipients[allRecipients.length - 1].recipient : '');
  }, [account?.account_number]);

  const sendDirectMessage = async ({message}: any) => {
    const userIsVerified = verifyUserAccount();

    if (userIsVerified && tnbchatSDK) {
      setIsSendingMessage(true);

      let result;
      try {
        result = await tnbchatSDK.sendDirectMessage(recipient, message);
        alertMessage.success('Message Sent');
        console.log({result});
      } catch (e) {
        alertMessage.error('Message Counld not be sent');
        console.error('Error: Sending Direct Message', e);
      }

      setIsSendingMessage(false);

      form.resetFields();
    }
  };

  const getRecipients = () => {
    if (!allRecipients?.length) {
      return <Empty description="Create a new Message" />;
    }

    return allRecipients.map((messageData) => {
      const {recipient: msgRecipient, unseen_messages, latest_message} = messageData;

      if (tnbchatSDK) {
        let plaintext = '';
        if (latest_message) {
          const {decryptedMessage} = tnbchatSDK.decryptDirectMessage(latest_message);
          plaintext = decryptedMessage;
        }

        return (
          <MessageInfoCard
            recipient={msgRecipient}
            latestMessage={plaintext}
            unseenMessages={unseen_messages}
            timestamp={latest_message?.block.created_date}
            onClick={() => {
              setRecipient(msgRecipient);
            }}
          />
        );
      }
      return (
        <MessageInfoCard
          recipient={msgRecipient}
          latestMessage={'Unlock to see message 🔐'}
          unseenMessages={unseen_messages}
          timestamp={latest_message?.block.created_date}
        />
      );
    });
  };

  const displayMessages = () => {
    if (tnbchatSDK) {
      const messageComponents = messages.map((messageData) => {
        const {
          ipfs_data,
          block: {created_date},
        } = messageData;
        if (account?.account_number && ipfs_data) {
          console.log({messageData});
          const {decryptedMessage, sentByMe} = tnbchatSDK.decryptDirectMessage(messageData);

          return (
            <Col span={24}>
              <Row justify={sentByMe ? 'end' : 'start'}>
                <Col style={{maxWidth: '80%'}}>
                  <Message received={!sentByMe}>{decryptedMessage}</Message>
                  <Typography.Text type="secondary">{new Date(created_date).toLocaleString()}</Typography.Text>
                </Col>
              </Row>
            </Col>
          );
        }
      });
      return messageComponents.length ? (
        <Row gutter={[20, 20]}>{messageComponents}</Row>
      ) : (
        <span style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Empty />
        </span>
      );
    }
    return (
      <span style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Empty
          image={<img src="https://cdn1.iconfinder.com/data/icons/hawcons/32/698630-icon-114-lock-512.png" />}
          description="Unlock App to see Messages"
        />
      </span>
    );
  };

  return (
    <MessagePageContext.Provider
      value={{recipient, setRecipient, setShowSelectRecipientModal, showSelectRecipientModal}}
    >
      <PageLayout showExtra={false}>
        <Row>
          <Col>
            <Divider type="vertical" style={{minHeight: '100vh', margin: '0px'}} />
          </Col>
          <Col span={8}>
            <Row>
              <Col span={24}>
                <Card>
                  <Row gutter={[20, 20]} justify="space-between">
                    <Col>
                      <Typography.Title style={{margin: '0px'}} level={3}>
                        Messages
                      </Typography.Title>
                    </Col>
                    <Col></Col>
                    <Col>
                      <Tooltip
                        title={
                          <Typography.Text type="warning" style={{fontSize: 'small', cursor: 'pointer'}}>
                            The messages are ecrypted with the sender and receiver's public/signing key. Only they can
                            decrypt and view the contents of the messages
                          </Typography.Text>
                        }
                      >
                        <Typography.Text strong>Complete end-to-end encryption</Typography.Text>
                      </Tooltip>
                    </Col>
                    <Col>
                      <SelectRecipientModal />

                      <Button onClick={() => setShowSelectRecipientModal(true)}>New Message</Button>
                    </Col>
                    {/* <Col>
                    <Input placeholder={'Search for Users'} />
                  </Col> */}
                  </Row>
                </Card>
              </Col>
              <Col>{getRecipients()}</Col>
            </Row>
          </Col>
          <Col>
            <Divider type="vertical" style={{minHeight: '100vh', margin: '0px'}} />
          </Col>
          <Col span={15} style={{maxHeight: '100vh'}}>
            <Row>
              <Col span={24}>
                <Card style={{height: '70px'}}></Card>
              </Col>
              <Col span={24} style={{height: 'calc( 100vh - 140px)'}}>
                {displayMessages()}
              </Col>
              <Col span={24}>
                <Card size="small" style={{position: 'sticky', bottom: '0px'}}>
                  <Form form={form} onFinish={sendDirectMessage}>
                    <Row gutter={20} align="middle">
                      <Col flex="0 0 40px">
                        <Button size="small">Gif</Button>
                        <Button size="small">pic</Button>
                      </Col>
                      <Col flex="1 1 auto">
                        <Form.Item
                          style={{margin: '0px'}}
                          name="message"
                          rules={[{required: true, message: '', validateTrigger: 'onSubmit'}]}
                        >
                          <Input.TextArea autoSize placeholder="start writing" />
                        </Form.Item>
                      </Col>
                      <Col flex="0 1 auto">
                        <Form.Item style={{margin: '0px'}}>
                          <Button htmlType="submit" shape="round" loading={isSendingMessage}>
                            Send
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col>
            <Divider type="vertical" style={{minHeight: '100vh', margin: '0px'}} />
          </Col>
        </Row>
      </PageLayout>
    </MessagePageContext.Provider>
  );
};

export default Messages;
