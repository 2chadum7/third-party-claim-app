import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CLAIMS_TABLE_ID = 751875;
const BASEROW_TOKEN = "GYLRTMZegxLLeQ85qKkxFAJxhAZ1OFgA";

export default function Home() {
    const navigate = useNavigate();

    const [totalClaims, setTotalClaims] = useState(0);
    const [fraudClaims, setFraudClaims] = useState(0);
    const [stolenClaims, setStolenClaims] = useState(0);
    const [lossClaims, setLossClaims] = useState(0);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSummary = async () => {
            setLoading(true);
            setError("");

            try {
                const url = `https://api.baserow.io/api/database/rows/table/${CLAIMS_TABLE_ID}/?user_field_names=true&page=1&size=200`;

                const res = await axios.get(url, {
                    headers: {
                        Authorization: `Token ${BASEROW_TOKEN}`,
                    },
                });

                const rows = res.data.results || res.data || [];

                const total = rows.length;
                const fraud = rows.filter((r) => r.claim_type === "fraud").length;
                const stolen = rows.filter((r) => r.claim_type === "stolen").length;
                const loss = rows.filter((r) => r.claim_type === "loss").length;

                setTotalClaims(total);
                setFraudClaims(fraud);
                setStolenClaims(stolen);
                setLossClaims(loss);
            } catch (err) {
                console.error("Load summary error:", err);
                const msg =
                    err.response?.data?.detail ||
                    err.response?.data?.error ||
                    err.message ||
                    "ไม่สามารถโหลดข้อมูลสรุปเคลมได้";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    const openClaims = (type) => {
        navigate(`/claims?type=${type}`);
    };

    return (
        <div className="container my-4">
            <h2 className="mb-4">ระบบ Third-party Claim Verification</h2>

            <div className="row mb-4">
                <div className="col-md-3 mb-3">
                    <Card className="h-100 text-center">
                        <Card.Body>
                            <Card.Title>เคลมทั้งหมด</Card.Title>
                            <Card.Text style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
                                {loading ? "…" : totalClaims}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>

                <div className="col-md-3 mb-3">
                    <Card className="h-100 text-center">
                        <Card.Body>
                            <Card.Title>ตรวจฉ้อฉล</Card.Title>
                            <Card.Text style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
                                {loading ? "…" : fraudClaims}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>

                <div className="col-md-3 mb-3">
                    <Card className="h-100 text-center">
                        <Card.Body>
                            <Card.Title>รถหาย</Card.Title>
                            <Card.Text style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
                                {loading ? "…" : stolenClaims}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>

                <div className="col-md-3 mb-3">
                    <Card className="h-100 text-center">
                        <Card.Body>
                            <Card.Title>เสียหายสิ้นเชิง</Card.Title>
                            <Card.Text style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
                                {loading ? "…" : lossClaims}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    Error: {error}
                </div>
            )}

            <div className="row">
                <div className="col-md-4 mb-3">
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>งานตรวจฉ้อฉลรถจักรยานยนต์</Card.Title>
                            <Card.Text>
                                ใช้สำหรับงานกรณีผู้เข้าซื้อเอกสารหนี้ ไม่ชำระหนี้ ต้องลงพื้นที่ตรวจสอบที่อยู่/ทะเบียนบ้าน
                            </Card.Text>
                            <Button variant="primary" onClick={() => openClaims("fraud")}>
                                เปิดรายการ
                            </Button>
                        </Card.Body>
                    </Card>
                </div>

                <div className="col-md-4 mb-3">
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>งานตรวจสอบรถหาย</Card.Title>
                            <Card.Text>
                                บันทึกเคสโจรกรรมรถจักรยานยนต์ ลงข้อมูลผู้เข้าซื้อ จุดเกิดเหตุ
                                และการประสานงานกับตำรวจ
                            </Card.Text>
                            <Button variant="primary" onClick={() => openClaims("stolen")}>
                                เปิดรายการ
                            </Button>
                        </Card.Body>
                    </Card>
                </div>

                <div className="col-md-4 mb-3">
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>งานตรวจสอบเสียหายสิ้นเชิง</Card.Title>
                            <Card.Text>
                                ติดตามเคสซากรถเสียหายสิ้นเชิง เปรียบเทียบราคาซากกับมูลค่าที่เคลมมา
                            </Card.Text>
                            <Button variant="primary" onClick={() => openClaims("loss")}>
                                เปิดรายการ
                            </Button>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
}
