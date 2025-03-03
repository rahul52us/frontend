"use client";

import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Icon,
  Text,
  useColorModeValue,
  useTheme,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Divider,
} from "@chakra-ui/react";
import Head from "next/head";
import { RiMenuLine } from "react-icons/ri";
import { AiOutlineTable, AiOutlineAppstore } from "react-icons/ai";

interface BreadcrumbItem {
  label: string;
  link?: string;
}

interface PageHeaderProps {
  title?: string;
  subTitle?: string;
  breadcrumb?: BreadcrumbItem[];
  btnAction?: any;
  selectedMode?: string;
  showMainTitle?: boolean;
  metaData?: any;
}

const DashPageHeader = observer(
  ({
    title,
    subTitle,
    breadcrumb,
    btnAction,
    selectedMode = "",
    showMainTitle = true,
    metaData = {},
  }: PageHeaderProps) => {
    const theme = useTheme();
    const headingColor = useColorModeValue(theme.colors.gray[800], theme.colors.gray[200]);
    const textColor = useColorModeValue(theme.colors.gray[600], theme.colors.gray[400]);

    const defaultFavicon = metaData?.faviconUrl || "/favicon.ico";
    const [favicon, setFavicon] = useState(defaultFavicon);

    useEffect(() => {
      if (typeof window !== "undefined") {
        let newFavicon = defaultFavicon;

        if (selectedMode === "table") {
          newFavicon = "/favicon-table.png";
        } else if (selectedMode === "grid") {
          newFavicon = "/favicon-grid.png";
        }

        setFavicon(newFavicon);
      }
    }, [selectedMode, defaultFavicon]);

    const isSelected = (mode: string) => mode === selectedMode;

    return (
      <>
        <Head>
          <title>
            {title ? `${showMainTitle ? `Edukatues | ` : ""}${title}` : metaData?.name}
          </title>
          <meta name="description" content={metaData?.description} />
          <meta name="keywords" content={metaData?.keywords} />
          <meta name="author" content={metaData?.author} />
          <link rel="canonical" href={metaData?.canonicalUrl} />
          <meta property="og:title" content={metaData?.ogTitle} />
          <meta property="og:description" content={metaData?.ogDescription} />
          <meta property="og:image" content={metaData?.ogImageUrl} />
          <link rel="icon" href={favicon} />
          <link rel="apple-touch-icon" href={favicon} />
        </Head>

        {showMainTitle && (
          <Flex justify="space-between" alignItems="center" mb={4} mr={{ base: 4, sm: 6 }}>
            <Box>
              {breadcrumb ? (
                <></>
                // <CustomBreadcrumb items={breadcrumb} />
              ) : (
                <>
                  <Heading fontSize="lg" color={headingColor} mb={2}>
                    {title}
                  </Heading>
                  <Text color={textColor} fontSize="sm">
                    {subTitle}
                  </Text>
                </>
              )}
            </Box>

            {btnAction && (
              <Popover placement="bottom-start">
                <PopoverTrigger>
                  <Flex alignItems="center" cursor="pointer">
                    <Icon as={RiMenuLine} fontSize="lg" color="gray.600" _hover={{ color: "gray.800" }} />
                  </Flex>
                </PopoverTrigger>
                <PopoverContent bg={useColorModeValue("white", "gray.800")} borderColor={useColorModeValue("gray.200", "gray.700")} boxShadow="lg" maxW="xs">
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader fontWeight="bold" fontSize="sm">
                    Select View
                  </PopoverHeader>
                  <PopoverBody>
                    <Flex alignItems="center" cursor="pointer" onClick={() => btnAction("table")} p={3} borderRadius="md" bg={isSelected("table") ? "blue.100" : "transparent"} _hover={{ bg: "blue.50" }}>
                      <Icon as={AiOutlineTable} color="blue.400" mr={2} />
                      <Text fontSize="sm">Table Mode</Text>
                    </Flex>
                    <Divider my={2} />
                    <Flex alignItems="center" cursor="pointer" onClick={() => btnAction("grid")} p={3} borderRadius="md" bg={isSelected("grid") ? "blue.100" : "transparent"} _hover={{ bg: "blue.50" }}>
                      <Icon as={AiOutlineAppstore} color="blue.400" mr={2} />
                      <Text fontSize="sm">Grid Mode</Text>
                    </Flex>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            )}
          </Flex>
        )}
      </>
    );
  }
);

export default DashPageHeader;
