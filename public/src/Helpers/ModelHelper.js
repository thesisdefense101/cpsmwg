import * as THREE from 'three';
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';

const scenePath = 'public/models/scene (26).gltf'; // Ensure the path is correct

export const LoadGLTFByPath = (scene) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();

    // Load the GLTF model
    loader.load(scenePath, (gltf) => {
      console.log('This is GLTF loaded:', gltf);
      scene.add(gltf.scene); // Add the model to the scene
      resolve(gltf); // Resolve with the gltf object so it can be used later
    }, undefined, (error) => {
      reject(error); // Handle errors properly
    });
  });
};


console.log('Loading model from path:', scenePath);