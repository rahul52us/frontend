import * as yup from 'yup'

const testimonialValidation = yup.object({
 name : yup.string().min(2,'name should be atleast of 2 character').max(80,'name should not be greater than 80 character').trim().required('name is required').typeError('name is required'),
 profession : yup.string().min(1,'profession should be atleast of 1 character').max(160,'profession should not greater than 160 characters').trim().required('profession is required').typeError('profession is required'),
 description : yup.string().min(120,'description should be atleast of 120 character').max(1800,'description should not greater than 1800 characters').trim().required('description is required').typeError('description is required'),
})

export default testimonialValidation;
