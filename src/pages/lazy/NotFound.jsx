import React from "react";
import { Alert } from "react-bootstrap";

function NotFound() {
    return (
        <Alert variant="danger">
            <Alert.Heading>404 - ไม่พบหน้านี้</Alert.Heading>
            <p>URL ที่คุณเข้าถึงไม่มีอยู่ในระบบ</p>
        </Alert>
    );
}

export default NotFound;
