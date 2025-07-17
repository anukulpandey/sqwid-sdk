import * as rxjs from 'rxjs';
import { network, reefState } from '@reef-chain/util-lib';

declare function connectToReef(appDisplayName: string, options?: {
    network?: network.Network;
    ipfsHashResolverFn?: any;
    reefscanEventsConfig?: any;
}): rxjs.Observable<{
    loading: boolean;
    error: undefined;
    provider: undefined;
    network: network.Network;
    signers: never[];
    selectedReefSigner: undefined;
    reefState: typeof reefState;
}>;

declare const connectToSqwid: (account: any) => Promise<void>;

export { connectToReef, connectToSqwid };
