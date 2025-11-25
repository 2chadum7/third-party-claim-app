import React from "react";
import NavbarBase from "../common/NavbarBase";
import FooterBase from "../common/FooterBase";
import Container from "react-bootstrap/Container";

export default function MainLayout({ children }) {
    return (
        <div className="app">
            <NavbarBase />
            <Container className="mt-4 mb-5">{children}</Container>
            <FooterBase />
        </div>
    );
}
