import './App.css'
import Home from "./pages/Home/Home.jsx";
import Modal from "./components/Modal/Modal.jsx";
import {useState} from "react";
import {Toaster} from "sonner";

function App() {
    const [isOpen, setIsOpen] = useState(false)
    const [closed, setClosed] = useState(false)

    const closeModal = () => {
        setIsOpen(false)
        setClosed(true)
    }

    return (
        <>
            <Home closed={closed} setIsOpen={setIsOpen} />
            <Modal isOpen={isOpen} closeModal={closeModal} />
            <Toaster position="bottom-right" richColors />
        </>
    )
}

export default App
