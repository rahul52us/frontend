import { Spinner } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

interface SpinnerLoaderI {
  size?: string;
}

const SpinnerLoader = observer(({ size = "xl" }: SpinnerLoaderI) => {
  return (
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size={size ? size : "2xl"}
    />
  );
});

export default SpinnerLoader;
