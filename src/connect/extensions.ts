// @ts-ignore
import { extension } from '@reef-chain/util-lib';
import { sqwidErrorDebug } from '../utils/debug';
import { CHROME_DOWNLOAD_REEF_EXTENSION, FIREFOX_DOWNLOAD_REEF_EXTENSION } from '../utils/constants';

function getBrowserExtensionUrl() {
  const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  if (isFirefox) {
    return FIREFOX_DOWNLOAD_REEF_EXTENSION;
  }
  const isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
  if (isChrome) {
    return CHROME_DOWNLOAD_REEF_EXTENSION;
  }
  return undefined;
}

function getInstallExtensionMessage() {
  const extensionUrl = getBrowserExtensionUrl();
  const installText = extensionUrl
    ? 'Please install Reef chain or some other Solidity browser extension and refresh the page.'
    : 'Please use Chrome or Firefox browser.';
  return {
    message: `App uses browser extension to get accounts and securely sign transactions. ${installText}`,
    url: extensionUrl,
  };
}

export async function connectReefExtension(appDisplayName:string) {
  return new Promise((resolve) => {
    let isReefInjected = false;

    const onInjected = () => {
      isReefInjected = true;
    };
    document.addEventListener('reef-injected', onInjected);

    (async () => {
      try {
        const extensions = await extension.web3Enable(appDisplayName);
        const reefExt = extensions.find((ext:any) => ext.name === extension.REEF_EXTENSION_IDENT);

        if (!reefExt) {
          const installMsg = getInstallExtensionMessage();
          resolve({
            accounts: [],
            extension: undefined,
            isLoading: false,
            error: { code: 1, ...installMsg },
          });
          return;
        }

        const reefAccounts = await reefExt.accounts.get();
        if (reefAccounts.length < 1) {
          resolve({
            accounts: [],
            extension: reefExt,
            isLoading: false,
            error: {
              code: 2,
              message: 'App requires at least one account in browser extension. Please create or import account/s and refresh the page.',
            },
          });
          return;
        }

        const accountsWithMeta = reefAccounts.map((acc:any) => ({
          address: acc.address,
          meta: {
            genesisHash: acc.genesisHash,
            name: acc.name,
            source: reefExt.name,
          },
          type: acc.type,
        }));

        resolve({
          accounts: accountsWithMeta,
          extension: reefExt,
          isLoading: false,
          error: undefined,
        });
      } catch (e) {
        sqwidErrorDebug(['Error when loading signers!', e]);
        resolve({
          accounts: [],
          extension: undefined,
          isLoading: false,
          error: { message: (e as any).message || 'Unknown error' },
        });
      }
    })();
  });
}
