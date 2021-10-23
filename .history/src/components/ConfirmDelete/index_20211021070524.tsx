import React, {FC} from 'react';
import Modal from 'antd/es/modal';

const ConfirmDelete: FC<{accountNumber: string}> = ({children, accountNumber}) => {
  return (
    <Modal title="Delete Account" style={{color: 'red'}}>
      This account along with it's signing key will be deleted from the app. The only way to revover this account is if
      you have the signing key. You can retrieve the signing key for this account here Are you sure you want to delete
      this account? Are you sure You want to delete this account?
    </Modal>
  );
};

export default ConfirmDelete;
