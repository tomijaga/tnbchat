import React, {FC} from 'react';
import Modal from 'antd/es/modal';
import Typography from 'antd/es/typography';
import message from 'antd/es/message';

import WarningOutlined from '@ant-design/icons/WarningOutlined';
import {useDispatch, useSelector} from 'react-redux';

import {removeUserAccount} from 'dispatchers';
import {getUserAccounts} from 'selectors';

export const DeleteAccountModal: FC<{accountNumber: string; visible: boolean; onClose: () => void; text?: string}> = ({
  accountNumber,
  onClose,
  text,
  visible,
}) => {
  const dispatch = useDispatch();
  const accounts = useSelector(getUserAccounts);

  return (
    <Modal
      visible={visible}
      okButtonProps={{danger: true}}
      okText={'Delete'}
      title={
        <Typography.Text type="danger">
          <WarningOutlined /> Delete Account
        </Typography.Text>
      }
      onCancel={onClose}
      onOk={() => {
        dispatch(removeUserAccount(accountNumber));
        message.info(`${accounts[accountNumber].username} has been removed`);
        onClose();
      }}
      width="400px"
    >
      {!text && <>This account will be deleted from the app and will only be recovered if you have the signing key.</>}
    </Modal>
  );
};
