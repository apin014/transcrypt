import React, { useState } from 'react';
import TranskripMahasiswa from '../transkrip_mahasiswa/TranskripMahasiswa';
import UploadEncryptedFileModal from '../uploadPdf/UploadPDF';
import CryptoJS from 'crypto-js';

const ListMahasiswa = () => {
  const [mahasiswa, setMahasiswa] = useState([
    {
      nim: '1201',
      nama: 'Alice',
      mk: [
        { kode: 'II301', nama: 'Aljabar', nilai: 'A', sks: 3 },
        { kode: 'II302', nama: 'Kripto', nilai: 'AB', sks: 2 },
      ],
      ipk: 3.51,
      ttd: '67B65987F41'
    },
    {
      nim: '1202',
      nama: 'Bob',
      mk: [
        { kode: 'II301', nama: 'Aljabar', nilai: 'B', sks: 3 },
        { kode: 'II401', nama: 'ML', nilai: 'B', sks: 3 },
      ],
      ipk: 2.75,
      ttd: 'B4510DE3052'
    },
    {
      nim: '1203',
      nama: 'Carol',
      mk: [
        { kode: 'II204', nama: 'Basdat', nilai: 'BC', sks: 2 },
        { kode: 'II231', nama: 'S.Info', nilai: 'A', sks: 3 },
      ],
      ipk: 3.01,
      ttd: 'B765EEF3125'
    },
    {
      nim: '1204',
      nama: 'David',
      mk: [
        { kode: 'II302', nama: 'OOP', nilai: 'C', sks: 3 },
        { kode: 'II321', nama: 'TA', nilai: 'A', sks: 4 },
      ],
      ipk: 3.78,
      ttd: '8FC35219067C'
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [view, setView] = useState('decrypted');
  const secretKey = 'secret-key';
  const [newMahasiswa, setNewMahasiswa] = useState({
    nim: '', nama: '', ipk: '', ttd: '',
    mk: Array(10).fill({ kode: '', nama: '', nilai: '', sks: '' })
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [section, index, field] = name.split('.');

    if (section === 'mk') {
      const updatedMk = [...newMahasiswa.mk];
      updatedMk[index] = { ...updatedMk[index], [field]: value };
      setNewMahasiswa((prevState) => ({ ...prevState, mk: updatedMk }));
    } else {
      setNewMahasiswa((prevState) => ({ ...prevState, [name]: value }));
    }
  };
  const handleOpenUploadModal = () => {
    setShowUploadModal(true);
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
  };

  //Dummy function buat show encrpyted data
  const encryptField = (field) => {
    return CryptoJS.AES.encrypt(field.toString(), secretKey).toString();
  };

  const encryptData = (data) => {
    return {
      ...data,
      nim: encryptField(data.nim),
      nama: encryptField(data.nama),
      mk: data.mk.map(mk => ({
        kode: encryptField(mk.kode),
        nama: encryptField(mk.nama),
        nilai: encryptField(mk.nilai),
        sks: encryptField(mk.sks),
      })),
      ipk: encryptField(data.ipk),
      ttd: encryptField(data.ttd),
    };
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    setMahasiswa([...mahasiswa, newMahasiswa]);
    setShowModal(false);
    setNewMahasiswa({
      nim: '', nama: '', ipk: '', ttd: '',
      mk: Array(10).fill({ kode: '', nama: '', nilai: '', sks: '' })
    });
    console.log("submitted data", newMahasiswa);
  };

  const handleSelectMahasiswa = (mhs) => {
    setSelectedMahasiswa(mhs);
    setShowModal(true);
  };

  const handleCloseDetail = () => {
    setSelectedMahasiswa(null);
    setShowModal(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Mahasiswa</h1>
        <div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={() => setShowModal(true)}
          >
            Tambah Data
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg ml-2"
            onClick={handleOpenUploadModal}
          >
            Upload Encrypted File
          </button>
        </div>
      </div>
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-2 rounded-l-lg ${view === 'decrypted' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => setView('decrypted')}
        >
          Decrypted Table
        </button>
        <button
          className={`px-4 py-2 rounded-r-lg ${view === 'encrypted' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => setView('encrypted')}
        >
          Encrypted Table
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 overflow-auto">
        <div className="overflow-x-auto">
          {view === 'decrypted' ? (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4">NIM</th>
                  <th className="py-2 px-4">Nama</th>
                  {[...Array(10).keys()].map(index => (
                    <>
                      <th key={`kode-mk-${index + 1}`} className="py-2 px-4">Kode MK {index + 1}</th>
                      <th key={`nama-mk-${index + 1}`} className="py-2 px-4">Nama Matkul {index + 1}</th>
                      <th key={`nilai-mk-${index + 1}`} className="py-2 px-4">Nilai {index + 1}</th>
                      <th key={`sks-mk-${index + 1}`} className="py-2 px-4">SKS {index + 1}</th>
                    </>
                  ))}
                  <th className="py-2 px-4">IPK</th>
                  <th className="py-2 px-4">Tanda-tangan Digital</th>
                </tr>
              </thead>
              <tbody>
                {mahasiswa.map((mhs, index) => (
                  <tr key={index} onClick={() => handleSelectMahasiswa(mhs)} className="cursor-pointer hover:bg-gray-100">
                    <td className="border px-4 py-2">{mhs.nim}</td>
                    <td className="border px-4 py-2">{mhs.nama}</td>
                    {mhs.mk.map((mk, mkIndex) => (
                      <React.Fragment key={mkIndex}>
                        <td className="border px-4 py-2">{mk.kode}</td>
                        <td className="border px-4 py-2">{mk.nama}</td>
                        <td className="border px-4 py-2">{mk.nilai}</td>
                        <td className="border px-4 py-2">{mk.sks}</td>
                      </React.Fragment>
                    ))}
                    {[...Array(10 - mhs.mk.length).keys()].map(emptyIndex => (
                      <React.Fragment key={`empty-${emptyIndex}`}>
                        <td className="border px-4 py-2"></td>
                        <td className="border px-4 py-2"></td>
                        <td className="border px-4 py-2"></td>
                        <td className="border px-4 py-2"></td>
                      </React.Fragment>
                    ))}
                    <td className="border px-4 py-2">{mhs.ipk}</td>
                    <td className="border px-4 py-2">{mhs.ttd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4">NIM</th>
                  <th className="py-2 px-4">Nama</th>
                  {[...Array(10).keys()].map(index => (
                    <>
                      <th key={`kode-mk-${index + 1}`} className="py-2 px-4">Kode MK {index + 1}</th>
                      <th key={`nama-mk-${index + 1}`} className="py-2 px-4">Nama Matkul {index + 1}</th>
                      <th key={`nilai-mk-${index + 1}`} className="py-2 px-4">Nilai {index + 1}</th>
                      <th key={`sks-mk-${index + 1}`} className="py-2 px-4">SKS {index + 1}</th>
                    </>
                  ))}
                  <th className="py-2 px-4">IPK</th>
                  <th className="py-2 px-4">Tanda-tangan Digital</th>
                </tr>
              </thead>
              <tbody>
                {mahasiswa.map((mhs, index) => {
                  const encryptedMhs = encryptData(mhs);
                  return (
                    <tr key={index} className="cursor-pointer hover:bg-gray-100">
                      <td className="border px-4 py-2">{encryptedMhs.nim}</td>
                      <td className="border px-4 py-2">{encryptedMhs.nama}</td>
                      {encryptedMhs.mk.map((mk, mkIndex) => (
                        <React.Fragment key={mkIndex}>
                          <td className="border px-4 py-2">{mk.kode}</td>
                          <td className="border px-4 py-2">{mk.nama}</td>
                          <td className="border px-4 py-2">{mk.nilai}</td>
                          <td className="border px-4 py-2">{mk.sks}</td>
                        </React.Fragment>
                      ))}
                      {[...Array(10 - encryptedMhs.mk.length).keys()].map(emptyIndex => (
                        <React.Fragment key={`empty-${emptyIndex}`}>
                          <td className="border px-4 py-2"></td>
                          <td className="border px-4 py-2"></td>
                          <td className="border px-4 py-2"></td>
                          <td className="border px-4 py-2"></td>
                        </React.Fragment>
                      ))}
                      <td className="border px-4 py-2">{encryptedMhs.ipk}</td>
                      <td className="border px-4 py-2">{encryptedMhs.ttd}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && selectedMahasiswa && (
        <TranskripMahasiswa mahasiswa={selectedMahasiswa} onClose={handleCloseDetail} />
      )}

      {showModal && !selectedMahasiswa && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center ">
          <div className="flex items-end justify-center min-h-screen pt-6 px-6 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Tambah Data Mahasiswa</h3>
                    <div className="mt-2">
                      <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            NIM
                          </label>
                          <input
                            type="text"
                            name="nim"
                            value={newMahasiswa.nim}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Nama
                          </label>
                          <input
                            type="text"
                            name="nama"
                            value={newMahasiswa.nama}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            IPK
                          </label>
                          <input
                            type="text"
                            name="ipk"
                            value={newMahasiswa.ipk}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2">
                            Tanda-tangan Digital
                          </label>
                          <input
                            type="text"
                            name="ttd"
                            value={newMahasiswa.ttd}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </div>
                        {newMahasiswa.mk.map((mk, index) => (
                          <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                Kode MK {index + 1}
                              </label>
                              <input
                                type="text"
                                name={`mk.${index}.kode`}
                                value={mk.kode}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                Nama Matkul {index + 1}
                              </label>
                              <input
                                type="text"
                                name={`mk.${index}.nama`}
                                value={mk.nama}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                Nilai {index + 1}
                              </label>
                              <input
                                type="text"
                                name={`mk.${index}.nilai`}
                                value={mk.nilai}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                SKS {index + 1}
                              </label>
                              <input
                                type="text"
                                name={`mk.${index}.sks`}
                                value={mk.sks}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              />
                            </div>
                          </div>
                        ))}
                        <div className="flex items-center justify-between">
                          <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          >
                            Tambah
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="text-gray-500 hover:text-gray-800 focus:outline-none"
                          >
                            Batal
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"></div>
          </div>
        </div>
      )}

      <UploadEncryptedFileModal isOpen={showUploadModal} onClose={handleCloseUploadModal} />
    </div>
  );
};

export default ListMahasiswa;
