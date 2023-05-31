import NextLink from 'next/link'
import type { NextPage } from "next";
import { Button, Container, Flex, Heading, Image } from '@chakra-ui/react';
import { ConnectWallet, MediaRenderer, Web3Button, useAddress, useContract, useContractRead, useMetadata } from "@thirdweb-dev/react";
import { Icon, Box, SimpleGrid, Skeleton, Stack, Text, Link } from "@chakra-ui/react";
import { SiTwitter, SiDiscord, SiOpensea } from "react-icons/si";

const Home: NextPage = () => {
  const address = useAddress();
  const contractAddress = "0x49F9b9f5Fa365F207081996bB789Dd28985966DD";

  const { contract } = useContract(contractAddress);
  const { data: metadata, isLoading: isloadingMetadata } = useMetadata(contract);

  const { data: totalMinted, isLoading: isloadingTotalMinted } = useContractRead(contract, "totalMinted");

  return (
    <Container maxW={"1200px"}>
      <Flex h={"70vh"} alignItems={"center"} justifyContent={"center"}>
        <SimpleGrid columns={2} spacing={10} justifyItems={"center"}>
          <Box>
            <Skeleton isLoaded={!isloadingMetadata}>
              <MediaRenderer src={(metadata as { image: string })?.image} />
            </Skeleton>
            <Flex justify="center" mt={4}>
              <Link href="https://twitter.com" isExternal>
                <Icon
                  as={SiTwitter}
                  color="#200772"
                  aria-label="Twitter"
                  boxSize={8}
                  mx={2}
                />
              </Link>
              <Link href="https://discord.gg" isExternal>
                <Icon
                  as={SiDiscord}
                  color="#200772"
                  aria-label="Discord"
                  boxSize={8}
                  mx={2}
                />
              </Link>
              <Link href="https://opensea.io" isExternal>
                <Icon
                  as={SiOpensea}
                  color="#200772"
                  aria-label="OpenSea"
                  boxSize={8}
                  mx={2}
                />
              </Link>
            </Flex>
          </Box>
          <Flex direction={"column"} justifyContent={"center"}>
            <Stack direction={"column"} spacing={10}>
              <Skeleton isLoaded={!isloadingMetadata}>
                <Heading>{(metadata as { name: string })?.name}</Heading>
              </Skeleton>
              <Skeleton isLoaded={!isloadingMetadata}>
                <Text>{(metadata as { description?: string })?.description}</Text>
              </Skeleton>
              <Skeleton isLoaded={!isloadingTotalMinted}>
                <p>Total Minted:{totalMinted?.toNumber()}/37</p>
                <p>Price 0.01 MATIC</p>
              </Skeleton>
              {address ? (
                <Web3Button
                  contractAddress={contractAddress}
                  action={(contract) => contract.erc721.claim(1)}
                >
                  Claim
                </Web3Button>
              ) : (
                <Text>Please Connect</Text>
              )}
            </Stack>
          </Flex>
        </SimpleGrid>
      </Flex>
    </Container>
  );
};

export default Home;
