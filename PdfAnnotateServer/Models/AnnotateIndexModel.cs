using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

namespace PdfAnnotateServer.Models
{
    public class AnnotateIndexModel
    {
        public string Path { get; set; }
        public Image Image { get; set; }
        public byte[] Byt { get; set; }
    }
}
