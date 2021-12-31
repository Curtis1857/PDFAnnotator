using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iTextEasyCS
{

    public class AnnotateInstruction
    {
        public string MethodName { get; set; }
        public float X1 { get; set; }
        public float Y1 { get; set; }
        public float X2 { get; set; }
        public float Y2 { get; set; }
        public string Unit { get; set; }
        public float Radius { get; set; }
        public string Color { get; set; }
        public string Text { get; set; }
        public bool Fill { get; set; }
    }
    public class Tester
    {
        public float X1 { get; set; }
    }

    public class testerHolder
    {
        public List<Tester> YEP { get; set; }
        public List<float> Nope { get; set; }
        public float COW { get; set; }
    }
    partial class PDFWriter
    {
        public void AnnotatePdf(string originalFile, string annotatedfile, List<AnnotateInstruction> Instructions)
        {
            //var x = new iTextEasyCS.PDFWriter();
            //x.ScaleMode = ScaleModes.Inches;
            //x.AnnotatePage(originalFile, annotatedfile);
            //new iTextEasyCS.PDFWriter();
            //ScaleMode = ScaleModes.Inches;
            AnnotatePage(originalFile, annotatedfile);
            foreach (var inst in Instructions)
            {

                //ForeColor = System.Drawing.Color.Black;
                //add color here
                switch (inst.MethodName)
                {
                    case "Line":
                        Line(false, inst.X1, inst.Y1, false, inst.X2, inst.Y2);
                        //x.Line(false, inst.X1, inst.Y1, false, inst.X2, inst.Y2);
                        break;
                    case "Circle":
                        Circle(false, inst.X1, inst.Y1, inst.Radius);
                        //x.Circle(false, inst.X1, inst.Y1, inst.Radius);
                        break;
                    case "Rectangle":
                        Rectangle(false, inst.X1, inst.Y1, false, inst.X2, inst.Y2, 0, inst.Fill);
                        //x.Rectangle(false, inst.X1, inst.Y1, false, inst.X2, inst.Y2, 0, inst.Fill);
                        break;
                    case "Write":
                        FontAlignment = TextAlignment.LeftBottom;
                        WriteAt(false, inst.X1, inst.Y1, inst.Text);
                        //x.WriteAt(false, inst.X1, inst.Y1, inst.Text);
                        break;
                }
            }
           Close();
                ////x1 y1 x2 y2
                //x.Line(false, .1f, .1f, false, 2, 2);
                ////x1 y1 rad
                //x.Circle(false, 1, 1, 1);

                //x.ForeColor = System.Drawing.Color.Black;
                //x.FillColor = System.Drawing.Color.Red;
                ////x1 y1 x2 y2, fill
                //x.Rectangle(false, 1, 1, false, 2, 2, 0, true);
                ////x1 y1 text
                //x.WriteAt(false, 1, 2, "cat man do");

                //x.ForeColor = System.Drawing.Color.Blue;
                //x.Close();

                //x.Line(false, .1f, .1f, false, 2, 2);
                ////x1 y1 rad
                //x.Circle(false, 1, 1, 1);

                //x.ForeColor = System.Drawing.Color.Black;
                //x.FillColor = System.Drawing.Color.Red;
                ////x1 y1 x2 y2, fill
                //x.Rectangle(false, 1, 1, false, 2, 2, 0, true);
                ////x1 y1 text
                //x.WriteAt(false, 1, 2, "cat man do");

                //x.ForeColor = System.Drawing.Color.Blue;
                //x.Close();



        }
    }
}
