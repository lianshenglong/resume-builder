/**
 * 个人信息项的数据结构
 */
export interface PersonalInfoItem {
  /** 标签名称 */
  label: string
  /** 对应的值 */
  value: string
  /** 图标名称（来自iconify） */
  icon?: string
  /** 唯一标识符 */
  id: string
}

/**
 * 简历模块的数据结构
 */
export interface ResumeModule {
  /** 唯一标识符 */
  id: string
  /** 大标题 */
  title: string
  /** 副标题（可选） */
  subtitle?: string
  /** 时间范围（可选） */
  timeRange?: string
  /** 内容描述 */
  content: string
  /** 图标名称（可选） */
  icon?: string
  /** 模块顺序 */
  order: number
}

/**
 * 完整简历数据结构
 */
export interface ResumeData {
  /** 简历标题/姓名 */
  title: string
  /** 个人信息列表 */
  personalInfo: PersonalInfoItem[]
  /** 简历模块列表 */
  modules: ResumeModule[]
  /** 头像URL（可选） */
  avatar?: string
  /** 创建时间 */
  createdAt: string
  /** 最后修改时间 */
  updatedAt: string
}

/**
 * 文件保存/导入的数据结构
 */
export interface MagicyanFile {
  /** 文件版本 */
  version: string
  /** 简历数据 */
  data: ResumeData
  /** 文件元数据 */
  metadata: {
    /** 导出时间 */
    exportedAt: string
    /** 应用版本 */
    appVersion: string
  }
}

/**
 * 编辑器状态类型
 */
export interface EditorState {
  /** 当前编辑的简历数据 */
  resumeData: ResumeData
  /** 是否处于编辑模式 */
  isEditing: boolean
  /** 当前选中的模块ID */
  selectedModuleId?: string
  /** 是否显示预览 */
  showPreview: boolean
}
