import React, {FC} from 'react';
import Modal from 'antd/es/modal';
import Typography from 'antd/es/typography';

const ConfirmDelete: FC<{accountNumber: string; visible: boolean; onClick: () => void}> = ({
  children,
  accountNumber,
}) => {
  return (
    <Modal title={<Typography.Text>Delete Account</Typography.Text>}>
      This account along with it's signing key will be deleted from the app. The only way to revover this account is if
      you have the signing key. You can retrieve the signing key for this account here Are you sure you want to delete
      this account? Are you sure You want to delete this account?
    </Modal>
  );
};

export default ConfirmDelete;
