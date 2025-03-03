import "./Modal.css"

const Modal = ({isOpen, closeModal}) => {
    const handleClose = () => closeModal();
    if (!isOpen) return  null;

    return (
        <div className="modal-backdrop">
            <div className="modal-container">
                <div className="modal-body">
                    <p className="modal-title">Schedule successfully created.</p>
                    <button className="modal-button" onClick={handleClose}>Create another plan</button>
                </div>
            </div>
        </div>
    );
};

export default Modal