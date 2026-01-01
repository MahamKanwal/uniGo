import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputElement from "./InputElement";
import SelectElement from "./SelectElement";
import { useComponentContext } from "../../contexts/ComponentContext";
import { snakeCaseToTitle } from "../../utils/helperFunction";

const FormGenerator = ({ fields, onSubmit, defaultValues }) => {
  const { toggleDrawer } = useComponentContext();

  const initialValues = Object.fromEntries(
    fields.map((f) => [f.name, defaultValues?.[f.name] || ""])
  );

  const validationSchema = Yup.object(
    Object.fromEntries(
      fields.map((f) => [
        f.name,
        f.required
          ? Yup.string().required(`${snakeCaseToTitle(f.name)} is required`)
          : Yup.string(),
      ])
    )
  );

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values);
      toggleDrawer();
    },
  });
//   console.log("Form values:", values);
// console.log("Form errors:", errors);
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {fields.map((field, i) => {
        const commonProps = {
          ...field,
          value: values[field.name],
          handleChange,
          handleBlur,
          error: touched[field.name] && errors[field.name],
          formikHelpers: { setFieldValue },
        };

        return field.type === "select" ? (
          <SelectElement key={i} {...commonProps} />
        ) : (
          <InputElement key={i} {...commonProps} />
        );
      })}

      <div className="flex justify-end gap-2 pt-3 border-t">
        <button type="button" onClick={toggleDrawer}>
          Cancel
        </button>
        <button type="submit">Save</button>
      </div>
    </form>
  );
};

export default FormGenerator;
