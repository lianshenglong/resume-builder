import type { ResumeData, MagicyanFile, ResumeModule, PersonalInfoItem } from "@/types/resume"


/**
 * 创建新的简历模块
 */
export function createNewModule(order: number): ResumeModule {
  return {
    id: `module-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: "新模块",
    subtitle: "",
    timeRange: "",
    content: "",
    icon: "mdi:text-box",
    order,
  }
}

/**
 * 创建新的个人信息项
 */
export function createNewPersonalInfoItem(): PersonalInfoItem {
  return {
    id: `info-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    label: "新标签",
    value: "",
    icon: "mdi:information",
  }
}

/**
 * 导出简历数据为.magicyan文件
 */
export function exportToMagicyanFile(resumeData: ResumeData): string {
  const magicyanFile: MagicyanFile = {
    version: "1.0.0",
    data: {
      ...resumeData,
      updatedAt: new Date().toISOString(),
    },
    metadata: {
      exportedAt: new Date().toISOString(),
      appVersion: "1.0.0",
    },
  }

  return JSON.stringify(magicyanFile, null, 2)
}

/**
 * 从.magicyan文件内容导入简历数据
 */
export function importFromMagicyanFile(fileContent: string): ResumeData {
  try {
    if (!fileContent.trim()) {
      throw new Error("文件内容为空")
    }

    const magicyanFile: MagicyanFile = JSON.parse(fileContent)

    if (!magicyanFile || typeof magicyanFile !== "object") {
      throw new Error("无效的文件格式")
    }

    if (!magicyanFile.version) {
      throw new Error("缺少版本信息")
    }

    if (!magicyanFile.data) {
      throw new Error("缺少简历数据")
    }

    const data = magicyanFile.data
    if (!data.title || typeof data.title !== "string") {
      throw new Error("简历标题格式错误")
    }

    if (!Array.isArray(data.personalInfo)) {
      throw new Error("个人信息格式错误")
    }

    if (!Array.isArray(data.modules)) {
      throw new Error("简历模块格式错误")
    }

    for (const item of data.personalInfo) {
      if (!item.id || !item.label || typeof item.value !== "string") {
        throw new Error("个人信息项格式错误")
      }
    }

    for (const module of data.modules) {
      if (!module.id || typeof module.title !== "string" || typeof module.order !== "number") {
        throw new Error("简历模块格式错误")
      }
    }

    const now = new Date().toISOString()
    return {
      ...data,
      createdAt: data.createdAt || now,
      updatedAt: now,
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("文件格式不正确，请确保是有效的JSON文件")
    }
    throw error
  }
}

/**
 * 下载文件到本地
 */
export function downloadFile(content: string, filename: string, mimeType = "application/json") {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 生成PDF文件名
 */
export function generatePdfFilename(resumeTitle: string): string {
  const timestamp = new Date().toISOString().slice(0, 10)
  const cleanTitle = resumeTitle.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "_")
  return `${cleanTitle}_${timestamp}.pdf`
}




/**
 * 验证简历数据完整性
 */
export function validateResumeData(data: ResumeData): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.title?.trim()) {
    errors.push("简历标题不能为空")
  }

  if (!Array.isArray(data.personalInfo)) {
    errors.push("个人信息格式错误")
  } else {
    data.personalInfo.forEach((item, index) => {
      if (!item.id || !item.label?.trim()) {
        errors.push(`个人信息第${index + 1}项格式错误`)
      }
    })
  }

  if (!Array.isArray(data.modules)) {
    errors.push("简历模块格式错误")
  } else {
    data.modules.forEach((module, index) => {
      if (!module.id || typeof module.title !== "string") {
        errors.push(`简历模块第${index + 1}项格式错误`)
      }
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * 生成示例简历数据
 */
export function createSampleResumeData(): ResumeData {
  const now = new Date().toISOString()

  return {
    title: "廖晓娟（新茗）",
    personalInfo: [
      { id: "name", label: "姓名", value: "廖晓娟（新茗）", icon: "mdi:account" },
      { id: "phone", label: "电话", value: "156xxxx7119", icon: "mdi:phone" },
      { id: "email", label: "邮箱", value: "736xxxx86@qq.com", icon: "mdi:email" },
      { id: "github", label: "GitHub", value: "https://github.com/visiky (1.1k 粉丝)", icon: "mdi:github" },
      { id: "zhihu", label: "知乎", value: "https://www.zhihu.com/people/visiky", icon: "mdi:web" },
    ],
    modules: [
      {
        id: "education",
        title: "教育背景",
        subtitle: "华南理工大学 网络工程（本科）",
        timeRange: "2014.09.01 ~ 2018.06.30",
        content: "",
        icon: "mdi:school",
        order: 0,
      },
      {
        id: "introduction",
        title: "自我介绍",
        subtitle: "",
        timeRange: "",
        content:
          '• 多年大型项目经历，专注在可视化分析领域\n1. 项目管理: 具有独立负责制可视化项目全程经验，把控研发测试交付进展。2.可视化经验: 通用组件设计和开发经验丰富，也能完成定制可视化需求\n具体: 1. 前端早早聊 分享 "如何构思和开发开箱即用的可视化图表库 G2Plot" 2. 蚂蚁集团前端练习生 可视化讲师 3. D2论坛小游戏: https://antv.gitee.io/zh/d2, https://antv-studio.antfin.com/bless-heatmap',
        icon: "mdi:account-details",
        order: 1,
      },
      {
        id: "work-ant",
        title: "工作经历",
        subtitle: "蚂蚁集团 体验技术部",
        timeRange: "2018.06 至今",
        content:
          '1. 担任蚂蚁高管决策和管理协同产品 "数据作战室" 的前端负责人\n2. 负责蚂蚁数据 BI 产品 "DeepInsight" 的可视分析模块产品能力建设\n3. 数据可视化 AntV 团队核心成员，负责 G2、G2Plot 开源技术的建设',
        icon: "mdi:briefcase",
        order: 2,
      },
      {
        id: "work-ant-finance",
        title: "",
        subtitle: "蚂蚁金服 大数据部",
        timeRange: "2017.06 ~ 2017.12",
        content:
          "前端实习生。使用 React 参与开发多类数据产品的研发工作，同时也参与大型 BI 产品的重构工作，有良好的编码习惯。",
        icon: "mdi:briefcase-variant",
        order: 3,
      },
      {
        id: "work-shuzhi",
        title: "",
        subtitle: "数沃信息科技有限公司",
        timeRange: "2017.03 ~ 2017.05",
        content: "前端实习生。使用 Vue 来实现平台功能和逻辑，再用 ECharts 来对数据挖掘分析后的可视化结果进行展示",
        icon: "mdi:briefcase-variant",
        order: 4,
      },
      {
        id: "project-workshop",
        title: "项目经验",
        subtitle: "数据作战室",
        timeRange: "2019.04 - 2020.06",
        content:
          "项目描述：面向总裁和高管以及决策 BI 的数字化经营决策和管理协同的数据产品。提供一站式的数据化经营决策和管理协同功能，让高管高效获取指标进展以及决策洞察，并提升管理效率。\n主要工作：1. 独立负责产品从 0 到 1 的开发、产品功能迭代 （在项目中具有推动项目进度的经验）2. 产品体验精雕细琢的打磨 3. 建立稳定性保障机制。目前仍在迭代中，帮助提升高管业务决策和决策效率",
        icon: "mdi:chart-line",
        order: 5,
      },
      {
        id: "project-deepinsight",
        title: "",
        subtitle: "DeepInsight",
        timeRange: "2018.07 - 2019.04 / 2020.07 - 至今",
        content:
          "项目描述：DeepInsight 是蚂蚁集团自主研发的自助式 BI 数据洞察分析平台，主要功能包括可视化看板搭建、智能分析、数据产品建站等。看板功能类似于火山引擎、PowerBI等产品。）\n主要工作：在该项目中主要负责可视化建设以及工程治理\n1. 主导开放能力建设，拉通产品、设计建设和扩展 40+ 可视化图形，提升丰富度\n2. 产品体验优化，尤其是对 ECharts 的体验颗粒度进行改造\n3. 主导可视化能力建设：业务标准化图表库建设、促进数据分析能力增强等可视化一体化建设。同时也是 AntV G2Plot 负责人，负责将可视化技术和业务相结合。",
        icon: "mdi:chart-bar",
        order: 6,
      },
      {
        id: "project-g2",
        title: "",
        subtitle: "G2, G2Plot",
        timeRange: "2019 - 至今",
        content:
          "项目描述：G2 是基于图形语法理论的可视化渲染引擎，G2Plot 是在 G2 基础上封装的开箱即用的统计可视化图表库\n主要工作：AntV 可视化建设，高能基于蚂蚁数据可视化分析相关业务。负责 AntV G2、G2Plot、ThemeSet 主要开源建设等开源项目的研发工作，同时服务于数据可视化分析相关的部所有使用 G2 技术的产品，提供可视化解决方案和定制可视化的动。",
        icon: "mdi:chart-scatter-plot",
        order: 7,
      },
    ],
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-swkzkA6d0NGlbttDH0yZ0G6ynJnKGE.png",
    createdAt: now,
    updatedAt: now,
  }
}
