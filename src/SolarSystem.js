import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import DescriptionBox from "./DescriptionBox";
import { TWEEN } from "three/addons/libs/tween.module.min";

export default function SolarSystem() {
  const mount = useRef();
  const [data, setData] = useState({ id: "", name: "" });
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (mount !== null && !mount.current.loaded) {
      mount.current.loaded = true;
      const clock = new THREE.Clock();
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 15);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);

      const control = initControl();
      mount.current.appendChild(renderer.domElement);

      initLight();
      loadSolarSystem("./resources/solar_system_with_animation/scene.gltf");
      //loadCube();
      render();
      windowResize();
      onClick();

      function initLight() {
        let light = new THREE.AmbientLight(0x333333);
        scene.add(light);

        light = new THREE.SpotLight(0x888888);
        light.position.set(0, 40, 30);
        light.castShadow = true;
        light.shadow.mapSize.height = 4096;
        light.shadow.mapSize.width = 4096;

        light = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
        light.position.set(0, 200, 0);
        scene.add(light);
      }

      function initControl() {
        const control = new OrbitControls(camera, renderer.domElement);
        control.minDistance = 1;
        control.maxDistance = 1000;
        control.enableDamping = true;

        return control;
      }

      function windowResize() {
        window.addEventListener("resize", () => onWindowResize(), false);

        function onWindowResize() {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
          render();
        }
      }

      function onClick() {
        window.addEventListener("click", (event) => clickHandler(event), false);
      }

      function clickHandler(event) {
        const mouse = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        focusOnObject(raycaster);
      }

      function loadSolarSystem(file) {
        const loader = new GLTFLoader();
        loader.load(
          file,
          (gltf) => {
            const solar = gltf.scene;
            solar.scale.set(0.03, 0.03, 0.03);
            scene.add(solar);
          },
          undefined,
          (error) => {
            console.error(error);
          }
        );
      }

      function loadCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
      }

      function render() {
        requestAnimationFrame(render);
        const delta = clock.getDelta();

        renderer.render(scene, camera);
        TWEEN.update();
      }

      function focusOnObject(raycaster) {
        console.log("focusOnObject");
        const intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length > 0) {
          let firstObject = intersects[0];

          for (let intersect of intersects) {
            console.log(intersect.distance, intersect.object.name);
            if (firstObject.distance > intersect.distance) {
              firstObject = intersect;
            }
          }

          console.log("object is focusing....", firstObject);

          const { object, point } = firstObject;
          const coords = {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z,
          };
          const target = {
            x: point.x,
            y: point.y,
            z: point.z + 1,
          };

          console.log("start tween...");

          new TWEEN.Tween(coords)
            .to(target, 2000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
              console.log("check camera......");
              camera.lookAt(point);
              camera.updateProjectionMatrix();
              camera.position.set(coords.x, coords.y, coords.z);
            })
            .onComplete(() => {
              console.log("on complete");
              new TWEEN.Tween(control.target)
                .to(point, 500)
                .easing(TWEEN.Easing.Cubic.Out)
                .start();
            })
            .start();

          setData({ id: object.id, name: object.name });
          setShowDialog(true);
        }
        render();
      }
    }
  }, [mount.current]);

  return (
    <>
      <div ref={mount}></div>
      {showDialog && (
        <DescriptionBox
          data={data}
          handleShowDialog={() => {
            setShowDialog(false);
          }}
        />
      )}
    </>
  );
}
