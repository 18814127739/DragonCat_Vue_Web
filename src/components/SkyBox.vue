<template>
  <div id="sky-box">
    <div id="container"></div>
  </div>
</template>
<script>
import * as THREE from "three";
import nx from "@assets/imgs/skybox/nx.jpg";
import ny from "@assets/imgs/skybox/ny.jpg";
import nz from "@assets/imgs/skybox/nz.jpg";
import px from "@assets/imgs/skybox/px.jpg";
import py from "@assets/imgs/skybox/py.jpg";
import pz from "@assets/imgs/skybox/pz.jpg";

export default {
  mounted() {
    this.initSkyBox();
  },
  methods: {
    initSkyBox() {
      let camera, scene, renderer;
      let texture_placeholder,
        isUserInteracting = false,
        onMouseDownMouseX = 0,
        onMouseDownMouseY = 0,
        onPointerDownPointerX = 0,
        onPointerDownPointerY = 0,
        onPointerDownLon = 0,
        onPointerDownLat = 0,
        lon = 90,
        onMouseDownLon = 0,
        lat = 0,
        onMouseDownLat = 0,
        phi = 0,
        theta = 0,
        target = new THREE.Vector3();
      let container = document.getElementById("container");
      let width = container.clientWidth,
        height = container.clientHeight;

      init();
      animate();

      function init() {
        var mesh;

        camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100);

        scene = new THREE.Scene();

        texture_placeholder = document.createElement("canvas");
        texture_placeholder.width = 128;
        texture_placeholder.height = 128;

        var context = texture_placeholder.getContext("2d");
        context.fillStyle = "rgb( 200, 200, 200 )";
        context.fillRect(
          0,
          0,
          texture_placeholder.width,
          texture_placeholder.height
        );

        var materials = [
          loadTexture(px), // right
          loadTexture(nx), // left
          loadTexture(py), // top
          loadTexture(ny), // bottom
          loadTexture(pz), // back
          loadTexture(nz) // front
        ];

        var geometry = new THREE.BoxGeometry(300, 300, 300, 7, 7, 7);
        geometry.scale(-1, 1, 1);

        mesh = new THREE.Mesh(geometry, materials);
        scene.add(mesh);

        for (var i = 0, l = mesh.geometry.vertices.length; i < l; i++) {
          var vertex = mesh.geometry.vertices[i];

          vertex.normalize();
          vertex.multiplyScalar(550);
        }

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);

        document.addEventListener("mousedown", onDocumentMouseDown, false);
        document.addEventListener("mousemove", onDocumentMouseMove, false);
        document.addEventListener("mouseup", onDocumentMouseUp, false);
        document.addEventListener("wheel", onDocumentMouseWheel, false);
        document.addEventListener("touchstart", onDocumentTouchStart, false);
        document.addEventListener("touchmove", onDocumentTouchMove, false);
        window.addEventListener("resize", onWindowResize, false);
      }

      function onWindowResize() {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }

      function loadTexture(path) {
        var texture = new THREE.Texture(texture_placeholder);
        var material = new THREE.MeshBasicMaterial({
          map: texture,
          overdraw: 0.5
        });

        var image = new Image();
        image.onload = function() {
          texture.image = this;
          texture.needsUpdate = true;
        };
        image.src = path;
        return material;
      }

      function onDocumentMouseDown(event) {
        event.preventDefault();
        isUserInteracting = true;
        onPointerDownPointerX = event.clientX;
        onPointerDownPointerY = event.clientY;
        onPointerDownLon = lon;
        onPointerDownLat = lat;
      }

      function onDocumentMouseMove(event) {
        if (isUserInteracting === true) {
          lon =
            (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
          lat =
            (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
        }
      }

      function onDocumentMouseUp(event) {
        isUserInteracting = false;
      }

      function onDocumentMouseWheel(event) {
        var fov = camera.fov + event.deltaY * 0.05;
        camera.fov = THREE.Math.clamp(fov, 10, 75);
        camera.updateProjectionMatrix();
      }

      function onDocumentTouchStart(event) {
        if (event.touches.length == 1) {
          event.preventDefault();
          onPointerDownPointerX = event.touches[0].pageX;
          onPointerDownPointerY = event.touches[0].pageY;
          onPointerDownLon = lon;
          onPointerDownLat = lat;
        }
      }

      function onDocumentTouchMove(event) {
        if (event.touches.length == 1) {
          event.preventDefault();
          lon =
            (onPointerDownPointerX - event.touches[0].pageX) * 0.1 +
            onPointerDownLon;
          lat =
            (event.touches[0].pageY - onPointerDownPointerY) * 0.1 +
            onPointerDownLat;
        }
      }

      function animate() {
        requestAnimationFrame(animate);
        update();
      }

      function update() {
        if (isUserInteracting === false) {
          lon += 0.1;
        }
        lat = Math.max(-85, Math.min(85, lat));
        phi = THREE.Math.degToRad(90 - lat);
        theta = THREE.Math.degToRad(lon);

        target.x = 500 * Math.sin(phi) * Math.cos(theta);
        target.y = 500 * Math.cos(phi);
        target.z = 500 * Math.sin(phi) * Math.sin(theta);

        camera.position.copy(target).negate();
        camera.lookAt(target);

        renderer.render(scene, camera);
      }
    }
  }
};
</script>

<style lang="less">
#sky-box {
  #container {
    width: 100%;
    height: 100%;
    position: fixed;
  }
}
</style>
