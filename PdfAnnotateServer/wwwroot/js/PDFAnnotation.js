//////heres the plan
//////add lines to pdf they can be moved by either end of line by circles that appear or get darker on hover
//////when placed the postion of both ends is saved by x y percentage
//////hit save these values are send to server turned into proper unit and the pdf is stamped

//////1: button that adds line to page with circles on either side
//////2: when moving around save location of line and name
//////3: send line location to server
//////4: convert values to unit and send through service

//////make all annos use same list different index name try to reuse most on the logic
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
    oImg.scale(hundredPercent * c.clientWidth)
    oImg.set({ left: oImg.getScaledWidth() / 2, top: oImg.getScaledHeight() / 2 });
    canF.add(oImg);

    //all cordinates are 0 - 1 based off percentages
    ImageSize["width"] = oImg.getScaledWidth()
    ImageSize["height"] = oImg.getScaledHeight()
    ImageSize["heightPercent"] = 1 / oImg.getScaledHeight()
    ImageSize["widthPercent"] = 1 / oImg.getScaledWidth()


    //var text = canF.add(new fabric.Text('', {
    //    left: 10, //Take the block's position
    //    top: 10,
    //    fill: 'black'
    //}));
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
    //moves lines when moving circle handle
    p.RightLine && p.RightLine.set({ 'x2': p.left, 'y2': p.top });
    p.LeftLine && p.LeftLine.set({ 'x1': p.left, 'y1': p.top });
    //stores boths ends of line as needed
    updateLineList(p)

    canF.renderAll();
});
canF.on('object:moved', function (e) {
    var p = e.target;

    console.log(p)
    console.log(p.InstructionIndex)
    console.log(AnnoLineList)
});

canF.on('text:editing:exited', function (e) {
    var p = e.target;

    console.log("selection:changed")
    console.log(p.text)
    console.log(p.InstructionIndex)
    console.log(AnnoLineList)
});

//canF.on('text:selection:changed', function (e) {

//    console.log("selection:changed")
    
//});

//canF.on('text:event:changed', function (e) {

//    console.log("event:changed")

//});

canF.on('text:editing:entered', function (e) {

    console.log("editing:entered")
    //disable save button here so cant rush save?

});

canF.on('text:editing:exited', function (e) {
    var p = e.target
    console.log("editing:exited")
    console.log(p)
    updateLineList(p)

});

//fabric.IText.prototype.onKeyDown = (function (e) {
//    console.log("hey down")
//    console.log(e)
//})
canF.on('object:scaled', function (e) {
    var p = e.target;
    p.IsCircle && resetCircleStroke()
    updateLineList(p)

    function resetCircleStroke(){
        p.strokeWidth = p.SetStrokeWidth / p.scaleX
    }


});

canF.on('mouse:up', function (e) {
    var p = e.target;
    //updateLineList(p)
    //save element in js and use this to make changes to element and save changes
    console.log(p)
    console.log(AnnoLineList)


});

function MakeRectangle(index) {
    var rect = new fabric.Rect({
        top: 10,
        left: 10,
        width: 10,
        height: 20,
        fill: '#f55',
        opacity: 0.7
    });
    rect.setControlVisible('mtr', false)
    canF.add(rect)
}
function MakeTextAnnotation(index) {
    var text = new fabric.IText('Text', {
        fontFamily: 'arial',
        fontSize: 16,
        left: 10,
        top: 10,
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
    text["IsText"] = true
    text["InstructionIndex"] = index
    AnnoLineList.push({ MethodName: "Write", Unit: "percent", X1: offSetTextX(text) * ImageSize.widthPercent, Y1: offSetTextY(text) * ImageSize.heightPercent, Text: text.text })
    canF.add(text)
}
function makeCircle(index) {
    console.log("start cirlce making")
    var x1 = 250
    var y1 = 250

    var radius = 12
    AnnoLineList.push({ MethodName: "Circle", Unit: "percent", X1: x1 * ImageSize.widthPercent, Y1: y1 * ImageSize.heightPercent, Radius: radius * ImageSize.widthPercent })
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
        original1: newXY(),
        slideCircle: true,

        
    });
    c.setControlVisible('mt', false)
    c.setControlVisible('mb', false)
    c.setControlVisible('mr', false)
    c.setControlVisible('ml', false)
    c.setControlVisible('mtr', false)
    c["IsCircle"] = true
    c["InstructionIndex"] = index
    canF.add(c);

}

function MakeLineAnnotation(index) {
    var x1 = 250
    var y1 = 250
    var x2 = 400
    var y2 = 250
    var lineTop = makeLine([x1, y1, x2, y2])
    AnnoLineList.push({ MethodName: "Line", Unit: "percent", X1: x1 * ImageSize.widthPercent, Y1: y1 * ImageSize.heightPercent, X2: x2 * ImageSize.widthPercent, Y2: y2 * ImageSize.heightPercent })
    circleL = makeLineHandleCircle(lineTop.get('x1'), lineTop.get('y1'), index, "LeftLine", lineTop)
    circleR = makeLineHandleCircle(lineTop.get('x2'), lineTop.get('y2'), index, "RightLine", lineTop)
    canF.add(circleL, circleR);
    canF.add(lineTop);
}


function updateLineList(p) {
    p.RightLine && assignRight()
    p.LeftLine && assignLeft()
    p.IsCircle && assignCircle()
    p.IsText && assignText()

    function assignRight() {
        AnnoLineList[p.InstructionIndex].Y2 = p.RightLine.y2 * ImageSize.heightPercent
        AnnoLineList[p.InstructionIndex].X2 = p.RightLine.x2 * ImageSize.widthPercent
    }

    function assignLeft() {
        console.log(p.InstructionIndex)
        AnnoLineList[p.InstructionIndex].Y1 = p.LeftLine.y1 * ImageSize.heightPercent
        AnnoLineList[p.InstructionIndex].X1 = p.LeftLine.x1 * ImageSize.widthPercent

    }
    function assignText() {
        AnnoLineList[p.InstructionIndex].X1 = offSetTextX(p) * ImageSize.widthPercent
        AnnoLineList[p.InstructionIndex].Y1 = offSetTextY(p) * ImageSize.heightPercent
        AnnoLineList[p.InstructionIndex].Text = p.text
    
    }
    function assignCircle() {
        AnnoLineList[p.InstructionIndex].Y1 = p.top * ImageSize.heightPercent
        AnnoLineList[p.InstructionIndex].X1 = p.left * ImageSize.widthPercent
        AnnoLineList[p.InstructionIndex].Radius = (p.radius * p.scaleX) * ImageSize.widthPercent
    }
}

function offSetTextY(p) {
    return p.top + (p.fontSize / 2)
}

function offSetTextX(p) {
    return p.left - (p.width / 2)
}

function GetAndUpdateListIndex() {
    var annotateIndex = Number($("#ListIndex").val())
    $("#ListIndex").val(annotateIndex + 1)
    return annotateIndex
}
function makeLine(coords) {
    const Line = new fabric.Line(coords, {
        fill: 'black',
        stroke: 'black',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        offsetX: 10,
        original2: newXY(),
        original1: newXY()
    });
    Line.original1.set({ x: Line.x1, y: Line.y1 })
    Line.original2.set({ x: Line.x2, y: Line.y2 })
    return Line
}

function makeLineHandleCircle(left, top, lineIndex, name, lineTop) {
    var radius = 12
    var c = new fabric.Circle({
        left: left,
        top: top,
        OriTop: top,
        strokeWidth: 5,
        radius: radius,
        fill: '#69b5e8',
        opacity: 0.2,
        stroke: '#69b5e8',
        lockSkewing: true,
        original1: newXY(),
        slideCircle: true,
    });
    c.original1.set({ x: left, y: top })

    c.hasControls = c.hasBorders = false;

    c["InstructionIndex"] = lineIndex
    c[name] = lineTop;
    return c;
}
function newXY() {
    return {
        x: 0,
        y: 0,
        set(a) {
            if (a.x) this.x = a.x;
            if (a.y) this.y = a.y;
        }
    }
}