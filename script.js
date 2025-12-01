// ==========================================================
// *** FILE: script.js ***
// ==========================================================

// SPREADSHEET_ID dan SHEET_ID (GID) yang sudah dikonfirmasi
const SPREADSHEET_ID = '1KsTjy_SedUlpsCZXIRwy3x2sWRR-XXN4uvFgugVjDxo'; 
const SHEET_ID = '1387796749'; 

// URL untuk mengambil data JSON dari Google Sheets
const URL_SHEET = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=${SHEET_ID}`;
const tableElement = document.getElementById('attendance-table');

async function fetchData() {
    try {
        // Ambil data dari Google Sheets
        const response = await fetch(URL_SHEET);
        const dataText = await response.text();
        
        // Membersihkan string JSON yang tidak standar (padding) dari Google Sheets
        // Google Sheets API membungkus JSON di dalam 'google.visualization.Query.setResponse(...);'
        const jsonString = dataText.substring(47).slice(0, -2);
        const jsonData = JSON.parse(jsonString);
        
        const rows = jsonData.table.rows;
        // Mengambil label header kolom (baris pertama Sheets)
        const header = jsonData.table.cols.map(col => col.label);
        
        // 1. Membangun Header Tabel
        let htmlContent = '<thead><tr>';
        header.forEach(h => {
            htmlContent += `<th>${h}</th>`;
        });
        htmlContent += '</tr></thead><tbody>';
        
        // 2. Membangun Isi Baris Tabel
        rows.forEach(row => {
            htmlContent += '<tr>';
            row.c.forEach(cell => {
                // Mengambil nilai sel (v), jika kosong atau undefined, tampilkan string kosong
                const cellValue = cell && cell.v !== undefined ? cell.v : '';
                
                htmlContent += `<td>${cellValue}</td>`;
            });
            htmlContent += '</tr>';
        });
        htmlContent += '</tbody>';

        // Menampilkan tabel ke elemen HTML
        tableElement.innerHTML = htmlContent;
        tableElement.caption.textContent = 'Data Absensi Berhasil Dimuat';

    } catch (error) {
        console.error("Gagal mengambil data dari Google Sheets:", error);
        // Menampilkan pesan error yang membantu pengguna
        tableElement.innerHTML = `<caption>Error: Gagal memuat data. Mohon pastikan 
                                   1) Akses Google Sheets sudah disetel "Anyone with the link", 
                                   2) SPREADSHEET_ID dan SHEET_ID sudah benar.
                                   (Lihat console browser untuk detail error: ${error.message})
                                   </caption>`;
    }
}

// Panggil fungsi fetchData setelah dokumen HTML selesai dimuat
document.addEventListener('DOMContentLoaded', fetchData);