import React from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  FormErrorMessage,
  Textarea,
  Select,
  Switch,
  Box,
  useToast,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { observer } from "mobx-react-lite";
import stores from "../../../../store/stores";
import CustomDrawer from "../../../../component/common/Drawer/CustomDrawer";

interface OfferFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues: any;
}

const OfferValidationSchema = Yup.object().shape({
  name: Yup.string().required("Offer name is required"),
  type: Yup.string().required("Offer type is required"),
  offerId: Yup.string()
    .matches(/^[a-zA-Z0-9]*$/, {
      message: "Offer ID should be alphanumeric",
      excludeEmptyString: true,
    })
    .optional(),
});

const OfferForm: React.FC<OfferFormProps> = ({ isOpen, onClose, initialValues }) => {
  const { offerStore } = stores;
  const toast = useToast();

  const formValues = {
    name: initialValues?.name || "",
    offerId: initialValues?.offerId || "",
    type: initialValues?.type || "",
    description: initialValues?.description || "",
    isActive: initialValues?.isActive ?? true,
    isDefault: initialValues?.isDefault ?? false,
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    const payload = {
      name: values.name,
      offerId: values.offerId || undefined,
      type: values.type,
      description: values.description,
      isActive: values.isActive,
    };

    let res;
    if (initialValues?._id || initialValues?.offerId) {
      const id = initialValues?._id || initialValues?.offerId;
      res = await offerStore.updateOffer(id, payload);
    } else {
      res = await offerStore.createOffer(payload);
    }

    if (res.status === "success") {
      toast({
        title: initialValues?._id ? "Offer Updated" : "Offer Created",
        description: initialValues?._id
          ? "The offer has been successfully updated."
          : "The new offer has been successfully created.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      offerStore.getAllOffers({}, true);
    } else {
      toast({
        title: "Error",
        description: res.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setSubmitting(false);
  };

  return (
    <CustomDrawer
      title={initialValues ? "Edit Offer" : "Add New Offer"}
      open={isOpen}
      close={onClose}
      width="40vw"
    >
      <Formik
        initialValues={formValues}
        validationSchema={OfferValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(props: any) => (
          <Form>
            <VStack spacing={4} align="stretch">
              <Field name="name">
                {({ field, form }: any) => (
                  <FormControl isInvalid={form.errors.name && form.touched.name} isRequired>
                    <FormLabel>Offer Name</FormLabel>
                    <Input {...field} placeholder="e.g. Freebie Offer" />
                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="offerId">
                {({ field, form }: any) => (
                  <FormControl isInvalid={form.errors.offerId && form.touched.offerId}>
                    <FormLabel>Offer ID (optional)</FormLabel>
                    <Input
                      {...field}
                      placeholder="e.g. freebie1"
                      isDisabled={formValues.isDefault}
                    />
                    <FormErrorMessage>{form.errors.offerId}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="type">
                {({ field, form }: any) => (
                  <FormControl isInvalid={form.errors.type && form.touched.type} isRequired>
                    <FormLabel>Offer Type</FormLabel>
                    <Select {...field} placeholder="Select offer type" isDisabled={formValues.isDefault}>
                      <option value="discount">Discount</option>
                      <option value="buyXgetY">Buy X Get Y</option>
                      <option value="freebie">Freebie</option>
                    </Select>
                    <FormErrorMessage>{form.errors.type}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="description">
                {({ field }: any) => (
                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Textarea {...field} placeholder="Optional description" rows={3} />
                  </FormControl>
                )}
              </Field>

              <Field name="isActive">
                {({ field }: any) => (
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="isActive" mb="0">
                      Is Active?
                    </FormLabel>
                    <Switch id="isActive" {...field} isChecked={field.value} />
                  </FormControl>
                )}
              </Field>

              <Box pt={4}>
                <Button
                  type="submit"
                  colorScheme="blue"
                  width="full"
                  isLoading={props.isSubmitting}
                >
                  {initialValues ? "Update Offer" : "Add Offer"}
                </Button>
              </Box>
            </VStack>
          </Form>
        )}
      </Formik>
    </CustomDrawer>
  );
};

export default observer(OfferForm);
