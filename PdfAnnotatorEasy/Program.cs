﻿using iTextSharp.text;
using iTextSharp.text.pdf;
using Shane32.EasyPDF;
using System;
using System.Collections;
using System.Collections.Generic;


namespace PDFAnnotator
{
    class Program
    {
        static void Main(string[] args)
        {       
            var oldPath = @"C:\Users\Curtis\Source\Repos\PDFAnnotator\PdfAnnotatorEasy\Pdfs\order_6Temp5.pdf";
            var newPath = @"C:\Users\Curtis\Source\Repos\PDFAnnotator\PdfAnnotatorEasy\Pdfs\order_6Temp6.pdf";

            var reader = new PdfReader(oldPath);
            var x = new PDFWriter(newPath);
            x.ScaleMode = ScaleModes.Inches;

            x.AnnotatePage(reader);
            
            x.Line(false, .1f, .1f, false, 2, 2);
            x.Circle(false, 1, 1, 1);

            x.ForeColor = System.Drawing.Color.Red;
            x.FillColor = System.Drawing.Color.Green;
            x.Rectangle(false, 1, 1, false, 2, 2, 0, true);

            x.WriteAt(false, 1, 2, "cat man do");

            x.ForeColor = System.Drawing.Color.Blue;

            x.Close();
            return;

            var colorDictionary = new Dictionary<string, System.Drawing.Color>
            {
                { "Red", System.Drawing.Color.Red },
                { "Black", System.Drawing.Color.Black },
                { "Blue", System.Drawing.Color.Blue }
            };

              void AnnotatePdf(string originalFile, string annotatedfile, List<AnnotateInstruction> Instructions)
            {
                var stream = System.IO.File.Create(newPath);
                var x = new PDFWriter(stream);
                x.ScaleMode = ScaleModes.Inches;
                x.AnnotatePage(originalFile);
                foreach (var inst in Instructions)
                {

                    //add color here
                    switch (inst.MethodName)
                    {
                        case "Line":
                            x.Line(false, inst.X1, inst.Y1, false, inst.X2, inst.Y2);
                            break;
                        case "Circle":
                            x.Circle(false, inst.X1, inst.Y1, inst.Radius);
                            break;
                        case "Rectangle":
                            x.Rectangle(false, inst.X1, inst.Y1, false, inst.X2, inst.Y2, 0, inst.Fill);
                            break;
                        case "Write":
                            x.WriteAt(false, inst.X1, inst.Y1, inst.Text);
                            break;
                    }
                    //x1 y1 x2 y2
                    x.Line(false, .1f, .1f, false, 2, 2);
                    //x1 y1 rad
                    x.Circle(false, 1, 1, 1);

                    x.ForeColor = System.Drawing.Color.Black;
                    x.FillColor = System.Drawing.Color.Red;
                    //x1 y1 x2 y2, fill
                    x.Rectangle(false, 1, 1, false, 2, 2, 0, true);
                    //x1 y1 text
                    x.WriteAt(false, 1, 2, "cat man do");

                    x.ForeColor = System.Drawing.Color.Blue;
                    x.Close();
                }

            }


            void quiryPdf()
            {
                PdfReader reader = new PdfReader(oldPath);
                //reader.ScaleMode = ScaleModes.Inches;
                Console.WriteLine("PDF Version: " + reader.PdfVersion);
                var widthInch = (reader.GetPageSize(1).Width / 72).ToString();
                var heigthInch = (reader.GetPageSize(1).Height/ 72).ToString();
                Console.WriteLine(widthInch + "//" + heigthInch);
                Console.WriteLine("Number of pages: " + reader.NumberOfPages);
                Console.WriteLine("File length: " + reader.FileLength);
                Console.WriteLine("Encrypted? " + reader.IsEncrypted());
            }

            (PdfStamper, PdfReader) createStamper()
            {

                PdfReader reader = new PdfReader(oldPath);
                Console.WriteLine("Tampered? " + reader.Tampered);
                var stream = System.IO.File.Create(newPath);
                PdfStamper stamper = new PdfStamper(reader, stream);
                Console.WriteLine("Tampered? " + reader.Tampered);
                return (stamper, reader);
            }
            void addText(PdfStamper stamper)
            {
                PdfContentByte over = stamper.GetOverContent(1);
                over.BeginText();
                var bf = FontFactory.GetFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED, 14);
                
                over.SetFontAndSize(bf.BaseFont, 18);
                over.SetTextMatrix(30, 30);
                over.ShowText("page " + 1);
                over.EndText();
                over.SetRgbColorStroke(0xFF, 0x00, 0x00);
                over.SetLineWidth(5f);
                over.Ellipse(250, 450, 350, 550);
                over.Stroke();
                stamper.Close();
                
                
            }

            void updatePDFProps(PdfStamper stamper, PdfReader reader)
            {
                // try out on version 5 pdf
                var info = reader.Info;
                foreach(DictionaryEntry t in info) { 
                Console.WriteLine(t.Key.ToString() + " " + t.Value.ToString());
                }
                //info.put("Subject", "Hello World");
                //info.put("Author", "Bruno Lowagie");
                //stamper.SetMoreInfo(info);
                stamper.MoreInfo = new Hashtable();
                stamper.MoreInfo.Add("Author", "Bruno Lowagie");
                stamper.Close();
            }

            //   public void onGenericTag(PdfWriter writer, Document document,
            //Rectangle rect, String text)
            //   {
            //       PdfAnnotation annotation = new PdfAnnotation(
            //       writer, new Rectangle(
            //       rect.getRight() + 10, rect.getBottom(),
            //       rect.getRight() + 30, rect.getTop()));
            //       annotation.put(PdfName.SUBTYPE, PdfName.TEXT);
            //       annotation.setTitle("Text annotation");
            //       annotation.put(PdfName.OPEN, PdfBoolean.PDFFALSE);
            //       annotation.put(PdfName.CONTENTS,
            //       new PdfString(String.format("Icon: %s", text)));
            //       annotation.put(PdfName.NAME, new PdfName(text));
            //       writer.addAnnotation(annotation);
            //       Console.WriteLine("Hello World!");
        }
        
        class AnnotateInstruction
        {
            public string MethodName { get; set; }
            public float X1 { get; set; }
            public float Y1 { get; set; }
            public float X2 { get; set; }
            public float Y2 { get; set; }
            public float Radius { get; set; }
            public string Color { get; set; }
            public string Text { get; set; }
            public bool Fill { get; set; }

        }
        }
    }
