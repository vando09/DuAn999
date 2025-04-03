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

const validationSchema = Yup.object({
  title: Yup.string().required("Tiêu đề là bắt buộc"),
  content: Yup.string().required("Nội dung là bắt buộc"),
  image: Yup.string().url("Đường dẫn ảnh không hợp lệ").required("Ảnh là bắt buộc"),
});

const FormControl = () => {
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
      title: "",
      content: "",
      image: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      const postData = {
        ...values,
        created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
        updated_at: new Date().toISOString().slice(0, 19).replace("T", " "),
      };

      try {
        await axios.post("http://localhost:3000/api/posts", postData);
        setSuccessMessage("Bài viết đã được thêm thành công!");
        setTimeout(() => {
          resetForm();
          navigate("/admin/posts");
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
            <h2 className="fw-bold text-primary">Thêm Bài Viết</h2>
          </CCardHeader>
          <CCardBody>
            {successMessage && <CAlert color="success">{successMessage}</CAlert>}
            {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
            <form onSubmit={formik.handleSubmit}>
              <FormField
                id="title"
                label="Tiêu đề"
                type="text"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && formik.errors.title ? formik.errors.title : ""}
              />
              <FormField
                id="content"
                label="Nội dung"
                type="text"
                value={formik.values.content}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.content && formik.errors.content ? formik.errors.content : ""}
              />
              <FormField
                id="image"
                label="Hình ảnh (URL)"
                type="text"
                value={formik.values.image}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.image && formik.errors.image ? formik.errors.image : ""}
              />
              <CButton type="submit" color="black" disabled={loading}>
                {loading ? <CSpinner size="sm" /> : "Thêm bài viết"}
              </CButton>
            </form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default FormControl;