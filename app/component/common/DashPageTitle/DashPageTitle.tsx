import { Heading, Stack, Text } from "@chakra-ui/react";

interface DashPageTitleI {
  title?: string;
  subTitle?: string;
}
const DashPageTitle = ({ title, subTitle }: DashPageTitleI) => {
  return (
    <Stack spacing={0} align={"center"} mb={5} mt={5} display={'none'}>
      <Heading>{title}</Heading>
      <Text textAlign={"center"}>{subTitle}</Text>
    </Stack>
  );
};

export default DashPageTitle;