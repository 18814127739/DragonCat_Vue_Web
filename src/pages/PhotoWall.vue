<template>
  <PageContainer class="photo-wall">
    <div class="wrapper">
      <div id="container"></div>
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
    <CheckPhotoDialog
      :photos="photos"
      :index="curIndex"
      :visible="visible"
      @onClose="onClose"
    />
    <VerifyDialog />
  </PageContainer>
</template>

<script>
import * as THREE from "three";
import TWEEN from "tween";
import CSS3DRenderer from "@assets/libs/threejslibs/CSS3DRenderer";
import TrackballControls from "@assets/libs/threejslibs/TrackballControls";
import CheckPhotoDialog from "@components/CheckPhotoDialog";
import VerifyDialog from "@components/VerifyDialog";
import constants from "../constants";

const table = constants.table;
const photos = constants.photos;

export default {
  components: {
    CheckPhotoDialog,
    VerifyDialog
  },
  data() {
    return {
      photos: photos,
      curIndex: 0,
      curType: "table",
      showType: [
        { id: "table", name: "悬浮墙" },
        { id: "sphere", name: "水晶球" },
        { id: "helix", name: "螺旋塔" },
        { id: "grid", name: "展览厅" }
      ],
      visible: false
    };
  },
  mounted() {
    this.initPeriodictable();
  },
  methods: {
    onCheckPhoto(index) {
      this.curIndex = index;
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    initPeriodictable() {
      const that = this;
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
        for (let i = 0; i < photos.length; i++) {
          const element = document.createElement("div");
          element.onclick = function() {
            that.onCheckPhoto(i);
          };
          element.className = "element";
          element.style.backgroundColor =
            "rgba(94,94,94," + (Math.random() * 0.5 + 0.25) + ")";

          const img = document.createElement("img");
          img.className = "img";
          img.src = photos[i].path;
          element.appendChild(img);

          var object = new THREE.CSS3DObject(element);
          object.position.x = Math.random() * 4000 - 2000;
          object.position.y = Math.random() * 4000 - 2000;
          object.position.z = Math.random() * 4000 - 2000;
          scene.add(object);

          objects.push(object);

          var object = new THREE.Object3D();
          object.position.x = photos[i].x * 140 - 1330;
          object.position.y = -(photos[i].y * 180) + 990; // 周期表的y方向

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
.photo-wall {
  .wrapper {
    width: 100%;
    height: 100%;
    position: fixed;
    #container {
      width: 100%;
      height: 100%;
      background: -webkit-gradient(
        linear,
        left 0,
        right 0,
        from(#f0fff0),
        to(#00e5ee)
      );
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
      display: flex;
      align-items: center;
      width: 120px;
      height: 160px;
      box-shadow: 0px 0px 12px rgba(0, 255, 255, 0.5);
      border: 1px solid rgba(127, 255, 255, 0.25);
      text-align: center;
      cursor: pointer;
      overflow: hidden;
      img {
        height: auto;
        width: 100%;
      }
    }

    .element:hover {
      box-shadow: 0px 0px 12px rgba(255, 0, 98, 0.5);
      border: 1px solid rgba(127, 255, 255, 0.75);
    }

    button {
      color: #6f6f6f;
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
}
</style>

