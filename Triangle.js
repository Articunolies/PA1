class Triangle {
   constructor(){
      this.type = 'triangle';
      this.x = 0;
      this.y = 0;
      this.r = 1;
      this.g = 1;
      this.b = 1;
      this.a = 1;
      this.size = 5;
      this.outlined = 0;
   }

   draw(){
      let px = this.x;
      let py = this.y;
      let sz = this.size;

      gl.uniform4f(colorUniform, this.r, this.g, this.b, this.a);
      gl.uniform1f(sizeUniform, sz);

      let d = sz/20.0;
      drawTrianglePoints([px-d/2, py-d/2, px+d/2, py-d/2, px, py+d/2], this.outlined);
   }
}

function drawTrianglePoints(vertices, outlined){
   let n = 3;
   let buf = gl.createBuffer();
   if(!buf){
      console.log('buffer error');
      return;
   }

   gl.bindBuffer(gl.ARRAY_BUFFER, buf);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

   gl.vertexAttribPointer(positionAttr, 2, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(positionAttr);

   if (outlined == 0){
      gl.drawArrays(gl.TRIANGLES, 0, n);
   } else if(outlined == 1){
      gl.drawArrays(gl.LINE_LOOP, 0, n);
   }
}