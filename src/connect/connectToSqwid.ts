import axios from "axios";
import { SQWID_BACKEND_URL } from "./../utils/constants";
import { stringToHex } from "@polkadot/util";
import type { Signer } from "@reef-chain/evm-provider";

export const connectToSqwid = async (account: any) => {
    try {
        let res = await axios.get(
            `${SQWID_BACKEND_URL}/nonce?address=${account.address}`
        );

        let { nonce } = res.data;

        const signer: Signer = account.signer;
        const signRaw = signer.signingKey.signRaw;
        const sres = await signRaw!({
            address: account.address,
            data: stringToHex(nonce),
            type: "bytes",
        });

        const { signature } = sres;
        res = await axios(`${SQWID_BACKEND_URL}/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify({
                address: account.address,
                signature: signature,
                evmAddress: await signer.getAddress(),
            }),
        });

        let json = res.data;

        if (json.status === "success") {
            localStorage.removeItem("collections");
            let jwts = localStorage.getItem("tokens");
            jwts = jwts ? JSON.parse(jwts) : [];

            let item = (jwts as any).find((jwt: any) => jwt.address === account.address);
            if (item) {
                item.token = json.token;
            } else {
                (jwts as any).push({
                    name: account.name,
                    address: account.address,
                    token: json.token,
                });
            }
            localStorage.setItem("tokens", JSON.stringify(jwts));
        }
    } catch (error) {
        console.log("error===", error);
    }
}