import * as THREE from "three";
import { useRef, useEffect } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSG } from "three-csg-ts";
import * as dat from "lil-gui";


let parameters = {
  color: 0x4cd6f1,
  visible: false,
  intensity: 0.5,
};

const createGuiControls = (model, lights, lightHelpers) => {
  const addVisibleCheckBox = (dlFolder, lightHelpers) =>
  {
    dlFolder.add(parameters, "visible").onChange((value) => {
    lightHelpers.forEach(lightHelper => {
      lightHelper.visible = value;
    });
  });
  }
  const addIntensity = (dlFolder, lights) =>
  {
    dlFolder.add(parameters, "intensity", 0.1, 1, 0.1).onChange((value) => {
      lights.forEach(light => {
        light.intensity = value;
      });
    });

  }

  // GUI Controls
  const gui = new dat.GUI({ autoPlace: true });
  gui.domElement.id = "gui";

  // Folder Controls
  const modelFolder = gui.addFolder("Model");
  modelFolder.add(model.material, "wireframe");
  modelFolder.addColor(parameters, "color").onChange(() => model.material.color.set(parameters.color));

  // Folder "light helpers"
  const dlFolder = gui.addFolder("Light helpers");
  addVisibleCheckBox(dlFolder, lightHelpers);
  addIntensity(dlFolder, lights);
  dlFolder.open();
  gui.close();
  return gui;
};

const createLight = (scene, x, y, z) => {
  let light = new THREE.DirectionalLight(0xffffff, parameters.intensity);
  light.position.set(x, y / 2, z);
  let lightHelper = new THREE.DirectionalLightHelper(light, 3);
  lightHelper.visible = parameters.visible;
  scene.add(light);
  scene.add(lightHelper);

  return { light, lightHelper };
};

const createLightAndTheirHelpers = (scene, lightsConfig) => {
  let lights = [];
  let lightHelpers = [];
  lightsConfig.forEach(lightConfig => {
    let { light, lightHelper } = createLight(scene, ...lightConfig);
    lights.push(light);
    lightHelpers.push(lightHelper);
  });
  return {lights, lightHelpers};
};



const createCamera = (scene, maxDistance) => {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.x = maxDistance / 2 + 5 ;
  camera.position.z = 3;
  camera.position.y = 3;

  return camera;
};

const createRectangle = (scene, maxDistance, rectWidth, rectHeight) => {
  /* Rectangle is Smax
      Parameters of THREE.BoxGeometry(...): 
        1. width 
        2. depth
        3. height
    */

  const rectGeometry = new THREE.BoxGeometry(rectWidth, 0, rectHeight); // Параметры: ширина, глубина, высота
  const rectMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
  });
  const rectangle = new THREE.Mesh(rectGeometry, rectMaterial);
  //rectangle.rotation.z = Math.PI / 2;
  rectangle.position.set(0, 0, 0); // Размещение в центре основания конуса
  scene.add(rectangle);
};

const createSphere = (scene, radius, maxDistance) => {
  // Параметры THREE.SphereGeometry:
  // 1. Радиус сферы
  // 2. Количество сегментов по горизонтали
  // 3. Количество сегментов по вертикали
  //const biggerRadius = Math.max(xRadius, yRadius);
  //const smallerRadius = Math.min(xRadius, yRadius);
  let sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
  let sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x0000ff, // Синий цвет
    opacity: 1,
    transparent: true,
    wireframe: true,
  });

  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(0, maxDistance, 0);

  scene.add(sphere);
  return sphere;
};

const createPyramid = (scene, rectWidth, rectHeight, maxDistance) => {
  // Create the vertices of the triangle
  const height = maxDistance;
  const vertices = new Float32Array([
    0,
    height,
    0, // Vertex A
    -rectWidth / 2,
    0,
    -rectHeight / 2, // Vertex B
    -rectWidth / 2,
    0,
    rectHeight / 2, // Vertex C
    rectWidth / 2,
    0,
    rectHeight / 2, // Vertex D
    rectWidth / 2,
    0,
    -rectHeight / 2, // Vertex D
  ]);

  // Create indexes to define the faces of the pyramid
  const indices = new Uint32Array([
    0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 1, 3, 2, 1, 4, 3, 1,
  ]);

  // Create a buffer geometry
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.scale(1, 1, 1);
  geometry.computeVertexNormals();

  // Create the material
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: false,
  });

  // Create a mesh
  const pyramid = new THREE.Mesh(geometry, material);

  // Add a triangle to the scene
  scene.add(pyramid);
  return pyramid;
};

const createIntersection = (scene, pyramid, sphere, actionString) => {
  scene.remove(pyramid);
  scene.remove(sphere);
  // Convert objects to CSG
  const sphereCSG = CSG.fromMesh(sphere);
  const pyramidCSG = CSG.fromMesh(pyramid);
  let action;

  // Perform the subtraction operation
  if (actionString == "intersect") {
    action = sphereCSG.intersect(pyramidCSG);
  } else if (actionString == "subtract") {
    action = pyramidCSG.subtract(sphereCSG);
  }

  // Convert the result back to Three.js Mesh
  const resultMesh = CSG.toMesh(action, sphere.matrix);
  resultMesh.material = new THREE.MeshPhongMaterial({
    wireframe: true,
    color: 0x4cd6f1,
  });

  scene.add(resultMesh);
  return resultMesh;
};

const LightRaySceneRectangle = () => {
  const sceneRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    sceneRef.current.appendChild(renderer.domElement);

    renderer.domElement.style.maxWidth = "100%";
    renderer.domElement.style.maxHeight = "100%";

    // const rectWidth = dict['plume_width']
    // const rectHeight = dict['plume_height']
    const rectWidth = 2;
    const rectHeight = 4;

    // const minDistance = dict['min_distance']
    // const maxDistance = dict['max_distance']
    const minDistance = 2;
    const maxDistance = 8;

    const maxSphere = createSphere(scene, maxDistance, maxDistance);
    const pyramid = createPyramid(scene, rectWidth, rectHeight, maxDistance);

    maxSphere.updateMatrix();
    pyramid.updateMatrix();

    const interModel1 = createIntersection(
      scene,
      pyramid,
      maxSphere,
      "intersect"
    );

    const minSphere = createSphere(scene, minDistance, maxDistance);

    minSphere.updateMatrix();
    interModel1.updateMatrix();

    const model = createIntersection(scene, interModel1, minSphere, "subtract");
    model.position.y = 0;
    model.rotation.z = Math.PI / 2;
    model.position.x = -maxDistance / 2;

    //setup directional light + helper
    const lightsConfig = [
      [maxDistance, maxDistance, maxDistance], 
      [-maxDistance, -maxDistance, -maxDistance], 
      [-maxDistance, -maxDistance, maxDistance], 
      [maxDistance, maxDistance, -maxDistance]
    ]
    const {lights, lightHelpers} = createLightAndTheirHelpers(scene, lightsConfig);

    //added gui to scene
    const gui = createGuiControls(model, lights, lightHelpers);

    const camera = createCamera(scene, maxDistance);
    renderer.render(scene, camera);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      controls.dispose();
      const rendererElement = renderer.domElement;
      const parentElement = rendererElement.parentElement;

      if (parentElement) {
        parentElement.removeChild(rendererElement);
        gui.destroy();
      }
    };
  }, []);

  return <div ref={sceneRef} />;
};

export default LightRaySceneRectangle;
