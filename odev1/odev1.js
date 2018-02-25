let gl;

const init = function(){
    const canvas = document.getElementById('gl-canvas');
    
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl)
        alert("Webgl isn't avaliable!");

    gl.viewport(0,0,canvas.width,canvas.height);
    gl.clearColor(1.0,1.0,1.0,1.0);

    const program = initShaders(gl,'vertex-shader','fragment-shader');
    gl.useProgram(program);
    
    render();
}
const render = function(){
    gl.clear(gl.COLOR_BUFFER_BIT);
}
window.onload = init;