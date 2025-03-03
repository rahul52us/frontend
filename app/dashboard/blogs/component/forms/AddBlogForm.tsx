'use client'
import { Box } from "@chakra-ui/react";
import BlogForm from "./BlogForm";
import { useState } from "react";
import stores from "../../../../store/stores";

const AddBlogForm = () => {
  const {
    BlogStore: { createBlog },
    auth: { openNotification },
  } = stores;
  const [loading, setLoading] = useState(false);

  const [initialValues, setInitialValues] = useState<any>({
    isPreviewMode: false,
    title: "",
    subTitle: "",
    content: "",
    tags: [] as string[],
    tagInput: "",
    isLoading: false,
    isPrivate: false,
    coverImage: {
      filename: null,
      type: null,
      buffer: null,
      isAdd : 0,
      isDeleted : 0
    },
  });

  const submitForm = (submitData: any) => {
    setLoading(true);
    createBlog(submitData)
      .then((data) => {
        openNotification({
          title: "CREATED SUCCESSFULLY",
          message: data.message,
        });
        setInitialValues({
          isPreviewMode: false,
          title: "",
          subTitle: "",
          content: "",
          tags: [],
          tagInput: "",
          isLoading: false,
          coverImage: {
            filename: null,
            buffer: null,
            type: null,
            isAdd : 0,
            isDeleted:0
          },
        });
      })
      .catch((err: any) => {
        openNotification({
          title: "CREATE FAILED",
          message: err.message,
          type: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Box>
      <BlogForm
        initialValues={initialValues}
        submitForm={submitForm}
        loading={loading}
      />
    </Box>
  );
};

export default AddBlogForm;
