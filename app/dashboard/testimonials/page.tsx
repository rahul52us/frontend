"use client";
import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import TestimonialTableList from "./TestimonialTableList";
import DashPageHeader from "../../component/common/DashPageHeader/DashPageHeader";
import DashPageTitle from "../../component/common/DashPageTitle/DashPageTitle";
import FormModel from "../../component/common/FormModel/FormModel";
import stores from "../../store/stores";
import AddTestimonial from "./component/AddTestimonialForm";
import EditTestimonial from "./component/EditForm";

const Testimonial = observer(() => {
  const {
    testimonialStore: { setOpenTestimonialDrawer },
  } = stores;
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [openTestimonial, setOpenTestimonial] = useState(false);

  return (
    <Box>
      <Box display="none">
        <DashPageHeader
          btnAction={() => setOpenTestimonialDrawer()}
          breadcrumb={[]}
        />
      </Box>
      <DashPageTitle
        title="Our Testimonials"
        subTitle="What Other peoples thinks about your Organisations"
      />
      <Box>
        <TestimonialTableList
          onAdd={() => setOpenTestimonial(true)}
          onEdit={(testimonial: any) => {
            setSelectedTestimonial(testimonial);
            setIsEditing(true);
          }}
        />
      </Box>
      {/* CREATE THE NEW tESTIMONIAL */}
      <FormModel
        open={openTestimonial}
        close={() => setOpenTestimonial(false)}
        loading={false}
        title="Add Testimonial"
        isCentered={true}
      >
        <AddTestimonial close={() => setOpenTestimonial(false)} />
      </FormModel>
      {isEditing && selectedTestimonial && (
        <FormModel
          open={isEditing}
          close={() => setIsEditing(false)}
          title="Edit Testimonial"
          isCentered={true}
        >
          <EditTestimonial
            testimonial={selectedTestimonial}
            close={() => setIsEditing(false)}
          />
        </FormModel>
      )}
    </Box>
  );
});

export default Testimonial;
