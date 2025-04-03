import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CAlert,
} from "@coreui/react";
import FormField from "./FormField";
import { useNavigate } from "react-router-dom";

// Hàm tạo slug từ name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/[^a-z0-9-]/g, ""); // Loại bỏ ký tự đặc biệt
};

// Validation Schema
const validationSchema = Yup.object({
  name: Yup.string().required("Tên danh mục là bắt buộc"),
  slug: Yup.string()
    .matches(/^[a-z0-9-]+$/, "Slug chỉ được chứa chữ thường, số và dấu gạch ngang")
    .required("Slug là bắt buộc"),
});

const AddCategory = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const formik = useFormik({
    initialValues: {
      name: "",
      slug: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      const categoryData = {
        ...values,
        created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
        updated_at: new Date().toISOString().slice(0, 19).replace("T", " "),
      };

      try {
        await axios.post("http://localhost:3000/api/categories", categoryData);
        setSuccessMessage("Danh mục đã được thêm thành công!");

        setTimeout(() => {
          resetForm();
          navigate("/admin/categories");
        }, 2000);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <CRow className="d-flex justify-content-center align-items-center min-vh-100">
      <CCol xs={12} md={8} lg={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2 className="fw-bold text-primary ">Thêm Danh Mục</h2>
          </CCardHeader>
          <CCardBody>
            {successMessage && <CAlert color="success">{successMessage}</CAlert>}
            {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
            <form onSubmit={formik.handleSubmit}>
              <FormField
                id="name"
                label="Tên danh mục"
                type="text"
                value={formik.values.name}
                onChange={(e) => {
                  formik.setFieldValue("name", e.target.value);
                  if (!formik.touched.slug) {
                    formik.setFieldValue("slug", generateSlug(e.target.value));
                  }
                }}
                onBlur={formik.handleBlur}
                error={formik.errors.name && formik.touched.name ? formik.errors.name : ""}
              />
              <FormField
                id="slug"
                label="Slug"
                type="text"
                value={formik.values.slug}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.slug && formik.touched.slug ? formik.errors.slug : ""}
              />
              <CButton type="submit" color="black" disabled={loading}>
                {loading ? <CSpinner size="sm" /> : "Thêm danh mục"}
              </CButton>
            </form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default AddCategory;
