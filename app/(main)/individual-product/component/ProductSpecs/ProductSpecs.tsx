import { Box, Grid, GridItem, Heading } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

const ProductSpecs = ({ specs ,title}) => {
  return (
    <Box p={6} borderWidth={1} rounded={'2xl'} mt={6}>
      <Heading size={'md'}>{title}</Heading>
      <Grid templateColumns={'1fr 1.25fr'} mt={6} gap={4}>
        {specs.map((item, index) => (
          <>
            <GridItem key={`label-${index}`} fontSize={'sm'} color={'gray.500'}>
              {item.label}
            </GridItem>
            <GridItem key={`value-${index}`} fontWeight={500} color={'gray.700'} fontSize={'sm'}>
              {item.value}
            </GridItem>
          </>
        ))}
      </Grid>
    </Box>
  );
};

export default observer(ProductSpecs);