'use client'
import {
  Avatar,
  Box,
  Button,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaPlus, FaTimes } from "react-icons/fa";
import { Form, Formik } from "formik";
import testimonialValidation from "../utils/validation";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import stores from "../../../store/stores";
import CustomInput from "../../../component/config/component/customInput/CustomInput";

interface TestimonialFormValues {
  name: string;
  profession: string;
  description: string;
  image?: any;
}

const TestimonialForm = observer(({ close }: any) => {
  const [showError, setShowError] = useState(false)
  const {
    testimonialStore: { createTestimonial },
    auth: { openNotification },
  } = stores;
  const flexDirection = useBreakpointValue<"row" | "column">({
    base: "column",
    md: "row",
  }) as "row" | "column";

  const [avatarUrl, setAvatarUrl] = useState("");
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result;
        if (typeof content === "string") {
          setAvatarUrl(content);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box>
      <Formik<TestimonialFormValues>
        initialValues={{ name: "", profession: "", description: "" }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          values.image = avatarUrl;
          createTestimonial(values)
            .then((data) => {
              openNotification({
                title: "Create Successfully",
                message: data?.message,
                type: "success",
              });
              resetForm()
              close()
            })
            .catch((err) => [
              openNotification({
                title: "Create Failed",
                message: err?.message,
                type: "error",
              }),
            ])
            .finally(() => {
              setSubmitting(false);
            });
        }}
        validationSchema={testimonialValidation}
      >
        {({ handleChange, values, errors , isSubmitting}) => {
          return (
            <Form>
              <Flex
                columnGap={8}
                alignItems="center"
                justifyContent="center"
                direction={flexDirection}
              >
                <label htmlFor="avatar-upload">
                  <Avatar
                    mt={2}
                    borderRadius={10}
                    src={avatarUrl || "avatar-image.jpg"}
                    style={{ width: "120px", height: "120px" }}
                    cursor="pointer"
                  />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: "none" }}
                  />
                </label>
                <Box w="100%" mt={-2}>
                  <CustomInput
                    name="name"
                    placeholder="Enter the Name"
                    label="Name"
                    onChange={handleChange}
                    value={values.name}
                    error={errors.name}
                    showError={showError}
                  />
                  <CustomInput
                    name="profession"
                    placeholder="Write Your Profession"
                    label="Profession"
                    onChange={handleChange}
                    value={values.profession}
                    error={errors.profession}
                    showError={showError}
                  />
                </Box>
              </Flex>
              <CustomInput
                name="description"
                placeholder="Description"
                label="Description"
                type="textarea"
                error={errors.description}
                onChange={handleChange}
                value={values.description}
                rows={4}
                showError={showError}
              />
              <Flex justifyContent="end" mt={5} mr={3} mb={2}>
                <Button leftIcon={<FaTimes />} mr={2} onClick={close}>
                  Cancel
                </Button>
                <Button type="submit" leftIcon={<FaPlus />} colorScheme="blue" isLoading={isSubmitting} onClick={() => setShowError(true)}>
                  Create
                </Button>
              </Flex>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
});

export default TestimonialForm;
