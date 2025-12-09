import React, { useMemo, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Card, Form, Input, Button, Typography, Checkbox, Select, Row, Col, Space, InputNumber, DatePicker } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined, CarOutlined, PhoneOutlined, HomeOutlined, ContactsOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useLoginUserMutation, useRegisterUserMutation, } from "../../features/user/userApi";
import { useDispatch } from "react-redux";
import { getUser } from "../../features/user/userSlice";
const { Title, Text } = Typography;
const { Option } = Select;

const loginSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
  remember: Yup.boolean(),
});

const signupSchema = Yup.object({
  name: Yup.string().min(3).max(50).required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(8).max(128).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must have uppercase, lowercase & a number").required(),
  role: Yup.string().required(),
  gender: Yup.string(),
  rollNo: Yup.string().when("role", {
    is: "student",
    then: (s) => s.required(),
  }),
  department: Yup.string().when("role", {
    is: "student",
    then: (s) => s.required(),
  }),
  phoneNumber: Yup.string().matches(/^[0-9+\-\s]+$/).required().when("role", {
    is: "admin",
    then: (s) => s.notRequired(),
  }),
  guardianContact: Yup.string().matches(/^[0-9+\-\s]+$/).notRequired().when("role", {
    is: "student",
    then: (s) => s.required(),
  }),
  cnic: Yup.number().positive().integer().required().when("role", {
    is: "admin",
    then: (s) => s.notRequired(),
  }),
  dob: Yup.string().test("dob-valid-age", "Age must be between 16 and 60 years", (val) => {
    if (!val) return true;
    const dob = dayjs(val);
    const today = dayjs();
    const age = today.diff(dob, "year");
    return age >= 16 && age <= 60;
  }
  )
    .required()
    .when("role", {
      is: "admin",
      then: (s) => s.notRequired(),
    }),

  address: Yup.string().required().when("role", {
    is: "admin",
    then: (s) => s.notRequired(),
  }),
  licence: Yup.string().when("role", {
    is: "driver",
    then: (s) => s.required(),
  }),
  policeClearance: Yup.string().nullable(),

});

const AuthForm = () => {
  const dispatch = useDispatch();
  const { formName } = useParams();
  const isLogin = formName === "login";
  const navigate = useNavigate();

  const [registerUser, { isLoading: registerLoading }] = useRegisterUserMutation();
  const [loginUser, { isLoading: loginLoading }] = useLoginUserMutation();

  const initialValues = useMemo(() =>
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
      },
    [isLogin]
  );

  const validationSchema = useMemo(() => (isLogin ? loginSchema : signupSchema), [isLogin]);


  const onSubmit = async (values, { resetForm }) => {
    try {
      if (!isLogin) {
        if (values.dob) {
          const birth = dayjs(values.dob);
          const today = dayjs();
          let age = today.diff(birth, "year");
          if (today.isBefore(birth.add(age, "year"))) age--;
          values.age = age;
        }

        const userData = {
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
          gender: values.gender,
          ...(values.age !== undefined && { age: values.age, dob: values.dob }),
          ...(values.role === "student" && {
            rollNo: values.rollNo,
            department: values.department,
            phoneNumber: values.phoneNumber,
            guardianContact: values.guardianContact,
            cnic: values.cnic,
            address: values.address,
          }),
          ...(values.role === "driver" && {
            licence: values.licence,
            policeClearance: values.policeClearance,
            cnic: values.cnic,
            address: values.address,
          }),
        };

        const payload = await registerUser(userData).unwrap();
        dispatch(getUser(payload.user));
        toast.success(payload.message || "Registration successful!");
      } else {
        const payload = await loginUser({ email: values.email, password: values.password }).unwrap();
        dispatch(getUser(payload.user));
        toast.success(payload.message || "Login successful!");
      }
      resetForm();
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.data.error || "Authentication failed. Please try again.");
      console.error("Auth error:", err);
    }
  };


  const formik = useFormik({initialValues,validationSchema,onSubmit});

  const selectedRole = formik.values.role;

  useEffect(() => {
    formik.resetForm();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formName]);

  return (
    <div className="min-h-[85vh] bg-linear-to-br from-blue-50 to-purple-50 flex items-center justify-center p-2">
      <Card
        className="w-full max-w-lg shadow-xl rounded-xl border-0"
        style={{ padding: "1.5rem" }}
      >
        <div className="text-center mb-6">
          <Title level={3} >
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
                className=""
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

              <Row justify="space-between" align="middle" >
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

              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="name"
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
            </Space>
          )}

          <Form.Item >
            <Button
              type="primary"
              htmlType="submit"
              loading={isLogin ? loginLoading : registerLoading}
              block
              className="h-10 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 border-0 font-medium"
            >
              {isLogin ? "Login" : "Create Account"}
            </Button>
          </Form.Item>

          <div className="text-center">
            <NavLink to={isLogin ? "/signup" : "/login"}>
              <Text className="text-blue-600 font-medium">
                {isLogin ? "Create an account" : "Login to existing account"}
              </Text>
            </NavLink>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AuthForm;
