/* eslint-disable import/no-extraneous-dependencies, no-console */
const {
  PrivateKey,
} = require('@dashevo/dashcore-lib');

const DashPlatformProtocol = require('@dashevo/dpp');
const DAPIClient = require('@dashevo/dapi-client');

const { argv } = require('yargs')
  .usage(
    'Usage: $0 --dapiAddress [string] --serializedIdentity [string] --identityPrivateKey [string]',
  )
  .demandOption(['dapiAddress', 'serializedIdentity', 'identityPrivateKey']);

const dashpayContractDocumentsSchema = require('../schema/dashpay.schema.json');

/**
 * Execute Dashpay contract registration
 *
 * @returns {Promise<void>}
 */
async function register() {
  const seeds = [
    { service: argv.dapiAddress },
  ];

  const dapiClient = new DAPIClient({
    seeds,
    timeout: 30000,
  });

  const validationlessDPP = new DashPlatformProtocol({
    stateRepository: {},
  });

  const identity = await validationlessDPP.identity.createFromSerialized(
    Buffer.from(argv.serializedIdentity, 'hex'),
    { skipValidation: true },
  );

  const dpp = new DashPlatformProtocol({
    stateRepository: {
      fetchIdentity: async () => identity,
    },
  });

  const dashpayUserPrivateKey = new PrivateKey(
    argv.identityPrivateKey,
  );

  const dashpayUserPublicKey = identity.getPublicKeyById(1);

  const dataContract = dpp.dataContract.create(
    identity.getId(),
    dashpayContractDocumentsSchema,
  );

  const dataContractST = dpp.dataContract.createStateTransition(dataContract);
  dataContractST.sign(dashpayUserPublicKey, dashpayUserPrivateKey);

  await dapiClient.applyStateTransition(dataContractST);

  console.log('Registered data contract with id: ', dataContract.getId());
  console.log(
    'Here is the serialized version of it in case you need it: ',
    dataContract.serialize().toString('hex'),
  );
}

register()
  .catch((e) => console.error(e));