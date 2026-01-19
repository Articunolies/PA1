const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let gl;
let canvas;
let positionAttr;
let colorUniform;
let sizeUniform;

let shapes = [];

let currentColor = [0.5, 0.5, 0.5, 1.0];
let currentSize = 5;
let currentShape = POINT;
let segmentCount = 12;
let drawOutline = 0;
let isMouseDown = false;
let alignStroke = false;
let lastPos = null;

let vertexShader = 
    'attribute vec4 a_Position;\n' +
    'uniform float u_Size;\n' +
    'void main() {\n' +
    ' gl_Position = a_Position;\n' +
    ' gl_PointSize = u_Size;\n' +
    '}\n';

let fragmentShader =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main() {\n' +
    '  gl_FragColor = u_FragColor;\n' +
    '}\n';

function setupUI(){
   document.getElementById('clear').onclick = function() { 
      shapes = []; 
      renderAll(); 
   };
   document.getElementById('square').onclick = function() { 
      currentShape = POINT;    
      drawOutline = 0;
   };
   document.getElementById('triangle').onclick = function() { 
      currentShape = TRIANGLE; 
      drawOutline = 0;
   };
   document.getElementById('circle').onclick = function() { 
      currentShape = CIRCLE;   
      drawOutline = 0;
   };
   document.getElementById('hourglass').onclick = function() { 
      currentShape = POINT;    
      drawOutline = 1;
   };
   document.getElementById('otriangle').onclick = function() { 
      currentShape = TRIANGLE; 
      drawOutline = 1;
   };
   document.getElementById('ocircle').onclick = function() { 
      currentShape = CIRCLE;   
      drawOutline = 1;
   };
   document.getElementById('drawPicture').onclick = function() { 
      drawPic(); 
   };

   const alignBtn = document.getElementById('alignToggle');
   if (alignBtn) {
      alignBtn.textContent = 'Align Stroke: Off';
      alignBtn.onclick = function() {
         alignStroke = !alignStroke;
         alignBtn.textContent = alignStroke ? 'Align Stroke: On' : 'Align Stroke: Off';
      };
   }

   document.getElementById('red').addEventListener('mouseup', function() { 
      currentColor[0] = this.value*0.1; 
   });
   document.getElementById('green').addEventListener('mouseup', function() { 
      currentColor[1] = this.value*0.1; 
   });
   document.getElementById('blue').addEventListener('mouseup', function() { 
      currentColor[2] = this.value*0.1; 
   });

   document.getElementById('size').addEventListener('mouseup', function() { 
      currentSize = this.value;
   });
   document.getElementById('sCount').addEventListener('mouseup', function() { 
      segmentCount = this.value; 
   });
}

function init(){
   canvas = document.getElementById('asg1');
   if (!canvas) {
       console.log('no canvas');
       return;
   }

   gl = getWebGLContext(canvas);
   if(!gl){
       console.log('no gl');
       return;
   }
}

function setupShaders(){
   if (!initShaders(gl, vertexShader, fragmentShader)) {
       console.log('shader error');
       return;
   }

   positionAttr = gl.getAttribLocation(gl.program, 'a_Position');
   if (positionAttr < 0) {
       console.log('position attr error');
       return;
   }

   colorUniform = gl.getUniformLocation(gl.program, 'u_FragColor');
   if (!colorUniform) {
       console.log('color uniform error');
       return;
   }

   sizeUniform = gl.getUniformLocation(gl.program, 'u_Size');
   if (!sizeUniform) {
       console.log('size uniform error');
       return;
   }
}

function main() {
   init();
   setupShaders();
   setupUI();

   canvas.onmousedown = function(ev){
      handleClick(ev);
      isMouseDown = true;
      lastPos = getGLCoords(ev);
   };
   canvas.onmouseup = function(ev){
      isMouseDown = false;
      lastPos = null;
   };
   canvas.onmousemove = function(ev){
      if(isMouseDown){
         handleClick(ev);
      }
   };

   gl.clearColor(0.0, 0.0, 0.0, 1.0);
   gl.clear(gl.COLOR_BUFFER_BIT);
}

function getGLCoords(ev){
   let x = ev.clientX;
   let y = ev.clientY;
   let rect = ev.target.getBoundingClientRect();

   x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
   y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

   return [x, y];
}

function handleClick(ev) {
   let [x, y] = getGLCoords(ev);
   let s;

   if(currentShape == POINT){
      s = new Point();
   } else if (currentShape == TRIANGLE){
      s = new Triangle();
   } else if (currentShape == CIRCLE){
      s = new Circle();
      s.segments = segmentCount;
   }

   s.x = x;
   s.y = y;
   s.r = currentColor[0];
   s.g = currentColor[1];
   s.b = currentColor[2];
   s.a = currentColor[3];
   s.size = currentSize;
   s.outlined = drawOutline;
   s.angle = 0;

   if (alignStroke && lastPos) {
      const dx = x - lastPos[0];
      const dy = y - lastPos[1];
      if (dx !== 0 || dy !== 0) {
         s.angle = Math.atan2(dy, dx);
      }
   }
   shapes.push(s);

    lastPos = [x, y];

   renderAll();
}

function renderAll(){
   gl.clear(gl.COLOR_BUFFER_BIT);

   for (let i = 0; i < shapes.length; i++) {
      shapes[i].draw();
   }
}

function drawPic(){
   gl.clear(gl.COLOR_BUFFER_BIT);
   let pic = new Picture();
   pic.draw();
}

function rotateAround(cx, cy, x, y, angle) {
   const cosA = Math.cos(angle);
   const sinA = Math.sin(angle);
   const dx = x - cx;
   const dy = y - cy;
   return [cx + dx * cosA - dy * sinA, cy + dx * sinA + dy * cosA];
}
