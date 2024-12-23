// 定义颜色空间枚举
export const ColorSpace = {
  RGB: { id: 0, label: 'RGB', supported: true },
  HSB: { id: 1, label: 'HSB', supported: true }, 
  CMYK: { id: 2, label: 'CMYK', supported: true },
  PANTONE: { id: 3, label: 'Pantone matching system', supported: false },
  FOCOLTONE: { id: 4, label: 'Focoltone colour system', supported: false },
  TRUMATCH: { id: 5, label: 'Trumatch color', supported: false },
  TOYO: { id: 6, label: 'Toyo 88 colorfinder 1050', supported: false },
  LAB: { id: 7, label: 'Lab', supported: false },
  GRAYSCALE: { id: 8, label: 'Grayscale', supported: true },
  HKS: { id: 10, label: 'HKS colors', supported: false }
}; 