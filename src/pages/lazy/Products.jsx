import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Card,
    Container,
    Button,
    Modal,
    Form,
    Row,
    Col,
} from "react-bootstrap";

const PRODUCTS_LIST_URL =
    "https://api.baserow.io/api/database/rows/table/751498/?user_field_names=true";
const PRODUCTS_ROW_URL =
    "https://api.baserow.io/api/database/rows/table/YYY";

const BASEROW_TOKEN = "GYLRTMZegxLLeQ85qKkxFAJxhAZ1OFgA";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [product, setProduct] = useState({
        id: 0,
        product_name: "",
        product_price: "",
        product_description: "",
        product_amount: 0,
        product_image: "",
        product_type: "shoe",
    });

    const handleInputChange = (field, value) => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            [field]: value,
        }));
    };

    const resetProductForm = () => {
        setProduct({
            id: 0,
            product_name: "",
            product_price: "",
            product_description: "",
            product_amount: 0,
            product_image: "",
            product_type: "shoe",
        });
    };

    function listProducts(filterType = "") {
        setLoading(true);
        setError(null);

        let url = PRODUCTS_LIST_URL;
        if (filterType) {
            url =
                PRODUCTS_LIST_URL +
                `&filter__product_type__equal=${encodeURIComponent(filterType)}`;
        }

        const config = {
            method: "get",
            maxBodyLength: Infinity,
            url,
            headers: {
                Authorization: `Token ${BASEROW_TOKEN}`,
            },
        };

        axios
            .request(config)
            .then((response) => {
                setProducts(response.data.results || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า");
                setLoading(false);
            });
    }

    useEffect(() => {
        listProducts();
    }, []);

    const handleEdit = (obj) => {
        setProduct({
            id: obj.id,
            product_name: obj.product_name || "",
            product_price: obj.product_price || 0,
            product_description: obj.product_description || "",
            product_amount: obj.product_amount || 0,
            product_image: obj.product_image || "",
            product_type: obj.product_type || "shoe",
        });
        setShow(true);
    };

    function createProducts() {
        if (product.product_name.length <= 0) {
            alert("กรุณากรอกชื่อสินค้า");
            return false;
        }

        const data = {
            product_name: product.product_name,
            product_price: product.product_price,
            product_description: product.product_description,
            product_amount: product.product_amount,
            product_image: product.product_image,
            product_type: product.product_type,
        };

        const config = {
            method: "post",
            maxBodyLength: Infinity,
            url: PRODUCTS_LIST_URL,
            headers: {
                Authorization: `Token ${BASEROW_TOKEN}`,
            },
            data,
        };

        axios
            .request(config)
            .then(() => {
                setShow(false);
                listProducts();
                resetProductForm();
            })
            .catch((error) => {
                console.error(error);
                setError("เกิดข้อผิดพลาดในการบันทึกข้อมูลสินค้า");
            });
    }

    function updateProducts(row_id) {
        if (product.product_name.length <= 0) {
            alert("กรุณากรอกชื่อสินค้า");
            return false;
        }

        const data = {
            product_name: product.product_name,
            product_price: product.product_price,
            product_description: product.product_description,
            product_amount: product.product_amount,
            product_image: product.product_image,
            product_type: product.product_type,
        };

        const config = {
            method: "patch",
            maxBodyLength: Infinity,
            url: `${PRODUCTS_ROW_URL}/${row_id}/?user_field_names=true`,
            headers: {
                Authorization: `Token ${BASEROW_TOKEN}`,
            },
            data,
        };

        axios
            .request(config)
            .then(() => {
                setShow(false);
                listProducts();
                resetProductForm();
            })
            .catch((error) => {
                console.error(error);
                setError("เกิดข้อผิดพลาดในการบันทึกข้อมูลสินค้า");
            });
    }

    function deleteProduct(row_id, name) {
        const confirmDelete = window.confirm(
            `คุณต้องการลบข้อมูลของ ${name} ใช่หรือไม่?`
        );
        if (!confirmDelete) {
            return false;
        }

        const config = {
            method: "delete",
            maxBodyLength: Infinity,
            url: `${PRODUCTS_ROW_URL}/${row_id}/`,
            headers: {
                Authorization: `Token ${BASEROW_TOKEN}`,
            },
        };

        axios
            .request(config)
            .then(() => {
                listProducts();
                resetProductForm();
            })
            .catch((error) => {
                console.error(error);
                setError("เกิดข้อผิดพลาดในการลบข้อมูลสินค้า");
            });
    }

    const handleSave = () => {
        if (product?.id > 0) {
            updateProducts(product.id);
        } else {
            createProducts();
        }
    };

    return (
        <Container className="mt-3">
            <Row className="mb-3">
                <Col>
                    <h2>รถที่ตรวจสอบยึด</h2>
                </Col>
                <Col className="text-end">
                    <Button
                        variant="primary"
                        onClick={() => {
                            resetProductForm();
                            handleShow();
                        }}
                    >
                        เพิ่มข้อมูล
                    </Button>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        className="me-2"
                        onClick={() => listProducts("")}
                    >
                        รถทั้งหมด
                    </Button>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        className="me-2"
                        onClick={() => listProducts("shoe")}
                    >
                        เฉพาะรถใหม่
                    </Button>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => listProducts("bag")}
                    >
                        เฉพาะรถมือสอง
                    </Button>
                </Col>
            </Row>

            {loading ? (
                <p>กำลังโหลดข้อมูล...</p>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <Row>
                    {products.map((rs) => (
                        <Col sm={3} className="mb-3" key={rs.id}>
                            <Card>
                                <Card.Img
                                    variant="top"
                                    src={rs.product_image}
                                    style={{ height: 250, objectFit: "cover" }}
                                />
                                <Card.Body>
                                    <Card.Title>{rs.product_name}</Card.Title>
                                    <Card.Text>
                                        <div>ราคา {rs.product_price}</div>
                                        <div>จำนวน {rs.product_amount}</div>
                                    </Card.Text>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        onClick={() => handleEdit(rs)}
                                    >
                                        แก้ไข
                                    </Button>{" "}
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() =>
                                            deleteProduct(rs.id, rs.product_name)
                                        }
                                    >
                                        ลบ
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>ฟอร์มข้อมูลสินค้า</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>ชื่อสินค้า</Form.Label>
                        <Form.Control
                            type="text"
                            value={product.product_name}
                            onChange={(e) =>
                                handleInputChange("product_name", e.target.value)
                            }
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>ราคา</Form.Label>
                        <Form.Control
                            type="number"
                            value={product.product_price}
                            onChange={(e) =>
                                handleInputChange("product_price", e.target.value)
                            }
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>คำอธิบาย</Form.Label>
                        <Form.Control
                            type="text"
                            value={product.product_description}
                            onChange={(e) =>
                                handleInputChange(
                                    "product_description",
                                    e.target.value
                                )
                            }
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>จำนวน</Form.Label>
                        <Form.Control
                            type="number"
                            value={product.product_amount}
                            onChange={(e) =>
                                handleInputChange("product_amount", e.target.value)
                            }
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>รูปภาพ (URL)</Form.Label>
                        <Form.Control
                            type="url"
                            value={product.product_image}
                            onChange={(e) =>
                                handleInputChange("product_image", e.target.value)
                            }
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>ประเภทสินค้า</Form.Label>
                        <Form.Control
                            type="text"
                            value={product.product_type}
                            onChange={(e) =>
                                handleInputChange("product_type", e.target.value)
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
        </Container>
    );
}
