import React from "react";
import { NFT as NFTType } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Web3Button, useContract, useCreateAuctionListing, useCreateDirectListing } from "@thirdweb-dev/react";
import { MARKETPLACE_ADDRESS, NFT_COLLECTION_ADDRESS } from "../const/addresses";
import { Box, Input, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";

type Props = {
    nft: NFTType;
};

type DirectFormData = {
    nftContractAddress: string;
    tokenId: string;
    price: string;
    startDate: Date;
    endDate: Date;
};

export default function SaleInfo({ nft }: Props) {
    const router = useRouter();
    const { contract: marketplace } = useContract(MARKETPLACE_ADDRESS, "marketplace-v3");

    const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);

    const { mutateAsync: createDirectListing } = useCreateDirectListing(marketplace);

    async function checkAndProvideApproval() {
        const hasApproval = await nftCollection?.call("isApprovedForAll", [nft.owner, MARKETPLACE_ADDRESS]);

        if (!hasApproval) {
            const txResult = await nftCollection?.call("setApprovalForAll", [MARKETPLACE_ADDRESS, true]);

            if (txResult) {
                console.log("Approval provided");
            }
        }

        return true;
    }

    const { register: registerDirect, handleSubmit: handleSubmitDirect } = useForm<DirectFormData>({
        defaultValues: {
            nftContractAddress: NFT_COLLECTION_ADDRESS,
            tokenId: nft.metadata.id,
            price: "0",
            startDate: new Date(),
            endDate: new Date(),
        },
    });

    async function handleSubmissionDirect(data: DirectFormData) {
        await checkAndProvideApproval();
        const txResult = await createDirectListing({
            assetContractAddress: data.nftContractAddress,
            tokenId: data.tokenId,
            pricePerToken: data.price,
            startTimestamp: new Date(data.startDate),
            endTimestamp: new Date(data.endDate),
        });

        return txResult;
    }

    return (
        <Stack spacing={8}>
            <Box>
                <Text fontWeight={"bold"} mb={2}>
                    Direct Listing:
                </Text>
                <Text>Listing starts on:</Text>
                <Input
                    placeholder="Select Date end Time"
                    size="md"
                    type="datetime-local"
                    {...registerDirect("startDate")}
                />
                <Text mt={2}>Listing ends on:</Text>
                <Input
                    placeholder="Select Date end Time"
                    size="md"
                    type="datetime-local"
                    {...registerDirect("endDate")}
                />
            </Box>
            <Box>
                <Text fontWeight={"bold"}>Price:</Text>
                <Input
                    placeholder="0"
                    size="md"
                    type="number"
                    {...registerDirect("price")}
                />
            </Box>
            <Web3Button
                contractAddress={MARKETPLACE_ADDRESS}
                action={async () => {
                    await handleSubmitDirect(handleSubmissionDirect) ();
                }}
                onSuccess={(txResult) => {
                    router.push(`/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`);
                }}
            >
                Sell
            </Web3Button>
        </Stack>
    ) 
}