// ==========================================================
// *** FILE: script.js (FINAL PERBAIKAN) ***
// ==========================================================

// SPREADSHEET_ID dan SHEET_ID (GID) yang sudah dikonfirmasi
const SPREADSHEET_ID = '1KsTjy_SedUlpsCZXIRwy3x2sWRR-XXN4uvFgugVjDxo'; 
const SHEET_ID = '1387796749'; 

const URL_SHEET = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=${SHEET_ID}`;
const tableElement = document.getElementById('attendance-table');

/**
 * Menampilkan pesan status (loading atau error) di dalam tabel.
 * @param {string} message - Pesan yang akan ditampilkan.
 */
function setTableStatus(message, isError = false) {
    const statusClass = isError ? 'error-message' : 'loading-message';
    tableElement.innerHTML = `<tr><td colspan="100" class="${statusClass}">${message}</td></tr>`;
}


async function fetchData() {
    // Tampilkan pesan loading sebelum mengambil data
    setTableStatus('Memuat Data Absensi...', false); 

    try {
        const response = await fetch(URL_SHEET);
        const dataText = await response.text();
        
        // Membersihkan string JSON
        const jsonString = dataText.substring(47).slice(0, -2);
        const jsonData = JSON.parse(jsonString);
        
        const rows = jsonData.table.rows;
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
                const cellValue = cell && cell.v !== undefined ? cell.v : '';
                htmlContent += `<td>${cellValue}</td>`;
            });
            htmlContent += '</tr>';
        });
        htmlContent += '</tbody>';

        // Menampilkan tabel ke elemen HTML
        tableElement.innerHTML = htmlContent;

    } catch (error) {
        console.error("Gagal mengambil data dari Google Sheets:", error);
        
        const errorMessage = `Error: Gagal memuat data. Mohon pastikan 
                              1) Akses Google Sheets sudah disetel "Anyone with the link" (Viewer), 
                              2) ID Spreadsheet dan GID Sheet sudah benar, 
                              3) Tidak ada blokir CORS.`;
        setTableStatus(errorMessage, true);
    }
}

// Panggil fungsi fetchData setelah dokumen HTML selesai dimuat
document.addEventListener('DOMContentLoaded', fetchData);
