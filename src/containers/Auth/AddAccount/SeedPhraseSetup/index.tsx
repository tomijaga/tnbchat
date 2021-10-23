import {useEffect, useState} from 'react';
import Card from 'antd/es/card';
import Button from 'antd/es/button';
import Tag from 'antd/es/tag';
import Row from 'antd/es/row';
import Col from 'antd/es/col';

import Typography from 'antd/es/typography';
import {useDispatch, useSelector} from 'react-redux';
import {getAuthData} from 'selectors';
import {setStateAuthData} from 'store/app';

import {generateMnemonic} from 'tnb-hd-wallet';
import {verifyAuth} from 'dispatchers/auth';
import {createSeedPhrase} from 'dispatchers/account';

const NewAccount = () => {
  const dispatch = useDispatch();
  const {
    session: {appEncryptedUserPasswordHash},
  } = useSelector(getAuthData);

  const [seedPhrase, setSeedPhrase] = useState<string>('');
  const [verifyNow, setVerifyNow] = useState(false);

  const [selectedWordsArray, setSelectedWordsArray] = useState<string[]>([]);
  const [randomOrderSeedPhrase, setRandomOrderSeedPhrase] = useState<string[]>([]);

  const [isInWrongOrder, setIsInWrongOrder] = useState(false);
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
      if (dispatch(verifyAuth)) {
        dispatch(createSeedPhrase(seedPhrase));

        dispatch(setStateAuthData({showAuthModal: false}));
      }
    } else if (selectedWordsArray.length >= 12) {
      setIsInWrongOrder(true);
    } else {
      setIsInWrongOrder(false);
    }
  }, [selectedWordsArray, dispatch, appEncryptedUserPasswordHash, seedPhrase]);

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
        <Typography.Link>
          <Tag
            onClick={() => {
              selected ? deselectWord(wordInSeedPhrase, index) : selectWord(wordInSeedPhrase, index);
            }}
          >
            {wordInSeedPhrase}
          </Tag>
        </Typography.Link>
      );
    });
  };

  return (
    <Row justify="center" gutter={[10, 30]}>
      {verifyNow === false ? (
        <>
          <Col span={24}>
            <Card size="small" title="Your Seed Phrase">
              <Typography.Text strong code copyable>
                {seedPhrase}
              </Typography.Text>
            </Card>
          </Col>

          <Col>
            <Typography.Text>Copy and save your seed phrase in a secure location.</Typography.Text>
          </Col>

          <Col>
            <Button
              onClick={() => {
                setVerifyNow(true);
              }}
            >
              Verify Seed Phrase
            </Button>
          </Col>
        </>
      ) : (
        <>
          <Col span={24}>
            <Button
              size="small"
              onClick={() => {
                setVerifyNow(false);
              }}
            >
              Back
            </Button>
            <br />
            <br />
            <Card size="small" title="Verify Seed Phrase" style={{background: 'rgba(0, 0, 0, 0.05)'}}>
              <Row gutter={[10, 10]}>{displaySeedPhraseAsTags(selectedWordsArray, true)}</Row>
            </Card>
          </Col>

          <Col>Click on the words in the right order to verify your seed phrase</Col>

          <Col span={24}>
            <Row justify="center" gutter={[10, 10]}>
              {displaySeedPhraseAsTags(randomOrderSeedPhrase)}
            </Row>
          </Col>

          {isInWrongOrder && (
            <Col>
              <Typography.Text type="danger">Seed Phrase is in the wrong order</Typography.Text>
            </Col>
          )}
        </>
      )}
    </Row>
  );
};

export default NewAccount;
