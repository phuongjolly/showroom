import * as THREE from "three";

export const objectList = [
  {
    id: 62,
    parentId: 32,
    originalName: "lighting_Material001_0",
    name: "Kitchen Light",
    look: new THREE.Vector3(5.55, -0.104, -1.13),
  },
  {
    id: 45,
    parentId: 20,
    originalName: "cabinet_Material015_0",
    name: "Kitchen Cabinet",
    look: new THREE.Vector3(10.66, 1.71, -1.619),
  },
  {
    id: 66,
    parentId: 38,
    originalName: "seat_Leather_0",
    name: "Set of 6 chairs",
    look: new THREE.Vector3(3.03, -2.58, -6.35),
  },
  {
    id: 49,
    parentId: 21,
    originalName: "window_Material016_0",
    name: "Door",
    look: new THREE.Vector3(4.61, 2.7, -13.78),
  },
];

export const targetMapping = {
  32: new THREE.Vector3(-6.5, 0.849, -0.99), //
  20: new THREE.Vector3(-2.5, 0.849, -0.99),
  38: new THREE.Vector3(-2.5, 0.849, -0.99),
  21: new THREE.Vector3(0.1, 0.39, 5),
};

export const cameraOriginalPosition = new THREE.Vector3(-21.2, 1.42, 6.06);
