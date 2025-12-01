// ==========================================================
// *** FILE: script.js (KODE FINAL DAN LENGKAP) ***
// ==========================================================

// SPREADSHEET_ID dan SHEET_ID (GID) yang sudah dikonfirmasi
const SPREADSHEET_ID = '1KsTjy_SedUlpsCZXIRwy3x2sWRR-XXN4uvFgugVjDxo'; 
const SHEET_ID = '1387796749'; 

const URL_SHEET = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=${SHEET_ID}`;
const tableElement = document.getElementById('attendance-table');

/**
 * Fungsi untuk memformat nilai tanggal/waktu dari format Google Sheets JSON
 * menjadi string yang mudah dibaca (e.g., 01/12/2025 10:00).
 */
function formatGoogleSheetDate(cellValue) {
    // Periksa apakah nilai adalah string yang mengandung "Date("
    if (typeof cellValue === 'string' && cellValue.startsWith('Date(')) {
        // Ekstrak angka-angka dari string (Tahun, Bulan, Hari, Jam, Menit, Detik)
        const parts = cellValue.match(/\d+/g).map(Number);

        if (parts.length >= 3) {
            // Catatan: Bulan di Sheets API dimulai dari 0 (0=Jan, 10=Nov)
            const year = parts[0];
            const month = parts[1]; 
            const day = parts[2];
            const hour = parts[3] || 0;
            const minute = parts[4] || 0;
            
            const date = new Date(year, month, day, hour, minute);
            
            // Format tanggal dan waktu sesuai Bahasa Indonesia
            return date.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }).replace(',', ''); 
        }
    }
    return cellValue; 
}

/**
 * Menampilkan pesan status (loading atau error) di dalam tabel.
 */
function setTableStatus(message, isError = false) {
    const statusClass = isError ? 'error-message' : 'loading-message';
    // Gunakan <td> colspan besar untuk memastikan pesan terlihat di tengah
    tableElement.innerHTML = `<tr><td colspan="100" class="${statusClass}">${message}</td></tr>`;
}


async function fetchData() {
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
                const rawValue = cell && cell.v !== undefined ? cell.v : '';
                
                // Panggil fungsi format tanggal
                const cellValue = formatGoogleSheetDate(rawValue); 
                
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
                              3) Coba hapus cache browser HP Anda.`;
        setTableStatus(errorMessage, true);
    }
}

document.addEventListener('DOMContentLoaded', fetchData);
