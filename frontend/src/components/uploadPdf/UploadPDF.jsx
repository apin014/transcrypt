import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { Modal, Button } from 'flowbite-react';

const UploadEncryptedFileModal = ({ isOpen, onClose, onDecrypt }) => {
    const [file, setFile] = useState(null);
    const [key, setKey] = useState('');
    const [error, setError] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleDecrypt = () => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const encryptedData = event.target.result;
                const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key);
                const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);

                if (!decryptedData) {
                    throw new Error("Invalid Key");
                }

                const pdfBlob = new Blob([Uint8Array.from(atob(decryptedData), c => c.charCodeAt(0))], { type: 'application/pdf' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(pdfBlob);
                const originalFileName = file.name.split('.').slice(0, -1).join('.');
                link.download = `${originalFileName}_decrypted.pdf`;
                link.click();
                onClose();
            } catch (error) {
                setError(true);
            }
        };
        reader.readAsText(file);
    };

    const closeModal = () => {
        setError(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                    <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                        <div className="bg-white p-6">
                            <h2 className="text-lg font-bold mb-4">Upload Encrypted File</h2>
                            <div className="mb-4">
                                <input type="file" onChange={handleFileChange} />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="password"
                                    placeholder="Enter Key"
                                    value={key}
                                    onChange={(e) => setKey(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDecrypt}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                    disabled={!file || !key}
                                >
                                    Decrypt and Download
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <Modal show={error} onClose={() => setError(false)}>
                    <Modal.Header>Error</Modal.Header>
                    <Modal.Body>
                        <p>Invalid secret key. Please try again.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => setError(false)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
};

export default UploadEncryptedFileModal;
