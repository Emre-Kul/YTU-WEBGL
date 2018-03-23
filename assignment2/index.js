"use strict"
let gl;

const ANGLE = {
    x: -30,
    y: 0,
    z: 0 //useless
};

const UNIFORM_LOCATION = {
    model: 0,
    color: 0
};

const VERTICE_LENGTH = {
    cube : 0,
    tetrahedron : 0
};

const createTetrahedron = function (center, size) {

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

const specialRotate = function () {
    let rotX, rotY;
    rotX = rotateX(ANGLE.x);
    rotY = rotateY(ANGLE.y);
    ANGLE.y += 1;
    ANGLE.y %= 360;
    return mult(rotX, rotY);
}

const createScene = function () {
    let cube = createCube(vec3(-0.5, 0.0, 0.0), 0.1);
    let tetrahedron = createCube(vec3(0.5, 0.0, 0.0), 0.1);//will change
    
    VERTICE_LENGTH.cube = cube.length;
    VERTICE_LENGTH.tetrahedron = tetrahedron.length;

    return cube.concat(tetrahedron);
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

    UNIFORM_LOCATION.model = gl.getUniformLocation(program, "modelMtr");
    UNIFORM_LOCATION.color = gl.getUniformLocation(program, 'uColor');

    render();
}

const render = function () {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //rotate
    gl.uniformMatrix4fv(UNIFORM_LOCATION.model, false, flatten(specialRotate()));
    //draw cube
    gl.uniform4fv(UNIFORM_LOCATION.color,vec4(1.0,0.0,0.0,1.0));
    gl.drawArrays(gl.TRIANGLES, 0, VERTICE_LENGTH.cube);
    //draw tetrahedron
    gl.uniform4fv(UNIFORM_LOCATION.color,vec4(0.0,1.0,0.0,1.0));
    gl.drawArrays(gl.TRIANGLES, VERTICE_LENGTH.cube, VERTICE_LENGTH.tetrahedron);
    
    requestAnimFrame(render);
}
window.onload = init;