import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import axios from "axios";

const AUTH_USER_TABLE_ID = 751781;
const USERNAME_FIELD_ID = 6344392;
const PASSWORD_FIELD_ID = 6344393;
const BASEROW_TOKEN = "GYLRTMZegxLLeQ85qKkxFAJxhAZ1OFgA";

export default function Login() {
    const [login, setLogin] = useState({
        user_name: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (field, value) => {
        setLogin((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const signIn = async () => {
        if (!login.user_name || !login.password) {
            alert("กรุณากรอก User name และ Password ให้ครบ");
            return;
        }

        setLoading(true);

        try {
            const url =
                `https://api.baserow.io/api/database/rows/table/${AUTH_USER_TABLE_ID}/?` +
                `user_field_names=false&` +
                `filter__field_${USERNAME_FIELD_ID}__equal=${encodeURIComponent(
                    login.user_name
                )}&` +
                `filter__field_${PASSWORD_FIELD_ID}__equal=${encodeURIComponent(
                    login.password
                )}`;

            const res = await axios.get(url, {
                headers: { Authorization: `Token ${BASEROW_TOKEN}` },
            });

            const results = res.data.results || [];
            if (results.length === 0) {
                alert("User หรือ Password ไม่ถูกต้อง");
                return;
            }

            const userRow = results[0];

            localStorage.setItem("auth_user_id", userRow.id);
            localStorage.setItem(
                "auth_user_name",
                userRow[`field_${USERNAME_FIELD_ID}`]
            );
            window.location.href = "/home";
        } catch (error) {
            console.error("Login error:", error);
            const msg =
                error?.response?.data?.detail ||
                error?.response?.data?.error ||
                error?.response?.statusText ||
                error.message ||
                "ไม่ทราบสาเหตุ";
            alert("ไม่สามารถเข้าสู่ระบบได้\nรายละเอียด: " + msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-center">
                <Card style={{ maxWidth: 480, width: "100%" }}>
                    <Card.Body>
                        <Card.Title className="mb-4 text-center">เข้าสู่ระบบ</Card.Title>

                        <Form>
                            <Form.Group className="mb-3" controlId="loginUserName">
                                <Form.Label>User name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="เช่น chakara"
                                    autoComplete="username"
                                    value={login.user_name}
                                    onChange={(e) =>
                                        handleInputChange("user_name", e.target.value)
                                    }
                                />
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="loginPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="กรอกรหัสผ่าน"
                                    autoComplete="current-password"
                                    value={login.password}
                                    onChange={(e) =>
                                        handleInputChange("password", e.target.value)
                                    }
                                />
                            </Form.Group>

                            <div className="d-grid">
                                <Button
                                    variant="primary"
                                    type="button"
                                    onClick={signIn}
                                    disabled={loading}
                                >
                                    {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}
