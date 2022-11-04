import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { Easing, Tween, update } from "@tweenjs/tween.js";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import DescriptionBox from "./DescriptionBox";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass";
import { RenderPass } from "three/addons/postprocessing/RenderPass";

export default function Kitchen() {
  const mount = useRef();
  const [title, setTitle] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const shouldScale = useRef(true);

  useEffect(() => {
    if (mount.current !== null && !mount.current.loaded) {
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
      const look = new THREE.Vector3();
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);

      const control = orbitControl();

      const outlinePass = new OutlinePass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        scene,
        camera,
        []
      );
      const composer = new EffectComposer(renderer);
      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);
      composer.addPass(outlinePass);
      outlinePass.renderToScreen = true;

      const params = {
        edgeStrength: 3.0,
        edgeGlow: 1,
        edgeThickness: 1.0,
        pulsePeriod: 0,
        usePatternTexture: false,
      };
      outlinePass.edgeStrength = params.edgeStrength;
      outlinePass.edgeGlow = params.edgeGlow;
      outlinePass.visibleEdgeColor.set(0xff0000);
      outlinePass.hiddenEdgeColor.set(0xff00ff);

      const mouse = new THREE.Vector2();
      const raycaster = new THREE.Raycaster();

      loadHouse();
      render();
      windowResize();
      onClickHandler();

      mount.current.appendChild(renderer.domElement);

      function render() {
        requestAnimationFrame(render);
        const delta = clock.getDelta();
        //renderer.render( scene, camera );
        update();
        control.update(delta);
        composer.render(delta);
      }

      function orbitControl() {
        const control = new OrbitControls(camera, renderer.domElement);
        control.minDistance = 5;
        control.maxDistance = 1000;
        return control;
      }

      function loadHouse() {
        const loader = new GLTFLoader();
        loader.load(
          "./resources/kitchen_room/scene.gltf",
          (gltf) => {
            const house = gltf.scene;
            house.position.set(0, -5, -2);
            house.scale.set(3, 3, 3);

            scene.add(house);
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
        return cube;
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

      function onClick(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        objectHandler(raycaster);
      }

      function onClickHandler() {
        renderer.domElement.addEventListener(
          "click",
          (event) => onClick(event),
          false
        );
      }

      function objectHandler(raycaster) {
        //hardcode item
        //const items = new Set([60, 61, 62]);
        const intersects = raycaster.intersectObjects(scene.children);
        console.log("---debug: ", intersects);
        if (intersects.length > 0) {
          let firstObject = intersects[0];

          for (let intersect of intersects) {
            console.log(intersect.distance, intersect.object.name);
            if (firstObject.distance > intersect.distance) {
              firstObject = intersect;
            }
          }
          const { object } = firstObject;

          if (true) {
            console.log("yes....", object);
            setTitle(object.name);
            setShowDialog(true);
            outlinePass.selectedObjects = [object];
            if (shouldScale) {
              object.scale.set(1.5, 1.5, 1.5);
              shouldScale.current = false;
            }

            //objectMoving(firstObject);
          }
          render();
        }
      }

      function objectMoving(objects) {
        const { object, point } = objects;
        const coords = {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z,
        };
        new Tween(coords)
          .to({ x: point.x, y: point.y, z: point.z + 7.0 }, 1000)
          .easing(Easing.Quadratic.Out)
          .onUpdate(() => {
            console.log("check camera......");
            camera.position.set(coords.x, coords.y, coords.z);
            camera.lookAt(point.x, point.y, point.z);
            camera.updateProjectionMatrix();
          })
          .onComplete(() => {
            console.log("on complete......");

            camera.getWorldDirection(look);
          })
          .start();
      }
    }
  }, [mount.current]);

  return (
    <>
      <div ref={mount} />
      {showDialog && (
        <DescriptionBox
          data={{ title: title }}
          handleShowDialog={() => setShowDialog(false)}
        />
      )}
    </>
  );
}
