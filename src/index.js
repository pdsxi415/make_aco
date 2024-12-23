import { ColorConverter } from './converter.js';

const { createApp, ref } = Vue;
const { ElMessage } = ElementPlus;

const App = {
  setup() {
    const colorList = ref([]);
    const loading = ref(false);

    const handleFileUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      try {
        loading.value = true;
        const text = await file.text();
        const colors = parseTxt(text);
        colorList.value = colors.map(color => ({
          ...color,
          rgb: hexToRgb(color.hex)
        }));
        ElMessage.success('文件解析成功');
      } catch (error) {
        ElMessage.error(error.message);
      } finally {
        loading.value = false;
      }
    };

    const handleColorChange = (row) => {
      const rgb = row.rgb;
      if (rgb.r > 255 || rgb.g > 255 || rgb.b > 255 || 
          rgb.r < 0 || rgb.g < 0 || rgb.b < 0) {
        ElMessage.warning('RGB值必须在0-255之间');
        return;
      }
      row.hex = rgbToHex(rgb);
    };

    const generateAco = () => {
      if (colorList.value.length === 0) {
        ElMessage.warning('请先上传颜色文件');
        return;
      }

      try {
        const acoData = generateAcoFile(colorList.value);
        downloadFile(acoData, 'colors.aco', 'application/octet-stream');
        ElMessage.success('ACO文件生成成功');
      } catch (error) {
        ElMessage.error('生成ACO文件失败: ' + error.message);
      }
    };

    return {
      colorList,
      loading,
      handleFileUpload,
      handleColorChange,
      generateAco
    };
  },

  template: `
    <div class="converter-container">
      <div class="header">
        <h1>Adobe Color Swatch 转换工具</h1>
        <p>支持TXT转ACO，可编辑颜色值</p>
      </div>

      <div class="upload-section">
        <el-upload
          action=""
          :auto-upload="false"
          accept=".txt"
          :show-file-list="false"
          @change="handleFileUpload">
          <template #trigger>
            <el-button type="primary">选择TXT文件</el-button>
          </template>
          <div class="upload-tip">
            支持的格式：名称,(R,G,B) 或 名称,#RRGGBB
          </div>
        </el-upload>
      </div>

      <div class="color-table" v-loading="loading">
        <template v-if="colorList.length">
          <el-table :data="colorList" border style="width: 100%">
            <el-table-column label="预览" width="80">
              <template #default="scope">
                <div 
                  class="color-preview" 
                  :style="{ backgroundColor: scope.row.hex }">
                </div>
              </template>
            </el-table-column>
            
            <el-table-column prop="name" label="名称">
              <template #default="scope">
                <el-input v-model="scope.row.name" placeholder="颜色名称"/>
              </template>
            </el-table-column>
            
            <el-table-column label="RGB值" width="300">
              <template #default="scope">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-input-number 
                      v-model="scope.row.rgb.r" 
                      :min="0" 
                      :max="255"
                      @change="handleColorChange(scope.row)"
                      placeholder="R"/>
                  </el-col>
                  <el-col :span="8">
                    <el-input-number 
                      v-model="scope.row.rgb.g" 
                      :min="0" 
                      :max="255"
                      @change="handleColorChange(scope.row)"
                      placeholder="G"/>
                  </el-col>
                  <el-col :span="8">
                    <el-input-number 
                      v-model="scope.row.rgb.b" 
                      :min="0" 
                      :max="255"
                      @change="handleColorChange(scope.row)"
                      placeholder="B"/>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            
            <el-table-column prop="hex" label="十六进制" width="120">
              <template #default="scope">
                <el-input v-model="scope.row.hex" placeholder="#RRGGBB"/>
              </template>
            </el-table-column>
          </el-table>

          <div class="action-buttons">
            <el-button type="primary" @click="generateAco">
              生成ACO文件
            </el-button>
          </div>
        </template>
        <template v-else>
          <div class="empty-tip">
            请上传TXT文件以查看颜色列表
          </div>
        </template>
      </div>
    </div>
  `
};

// 创建Vue应用
createApp(App).use(ElementPlus).mount('#app');

// 工具函数
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(rgb) {
  return '#' + [rgb.r, rgb.g, rgb.b]
    .map(x => Math.round(x).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

// 其他函数保持不变... 