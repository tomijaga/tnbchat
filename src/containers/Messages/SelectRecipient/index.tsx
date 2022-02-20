import React, {FC, useContext, useState} from 'react';
import Modal from 'antd/es/modal';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import Row from 'antd/es/row';
import Col from 'antd/es/col';

import {MessagePageContext} from '../context';

const SelectRecipient: FC = ({}) => {
  const {showSelectRecipientModal, setShowSelectRecipientModal, setRecipient} = useContext(MessagePageContext);
  console.log({showSelectRecipientModal});
  const [value, setValue] = useState('');
  return (
    <Modal
      title="Select Recipient"
      footer={null}
      centered
      visible={showSelectRecipientModal}
      onCancel={() => {
        setShowSelectRecipientModal(false);
      }}
    >
      <Row justify="space-between">
        <Col span={18}>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </Col>

        <Col>
          <Button
            onClick={() => {
              setRecipient(value);
              setShowSelectRecipientModal(false);
            }}
          >
            {' '}
            Start Writing
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};

export default SelectRecipient;
