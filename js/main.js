/* 表情包生成器 主 JavaScript 文件 */

var Canvas = function (canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    // 文字拖拽状态
    this.isDragging = false;
    // 背景图片
    this.image;
    // 保存画布上的文字
    this.text;
}


Canvas.prototype.clearCanvas = function () {
    // 去除所有圆圈
    this.text = [];

    // 重新绘制画布.
    this.drawCanvas();
}

Canvas.prototype.drawCanvas = function () {
    // 清除画布，准备绘制
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 绘制背景图
    if (this.image != undefined) {
        this.context.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    }

    // 判断 Canvas 是否存在文本
    if (this.text == null) {
        // 新建文本
        this.drawText();
        return false;
    } else {
        // 更新文本
        this.text.fontSize = fontsizeElm.value;
        this.text.fontFace = fontFaceElm.value;
        this.text.fillStyle = fontColorElm.value;
        this.text.strokeStyle = fontBorderColorElm.value;
        this.text.lineWidth = lineWidthElm.value;
        this.text.content = inputElm.value;
    }

    var text = this.text;
    // 确定文本宽高
    var tmpDivElm = document.getElementById('tmp-div');
    tmpDivElm.style['font'] = text.fontSize + 'pt' + ' ' + text.fontFace;
    // 使 line-height == fontsize
    tmpDivElm.style['line-height'] = text.fontSize + 'pt';
    tmpDivElm.innerText = text.content;

    // 确定
    text.width = this.context.measureText(text.content).width;
    text.height = parseInt(text.fontSize);

    // 结束

    // 判断是否选中
    if (text.isSelected) {
        // 为选中边框设置虚线样式 暂存之前线宽状态
        this.context.save();
        this.context.setLineDash([5, 10]);
        this.context.strokeStyle = '#f36';
        this.context.strokeRect(text.x, text.y - text.height, text.width, text.height);
        // 选中边框绘制完成，恢复已暂存的线宽状态，避免对其他图形绘制造成干扰
        this.context.restore();
    }

    this.context.font = text.fontSize + 'pt' + ' ' + text.fontFace;
    this.context.fillStyle = text.fillStyle;
    this.context.fillText(text.content, text.x, text.y);
    this.context.strokeStyle = text.strokeStyle;
    // 手动设置当描边线宽为 0 时，取消描边 <- lineWidth 宽度 为 0 等值时会忽略
    if (text.lineWidth != 0) {
        this.context.lineWidth = text.lineWidth;
        this.context.strokeText(text.content, text.x, text.y);
    }
}

Canvas.prototype.drawText = function () {
    var ctx = this.context;
    var text = new Text(inputElm.value, fontsizeElm.value, fontFace.value, 'white', 'black', '1', Math.random());
    this.text = text;

    // 更新画布
    this.drawCanvas();
}

Canvas.prototype.stopDragging = function (e) {
    this.isDragging = false;
}

Canvas.prototype.dragText = function (e) {
    var canvas = this.canvas;
    var text = this.text;
    if (this.isDragging == true) {
        // 判断拖拽对象是否存在
        if (text != null) {
            // 取得鼠标位置
            var clickX = e.pageX - canvas.offsetLeft;
            var clickY = e.pageY - canvas.offsetTop;

            // 将文本移动到鼠标位置
            text.x = clickX - text.clickXtoleft;
            text.y = clickY + text.clickYtoBottom;

            // 判断文本是否超出上边界
            if (text.canMoveUp(canvas)) {
                // 当超出边界时，重置文本为上边界位置
                text.y = text.height;
            }

            // 判断文本是否超出右边界
            if (text.canMoveRight(canvas)) {
                // 当超出边界时，重置文本为右边界位置
                text.x = canvas.width - text.width;
            }

            // 判断文本是否超出下边界
            if (text.canMoveDown(canvas)) {
                // 当超出边界时，重置文本为下边界位置
                text.y = canvas.height;
            }
            
            // 判断文本是否超出左边界
            if (text.canMoveLeft(canvas)) {
                // 当超出边界时，重置文本为左边界位置
                text.x = 0;
            }

            // 更新画布
            this.drawCanvas();
        }
    }
}

// 储存每个文字对象
var Text = function (content, fontSize, fontFace, fillStyle, strokeStyle, lineWidth, random) {
    this.content = content;
    this.fontSize = fontSize || '12';
    this.fontFace = fontFace;
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;
    this.lineWidth = lineWidth;
    this.x = 200;
    this.y = 400;
    this.width;
    this.height;
    this.isSelected = false;
    this.id = random;
    this.clickXtoleft;
    this.clickYtoBottom;
}

Text.prototype.canMoveUp = function () {
    if (this.y - this.height < 0) {
        return true;
    }
    return false;
};

Text.prototype.canMoveRight = function (canvas) {
    console.log(canvas);
    if (this.x + this.width > canvas.width) {
        return true;
    }
    return false;
};

Text.prototype.canMoveDown = function (canvas) {
    if (this.y > canvas.height) {
        return true;
    }
    return false;
};

Text.prototype.canMoveLeft = function () {
    if (this.x <= 0) {
        return true;
    }
    return false;
};

//在某个范围内生成随机数
function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

let circleCanvas = new Canvas("canvas");

let addBtnElm = document.getElementById('add-btn');
let clearBtnElm = document.getElementById('clear-btn');

clearBtnElm.addEventListener('click', function () {
    circleCanvas.clearCanvas();
})

/* 绘图 */
Canvas.prototype.redrawMeme = function (image, topLine, bottomLine) {
    this.image = image;
    var ctx = this.context;
    if (image != null)
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
}

Canvas.prototype.calculate = function (e) {
    if (this.text == null) {
        return false;
    }
    // 确定在画布中的点击位置
    var clickX = e.pageX - canvas.offsetLeft;
    var clickY = e.pageY - canvas.offsetTop;

    // 计算点击与文字的距离 待测试 可能仍然存在问题
    var text = this.text;
    // 文本的最小 Y 和 最大 X
    var textMinY = text.y - text.height;
    var textMaxX = text.x + text.width;

    // 判断点击是否进入了文本区域
    if (this.isEnterRange(clickX, clickY, textMinY, textMaxX, text)) {
        text.isSelected = true;
        this.isDragging = true;
        // 加入点击区域距离 text.x text.y 的距离
        this.text.clickXtoleft = clickX - text.x;
        this.text.clickYtoBottom = text.y - clickY;
    } else {
        text.isSelected = false;
    }

    //更新画布
    circleCanvas.drawCanvas();
}

/**
 * 
 * @param {int} clickX 鼠标在画布中的 X 坐标点击位置
 * @param {int} clickY 鼠标在画布中的 Y 坐标点击位置
 * @param {int} textMinY 文本在画布中的最小 Y 坐标位置
 * @param {int} textMaxX 文本在画布中的最大 X 坐标位置
 * @param {text} text text 对象
 */
Canvas.prototype.isEnterRange = function (clickX, clickY, textMinY, textMaxX, text) {
    if (clickX > text.x && clickX < textMaxX && clickY > textMinY && clickY < text.y) {
        return true;
    }
    return false;
};

Canvas.prototype.resizeCanvas = function (imgWidth, imgHeight) {
    // 800 500 需要定死，否则图片会越传越小
    var ratio = Math.min(800 / imgWidth, 500 / imgHeight);
    this.canvas.width = imgWidth * ratio;
    this.canvas.height = imgHeight * ratio;
}

/* 文字输入 */
let inputElm = document.getElementById('inputText');
inputElm.addEventListener('input', function (e) {
    circleCanvas.drawCanvas();
});

// 文本大小
let fontsizeElm = document.getElementById('fontsize');
fontsizeElm.addEventListener('input', function (e) {
    circleCanvas.drawCanvas();
});
// 文字字体
let fontFaceElm = document.getElementById('fontFace');
fontFaceElm.addEventListener('input', function (e) {
    circleCanvas.drawCanvas();
})

// 文字颜色 写的方法不同导致失效
let fontColorElm = document.getElementById('fontColor');
fontColorElm.addEventListener('input', function (e) {
    circleCanvas.drawCanvas();
});

// 描边颜色 写的方法不同导致失效
let fontBorderColorElm = document.getElementById('fontBorderColor');
fontBorderColorElm.addEventListener('input', function (e) {
    circleCanvas.drawCanvas();
});

// 描边线宽
let lineWidthElm = document.getElementById('lineWidth');
lineWidthElm.addEventListener('input', function (e) {
    console.log(lineWidthElm.value);
    circleCanvas.drawCanvas();

})

/* 选择文件 */
function handleFileSelect(evt) {
    var canvasWidth = 500;
    var canvasHeight = 500;
    var file = evt.target.files[0];



    var reader = new FileReader();
    reader.onload = function (fileObject) {
        // 文件内容 这里是 图片的 base64 格式
        var data = fileObject.target.result;

        // 创造一个 img 对象
        var image = new Image();
        image.onload = function () {
            window.imageSrc = this;

            // 重置 Canvas 大小
            circleCanvas.resizeCanvas(image.width, image.height);

            circleCanvas.redrawMeme(window.imageSrc, null, null);
        }

        // 设置图片为背景图片
        image.src = data;
    };

    // 将文件以 DataURL（即base64）方式读取
    reader.readAsDataURL(file);
}

// 绑定鼠标按住事件
circleCanvas.canvas.addEventListener('mousedown', function (e) {
    circleCanvas.calculate(e);
});

circleCanvas.canvas.addEventListener('mouseup', function (e) {
    circleCanvas.stopDragging(e);
});

circleCanvas.canvas.addEventListener('mouseout', function (e) {
    circleCanvas.stopDragging(e);
});

circleCanvas.canvas.addEventListener('mousemove', function (e) {
    circleCanvas.dragText(e);
});

document.getElementById('selectFile').addEventListener('change', handleFileSelect, false);