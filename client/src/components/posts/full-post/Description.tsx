import "./Description.css";

import { useRef, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";

interface FullDescriptionModalProps {
  description: string;
  show: boolean;
  id?: string;
  onHide: () => void;
}

function FullDescriptionModal({description, ...props} : FullDescriptionModalProps) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body id="description-modal">

          {description}
  
      </Modal.Body>
    </Modal>
  )
}

interface DescriptionProps {
  description: string;
}

export default function Description({ description }: DescriptionProps) {
  const [isTruncated, setIsTruncated] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = descriptionRef.current;
    if (element) {
      setIsTruncated(element.scrollHeight > element.clientHeight * 1.4);
    }
  }, [description]);


  return (
    <>
    <div
      id="description"
      className="card text-bg-dark mt-3 mb-3 border border-secondary" 
      onClick={() => isTruncated ? setModalShow(true) : null}
    >
      <div className="card-body" ref={descriptionRef}>
      {description}
      </div>
    </div>
    <FullDescriptionModal description={description} show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}
