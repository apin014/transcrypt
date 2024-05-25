
import React from 'react';

const TranskripMahasiswa = ({ mahasiswa, onClose }) => {
    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-2xl sm:w-full">
                    <div className="bg-white p-6">
                        <p>Program Studi Sistem dan Teknologi Informasi<br />
                            Sekolah Teknik Elektro dan Informatika<br />
                            Institut Teknologi Bandung<br />
                            ----------------------------------------------------------</p>
                        <h2 className=" font-bold mb-4">Transkrip Akademik</h2>
                        <div className="mb-4">
                            <h2 className='text-center'>Nama: {mahasiswa.nama}</h2>
                            <h2 className='text-center'>NIM: {mahasiswa.nim}</h2>
                        </div>
                        <table className="min-w-full bg-white mb-4">
                            <thead>
                                <tr>
                                    <th className="py-2">No</th>
                                    <th className="py-2">Kode mata kuliah</th>
                                    <th className="py-2">Nama mata kuliah</th>
                                    <th className="py-2">SKS</th>
                                    <th className="py-2">Nilai</th>
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
                        <div className="mb-4">
                            <p className='text-center'>Total Jumlah SKS: {mahasiswa.mk.reduce((total, mk) => total + parseInt(mk.sks), 0)}</p>
                            <p className='text-center'>IPK: {mahasiswa.ipk}</p>
                        </div>
                        <div className="mb-4">
                            <p>Ketua Program Studi</p>
                            <p>--Begin signature--</p>
                            <p>{mahasiswa.ttd}</p>
                            <p>--End signature--</p>
                            <p>(Dr. I Gusti Bagus Baskara)</p>
                        </div>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                            onClick={onClose}
                        >
                            Kembali
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TranskripMahasiswa;
