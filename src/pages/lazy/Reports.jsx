import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Button,
    Card,
    Row,
    Col,
    Alert,
    Spinner
} from "react-bootstrap";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

const CLAIMS_TABLE_ID = 751875;
const BASEROW_TOKEN = "GYLRTMZegxLLeQ85qKkxFAJxhAZ1OFgA";

const BASEROW_URL = `https://api.baserow.io/api/database/rows/table/${CLAIMS_TABLE_ID}/?user_field_names=true`;

export default function Reports() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [claims, setClaims] = useState([]);

    const [stats, setStats] = useState({
        total: 0,
        stolen: 0,
        fraud: 0,
        loss: 0,
    });

    const loadClaims = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await axios.get(BASEROW_URL, {
                headers: {
                    Authorization: `Token ${BASEROW_TOKEN}`,
                },
            });

            const rows = res.data?.results || res.data || [];
            setClaims(rows);

            const toType = (row) => (row.claim_type || "").toLowerCase();

            const total = rows.length;
            const stolen = rows.filter((r) => toType(r) === "stolen").length;
            const fraud = rows.filter((r) => toType(r) === "fraud").length;
            const loss = rows.filter((r) => toType(r) === "loss").length;

            setStats({ total, stolen, fraud, loss });
        } catch (err) {
            console.error(err);
            const msg =
                err.response?.data?.detail ||
                err.response?.data?.error ||
                err.message ||
                "ไม่สามารถโหลดข้อมูลจาก Baserow ได้";
            setError(`Failed to load reports from Baserow. Detail: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClaims();
    }, []);

    const typeData = [
        { name: "fraud (ตรวจฉ้อฉล)", value: stats.fraud },
        { name: "stolen (รถหาย)", value: stats.stolen },
        { name: "loss (เสียหายสิ้นเชิง)", value: stats.loss },
    ];

    const COLORS = ["#8884d8", "#82ca9d", "#ff8042"];

    return (
        <div className="container mt-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>รายงานสถิติเคลมของบริษัทประกัน</h3>

                <Button variant="secondary" onClick={loadClaims} disabled={loading}>
                    {loading ? "กำลังโหลด..." : "รีเฟรชข้อมูล"}
                </Button>
            </div>

            {error && (
                <Alert variant="danger">
                    <strong>Error: </strong>
                    {error}
                </Alert>
            )}

            {loading && !claims.length ? (
                <div className="text-center my-5">
                    <Spinner animation="border" role="status" />
                    <div className="mt-2">กำลังดึงข้อมูลจาก Baserow...</div>
                </div>
            ) : (
                <>
                    <Row className="mb-4">
                        <Col md={3} sm={6} className="mb-3">
                            <Card>
                                <Card.Body>
                                    <Card.Title>เคลมทั้งหมด</Card.Title>
                                    <Card.Text style={{ fontSize: "2rem", fontWeight: "bold" }}>
                                        {stats.total}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={3} sm={6} className="mb-3">
                            <Card>
                                <Card.Body>
                                    <Card.Title>ตรวจฉ้อฉล</Card.Title>
                                    <Card.Text style={{ fontSize: "2rem", fontWeight: "bold" }}>
                                        {stats.fraud}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={3} sm={6} className="mb-3">
                            <Card>
                                <Card.Body>
                                    <Card.Title>รถหาย</Card.Title>
                                    <Card.Text style={{ fontSize: "2rem", fontWeight: "bold" }}>
                                        {stats.stolen}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={3} sm={6} className="mb-3">
                            <Card>
                                <Card.Body>
                                    <Card.Title>เสียหายสิ้นเชิง</Card.Title>
                                    <Card.Text style={{ fontSize: "2rem", fontWeight: "bold" }}>
                                        {stats.loss}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* แถวกราฟ */}
                    <Row className="mb-4">
                        {/* กราฟแท่ง เปรียบเทียบจำนวนเคลมแต่ละประเภท */}
                        <Col md={7} className="mb-3">
                            <Card style={{ height: "320px" }}>
                                <Card.Header>จำนวนเคลมตามประเภท (กราฟแท่ง)</Card.Header>
                                <Card.Body>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={typeData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="value" name="จำนวนเคลม">
                                                {typeData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={5} className="mb-3">
                            <Card style={{ height: "320px" }}>
                                <Card.Header>สัดส่วนเคลมตามประเภท (กราฟวงกลม)</Card.Header>
                                <Card.Body>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={typeData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={90}
                                                label
                                            >
                                                {typeData.map((entry, index) => (
                                                    <Cell key={`slice-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <p className="text-muted mt-2" style={{ fontSize: "0.9rem" }}>
                        * หมายเหตุ: ระบบจะนับจากคอลัมน์ <code>claim_type</code> ใน Baserow
                        ซึ่งต้องตั้งค่าเป็น <code>fraud</code>, <code>stolen</code>, <code>loss</code>{" "}
                        (ตัวพิมพ์เล็ก) ให้ตรงกับเงื่อนไขในโค้ด
                    </p>
                </>
            )}
        </div>
    );
}
