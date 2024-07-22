import { ref } from 'vue';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { mongoOrder } from '@/dto/MongoOrder.dto';
import { OrdersService } from '@/composables/api/orders/orders.service';


export function usePdfGenerator() {
  const isGenerating = ref(false);
  const error = ref<string | null>(null);

  async function generatePdfFromOrder(item: mongoOrder) {
    isGenerating.value = true;
    error.value = null;

    try {
      const htmlPdf = await OrdersService().getHtmlPdfOrder(item._id);
      await generatePdf(htmlPdf);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Une erreur est survenue';
    } finally {
      isGenerating.value = false;
    }
  }

  function generatePdf(html: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const element = document.createElement('div');
      element.innerHTML = html;
      document.body.appendChild(element);

      html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('facture.pdf');
        
        document.body.removeChild(element);
        resolve();
      }).catch(error => {
        document.body.removeChild(element);
        reject(error);
      });
    });
  }

  return {
    generatePdfFromOrder,
    isGenerating,
    error
  };
}