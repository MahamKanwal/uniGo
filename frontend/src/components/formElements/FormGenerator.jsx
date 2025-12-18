import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { snakeCaseToTitle } from "../../utils/helperFunction";
import SelectElement from "./SelectElement";
import InputElement from "./InputElement";
import { useComponentContext } from "../../contexts/ComponentContext";
import ImageUploadElement from "./ImageUploadElement";

const FormGenerator = ({ fields, onSubmit, defaultValues }) => {
  const { toggleDrawer } = useComponentContext();

  const initialValues = Object.fromEntries(
    fields.map((f) => [f.name, defaultValues?.[f.name] || ""])
  );

  const validationSchema = Yup.object().shape(
    Object.fromEntries(
      fields.map((field) => {
        const fieldName = field.label || snakeCaseToTitle(field.name);
        let rule = Yup.string();
        if (field.required) rule = rule.required(`${fieldName} is required`);
        if (field.min)
          rule = rule.min(
            field.min,
            `${fieldName} must be at least ${field.min} characters`
          );
        if (field.pattern)
          rule = rule.matches(field.pattern, `${fieldName} is invalid`);
        return [field.name, rule];
      })
    )
  );

  const { handleBlur, handleChange, handleSubmit, errors, touched, values } =
    useFormik({
      initialValues,
      validationSchema,
      enableReinitialize: true,
      onSubmit: (values, { resetForm }) => {
        onSubmit(values), toggleDrawer();
        resetForm();
      },
    });

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {fields.map((field, index) => {
        const error =
          touched[field.name] && errors[field.name] ? errors[field.name] : "";
        const value = values[field.name];
        const sharedProps = {
          ...field,
          value,
          handleBlur,
          handleChange,
          error,
        };
  
        return field.type === "select" ? (
          <SelectElement key={index} {...sharedProps} />
        ) : field.type === "image" ? (
          <ImageUploadElement key={index} {...sharedProps} />
        ) : (
          <InputElement key={index} {...sharedProps} />
        );
      })}
      <div className="flex gap-2 justify-end border-t-2 border-gray-200 p-3">
        <button
          type="button"
          onClick={toggleDrawer}
          className="border px-5 py-1 rounded-lg"
        >
          Cancel
        </button>
        <button type="submit" className="border px-5 py-1 rounded-lg">
          Save
        </button>
      </div>
    </form>
  );
};

export default FormGenerator;
