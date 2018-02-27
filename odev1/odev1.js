let gl;
let vertices = [];
let triangleCount;
const createTriangle = function (center, size) {
    let height = Math.sqrt(3) * size;
    return [
        vec2(center[0] - size, center[1] - (height / 3.0)),//left
        vec2(center[0], center[1] + (height * 2.0 / 3.0)),//top
        vec2(center[0] + size, center[1] - (height / 3.0))//right
    ];
}

const myRotate = function (vec, center, angle) {//rotate defined
    angle = angle * Math.PI / 180.0;
    let mS = Math.sin(angle);
    let mC = Math.cos(angle);
    //x'=x*cos(@)-y*sin(@)
    //y'=x*sin(@)+y*cos(@)
    for (let i = 0; i < vec.length; i++) {
        vec[i][0] -= center[0];
        vec[i][1] -= center[1];
        
        vec[i][0] = vec[i][0] * mC - vec[i][1] * mS;
        vec[i][1] = vec[i][0] * mS + vec[i][1] * mC;
        
        vec[i][0] += center[0];
        vec[i][1] += center[1];
    }
    return vec;
}

const init = function () {
    const canvas = document.getElementById('gl-canvas');

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl)
        alert("Webgl isn't avaliable!");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    const program = initShaders(gl, 'vertex-shader', 'fragment-shader');
    gl.useProgram(program);

    vertices = createTriangle(vec2(-0.5, 0.5), 0.35);
    let vertices2 = myRotate(createTriangle(vec2(-0.5, -0.5), 0.35),vec2(-0.5,-0.5), 30);
    vertices = vertices.concat(vertices2);
    triangleCount = 2;
    // Load the data into the GPU
    const bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    const vPos = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPos, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPos);

    render();
}

const render = function () {
    console.log(vertices);
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (let i = 0; i < triangleCount; i++)
        gl.drawArrays(gl.TRIANGLE_FAN, i * 3, 3);
}
window.onload = init;