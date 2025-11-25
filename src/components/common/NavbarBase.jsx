import React, { useEffect, useState } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";

const AUTH_USER_TABLE_ID = 999999;
const BASEROW_TOKEN = "YOUR_BASEROW_TOKEN";

function NavbarComponent() {
    const auth_user_id = localStorage.getItem("auth_user_id");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");

    useEffect(() => {
        if (!auth_user_id) return;

        const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `https://api.baserow.io/api/database/rows/table/${AUTH_USER_TABLE_ID}/${auth_user_id}/?user_field_names=true`,
            headers: {
                Authorization: `Token ${BASEROW_TOKEN}`,
            },
        };

        axios
            .request(config)
            .then((response) => {
                console.log("auth_user:", response.data);
                setFirstName(response.data?.first_name || "");
                setLastName(response.data?.last_name || "");
            })
            .catch((error) => {
                console.error(error);
            });
    }, [auth_user_id]);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return (
        <Navbar bg="primary" data-bs-theme="dark">
            <Container>
                <Navbar.Brand as={Link} to="/home">
                    ระบบบริหารจัดการ
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">
                            หน้าหลัก
                        </Nav.Link>
                        <Nav.Link as={Link} to="/customers">
                            ผู้รับผิดชอบ
                        </Nav.Link>
                        <NavDropdown title="รถที่ตรวจสอบยึด" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/products">
                                รถทั้งหมด
                            </NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link as={Link} to="/reports">
                            รายงานสถิติ
                        </Nav.Link>
                        <Nav.Link as={Link} to="/about">
                            เกี่ยวกับ
                        </Nav.Link>

                    </Nav>

                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            {auth_user_id ? (
                                <>
                                    Signed in as:{" "}
                                    <span className="me-2">
                                        {first_name} {last_name}
                                    </span>
                                    <span
                                        style={{ cursor: "pointer", textDecoration: "underline" }}
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </span>
                                </>
                            ) : (
                                <Nav.Link as={Link} to="/login">
                                    Login
                                </Nav.Link>
                            )}
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;
