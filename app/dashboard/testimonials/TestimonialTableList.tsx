import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Box,
  Tooltip,
} from "@chakra-ui/react";
import "./table.css";
import stores from "../../store/stores";
import Pagination from "../../component/common/pagination/Pagination";

const TestimonialList = observer(() => {
  const {
    testimonialStore: { getTestimonials, testimonials },
    auth: { openNotification },
  } = stores;

  useEffect(() => {
    alert("thisis i")
      getTestimonials({ page: 1 })
        .then(() => {})
        .catch((err) => {
          openNotification({
            title: "Failed to get testimonial",
            message: err.message,
            type: "error",
          });
        });
  }, [getTestimonials, openNotification]);

  return (
    <>
      <Box
        position="relative"
        overflow="auto"
        className="customScrollBar"
        h={"72vh"}
      >
        <Table className="customTable" variant="striped" size="sm">
          <Thead
            bg={"whiteAlpha.900"}
            stroke={"whiteAlpha.500"}
            bgColor={"red.100"}
            h={10}
          >
            <Tr>
              <Th textAlign="center">S.No.</Th>
              <Th textAlign="center">Image</Th>
              <Th textAlign="center">Name</Th>
              <Th textAlign="center">Description</Th>
              <Th textAlign="center">Profession</Th>
            </Tr>
          </Thead>
          <Tbody>
            {testimonials.data.map((testimonial: any, index: number) => {
              return (
                <Tr key={testimonial.id} p={1}>
                  <Td p={1} textAlign="center">{index + 1}.</Td>
                  <Td p={1} textAlign="center">
                    <Avatar src={testimonial.image} size={"sm"} />
                  </Td>
                  <Td p={1} minW="min-content" textAlign="center">
                    {testimonial.name}
                  </Td>
                  <Td p={1} minW="min-content" textAlign="center" cursor="pointer">
                    <Tooltip
                      label={testimonial.description}
                      hasArrow
                      textAlign={"center"}
                    >
                      {testimonial.description?.slice(0, 50)}
                    </Tooltip>
                  </Td>
                  <Td p={1} minW="min-content" textAlign="center">
                    {testimonial.profession}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
      <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />
    </>
  );
});

export default TestimonialList;