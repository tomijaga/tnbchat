import React, {FC} from 'react';
import Modal from 'antd/es/modal';
import Typography from 'antd/es/typography';
import message from 'antd/es/message';

import WarningOutlined from '@ant-design/icons/WarningOutlined';
import {useDispatch, useSelector} from 'react-redux';

import {removeUserAccount} from 'dispatchers';
import {getUserAccounts} from 'selectors';

export const DeleteAccountModal: FC<{accountNumber: string; visible: boolean; onCancel: () => void; text?: string}> = ({
  accountNumber,
  onCancel,
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
      onCancel={onCancel}
      onOk={() => {
        dispatch(removeUserAccount(accountNumber));
        message.info(`${accounts[accountNumber].username} has been removed`);
      }}
      width="500px"
    >
      {!text && (
        <>
          This account along with it's signing key will be deleted from the app and will only be recovered if you have
          the signing key.
        </>
      )}
    </Modal>
  );
};
