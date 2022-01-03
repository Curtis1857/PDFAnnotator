var AnnoLineList = []
var ImageSize = {}

var c = document.getElementById("canvas");
fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

var canF = this.__canvas = new fabric.Canvas('canvas', {
    width: c.clientWidth,
    height: c.clientHeight,
    selection: false
});

fabric.Image.fromURL(imageName, function (oImg) {

    //scalels image to fit window and centers
    var hundredPercent = 1 / oImg.getScaledWidth()


    console.log("original width: " + oImg.width)
    
    //this is 11 point or 10 point
    //var LetterPerLine = 126


    //hard code 
    //pixel in 8 font
    //pixel in 10 font
    //pixel in 12 font
    //pixel in 16 font
    //pixel in 20 font
    
    //for font size 12
    var LetterPerLine = 97.3
    var letterWidth = LetterPerLine / 2
    //leterPerline is amount of letter written on a line using font 12
    //fabric.js needs font width to calc font size and does not recognize decimal 

    oImg.scale(hundredPercent * c.clientWidth)
    oImg.set({ left: oImg.getScaledWidth() / 2, top: oImg.getScaledHeight() / 2 });
    canF.add(oImg);

    var pixelFontSize = oImg.getScaledWidth() / letterWidth

    //all cordinates are 0 - 1 based off percentages
    ImageSize["width"] = oImg.getScaledWidth()
    ImageSize["height"] = oImg.getScaledHeight()
    ImageSize["heightPercent"] = 1 / oImg.getScaledHeight()
    ImageSize["widthPercent"] = 1 / oImg.getScaledWidth()
    ImageSize["Img"] = oImg
    ImageSize["ScaledFontWidth"] = pixelFontSize

}, {
    selectable: false,
    evented: false,
});

$("#save").click((e) => {
    var formData = new FormData();
    var index = 0
    for (var intstuction of AnnoLineList) {
        for (var prop of Object.getOwnPropertyNames(intstuction)) {
            formData.append(`instructions[${index}].${prop}`, intstuction[prop]);
        }

        index++
    }
    $.ajax(
        {
            type: "Post",
            url: anno_annotatePDFPercent,
            data: formData,
            processData: false,
            contentType: false,
            dataType: "text",
            success: function (data) {
            }
        });
})

$("#AddLine").click((e) => {
    MakeLineAnnotation(GetAndUpdateListIndex())  
})

$("#AddCircle").click((e) => {
    makeCircle(GetAndUpdateListIndex())
})

$("#AddText").click((e) => {
    MakeTextAnnotation(GetAndUpdateListIndex())
})

$("#AddRectangle").click((e) => {
    MakeRectangle(GetAndUpdateListIndex())
})

canF.on('object:moving', function (e) {
    var p = e.target;
    p['when:object:moving'] && p['when:object:moving']()
    updateLineList(p)

    canF.renderAll();
});

canF.on('object:moved', function (e) {
    var p = e.target;
    console.log(p)
    console.log(p.InstructionIndex)
    console.log(AnnoLineList)
});

canF.on('text:editing:entered', function (e) {

    console.log("editing:entered")
    //disable save button here so cant rush save?

});

canF.on('text:editing:exited', function (e) {
    var p = e.target
    updateLineList(p)
    //undisable save button here

});

canF.on('object:scaling', function (e) {
    var p = e.target;
    p["when:object:scaled"] && p["when:object:scaled"]()
    updateLineList(p)
});

function MakeRectangle(index) {
    var rect = new fabric.Rect({
        top: 50,
        left: 50,
        width: 10,
        height: 20,
        strokeWidth: 1,
        SetStrokeWidth: 1,
        fill: 'transparent',
        stroke: 'black',
        //fill: '#f55',
        //opacity: 0.7
        noScaleCache: false,
    });

    rect.setControlVisible('mtr', false)

    rect["InstructionIndex"] = index
    rect["IsRectangle"] = true
    rect["UpdateAnnoList"] = function () {
        AnnoLineList[this.InstructionIndex].Y1 = offSetY1(this) * ImageSize.heightPercent
        AnnoLineList[this.InstructionIndex].X1 = offSetX1(this) * ImageSize.widthPercent
        AnnoLineList[this.InstructionIndex].Y2 = offSetY2(this) * ImageSize.heightPercent
        AnnoLineList[this.InstructionIndex].X2 = offSetX2(this) * ImageSize.widthPercent
    }
    rect["when:object:scaled"] = setRectangle

    canF.add(rect)

    AnnoLineList.push({ MethodName: "Rectangle", Unit: "percent", X1: offSetX1(rect) * ImageSize.widthPercent, Y1: offSetY1(rect) * ImageSize.heightPercent, X2: offSetX2(rect) * ImageSize.widthPercent, Y2: offSetY2(rect) * ImageSize.heightPercent })

    function setRectangle() {
        this.set({ width: this.width * this.scaleX })
        this.set({ height: this.height * this.scaleY })
        this.scaleX = 1
        this.scaleY = 1
    }

    function offSetX1(p) {
        return p.left - ((p.width) / 2)
    }

    function offSetY1(p) {
        return p.top - ((p.height ) / 2)
    }

    function offSetX2(p) {
        return p.left + ((p.width ) / 2)
    }

    function offSetY2(p) {
        return p.top + ((p.height) / 2)
    }
}
function MakeTextAnnotation(index) {


    var text = new fabric.IText('Payment method', {
        fontFamily: 'Cambria',
        fontSize: ImageSize["ScaledFontWidth"],
        left: 20,
        top: 20,
    });

    text.setControlVisible('mt', false)
    text.setControlVisible('mb', false)
    text.setControlVisible('mr', false)
    text.setControlVisible('ml', false)
    text.setControlVisible('bl', false)
    text.setControlVisible('tl', false)
    text.setControlVisible('br', false)
    text.setControlVisible('tr', false)
    text.setControlVisible('mtr', false)

    text["InstructionIndex"] = index
    text["UpdateAnnoList"] = function () {
        AnnoLineList[this.InstructionIndex].X1 = offSetTextX(this) * ImageSize.widthPercent
        AnnoLineList[this.InstructionIndex].Y1 = offSetTextY(this) * ImageSize.heightPercent
        AnnoLineList[this.InstructionIndex].Text = this.text
    }

    canF.add(text)

    AnnoLineList.push({ MethodName: "Write", Unit: "percent", X1: offSetTextX(text) * ImageSize.widthPercent, Y1: offSetTextY(text) * ImageSize.heightPercent, Text: text.text })

    function offSetTextY(p) {
        return p.top + (p.fontSize / 2)
    }

    function offSetTextX(p) {
        return p.left - (p.width / 2)
    }
}
function makeCircle(index) {
    console.log("start cirlce making")
    var x1 = 250
    var y1 = 250

    var radius = 12
    var c = new fabric.Circle({
        left: x1,
        top: y1,
        OriTop: y1,
        strokeWidth: 1,
        SetStrokeWidth: 1,
        radius: radius,
        fill: 'transparent',
        //opacity: 0.2,
        stroke: 'black',
        lockSkewing: true,
        slideCircle: true,
        noScaleCache: false,    
    });

    c.setControlVisible('mt', false)
    c.setControlVisible('mb', false)
    c.setControlVisible('mr', false)
    c.setControlVisible('ml', false)
    c.setControlVisible('mtr', false)

    c["InstructionIndex"] = index
    c["UpdateAnnoList"] = function() {
        AnnoLineList[this.InstructionIndex].Y1 = this.top * ImageSize.heightPercent
        AnnoLineList[this.InstructionIndex].X1 = this.left * ImageSize.widthPercent
        AnnoLineList[this.InstructionIndex].Radius = (this.radius * this.scaleX) * ImageSize.widthPercent
    }
    c["when:object:scaled"] = setStroke

    canF.add(c);

    AnnoLineList.push({ MethodName: "Circle", Unit: "percent", X1: x1 * ImageSize.widthPercent, Y1: y1 * ImageSize.heightPercent, Radius: radius * ImageSize.widthPercent })
}
function MakeLineAnnotation(index) {
    var x1 = 250
    var y1 = 250
    var x2 = 400
    var y2 = 250
    var lineTop = makeLine([x1, y1, x2, y2])

    circleL = makeLineHandleCircle(lineTop.get('x1'), lineTop.get('y1'), index, lineTop, assignLeft, updateLeftLine)
    circleR = makeLineHandleCircle(lineTop.get('x2'), lineTop.get('y2'), index, lineTop, assignRight, updateRightLine)

    canF.add(circleL, circleR);
    canF.add(lineTop);

    AnnoLineList.push({ MethodName: "Line", Unit: "percent", X1: x1 * ImageSize.widthPercent, Y1: y1 * ImageSize.heightPercent, X2: x2 * ImageSize.widthPercent, Y2: y2 * ImageSize.heightPercent })

    function updateRightLine() {
        this.RefLine.set({ 'x2': this.left, 'y2': this.top });

    }

    function updateLeftLine() {
        this.RefLine.set({ 'x1': this.left, 'y1': this.top });
    }

    function assignRight() {
        AnnoLineList[this.InstructionIndex].Y2 = this.RefLine.y2 * ImageSize.heightPercent
        AnnoLineList[this.InstructionIndex].X2 = this.RefLine.x2 * ImageSize.widthPercent
    }

    function assignLeft() {
        AnnoLineList[this.InstructionIndex].Y1 = this.RefLine.y1 * ImageSize.heightPercent
        AnnoLineList[this.InstructionIndex].X1 = this.RefLine.x1 * ImageSize.widthPercent
    }

    function makeLine(coords) {
        const Line = new fabric.Line(coords, {
            fill: 'black',
            stroke: 'black',
            strokeWidth: 1,
            selectable: false,
            evented: false,
            offsetX: 10,
            
        });

        return Line
    }

    function makeLineHandleCircle(left, top, lineIndex, lineTop, UpdateAnnoListCallBack, UpdateLineCallBack) {
        var radius = 12
        var c = new fabric.Circle({
            left: left,
            top: top,
            OriTop: top,
            strokeWidth: 5,
            radius: radius,
            fill: '#69b5e8',
            opacity: 0,
            stroke: '#69b5e8',
            lockSkewing: true,
            slideCircle: true,
            hasBorders: false
        });

        c.setControlVisible('mt', false)
        c.setControlVisible('mb', false)
        c.setControlVisible('mr', false)
        c.setControlVisible('ml', false)

        c.setControlVisible('tl', false)
        c.setControlVisible('bl', false)
        c.setControlVisible('tr', false)
        c.setControlVisible('br', false)
        //c.setControlVisible('ml', false)
        c.setControlVisible('mtr', false)

        c["InstructionIndex"] = lineIndex
        c["RefLine"] = lineTop;
        c["UpdateAnnoList"] = UpdateAnnoListCallBack
        c['when:object:moving'] = UpdateLineCallBack
        return c;
    }

}


function setStroke() {
    this.strokeWidth = this.SetStrokeWidth / this.scaleX
}


function updateLineList(p) {
    p.UpdateAnnoList && p.UpdateAnnoList()
}

function GetAndUpdateListIndex() {
    var annotateIndex = Number($("#ListIndex").val())
    $("#ListIndex").val(annotateIndex + 1)
    return annotateIndex
}