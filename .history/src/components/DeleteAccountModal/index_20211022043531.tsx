import React, {FC} from 'react';
import Modal from 'antd/es/modal';
import Typography from 'antd/es/typography';

import WarningOutlined from '@ant-design/icons/WarningOutlined';
import {useDispatch} from 'react-redux';

import {removeUserAccount} from 'dispatchers';

export const DeleteAccountModal: FC<{accountNumber: string; visible: boolean; onCancel: () => void; text?: string}> = ({
  accountNumber,
  onCancel,
  text,
}) => {
  const dispatch = useDispatch();

  return (
    <Modal
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
      }}
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
