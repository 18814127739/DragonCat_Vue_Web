<template>
  <div id='three-earth'></div>
</template>

<script>
import * as THREE from "three";
import Orbitcontrols from "three-orbitcontrols";
import planetImg from "@assets/imgs/planets/Earth.png";
import planetImg2 from "@assets/imgs/planets/Earth2.jpg";

export default {
  mounted() {
    this.initEarth();
  },
  methods: {
    initEarth() {
      let camera, scene, renderer;
      let group;
      let container = document.getElementById("three-earth");
      let width = container.clientWidth,
        height = container.clientHeight;

      init();
      animate();

      function init() {
        scene = new THREE.Scene();
        group = new THREE.Group();
        scene.add(group);

        camera = new THREE.PerspectiveCamera(60, width / height, 1, 2000);
        camera.position.x = -10;
        camera.position.y = 15;
        camera.position.z = 500;
        camera.lookAt(scene.position);

        //控制地球
        let orbitControls = new Orbitcontrols(camera);
        orbitControls.autoRotate = false;
        //光源
        let ambi = new THREE.AmbientLight(0x686868);
        scene.add(ambi);

        let spotLight = new THREE.DirectionalLight(0xffffff);
        spotLight.position.set(550, 100, 550);
        spotLight.intensity = 0.6;

        scene.add(spotLight);
        // Texture
        let loader = new THREE.TextureLoader();
        let planetTexture = planetImg;

        loader.load(planetTexture, function(texture) {
          let geometry = new THREE.SphereGeometry(200, 20, 20);
          let material = new THREE.MeshBasicMaterial({
            map: texture,
            overdraw: 0.5
          });
          let mesh = new THREE.Mesh(geometry, material);
          group.add(mesh);
        });

        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0xffffff);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);
      }

      function animate() {
        requestAnimationFrame(animate);
        render();
      }
      function render() {
        group.rotation.y -= 0.005; //这行可以控制地球自转
        renderer.render(scene, camera);
      }
    }
  }
};
</script>

<style lang="less">
#three-earth {
  width: 100%;
  height: 620px;
}
</style>

