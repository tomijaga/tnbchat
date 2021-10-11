import {FC, useEffect} from 'react';
import Modal from 'antd/es/modal';
import {useDispatch, useSelector} from 'react-redux';
import {setAuthData} from 'store/app';
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
  const {isLoggedIn, showAuthModal, authStatus} = useSelector(getAuthData);

  useEffect(() => {
    if (!isLoggedIn) {
      if (localStorage.getItem('encrypted_text')) {
        dispatch(
          setAuthData({
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
        return <AddAccount />;
      case AuthStatus.import_account:
        return <AddAccount />;
      default:
        <> No auth status set</>;
    }
  };

  const closeAuthModal = () => {
    dispatch(
      setAuthData({
        showAuthModal: false,
      }),
    );
  };

  return (
    <Modal visible={showAuthModal} onCancel={closeAuthModal} bodyStyle={{height: '500px', width: '350px'}}>
      {selectAuthComponents()}
    </Modal>
  );
};

export default Auth;
