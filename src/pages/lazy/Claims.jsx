// src/pages/lazy/Claims.jsx

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Row, Col, Alert, Table, Modal } from "react-bootstrap";
import axios from "axios";

const CLAIMS_TABLE_ID = 751875;
const BASEROW_TOKEN = "GYLRTMZegxLLeQ85qKkxFAJxhAZ1OFgA";
const BASEROW_URL = `https://api.baserow.io/api/database/rows/table/${CLAIMS_TABLE_ID}/`;

const CLAIM_TYPE_OPTIONS = [
    { value: "all", label: "แสดงเคลมทุกประเภท" },
    { value: "fraud", label: "งานตรวจสอบเคลมฉ้อฉล" },
    { value: "stolen", label: "งานตรวจสอบเคลมรถหาย" },
    { value: "loss", label: "งานตรวจสอบเคลมเสียหายสิ้นเชิง" },
];

export default function Claims() {
    const location = useLocation();
    const navigate = useNavigate();

    const [claimTypeFilter, setClaimTypeFilter] = useState("all");
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // state สำหรับ modal (ใช้ร่วมกันทั้งเพิ่ม/แก้ไข)
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [newClaim, setNewClaim] = useState({
        claim_no: "",
        claim_type: "fraud",
        status: "",
        insured_name: "",
        vehicle_reg: "",
        assigned_to: "",
        created_at: "", // ฟิลด์วันที่รับเคลม
    });

    // อ่านค่า ?type= จาก URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const qType = params.get("type");

        if (qType === "fraud" || qType === "stolen" || qType === "loss" || qType === "all") {
            setClaimTypeFilter(qType);
        } else {
            setClaimTypeFilter("all");
        }
    }, [location.search]);

    // โหลดเคลมเมื่อเปลี่ยนประเภทงาน
    useEffect(() => {
        loadClaims();
    }, [claimTypeFilter]);

    const loadClaims = async () => {
        setLoading(true);
        setErrorMsg("");

        try {
            const response = await axios.get(BASEROW_URL, {
                headers: {
                    Authorization: `Token ${BASEROW_TOKEN}`,
                },
                params: {
                    user_field_names: true,
                    page: 1,
                    size: 50,
                },
            });

            const rows = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            let filteredRows = rows;
            if (claimTypeFilter !== "all") {
                filteredRows = rows.filter((row) => row.claim_type === claimTypeFilter);
            }

            setClaims(filteredRows);
        } catch (error) {
            console.error("Error loading claims:", error);
            const detail =
                error.response?.data?.detail || error.response?.data?.error || error.message;
            setErrorMsg(`Failed to load claims from Baserow. Detail: ${detail}`);
        } finally {
            setLoading(false);
        }
    };

    const handleTypeChange = (e) => {
        const newType = e.target.value;
        setClaimTypeFilter(newType);

        const params = new URLSearchParams(location.search);
        if (newType === "all") {
            params.delete("type");
        } else {
            params.set("type", newType);
        }
        navigate(`/claims?${params.toString()}`);
    };

    // ---------- เพิ่มเคลม ----------

    const handleOpenAddModal = () => {
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

        setIsEdit(false);
        setEditingId(null);
        setNewClaim({
            claim_no: "",
            claim_type: claimTypeFilter === "all" ? "fraud" : claimTypeFilter,
            status: "",
            insured_name: "",
            vehicle_reg: "",
            assigned_to: "",
            created_at: today, // ค่าเริ่มต้นเป็นวันที่วันนี้
        });
        setShowModal(true);
    };

    // ---------- แก้ไขเคลม ----------

    const handleEditClaim = (row) => {
        setIsEdit(true);
        setEditingId(row.id);
        setNewClaim({
            claim_no: row.claim_no || "",
            claim_type: row.claim_type || "fraud",
            status: row.status || "",
            insured_name: row.insured_name || "",
            vehicle_reg: row.vehicle_reg || "",
            assigned_to: row.assigned_to || "",
            // ถ้ามาเป็น "2025-11-25T00:00:00Z" ให้ตัดเหลือ YYYY-MM-DD
            created_at: (row.created_at || row.created_on || "").slice(0, 10),
        });
        setShowModal(true);
    };

    // ---------- บันทึก (ใช้ร่วมกันทั้งเพิ่ม/แก้ไข) ----------

    const handleSubmitClaim = async (e) => {
        e.preventDefault();

        const payload = {
            claim_no: newClaim.claim_no,
            claim_type: newClaim.claim_type,
            status: newClaim.status,
            insured_name: newClaim.insured_name,
            vehicle_reg: newClaim.vehicle_reg,
            assigned_to: newClaim.assigned_to,
            created_at: newClaim.created_at, // ส่งวันที่ไป Baserow
        };

        try {
            if (isEdit && editingId != null) {
                // แก้ไข (PATCH)
                const res = await axios.patch(
                    `${BASEROW_URL}${editingId}/?user_field_names=true`,
                    payload,
                    {
                        headers: {
                            Authorization: `Token ${BASEROW_TOKEN}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const updatedRow = res.data;

                setClaims((prev) =>
                    prev.map((c) => (c.id === editingId ? { ...c, ...updatedRow } : c))
                );
            } else {
                // เพิ่มใหม่ (POST)
                const res = await axios.post(
                    `${BASEROW_URL}?user_field_names=true`,
                    payload,
                    {
                        headers: {
                            Authorization: `Token ${BASEROW_TOKEN}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const row = res.data;

                setClaims((prev) => [
                    ...prev,
                    {
                        id: row.id,
                        claim_no: row.claim_no,
                        claim_type: row.claim_type,
                        status: row.status,
                        insured_name: row.insured_name,
                        vehicle_reg: row.vehicle_reg,
                        assigned_to: row.assigned_to,
                        created_at: row.created_at || row.created_on || newClaim.created_at,
                    },
                ]);
            }

            setShowModal(false);
        } catch (error) {
            console.error("Error saving claim:", error);
            const detail =
                error.response?.data?.detail || error.response?.data?.error || error.message;
            alert(`บันทึกเคลมไม่สำเร็จ: ${detail}`);
        }
    };

    // ---------- ลบเคลม (ยังเป็น TODO) ----------

    const handleDeleteClaim = async (row) => {
        const ok = window.confirm(`แน่ใจหรือไม่ว่าจะลบเคลมเลขที่ ${row.claim_no} ?`);
        if (!ok) return;

        alert("TODO: เรียก DELETE API ของ Baserow เพื่อลบแถวจริง ๆ");
    };

    const currentTypeLabel =
        CLAIM_TYPE_OPTIONS.find((opt) => opt.value === claimTypeFilter)?.label ||
        "แสดงเคลมทุกประเภท";

    // ---------- UI ----------

    return (
        <div className="container mt-4 mb-5">
            <h3 className="mb-3">รายการเคลมของบริษัทประกัน</h3>

            <Form className="mb-3">
                <Row className="align-items-end">
                    <Col md={4}>
                        <Form.Label>ประเภทงาน:</Form.Label>
                        <Form.Select value={claimTypeFilter} onChange={handleTypeChange}>
                            {CLAIM_TYPE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>

                    <Col md={2}>
                        <Button
                            type="button"
                            className="mt-3 w-100"
                            variant="secondary"
                            onClick={loadClaims}
                        >
                            รีเฟรชข้อมูล
                        </Button>
                    </Col>

                    <Col md={2}>
                        <Button
                            type="button"
                            className="mt-3 w-100"
                            variant="primary"
                            onClick={handleOpenAddModal}
                        >
                            + เพิ่มเคลม
                        </Button>
                    </Col>
                </Row>
            </Form>

            {errorMsg && (
                <Alert variant="danger">
                    <strong>Error:</strong> {errorMsg}
                </Alert>
            )}

            {loading ? (
                <p>กำลังโหลดข้อมูลเคลม...</p>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>
                                เลขที่เคลม
                                <br />
                                (claim_no)
                            </th>
                            <th>
                                ประเภทเคลม
                                <br />
                                (claim_type)
                            </th>
                            <th>
                                สถานะ
                                <br />
                                (status)
                            </th>
                            <th>
                                ผู้เช่าซื้อ / ผู้เอาประกัน
                                <br />
                                (insured_name)
                            </th>
                            <th>
                                ทะเบียนรถ
                                <br />
                                (vehicle_reg)
                            </th>
                            <th>
                                ผู้รับผิดชอบ
                                <br />
                                (assigned_to)
                            </th>
                            <th>
                                วันที่รับเคลม
                                <br />
                                (created_at)
                            </th>
                            <th>จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {claims.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center">
                                    ไม่พบข้อมูลเคลม
                                </td>
                            </tr>
                        ) : (
                            claims.map((row) => (
                                <tr key={row.id}>
                                    <td>{row.claim_no}</td>
                                    <td>{row.claim_type}</td>
                                    <td>{row.status}</td>
                                    <td>{row.insured_name}</td>
                                    <td>{row.vehicle_reg}</td>
                                    <td>{row.assigned_to}</td>
                                    <td>{(row.created_at || row.created_on || "").slice(0, 10)}</td>
                                    <td>
                                        <Button
                                            size="sm"
                                            variant="warning"
                                            className="me-2"
                                            onClick={() => handleEditClaim(row)}
                                        >
                                            แก้ไข
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => handleDeleteClaim(row)}
                                        >
                                            ลบ
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            )}

            <p className="text-muted mt-2">* หมายเหตุ:</p>
            <p className="text-muted">
                ประเภทปัจจุบัน: <strong>{currentTypeLabel}</strong>
            </p>

            {/* Modal เพิ่ม/แก้ไขเคลม */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? "แก้ไขเคลม" : "เพิ่มเคลมใหม่"}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmitClaim}>
                    <Modal.Body>
                        <Form.Group className="mb-2">
                            <Form.Label>เลขที่เคลม (claim_no)</Form.Label>
                            <Form.Control
                                value={newClaim.claim_no}
                                onChange={(e) =>
                                    setNewClaim({ ...newClaim, claim_no: e.target.value })
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>ประเภทเคลม (claim_type)</Form.Label>
                            <Form.Select
                                value={newClaim.claim_type}
                                onChange={(e) =>
                                    setNewClaim({ ...newClaim, claim_type: e.target.value })
                                }
                            >
                                <option value="fraud">fraud</option>
                                <option value="stolen">stolen</option>
                                <option value="loss">loss</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>สถานะ (status)</Form.Label>
                            <Form.Control
                                value={newClaim.status}
                                onChange={(e) =>
                                    setNewClaim({ ...newClaim, status: e.target.value })
                                }
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>ผู้เช่าซื้อ / ผู้เอาประกัน (insured_name)</Form.Label>
                            <Form.Control
                                value={newClaim.insured_name}
                                onChange={(e) =>
                                    setNewClaim({ ...newClaim, insured_name: e.target.value })
                                }
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>ทะเบียนรถ (vehicle_reg)</Form.Label>
                            <Form.Control
                                value={newClaim.vehicle_reg}
                                onChange={(e) =>
                                    setNewClaim({ ...newClaim, vehicle_reg: e.target.value })
                                }
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>ผู้รับผิดชอบ (assigned_to)</Form.Label>
                            <Form.Control
                                value={newClaim.assigned_to}
                                onChange={(e) =>
                                    setNewClaim({ ...newClaim, assigned_to: e.target.value })
                                }
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>วันที่รับเคลม (created_at)</Form.Label>
                            <Form.Control
                                type="date"
                                value={newClaim.created_at}
                                onChange={(e) =>
                                    setNewClaim({ ...newClaim, created_at: e.target.value })
                                }
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            ยกเลิก
                        </Button>
                        <Button type="submit" variant="primary">
                            บันทึก
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}
