import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
// @ts-ignore
import { reefState, network as nw, extension as reefExt } from '@reef-chain/util-lib';
import { connectReefExtension } from './extensions';
import { Provider, Signer } from '@reef-chain/evm-provider';
import { BigNumber } from 'ethers';

const SELECTED_ADDRESS_IDENT = 'selected_address_reef';

function getNetworkFallback(): nw.Network {
  try {
    const stored = localStorage.getItem('reef_active_network');
    const parsed = stored ? JSON.parse(stored) : null;
    // @ts-ignore
    return nw.AVAILABLE_NETWORKS[parsed?.name] || nw.AVAILABLE_NETWORKS.mainnet;
  } catch {
    return nw.AVAILABLE_NETWORKS.mainnet;
  }
}

function getSelectedAddress(): string | undefined {
  try {
    return localStorage.getItem(SELECTED_ADDRESS_IDENT) || undefined;
  } catch {
    return undefined;
  }
}

const getReefCoinBalance = async (address: string, provider: Provider): Promise<BigNumber> => {
  const balance = await provider.api.derive.balances
    .all(address as any)
    .then(res => BigNumber.from(res.freeBalance.toString(10)));
  return balance;
};

const signerToReefSigner = async (
  signer: Signer,
  provider: Provider,
  { address, name, source, genesisHash }: any
): Promise<any> => {
  const evmAddress = await signer.getAddress();
  const isEvmClaimed = await signer.isClaimed();

  let inj;
  try {
    // @ts-ignore
    inj = await reefExt.web3FromAddress(address);
  } catch (e) {}

  const balance = await getReefCoinBalance(address, provider);
  return {
    signer,
    balance,
    evmAddress,
    isEvmClaimed,
    name,
    address,
    source,
    genesisHash,
    sign: inj?.signer,
  };
};

const accountToSigner = async (
  account: any,
  provider: Provider,
  sign: any,
  source: string
): Promise<any> => {
  const signer = new Signer(provider, account.address, sign);
  return signerToReefSigner(signer, provider, {
    source,
    address: account.address,
    name: account.name || '',
    genesisHash: account.genesisHash || '',
  });
};

const reefAccountToReefSigner = (accounts: any[], injectedSigner: any) => {
  const reefSigners = accounts.map(acc => ({
    name: acc.name || '',
    address: acc.address,
    source: acc.meta?.source || 'reef',
    genesisHash: acc.meta?.genesisHash || '',
  }));

  return {
    name: 'reef',
    sig: injectedSigner,
    accounts: reefSigners,
  };
};

export function connectToReef(
  appDisplayName: string,
  options: {
    network?: nw.Network;
    ipfsHashResolverFn?: any;
    reefscanEventsConfig?: any;
  } = {}
) {
  const {
    network = getNetworkFallback(),
    ipfsHashResolverFn,
    reefscanEventsConfig,
  } = options;

  const state$ = new BehaviorSubject({
    loading: true,
    error: undefined,
    provider: undefined,
    network,
    signers: [],
    selectedReefSigner: undefined,
    reefState,
  });

  (async () => {
    // @ts-ignore
    const { accounts, extension, error } = await connectReefExtension(appDisplayName);
    if (error) {
      state$.next({ ...state$.value, error, loading: false });
      return;
    }

    const jsonAccounts = { accounts, injectedSigner: extension.signer };
    reefState.initReefState({
      network,
      jsonAccounts,
      ipfsHashResolverFn,
      reefscanEventsConfig,
    });

    // set stored selected address only once after init
    const storedAddress = getSelectedAddress();
    if (storedAddress) {
      reefState.setSelectedAddress(storedAddress);
    }

    combineLatest([
      reefState.accounts$,
      reefState.selectedProvider$,
      reefState.selectedAddress$,
    ])
      .pipe(distinctUntilChanged())
      // @ts-ignore
      .subscribe(async ([accounts, provider, selectedAddress]) => {
        if (!accounts?.length || !provider) return;

        const extensionAccounts = [reefAccountToReefSigner(accounts, extension.signer)];
        const signerPromises = extensionAccounts.flatMap(({ accounts, name, sig }) =>
          accounts.map(acc => accountToSigner(acc, provider, sig, name))
        );
        const signers = await Promise.all(signerPromises);

        // pick selected signer reactively
        let selected = signers[0];
        if (selectedAddress) {
          const match = signers.find(s => s.address === selectedAddress);
          if (match) {
            selected = match;
          }
        }

        state$.next({
          error: undefined,
          loading: false, //hardcoded rn @anukulpandey
          // @ts-ignore
          provider,
          network,
          // @ts-ignore
          signers,
          selectedReefSigner: selected,
          reefState,
        });
      });
  })();

  return state$.asObservable();
}
