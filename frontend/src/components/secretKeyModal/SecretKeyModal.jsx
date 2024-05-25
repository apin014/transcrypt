
import React, { useState } from 'react';
import { Modal, Button } from 'flowbite-react';
import DownloadPDF from '../downloadPdf/DownloadPDF';

const SecretKeyModal = ({ isOpen, onClose, elementId, fileName }) => {
  const [secretKey, setSecretKey] = useState('');

  return (
    <Modal show={isOpen} onClose={onClose}>
      <Modal.Header>Enter Secret Key</Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Secret Key"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <DownloadPDF elementId={elementId} fileName={fileName} secretKey={secretKey}/>
        <Button color="gray" onClick={onClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SecretKeyModal;
