## 门禁系统前端
**react**+**antd**
tip:因为需通过iframe嵌入某管理系统的硬性要求，页面没有路由跳转管理，只能通过拼接URL访问。
### 路由路径
- 门禁管理 "door-access"
- 门禁规则 "/door-rule"
- 外出申请 "/out-request"
- 用户稽查管理 "/user-config"
- 领导看板 "/check-leader"
- HR看板 "/check-hr"
## 数据 
用户登陆数据通过管理系统Cookie传递给本页面。
页面数据源通过后端API传递。
