import * as rxjs from 'rxjs';
import { network, reefState } from '@reef-chain/util-lib';
import { Provider, Signer } from '@reef-chain/evm-provider';

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

declare const fetchCollectionInfo: (id: string) => Promise<any>;

declare const STATS_ORDER: {
    readonly ITEMS: "items";
    readonly VOLUME: "volume";
    readonly ITEMS_SOLD: "itemsSold";
    readonly AVERAGE: "average";
};
type StatsOrder = (typeof STATS_ORDER)[keyof typeof STATS_ORDER];
declare const fetchCollectionsByStats: (order: StatsOrder) => Promise<any>;

declare function getUserCollections(evmAddress: string): Promise<any>;
declare const fetchUserItems: (address: string, state?: number, startFrom?: number) => Promise<any>;

declare const index$1_STATS_ORDER: typeof STATS_ORDER;
type index$1_StatsOrder = StatsOrder;
declare const index$1_fetchCollectionInfo: typeof fetchCollectionInfo;
declare const index$1_fetchCollectionsByStats: typeof fetchCollectionsByStats;
declare const index$1_fetchUserItems: typeof fetchUserItems;
declare const index$1_getUserCollections: typeof getUserCollections;
declare namespace index$1 {
  export { index$1_STATS_ORDER as STATS_ORDER, type index$1_StatsOrder as StatsOrder, index$1_fetchCollectionInfo as fetchCollectionInfo, index$1_fetchCollectionsByStats as fetchCollectionsByStats, index$1_fetchUserItems as fetchUserItems, index$1_getUserCollections as getUserCollections };
}

declare const createCollectible: (files: any, provider: Provider, signer: Signer) => Promise<any>;

declare const unlistPositionOnSale: (positionId: string, signer: Signer, provider: Provider) => Promise<any>;

declare const index_createCollectible: typeof createCollectible;
declare const index_unlistPositionOnSale: typeof unlistPositionOnSale;
declare namespace index {
  export { index_createCollectible as createCollectible, index_unlistPositionOnSale as unlistPositionOnSale };
}

export { connectToReef, connectToSqwid, index$1 as sqwidRead, index as sqwidWrite };
