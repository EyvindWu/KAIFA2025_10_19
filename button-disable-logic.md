# 打印和催单按钮禁用逻辑说明

## 功能概述
为处于禁用状态但用户可见的打印按钮和催单按钮添加点击提醒功能，确保用户了解为什么这些功能在当前状态下不可用。

## 按钮状态逻辑

### 打印按钮状态

| 订单状态 | 按钮状态 | 点击行为 | 提示信息 |
|---------|---------|----------|----------|
| `Pending Pickup` | ✅ 启用 | 正常打印功能 | - |
| `In Transit` | ❌ 禁用 | 显示提醒弹窗 | "运单已生成且包裹在途，此阶段不支持重新打印标签" |
| `Delivered` | ❌ 禁用 | 显示提醒弹窗 | "运单已生成且包裹在途，此阶段不支持重新打印标签" |
| `Cancelled` | ❌ 禁用 | 显示提醒弹窗 | "运单已生成且包裹在途，此阶段不支持重新打印标签" |
| 其他状态 | ❌ 禁用 | 显示提醒弹窗 | "运单已生成且包裹在途，此阶段不支持重新打印标签" |

### 催单按钮状态

| 订单状态 | 按钮状态 | 点击行为 | 提示信息 |
|---------|---------|----------|----------|
| `Pending Pickup` | ✅ 启用 | 正常催单功能 | - |
| `In Transit` | ❌ 禁用 | 显示提醒弹窗 | "运单已生成且包裹在途，此阶段不支持催单功能" |
| `Delivered` | ❌ 禁用 | 显示提醒弹窗 | "运单已生成且包裹在途，此阶段不支持催单功能" |
| `Cancelled` | ❌ 禁用 | 显示提醒弹窗 | "运单已生成且包裹在途，此阶段不支持催单功能" |
| 其他状态 | ❌ 禁用 | 显示提醒弹窗 | "运单已生成且包裹在途，此阶段不支持催单功能" |

## 实现细节

### 1. 主页面按钮实现 (`app/page.tsx`)

```javascript
// 打印按钮
<div className="flex items-center gap-1">
  <button
    onClick={() => isPrintDisabled ? alert('运单已生成且包裹在途，此阶段不支持重新打印标签') : handlePrint(order)}
    className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border-0 outline-none font-semibold ${isPrintDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    title={isPrintDisabled ? '运单已生成且包裹在途，此阶段不支持重新打印标签' : t('downloadPdf')}
    type="button"
    disabled={isPrintDisabled}
  >
    <Printer className="h-5 w-5" />
    <span className="hidden sm:inline">Print</span>
  </button>
  {isPrintDisabled && (
    <button
      className="flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-colors text-xs font-bold"
      title="打印功能限制说明"
      onClick={() => alert('运单已生成且包裹在途，此阶段不支持重新打印标签')}
    >
      !
    </button>
  )}
</div>

// 催单按钮
<div className="flex items-center gap-1">
  <button
    onClick={() => isRemindDisabled ? alert('运单已生成且包裹在途，此阶段不支持催单功能') : onRemindClick(order)}
    className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border-0 outline-none font-semibold ${isRemindDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    title={isRemindDisabled ? '运单已生成且包裹在途，此阶段不支持催单功能' : t('remind')}
    type="button"
    disabled={isRemindDisabled}
  >
    <Bell className="h-5 w-5" />
    <span className="hidden sm:inline">{isRemindSent ? t('reminded') : t('remind')}</span>
  </button>
  {isRemindDisabled && (
    <button
      className="flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-colors text-xs font-bold"
      title="催单功能限制说明"
      onClick={() => alert('运单已生成且包裹在途，此阶段不支持催单功能')}
    >
      !
    </button>
  )}
</div>
```

### 2. 订单详情页面按钮实现 (`app/track/detail/[trackingNo]/page.tsx`)

```javascript
{/* 打印按钮 */}
<div className="flex items-center gap-1">
  {order.status === 'Pending Pickup' ? (
    <button
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border-0 outline-none font-semibold"
      onClick={() => window.print()}
      type="button"
    >
      {/* Print icon */}
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 9V2h12v7" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 14h12v7H6z" /></svg>
      <span className="hidden sm:inline">{t('print')}</span>
    </button>
  ) : (
    <>
      <button
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg transition-all duration-200 shadow-xl border-0 outline-none font-semibold opacity-50 cursor-not-allowed"
        onClick={() => alert('运单已生成且包裹在途，此阶段不支持重新打印标签')}
        type="button"
        disabled
        title="运单已生成且包裹在途，此阶段不支持重新打印标签"
      >
        {/* Print icon */}
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 9V2h12v7" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 14h12v7H6z" /></svg>
        <span className="hidden sm:inline">{t('print')}</span>
      </button>
      <button
        className="flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-colors text-xs font-bold"
        title="打印功能限制说明"
        onClick={() => alert('运单已生成且包裹在途，此阶段不支持重新打印标签')}
      >
        !
      </button>
    </>
  )}
</div>
```

## 提示按钮设计

### 样式特点
- **颜色**: 橙色 (`bg-orange-500`) 突出重要性
- **形状**: 圆形按钮 (`rounded-full`)
- **图标**: 感叹号 (`!`) 表示需要注意
- **大小**: 小尺寸 (`w-6 h-6`) 不占用过多空间
- **悬停效果**: 颜色加深 (`hover:bg-orange-600`)

### 交互行为
- **点击**: 弹出 alert 显示具体的禁用原因
- **悬停**: 显示 tooltip 说明功能限制
- **显示条件**: 仅在按钮被禁用时显示

## 用户体验

1. **视觉反馈**: 禁用的按钮显示为半透明 (`opacity-50`)
2. **明确提示**: 橙色感叹号按钮提供明确的限制说明
3. **双重提醒**: 主按钮点击和提示按钮点击都显示相同信息
4. **一致性**: 主页面和详情页面使用相同的逻辑和样式
5. **可访问性**: 按钮有适当的 title 属性和禁用状态

## 技术实现要点

1. **条件渲染**: 使用条件渲染显示/隐藏提示按钮
2. **事件处理**: 禁用状态下显示提醒而不是执行原功能
3. **样式控制**: 使用动态 className 控制按钮状态
4. **状态判断**: 基于订单状态判断按钮是否禁用
5. **提示信息**: 统一的提示文案确保用户体验一致性

## 测试场景

1. **Pending Pickup 订单**: 按钮正常，无提示按钮
2. **In Transit 订单**: 按钮禁用，显示提示按钮
3. **Delivered 订单**: 按钮禁用，显示提示按钮
4. **Cancelled 订单**: 按钮禁用，显示提示按钮
5. **点击禁用按钮**: 显示相应的提醒信息
6. **点击提示按钮**: 显示相同的提醒信息

## 提示文案

### 打印按钮
- **禁用原因**: "运单已生成且包裹在途，此阶段不支持重新打印标签"
- **业务逻辑**: 只有Pending Pickup状态的订单可以打印标签

### 催单按钮
- **禁用原因**: "运单已生成且包裹在途，此阶段不支持催单功能"
- **业务逻辑**: 只有Pending Pickup状态的订单可以催单

## 设计原则

1. **用户友好**: 提供清晰的禁用原因说明
2. **视觉一致**: 与其他提示按钮保持相同的设计风格
3. **功能明确**: 用户能够理解为什么功能不可用
4. **操作反馈**: 点击禁用按钮时提供即时反馈
5. **信息完整**: 提示信息包含具体的业务逻辑说明 