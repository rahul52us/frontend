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
  useBreakpointValue,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { observer } from "mobx-react-lite";
import stores from "../../../../store/stores";
import BottomSheetDrawer from "../../../../component/common/Drawer/BottomSheetDrawer";
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
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? false;

  const formValues = {
    name: initialValues?.name || "",
    offerId: initialValues?.offerId || "",
    type: initialValues?.type || "",
    description: initialValues?.description || "",
    isActive: initialValues ? initialValues.isActive : true,
    isDefault: initialValues ? initialValues.isDefault : false,
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    let payload = { ...values };
    if (!payload.offerId) {
      delete payload.offerId;
    }

    let res: any;
    if (initialValues) {
      const updateId = initialValues._id || initialValues.offerId;
      res = await offerStore.updateOffer(updateId, payload);
    } else {
      res = await offerStore.createOffer(payload);
    }

    if (res.status === "success") {
      toast({
        title: "Success",
        description: `Offer ${initialValues ? "updated" : "created"} successfully`,
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

  const formContent = (
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
                  <Input {...field} placeholder="e.g. Freebie Offer" borderRadius="14px" />
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
                    borderRadius="14px"
                  />
                  <FormErrorMessage>{form.errors.offerId}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Field name="type">
              {({ field, form }: any) => (
                <FormControl isInvalid={form.errors.type && form.touched.type} isRequired>
                  <FormLabel>Offer Type</FormLabel>
                  <Select {...field} placeholder="Select offer type" isDisabled={formValues.isDefault} borderRadius="14px">
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
                  <Textarea {...field} placeholder="Optional description" rows={3} borderRadius="14px" />
                </FormControl>
              )}
            </Field>

            <Field name="isActive">
              {({ field }: any) => (
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="isActive" mb="0">
                    Is Active?
                  </FormLabel>
                  <Switch id="isActive" {...field} isChecked={field.value} colorScheme="brand" />
                </FormControl>
              )}
            </Field>

            <Box pt={4}>
              <Button
                type="submit"
                colorScheme="brand"
                width="full"
                h="44px"
                borderRadius="full"
                fontWeight="700"
                isLoading={props.isSubmitting}
              >
                {initialValues ? "Update Offer" : "Add Offer"}
              </Button>
            </Box>
          </VStack>
        </Form>
      )}
    </Formik>
  );

  if (isMobile) {
    return (
      <BottomSheetDrawer
        isOpen={isOpen}
        onClose={onClose}
        title={initialValues ? "Edit Offer" : "Add New Offer"}
        size="full"
      >
        {formContent}
      </BottomSheetDrawer>
    );
  }

  return (
    <CustomDrawer
      title={initialValues ? "Edit Offer" : "Add New Offer"}
      open={isOpen}
      close={onClose}
      width="460px"
    >
      {formContent}
    </CustomDrawer>
  );
};

export default observer(OfferForm);
