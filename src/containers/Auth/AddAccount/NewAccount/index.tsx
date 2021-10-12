import {useEffect, useState} from 'react';
import Card from 'antd/es/card';
import Button from 'antd/es/button';
import Tag from 'antd/es/tag';

import Typography from 'antd/es/typography';
import {nanoid} from 'nanoid';
import {useDispatch, useSelector} from 'react-redux';
import {getAuthData} from 'selectors';
import {setAuthData} from 'store/app';

import {AuthStatus} from 'types';

import {generateMnemonic} from 'tnb-hd-wallet';
import {AccountManager} from 'utils/account-manager';

const NewAccount = () => {
  const dispatch = useDispatch();
  const {passwordHash} = useSelector(getAuthData);

  const [seedPhrase, setSeedPhrase] = useState<string>('');
  const [verifyNow, setVerifyNow] = useState(false);

  const [selectedWordsArray, setSelectedWordsArray] = useState<string[]>([]);
  const [randomOrderSeedPhrase, setRandomOrderSeedPhrase] = useState<string[]>([]);

  useEffect(() => {
    const seedPhrase = generateMnemonic();
    setSeedPhrase(seedPhrase);

    let seedPhraseAsArray = seedPhrase.split(' ');
    const length = seedPhraseAsArray.length;
    for (let i = 0; i < length; i += 1) {
      const rand = Math.floor(Math.random() * (length - i));

      const elem = seedPhraseAsArray[rand];
      seedPhraseAsArray = [...seedPhraseAsArray.slice(0, rand), ...seedPhraseAsArray.slice(rand + 1)];

      setRandomOrderSeedPhrase((prev) => [...prev, elem]);
    }
  }, []);

  useEffect(() => {
    if (seedPhrase && selectedWordsArray.join(' ') === seedPhrase) {
      if (passwordHash !== null) {
        const accountManager = new AccountManager({hash: passwordHash});
        accountManager.addSeedPhrase(seedPhrase, `User ${nanoid()}`);
      } else {
        dispatch(
          setAuthData({
            authStatus: AuthStatus.verify_password,
          }),
        );
      }

      dispatch(
        setAuthData({
          showAuthModal: false,
          authStatus: AuthStatus.none,
        }),
      );
    }
  }, [selectedWordsArray, dispatch, passwordHash, seedPhrase]);

  const removeIndex = (arr: any[], index: number) => {
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
  };

  const selectWord = (wordInSeedPhrase: string, index: number) => {
    setRandomOrderSeedPhrase((prev) => removeIndex(prev, index));
    setSelectedWordsArray((prev) => [...prev, wordInSeedPhrase]);
  };

  const deselectWord = (wordInSeedPhrase: string, index: number) => {
    setSelectedWordsArray((prev) => removeIndex(prev, index));
    setRandomOrderSeedPhrase((prev) => [...prev, wordInSeedPhrase]);
  };

  const displaySeedPhraseAsTags = (seedPhrase: string[], selected: boolean = false) => {
    return seedPhrase.map((wordInSeedPhrase: string, index: number) => {
      return (
        <Tag
          onClick={() => {
            selected ? deselectWord(wordInSeedPhrase, index) : selectWord(wordInSeedPhrase, index);
          }}
        >
          {wordInSeedPhrase}
        </Tag>
      );
    });
  };

  return (
    <Card>
      {verifyNow === false ? (
        <>
          <Card>{seedPhrase}</Card>

          <Typography.Text>
            Copy and save your seed phrase in a secure location.
            <br />
            Go to this link to see the best ways to secure your seed phrase [Post link here]
          </Typography.Text>
          <Button
            onClick={() => {
              setVerifyNow(true);
            }}
          >
            Verify Seed Phrase
          </Button>
        </>
      ) : (
        <>
          <Button
            onClick={() => {
              setVerifyNow(false);
            }}
          >
            Back
          </Button>
          Verify Seed Phrase
          <Card style={{background: 'lightgray'}}>{displaySeedPhraseAsTags(selectedWordsArray, true)}</Card>
          {displaySeedPhraseAsTags(randomOrderSeedPhrase)}
        </>
      )}
    </Card>
  );
};

export default NewAccount;
