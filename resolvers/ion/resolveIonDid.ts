import ION from '@decentralized-identity/ion-tools';
import {ionApiServer} from "../../config/ion";

async function resolveIonDid (did) {
  const didDocument = await ION.resolve(did, { nodeEndpoint: `${ionApiServer}/identifiers/` });
  console.log(JSON.stringify(didDocument, null, 2));
}

export default resolveIonDid;
