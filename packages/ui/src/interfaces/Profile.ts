import type { Signer } from "ethers";
import type { ZkIdentity as UnirepIdentity } from "@unirep/utils";
import type { ZkIdentity } from "@zk-kit/identity";

export interface Profile {
  signer?: Signer;
  address?: string;
  unirepIdentity?: UnirepIdentity;
  zkIdentity?: ZkIdentity;
  ecdsa?: {
    pub: string;
    priv: string;
  };
}
