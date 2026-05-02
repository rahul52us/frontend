import { Flex, Heading, Tbody, Td, Tr, useColorModeValue } from "@chakra-ui/react";
import SpinnerLoader from "../../../common/Loader/SpinnerLoader";
import { dashboardPalette } from "../../../../layouts/dashboardLayout/dashboardPalette";

interface TableLoaderProps {
  loader: boolean;
  show: number;
  children?: React.ReactNode;
  variant?: "default" | "merchant";
}

const TableLoader: React.FC<TableLoaderProps> = ({
  loader,
  show,
  children,
  variant = "default",
}) => {
  const isMerchant = variant === "merchant";
  const cTextMuted = useColorModeValue("gray.500", dashboardPalette.textMuted);

  if (loader) {
    return (
      <Tbody>
        <Tr>
          <Td colSpan={10} p={5}>
            <Flex justifyContent="center">
              <SpinnerLoader size="lg"/>
            </Flex>
          </Td>
        </Tr>
      </Tbody>
    );
  }

  if (show === 0) {
    return (
      <Tbody>
        <Tr>
          <Td colSpan={10} p={5}>
            <Flex justifyContent="center">
              <Heading
                fontSize="sm"
                color={isMerchant ? cTextMuted : "red.400"}
                cursor="pointer"
                fontWeight={isMerchant ? "medium" : undefined}
              >
                No Related Data are Found
              </Heading>
            </Flex>
          </Td>
        </Tr>
      </Tbody>
    );
  }
  return <>{children}</>;
};

export default TableLoader;
