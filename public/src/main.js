import * as THREE from 'three';
import { LoadGLTFByPath } from './Helpers/ModelHelper.js';
import { gsap } from "https://cdn.skypack.dev/gsap";
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.2/ScrollTrigger.js';

gsap.registerPlugin(ScrollTrigger);

let renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#background'),
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xffffff, 0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.NoToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
let cameraList = [];
let camera;
let mixer = null;
let animationClips = [];
let model = null;
let totalFrames = 0;

const loaderEl = document.getElementById('loader');

LoadGLTFByPath(scene)
  .then((gltf) => {
    model = gltf.scene;
    scene.add(model);
    loaderEl.style.display = 'none'; // Hide loader

    if (gltf.animations.length > 0) {
      animationClips = gltf.animations;
      mixer = new THREE.AnimationMixer(model);
      const action = mixer.clipAction(animationClips[0]);
      action.play();
      totalFrames = Math.floor(animationClips[0].duration * 24);
      setupScrollAnimation(action);
    }

    retrieveListOfCameras(scene);
  })
  .catch((error) => {
    console.error('Error loading GLTF model:', error);
    loaderEl.innerText = "Failed to load model.";
  });

function retrieveListOfCameras(scene) {
  scene.traverse((object) => {
    if (object.isCamera) cameraList.push(object);
  });

  camera = cameraList[0];
  updateCameraAspect(camera);
  animate();
}

function updateCameraAspect(camera) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function setupScrollAnimation(action) {
  const clipDuration = action.getClip().duration;

  gsap.timeline({
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const scaledTime = self.progress * clipDuration;
        showText(scaledTime);
        action.time = Math.min(Math.max(scaledTime, 0), clipDuration);
        mixer.update(0);
      },
    },
  }).to({}, { duration: 1 });
}

const popupConfig = [
  { id: 'popup', start: 20.6, end: Infinity },
  { id: 'popup2', start: 0.1, end: 1 },
  { id: 'popup3', start: 2.1, end: 2.5 },
  { id: 'popup4', start: 3.5, end: 5.2 },
  { id: 'popup5', start: 6, end: 6.5 },
  { id: 'popup6', start: 8, end: 8.5 },
  { id: 'popup7', start: 10, end: 10.5 },
  { id: 'popup8', start: 11.5, end: 12 },
  { id: 'popup9', start: 12.7, end: 13 },
  { id: 'popup10', start: 14, end: 14.8 },
  { id: 'popup11', start: 15.3, end: 15.8 },
  { id: 'popup12', start: 16, end: 16.8 },
  { id: 'popup13', start: 17.1, end: 17.5 },
  { id: 'popup14', start: 17.7, end: 18.3 },
  { id: 'popup15', start: 18.5, end: 18.7 },
  { id: 'popup16', start: 18.9, end: 19.1 },
  { id: 'popup17', start: 19.4, end:  19.5},
  { id: 'popup18', start: 19.7, end: 20},
  { id: 'popup19', start: 20.1, end: 20.2 },
  { id: 'popup20', start: 20.3, end: 20.4 },
];

function togglePopup(popup, isVisible) {
  if (isVisible) {
    popup.style.opacity = '1';
    popup.classList.add('visible');
    popup.classList.remove('invisible');
  } else {
    popup.style.opacity = '0';
    setTimeout(() => {
      if (popup.style.opacity === '0') {
        popup.classList.remove('visible');
        popup.classList.add('invisible');
      }
    }, 300);
  }
}

function showText(time) {
  popupConfig.forEach(({ id, start, end }) => {
    const popup = document.getElementById(id);
    togglePopup(popup, time > start && time < end);
  });
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
