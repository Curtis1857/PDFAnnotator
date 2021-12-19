using Ghostscript.NET.Rasterizer;
using iTextEasyCS;
using Microsoft.AspNetCore.Mvc;
using PdfAnnotateServer.Models;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace PdfAnnotateServer.Controllers
{
    public class AnnotateApi : Controller
    {
        public IActionResult Index1()
        {
            var inputPdfPath = @"C:\Users\curti\source\repos\PDFAnnotator\PdfAnnotateServer\PDfs\order_6.pdf";
            string outputPath = @"C:\Users\curti\source\repos\PDFAnnotator\PdfAnnotateServer\wwwroot\Images";
            int desired_dpi = 300;
            var path = new AnnotateIndexModel();
            using (GhostscriptRasterizer rasterizer = new GhostscriptRasterizer())
            {
                rasterizer.CustomSwitches.Add("-dUseCropBox");
                rasterizer.CustomSwitches.Add("-c");
                rasterizer.CustomSwitches.Add("[/CropBox [24 72 559 794] /PAGES pdfmark");
                rasterizer.CustomSwitches.Add("-f");

                rasterizer.Open(inputPdfPath);

                for (int pageNumber = 1; pageNumber <= rasterizer.PageCount; pageNumber++)
                {
                    var fileName = "Page-" + pageNumber.ToString() + ".png";
                    string pageFilePath = Path.Combine(outputPath, fileName);


                    Image img = rasterizer.GetPage(desired_dpi, pageNumber);
                    img.Save(pageFilePath, ImageFormat.Png);
                    path.Path = fileName;
                    Console.WriteLine(pageFilePath);

                }
            }

            return View(path);
        }
        public IActionResult Index()
        {
            var inputPdfPath = @"C:\Users\curti\source\repos\PDFAnnotator\PdfAnnotateServer\PDfs\order_6.pdf";
            string outputPath = @"C:\Users\curti\source\repos\PDFAnnotator\PdfAnnotateServer\wwwroot\Images";
            int desired_dpi = 300;
            var path = new AnnotateIndexModel();
            using (GhostscriptRasterizer rasterizer = new GhostscriptRasterizer())
            {
                rasterizer.CustomSwitches.Add("-dUseCropBox");
                rasterizer.CustomSwitches.Add("-c");
                rasterizer.CustomSwitches.Add("[/CropBox [24 72 559 794] /PAGES pdfmark");
                rasterizer.CustomSwitches.Add("-f");

                rasterizer.Open(inputPdfPath);

                for (int pageNumber = 1; pageNumber <= rasterizer.PageCount; pageNumber++)
                {
                    var fileName = "Page-" + pageNumber.ToString() + ".png";
                    string pageFilePath = Path.Combine(outputPath, fileName);


                    Image img = rasterizer.GetPage(desired_dpi, pageNumber);
                    img.Save(pageFilePath, ImageFormat.Png);
                    path.Path = fileName;
                    Console.WriteLine(pageFilePath);
                    
                }
            }
            
            return View(path);
        }

        [HttpPost]
        public IActionResult AnnotatePdf(List<AnnotateInstruction> instructions)
        {
            var oldPath = @"C:\Users\curti\source\repos\PDFAnnotator\PdfAnnotatorEasy\Pdfs\order_6.pdf";
            var newPath = @"C:\Users\curti\source\repos\PDFAnnotator\PdfAnnotatorEasy\Pdfs\order_6Temp3.pdf";

            var x = new PDFWriter();
            x.ScaleMode = ScaleModes.Inches;

            //var instructions = new List<AnnotateInstruction> {
            //    new AnnotateInstruction{ MethodName ="Line", X1 = .1f, Y1 = .1f, X2 = 4, Y2 = 4 },
            //    new AnnotateInstruction{ MethodName = "Write",  X1 = .1f, Y1 = 1f, Text = "this is fucking awesome" }
            //};

            x.AnnotatePdf(oldPath, newPath, instructions);
            return View();
        }
    }
}
