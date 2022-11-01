import {useEffect, useState} from "react";
import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls";

export default function Kitchen() {
    const [mount, setMount] = useState(null);

    useEffect(() => {
        if (mount !== null) {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);

            mount.appendChild(renderer.domElement);

            const geometry = new THREE.BoxGeometry( 1, 1, 1 );
            const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            const cube = new THREE.Mesh(geometry, material);

            scene.add(cube);

            const control = new OrbitControls(camera, renderer.domElement);
            camera.position.set( 0, 20, 100 );
            control.update();

            const animate = function () {
                requestAnimationFrame( animate );
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;
                renderer.render( scene, camera );
                control.update();
            };

            animate();
        }
    })

    return (<div ref={(ref) => setMount(ref)} />);
}