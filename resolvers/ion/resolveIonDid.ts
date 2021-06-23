import ION from '@decentralized-identity/ion-tools';

export default async function resolveIonDid (did) {
  const didDocument = await ION.resolve(did, { nodeEndpoint: 'http://localhost:3000/identifiers/' });
  console.log(didDocument);
}
