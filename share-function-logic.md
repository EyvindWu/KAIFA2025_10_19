# 分享功能开放逻辑说明

## 功能概述
分享功能根据订单状态和时间限制来控制是否允许用户分享订单信息。

## 开放逻辑规则

| 订单状态 | 分享按钮状态 | 说明 | 提示信息 |
|---------|-------------|------|----------|
| `Pending Pickup` | ✅ 开放 | 包裹未取件，可正常分享 | - |
| `In Transit` | ✅ 开放 | 包裹运输中，收件人可查看动态 | - |
| `Delivered` | ✅ 保留30天 | 包裹签收后，分享链接继续有效30天 | - |
| 签收超30天 | ❌ 关闭 | 分享链接失效，按钮置灰 | "包裹签收超过30天，分享链接已失效" |
| 已取消 / 失败 | ❌ 关闭 | 不提供分享功能 | "已取消或失败的订单不提供分享功能" |
| 其他状态 | ❌ 关闭 | 当前订单状态不允许分享 | "当前订单状态不允许分享" |

## 实现细节

### 1. 主页面分享逻辑 (`app/page.tsx`)

```javascript
// 分享功能开放逻辑
const shareDisabledMap = Object.fromEntries(pagedOrders.map(order => {
  const now = new Date();
  const orderDate = order.createdAt ? new Date(order.createdAt) : null;
  
  // 已取消或失败的订单
  if (['Cancelled', 'Exception'].includes(order.status)) {
    return [order.id, true];
  }
  
  // Delivered状态：检查是否超过30天
  if (order.status === 'Delivered' && orderDate) {
    const daysSinceDelivery = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
    return [order.id, daysSinceDelivery > 30];
  }
  
  // Pending Pickup 和 In Transit 状态：允许分享
  if (['Pending Pickup', 'In Transit'].includes(order.status)) {
    return [order.id, false];
  }
  
  // 其他状态：不允许分享
  return [order.id, true];
}));
```

### 2. 分享按钮渲染逻辑

```javascript
<div className="flex items-center gap-1">
  <button
    onClick={e => handleShare(order, e)}
    className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 border-0 outline-none font-semibold share-btn ${isShareDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
    title={t('share')}
    type="button"
    disabled={isShareDisabled}
  >
    <Share2 className="h-5 w-5" />
    <span className="hidden sm:inline">Share</span>
  </button>
  {isShareDisabled && (
    <button
      className="flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-colors text-xs font-bold"
      title="分享功能限制说明"
      onClick={() => {
        // 显示具体的禁用原因
        const message = getDisableReason(order);
        alert(message);
      }}
    >
      !
    </button>
  )}
</div>
```

### 3. 订单详情页面分享逻辑 (`app/track/detail/[trackingNo]/page.tsx`)

订单详情页面使用内联逻辑来判断分享状态：

```javascript
{(() => {
  const now = new Date();
  const orderDate = order.createdAt ? new Date(order.createdAt) : null;
  let isShareDisabled = false;
  let disableReason = '';
  
  // 已取消或失败的订单
  if (['Cancelled', 'Exception'].includes(order.status)) {
    isShareDisabled = true;
    disableReason = '已取消或失败的订单不提供分享功能';
  }
  // Delivered状态：检查是否超过30天
  else if (order.status === 'Delivered' && orderDate) {
    const daysSinceDelivery = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceDelivery > 30) {
      isShareDisabled = true;
      disableReason = '包裹签收超过30天，分享链接已失效';
    }
  }
  // Pending Pickup 和 In Transit 状态：允许分享
  else if (['Pending Pickup', 'In Transit'].includes(order.status)) {
    isShareDisabled = false;
  }
  // 其他状态：不允许分享
  else {
    isShareDisabled = true;
    disableReason = '当前订单状态不允许分享';
  }
  
  return (
    // 渲染分享按钮和提示按钮
  );
})()}
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
- **悬停**: 显示 tooltip "分享功能限制说明"
- **显示条件**: 仅在分享按钮被禁用时显示

## 用户体验

1. **视觉反馈**: 禁用的分享按钮显示为半透明
2. **明确提示**: 橙色感叹号按钮提供明确的限制说明
3. **一致性**: 主页面和详情页面使用相同的逻辑和样式
4. **可访问性**: 按钮有适当的 title 属性和禁用状态

## 技术实现要点

1. **时间计算**: 使用 `Date` 对象计算天数差
2. **状态映射**: 使用 `Object.fromEntries` 创建状态映射
3. **条件渲染**: 使用条件渲染显示/隐藏提示按钮
4. **样式控制**: 使用动态 className 控制按钮状态
5. **事件处理**: 禁用状态下阻止点击事件

## 测试场景

1. **Pending Pickup 订单**: 分享按钮正常，无提示按钮
2. **In Transit 订单**: 分享按钮正常，无提示按钮
3. **Delivered 订单（30天内）**: 分享按钮正常，无提示按钮
4. **Delivered 订单（超过30天）**: 分享按钮禁用，显示提示按钮
5. **Cancelled 订单**: 分享按钮禁用，显示提示按钮
6. **Exception 订单**: 分享按钮禁用，显示提示按钮 