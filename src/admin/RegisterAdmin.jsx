import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerAdmin } from "../redux/apiRequestAdmin";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const RegisterAdmin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [registerError, setRegisterError] = useState(null);

    const validationSchema = Yup.object().shape({
        username: Yup.string().required("Vui lòng nhập tên người dùng"),
        email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
        password: Yup.string().min(6, "Mật khẩu ít nhất 6 ký tự").required("Vui lòng nhập mật khẩu"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Mật khẩu xác nhận không khớp")
            .required("Vui lòng xác nhận mật khẩu"),
    });

    const handleRegister = async (values, { setSubmitting }) => {
        setSubmitting(true);
        setRegisterError(null);
        const adminData = { ...values, role: "admin" }; 
        try {
            const response = await registerAdmin(values, dispatch);
            console.log("Register Response:", response);

            if (response?.error) {
                setRegisterError(response.error);
                return;
            }

            navigate("/admin");
        } catch (error) {
            setRegisterError("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow" style={{ width: "400px" }}>
                <h2 className="text-center mb-4">Đăng ký Admin</h2>
                {registerError && <div className="alert alert-danger">{registerError}</div>}
                <Formik
                    initialValues={{ username: "", email: "", password: "", confirmPassword: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleRegister}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="mb-3">
                                <label className="form-label">Tên người dùng</label>
                                <Field type="text" name="username" className="form-control" />
                                <ErrorMessage name="username" component="div" className="text-danger" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <Field type="email" name="email" className="form-control" />
                                <ErrorMessage name="email" component="div" className="text-danger" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Mật khẩu</label>
                                <Field type="password" name="password" className="form-control" />
                                <ErrorMessage name="password" component="div" className="text-danger" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Xác nhận mật khẩu</label>
                                <Field type="password" name="confirmPassword" className="form-control" />
                                <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                            </div>
                            <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                                {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default RegisterAdmin;