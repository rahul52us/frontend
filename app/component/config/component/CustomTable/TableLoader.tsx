import { Flex, Heading, Tbody, Td, Tr } from "@chakra-ui/react";
import SpinnerLoader from "../../../common/Loader/SpinnerLoader";

interface TableLoaderProps {
  loader: boolean;
  show: number;
  children?: React.ReactNode;
}

const TableLoader: React.FC<TableLoaderProps> = ({
  loader,
  show,
  children,
}) => {
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
              <Heading fontSize="sm" color="red.400" cursor="pointer">
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
