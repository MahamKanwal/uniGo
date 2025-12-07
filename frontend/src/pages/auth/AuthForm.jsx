// src/components/auth/AuthForm.jsx
import React, { useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Checkbox,
  Select,
  Row,
  Col,
  Space,
  InputNumber,
  DatePicker,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  IdcardOutlined,
  CarOutlined,
  PhoneOutlined,
  HomeOutlined,
  ContactsOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "../../features/user/userApi";

const { Title, Text } = Typography;
const { Option } = Select;

/*
  Notes:
  - dob stored as "YYYY-MM-DD" string in formik values
  - DatePicker value uses dayjs(formik.values.dob)
  - Mutations are awaited with .unwrap() to get actual payload or throw the error
*/

const loginSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  remember: Yup.boolean(),
});

const signupSchema = Yup.object({
  name: Yup.string()
    .min(3, "Full Name must be at least 3 characters")
    .max(50)
    .required("Full Name is required"),
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(128)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must have uppercase, lowercase & a number"
    )
    .required("Password is required"),
  role: Yup.string()
    .oneOf(["student", "admin", "driver"])
    .required("Role is required"),
  gender: Yup.string().oneOf(["male", "female", "other"]),
  rollNo: Yup.string().when("role", {
    is: "student",
    then: (s) => s.required("Roll number is required"),
  }),
  department: Yup.string().when("role", {
    is: "student",
    then: (s) => s.required("Department is required"),
  }),
  phoneNumber: Yup.string()
    .matches(/^[0-9+\-\s]+$/, "Please enter a valid phone number")
    .nullable(),
  guardianContact: Yup.string()
    .matches(/^[0-9+\-\s]+$/, "Please enter a valid phone number")
    .nullable(),
  cnic: Yup.number()
    .typeError("CNIC must be a number")
    .positive()
    .integer()
    .nullable(),
  dob: Yup.string()
    .nullable()
    .test("dob-not-future", "Date of birth cannot be in the future", (val) => {
      if (!val) return true;
      return dayjs(val).isBefore(dayjs().add(1, "day"), "day");
    }),
  address: Yup.string().nullable(),
  licence: Yup.string().when("role", {
    is: "driver",
    then: (s) => s.required("License is required"),
  }),
  policeClearance: Yup.string().oneOf(["verified", "not verified"]).nullable(),
  terms: Yup.boolean().oneOf(
    [true],
    "You must accept the terms and conditions"
  ),
});

const AuthForm = () => {
  const { formName } = useParams();
  const isLogin = formName === "login";
  const isSignup = formName === "signup";
  const navigate = useNavigate();

  const [registerUser, { isLoading: registerLoading }] =
    useRegisterUserMutation();
  const [loginUser, { isLoading: loginLoading }] = useLoginUserMutation();

  const initialValues = useMemo(
    () =>
      isLogin
        ? { email: "", password: "", remember: false }
        : {
            name: "",
            email: "",
            password: "",
            role: "student",
            gender: "male",
            rollNo: "",
            department: "",
            phoneNumber: "",
            guardianContact: "",
            cnic: null,
            dob: null,
            address: "",
            licence: "",
            policeClearance: null,
            terms: false,
          },
    [isLogin]
  );

  const validationSchema = useMemo(
    () => (isLogin ? loginSchema : signupSchema),
    [isLogin]
  );

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (isSignup) {
          // compute age if dob present (dob stored as YYYY-MM-DD string)
          if (values.dob) {
            const birth = dayjs(values.dob, "YYYY-MM-DD");
            const today = dayjs();
            let age = today.year() - birth.year();
            if (today.isBefore(birth.add(age, "year"))) age--;
            // don't mutate values directly — create payload
            // but small local addition is okay
            values.age = age;
          }

          const userData = {
            name: values.name,
            email: values.email,
            password: values.password,
            role: values.role,
            // role-specific
            ...(values.role === "student" && {
              rollNo: values.rollNo,
              department: values.department,
              phoneNumber: values.phoneNumber,
              guardianContact: values.guardianContact,
              cnic: values.cnic,
              dob: values.dob,
              gender: values.gender,
              address: values.address,
            }),
            ...(values.role === "driver" && {
              licence: values.licence,
              policeClearance: values.policeClearance,
              cnic: values.cnic,
              address: values.address,
                dob: values.dob,
            }),
          };

          const payload = await registerUser(userData).unwrap();
          localStorage.setItem("token", payload.user.token);

          toast.success("Account created successfully!");
          resetForm();
          navigate("/login");
        } else if (isLogin) {
          const payload = await loginUser({
            email: values.email,
            password: values.password,
          }).unwrap();

          // payload may have user or data.user - handle both flexibly
          const user = payload?.user ?? payload?.data?.user ?? payload;
          toast.success("Login successful!");

          const role = user?.role ?? "student";
          if (role === "admin") navigate("/admin/dashboard");
          else if (role === "driver") navigate("/driver/dashboard");
          else if (role === "student") navigate("/student/dashboard");
          else navigate("/dashboard");
          localStorage.setItem("token", user.token);
        }
      } catch (err) {
        // show server error message if possible
        const msg =
          err?.data?.message ||
          err?.message ||
          "Something went wrong. Please try again.";
        toast.error(msg);
        console.error("Auth error:", err);
      }
    },
  });

  // derive selectedRole from formik value (no extra state)
  const selectedRole = formik.values.role;

  // reset form when route (login/signup) changes
  useEffect(() => {     
    formik.resetForm({ values: initialValues });
  }, [formName]);

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-2">
      <Card
        className="w-full max-w-lg shadow-xl rounded-xl border-0"
        style={{ padding: "1.5rem" }}
      >
        <div className="text-center mb-6">
          <Title level={3} className="!mb-2 !text-gray-800">
            {isLogin ? "Welcome Back" : "Create Account"}
          </Title>
          <Text type="secondary" className="text-sm">
            {isLogin
              ? "Enter your credentials to continue"
              : "Join thousands of users using UniGo"}
          </Text>
        </div>

        <Form layout="vertical" size="middle" onFinish={formik.handleSubmit}>
          {isLogin ? (
            <Space orientation="vertical" size="middle" className="w-full">
              <Form.Item
                validateStatus={
                  formik.touched.email && formik.errors.email ? "error" : ""
                }
                help={formik.touched.email && formik.errors.email}
                className="!mb-4"
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Email address"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="rounded-lg h-10"
                />
              </Form.Item>

              <Form.Item
                validateStatus={
                  formik.touched.password && formik.errors.password
                    ? "error"
                    : ""
                }
                help={formik.touched.password && formik.errors.password}
                className="!mb-2"
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Password"
                  name="password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="rounded-lg h-10"
                />
              </Form.Item>

              <Row justify="space-between" align="middle" className="!mb-4">
                <Col>
                  <Checkbox
                    name="remember"
                    checked={formik.values.remember}
                    onChange={formik.handleChange}
                  >
                    <Text className="text-sm">Remember me</Text>
                  </Checkbox>
                </Col>
                <Col>
                  <a href="/forgot-password" className="text-blue-600 text-sm">
                    Forgot password?
                  </a>
                </Col>
              </Row>
            </Space>
          ) : (
            <Space orientation="vertical" size="small" className="w-full">
              {/* Full name */}
              <Form.Item
                validateStatus={
                  formik.touched.name && formik.errors.name ? "error" : ""
                }
                help={formik.touched.name && formik.errors.name}
                className="!mb-3"
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Full Name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="rounded-lg h-10"
                />
              </Form.Item>

              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item
                    validateStatus={
                      formik.touched.email && formik.errors.email ? "error" : ""
                    }
                    help={formik.touched.email && formik.errors.email}
                    className="!mb-3"
                  >
                    <Input
                      prefix={<MailOutlined />}
                      placeholder="Email"
                      name="email"
                      type="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="rounded-lg h-10"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    validateStatus={
                      formik.touched.password && formik.errors.password
                        ? "error"
                        : ""
                    }
                    help={formik.touched.password && formik.errors.password}
                    className="!mb-3"
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Password ********"
                      name="password"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="rounded-lg h-10"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                validateStatus={
                  formik.touched.role && formik.errors.role ? "error" : ""
                }
                help={formik.touched.role && formik.errors.role}
                className="!mb-3"
              >
                <Select
                  placeholder="Role"
                  value={formik.values.role}
                  onChange={(val) => formik.setFieldValue("role", val)}
                  className="rounded-lg h-10"
                >
                  <Option value="student">Student</Option>
                  <Option value="driver">Driver</Option>
                  <Option value="admin">Admin</Option>
                </Select>
              </Form.Item>

              {/* Student fields */}
              {selectedRole === "student" && (
                <>
                  <Row gutter={12}>
                    <Col span={8}>
                      <Form.Item
                        validateStatus={
                          formik.touched.rollNo && formik.errors.rollNo
                            ? "error"
                            : ""
                        }
                        help={formik.touched.rollNo && formik.errors.rollNo}
                        className="!mb-3"
                      >
                        <Input
                          prefix={<IdcardOutlined />}
                          placeholder="Roll No"
                          name="rollNo"
                          value={formik.values.rollNo}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="rounded-lg h-10"
                        />
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item
                        validateStatus={
                          formik.touched.department && formik.errors.department
                            ? "error"
                            : ""
                        }
                        help={
                          formik.touched.department && formik.errors.department
                        }
                        className="!mb-3"
                      >
                        <Input
                          placeholder="Department"
                          name="department"
                          value={formik.values.department}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="rounded-lg h-10"
                        />
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item
                        validateStatus={
                          formik.touched.gender && formik.errors.gender
                            ? "error"
                            : ""
                        }
                        help={formik.touched.gender && formik.errors.gender}
                        className="!mb-3"
                      >
                        <Select
                          value={formik.values.gender}
                          onChange={(val) =>
                            formik.setFieldValue("gender", val)
                          }
                          className="rounded-lg h-10"
                        >
                          <Option value="male">Male</Option>
                          <Option value="female">Female</Option>
                          <Option value="other">Other</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={12}>
                    <Col span={12}>
                      <Form.Item
                        validateStatus={
                          formik.touched.phoneNumber &&
                          formik.errors.phoneNumber
                            ? "error"
                            : ""
                        }
                        help={
                          formik.touched.phoneNumber &&
                          formik.errors.phoneNumber
                        }
                        className="!mb-3"
                      >
                        <Input
                          prefix={<PhoneOutlined />}
                          placeholder="Phone Number"
                          name="phoneNumber"
                          value={formik.values.phoneNumber}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="rounded-lg h-10"
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        validateStatus={
                          formik.touched.guardianContact &&
                          formik.errors.guardianContact
                            ? "error"
                            : ""
                        }
                        help={
                          formik.touched.guardianContact &&
                          formik.errors.guardianContact
                        }
                        className="!mb-3"
                      >
                        <Input
                          prefix={<ContactsOutlined />}
                          placeholder="Guardian Contact"
                          name="guardianContact"
                          value={formik.values.guardianContact}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="rounded-lg h-10"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={12}>
                    <Col span={12}>
                      <Form.Item
                        validateStatus={
                          formik.touched.cnic && formik.errors.cnic
                            ? "error"
                            : ""
                        }
                        help={formik.touched.cnic && formik.errors.cnic}
                        className="!mb-3"
                      >
                        <InputNumber
                          addonBefore={<IdcardOutlined />}
                          placeholder="CNIC Number"
                          className="rounded-lg h-10"
                          style={{ width: "100%" }}
                          value={formik.values.cnic}
                          onChange={(val) => formik.setFieldValue("cnic", val)}
                          onBlur={() => formik.setFieldTouched("cnic", true)}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        validateStatus={
                          formik.touched.dob && formik.errors.dob ? "error" : ""
                        }
                        help={formik.touched.dob && formik.errors.dob}
                        className="!mb-3"
                      >
                        <DatePicker
                          placeholder="Date Of Birth"
                          className="rounded-lg w-full h-10"
                          format="DD-MM-YYYY"
                          value={
                            formik.values.dob
                              ? dayjs(formik.values.dob, "YYYY-MM-DD")
                              : null
                          }
                          onChange={(date) =>
                            formik.setFieldValue(
                              "dob",
                              date ? date.format("YYYY-MM-DD") : null
                            )
                          }
                          onBlur={() => formik.setFieldTouched("dob", true)}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    validateStatus={
                      formik.touched.address && formik.errors.address
                        ? "error"
                        : ""
                    }
                    help={formik.touched.address && formik.errors.address}
                    className="!mb-3"
                  >
                    <Input
                      prefix={<HomeOutlined />}
                      placeholder="Address"
                      name="address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="rounded-lg h-10"
                    />
                  </Form.Item>
                </>
              )}

              {/* Driver fields */}
              {selectedRole === "driver" && (
                <>
                  <Row gutter={12}>
                    <Col span={12}>
                      <Form.Item
                        validateStatus={
                          formik.touched.licence && formik.errors.licence
                            ? "error"
                            : ""
                        }
                        help={formik.touched.licence && formik.errors.licence}
                        className="!mb-3"
                      >
                        <Input
                          prefix={<CarOutlined />}
                          placeholder="License Number"
                          name="licence"
                          value={formik.values.licence}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="rounded-lg h-10"
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        validateStatus={
                          formik.touched.policeClearance &&
                          formik.errors.policeClearance
                            ? "error"
                            : ""
                        }
                        help={
                          formik.touched.policeClearance &&
                          formik.errors.policeClearance
                        }
                        className="!mb-3"
                      >
                        <Select
                          value={formik.values.policeClearance}
                          onChange={(val) =>
                            formik.setFieldValue("policeClearance", val)
                          }
                          className="rounded-lg h-10"
                          placeholder="Police Clearance"
                        >
                          <Option value="not verified">Not Verified</Option>
                          <Option value="verified">Verified</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={12}>
                    <Col span={12}>
                      <Form.Item
                        validateStatus={
                          formik.touched.cnic && formik.errors.cnic
                            ? "error"
                            : ""
                        }
                        help={formik.touched.cnic && formik.errors.cnic}
                        className="!mb-3"
                      >
                        <InputNumber
                          addonBefore={<IdcardOutlined />}
                          placeholder="CNIC Number"
                          className="rounded-lg h-10"
                          style={{ width: "100%" }}
                          value={formik.values.cnic}
                          onChange={(val) => formik.setFieldValue("cnic", val)}
                          onBlur={() => formik.setFieldTouched("cnic", true)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        validateStatus={
                          formik.touched.dob && formik.errors.dob ? "error" : ""
                        }
                        help={formik.touched.dob && formik.errors.dob}
                        className="!mb-3"
                      >
                        <DatePicker
                          placeholder="Date Of Birth"
                          className="rounded-lg w-full h-10"
                          format="DD-MM-YYYY"
                          value={
                            formik.values.dob
                              ? dayjs(formik.values.dob, "YYYY-MM-DD")
                              : null
                          }
                          onChange={(date) =>
                            formik.setFieldValue(
                              "dob",
                              date ? date.format("YYYY-MM-DD") : null
                            )
                          }
                          onBlur={() => formik.setFieldTouched("dob", true)}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item
                    validateStatus={
                      formik.touched.address && formik.errors.address
                        ? "error"
                        : ""
                    }
                    help={formik.touched.address && formik.errors.address}
                    className="!mb-3"
                  >
                    <Input
                      prefix={<HomeOutlined />}
                      placeholder="Address"
                      name="address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="rounded-lg h-10"
                    />
                  </Form.Item>
                </>
              )}

              {/* Terms */}
              <Form.Item
                validateStatus={
                  formik.touched.terms && formik.errors.terms ? "error" : ""
                }
                help={formik.touched.terms && formik.errors.terms}
                className="!mb-3"
              >
                <Checkbox
                  name="terms"
                  checked={formik.values.terms}
                  onChange={(e) =>
                    formik.setFieldValue("terms", e.target.checked)
                  }
                >
                  <Text className="text-sm">
                    I agree to the{" "}
                    <a href="/terms" className="text-blue-600">
                      Terms & Conditions
                    </a>
                  </Text>
                </Checkbox>
              </Form.Item>
            </Space>
          )}

          <Form.Item className="!mb-3">
            <Button
              type="primary"
              htmlType="submit"
              loading={isLogin ? loginLoading : registerLoading}
              block
              className="h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 border-0 font-medium"
            >
              {isLogin ? "Login" : "Create Account"}
            </Button>
          </Form.Item>

          <div className="text-center">
            <Button
              type="link"
              href={isLogin ? "/signup" : "/login"}
              className="!px-0"
            >
              <Text className="text-blue-600 font-medium">
                {isLogin ? "Create an account" : "Login to existing account"}
              </Text>
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AuthForm;
