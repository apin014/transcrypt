import React from "react";
import { Sidebar } from "../../components/sidebar/Sidebar";
import ListMahasiswa from "../../components/list_mahasiswa/ListMahasiswa";

const Homepage = () => {
  return (
    <div className="container mx-auto px-4">
      <Sidebar />
      <div className="flex">
        <div className="flex-1 container mx-auto px-4 py-8">
          <h1 className="text-3xl text-center font-bold mb-6">Selamat Datang di Aplikasi Kriptografi dan Koding</h1>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Tentang Aplikasi Ini</h2>
            <p className="mb-4">
              Aplikasi ini dirancang untuk mengelola dan mengenkripsi data akademik menggunakan algoritma RSA dan SHA-3.
              Anda dapat melakukan enkripsi, tanda-tangan digital, dan verifikasi data dengan mudah.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2">Fitur Utama</h3>
                <ul className="list-disc list-inside">
                  <li>Membangkitkan kunci publik dan privat RSA</li>
                  <li>Enkripsi dan dekripsi data akademik</li>
                  <li>Tanda-tangan digital dan verifikasi</li>
                  <li>Menyimpan dan menampilkan data terenkripsi</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2">Petunjuk Penggunaan</h3>
                <ul className="list-disc list-inside">
                  <li>Masukkan data akademik mahasiswa</li>
                  <li>Enkripsi field-field yang diperlukan</li>
                  <li>Generate tanda-tangan digital</li>
                  <li>Verifikasi tanda-tangan digital saat diperlukan</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ListMahasiswa/>
    </div>
  );
};

export default Homepage;
