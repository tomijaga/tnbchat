import {FC, useEffect, useState} from 'react';
import Modal from 'antd/es/modal';

import AddAccount from './AddAccount';
import RegisterPassword from './RegisterPassword';
import {Aes} from 'utils/aes';
import VerifyUser from './VerifyUser';

const Auth: FC<{
  showModal?: boolean;
  isLoggedIn: boolean;
  onCancel: () => void;
}> = ({showModal, onCancel, isLoggedIn}) => {
  const [cypherAlgorithm, setCypherAlgorithm] = useState<Aes | null>(null);

  const [authStatus, setAuthStatus] = useState<keyof typeof authComponents>('registerPassword');

  useEffect(() => {
    if (showModal) {
      if (localStorage.getItem('encrypted_text')) {
        setAuthStatus('verifyUser');
      }
    }
  }, [showModal]);

  const handleCreatePasswordForm = ({tnbchatPassword}: any) => {
    /**
     * This fn doesn't store the password
     * Instead it encrypts a known text and stores it in the browser
     *
     * Ownership can be verified if the user can decrypt the stored encrypted key
     */

    const aes = new Aes(tnbchatPassword);
    const plainText = process.env.REACT_APP_PLAIN_TEXT;
    if (!plainText) throw new Error("The Website's Plaintext is empty");
    const encryptedText = aes.ctrEncryption(plainText);

    if (encryptedText) {
      localStorage.setItem('encrypted_text', JSON.stringify(encryptedText));
      setAuthStatus('addAccount');
      setCypherAlgorithm(() => aes);
    } else {
      throw new Error('Key could not be Encrypted');
    }
  };

  const handleVerifyUser = ({tnbchatPassword}: any) => {
    console.log({tnbchatPassword});
    const aes = new Aes(tnbchatPassword);

    const encryptedText = localStorage.getItem('encrypted_text')!;
    const decryptedText = aes.ctrDecryption(encryptedText);

    if (decryptedText === process.env.REACT_APP_PLAIN_TEXT) {
      console.log('Success!!!');
      setCypherAlgorithm(() => aes);
    }
  };

  const authComponents = {
    addAccount: <AddAccount cypherAlgorithm={cypherAlgorithm!} />,
    registerPassword: <RegisterPassword onFinish={handleCreatePasswordForm} />,
    verifyUser: <VerifyUser onFinish={handleVerifyUser} />,
  };

  return (
    <Modal visible={showModal} onCancel={onCancel} bodyStyle={{height: '500px', width: '350px'}}>
      {authComponents[authStatus]}
    </Modal>
  );
};

export default Auth;
