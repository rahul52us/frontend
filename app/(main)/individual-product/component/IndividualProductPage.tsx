import { Box, Flex } from "@chakra-ui/react";
import ProductImageViewer from "../../../component/common/ProductImagesViewer/ProductImagesViewer";
import ProductDetailsSection from "./ProductDetailsSection/ProductDetailsSection";
import { observer } from "mobx-react-lite";

const IndividualProductPage = () => {
  return (
    <Box maxW={"75%"} mx={"auto"} my={4}>
      <Flex gap={6} align="flex-start">
        {/* Left Section - Sticky */}
        <Box position="sticky" top="9rem" alignSelf="flex-start">
          <ProductImageViewer
            images={["/images/heroImage.png", "/images/heroImage2.png","https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG1vZGVsfGVufDB8fDB8fHww"]}
          />
        </Box>

        {/* Right Section - Scrollable */}
        <Box flex={1}>
          <ProductDetailsSection />
        </Box>
      </Flex>
    </Box>
  );
};

export default observer(IndividualProductPage);
