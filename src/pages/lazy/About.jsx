import React from "react";
import { Card } from "react-bootstrap";

function About() {
    return (
        <Card>
            <Card.Body>
                <Card.Title>เกี่ยวกับระบบ</Card.Title>
                <Card.Text>
                    ระบบนี้ใช้สำหรับจัดการข้อมูลการตรวจสอบค่าสินไหมที่บริษัทภายนอก
                    ดำเนินการให้บริษัทประกันภัย
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default About;