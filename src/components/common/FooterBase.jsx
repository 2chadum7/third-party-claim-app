import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

function FooterBase() {
    return (
        <Navbar bg="primary" data-bs-theme="dark" fixed="bottom">
            <Container>
                <Navbar.Brand href="/home">
                    SCIENCE ART LAW & ASSOCIATES
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default FooterBase;
