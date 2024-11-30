import { createCanvas } from "canvas";

class MockCanvasElement {
  width: number = 0;
  height: number = 0;
  getContext(contextId: string) {
    if (contextId === "2d") {
      return createCanvas(this.width, this.height).getContext("2d");
    }
    return null;
  }
  toDataURL() {
    return "data:image/png;base64,";
  }
  // 必要に応じてモックを追加
}

Object.defineProperty(global, "HTMLCanvasElement", {
  value: MockCanvasElement,
  writable: true,
});
