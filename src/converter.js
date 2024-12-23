import { HexColor, RawColor } from './types.js';
import { ColorSpace } from './colorSpace.js';

export class ColorConverter {
  static validateColorSpace(colorSpace) {
    if (!colorSpace.supported) {
      throw new Error(`不支持的颜色空间: ${colorSpace.label}`);
    }
  }

  static mapToHexColor(name, colorSpace, c1 = 0, c2 = 0, c3 = 0, c4 = 0) {
    this.validateColorSpace(colorSpace);
    
    switch(colorSpace.id) {
      case ColorSpace.RGB.id:
        if (!(0 <= c1 && c1 <= 65535) || 
            !(0 <= c2 && c2 <= 65535) || 
            !(0 <= c3 && c3 <= 65535) || 
            c4 !== 0) {
          throw new Error(`无效的 RGB 值: ${c1}, ${c2}, ${c3}, ${c4}`);
        }
        return new HexColor(
          name,
          colorSpace,
          `#${c1.toString(16).padStart(4,'0')}${c2.toString(16).padStart(4,'0')}${c3.toString(16).padStart(4,'0')}`
        );
        
      case ColorSpace.HSB.id:
        if (!(0 <= c1 && c1 <= 65535) || 
            !(0 <= c2 && c2 <= 65535) || 
            !(0 <= c3 && c3 <= 65535) || 
            c4 !== 0) {
          throw new Error(`无效的 HSB 值: ${c1}, ${c2}, ${c3}, ${c4}`);
        }
        return new HexColor(
          name,
          colorSpace,
          `#${c1.toString(16).padStart(4,'0')}${c2.toString(16).padStart(4,'0')}${c3.toString(16).padStart(4,'0')}`
        );
        
      case ColorSpace.CMYK.id:
        if (!(0 <= c1 && c1 <= 65535) || 
            !(0 <= c2 && c2 <= 65535) || 
            !(0 <= c3 && c3 <= 65535) || 
            !(0 <= c4 && c4 <= 65535)) {
          throw new Error(`无效的 CMYK 值: ${c1}, ${c2}, ${c3}, ${c4}`);
        }
        return new HexColor(
          name,
          colorSpace,
          `#${c1.toString(16).padStart(4,'0')}${c2.toString(16).padStart(4,'0')}${c3.toString(16).padStart(4,'0')}${c4.toString(16).padStart(4,'0')}`
        );
        
      case ColorSpace.GRAYSCALE.id:
        if (!(0 <= c1 && c1 <= 10000) || c2 !== 0 || c3 !== 0 || c4 !== 0) {
          throw new Error(`无效的灰度值: ${c1}, ${c2}, ${c3}, ${c4}`);
        }
        return new HexColor(
          name,
          colorSpace,
          `#${c1.toString(16).padStart(4,'0')}`
        );
        
      default:
        throw new Error(`不支持的颜色空间: ${colorSpace.label}`);
    }
  }

  static mapToRawColor(name, colorSpace, colorHex = '') {
    this.validateColorSpace(colorSpace);
    
    colorHex = colorHex.replace('#', '').trim();
    if (!colorHex) {
      throw new Error('颜色值不能为空');
    }

    switch(colorSpace.id) {
      case ColorSpace.RGB.id:
      case ColorSpace.HSB.id:
        if (colorHex.length === 6) {
          // 8位色彩处理
          return new RawColor(
            name,
            colorSpace,
            parseInt(colorHex.substr(0,2), 16) * 257,
            parseInt(colorHex.substr(2,2), 16) * 257,
            parseInt(colorHex.substr(4,2), 16) * 257
          );
        } else if (colorHex.length === 12) {
          // 16位色彩处理
          return new RawColor(
            name,
            colorSpace,
            parseInt(colorHex.substr(0,4), 16),
            parseInt(colorHex.substr(4,4), 16),
            parseInt(colorHex.substr(8,4), 16)
          );
        }
        throw new Error(`不支持的颜色格式: ${colorHex}`);

      case ColorSpace.CMYK.id:
        if (colorHex.length === 8) {
          return new RawColor(
            name,
            colorSpace,
            parseInt(colorHex.substr(0,2), 16) * 257,
            parseInt(colorHex.substr(2,2), 16) * 257,
            parseInt(colorHex.substr(4,2), 16) * 257,
            parseInt(colorHex.substr(6,2), 16) * 257
          );
        } else if (colorHex.length === 16) {
          return new RawColor(
            name,
            colorSpace,
            parseInt(colorHex.substr(0,4), 16),
            parseInt(colorHex.substr(4,4), 16),
            parseInt(colorHex.substr(8,4), 16),
            parseInt(colorHex.substr(12,4), 16)
          );
        }
        throw new Error(`不支持的颜色格式: ${colorHex}`);

      case ColorSpace.GRAYSCALE.id:
        let gray;
        if (colorHex.length === 2) {
          gray = parseInt(colorHex, 16) * 257;
        } else if (colorHex.length === 4) {
          gray = parseInt(colorHex, 16);
        } else {
          throw new Error(`不支持的颜色格式: ${colorHex}`);
        }
        
        if (gray > 10000) {
          throw new Error(`无效的灰度值: ${colorHex}`);
        }
        
        return new RawColor(name, colorSpace, gray);

      default:
        throw new Error(`不支持的颜色空间: ${colorSpace.label}`);
    }
  }
} 