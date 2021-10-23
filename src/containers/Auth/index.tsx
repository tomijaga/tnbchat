import {FC, useEffect} from 'react';
import Modal from 'antd/es/modal';
import {useDispatch, useSelector} from 'react-redux';
import {setStateAuthData} from 'store/app';
import {getAuthData} from 'selectors';

import AddAccount from './AddAccount';
import RegisterPassword from './RegisterPassword';
import VerifyUser from './VerifyUser';
import {AuthStatus} from 'types';

const Auth: FC<{
  showAuthModal?: boolean;
  isLoggedIn: boolean;
  onCancel: () => void;
}> = () => {
  const dispatch = useDispatch();
  const {
    state: {isLoggedIn, showAuthModal, authStatus},
  } = useSelector(getAuthData);

  useEffect(() => {
    if (!isLoggedIn) {
      if (localStorage.getItem('encrypted_text')) {
        dispatch(
          setStateAuthData({
            showAuthModal: true,
            authStatus: AuthStatus.verify_password,
          }),
        );
      }
    }
  }, [isLoggedIn, dispatch]);

  const selectAuthComponents = () => {
    switch (authStatus) {
      case AuthStatus.register_password:
        return <RegisterPassword />;
      case AuthStatus.verify_password:
        return <VerifyUser />;
      case AuthStatus.create_account:
      case AuthStatus.import_account:
        return <AddAccount />;
      default:
        <> No auth status set</>;
    }
  };

  const closeAuthModal = () => {
    dispatch(
      setStateAuthData({
        showAuthModal: false,
      }),
    );
  };

  const getTitle = () => {
    switch (authStatus) {
      case AuthStatus.register_password:
        return 'Password Setup';
      case AuthStatus.verify_password:
        return 'Verify Password';
      case AuthStatus.create_account:
        return "Setup your 'Seed Phrase'";
      case AuthStatus.import_account:
        return 'Import thenewboston Account';
      default:
        break;
    }
  };
  return (
    <Modal title={getTitle()} centered visible={showAuthModal} destroyOnClose onCancel={closeAuthModal} footer={null}>
      {selectAuthComponents()}
    </Modal>
  );
};

export default Auth;
