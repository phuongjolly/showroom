import {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader";
import {Easing, Tween, update} from "@tweenjs/tween.js";

export default function Kitchen() {
    const mount = useRef();
    const [object1, setObject1] = useState(null);

    useEffect(() => {
        if (mount.current !== null && !mount.current.loaded) {
            mount.current.loaded = true;
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ antialias: true } );
            renderer.setSize(window.innerWidth, window.innerHeight);

            mount.current.appendChild(renderer.domElement);

            const geometry = new THREE.BoxGeometry( 1, 1, 1 );
            const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            const cube = new THREE.Mesh(geometry, material);

            //const control = new OrbitControls(camera, renderer.domElement);
            camera.position.set( 0, 0, 15 );
            //control.update();

            const mouse = new THREE.Vector2();
            const raycaster = new THREE.Raycaster();
            const look = new THREE.Vector3();
            renderer.domElement.addEventListener('click', (event) => { console.log("--debug..."); onClick(event) }, false);
            window.addEventListener('resize', () => onWindowResize(), false);

            const animate = function () {
                requestAnimationFrame( animate );
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;
                renderer.render( scene, camera );
                camera.updateProjectionMatrix();
                update();
                //control.update();
            };

            function loadHouse() {
                const loader = new GLTFLoader();

                loader.load( './resources/kitchen_room/scene.gltf',  ( gltf ) => {
                    const house = gltf.scene;
                    house.position.set(0, -5, -2);
                    house.scale.set(3,3,3);
                    setObject1(house);

                    scene.add(house);
                }, undefined, ( error ) => {
                    console.error( error );
                } );
            }

            function onClick(event) {
                //hardcode item
                const items = new Set([36, 62]);

                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
                raycaster.setFromCamera(mouse, camera);

                const intersects = raycaster.intersectObject(scene, true);
                console.log("---debug: ", intersects);
                if (intersects.length > 0) {
                    const { object, point } = intersects[0];
                    const coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z};

                    console.log("---debug: ", object.id);

                    if (items.has(object.id)) {
                        console.log("yes....");
                        new Tween(coords)
                            .to({ x: point.x, y: point.y, z: point.z + 7.0 }, 1000)
                            .easing(Easing.Quadratic.Out)
                            .onUpdate(() => {
                                    console.log("check camera......");
                                    camera.position.set(coords.x, coords.y, coords.z)
                                    camera.lookAt(point.x, point.y, point.z);
                                    camera.updateProjectionMatrix();
                                }
                            )
                            .onComplete(() => {
                                //const modal = document.getElementsByClassName("modal");
                                //modal.item(0).style.visibility = "visible";
                                //modal.item(0).style.opacity = 1;
                                console.log("on complete......");

                                camera.getWorldDirection( look );
                            })
                            .start();
                    }
                    animate();
                }
            }

            function onWindowResize() {
                camera.aspect = window.innerWidth / window.innerHeight
                camera.updateProjectionMatrix()
                renderer.setSize(window.innerWidth, window.innerHeight)
                animate();
            }

            loadHouse();
            animate();
        }
    }, [mount.current])

    return (<div ref={mount} />);
}