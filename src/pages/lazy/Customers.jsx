import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Card,
    Table,
    Image,
    Button,
    Modal,
    Form,
    ButtonGroup,
} from "react-bootstrap";

const CUSTOMERS_LIST_URL =
    "https://api.baserow.io/api/database/rows/table/709215/?user_field_names=true";
const CUSTOMERS_ROW_URL =
    "https://api.baserow.io/api/database/rows/table/XXX";

const BASEROW_TOKEN = "GYLRTMZegxLLeQ85qKkxFAJxhAZ1OFgA";

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [customer, setCustomer] = useState({
        id: 0,
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        avartar: "",
        birthday: "",
        address: "",
    });

    const handleInputChange = (field, value) => {
        setCustomer((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const resetCustomerForm = () => {
        setCustomer({
            id: 0,
            first_name: "",
            last_name: "",
            phone: "",
            email: "",
            avartar: "",
            birthday: "",
            address: "",
        });
    };

    function listCustomers() {
        setLoading(true);
        setError(null);

        const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: CUSTOMERS_LIST_URL,
            headers: {
                Authorization: `Token ${BASEROW_TOKEN}`,
            },
        };

        axios
            .request(config)
            .then((response) => {
                setCustomers(response.data.results || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("เกิดข้อผิดพลาดในการโหลดผู้รับผิดชอบ");
                setLoading(false);
            });
    }

    useEffect(() => {
        listCustomers();
    }, []);

    const handleEdit = (selectedCustomer) => {
        setCustomer({
            id: selectedCustomer.id,
            first_name: selectedCustomer.first_name || "",
            last_name: selectedCustomer.last_name || "",
            phone: selectedCustomer.phone || "",
            email: selectedCustomer.email || "",
            avartar: selectedCustomer.avartar || "",
            birthday: selectedCustomer.birthday || "",
            address: selectedCustomer.address || "",
        });
        setShow(true);
    };

    function createCustomers() {
        if (
            customer.first_name.length <= 0 ||
            customer.last_name.length <= 0
        ) {
            alert("กรุณากรอกชื่อและนามสกุล");
            return false;
        }

        const data = {
            first_name: customer.first_name,
            last_name: customer.last_name,
            phone: customer.phone,
            email: customer.email,
            avartar: customer.avartar,
            birthday: customer.birthday,
            address: customer.address,
        };

        const config = {
            method: "post",
            maxBodyLength: Infinity,
            url: CUSTOMERS_LIST_URL,
            headers: {
                Authorization: `Token ${BASEROW_TOKEN}`,
            },
            data: data,
        };

        axios
            .request(config)
            .then(() => {
                setShow(false);
                listCustomers();
                resetCustomerForm();
            })
            .catch((error) => {
                console.error(error);
                setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
            });
    }

    function updateCustomers(row_id) {
        if (
            customer.first_name.length <= 0 ||
            customer.last_name.length <= 0
        ) {
            alert("กรุณากรอกชื่อและนามสกุล");
            return false;
        }

        const data = {
            first_name: customer.first_name,
            last_name: customer.last_name,
            phone: customer.phone,
            email: customer.email,
            avartar: customer.avartar,
            birthday: customer.birthday,
            address: customer.address,
        };

        const config = {
            method: "patch",
            maxBodyLength: Infinity,
            url: `${CUSTOMERS_ROW_URL}/${row_id}/?user_field_names=true`,
            headers: {
                Authorization: `Token ${BASEROW_TOKEN}`,
            },
            data: data,
        };

        axios
            .request(config)
            .then(() => {
                setShow(false);
                listCustomers();
                resetCustomerForm();
            })
            .catch((error) => {
                console.error(error);
                setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
            });
    }

    function deleteCustomers(row_id, firstName) {
        const confirmDelete = window.confirm(
            `คุณต้องการลบข้อมูลของ ${firstName} ใช่หรือไม่?`
        );
        if (!confirmDelete) {
            return false;
        }

        const config = {
            method: "delete",
            maxBodyLength: Infinity,
            url: `${CUSTOMERS_ROW_URL}/${row_id}/`,
            headers: {
                Authorization: `Token ${BASEROW_TOKEN}`,
            },
        };

        axios
            .request(config)
            .then(() => {
                listCustomers();
                resetCustomerForm();
            })
            .catch((error) => {
                console.error(error);
                setError("เกิดข้อผิดพลาดในการลบข้อมูล");
            });
    }

    const handleSave = () => {
        if (customer?.id > 0) {
            updateCustomers(customer.id);
        } else {
            createCustomers();
        }
    };

    return (
        <Card>
            <Card.Body>
                <div className="d-flex justify-content-between mb-3">
                    <h4>ผู้รับผิดชอบ</h4>
                    <Button
                        variant="primary"
                        onClick={() => {
                            resetCustomerForm();
                            handleShow();
                        }}
                    >
                        เพิ่มข้อมูล
                    </Button>
                </div>

                {loading ? (
                    <p>กำลังโหลดข้อมูล...</p>
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>รูปภาพ</th>
                                <th>ชื่อ - นามสกุล</th>
                                <th>เบอร์โทร</th>
                                <th>อีเมล</th>
                                <th>วันเกิด</th>
                                <th>ที่อยู่</th>
                                <th>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((c, index) => (
                                <tr key={c.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        {c.avartar ? (
                                            <Image
                                                src={c.avartar}
                                                alt={c.first_name}
                                                roundedCircle
                                                width={48}
                                                height={48}
                                            />
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td>
                                        {c.first_name} {c.last_name}
                                    </td>
                                    <td>{c.phone}</td>
                                    <td>{c.email}</td>
                                    <td>{c.birthday}</td>
                                    <td>{c.address}</td>
                                    <td>
                                        <ButtonGroup>
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                onClick={() => handleEdit(c)}
                                            >
                                                แก้ไข
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() =>
                                                    deleteCustomers(c.id, c.first_name)
                                                }
                                            >
                                                ลบ
                                            </Button>
                                        </ButtonGroup>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>ฟอร์มผู้รับผิดชอบ</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>ชื่อ</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="ชื่อ"
                                value={customer.first_name}
                                onChange={(e) =>
                                    handleInputChange("first_name", e.target.value)
                                }
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>นามสกุล</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="นามสกุล"
                                value={customer.last_name}
                                onChange={(e) =>
                                    handleInputChange("last_name", e.target.value)
                                }
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>เบอร์โทร</Form.Label>
                            <Form.Control
                                type="tel"
                                value={customer.phone}
                                onChange={(e) =>
                                    handleInputChange("phone", e.target.value)
                                }
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>อีเมล</Form.Label>
                            <Form.Control
                                type="email"
                                value={customer.email}
                                onChange={(e) =>
                                    handleInputChange("email", e.target.value)
                                }
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>ลิงก์รูปภาพ (URL)</Form.Label>
                            <Form.Control
                                type="url"
                                value={customer.avartar}
                                onChange={(e) =>
                                    handleInputChange("avartar", e.target.value)
                                }
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>วันเกิด</Form.Label>
                            <Form.Control
                                type="date"
                                value={customer.birthday}
                                onChange={(e) =>
                                    handleInputChange("birthday", e.target.value)
                                }
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>ที่อยู่</Form.Label>
                            <Form.Control
                                type="text"
                                value={customer.address}
                                onChange={(e) =>
                                    handleInputChange("address", e.target.value)
                                }
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            ปิด
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            บันทึก
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Card.Body>
        </Card>
    );
}
