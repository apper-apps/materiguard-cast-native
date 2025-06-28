import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import articleService from '@/services/api/articleService';

class ExportService {
  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async exportToExcel() {
    await this.delay();
    
    try {
      const articles = await articleService.exportData();
      
      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(articles);
      
      // Set column widths
      const columnWidths = [
        { wch: 5 },   // ID
        { wch: 25 },  // Nom
        { wch: 15 },  // Catégorie
        { wch: 12 },  // Quantité Total
        { wch: 12 },  // Quantité Disponible
        { wch: 12 },  // Seuil Alerte
        { wch: 15 },  // Marque
        { wch: 15 },  // Modèle
        { wch: 12 },  // Prix Unitaire
        { wch: 15 }   // Statut
      ];
      worksheet['!cols'] = columnWidths;
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventaire');
      
      // Generate filename with timestamp
      const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
      const filename = `inventaire_${timestamp}.xlsx`;
      
      // Save file
      XLSX.writeFile(workbook, filename);
      
      return { success: true, filename };
    } catch (error) {
      throw new Error('Erreur lors de l\'export Excel: ' + error.message);
    }
  }

  async exportToPDF() {
    await this.delay();
    
    try {
      const articles = await articleService.exportData();
      
      // Create PDF document
      const doc = new jsPDF('l', 'mm', 'a4'); // landscape orientation
      
      // Add title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Rapport d\'Inventaire', 14, 22);
      
      // Add generation date
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const dateStr = format(new Date(), 'dd/MM/yyyy à HH:mm');
      doc.text(`Généré le ${dateStr}`, 14, 32);
      
      // Prepare table data
      const headers = [
        'ID', 'Nom', 'Catégorie', 'Qté Total', 'Qté Dispo', 
        'Seuil', 'Marque', 'Modèle', 'Prix (€)', 'Statut'
      ];
      
      const rows = articles.map(article => [
        article.ID.toString(),
        article.Nom,
        article.Catégorie,
        article['Quantité Total'].toString(),
        article['Quantité Disponible'].toString(),
        article['Seuil Alerte'].toString(),
        article.Marque || '-',
        article.Modèle || '-',
        article['Prix Unitaire'] || '-',
        article.Statut
      ]);
      
      // Add table
      doc.autoTable({
        head: [headers],
        body: rows,
        startY: 40,
        styles: {
          fontSize: 9,
          cellPadding: 2
        },
        headStyles: {
          fillColor: [59, 130, 246], // blue-500
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251] // gray-50
        },
        columnStyles: {
          0: { cellWidth: 15 }, // ID
          1: { cellWidth: 35 }, // Nom
          2: { cellWidth: 25 }, // Catégorie
          3: { cellWidth: 20 }, // Qté Total
          4: { cellWidth: 20 }, // Qté Dispo
          5: { cellWidth: 15 }, // Seuil
          6: { cellWidth: 25 }, // Marque
          7: { cellWidth: 25 }, // Modèle
          8: { cellWidth: 20 }, // Prix
          9: { cellWidth: 25 }  // Statut
        }
      });
      
      // Add footer with page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} sur ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
      }
      
      // Generate filename with timestamp
      const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
      const filename = `inventaire_${timestamp}.pdf`;
      
      // Save file
      doc.save(filename);
      
      return { success: true, filename };
    } catch (error) {
      throw new Error('Erreur lors de l\'export PDF: ' + error.message);
    }
  }
}

export default new ExportService();