# 多语言功能实现说明

## 概述

本项目已实现完整的英语、汉语、意大利语三种语言切换功能，支持整个网站的多语言显示。

## 技术实现

### 1. 语言上下文 (LanguageContext)

位置：`app/context/LanguageContext.tsx`

- 提供全局语言状态管理
- 支持语言切换和持久化存储
- 自动检测浏览器语言偏好
- 提供完整的翻译字典

### 2. 翻译工具函数

位置：`app/utils/translations.ts`

- 提供便捷的 `useTranslation` Hook
- 支持动态翻译键查找
- 返回当前语言状态和切换函数

### 3. 翻译字典结构

翻译字典按功能模块组织：

```typescript
{
  en: {
    // Header & Navigation
    shipping: 'Shipping',
    tracking: 'Tracking',
    support: 'Support',
    
    // Homepage
    professionalLogistics: 'Smart Logistics Solutions for Your Business',
    shipPackages: 'Ship Packages',
    
    // Tracking
    trackYourPackage: 'Track Your Package',
    orderDetail: 'Order Detail',
    
    // Login
    email: 'Email',
    password: 'Password',
    login: 'Login',
    
    // Admin
    adminPanel: 'Admin Panel',
    dashboard: 'Dashboard',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    // ... 更多翻译
  },
  zh: {
    // 中文翻译
  },
  it: {
    // 意大利语翻译
  }
}
```

## 使用方法

### 1. 在组件中使用翻译

```typescript
import { useTranslation } from '../utils/translations'

export default function MyComponent() {
  const { t, currentLanguage, setCurrentLanguage, languages } = useTranslation()
  
  return (
    <div>
      <h1>{t('pageTitle')}</h1>
      <p>{t('description')}</p>
      
      {/* 语言切换 */}
      <select onChange={(e) => setCurrentLanguage(e.target.value)}>
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  )
}
```

### 2. 添加新的翻译键

1. 在 `app/context/LanguageContext.tsx` 中的 `translations` 对象中添加新键
2. 为所有三种语言提供翻译
3. 在组件中使用 `t('newKey')` 调用

```typescript
// 在 LanguageContext.tsx 中添加
en: {
  newKey: 'English Text',
  // ...
},
zh: {
  newKey: '中文文本',
  // ...
},
it: {
  newKey: 'Testo Italiano',
  // ...
}
```

## 已实现的功能

### 1. 页面翻译

- ✅ 主页 (Homepage)
- ✅ 登录页面 (Login Page)
- ✅ 跟踪详情页面 (Tracking Detail Page)
- ✅ 头部导航 (Header Navigation)
- ✅ 移动端菜单 (Mobile Menu)

### 2. 语言切换

- ✅ 桌面端语言选择器
- ✅ 移动端语言选择器
- ✅ 语言偏好持久化存储
- ✅ 浏览器语言自动检测

### 3. 支持的语言

- 🇺🇸 English (en)
- 🇨🇳 中文 (zh)
- 🇮🇹 Italiano (it)

## 测试

访问 `/test-lang` 页面可以测试所有翻译功能：

- 语言切换
- 翻译键显示
- 实时语言更新

## 注意事项

1. **翻译键命名**：使用 camelCase 命名，如 `trackYourPackage`
2. **缺失翻译**：如果翻译键不存在，会显示键名本身
3. **语言检测**：首次访问时会根据浏览器语言自动选择
4. **持久化**：语言选择会保存在 localStorage 中

## 扩展其他语言

如需添加其他语言（如德语、法语等）：

1. 在 `translations` 对象中添加新语言
2. 在 `languages` 数组中添加语言选项
3. 在语言检测逻辑中添加支持

```typescript
// 添加德语支持
de: {
  // 德语翻译
},
// 在 languages 数组中添加
{ code: 'de', name: 'Deutsch', flag: '🇩🇪' }
```

## 文件结构

```
app/
├── context/
│   └── LanguageContext.tsx    # 语言上下文
├── utils/
│   └── translations.ts        # 翻译工具函数
├── components/
│   └── Header.tsx            # 头部组件（已集成翻译）
├── login/
│   └── page.tsx              # 登录页面（已集成翻译）
├── track/
│   └── detail/[trackingNo]/
│       └── page.tsx          # 跟踪详情页面（已集成翻译）
├── page.tsx                  # 主页（已集成翻译）
└── test-lang/
    └── page.tsx              # 语言测试页面
```

## 性能优化

- 翻译字典按需加载
- 语言切换时只更新必要的组件
- 使用 React Context 避免不必要的重渲染
- 翻译键缓存机制

## 维护建议

1. 定期检查翻译的准确性和一致性
2. 新功能开发时同步添加翻译
3. 使用翻译测试页面验证功能
4. 保持翻译键的命名规范 