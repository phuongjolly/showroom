import * as THREE from "three";

export const objectList = [
  {
    id: 62,
    parentName: "lighting",
    originalName: "lighting_Material001_0",
    name: "Kitchen Light",
    look: new THREE.Vector3(5.55, -0.104, -1.13),
  },
  {
    id: 45,
    parentName: "cabinet",
    originalName: "cabinet_Material015_0",
    name: "Kitchen Cabinet",
    look: new THREE.Vector3(10.66, 1.71, -1.619),
  },
  {
    id: 66,
    parentName: "seat",
    originalName: "seat_Leather_0",
    name: "Set of 6 chairs",
    look: new THREE.Vector3(3.03, -2.58, -6.35),
  },
  {
    id: 49,
    parentName: "window",
    originalName: "window_Material016_0",
    name: "Window",
    look: new THREE.Vector3(4.61, 2.7, -13.78),
  },
];

export const targetMapping = {
  lighting: new THREE.Vector3(-6.5, 0.849, -0.99), //
  cabinet: new THREE.Vector3(-2.5, 0.849, -0.99),
  seat: new THREE.Vector3(-2.5, 0.849, -0.99),
  window: new THREE.Vector3(0.1, 0.39, 5),
};

export const cameraOriginalPosition = new THREE.Vector3(-21.2, 1.42, 6.06);
