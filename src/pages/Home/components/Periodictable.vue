<template>
  <div id='periodictable'>
    <div
      id="container"
      class="bg-f0fff0-00e5ee"
    ></div>
    <div id="menu">
      <button
        v-for="item in showType"
        :key="item.id"
        :id="item.id"
        :class="item.id === curType ? 'active' : null"
        @click="curType = item.id"
      >{{item.name}}</button>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import TWEEN from "tween";
import CSS3DRenderer from "@assets/libs/threejslibs/CSS3DRenderer";
import TrackballControls from "@assets/libs/threejslibs/TrackballControls";
import constants from "@constants";

const table = constants.table;

export default {
  data() {
    return {
      curType: "table",
      showType: [
        { id: "table", name: "悬浮墙" },
        { id: "sphere", name: "水晶球" },
        { id: "helix", name: "螺旋塔" },
        { id: "grid", name: "展览厅" }
      ]
    };
  },
  mounted() {
    this.initPeriodictable();
  },
  methods: {
    initPeriodictable() {
      let camera, scene, renderer;
      let controls;
      let objects = [];
      let targets = { table: [], sphere: [], helix: [], grid: [] };
      let container = document.getElementById("container");
      let width = container.clientWidth,
        height = container.clientHeight;

      init();
      animate();

      function init() {
        camera = new THREE.PerspectiveCamera(40, width / height, 1, 10000);
        camera.position.z = 3000;

        scene = new THREE.Scene();

        // table
        for (let i = 0; i < table.length; i += 5) {
          const element = document.createElement("div");
          element.className = "element";
          element.style.backgroundColor =
            "rgba(155,48,255," + (Math.random() * 0.5 + 0.25) + ")";

          const number = document.createElement("div");
          number.className = "number";
          number.textContent = i / 5 + 1;
          element.appendChild(number);

          const symbol = document.createElement("div");
          symbol.className = "symbol";
          symbol.textContent = table[i];
          element.appendChild(symbol);

          const details = document.createElement("div");
          details.className = "details";
          details.innerHTML = table[i + 1] + "<br>" + table[i + 2];
          element.appendChild(details);

          var object = new THREE.CSS3DObject(element);
          object.position.x = Math.random() * 4000 - 2000;
          object.position.y = Math.random() * 4000 - 2000;
          object.position.z = Math.random() * 4000 - 2000;
          scene.add(object);

          objects.push(object);

          var object = new THREE.Object3D();
          object.position.x = table[i + 3] * 140 - 1330;
          object.position.y = -(table[i + 4] * 180) + 1050; // 周期表的y方向

          targets.table.push(object);
        }

        // sphere
        var vector = new THREE.Vector3();
        var spherical = new THREE.Spherical();

        for (var i = 0, l = objects.length; i < l; i++) {
          var phi = Math.acos(-1 + (2 * i) / l);
          var theta = Math.sqrt(l * Math.PI) * phi;

          var object = new THREE.Object3D();

          spherical.set(800, phi, theta);

          object.position.setFromSpherical(spherical);

          vector.copy(object.position).multiplyScalar(2);

          object.lookAt(vector);

          targets.sphere.push(object);
        }

        // helix
        var vector = new THREE.Vector3();
        var cylindrical = new THREE.Cylindrical();

        for (var i = 0, l = objects.length; i < l; i++) {
          var theta = i * 0.175 + Math.PI;
          var y = -(i * 8) + 450;

          var object = new THREE.Object3D();

          cylindrical.set(900, theta, y);

          object.position.setFromCylindrical(cylindrical);

          vector.x = object.position.x * 2;
          vector.y = object.position.y;
          vector.z = object.position.z * 2;

          object.lookAt(vector);

          targets.helix.push(object);
        }

        // grid
        for (var i = 0; i < objects.length; i++) {
          var object = new THREE.Object3D();

          object.position.x = (i % 5) * 400 - 800;
          object.position.y = -(Math.floor(i / 5) % 5) * 400 + 800;
          object.position.z = Math.floor(i / 25) * 1000 - 2000;

          targets.grid.push(object);
        }

        //

        renderer = new THREE.CSS3DRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("container").appendChild(renderer.domElement);

        //

        controls = new THREE.TrackballControls(camera, renderer.domElement);
        controls.rotateSpeed = 1.5;
        controls.minDistance = 500;
        controls.maxDistance = 6000;
        controls.addEventListener("change", render);

        var button = document.getElementById("table");
        button.addEventListener(
          "click",
          function(event) {
            transform(targets.table, 2000);
          },
          false
        );

        var button = document.getElementById("sphere");
        button.addEventListener(
          "click",
          function(event) {
            transform(targets.sphere, 2000);
          },
          false
        );

        var button = document.getElementById("helix");
        button.addEventListener(
          "click",
          function(event) {
            transform(targets.helix, 2000);
          },
          false
        );

        var button = document.getElementById("grid");
        button.addEventListener(
          "click",
          function(event) {
            transform(targets.grid, 2000);
          },
          false
        );

        transform(targets.table, 2000);

        //

        window.addEventListener("resize", onWindowResize, false);
      }

      function transform(targets, duration) {
        TWEEN.removeAll();
        for (var i = 0; i < objects.length; i++) {
          var object = objects[i];
          var target = targets[i];
          new TWEEN.Tween(object.position)
            .to(
              {
                x: target.position.x,
                y: target.position.y,
                z: target.position.z
              },
              Math.random() * duration + duration
            )
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

          new TWEEN.Tween(object.rotation)
            .to(
              {
                x: target.rotation.x,
                y: target.rotation.y,
                z: target.rotation.z
              },
              Math.random() * duration + duration
            )
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
        }

        new TWEEN.Tween(this)
          .to({}, duration * 2)
          .onUpdate(render)
          .start();
      }

      function onWindowResize() {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        render();
      }

      function animate() {
        requestAnimationFrame(animate);
        TWEEN.update();
        controls.update();
      }

      function render() {
        renderer.render(scene, camera);
      }
    }
  }
};
</script>

<style lang="less">
#periodictable {
  width: 100%;
  height: 100%;
  position: fixed;
  #container {
    width: 100%;
    height: 100%;
    margin: 0;
    font-family: Helvetica, sans-serif;
    overflow: hidden;
  }

  #menu {
    position: absolute;
    top: 10px;
    width: 100%;
    text-align: center;
  }

  .element {
    width: 120px;
    height: 160px;
    box-shadow: 0px 0px 12px rgba(0, 255, 255, 0.5);
    border: 1px solid rgba(127, 255, 255, 0.25);
    text-align: center;
    cursor: default;
    .number {
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 12px;
      color: rgba(127, 255, 255, 0.75);
    }
    .symbol {
      position: absolute;
      top: 40px;
      left: 0px;
      right: 0px;
      font-size: 60px;
      font-weight: bold;
      color: rgba(255, 255, 255, 0.75);
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.95);
    }
    .details {
      position: absolute;
      bottom: 15px;
      left: 0px;
      right: 0px;
      font-size: 12px;
      color: rgba(127, 255, 255, 0.75);
    }
  }

  .element:hover {
    box-shadow: 0px 0px 12px rgba(255, 0, 98, 0.5);
    border: 1px solid rgba(127, 255, 255, 0.75);
  }

  button {
    color: #5f5f5f;
    background: transparent;
    outline: 1px solid rgba(155, 48, 255, 0.35);
    border: 0px;
    padding: 5px 10px;
    cursor: pointer;
  }
  button:hover {
    background-color: rgba(255, 255, 255, 0.8);
    color: #9b30ff;
  }
  .active {
    color: #9b30ff;
    background-color: rgba(255, 255, 255, 0.8);
  }
}
</style>

