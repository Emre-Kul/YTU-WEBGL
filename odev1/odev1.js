let gl;
let vertices = [];
const TWIST_ANGLE = 30;
const createTriangle = function (center, size) {
    let height = Math.sqrt(3) * size;
    return [
        vec2(center[0] - size, center[1] - (height / 3.0)),//left
        vec2(center[0], center[1] + (height * 2.0 / 3.0)),//top
        vec2(center[0] + size, center[1] - (height / 3.0))//right
    ];
}

const twistWithoutTesselation = function (vec, center, twist) {//rotate defined
    let mS = Math.sin(twist * Math.PI / 180.0);
    let mC = Math.cos(twist * Math.PI / 180.0);
    for (let i = 0; i < vec.length; i++) {
        let tmpVec = vec2(vec[i][0] - center[0], vec[i][1] - center[1]);
        vec[i][0] = tmpVec[0] * mC - tmpVec[1] * mS;
        vec[i][1] = tmpVec[0] * mS + tmpVec[1] * mC;
        vec[i] = vec2(vec[i][0] + center[0], vec[i][1] + center[1]);
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


    let tr1 = createTriangle(vec2(-0.5, 0.5), 0.35);
    let tr2 = twistWithoutTesselation(createTriangle(vec2(-0.5, -0.5), 0.35), vec2(-0.5, -0.5), TWIST_ANGLE);
    vertices = vertices.concat(tr1).concat(tr2);

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

    gl.drawArrays(gl.LINE_LOOP, 0, 3);
    gl.drawArrays(gl.TRIANGLE_FAN, 3, 3);

}
window.onload = init;