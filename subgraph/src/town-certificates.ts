import {
  Transfer as TransferEvent,
  TownCertificates as TownCertificatesContract
} from "../generated/TownCertificates/TownCertificates"

import {
  Mint
} from "../generated/schema"

export function handleMinted(event: TransferEvent): void {
  let mint = Mint.load(event.transaction.hash.toHex())
  if (!mint) {
    mint = new Mint(event.transaction.hash.toHex())
  }

  mint.tx = event.transaction.hash.toHex()
  mint.owner = event.params.to.toHexString().toLowerCase()
  mint.nftId = event.params.tokenId.toString()
  mint.save()
}