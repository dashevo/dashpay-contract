const {expect} = require('chai');
const DashPlatformProtocol = require('@dashevo/dpp');
const generateRandomId = require('@dashevo/dpp/lib/test/utils/generateRandomId');
const schema = require('../schema/dashpay.schema');
const whitepaperMasternodeText = 'Full nodes are servers running on a P2P network that allow peers to use them to receive updates about the events on the network. These nodes utilize significant amounts of traffic and other resources that incur a substantial cost. As a result, a steady decrease in the amount of these nodes has been observed for some time on the Bitcoin network and as a result, block propagation times have been upwards of 40 seconds. Many solutions have been proposed such as a new reward scheme by Microsoft Research and the Bitnodes incentive program.';

describe('Dashpay Contract', () => {
  let dpp;
  let contract;
  let identityId;

  beforeEach(function beforeEach() {
    const fetchContractStub = this.sinon.stub();

    dpp = new DashPlatformProtocol({
      stateRepository: {
        fetchDataContract: fetchContractStub,
      },
    });

    identityId = generateRandomId();

    contract = dpp.dataContract.create(identityId, schema);

    fetchContractStub.resolves(contract);
  });

  it('should have a valid contract definition', async () => {
    const validationResult = await dpp.dataContract.validate(contract);
    expect(validationResult.isValid()).to.be.true();
  });

  describe('Documents', function () {
    describe('Profile', () => {
      let profileData;

      beforeEach(() => {
        profileData = {
          displayName: 'Bob',
          publicMessage: 'Hello Dashpay!'
        }
      })
      describe('displayName', () => {
        it('should be defined', async () => {
          delete profileData.displayName;

          const profile = dpp.document.create(contract, identityId, 'profile', profileData);

          const result = await dpp.document.validate(profile);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('required');
          expect(error.params.missingProperty).to.equal('displayName');
        });
        it('should not be empty', async () => {
          profileData.displayName = '';

          const profile = dpp.document.create(contract, identityId, 'profile', profileData);

          const result = await dpp.document.validate(profile);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('minLength');
          expect(error.dataPath).to.equal('.displayName');
        });
        it('should have less than 64 chars length', async () => {
          profileData.displayName = 'AliceAndBobAndCarolAndDanAndEveAndFrankAndIvanAndMikeAndWalterAndWendy';
          const profile = dpp.document.create(contract, identityId, 'profile', profileData);

          let result = await dpp.document.validate(profile);
          await dpp.document.validate(profile);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          let [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('maxLength');
          expect(error.dataPath).to.equal('.displayName');
        });
      });
      describe('publicMessage', () => {
        it('should be defined', async () => {
          delete profileData.publicMessage;

          const profile = dpp.document.create(contract, identityId, 'profile', profileData);

          const result = await dpp.document.validate(profile);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('required');
          expect(error.params.missingProperty).to.equal('publicMessage');
        });
        it('should not be empty', async () => {
          profileData.publicMessage = '';

          const profile = dpp.document.create(contract, identityId, 'profile', profileData);

          const result = await dpp.document.validate(profile);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('minLength');
          expect(error.dataPath).to.equal('.publicMessage');
        });
        it('should have less than 256 chars length', async () => {
          profileData.publicMessage = whitepaperMasternodeText;
          const profile = dpp.document.create(contract, identityId, 'profile', profileData);

          let result = await dpp.document.validate(profile);
          await dpp.document.validate(profile);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          let [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('maxLength');
          expect(error.dataPath).to.equal('.publicMessage');
        });
      });
      describe('avatarUrl', () => {
        it('should be defined', async () => {
          delete profileData.avatarUrl;

          const profile = dpp.document.create(contract, identityId, 'profile', profileData);

          const result = await dpp.document.validate(profile);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('required');
          expect(error.params.missingProperty).to.equal('avatarUrl');
        });
        it('should not be empty', async () => {
          profileData.avatarUrl = '';

          const profile = dpp.document.create(contract, identityId, 'profile', profileData);

          const result = await dpp.document.validate(profile);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('minLength');
          expect(error.dataPath).to.equal('.avatarUrl');
        });
        it('should have less than 256 chars length', async () => {
          profileData.avatarUrl = 'https://github.com/dashpay/dash/wiki/Whitepaper?text='+encodeURI(whitepaperMasternodeText);
          const profile = dpp.document.create(contract, identityId, 'profile', profileData);

          let result = await dpp.document.validate(profile);
          await dpp.document.validate(profile);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          let [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('maxLength');
          expect(error.dataPath).to.equal('.avatarUrl');
        });
      });
      it('should not have additional properties', async () => {
        profileData.someOtherProperty = 42;

        const profile = dpp.document.create(contract, identityId, 'profile', profileData);

        const result = await dpp.document.validate(profile);

        expect(result.isValid()).to.be.false();
        expect(result.errors).to.have.a.lengthOf(1);

        const [error] = result.errors;

        expect(error.name).to.equal('JsonSchemaError');
        expect(error.keyword).to.equal('additionalProperties');
        expect(error.params.additionalProperty).to.equal('someOtherProperty');
      });
      it('should be valid', async () => {
        const profile = dpp.document.create(contract, identityId, 'profile', profileData);

        const result = await dpp.document.validate(profile);

        expect(result.isValid()).to.be.true();
      });
    });
    describe('Contact info', () => {
      let contactInfoData;

      beforeEach(() => {
        contactInfoData = {
          encToUserId: '',
          encryptionKeyIndex: 0,
          privateData: '',
        }
      });

      describe('encToUserId', () => {
        it('should be defined', async () => {
          delete contactInfoData.encToUserId;

          const contactInfo = dpp.document.create(contract, identityId, 'contactInfo', contactInfoData);

          const result = await dpp.document.validate(contactInfo);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('required');
          expect(error.params.missingProperty).to.equal('encToUserId');
        });
      });
      describe('encryptionKeyIndex', () => {
        it('should be defined', async () => {
          delete contactInfoData.encryptionKeyIndex;

          const contactInfo = dpp.document.create(contract, identityId, 'contactInfo', contactInfoData);

          const result = await dpp.document.validate(contactInfo);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('required');
          expect(error.params.missingProperty).to.equal('encryptionKeyIndex');
        });
      });
      describe('privateData', () => {
        it('should be defined', async () => {
          delete contactInfoData.privateData;

          const contactInfo = dpp.document.create(contract, identityId, 'contactInfo', contactInfoData);

          const result = await dpp.document.validate(contactInfo);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('required');
          expect(error.params.missingProperty).to.equal('privateData');
        });
      });
      it('should not have additional properties', async () => {
        contactInfoData.someOtherProperty = 42;

        const contactInfo = dpp.document.create(contract, identityId, 'contactInfo', contactInfoData);

        const result = await dpp.document.validate(contactInfo);

        expect(result.isValid()).to.be.false();
        expect(result.errors).to.have.a.lengthOf(1);

        const [error] = result.errors;

        expect(error.name).to.equal('JsonSchemaError');
        expect(error.keyword).to.equal('additionalProperties');
        expect(error.params.additionalProperty).to.equal('someOtherProperty');
      });
    });
    describe('Contact Request', () => {
      let contactRequestData;

      beforeEach(() => {
        contactRequestData = {
          toUserId: '',
          encryptedPublicKey: '',
          senderKeyIndex: 0,
          recipientKeyIndex: 0,
        }
      })
      describe('toUserId', () => {
        it('should be defined', async () => {
          delete contactRequestData.toUserId;

          const contactRequest = dpp.document.create(contract, identityId, 'contactInfo', contactRequestData);

          const result = await dpp.document.validate(contactRequest);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('required');
          expect(error.params.missingProperty).to.equal('toUserId');
        });
      });
      describe('encryptedPublicKey', () => {
        it('should be defined', async () => {
          delete contactRequestData.encryptedPublicKey;

          const contactRequest = dpp.document.create(contract, identityId, 'contactInfo', contactRequestData);

          const result = await dpp.document.validate(contactRequest);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('required');
          expect(error.params.missingProperty).to.equal('encryptedPublicKey');
        });
      });
      describe('senderKeyIndex', () => {
        it('should be defined', async () => {
          delete contactRequestData.senderKeyIndex;

          const contactRequest = dpp.document.create(contract, identityId, 'contactInfo', contactRequestData);

          const result = await dpp.document.validate(contactRequest);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('required');
          expect(error.params.missingProperty).to.equal('senderKeyIndex');
        });
      });
      describe('recipientKeyIndex', () => {
        it('should be defined', async () => {
          delete contactRequestData.recipientKeyIndex;

          const contactRequest = dpp.document.create(contract, identityId, 'contactInfo', contactRequestData);

          const result = await dpp.document.validate(contactRequest);

          expect(result.isValid()).to.be.false();
          expect(result.errors).to.have.a.lengthOf(1);

          const [error] = result.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('required');
          expect(error.params.missingProperty).to.equal('recipientKeyIndex');
        });
      });
      it('should not have additional properties', async () => {
        contactRequestData.someOtherProperty = 42;

        const contactRequest = dpp.document.create(contract, identityId, 'contactRequest', contactRequestData);

        const result = await dpp.document.validate(contactRequest);

        expect(result.isValid()).to.be.false();
        expect(result.errors).to.have.a.lengthOf(1);

        const [error] = result.errors;

        expect(error.name).to.equal('JsonSchemaError');
        expect(error.keyword).to.equal('additionalProperties');
        expect(error.params.additionalProperty).to.equal('someOtherProperty');
      });
    });
  });

});
