'use client'
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import TestimonialForm from "./component/TestimonialForm";
import { observer } from "mobx-react-lite";
import TestimonialList from "./TestimonialGridList";
import { FiPlusCircle } from "react-icons/fi";
import TestimonialTableList from "./TestimonialTableList";
import { RiRefreshLine } from "react-icons/ri";
import DashPageHeader from "../../component/common/DashPageHeader/DashPageHeader";
import DashPageTitle from "../../component/common/DashPageTitle/DashPageTitle";
import CustomInput from "../../component/config/component/customInput/CustomInput";
import CustomDrawer from "../../component/common/Drawer/CustomDrawer";
import FormModel from "../../component/common/FormModel/FormModel";
import stores from "../../store/stores";

const Testimonial = observer(() => {
  const {
    testimonialStore: {
      openTestimonialDrawer,
      setOpenTestimonialDrawer,
      testimonialLayout,
      setTestimonialLayout,
    },
  } = stores;
  const tableRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [openTestimonial, setOpenTestimonial] = useState(false);

  const toggleFullScreen = () => {
    if (tableRef.current) {
      if (!document.fullscreenElement) {
        tableRef.current
          .requestFullscreen()
          .then(() => setIsFullScreen(true))
          .catch(() => {
          });
      } else {
        document.exitFullscreen().then(() => setIsFullScreen(false));
      }
    }
  };

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
      <Box
        boxShadow="rgb(0 0 0 / 20%) 0px 0px 11px"
        bg="white"
        rounded={8}
        my={2}
      >
        <Box ref={tableRef}>
          <Flex
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            gap={4}
            p={2}
          >
            <Box>
              <CustomInput placeholder="Search" name="search" />
            </Box>
            <ButtonGroup>
              <IconButton
                aria-label=""
                icon={<RiRefreshLine />}
                title="refresh"
              />
              <IconButton
                aria-label=""
                icon={<FiPlusCircle />}
                title="Add New"
                onClick={() => setOpenTestimonial(true)}
              />
            </ButtonGroup>
          </Flex>
          <Box
            overflowX={isFullScreen ? "hidden" : "auto"}
            mt={isFullScreen ? "20px" : "0"}
          >
            {testimonialLayout === "grid" ? (
              <TestimonialList />
            ) : (
              <TestimonialTableList />
            )}
          </Box>
        </Box>
      </Box>
      {/* CREATE THE NEW tESTIMONIAL */}
      <FormModel
        open={openTestimonial}
        close={() => setOpenTestimonial(false)}
        loading={false}
        title="Add Testimonial"
        isCentered={true}
      >
        <TestimonialForm close={() => setOpenTestimonial(false)} />
      </FormModel>

      <CustomDrawer
        open={openTestimonialDrawer.open}
        close={setOpenTestimonialDrawer}
        title="Customize Testimonials"
      >
        <Button onClick={() => setOpenTestimonial(true)}>Add New</Button>
        <Button onClick={() => setTestimonialLayout()}>Change Layout</Button>
        <Button onClick={toggleFullScreen}>
          {document.fullscreenElement ? "Exit Fullscreen" : "Expand Table"}
        </Button>
      </CustomDrawer>
    </Box>
  );
});

export default Testimonial;