using System;
using iTextEasyCS;
using iTextSharp.text.pdf;

namespace PDFAnnotator
{
    class Program
    {
        static void Main(string[] args)
        {
            quiryPdf()
            return; 
            var path = @"C:\Users\curti\source\repos\PDFEditor\PDFEditor\Pdfs\Arduino.pdf";
            PdfReader reader = new PdfReader(path);

            var stream = System.IO.File.Create(@"C:\Users\curti\source\repos\PDFEditor\PDFEditor\Pdfs\ArduinoEdit.pdf");
            PdfStamper stamper = new PdfStamper(reader, stream);
            //stamper.setRotateContents(false);
            var anoo = new PdfAnnotation().
            stamper.AddAnnotation(, 1)
            PdfContentByte canvas = stamper.getOverContent(1);
            ColumnText.showTextAligned(canvas,
             Element.ALIGN_LEFT, new Phrase("Hello people!"), 36, 540, 0);
            stamper.close();

            void quiryPdf()
            {
                PdfReader reader = new PdfReader(@"C:\Users\curti\source\repos\PDFEditor\PDFEditor\Pdfs\Arduino.pdf");
                System.out.println("PDF Version: " + reader.getPdfVersion());
                System.out.println("Number of pages: " +
                 reader.getNumberOfPages());
                System.out.println("File length: " + reader.getFileLength());
                System.out.println("Encrypted? " + reader.isEncrypted());
            }

            public void onGenericTag(PdfWriter writer, Document document,
         Rectangle rect, String text)
            {
                PdfAnnotation annotation = new PdfAnnotation(
                writer, new Rectangle(
                rect.getRight() + 10, rect.getBottom(),
                rect.getRight() + 30, rect.getTop()));
                annotation.put(PdfName.SUBTYPE, PdfName.TEXT);
                annotation.setTitle("Text annotation");
                annotation.put(PdfName.OPEN, PdfBoolean.PDFFALSE);
                annotation.put(PdfName.CONTENTS,
                new PdfString(String.format("Icon: %s", text)));
                annotation.put(PdfName.NAME, new PdfName(text));
                writer.addAnnotation(annotation);
                Console.WriteLine("Hello World!");
        }
    }
}
