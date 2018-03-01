let gl;

const TWIST_ANGLE = 100;

const createTriangle = function (center, size) {
    let height = Math.sqrt(3) * size;
    return [
        vec2(center[0] - size, center[1] - (height / 3.0)),//left
        vec2(center[0], center[1] + (height * 2.0 / 3.0)),//top
        vec2(center[0] + size, center[1] - (height / 3.0))//right
    ];
}
const createReverseTriangle = function (center, size) {
    let height = Math.sqrt(3) * size;
    return [
        vec2(center[0] - size, center[1] + (height * 2.0 / 3.0)),//left
        vec2(center[0], center[1] - (height / 3.0)),//top
        vec2(center[0] + size, center[1] + (height * 2.0 / 3.0))//right
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

const twistWithTesselation = function (vec, center, twist) {
    /*
        xnew = x*cos(d*@)-y*sin(d*@)
        ynew = x*sin(d*@)+y*cos(d*@)
        distance = sqrt(x*x+y*y)
    */
    twist = twist * Math.PI / 180.0;
    let mS, mC, distance;

    for (let i = 0; i < vec.length; i++) {
        let tmpVec = vec2(vec[i][0] - center[0], vec[i][1] - center[1]);
        distance = Math.sqrt(tmpVec[0] * tmpVec[0] + tmpVec[1] * tmpVec[1]);
        mS = Math.sin(twist * distance);
        mC = Math.cos(twist * distance);
        vec[i][0] = tmpVec[0] * mC - tmpVec[1] * mS;
        vec[i][1] = tmpVec[0] * mS + tmpVec[1] * mC;
        vec[i] = vec2(vec[i][0] + center[0], vec[i][1] + center[1]);
    }
    return vec;
}

const createScene = function () {
    let vertices = [];
    let twistedVertices = [];
    let trLeftTop = createTriangle(vec2(-0.5, 0.5), 0.35);
    let trLeftBottom = twistWithoutTesselation(createTriangle(vec2(-0.5, -0.5), 0.35), vec2(-0.5, -0.5), TWIST_ANGLE);
    let xI, yI, x, y, size, step, diff, trRightBottomCenter;
    x = 0.5;
    y = 0.9;
    size = 0.035;
    step = 10;
    diff = 1;
    trRightBottomCenter = vec2(x, -0.55);
    for (xI = 0; xI < step * 2 - 1; xI += 2) {
        for (yI = 0; yI <= xI; yI++) {
            if (yI % 2 == 0) {
                vertices = vertices.concat(createTriangle(vec2(x + size * yI, y), size));
                twistedVertices = twistedVertices.concat(
                    twistWithTesselation(createTriangle(vec2(x + size * yI, y - diff), size), trRightBottomCenter, TWIST_ANGLE)
                );
            }
            else {
                console.log("OK");
                vertices = vertices.concat(
                    createReverseTriangle(vec2(x + size * yI, y), size)
                )

                twistedVertices = twistedVertices.concat(
                    twistWithTesselation(createReverseTriangle(vec2(x + size * yI, y - diff), size), trRightBottomCenter, TWIST_ANGLE)
                );

            }

        }
        y -= size * Math.sqrt(3);
        x -= size;
    }
    twistedVertices = twistedVertices.concat(trLeftBottom);
    vertices = vertices.concat(trLeftTop);
    return vertices.concat(twistedVertices);
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

    vertices = createScene();

    // Load the data into the GPU
    const bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    const vPos = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPos, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPos);

    render(vertices.length);
}

const render = function (size) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    /*
    gl.drawArrays(gl.LINE_LOOP, 0, 3);
    gl.drawArrays(gl.TRIANGLE_FAN, 3, 3);
    */
    for (let i = 0; i < size / 2; i += 3)
        gl.drawArrays(gl.LINE_LOOP, i, 3);

    for (let i = size / 2; i < size; i += 3)
        gl.drawArrays(gl.TRIANGLE_FAN, i, 3);


}
window.onload = init;