import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { Easing, Tween, update } from "@tweenjs/tween.js";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass";
import { RenderPass } from "three/addons/postprocessing/RenderPass";
import "./Kitchen.css";

export default function Kitchen() {
  const mount = useRef();
  const [data, setData] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const shouldScale = useRef(true);
  const shouldFocus = useRef(true);

  useEffect(() => {
    if (mount.current !== null && !mount.current.loaded) {
      mount.current.loaded = true;
      const objects = [];
      const clock = new THREE.Clock();
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        50,
        mount.current.clientWidth / mount.current.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 15);
      const look = new THREE.Vector3();
      const renderer = new THREE.WebGLRenderer({ antialias: true });

      renderer.setSize(mount.current.clientWidth, mount.current.clientHeight);
      mount.current.appendChild(renderer.domElement);

      const control = orbitControl();

      const outlinePass = new OutlinePass(
        new THREE.Vector2(
          mount.current.clientWidth,
          mount.current.clientHeight
        ),
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
      window.addEventListener("resize", () => onWindowResize(), false);
      renderer.domElement.addEventListener("click", (e) => onClick(e), false);

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
            objects.push(house);
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

      function render() {
        requestAnimationFrame(render);
        const delta = clock.getDelta();
        //renderer.render( scene, camera );
        update();
        //control.update(delta);
        composer.render(delta);

        if (!shouldFocus.current) {
          removeOutline();
        }
      }

      function onWindowResize() {
        camera.aspect = mount.current.clientWidth / mount.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.current.clientWith, mount.current.clientHeight);
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
          const { object } = firstObject;

          setData({ id: object.id, name: object.name });
          setShowDialog(true);
          shouldFocus.current = true;

          setOutLine(object);
          zoomTo(firstObject);

          if (shouldScale) {
            shouldScale.current = false;
          }

          render();
        }
      }

      function setOutLine(object) {
        outlinePass.selectedObjects = [object];
      }

      function removeOutline() {
        outlinePass.selectedObjects = [];
      }

      function zoomTo(objects) {
        const { object, point } = objects;
        const coords = {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z,
        };
        console.log("---camera", camera.position);
        console.log("---object id", object.id, object);
        const targetMapping = {
          31: new THREE.Vector3(-6.5, 0.849, -0.99),
          19: new THREE.Vector3(-2.5, 0.849, -0.99),
          38: new THREE.Vector3(-2.5, 0.849, -0.99),
          20: new THREE.Vector3(0.1, 0.39, 5),
        };
        const target = targetMapping[object.parent.id];

        if (target !== undefined) {
          new Tween(coords)
            .to(target, 1000)
            .easing(Easing.Quadratic.Out)
            .onUpdate(() => {
              camera.position.set(coords.x, coords.y, coords.z);
              camera.lookAt(point.x, point.y, point.z);
              camera.updateProjectionMatrix();
            })
            .onComplete(() => {
              camera.getWorldDirection(look);
            })
            .start();
        }
      }
    }
  }, [mount.current, showDialog]);

  return (
    <>
      <div className={"box"}>
        <div className={"description"}></div>
        <div ref={mount} className={"demo"} />
      </div>
    </>
  );
}
