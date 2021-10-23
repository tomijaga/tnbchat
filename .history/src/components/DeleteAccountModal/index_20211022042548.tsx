import React, {FC} from 'react';
import Modal from 'antd/es/modal';
import Typography from 'antd/es/typography';

import WarningOutlined from '@ant-design/icons/WarningOutlined';

const DeleteAccountModal: FC<{accountNumber: string; visible: boolean; onClick: () => void}> = ({
  children,
  accountNumber,
}) => {
  return (
    <Modal
      title={
        <Typography.Text type="danger">
          <WarningOutlined /> Delete Account
        </Typography.Text>
      }
    >
      This account along with it's signing key will be deleted from the app and will only be recovered if you have the
      signing key.
    </Modal>
  );
};

export default DeleteAccountModal;
