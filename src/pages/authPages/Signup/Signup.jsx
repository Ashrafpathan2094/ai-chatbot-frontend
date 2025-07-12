import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Spinner from "../../../components/spinner/spinner";
import styles from "./Signup.module.scss"; // Import the CSS module

const SignupSchema = Yup.object().shape({
  userName: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setLoading(true);

      let aiResp = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/signup`,
        {
          ...values,
        }
      );
      localStorage.setItem("token", aiResp?.data?.token);
      localStorage.setItem("user", JSON.stringify(aiResp?.data?.user));
      alert("Signup successful! Data saved to localStorage.");
      resetForm();
      navigate("/chat");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <>
      {loading ? <Spinner /> : null}

      <div className={styles.container}>
        <h2 className={styles.heading}>Signup</h2>
        <Formik
          initialValues={{ userName: "", email: "", password: "" }}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form noValidate className="space-y-5">
              {/* Username */}
              <div>
                <label htmlFor="userName" className={styles.label}>
                  Username
                </label>
                <Field type="text" name="userName" className={styles.input} />
                <ErrorMessage
                  name="userName"
                  component="div"
                  className={styles.error}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <Field type="email" name="email" className={styles.input} />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={styles.error}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  className={styles.input}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className={styles.error}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.button}
              >
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Signup;
