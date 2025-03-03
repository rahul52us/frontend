'use client'
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Container, Stack } from "@chakra-ui/react";
import stores from "../../store/stores";
import ArrowTestimonial from "../../component/common/ArrowTestimonial/ArrowTestimonial";

  const TestimonialList = observer(() => {
    const {
      testimonialStore: { getTestimonials, testimonials },
      auth: { openNotification },
    } = stores;

    useEffect(() => {
      if (!testimonials.hasFetch) {
        getTestimonials({ page: 1 })
          .then(() => {})
          .catch((err) => {
            openNotification({
              title: "Failed to get testimonial",
              message: err.message,
              type: "error",
            });
          });
      }
    }, [getTestimonials, openNotification, testimonials.hasFetch]);

    return (
      <Container maxW="7xl">
        <Stack
          display="flex"
          flexWrap={"wrap"}
          justifyContent={"center"}
          direction={{ base: "column", md: "row" }}
          spacing={{ base: 10, md: 4, lg: 12, sm: 12 }}
        >
          {testimonials.data.map((testimonial: any) => {
            return (
              <ArrowTestimonial
                key={testimonial.id}
                name={testimonial.name}
                description={testimonial.description}
                profession={testimonial.profession}
                image={testimonial.image}
              />
            );
          })}
        </Stack>
      </Container>
    );
  });

  export default TestimonialList;
