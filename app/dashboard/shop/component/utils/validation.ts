// Validation Schema (unchanged)
import * as Yup from "yup";
import { GSTIN_REGEX, normalizeGstNumber } from "../../../../config/utils/gstValidation";

export const validationSchema = Yup.object({
  name: Yup.string().required("Name is required").trim(),
  companyCode: Yup.string()
    .required("Company Code is required")
    .uppercase("Must be uppercase")
    .min(2, "Min 2 characters")
    .max(10, "Max 10 characters")
    .matches(/^[A-Z0-9]+$/, "Alphanumeric only"),
  tags: Yup.array().of(Yup.string()).min(1, "Add at least one tag").required("Tags are required"),
  description: Yup.string().required("Description is required").trim(),
  about: Yup.string().required("Description is required").trim(),
  gstNumber: Yup.string()
    .transform((value) => normalizeGstNumber(value))
    .matches(GSTIN_REGEX, {
      message: "Enter a valid GST number",
      excludeEmptyString: true,
    })
    .optional(),
  logo: Yup.mixed(),
  coverImage: Yup.mixed(),
  location: Yup.object({
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    postalCode: Yup.string().required("Postal code is required"),
    country: Yup.string().required("Country is required"),
    coordinates: Yup.array()
      .of(Yup.number().required("Coordinate value is required"))
      .length(
        2,
        "Coordinates must contain exactly 2 values: [longitude, latitude]"
      )
      .required("Coordinates are required"),
  }),
  multipleLocations: Yup.array().of(
    Yup.object({
      address: Yup.string().required("Address is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      postalCode: Yup.string().required("Postal code is required"),
      country: Yup.string().required("Country is required"),
      coordinates: Yup.array()
        .of(Yup.number().required("Coordinate value is required"))
        .length(
          2,
          "Coordinates must contain exactly 2 values: [longitude, latitude]"
        )
        .required("Coordinates are required"),
    })
  ),
  gallery: Yup.array().of(Yup.mixed()),
  categories: Yup.array().of(Yup.string()),
  contactInfo: Yup.object({
    phone: Yup.string().required("Phone is required"),
    email: Yup.string().email("Invalid email format").optional(),
    website: Yup.string().url("Invalid website URL").optional(),
    socialMedia: Yup.object({
      facebook: Yup.string().url("Invalid URL").optional(),
      instagram: Yup.string().url("Invalid URL").optional(),
      twitter: Yup.string().url("Invalid URL").optional(),
      linkedin: Yup.string().url("Invalid URL").optional(),
      youtube: Yup.string().url("Invalid URL").optional(),
    }).optional(),
  }),
  operatingHours: Yup.array().of(
    Yup.object({
      day: Yup.string().required("Day is required"),
      open: Yup.string()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Use HH:mm format")
        .optional(),
      close: Yup.string()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Use HH:mm format")
        .optional(),
    })
  ),
  closedDates: Yup.array()
    .of(
      Yup.string().matches(
        /^\d{4}-\d{2}-\d{2}$/,
        "Invalid date format (YYYY-MM-DD)"
      )
    )
    .optional(),
});
