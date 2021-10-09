import {FC, ReactNode, useState} from 'react';
import Card from 'antd/es/card';
import Col from 'antd/es/col';
import Button from 'antd/es/button';
import Row from 'antd/es/row';
import Form from 'antd/es/form';
import {generateMnemonic} from 'tnb-hd-wallet';
import {Input, Typography} from 'antd';
import {Aes} from 'utils';
import {Account} from 'thenewboston/src';
import {HdWallet} from 'tnb-hd-wallet';
type AddAccountOption = 'create_account' | 'import_seed_phrase' | 'import_signing_key' | 'none';

type Address = {
  account_number: string;
  username: string;
  // not_derived means its not derived from the seed phrase (The user imported a signing key)
  path: string | 'not_derived';
};

interface TNBChatAccount {
  seed_phrase?: string;

  // We need this because both the derived and imported addresses are kept in the same array
  // When deriving new accounts we will be able to calculate how many have already been derived
  num_of_imported_addresses: number;
  addresses: Address[];
}
const AddAccount: FC<{cypherAlgorithm: Aes}> = ({cypherAlgorithm}) => {
  const [option, setOption] = useState<AddAccountOption>('none');
  const [isSuccess, setIsSuccess] = useState(false);

  const importForm = () => {
    const text = option === 'import_signing_key' ? 'Signing Key' : 'Seed Phrase';

    const handleAccountImport = (importData: any) => {
      const plainText = importData[option];

      if (!plainText) throw new Error('Signing Key or Seed Phrase is Empty');

      const cyphertext = cypherAlgorithm.ctrEncryption(plainText);

      if (cyphertext) {
        const accountJSONasText = localStorage.getItem('tnbchat_account') ?? '';

        let account: TNBChatAccount;

        if (accountJSONasText) {
          account = JSON.parse(accountJSONasText);
        } else {
          account = {
            seed_phrase: '',
            num_of_imported_addresses: 0,
            addresses: [],
          };
        }

        // If cyphertext is a signing key
        if (importData['import_signing_key']) {
          const newAddressData: Address = {
            account_number: new Account(plainText).accountNumberHex,
            username: importData.username,
            path: 'not_derived',
          };

          account.addresses.push(newAddressData);
          account.num_of_imported_addresses += 1;

          // If cyphertext is a Seed Phrase
        } else {
          account.seed_phrase = cyphertext;
          const tnb = HdWallet.thenewboston(plainText);
          const addressIndex = account.addresses.length - account.num_of_imported_addresses;
          const address = tnb.getAddress(0, addressIndex);

          account.addresses.push({
            account_number: address.publicKey,
            username: importData.username,
            path: address.path,
          });
        }

        localStorage.setItem('tnbchat_account', JSON.stringify(account));
        setIsSuccess(true);
      }
    };

    return (
      <Form onFinish={handleAccountImport}>
        <Form.Item label={text} name={option}>
          <Input.Password />
        </Form.Item>
        <Form.Item label={'Username'} name={'username'}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit">Encrypt {text}</Button>
        </Form.Item>
      </Form>
    );
  };
  const component: {
    [x: string]: ReactNode;
  } = {
    create_account: (
      <>
        <Card>{generateMnemonic()}</Card>
        <Typography.Text>
          Copy and save your seed phrase in a secure location.
          <br />
          Go to this link to see the best ways to secure your seed phrase [Post link here]
        </Typography.Text>
        <Button>Verify Seed Phrase</Button>
      </>
    ),
    import_seed_phrase: importForm(),
    import_signing_key: importForm(),
  };

  return (
    <Row gutter={[40, 40]}>
      {isSuccess === false ? (
        option === 'none' ? (
          <>
            <Col>
              <Button onClick={() => setOption('create_account')}>Create Account</Button>
            </Col>
            <Col>
              <Button onClick={() => setOption('import_signing_key')}>Import Signing Key</Button>
            </Col>
            <Col>
              <Button onClick={() => setOption('import_seed_phrase')}>Import Seed Phrase</Button>
            </Col>
          </>
        ) : (
          <>
            <Button onClick={() => setOption('none')}>Back button</Button>
            {component[option]}
          </>
        )
      ) : (
        <Col>Success</Col>
      )}
    </Row>
  );
};

export default AddAccount;
