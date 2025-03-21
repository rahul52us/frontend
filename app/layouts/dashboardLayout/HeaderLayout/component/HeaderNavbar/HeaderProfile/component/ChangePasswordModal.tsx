"use client";

import { Box, Button, Spinner, Flex, Stack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { Formik, Form } from "formik";
import * as yup from "yup";
import stores from "../../../../../../../store/stores";
import CustomInput from "../../../../../../../component/config/component/customInput/CustomInput";
import FormModel from "../../../../../../../component/common/FormModel/FormModel";
import { useState } from "react";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const schema = yup.object().shape({
  oldPassword: yup.string().required("Old password is required"),
  newPassword: yup.string().required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

const ChangePasswordModal = observer(({ isOpen, onClose }: ChangePasswordModalProps) => {
  const {
    auth: { changePassword, openNotification },
  } = stores;
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  return (
    <FormModel open={isOpen} close={onClose} title="Change Password" footer={false} isCentered>
      <Box p={6}>
        <Formik
          initialValues={{ oldPassword: "", newPassword: "", confirmPassword: "" }}
          validationSchema={schema}
          onSubmit={async (values, { resetForm }) => {
            setShowError(true);
            setIsLoading(true);
            try {
              const response: any = await changePassword({
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
              });

              openNotification({
                title: "Password Changed",
                message: response?.message ? `${response.message}!` : "Your password has been changed successfully!",
                type: "success",
                duration: 3000,
              });

              resetForm();
              onClose();
              setShowError(false);
            } catch (error: any) {
              openNotification({
                title: "Error",
                message: error?.message || "Failed to change password",
                type: "error",
              });
            } finally {
              setIsLoading(false);
            }
          }}
        >
          {({ values, errors, touched, handleChange }) => (
            <Form>
              <Stack spacing={5}>
                <CustomInput
                  label="Old Password"
                  type="password"
                  name="oldPassword"
                  placeholder="Enter old password"
                  value={values.oldPassword}
                  onChange={handleChange}
                  showError={showError}
                  error={touched.oldPassword && errors.oldPassword}
                />
                <CustomInput
                  label="New Password"
                  type="password"
                  name="newPassword"
                  placeholder="Enter new password"
                  value={values.newPassword}
                  onChange={handleChange}
                  showError={showError}
                  error={touched.newPassword && errors.newPassword}
                />
                <CustomInput
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  showError={showError}
                  error={touched.confirmPassword && errors.confirmPassword}
                />

                <Flex justify="flex-end">
                  <Button onClick={() => setShowError(true)} width="100%" colorScheme="teal" type="submit" isDisabled={isLoading}>
                    {isLoading ? <Spinner size="sm" color="white" /> : "Change Password"}
                  </Button>
                </Flex>
              </Stack>
            </Form>
          )}
        </Formik>
      </Box>
    </FormModel>
  );
});

export default ChangePasswordModal;
