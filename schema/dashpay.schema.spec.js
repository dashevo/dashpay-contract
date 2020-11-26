const {expect} = require('chai');
const DashPlatformProtocol = require('@dashevo/dpp');
const generateRandomIdentifier = require('@dashevo/dpp/lib/test/utils/generateRandomIdentifier');
const schema = require('../schema/dashpay.schema');
const whitepaperMasternodeText = 'Full nodes are servers running on a P2P network that allow peers to use them to receive updates about the events on the network. These nodes utilize significant amounts of traffic and other resources that incur a substantial cost. As a result, a steady decrease in the amount of these nodes has been observed for some time on the Bitcoin network and as a result, block propagation times have been upwards of 40 seconds. Many solutions have been proposed such as a new reward scheme by Microsoft Research and the Bitnodes incentive program';
const encoded32Chars = '4fafc98bbfe597f7ba2c9f767d52036d';
const encoded64Chars = '4fafc98bbfe597f7ba2c9f767d52036d2226175960a908e355e5c575711eb166';
const encoded128Chars = '88a2cc4de23d5ebb9494153ea3633f9763eb8d28cf6b58e96e4e572072c0585bb4d817a3dd671af36dee4e249888521349703e9011b3121ea8481e2e8e7ec709';

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

    identityId = generateRandomIdentifier();

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
        it('can be avoided', async () => {
          delete profileData.displayName;
          const profile = dpp.document.create(contract, identityId, 'profile', profileData);
        });
        it('can be empty', async () => {
          profileData.displayName = '';
          const profile = dpp.document.create(contract, identityId, 'profile', profileData);
        });
        it('should have less than 25 chars length', async () => {
          profileData.displayName = 'AliceAndBobAndCarolAndDanAndEveAndFrankAndIvanAndMikeAndWalterAndWendy';
          try {
            const profile = dpp.document.create(contract, identityId, 'profile', profileData);
            throw new Error('Expected error');
          } catch (e) {
            expect(e.name).to.equal('InvalidDocumentError');
            expect(e.errors).to.have.a.lengthOf(1);
            const [error] = e.errors;
            expect(error.name).to.equal('JsonSchemaError');
            expect(error.keyword).to.equal('maxLength');
            expect(error.dataPath).to.equal('.displayName');
          }
        });
      });
      describe('publicMessage', () => {
        it('can be avoided', async () => {
          delete profileData.publicMessage;
          const profile = dpp.document.create(contract, identityId, 'profile', profileData);
        });
        it('can be empty', async () => {
          profileData.publicMessage = '';
          const profile = dpp.document.create(contract, identityId, 'profile', profileData);
        });
        it('should have less than 256 chars length', async () => {
          profileData.publicMessage = whitepaperMasternodeText;
          try {
            const profile = dpp.document.create(contract, identityId, 'profile', profileData);
            throw new Error('Expected error');
          } catch (e) {
            expect(e.name).to.equal('InvalidDocumentError');
            expect(e.errors).to.have.a.lengthOf(1);
            const [error] = e.errors;
            expect(error.name).to.equal('JsonSchemaError');
            expect(error.keyword).to.equal('maxLength');
            expect(error.dataPath).to.equal('.publicMessage');
          }
        });
      });
      describe('avatarUrl', () => {
        it('should not be empty', async () => {
          profileData.avatarUrl = '';

          try {
            const profile = dpp.document.create(contract, identityId, 'profile', profileData);
            throw new Error('Expected error');
          } catch (e) {
            expect(e.name).to.equal('InvalidDocumentError');
            expect(e.errors).to.have.a.lengthOf(1);
            const [error] = e.errors;
            expect(error.name).to.equal('JsonSchemaError');
            expect(error.keyword).to.equal('format');
            expect(error.dataPath).to.equal('.avatarUrl');
          }
        });
        it('should have less than 2048 chars length', async () => {
          profileData.avatarUrl = 'https://github.com/dashpay/dash/wiki/Whitepaper?text=' + encodeURI(whitepaperMasternodeText) + encodeURI(whitepaperMasternodeText) + encodeURI(whitepaperMasternodeText) + encodeURI(whitepaperMasternodeText) + encodeURI(whitepaperMasternodeText);

          try {
            const profile = dpp.document.create(contract, identityId, 'profile', profileData);
            throw new Error('Expected error');
          } catch (e) {
            expect(e.name).to.equal('InvalidDocumentError');
            expect(e.errors).to.have.a.lengthOf(1);
            const [error] = e.errors;
            expect(error.name).to.equal('JsonSchemaError');
            expect(error.keyword).to.equal('maxLength');
            expect(error.dataPath).to.equal('.avatarUrl');
          }
        });
        it('should be of type URL', async function () {
          profileData.avatarUrl = 'notAUrl';
          try {
            const profile = dpp.document.create(contract, identityId, 'profile', profileData);
            throw new Error('Expected error');
          } catch (e) {
            expect(e.name).to.equal('InvalidDocumentError');
            expect(e.errors).to.have.a.lengthOf(1);
            const [error] = e.errors;
            expect(error.name).to.equal('JsonSchemaError');
            expect(error.keyword).to.equal('format');
            expect(error.dataPath).to.equal('.avatarUrl');
          }
        });
      });
      it('should not have additional properties', async () => {
        profileData.someOtherProperty = 42;

        try {
          const profile = dpp.document.create(contract, identityId, 'profile', profileData);
          throw new Error('Expected error');
        } catch (e) {
          expect(e.name).to.equal('InvalidDocumentError');
          expect(e.errors).to.have.a.lengthOf(1);
          const [error] = e.errors;
          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('additionalProperties');
          expect(error.params.additionalProperty).to.equal('someOtherProperty');
        }
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
          encToUserId: Buffer.alloc(32),
          privateData: Buffer.alloc(48),
          rootEncryptionKeyIndex: 0,
          derivationEncryptionKeyIndex: 0,
        }
      });
      describe('encToUserId', () => {
        it('should be defined', async () => {
          delete contactInfoData.encToUserId;

          try {
            const contactInfo = dpp.document.create(contract, identityId, 'contactInfo', contactInfoData);
            throw new Error('Expected error');
          } catch (e) {
            expect(e.name).to.equal('InvalidDocumentError');
            expect(e.errors).to.have.a.lengthOf(1);
            const [error] = e.errors;

            expect(error.name).to.equal('JsonSchemaError');
            expect(error.keyword).to.equal('required');
            expect(error.params.missingProperty).to.equal('encToUserId');
          }

        });
        it('should have exactly 32 chars length', async () => {
          contactInfoData.encToUserId = Buffer.from(encoded64Chars + '11', 'hex');

          try {
            const contactInfo = dpp.document.create(contract, identityId, 'contactInfo', contactInfoData);
            throw new Error('Expected error');
          } catch (e) {
            expect(e.name).to.equal('InvalidDocumentError');
            expect(e.errors).to.have.a.lengthOf(1);
            const [error] = e.errors;

            expect(error.name).to.equal('JsonSchemaError');
            expect(error.keyword).to.equal('maxItems');
            expect(error.dataPath).to.equal('.encToUserId');
          }
        });
        it('should have more or 32 chars length', async () => {
          contactInfoData.encToUserId = Buffer.from(encoded32Chars, 'hex');

          try {
            const contactInfo = dpp.document.create(contract, identityId, 'contactInfo', contactInfoData);
            throw new Error('Expected error');
          } catch (e) {
            expect(e.name).to.equal('InvalidDocumentError');
            expect(e.errors).to.have.a.lengthOf(1);
            const [error] = e.errors;

            expect(error.name).to.equal('JsonSchemaError');
            expect(error.keyword).to.equal('minItems');
            expect(error.dataPath).to.equal('.encToUserId');
          }
        });

      });
      describe('rootEncryptionKeyIndex', () => {
        it('should be defined', async () => {
          delete contactInfoData.rootEncryptionKeyIndex;

          try {
            const contactInfo = dpp.document.create(contract, identityId, 'contactInfo', contactInfoData);
            throw new Error('Expected error');
          } catch (e) {
            expect(e.name).to.equal('InvalidDocumentError');
            expect(e.errors).to.have.a.lengthOf(1);
            const [error] = e.errors;
            expect(error.name).to.equal('JsonSchemaError');
            expect(error.keyword).to.equal('required');
            expect(error.params.missingProperty).to.equal('rootEncryptionKeyIndex');
          }
        });
      });
      describe('privateData', () => {
        it('should be defined', async () => {
          delete contactInfoData.privateData;

          try {
            const contactInfo = dpp.document.create(contract, identityId, 'contactInfo', contactInfoData);
            throw new Error('Expected error');
          } catch (e) {
            expect(e.name).to.equal('InvalidDocumentError');
            expect(e.errors).to.have.a.lengthOf(1);
            const [error] = e.errors;
            expect(error.name).to.equal('JsonSchemaError');
            expect(error.keyword).to.equal('required');
            expect(error.params.missingProperty).to.equal('privateData');
          }
        });
      });
      it('should not have additional properties', async () => {
        contactInfoData.someOtherProperty = 42;

        try {
          const contactInfo = dpp.document.create(contract, identityId, 'contactInfo', contactInfoData);
          throw new Error('Expected error');
        } catch (e) {
          expect(e.name).to.equal('InvalidDocumentError');
          expect(e.errors).to.have.a.lengthOf(1);
          const [error] = e.errors;
          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('additionalProperties');
          expect(error.params.additionalProperty).to.equal('someOtherProperty');
        }
      });
    });
    describe('Contact Request', () => {
      let contactRequestData;

      beforeEach(() => {
        contactRequestData = {
          toUserId: Buffer.alloc(32),
          encryptedPublicKey: Buffer.alloc(96),
          senderKeyIndex: 0,
          recipientKeyIndex: 0,
          accountReference: 0,
        }
      })
      describe('toUserId', () => {
        it('should be defined', async () => {
          delete contactRequestData.toUserId;

          try {
            const contactRequest = dpp.document.create(contract, identityId, 'contactRequest', contactRequestData);
            throw new Error('Expected error');
          } catch (e) {
            expect(e.name).to.equal('InvalidDocumentError');
            expect(e.errors).to.have.a.lengthOf(1);
            const [error] = e.errors;
            expect(error.name).to.equal('JsonSchemaError');
            expect(error.keyword).to.equal('required');
            expect(error.params.missingProperty).to.equal('toUserId');
          }
        });
      });
      describe('encryptedPublicKey', () => {
        it('should be defined', async () => {
          delete contactRequestData.encryptedPublicKey;

          try {
            const contactRequest = dpp.document.create(contract, identityId, 'contactRequest', contactRequestData);
            throw new Error('Expected error');
          } catch (e) {
            expect(e.name).to.equal('InvalidDocumentError');
            expect(e.errors).to.have.a.lengthOf(1);
            const [error] = e.errors;
            expect(error.name).to.equal('JsonSchemaError');
            expect(error.keyword).to.equal('required');
            expect(error.params.missingProperty).to.equal('encryptedPublicKey');
          }
        });
      });
      describe('senderKeyIndex', () => {
        it('should be defined', async () => {
          delete contactRequestData.senderKeyIndex;

          try {
            const contactRequest = dpp.document.create(contract, identityId, 'contactRequest', contactRequestData);
            throw new Error('Expected error');
          } catch (e) {
            expect(e.name).to.equal('InvalidDocumentError');
            expect(e.errors).to.have.a.lengthOf(1);
            const [error] = e.errors;
            expect(error.name).to.equal('JsonSchemaError');
            expect(error.keyword).to.equal('required');
            expect(error.params.missingProperty).to.equal('senderKeyIndex');
          }

        });
      });
      describe('recipientKeyIndex', () => {
        it('should be defined', async () => {
          delete contactRequestData.recipientKeyIndex;

          try {
            const contactRequest = dpp.document.create(contract, identityId, 'contactRequest', contactRequestData);
            throw new Error('Expected error');
          } catch (e) {
            expect(e.name).to.equal('InvalidDocumentError');
            expect(e.errors).to.have.a.lengthOf(1);
            const [error] = e.errors;
            expect(error.name).to.equal('JsonSchemaError');
            expect(error.keyword).to.equal('required');
            expect(error.params.missingProperty).to.equal('recipientKeyIndex');
          }

        });
      });
      it('should not have additional properties', async () => {
        contactRequestData.someOtherProperty = 42;

        try {
          const contactRequest = dpp.document.create(contract, identityId, 'contactRequest', contactRequestData);
          throw new Error('Expected error');
        } catch (e) {
          expect(e.name).to.equal('InvalidDocumentError');
          expect(e.errors).to.have.a.lengthOf(1);
          const [error] = e.errors;

          expect(error.name).to.equal('JsonSchemaError');
          expect(error.keyword).to.equal('additionalProperties');
          expect(error.params.additionalProperty).to.equal('someOtherProperty');
        }
      });
    });
  });

});
