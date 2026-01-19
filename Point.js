class Point {
   constructor(){
      this.type = 'point';
      this.x = 0;
      this.y = 0;
      this.r = 1;
      this.g = 1;
      this.b = 1;
      this.a = 1;
      this.size = 5;
      this.outlined = 0;
   }

   draw() {
      let px = this.x;
      let py = this.y;
      let sz = this.size;

      gl.vertexAttrib3f(positionAttr, px, py, 0.0);
      gl.uniform4f(colorUniform, this.r, this.g, this.b, this.a);
      gl.uniform1f(sizeUniform, sz);

      let d = sz/20.0;
      drawTrianglePoints([px-d/2, py-d/2, px-d/2, py+d/2, px+d/2, py+d/2], this.outlined);
      drawTrianglePoints([px-d/2, py-d/2, px+d/2, py-d/2, px+d/2, py+d/2], this.outlined);
   }
}