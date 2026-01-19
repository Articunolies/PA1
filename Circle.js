class Circle {
   constructor(){
      this.type = 'circle';
      this.x = 0;
      this.y = 0;
      this.r = 1;
      this.g = 1;
      this.b = 1;
      this.a = 1;
      this.size = 5;
      this.segments = 12;
      this.outlined = 0;
   }

   draw() {
      let px = this.x;
      let py = this.y;
      let sz = this.size;

      gl.uniform4f(colorUniform, this.r, this.g, this.b, this.a);

      let delta = sz/40.0;
      let step = 360/this.segments*.5;

      if(this.outlined == 0){
         for(let angle = 0; angle <= 360; angle += step){
            let cx = px;
            let cy = py;
            let a1 = angle;
            let a2 = angle + step;
            let v1 = [Math.cos(a1*Math.PI/180)*delta, Math.sin(a1*Math.PI/180)*delta];
            let v2 = [Math.cos(a2*Math.PI/180)*delta, Math.sin(a2*Math.PI/180)*delta];
            let p1 = [cx+v1[0], cy+v1[1]];
            let p2 = [cx+v2[0], cy+v2[1]];

            drawTrianglePoints([px, py, p1[0], p1[1], p2[0], p2[1]], this.outlined);
         }
      } else if(this.outlined == 1){
         drawCircleOutline(px, py, this.outlined, this.segments, 11-Math.round(sz));
      }
   }
}

function drawCircleOutline(x, y, outlined, segCount, sz){
   let theta = Math.PI/segCount;
   let count = 0;
   let n = 0;
   let verts = new Float32Array(48);

   for(let circle = 0; circle <= (2*Math.PI); circle += theta){
      verts[count] = (x+(1/(1.5*sz))*Math.cos(n*theta));
      count++;
      verts[count] = (y+(1/(1.5*sz))*Math.sin(n*theta));
      count++;
      n++;
   }
   n--;

   let buf = gl.createBuffer();
   if (!buf) {
      console.log('buffer error');
      return;
   }

   gl.bindBuffer(gl.ARRAY_BUFFER, buf);
   gl.bufferData(gl.ARRAY_BUFFER, verts, gl.DYNAMIC_DRAW);

   gl.vertexAttribPointer(positionAttr, 2, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(positionAttr);

   if (outlined == 1){
      gl.drawArrays(gl.LINE_LOOP, 0, n);
   } else if (outlined == 0) {
      gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
   }
}