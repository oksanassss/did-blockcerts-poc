import getArg from "../utils/getArg";
import resolveIonDid from "./ion/resolveIonDid";

const supportedMethods = {
  ion: resolveIonDid
}

async function resolveDID () {
  const didArg = '--did';
  const didUri = getArg(didArg);
  const method = didUri.split(':')[1];
  const didDocument = await supportedMethods[method](didUri);
  console.log(didDocument);
}

resolveDID();
