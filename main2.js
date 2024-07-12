import * as THREE from 'three';
import * as dat from 'https://unpkg.com/dat.gui@0.7.9/build/dat.gui.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// main
init();
// end main


function init() {
    var stop = 0;
    if(stop > 0){
        return;
    }
    var enableFog = false;
    var scene = new THREE.Scene();
    var gui = new dat.GUI();
    if (enableFog) {
        scene.fog = new THREE.FogExp2(0xffffff, 0.2);
    }
    var boxgrid = getBoxGrid(3,1.5);


    

    var plane = getPlane(30);
    plane.name = "plane-1";
    plane.rotation.x = Math.PI / 2;

    var spotLight = getSpotLight(1);
    spotLight.position.x = 1;
    spotLight.position.y = 5;
    spotLight.position.z = 1;
    spotLight.intensity = 60;



    var sphere = getSphere(0.05);
    spotLight.add(sphere);

    var helper = new THREE.CameraHelper(spotLight.shadow.camera);

    // gui.add(spotLight,"penumbra",0,1);

    gui.add(spotLight, "intensity", 10, 70);
    gui.add(spotLight.position, "y", 0, 20);
    gui.add(spotLight.position, "x", 0, 20);
    gui.add(spotLight.position, "z", 0, 20);

    scene.add(helper);
    scene.add(boxgrid);
    scene.add(plane);
    scene.add(spotLight);
    var camera = getCamera();
    var renderer = gerRenderer();

    var controls = new OrbitControls(camera, renderer.domElement);

    update(renderer, scene, camera, controls);
}

function update(renderer, scene, camera, controls) {
    renderer.render(
        scene,
        camera
    );
    controls.update();

    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls);
    })
}

function gerRenderer() {
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('rgb(120,120,120)');
    renderer.shadowMap.enabled = true;
    document.getElementById("webgl").appendChild(renderer.domElement);
    return renderer;
}

function getCamera() {
    var camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.z = 1;
    camera.position.x = 1;
    camera.position.y = 5;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    return camera;
}

function getPointLight(intensity) {
    var light = new THREE.PointLight(0xffffff, intensity);
    light.castShadow = true;
    return light;
}

function getDirectionalLight(intensity) {
    var light = new THREE.DirectionalLight(0xffffff, intensity);
    light.castShadow = true;
    return light;
}

function getAmbientLight(intensity) {
    var light = new THREE.AmbientLight("rgb(10,30,50)", intensity);
    return light;
}

function getSpotLight(intensity) {
    var light = new THREE.SpotLight(0xffffff, intensity);
    light.castShadow = true;
    light.shadow.bias = 0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    return light;
}

function getBox(w, h, d) {
    var geometry = new THREE.BoxGeometry(w, h, d);
    var material = new THREE.MeshPhongMaterial({
        color: getRandomHexColor()
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    mesh.castShadow = true;
    return mesh;
}

function getRandomHexColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

function getBoxGrid(amount, separationMultiplier) {
    var group = new THREE.Group();
    for (var i = 0; i < amount; ++i) {
        var obj = getBox(1, 1, 1);
        obj.position.x = i * separationMultiplier;
        obj.position.y = obj.geometry.parameters.height / 2;
        group.add(obj);
        for (var j = 1; j < amount; ++j) {
            var objx = getBox(1, 1, 1);
            objx.position.x = i * separationMultiplier;
            objx.position.y = objx.geometry.parameters.height / 2;
            objx.position.z = j * separationMultiplier;
            group.add(objx);
        }
    }
    group.position.x = -(separationMultiplier * (amount-1))/2;
    group.position.z = -(separationMultiplier * (amount-1))/2;

    return group;
}

function getSphere(size) {
    var geometry = new THREE.SphereGeometry(size, 24, 24);
    var material = new THREE.MeshBasicMaterial({
        color: 'rgb(255,255,255)'
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    return mesh;
}

function getPlane(size) {
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshPhongMaterial({
        color: 'rgb(120,120,120)',
        side: THREE.DoubleSide
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    mesh.receiveShadow = true;
    return mesh;
}
