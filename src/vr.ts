import {
  BufferGeometry,
  Event,
  Group,
  Line,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Object3DEventMap,
  Raycaster,
  Scene,
  Vector3,
  WebGLRenderer,
  XRTargetRaySpace,
} from "three";
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory.js";

export class VR {
  // コントローラファクトリーの準備
  private controllerModelFactory = new XRControllerModelFactory();
  private line: Line;
  private scene: Scene;
  private renderer: WebGLRenderer;
  private group: Group;
  private controllers: Group;
  // レイと交差しているシェイプの一覧
  private intersected: Object3D<Object3DEventMap>[] = [];
  // ワーク行列
  private tempMatrix = new Matrix4();
  // レイキャスターの準備
  private raycaster = new Raycaster();
  private controller0: XRTargetRaySpace;
  private controller1: XRTargetRaySpace;

  constructor(
    scene: Scene,
    renderer: WebGLRenderer,
    group: Group,
    controllers: Group
  ) {
    this.line = this.createControllerLine();
    this.scene = scene;
    this.renderer = renderer;
    this.group = group;
    this.controllers = controllers;

    // コントローラの準備
    this.controller0 = this.addController(0);
    this.controller1 = this.addController(1);

    // コントローラのイベントリスナーの追加
    this.controller0.addEventListener("selectstart", this.onSelectStart);
    this.controller0.addEventListener("selectend", this.onSelectEnd);
    this.controller1.addEventListener("selectstart", this.onSelectStart);
    this.controller1.addEventListener("selectend", this.onSelectEnd);
  }

  private createControllerLine() {
    // コントローラの光線の準備
    const geometry = new BufferGeometry().setFromPoints([
      new Vector3(0, 0, 0),
      new Vector3(0, 0, -1),
    ]);
    const line = new Line(geometry);
    line.name = "line";
    line.scale.z = 5;

    return line;
  }

  // コントローラの追加
  private addController(index: number) {
    // コントローラの追加
    const controller = this.renderer.xr.getController(index);
    this.scene.add(controller);

    // コントローラモデルの追加
    const controllerGrip = this.renderer.xr.getControllerGrip(index);
    const controllerModel =
      this.controllerModelFactory.createControllerModel(controllerGrip);
    controllerGrip.add(controllerModel);
    this.scene.add(controllerGrip);

    this.controllers.add(controller);
    this.controllers.add(controllerGrip);

    // コントローラの光線の追加
    controller.add(this.line.clone());
    return controller;
  }

  // レイと交差しているシェイプの取得
  private getIntersections(controller: XRTargetRaySpace) {
    this.tempMatrix.identity().extractRotation(controller.matrixWorld);
    this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);
    return this.raycaster.intersectObjects(this.group.children, false);
  }

  // トリガーを押した時に呼ばれる
  private onSelectStart(event: Event<"selectstart", XRTargetRaySpace>) {
    const controller = event.target;

    // レイと交差しているシェイプの取得
    const intersections = this.getIntersections(controller);

    // シェイプをコントローラにアタッチし、シェイプを青くする
    if (intersections.length > 0) {
      const intersection = intersections[0];
      const object = intersection.object;
      ((object as Mesh).material as MeshStandardMaterial).emissive.b = 1;
      controller.attach(object);
      controller.userData.selected = object;
    }
  }

  // トリガーを離した時に呼ばれる
  private onSelectEnd(event: Event<"selectend", XRTargetRaySpace>) {
    const controller = event.target;

    // シェイプをグループにアタッチし、シェイプの色を戻す
    if (controller.userData.selected !== undefined) {
      const object = controller.userData.selected;
      object.material.emissive.b = 0;
      this.group.attach(object);
      controller.userData.selected = undefined;
    }
  }

  // シェイプとコントローラのレイの交差判定のクリア
  private cleanIntersected() {
    while (this.intersected.length) {
      const object = this.intersected.pop();
      ((object as Mesh).material as MeshStandardMaterial).emissive.r = 0;
    }
  }

  // シェイプとコントローラのレイの交差判定
  private intersectObjects(controller: XRTargetRaySpace) {
    // 選択時は無処理
    if (controller.userData.selected !== undefined) return;

    // 光線の取得
    const line = controller.getObjectByName("line")!;

    // レイと交差しているシェイプの取得
    const intersections = this.getIntersections(controller);

    if (intersections.length > 0) {
      // 交差時は赤くする
      const intersection = intersections[0];
      const object = intersection.object;
      ((object as Mesh).material as MeshStandardMaterial).emissive.r = 1;
      this.intersected.push(object);

      // 交差時は光線の長さをシェイプまでにする
      line.scale.z = intersection.distance;
    } else {
      // 光線の長さを固定長に戻す
      line.scale.z = 5;
    }
  }

  public animate() {
    this.cleanIntersected();

    this.intersectObjects(this.controller0);
    this.intersectObjects(this.controller1);
  }
}
