import '../App.less';

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

  console.log(process.env);

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

            <Redirect to="/home" />
          </Switch>
        </Layout>
      </Router>
    </div>
  );
}
