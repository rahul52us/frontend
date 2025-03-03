import { PhoneIcon } from '@chakra-ui/icons';
import { HStack, Icon, Stack, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

const ContactSection: React.FC<{ contactInfo: ContactInfo }> = ({ contactInfo }) => {
  return (
    <Stack align={'flex-start'} mt={4}>
      <Text fontWeight={'400'} fontSize={'lg'} mb={1}>
        Contact Us
      </Text>
      <VStack align="start" spacing={3} fontSize={'15px'}>
        <HStack>
          <PhoneIcon color={'#DF837C'} />
          <Text>{contactInfo.phone}</Text>
        </HStack>
        <HStack>
          <Icon as={MdEmail} mt={1} color={'#DF837C'} />
          <Text>{contactInfo.email}</Text>
        </HStack>
        <HStack align="flex-start">
          <Icon as={FaLocationDot} mt={1} color={'#DF837C'} />
          <Text w={'90%'}>{contactInfo.address}</Text>
        </HStack>
      </VStack>
    </Stack>
  );
};

export default ContactSection;
