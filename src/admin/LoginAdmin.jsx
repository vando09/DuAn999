import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/apiRequestAdmin";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const LoginAdmin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState(null);

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Email không hợp lệ")
            .required("Vui lòng nhập email"),
        password: Yup.string()
            .min(6, "Mật khẩu ít nhất 6 ký tự")
            .required("Vui lòng nhập mật khẩu"),
    });

    const handleLogin = async (values, { setSubmitting }) => {
        setSubmitting(true);
        setLoginError(null);
    
        try {
            const response = await loginUser(values, dispatch, navigate);
            console.log("Login Response:", response);
    
            if (response?.error) {
                setLoginError(response.error);
                return;
            }
    
            navigate("/admin"); // Chỉ chạy nếu là admin
        } catch (error) {
            setLoginError("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };
    
    

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow" style={{ width: "400px" }}>
                <h2 className="text-center mb-4">Đăng nhập Admin</h2>
                {loginError && <div className="alert alert-danger">{loginError}</div>}
                <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleLogin}
                >
                    {({ isSubmitting }) => (
                        <Form>
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
                            <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                                {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default LoginAdmin;
