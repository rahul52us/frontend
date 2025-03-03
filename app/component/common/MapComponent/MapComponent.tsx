import { Box } from '@chakra-ui/react'

const MapComponent = () => {
  return (
    <Box
    w="100%"
    maxW="90%"
    h="360px"
    my={12}
    mx={'auto'}
    overflow="hidden"
    borderRadius="16px"
    boxShadow="sm"
  >
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.292458244059!2d77.37731397526865!3d28.56097938732673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce592e19046f1%3A0x599b3c70b26f832b!2sMetamind%20-%20Mental%20Health%20Clinic%20in%20Noida!5e0!3m2!1sen!2sin!4v1738610444446!5m2!1sen!2sin"
      width="100%"
      height="100%"
      loading="lazy"
      style={{ border: 0 }}
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </Box>
  )
}

export default MapComponent
