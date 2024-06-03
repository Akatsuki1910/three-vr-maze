import {
  AxesHelper,
  ConeGeometry,
  Mesh,
  MeshStandardMaterial,
  Vector3,
} from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { pixiInit } from "./pixi";
import { threeInit } from "./three";
import { pressKey } from "./utils/key";
import { pixiText } from "./utils/pixi/text";
import { CELL_SIZE, pixiMaze } from "./utils/pixiMaze";
import { createPlayer, playerMove } from "./utils/player";
import { PLANE_SIZE, threeMaze } from "./utils/threeMaze";

let mazeSize = 0;
let wallMaze: number[][] = [];

(async () => {
  const { scene, camera, group, renderer, threeAnimate, controllers } =
    threeInit();

  const far = 1.6;
  const { mesh, app, pixiAnimate, pixiUpdatePosition } = await pixiInit(
    far * camera.aspect * 2,
    far * 2
  );
  scene.add(mesh);

  const controls = new PointerLockControls(camera, renderer.domElement);
  const axesHelper = new AxesHelper(5);
  scene.add(axesHelper);

  const material = new MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.7,
    metalness: 0.0,
  });
  const object = new Mesh(new ConeGeometry(0.2, 0.2, 32), material);
  object.castShadow = true;
  object.receiveShadow = true;
  group.add(object);

  const { pixiPlayer } = createPlayer(true);
  app.stage.addChild(pixiPlayer);

  const xp = pixiText("0");
  xp.position.y = 450;
  app.stage.addChild(xp);
  const zp = pixiText("0");
  zp.position.y = 450;
  zp.position.x = 90;
  app.stage.addChild(zp);
  const nowCell = pixiText("0");
  nowCell.position.y = 450;
  nowCell.position.x = 180;
  app.stage.addChild(nowCell);
  const playerID = pixiText("");
  playerID.position.y = 480;
  app.stage.addChild(playerID);

  // const size = 31;
  // const mazeSize = (size + 1) / 2;
  // const { wallMaze } = createMaze(size, size);
  // group.add(threeMaze(wallMaze));
  // app.stage.addChild(pixiMaze(wallMaze));

  const collisionDetection = (prevPos: number) => {
    let canMove = true;

    const hasWall = (pos: number, wall: number) =>
      wallMaze[(pos / mazeSize) | 0][pos % mazeSize] === wall ||
      wallMaze[(pos / mazeSize) | 0][pos % mazeSize] === 3;

    if (prevPos !== mazeSize * mazeSize && nowPos !== prevPos) {
      if (nowPos + mazeSize === prevPos) {
        if (hasWall(nowPos, 1)) canMove = false;
      }
      if (nowPos - mazeSize === prevPos) {
        if (hasWall(prevPos, 1)) canMove = false;
      }
      if (nowPos + 1 === prevPos) {
        if (hasWall(nowPos, 2)) canMove = false;
      }
      if (nowPos - 1 === prevPos) {
        if (hasWall(prevPos, 2)) canMove = false;
      }
      if (
        nowPos + mazeSize + 1 === prevPos ||
        nowPos + mazeSize - 1 === prevPos ||
        nowPos - mazeSize + 1 === prevPos ||
        nowPos - mazeSize - 1 === prevPos
      ) {
        canMove = false;
      }
    }

    return canMove;
  };

  document.getElementsByTagName("canvas")[0].onclick = () => {
    if (!renderer.xr.getSession()) {
      controls.lock();
    }
  };

  controls.addEventListener("lock", () => {
    console.log("lock");
    // document.body.requestFullscreen();
    // app.resize();
  });

  controls.addEventListener("unlock", () => {
    console.log("unlock");
    // document.exitFullscreen();
  });

  const playerData = new Map<
    string,
    {
      pixiX: number;
      pixiY: number;
      pixiR: number;
      threeX: number;
      threeY: number;
      threeRX: number;
      threeRY: number;
      threeRZ: number;
    }
  >();
  const playerCursor = new Map<
    string,
    ReturnType<typeof createPlayer>["pixiPlayer"]
  >();
  const playerThree = new Map<
    string,
    ReturnType<typeof createPlayer>["threePlayer"]
  >();

  const socket = new WebSocket("wss://172.28.20.95:3000");
  socket.onerror = (error) => console.error(error);
  socket.onopen = () => socket.send("first");
  socket.onmessage = (event) => {
    const data = event.data.split(" ");
    if (data[0] === "first") {
      mazeSize = (Number(data[1]) + 1) / 2;
      wallMaze = JSON.parse(data[2]);

      group.add(threeMaze(wallMaze));
      app.stage.addChild(pixiMaze(wallMaze));

      playerID.text = data[3];
    } else if (data[0] === "close") {
      playerData.delete(data[1]);
      if (playerCursor.has(data[1])) {
        playerCursor.get(data[1])?.destroy();
        playerCursor.delete(data[1]);
      }

      if (playerThree.get(data[1])) {
        scene.remove(playerThree.get(data[1])!);
        playerThree.delete(data[1]);
      }
    } else {
      if (!playerCursor.has(data[0])) {
        const { pixiPlayer, threePlayer } = createPlayer();
        playerCursor.set(data[0], pixiPlayer);
        app.stage.addChild(pixiPlayer);
        playerThree.set(data[0], threePlayer);
        scene.add(threePlayer);
      }
      playerData.set(data[0], {
        pixiX: parseFloat(data[1]),
        pixiY: parseFloat(data[2]),
        pixiR: parseFloat(data[3]),
        threeX: parseFloat(data[4]),
        threeY: parseFloat(data[5]),
        threeRX: parseFloat(data[6]),
        threeRY: parseFloat(data[7]),
        threeRZ: parseFloat(data[8]),
      });
    }
  };
  socket.onclose = () => console.log("Connection closed");

  let nowPos = 0;
  let frame = 0;
  threeAnimate(async (t, f) => {
    pixiAnimate(async () => {
      if (wallMaze.length === 0) return;

      if (frame % 2 === 0) {
        socket.send(
          [
            pixiPlayer.position.x,
            pixiPlayer.position.y,
            pixiPlayer.rotation,
            controllers.position.x,
            controllers.position.z,
            camera.rotation.x,
            camera.rotation.y,
            camera.rotation.z,
          ].join(" ")
        );
      }

      const session = renderer.xr.getSession();
      const nowControllerPosition = {
        x: controllers.position.x,
        z: controllers.position.z,
      };
      const moveNum: { x: number; z: number } = { x: 0, z: 0 };

      if (session) {
        const axes0 = session.inputSources[0].gamepad?.axes;
        if (axes0) controllers.rotation.y -= axes0[2] * 0.1;
        const axes1 = session.inputSources[1].gamepad?.axes;
        if (axes1) {
          moveNum.x = axes1[2];
          moveNum.z = axes1[3];
        }
      } else {
        if (pressKey.has("KeyW")) moveNum.z--;
        if (pressKey.has("KeyA")) moveNum.x--;
        if (pressKey.has("KeyS")) moveNum.z++;
        if (pressKey.has("KeyD")) moveNum.x++;
      }

      const r = camera.rotation.y + controllers.rotation.y;
      controllers.position.x +=
        (moveNum.x * Math.cos(r) + moveNum.z * Math.sin(r)) * 0.1;
      controllers.position.z +=
        (moveNum.z * Math.cos(r) - moveNum.x * Math.sin(r)) * 0.1;

      controllers.position.x = Math.max(
        -PLANE_SIZE / 2,
        Math.min(mazeSize * PLANE_SIZE - PLANE_SIZE / 2, controllers.position.x)
      );
      controllers.position.z = Math.max(
        -PLANE_SIZE / 2,
        Math.min(mazeSize * PLANE_SIZE - PLANE_SIZE / 2, controllers.position.z)
      );

      const prevPos =
        Math.min(
          ((controllers.position.x + PLANE_SIZE / 2) / PLANE_SIZE) | 0,
          mazeSize - 1
        ) +
        Math.min(
          (((controllers.position.z + PLANE_SIZE / 2) / PLANE_SIZE) | 0) *
            mazeSize,
          mazeSize * (mazeSize - 1)
        );

      const canMove = collisionDetection(prevPos);
      if (canMove) {
        nowPos = prevPos;
        nowCell.text = nowPos.toString();
      } else {
        controllers.position.x = nowControllerPosition.x;
        controllers.position.z = nowControllerPosition.z;
      }

      camera.rotateOnWorldAxis(new Vector3(0, 1, 0), controllers.rotation.y);

      const setFar = new Vector3(
        camera.position.x + controllers.position.x,
        camera.position.y + controllers.position.y,
        camera.position.z + controllers.position.z
      ).addScaledVector(new Vector3(0, 0, -1).applyEuler(camera.rotation), far);

      pixiUpdatePosition(setFar, camera.rotation);

      playerMove(
        pixiPlayer,
        ((controllers.position.x + PLANE_SIZE / 2) / PLANE_SIZE) * CELL_SIZE,
        ((controllers.position.z + PLANE_SIZE / 2) / PLANE_SIZE) * CELL_SIZE,
        -camera.rotation.reorder("YXZ").y
      );

      playerData.forEach((value, key) => {
        const playerP = playerCursor.get(key);
        if (!playerP) return;
        playerMove(playerP, value.pixiX, value.pixiY, value.pixiR);

        const playerT = playerThree.get(key);
        if (!playerT) return;
        playerT.position.set(value.threeX, 0, value.threeY);
        playerT.rotation.set(
          value.threeRX,
          value.threeRY,
          value.threeRZ,
          "YXZ"
        );
      });

      xp.text = controllers.position.x.toFixed(2);
      zp.text = controllers.position.z.toFixed(2);

      frame++;
    });
  });
})();
