// 定义颜色数据类型
export class HexColor {
  constructor(name, colorSpace, colorHex) {
    this.name = name;
    this.colorSpace = colorSpace;
    this.colorHex = colorHex;
  }
}

export class RawColor {
  constructor(name, colorSpace, c1 = 0, c2 = 0, c3 = 0, c4 = 0) {
    this.name = name;
    this.colorSpace = colorSpace;
    this.component1 = c1;
    this.component2 = c2; 
    this.component3 = c3;
    this.component4 = c4;
  }
} 