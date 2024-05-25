
import React, { useState } from 'react';
import SecretKeyModal from '../secretKeyModal/SecretKeyModal';
import { Button } from 'flowbite-react';

const TranskripMahasiswa = ({ mahasiswa, onClose }) => {
    const [showSecretKeyModal, setShowSecretKeyModal] = useState(false);
    const [secretKey, setSecretKey] = useState('');

    const handleDownloadClick = () => {
        setShowSecretKeyModal(true);
    };

    const handleSecretKeySubmit = (key) => {
        setSecretKey(key);
    };

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-2xl sm:w-full">
                    <div className="bg-white p-6" id="transkrip-mahasiswa">
                        <p>Program Studi Sistem dan Teknologi Informasi<br />
                            Sekolah Teknik Elektro dan Informatika<br />
                            Institut Teknologi Bandung<br />
                            ----------------------------------------------------------</p>
                        <h2 className="text-center font-bold mb-4">Transkrip Akademik</h2>
                        <div className="mb-4">
                            <p className='text-center'>Nama: {mahasiswa.nama}</p>
                            <p className='text-center'>NIM: {mahasiswa.nim}</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white mb-4">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4">No</th>
                                        <th className="py-2 px-4">Kode mata kuliah</th>
                                        <th className="py-2 px-4">Nama mata kuliah</th>
                                        <th className="py-2 px-4">SKS</th>
                                        <th className="py-2 px-4">Nilai</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mahasiswa.mk.map((mk, index) => (
                                        <tr key={index}>
                                            <td className="border px-4 py-2">{index + 1}</td>
                                            <td className="border px-4 py-2">{mk.kode}</td>
                                            <td className="border px-4 py-2">{mk.nama}</td>
                                            <td className="border px-4 py-2">{mk.sks}</td>
                                            <td className="border px-4 py-2">{mk.nilai}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mb-4">
                            <p>Total Jumlah SKS: {mahasiswa.mk.reduce((total, mk) => total + parseInt(mk.sks), 0)}</p>
                            <p>IPK: {mahasiswa.ipk}</p>
                        </div>
                        <div className="mb-4">
                            <p>Ketua Program Studi</p>
                            <p>--Begin signature--</p>
                            <p>{mahasiswa.ttd}</p>
                            <p>--End signature--</p>
                            <p>(Dr. I Gusti Bagus Baskara)</p>
                        </div>
                        <div className="flex justify-between mt-4">
                            <Button
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                onClick={onClose}
                            >
                                Kembali
                            </Button>
                            <Button
                                className="bg-red-700 text-white px-4 py-2 rounded-lg"
                                onClick={handleDownloadClick}
                            >
                                Download PDF
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <SecretKeyModal
                isOpen={showSecretKeyModal}
                onClose={() => setShowSecretKeyModal(false)}
                onSubmit={handleSecretKeySubmit}
                elementId="transkrip-mahasiswa" 
                fileName={`Transkrip_${mahasiswa.nim}`} 
                secretKey={secretKey}
            />
        </div>
    );
};

export default TranskripMahasiswa;
