import 'styles/App.less';

import {useEffect} from 'react';

import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

import {useDispatch, useSelector} from 'react-redux';
import {setStateAuthData} from 'store/app';
import {getAuthData} from 'selectors';

import Auth from './Auth';

import Layout from './Layout';
import Home from './Home';

import Profile from './Profile';
import Thread from './Thread';
// import Channels from './Channels';
import Governance from './Governance';

import Wallet from './Wallet';
import Messages from './Messages';

import AccountsManager from './AccountsManager';

import {verifyAuth} from 'dispatchers/auth';

export default function App() {
  const dispatch = useDispatch();

  const {
    state: {isLoggedIn, showAuthModal},
  } = useSelector(getAuthData);

  useEffect(() => {
    dispatch(verifyAuth);
  }, [dispatch]);

  return (
    <div className="App">
      <Auth
        isLoggedIn={isLoggedIn}
        showAuthModal={showAuthModal}
        onCancel={() => {
          dispatch(
            setStateAuthData({
              showAuthModal: true,
            }),
          );
        }}
      />

      <AccountsManager />

      <Router>
        <Layout>
          <Switch>
            <Route path="/home" component={Home} />
            <Route exact path="/accounts/:account_number/" component={Profile} />
            <Route exact path="/posts/:balance_key" component={Thread} />
            <Route exact path="/messages" component={Messages} />
            <Route exact path="/governance" component={Governance} />
            <Route exact path="/wallet" component={Wallet} />

            <Redirect to="/home" />
          </Switch>
        </Layout>
      </Router>
    </div>
  );
}
