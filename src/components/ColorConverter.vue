<template>
  <div class="converter-container">
    <div class="header">
      <h1>Adobe Color Swatch 转换工具</h1>
      <div class="header-divider"></div>
      <div class="features">
        <span class="feature-item">
          <el-icon><Document /></el-icon>
          TXT转ACO
        </span>
        <span class="feature-item">
          <el-icon><Picture /></el-icon>
          ACO转Excel
        </span>
        <span class="feature-item">
          <el-icon><Edit /></el-icon>
          手动创建
        </span>
      </div>
    </div>

    <el-row :gutter="20" class="main-content">
      <!-- 左侧上传区域 -->
      <el-col :span="8">
        <div class="side-panel">
          <h3>文件操作</h3>
          <div class="upload-group">
            <div class="upload-item">
              <el-upload
                class="upload-area"
                action=""
                :auto-upload="false"
                accept=".txt"
                :show-file-list="false"
                @change="handleTxtUpload">
                <el-button type="primary" class="upload-button">
                  <el-icon><Upload /></el-icon>
                  <span>导入TXT文件</span>
                </el-button>
              </el-upload>
              <div class="upload-tip">支持格式：名称,(R,G,B) 或 名称,#RRGGBB</div>
            </div>

            <div class="upload-item">
              <el-upload
                class="upload-area"
                action=""
                :auto-upload="false"
                accept=".xlsx"
                :show-file-list="false"
                @change="handleXlsxUpload">
                <el-button type="primary" class="upload-button">
                  <el-icon><Upload /></el-icon>
                  <span>导入Excel文件</span>
                </el-button>
              </el-upload>
            </div>

            <div class="upload-item">
              <el-upload
                class="upload-area"
                action=""
                :auto-upload="false"
                accept=".aco"
                :show-file-list="false"
                @change="handleAcoUpload">
                <el-button type="primary" class="upload-button">
                  <el-icon><Upload /></el-icon>
                  <span>导入ACO文件</span>
                </el-button>
              </el-upload>
            </div>
          </div>

          <!-- 添加模板下载区域 -->
          <div class="template-download">
            <h4>模板下载</h4>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-button @click="downloadTxtTemplate" class="template-button">
                  <el-icon><Download /></el-icon>
                  TXT模板
                </el-button>
              </el-col>
              <el-col :span="12">
                <el-button @click="downloadXlsxTemplate" class="template-button">
                  <el-icon><Download /></el-icon>
                  Excel模板
                </el-button>
              </el-col>
            </el-row>
          </div>

          <!-- 手动添加颜色表单 -->
          <div class="add-color-form">
            <h3>添加新颜色</h3>
            <el-form :model="newColor" @submit.prevent="addColor">
              <el-form-item>
                <el-input v-model="newColor.name" placeholder="颜色名称" />
              </el-form-item>
              
              <el-form-item label="RGB值">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-input-number 
                      v-model="newColor.rgb.r" 
                      :min="0" 
                      :max="255"
                      @change="handleNewColorRgbChange"
                      placeholder="R"
                      controls-position="right"
                      size="default"/>
                  </el-col>
                  <el-col :span="8">
                    <el-input-number 
                      v-model="newColor.rgb.g" 
                      :min="0" 
                      :max="255"
                      @change="handleNewColorRgbChange"
                      placeholder="G"
                      controls-position="right"
                      size="default"/>
                  </el-col>
                  <el-col :span="8">
                    <el-input-number 
                      v-model="newColor.rgb.b" 
                      :min="0" 
                      :max="255"
                      @change="handleNewColorRgbChange"
                      placeholder="B"
                      controls-position="right"
                      size="default"/>
                  </el-col>
                </el-row>
              </el-form-item>

              <el-form-item label="颜色选择">
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-color-picker 
                      v-model="newColor.hex"
                      :show-alpha="false"
                      @change="handlePickerChange"
                      class="color-picker"/>
                  </el-col>
                  <el-col :span="12">
                    <el-input 
                      v-model="newColor.hex" 
                      placeholder="#RRGGBB"
                      @change="handleNewColorHexChange"/>
                  </el-col>
                </el-row>
              </el-form-item>

              <el-form-item>
                <div class="color-preview-large" 
                  :style="{ 
                    backgroundColor: newColor.hex,
                    border: newColor.hex.toLowerCase() === '#ffffff' ? '1px solid #dcdfe6' : 'none'
                  }">
                </div>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="addColor" class="add-button">
                  <el-icon><Plus /></el-icon>
                  添加颜色
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>

      <!-- 右侧颜色列表 -->
      <el-col :span="16">
        <div class="color-panel" v-loading="loading">
          <div class="panel-header">
            <h3>颜色列表</h3>
            <div class="panel-actions">
              <el-button-group v-if="colorList.length">
                <el-button type="primary" @click="generateAco" v-if="sourceFormat === 'txt'">
                  生成ACO文件
                </el-button>
                <el-button type="success" @click="exportExcel" v-if="sourceFormat === 'aco' || !sourceFormat">
                  导出Excel
                </el-button>
                <el-button type="success" @click="exportMarkdown" v-if="sourceFormat === 'aco' || !sourceFormat">
                  导出Markdown
                </el-button>
                <el-button type="primary" @click="generateAco" v-if="!sourceFormat">
                  生成ACO文件
                </el-button>
              </el-button-group>
            </div>
          </div>

          <template v-if="colorList.length">
            <el-table :data="colorList" border style="width: 100%">
              <el-table-column label="预览" width="100" align="center">
                <template #default="scope">
                  <div class="color-preview-wrapper">
                    <div 
                      class="color-preview" 
                      :style="{ 
                        backgroundColor: scope.row.hex,
                        border: scope.row.hex.toLowerCase() === '#ffffff' ? '1px solid #dcdfe6' : 'none'
                      }">
                    </div>
                  </div>
                </template>
              </el-table-column>
              
              <el-table-column prop="name" label="名称" min-width="150">
                <template #default="scope">
                  <el-input v-model="scope.row.name" placeholder="颜色名称"/>
                </template>
              </el-table-column>
              
              <el-table-column label="RGB值" width="300" align="center">
                <template #default="scope">
                  <el-row :gutter="10">
                    <el-col :span="8">
                      <el-input-number 
                        v-model="scope.row.rgb.r" 
                        :min="0" 
                        :max="255"
                        @change="() => handleColorChange(scope.row)"
                        placeholder="R"
                        controls-position="right"
                        size="small"/>
                    </el-col>
                    <el-col :span="8">
                      <el-input-number 
                        v-model="scope.row.rgb.g" 
                        :min="0" 
                        :max="255"
                        @change="() => handleColorChange(scope.row)"
                        placeholder="G"
                        controls-position="right"
                        size="small"/>
                    </el-col>
                    <el-col :span="8">
                      <el-input-number 
                        v-model="scope.row.rgb.b" 
                        :min="0" 
                        :max="255"
                        @change="() => handleColorChange(scope.row)"
                        placeholder="B"
                        controls-position="right"
                        size="small"/>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
              
              <el-table-column prop="hex" label="十六进制" width="120" align="center">
                <template #default="scope">
                  <el-input v-model="scope.row.hex" placeholder="#RRGGBB" size="small"/>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="100" align="center">
                <template #default="scope">
                  <el-button 
                    type="danger" 
                    circle
                    size="small"
                    @click="removeColor(scope.$index)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <template v-else>
            <div class="empty-tip">
              <el-empty description="暂无颜色数据" />
            </div>
          </template>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Delete, Upload, Plus, Download, Document, Picture, Edit } from '@element-plus/icons-vue'

// 动态导入大型库
const XLSX = await import('xlsx')
const html2canvas = (await import('html2canvas')).default

const colorList = ref([])
const loading = ref(false)
const sourceFormat = ref('')

// 新增颜色的表单数据
const newColor = reactive({
  name: '',
  rgb: { r: 0, g: 0, b: 0 },
  hex: '#000000'
})

// 添加新颜色
const addColor = () => {
  if (!newColor.name.trim()) {
    ElMessage.warning('请输入颜色名称')
    return
  }

  colorList.value.push({
    name: newColor.name,
    rgb: { 
      r: parseInt(newColor.rgb.r), 
      g: parseInt(newColor.rgb.g), 
      b: parseInt(newColor.rgb.b) 
    },
    hex: newColor.hex.toUpperCase()
  })

  // 重置表单
  newColor.name = ''
  newColor.rgb = { r: 0, g: 0, b: 0 }
  newColor.hex = '#000000'

  // 如果是第一次手动添加颜色，设置sourceFormat为空字符串
  if (!sourceFormat.value) {
    sourceFormat.value = ''
  }

  ElMessage.success('添加颜色成功')
}

// 删除颜色
const removeColor = (index) => {
  colorList.value.splice(index, 1)
  // 如果删除后列表为空，重置sourceFormat
  if (colorList.value.length === 0) {
    sourceFormat.value = ''
  }
  ElMessage.success('删除颜色成功')
}

// 处理颜色选择器变化
const handlePickerChange = (color) => {
  if (color) {
    // 更新hex值
    newColor.hex = color.toUpperCase()
    // 更新RGB值
    const rgb = hexToRgb(color)
    if (rgb) {
      newColor.rgb.r = rgb.r
      newColor.rgb.g = rgb.g
      newColor.rgb.b = rgb.b
    }
  }
}

// 处理TXT文件上传
const handleTxtUpload = async (file) => {
  if (!file.raw) return
  
  try {
    loading.value = true
    sourceFormat.value = 'txt'
    const text = await file.raw.text()
    const colors = parseTxt(text)
    colorList.value = colors.map(color => ({
      ...color,
      rgb: hexToRgb(color.hex)
    }))
    ElMessage.success('TXT文件解析成功')
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

// 处理ACO文件上传
const handleAcoUpload = async (file) => {
  if (!file.raw) return
  
  try {
    loading.value = true
    sourceFormat.value = 'aco'
    const buffer = await file.raw.arrayBuffer()
    const colors = parseAcoFile(buffer)
    colorList.value = colors.map(color => ({
      ...color,
      rgb: hexToRgb(color.hex)
    }))
    ElMessage.success('ACO文件解析成功')
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

// 生成ACO文件
const generateAco = () => {
  if (colorList.value.length === 0) {
    ElMessage.warning('请先上传颜色文件')
    return
  }

  try {
    const acoData = generateAcoFile(colorList.value)
    downloadFile(acoData, 'colors.aco', 'application/octet-stream')
    ElMessage.success('ACO文件生成成功')
  } catch (error) {
    ElMessage.error('生成ACO文件失败: ' + error.message)
  }
}

// 修改导出Excel相关函数，使用异步方式
const exportExcel = async () => {
  const data = colorList.value.map(color => ({
    '名称': color.name,
    'RGB值': `(${color.rgb.r},${color.rgb.g},${color.rgb.b})`,
    '十六进制': color.hex
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Colors')
  XLSX.writeFile(wb, 'colors.xlsx')
}

// 修改Excel导入处理函数，使用异步方式
const handleXlsxUpload = async (file) => {
  if (!file.raw) return
  
  try {
    loading.value = true
    sourceFormat.value = 'xlsx'
    const data = await readXlsxFile(file.raw)
    colorList.value = data.map(item => ({
      name: item['名称'],
      hex: parseColorValue(item['十六进制']),
      rgb: parseRgbValue(item['RGB值'])
    }))
    ElMessage.success('Excel文件解析成功')
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

// 修改导出Markdown函数
const exportMarkdown = async () => {
  // 创建临时DOM元素来渲染Markdown表格
  const tempDiv = document.createElement('div')
  tempDiv.style.padding = '20px'
  tempDiv.style.background = 'white'
  tempDiv.style.position = 'absolute'
  tempDiv.style.left = '-9999px'
  tempDiv.style.top = '-9999px'
  
  // 创建表格HTML
  const table = document.createElement('table')
  table.style.borderCollapse = 'collapse'
  table.style.width = '100%'
  table.style.maxWidth = '800px'
  table.style.margin = '0 auto'
  table.style.fontFamily = 'Arial, sans-serif'
  
  // 添加表头
  const header = `
    <tr style="background: #f5f7fa;">
      <th style="padding: 12px; border: 1px solid #dcdfe6; text-align: left;">名称</th>
      <th style="padding: 12px; border: 1px solid #dcdfe6; text-align: center;">RGB值</th>
      <th style="padding: 12px; border: 1px solid #dcdfe6; text-align: center;">十六进制</th>
      <th style="padding: 12px; border: 1px solid #dcdfe6; text-align: center;">预览</th>
    </tr>
  `
  
  // 添加数据行
  const rows = colorList.value.map(color => `
    <tr>
      <td style="padding: 12px; border: 1px solid #dcdfe6;">${color.name}</td>
      <td style="padding: 12px; border: 1px solid #dcdfe6; text-align: center;">
        (${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})
      </td>
      <td style="padding: 12px; border: 1px solid #dcdfe6; text-align: center;">
        ${color.hex}
      </td>
      <td style="padding: 12px; border: 1px solid #dcdfe6; text-align: center;">
        <div style="
          width: 40px;
          height: 40px;
          border-radius: 4px;
          margin: 0 auto;
          background-color: ${color.hex};
          border: ${color.hex.toLowerCase() === '#ffffff' ? '1px solid #dcdfe6' : 'none'};
        "></div>
      </td>
    </tr>
  `).join('')
  
  table.innerHTML = header + rows
  tempDiv.appendChild(table)
  document.body.appendChild(tempDiv)
  
  try {
    // 生成图片
    const canvas = await html2canvas(tempDiv, {
      scale: 2, // 提高图片质量
      backgroundColor: 'white',
      logging: false
    })
    
    // 导出图片
    const imgData = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = imgData
    link.download = 'colors.png'
    link.click()
    
    // 同时导出Markdown文本
    const markdownContent = `| 名称 | RGB值 | 十六进制 | 预览 |\n| --- | --- | --- | --- |\n` +
      colorList.value.map(color => 
        `| ${color.name} | (${color.rgb.r},${color.rgb.g},${color.rgb.b}) | ${color.hex} | ![](https://via.placeholder.com/15/${color.hex.replace('#', '')}/000000?text=+) |`
      ).join('\n')
    
    const markdownBlob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' })
    const markdownUrl = URL.createObjectURL(markdownBlob)
    const markdownLink = document.createElement('a')
    markdownLink.href = markdownUrl
    markdownLink.download = 'colors.md'
    markdownLink.click()
    URL.revokeObjectURL(markdownUrl)
    
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出图片失败: ' + error.message)
  } finally {
    // 清理临时DOM元素
    document.body.removeChild(tempDiv)
  }
}

// 修改解析ACO文件函数
function parseAcoFile(buffer) {
  const view = new DataView(buffer)
  const colors = []
  
  try {
    // 检查版本1
    const version1 = view.getUint16(0, false)
    console.log('Version 1:', version1)
    if (version1 !== 1) {
      throw new Error('不支持的ACO文件版本')
    }
    
    // 读取版本1数据
    const version1Count = view.getUint16(2, false)
    console.log('Version 1 color count:', version1Count)
    let offset = 4
    
    // 读取并打印版本1的颜色空间信
    console.log('Version 1 color spaces:')
    for (let i = 0; i < version1Count; i++) {
      const colorSpace = view.getUint16(offset, false)
      console.log(`Color ${i + 1} space:`, colorSpace)
      offset += 10
    }
    
    // 检查版本2
    const version2 = view.getUint16(offset, false)
    console.log('Version 2:', version2)
    if (version2 !== 2) {
      throw new Error('不支持的ACO文件版本2')
    }
    
    // 读取版本2数据
    const version2Count = view.getUint16(offset + 2, false)
    console.log('Version 2 color count:', version2Count)
    offset += 4
    
    // 读取并打印版本2的颜色空间信息
    console.log('Version 2 color spaces:')
    for (let i = 0; i < version2Count; i++) {
      const colorSpace = view.getUint16(offset, false)
      console.log(`Color ${i + 1} space:`, colorSpace)
      
      // 颜色空间映射
      const colorSpaceMap = {
        0: 'RGB',
        1: 'HSB',
        2: 'CMYK',
        7: 'Lab',
        8: 'Grayscale'
      }
      console.log(`Color ${i + 1} space type:`, colorSpaceMap[colorSpace] || 'Unknown')
      
      // 读取颜色数据
      const w = view.getUint16(offset + 2, false)
      const x = view.getUint16(offset + 4, false)
      const y = view.getUint16(offset + 6, false)
      const z = view.getUint16(offset + 8, false)
      console.log(`Color ${i + 1} values:`, w, x, y, z)
      
      offset += 10
      
      // 读取名称长度
      const nameLength = view.getUint32(offset, false)
      offset += 4
      
      // 读取名称
      const nameBytes = new Uint8Array(buffer, offset, (nameLength - 1) * 2)
      const name = new TextDecoder('utf-16be').decode(nameBytes)
      console.log(`Color ${i + 1} name:`, name)
      
      offset += nameLength * 2
      
      // 如果是RGB颜色空间，添加到列表
      if (colorSpace === 0) {
        colors.push({
          name,
          hex: `#${Math.round((w / 65535) * 255).toString(16).padStart(2,'0')}${
            Math.round((x / 65535) * 255).toString(16).padStart(2,'0')}${
            Math.round((y / 65535) * 255).toString(16).padStart(2,'0')}`.toUpperCase()
        })
      } else {
        console.warn(`跳过非RGB颜色空间(${colorSpaceMap[colorSpace]})的颜色: ${name}`)
      }
    }
    
    if (colors.length === 0) {
      throw new Error('没有找到有效的RGB颜色数据')
    }
    
  } catch (error) {
    console.error('ACO解析错误:', error)
    throw new Error(`ACO文件格式错误: ${error.message}`)
  }
  
  return colors
}

// 工具函数
function parseTxt(text) {
  try {
    const lines = text.split(/\r?\n/).filter(line => line.trim())
    
    return lines.map((line, index) => {
      const firstCommaIndex = line.indexOf(',')
      if (firstCommaIndex === -1) {
        throw new Error(`第 ${index + 1} 行错误: 格式不正确，应为"名称,颜色值"`)
      }
      
      const name = line.substring(0, firstCommaIndex).trim()
      const colorValue = line.substring(firstCommaIndex + 1).trim()
      
      if (!name) {
        throw new Error(`第 ${index + 1} 错误: 颜色名称不能为空`)
      }
      
      let hex
      const cleanColorValue = colorValue.replace(/\s+/g, '')
      const rgbMatch = cleanColorValue.match(/^\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/)
      
      if (rgbMatch) {
        const [_, r, g, b] = rgbMatch
        const rNum = parseInt(r, 10)
        const gNum = parseInt(g, 10)
        const bNum = parseInt(b, 10)
        
        if (rNum > 255 || gNum > 255 || bNum > 255) {
          throw new Error(`第 ${index + 1} 行错误: RGB值必须在0-255之间`)
        }
        
        hex = '#' + [rNum, gNum, bNum]
          .map(x => x.toString(16).padStart(2, '0'))
          .join('')
      } 
      else if (cleanColorValue.match(/^#?[A-Fa-f0-9]{6}$/)) {
        hex = cleanColorValue.startsWith('#') ? cleanColorValue : '#' + cleanColorValue
      }
      else {
        throw new Error(`第 ${index + 1} 行错误: 颜色值格式不正确，应为6位16进制RGB值(如#FF0000)或RGB格式(如(255,0,0))`)
      }
      
      return {
        name,
        hex: hex.toUpperCase()
      }
    })
      
  } catch (error) {
    throw new Error(`TXT 解析错误: ${error.message}`)
  }
}

function hexToRgb(hex) {
  // 移除#号并统一大写
  hex = hex.replace('#', '').toUpperCase()
  
  // 确保是6位16进制
  if (hex.length !== 6) {
    return { r: 0, g: 0, b: 0 }
  }
  
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  
  return {
    r: isNaN(r) ? 0 : r,
    g: isNaN(g) ? 0 : g,
    b: isNaN(b) ? 0 : b
  }
}

function rgbToHex(rgb) {
  // 确保RGB值在有效范围内
  const r = Math.min(255, Math.max(0, Math.round(rgb.r)))
  const g = Math.min(255, Math.max(0, Math.round(rgb.g)))
  const b = Math.min(255, Math.max(0, Math.round(rgb.b)))
  
  return '#' + [r, g, b]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

function generateAcoFile(colors) {
  // 计算缓冲区大小
  let totalSize = 4 // 版本1头部
  totalSize += colors.length * 10 // 版本1颜色数据
  totalSize += 4 // 版本2头部
  
  colors.forEach(color => {
    totalSize += 10 // 版本2颜色数据
    totalSize += 4 // 名称长度
    totalSize += (color.name.length + 1) * 2 // UTF-16BE编码的名称 + null结尾
  })
  
  const buffer = new ArrayBuffer(totalSize)
  const view = new DataView(buffer)
  
  // 写入版本1数据
  view.setUint16(0, 1, false)
  view.setUint16(2, colors.length, false)
  
  let offset = 4
  colors.forEach(color => {
    const rgb = hexToRgb(color.hex)
    
    view.setUint16(offset, 0, false)
    view.setUint16(offset + 2, Math.round((rgb.r / 255) * 65535), false)
    view.setUint16(offset + 4, Math.round((rgb.g / 255) * 65535), false)
    view.setUint16(offset + 6, Math.round((rgb.b / 255) * 65535), false)
    view.setUint16(offset + 8, 0, false)
    
    offset += 10
  })
  
  // 写入版本2数据
  view.setUint16(offset, 2, false)
  view.setUint16(offset + 2, colors.length, false)
  offset += 4
  
  colors.forEach(color => {
    const rgb = hexToRgb(color.hex)
    
    view.setUint16(offset, 0, false)
    view.setUint16(offset + 2, Math.round((rgb.r / 255) * 65535), false)
    view.setUint16(offset + 4, Math.round((rgb.g / 255) * 65535), false)
    view.setUint16(offset + 6, Math.round((rgb.b / 255) * 65535), false)
    view.setUint16(offset + 8, 0, false)
    offset += 10
    
    const nameLength = color.name.length + 1
    view.setUint32(offset, nameLength, false)
    offset += 4
    
    for (let i = 0; i < color.name.length; i++) {
      view.setUint16(offset, color.name.charCodeAt(i), false)
      offset += 2
    }
    
    view.setUint16(offset, 0, false)
    offset += 2
  })
  
  return buffer
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

// 添加新的处理函数
const handleNewColorRgbChange = () => {
  // 更新hex值
  newColor.hex = rgbToHex(newColor.rgb)
}

const handleNewColorHexChange = () => {
  // 验证hex格式
  const hexRegex = /^#?[0-9A-Fa-f]{6}$/
  if (!hexRegex.test(newColor.hex)) {
    ElMessage.warning('请输入有效的十六进制颜色值')
    return
  }
  
  // 确保有#前缀
  if (!newColor.hex.startsWith('#')) {
    newColor.hex = '#' + newColor.hex
  }
  
  // 更新RGB值
  const rgb = hexToRgb(newColor.hex)
  if (rgb) {
    newColor.rgb.r = rgb.r
    newColor.rgb.g = rgb.g
    newColor.rgb.b = rgb.b
  }
  
  // 转换为大写
  newColor.hex = newColor.hex.toUpperCase()
}

// 读取Excel文件
const readXlsxFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(firstSheet)
        resolve(jsonData)
      } catch (error) {
        reject(new Error('Excel文件格式错误'))
      }
    }
    reader.onerror = () => reject(new Error('读取文件失败'))
    reader.readAsArrayBuffer(file)
  })
}

// 解析颜色值
const parseColorValue = (value) => {
  if (!value) throw new Error('颜色值不能为空')
  
  // 确保是6位16进制值
  const hex = value.replace('#', '').trim()
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
    throw new Error('无效的十六进制颜色')
  }
  return '#' + hex.toUpperCase()
}

// 解析RGB值
const parseRgbValue = (value) => {
  if (!value) throw new Error('RGB值不能为空')
  
  // 匹配(R,G,B)格式
  const match = value.match(/^\((\d+),\s*(\d+),\s*(\d+)\)$/)
  if (!match) throw new Error('无效的RGB值格式')
  
  const [_, r, g, b] = match
  return {
    r: parseInt(r),
    g: parseInt(g),
    b: parseInt(b)
  }
}

// 下载TXT模板
const downloadTxtTemplate = () => {
  const template = 
`红色,(255,0,0)
绿色,(0,255,0)
蓝色,(0,0,255)
# 或使用十六进制格式：
黑色,#000000
白色,#FFFFFF`

  const blob = new Blob([template], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'template.txt'
  link.click()
  URL.revokeObjectURL(url)
}

// 下载Excel模板
const downloadXlsxTemplate = () => {
  const template = [
    {
      '名称': '红色',
      'RGB值': '(255,0,0)',
      '十六进制': '#FF0000'
    },
    {
      '名称': '绿色',
      'RGB值': '(0,255,0)',
      '十六进制': '#00FF00'
    },
    {
      '名称': '蓝色',
      'RGB值': '(0,0,255)',
      '十六进制': '#0000FF'
    }
  ]
  
  const ws = XLSX.utils.json_to_sheet(template)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Colors')
  XLSX.writeFile(wb, 'template.xlsx')
}
</script>

<style scoped>
.converter-container {
  max-width: 1300px;
  margin: 0px auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 20px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.header h1 {
  color: #303133;
  font-size: 24px;
  margin: 0;
  font-weight: 600;
}

.header-divider {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #409eff, #67c23a);
  margin: 15px auto;
  border-radius: 2px;
}

.features {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 10px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #606266;
  font-size: 14px;
}

.feature-item :deep(.el-icon) {
  color: #409eff;
}

.main-content {
  margin-top: 20px;
}

.side-panel {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  max-height: calc(100vh - 180px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #909399 #f4f4f5;
}

.side-panel h3 {
  margin: 0 0 15px;
  color: #303133;
  font-size: 16px;
}

.upload-group {
  margin-bottom: 20px;
}

.upload-item {
  margin-bottom: 10px;
}

.upload-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.add-color-form {
  border-top: 1px solid #e4e7ed;
  padding-top: 15px;
  margin-top: 15px;
}

.add-color-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}

.color-panel {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-header h3 {
  margin: 0;
  color: #303133;
  font-size: 18px;
}

.color-preview-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.color-preview {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  transition: transform 0.2s;
}

.color-preview:hover {
  transform: scale(1.1);
}

.color-preview-text {
  font-size: 24px;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-table) {
  --el-table-border-color: #e4e7ed;
  --el-table-header-bg-color: #f5f7fa;
}

:deep(.el-table .cell) {
  padding: 8px;
}

:deep(.el-table th) {
  font-weight: 600;
  color: #303133;
  background-color: var(--el-table-header-bg-color);
}

:deep(.el-input__wrapper),
:deep(.el-input-number__wrapper) {
  box-shadow: none !important;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

:deep(.el-input__wrapper:hover),
:deep(.el-input-number__wrapper:hover) {
  border-color: #409eff;
}

.action-buttons {
  margin-top: 25px;
  padding: 15px 0;
  text-align: right;
  border-top: 1px solid #e4e7ed;
}

.empty-tip {
  text-align: center;
  padding: 60px 0;
  color: #909399;
  font-size: 16px;
}

.upload-tip {
  color: #909399;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
  line-height: 1.5;
}

:deep(.el-button) {
  padding: 0 15px;
  font-weight: 500;
}

:deep(.el-button--primary) {
  background-color: #409eff;
}

:deep(.el-button--success) {
  background-color: #67c23a;
}

:deep(.el-button:hover) {
  transform: translateY(-1px);
}

.color-picker {
  width: 100%;
}

:deep(.el-color-picker__trigger) {
  width: 100%;
  height: 32px;
  padding: 2px;
}

:deep(.el-color-picker__color) {
  border: none;
}

.color-preview-large {
  width: 100%;
  height: 80px;
  border-radius: 8px;
  transition: transform 0.2s;
  margin: 8px 0;
}

.add-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

:deep(.el-color-picker) {
  width: 100%;
}

:deep(.el-color-picker__trigger) {
  width: 100%;
  height: 36px;
  padding: 4px;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-form-item) {
  margin-bottom: 15px;
}

:deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

:deep(.el-input__wrapper),
:deep(.el-input-number__wrapper) {
  box-shadow: none !important;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

:deep(.el-input__wrapper:hover),
:deep(.el-input-number__wrapper:hover) {
  border-color: #409eff;
}

.color-picker-wrapper {
  display: flex;
  gap: 10px;
  align-items: center;
}

.template-download {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e4e7ed;
}

.template-download h4 {
  margin: 0 0 10px;
  color: #303133;
  font-size: 14px;
}

.template-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.side-panel::-webkit-scrollbar {
  width: 6px;
}

.side-panel::-webkit-scrollbar-track {
  background: #f4f4f5;
  border-radius: 3px;
}

.side-panel::-webkit-scrollbar-thumb {
  background: #909399;
  border-radius: 3px;
}
</style> 