import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { Easing, Tween, update } from "@tweenjs/tween.js";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass";
import { RenderPass } from "three/addons/postprocessing/RenderPass";
import "./Kitchen.css";
import { cameraOriginalPosition, objectList, targetMapping } from "./Data";

export default function Kitchen() {
  const mount = useRef();
  const data = useRef(null);
  const [showDialog, setShowDialog] = useState(false);
  const shouldScale = useRef(true);
  const showOutline = useRef(true);
  const shouldReset = useRef(false);
  const shouldFocus = useRef(false);

  useEffect(() => {
    if (mount.current !== null && !mount.current.loaded) {
      mount.current.loaded = true;
      const clock = new THREE.Clock();
      const mouse = new THREE.Vector2();
      const look = new THREE.Vector3();
      let house = new THREE.Object3D();
      const raycaster = new THREE.Raycaster();
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        50,
        mount.current.clientWidth / mount.current.clientHeight,
        0.1,
        1000
      );

      camera.position.set(
        cameraOriginalPosition.x,
        cameraOriginalPosition.y,
        cameraOriginalPosition.z
      );

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(mount.current.clientWidth, mount.current.clientHeight);
      mount.current.appendChild(renderer.domElement);

      const control = orbitControl();
      const outlinePass = initOutLinePass();
      const composer = initComposer(scene, camera, renderer);

      loadHouse();
      render();
      window.addEventListener("resize", () => onWindowResize(), false);
      renderer.domElement.addEventListener("click", (e) => onClick(e), false);

      function orbitControl() {
        const control = new OrbitControls(camera, renderer.domElement);
        control.minDistance = 2;
        control.maxDistance = 1000;
        return control;
      }

      function initOutLinePass() {
        const outlinePass = new OutlinePass(
          new THREE.Vector2(
            mount.current.clientWidth,
            mount.current.clientHeight
          ),
          scene,
          camera,
          []
        );
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

        return outlinePass;
      }

      function initComposer(scene, camera, renderer) {
        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);
        composer.addPass(outlinePass);
        return composer;
      }

      function loadHouse() {
        const loader = new GLTFLoader();
        loader.load(
          "./resources/kitchen_room/scene.gltf",
          (gltf) => {
            house = gltf.scene;
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

      function render() {
        requestAnimationFrame(render);
        const delta = clock.getDelta();
        //renderer.render( scene, camera );
        update();
        //control.update(delta);
        composer.render(delta);

        if (shouldFocus.current) {
          console.log("---should focus ", data.current);
          const object = scene.getObjectByName(data.current.originalName);
          zoomTo(data.current.parentId, data.current.look);
          setOutLine(object);
          shouldFocus.current = false;
        }

        if (shouldReset.current) {
          reset();
          shouldReset.current = false;
        }
      }

      function onWindowResize() {
        camera.aspect = mount.current.clientWidth / mount.current.clientHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(mount.current.clientWidth, mount.current.clientHeight);
        render();
      }

      function onClick(event) {
        const rect = mount.current.getBoundingClientRect();

        mouse.x =
          ((event.clientX - rect.left) / mount.current.clientWidth) * 2 - 1;
        mouse.y =
          -((event.clientY - rect.top) / mount.current.clientHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        objectHandler(raycaster);
      }

      function objectHandler(raycaster) {
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
          const { object, point } = firstObject;

          setShowDialog(true);

          console.log("---show object...", object.id, object);
          setOutLine(object);
          zoomTo(object.parent.id, point);

          if (shouldScale) {
            shouldScale.current = false;
          }
        }
      }

      function setOutLine(object) {
        outlinePass.selectedObjects = [object];
      }

      function removeOutline() {
        outlinePass.selectedObjects = [];
      }

      function zoomTo(objectId, point) {
        const coords = {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z,
        };
        console.log("---camera", camera.position);
        console.log("---debug ", point, objectId);
        const target = targetMapping[objectId];

        if (target !== undefined) {
          look.set(point.x, point.y, point.z);
          moveCamera(coords, target, point);
        }
      }

      function moveCamera(start, target, look) {
        new Tween(start)
          .to(target, 1000)
          .easing(Easing.Quadratic.Out)
          .onUpdate(() => {
            camera.position.set(start.x, start.y, start.z);
            camera.lookAt(look.x, look.y, look.z);
            camera.updateProjectionMatrix();
          })
          .start();
      }

      function reset() {
        const start = new THREE.Vector3(
          camera.position.x,
          camera.position.y,
          camera.position.z
        );

        look.set(0, 1, 0);
        moveCamera(start, cameraOriginalPosition, look);

        control.reset();
        removeOutline();
      }
    }
  }, [mount.current, showDialog, shouldFocus.current]);

  return (
    <>
      <div className={"box"}>
        <div className={"description"}>
          <h3>Modern Kitchen</h3>
          <p>
            Browse our collection and pick any items to view more details. In
            this collection:
          </p>
          <ul>
            {objectList.map((item) => (
              <li
                key={item.name}
                onClick={() => {
                  shouldFocus.current = true;
                  data.current = item;
                }}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
        <div ref={mount} className={"demo"}>
          <button
            className={"reset-button"}
            onClick={() => (shouldReset.current = true)}
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
}
