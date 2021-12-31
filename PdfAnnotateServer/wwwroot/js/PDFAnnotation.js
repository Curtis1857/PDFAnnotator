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
    var annotateLineIndex = Number($("#ListIndex").val())
    MakeLineAnnotation(annotateLineIndex)
    $("#ListIndex").val(annotateLineIndex + 1)
})

$("#AddCircle").click((e) => {
    var annotateCircleIndex = Number($("#ListIndex").val())
    makeCircle(annotateCircleIndex)
    $("#ListIndex").val(annotateCircleIndex + 1)

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

    function assignRight() {
        AnnoLineList[p.InstructionIndex].Y2 = p.RightLine.y2 * ImageSize["heightPercent"]
        AnnoLineList[p.InstructionIndex].X2 = p.RightLine.x2 * ImageSize["widthPercent"]
    }

    function assignLeft() {
        console.log(p.InstructionIndex)
        AnnoLineList[p.InstructionIndex].Y1 = p.LeftLine.y1 * ImageSize["heightPercent"]
        AnnoLineList[p.InstructionIndex].X1 = p.LeftLine.x1 * ImageSize["widthPercent"]

    }

    function assignCircle() {
        
        AnnoLineList[p.InstructionIndex].Y1 = p.top * ImageSize.heightPercent
        AnnoLineList[p.InstructionIndex].X1 = p.left * ImageSize.widthPercent
        AnnoLineList[p.InstructionIndex].Radius = (p.radius * p.scaleX) * ImageSize.widthPercent
    }
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