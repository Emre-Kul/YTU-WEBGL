"use strict"
let gl;

const createGasket = function (center, size) {

}

const createCube = function (center, size) {
    const cubeCords = [
        vec4(center[0] - size, center[1] - size, center[2] + size, 1.0),
        vec4(center[0] - size, center[1] + size, center[2] + size, 1.0),
        vec4(center[0] + size, center[1] + size, center[2] + size, 1.0),
        vec4(center[0] + size, center[1] - size, center[2] + size, 1.0),
        vec4(center[0] - size, center[1] - size, center[2] - size, 1.0),
        vec4(center[0] - size, center[1] + size, center[2] - size, 1.0),
        vec4(center[0] + size, center[1] + size, center[2] - size, 1.0),
        vec4(center[0] + size, center[1] - size, center[2] - size, 1.0)
    ];
    const cubeIndices = [
        //a, b, c, a, c, d
        1, 0, 3, 1, 3, 2,
        2, 3, 7, 2, 7, 6,
        3, 0, 4, 3, 4, 7,
        6, 5, 1, 6, 1, 2,
        4, 5, 6, 4, 6, 7,
        5, 4, 0, 5, 0, 1
    ];
    let i,
        cubeVertices = [];
    for (i = 0; i < cubeIndices.length; ++i) {
        cubeVertices.push(cubeCords[cubeIndices[i]]);
    }
    return cubeVertices;
}

const createScene = function () {
    let cube = createCube(vec3(-0.5, 0.0, 0.0), 0.3);
    return cube;
}

const init = function () {
    const canvas = document.getElementById('gl-canvas');

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl)
        alert("Webgl isn't avaliable!");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    const program = initShaders(gl, 'vertex-shader', 'fragment-shader');
    gl.useProgram(program);
    let vertices = createScene();

    // Load the data into the GPU
    const bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    const vPos = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPos, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPos);

    render(vertices.length);
}

const render = function (size) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, size);
}
window.onload = init;