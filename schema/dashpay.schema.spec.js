const {expect} = require('chai');
const DashPlatformProtocol = require('@dashevo/dpp');
const generateRandomId = require('@dashevo/dpp/lib/test/utils/generateRandomId');
const schema = require('../schema/dashpay.schema');

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
