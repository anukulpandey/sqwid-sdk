import { Provider, Signer } from "@reef-chain/evm-provider";
import { checkAndApproveMarketplace } from "./unlistPositionOnSale";
import contractABI from "./../../abi/SqwidERC1155";
import { ethers } from "ethers";
import { SQWID_ERC1155_ADDRESS } from "../../utils/constants";

export const burnCollectible = async (tokenId:string, amount:any,signer:Signer,provider:Provider) => {
	await checkAndApproveMarketplace(provider,signer);
	try {
		const address = JSON.parse(localStorage.getItem("auth")!)?.auth
			?.evmAddress;
		const collectibleContractInstance = new ethers.Contract(
            SQWID_ERC1155_ADDRESS,
            contractABI,
            signer
        );   
    
		const tx = await collectibleContractInstance.burn(
			address,
			tokenId,
			amount,
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