import type { Provider, Signer } from "@reef-chain/evm-provider";
import { ethers } from "ethers";

import marketplaceContractABI from "./../../abi/SqwidMarketplace";
import {SQWID_MARKETPLACE_ADDRESS } from "./../../utils/constants";
import { approveMarketplace, isMarketplaceApproved } from "./createCollectible";


export const checkAndApproveMarketplace = async (provider:Provider,signer:Signer) => {
	const approved = await isMarketplaceApproved(provider,signer);
	if (!approved) {
		await approveMarketplace(signer);
	}
};

export const unlistPositionOnSale = async (positionId:string,signer:Signer,provider:Provider) => {
	await checkAndApproveMarketplace(provider,signer);
	try {
		const marketplaceContractInstance = new ethers.Contract(
            SQWID_MARKETPLACE_ADDRESS,
            marketplaceContractABI,
            signer
        );;
		const tx = await marketplaceContractInstance.unlistPositionOnSale(
			positionId,
			{
				customData: {
					storageLimit: 2000,
				},
			}
		);
		const receipt = await tx.wait();
		return receipt;
	} catch (error) {
		// console.error (error);
		return null;
	}
};