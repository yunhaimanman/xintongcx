# 售后服务页面 (Tickets.jsx) 源代码开发完善方案

**作者：Manus AI**

**日期：2025年8月6日**

本方案旨在对现有售后服务页面 (Tickets.jsx) 进行全面的功能增强、用户体验优化和代码质量提升。通过深入分析现有功能，识别潜在改进点，并制定详细的开发计划，我们将构建一个更健壮、高效且用户友好的工单管理系统。








## 1. 现有功能分析与改进点识别




### 1.1 现有功能概述

根据用户描述和 `Tickets.jsx` 源代码，当前售后服务页面已实现以下核心功能：

*   **工单列表展示**：以卡片形式直观展示工单的关键信息，包括标题、工单号、状态、优先级、创建时间、关联客户和负责人。状态和优先级通过 `Badge` 组件以不同颜色区分，增强了视觉识别度。
*   **工单搜索**：支持通过工单号、标题或客户名称进行模糊搜索，方便用户快速定位目标工单。
*   **工单筛选**：提供按工单状态和优先级进行筛选的功能，帮助用户根据特定条件过滤工单列表。
*   **新增工单**：通过模态对话框提供创建新工单的表单，包含标题、描述、客户、分类、优先级和来源等字段。其中客户和分类数据通过 API 动态获取。
*   **工单详情查看**：点击“查看”按钮可打开工单详情对话框，展示工单的详细描述和所有评论。
*   **工单评论**：在工单详情页支持用户添加新的评论。
*   **工单状态更新**：在工单列表页，用户可以直接通过下拉选择框更新工单的状态。

### 1.2 现有功能评估与潜在改进点

尽管 `Tickets.jsx` 已经具备了基本的工单管理功能，但在用户体验、功能完善性、性能和代码质量方面仍有较大的提升空间。以下是详细的评估和改进点：

#### 1.2.1 用户体验 (UX) 优化

*   **分页/无限滚动**：当前工单列表一次性加载所有数据，当工单数量庞大时，会导致页面加载缓慢和性能问题。应引入分页功能或无限滚动，按需加载数据，提升页面响应速度和用户体验。
*   **排序功能**：用户可能希望根据创建时间、更新时间、优先级或状态等对工单列表进行排序，以便更高效地管理。目前缺少此功能。
*   **批量操作**：对于需要同时处理多个工单的场景（如批量关闭、批量分配），批量操作功能将显著提高效率。例如，添加复选框允许用户选择多个工单，然后执行统一操作。
*   **通知与提醒**：当工单状态发生变化（如从“待处理”变为“处理中”），或有新评论时，系统应提供实时通知或提醒，确保用户及时获取信息。这可以集成桌面通知、站内信或邮件通知。
*   **负责人分配**：新增工单时，缺少负责人分配字段。在工单详情页也未提供负责人修改功能。这对于工单的流转和责任划分至关重要。
*   **工单分类管理**：虽然有工单分类字段，但目前代码中没有提供分类的增删改查界面。这可能需要一个独立的管理页面或在工单创建/编辑时提供动态管理入口。
*   **附件上传**：用户在提交工单或添加评论时，可能需要上传图片、文档等附件以提供更多信息。目前缺少附件上传功能。
*   **富文本编辑**：工单描述和评论目前是纯文本输入。引入富文本编辑器（如 Markdown 或 WYSIWYG 编辑器）可以使内容更具表现力，支持图片、链接、格式化文本等。
*   **操作反馈**：创建、更新、删除工单或添加评论后，应提供更友好的操作反馈（如 Toast 提示、加载指示器），而不是简单的 `alert` 或无反馈，以提升用户感知。
*   **空状态优化**：当搜索或筛选结果为空时，目前的“暂无工单”提示可以进一步优化，例如提供清除筛选条件的按钮或建议用户创建新工单。
*   **响应式设计**：虽然使用了 `sm:flex-row` 等 Tailwind CSS 类，但需要更全面的响应式布局考虑，确保在不同设备尺寸下都能提供良好的用户体验。

#### 1.2.2 功能完善性

*   **工单编辑**：目前只能更新工单状态，缺少对工单标题、描述、客户、分类、优先级等其他字段的编辑功能。用户可能需要修改已提交工单的信息。
*   **工单删除/归档**：缺少工单的删除或归档功能。对于已解决或不再需要的工单，用户可能需要将其从活跃列表中移除。
*   **内部评论**：目前评论功能没有区分内部评论和外部评论。在实际业务中，内部团队讨论可能不希望被客户看到。
*   **历史记录/审计日志**：工单状态变更、评论添加、负责人分配等关键操作应有详细的历史记录，方便追溯和审计。
*   **SLA (服务级别协议) 管理**：对于企业级应用，SLA 是衡量服务质量的重要指标。可以考虑集成 SLA 计时器、预警功能等。
*   **自定义字段**：不同业务可能对工单有不同的信息需求，支持自定义字段可以提高系统的灵活性。

#### 1.2.3 性能优化

*   **API 请求优化**：`useEffect` 中 `fetchTickets`、`fetchCustomers`、`fetchCategories` 每次筛选都会重新请求所有数据。可以考虑：
    *   **缓存**：对于不经常变动的数据（如客户、分类），可以进行客户端缓存，减少重复请求。
    *   **按需加载**：例如，客户列表只在创建/编辑工单对话框打开时加载。
    *   **合并请求**：如果后端 API 支持，可以将多个相关数据请求合并为一个。
*   **状态管理**：随着组件复杂度的增加，`useState` 可能会导致组件频繁渲染。可以考虑引入更专业的全局状态管理库（如 Redux, Zustand, React Context API 结合 `useReducer`），优化数据流和渲染性能。
*   **虚拟化列表**：对于大量工单的列表展示，可以使用虚拟化技术（如 `react-window` 或 `react-virtualized`），只渲染可视区域内的列表项，大幅提升渲染性能。

#### 1.2.4 代码质量与可维护性

*   **组件拆分**：`Tickets.jsx` 文件内容较多，可以将搜索/筛选区域、工单卡片、创建工单表单、工单详情等拆分成独立的、可复用的组件，提高代码的可读性和可维护性。
*   **错误处理**：目前错误处理主要是 `console.error` 和 `alert`。应使用更统一、用户友好的错误提示机制（如 Toast 组件）。
*   **类型检查**：使用 TypeScript 可以为组件 props、state 和 API 响应定义明确的类型，减少运行时错误，提高代码健壮性。
*   **API 抽象**：`ticketAPI` 和 `customerAPI` 的使用方式相对直接，可以进一步封装，例如添加拦截器处理认证、错误重试等。
*   **常量/枚举管理**：状态 (`statusMap`) 和优先级 (`priorityMap`) 的映射是硬编码在组件内部的。可以将其提取到单独的常量文件或使用枚举类型，便于管理和扩展。
*   **测试**：缺少单元测试和集成测试，难以保证代码修改的正确性。应引入测试框架（如 Jest, React Testing Library）编写测试用例。
*   **代码风格统一**：确保整个文件和项目遵循一致的代码风格规范（通过 ESLint, Prettier 等工具）。

### 1.3 总结

`Tickets.jsx` 提供了工单管理的基础框架。未来的完善工作应聚焦于提升用户体验（分页、排序、批量操作、通知）、增强功能（工单编辑、删除、负责人分配、附件、富文本、内部评论、历史记录）、优化性能（API 请求、状态管理、虚拟化）以及提高代码质量（组件拆分、错误处理、类型检查、测试）。这些改进将使售后服务页面更加健壮、高效和用户友好。




## 2. 详细开发完善方案




### 2.1 用户体验 (UX) 优化方案

用户体验是任何应用成功的关键。我们将通过以下措施显著提升 `Tickets.jsx` 页面的用户体验：

#### 2.1.1 分页与加载优化

为解决当前工单列表一次性加载所有数据导致的性能问题，我们将引入分页机制。这将确保无论工单数量多寡，页面都能保持快速响应。

*   **实现方式**：
    *   在后端 API 层面，修改 `getTickets` 接口，使其支持 `page`（页码）和 `pageSize`（每页数量）参数，并返回总页数或总记录数。
    *   在前端 `Tickets.jsx` 组件中，引入分页组件（例如，基于 Shadcn UI 或其他成熟的 React 分页库）。
    *   `fetchTickets` 函数将根据当前页码和每页数量请求数据。
    *   用户可以通过分页控件导航到不同页面，或者调整每页显示的工单数量。
*   **预期效果**：大幅减少首次加载时间，提升页面流畅度，尤其是在工单数据量大的情况下。

#### 2.1.2 排序功能

为了让用户能够更灵活地查看和管理工单，我们将增加多维度排序功能。

*   **实现方式**：
    *   在后端 API 层面，修改 `getTickets` 接口，使其支持 `sortBy`（排序字段，如 `created_at`, `updated_at`, `priority`, `status`）和 `sortOrder`（排序顺序，`asc` 或 `desc`）参数。
    *   在前端界面中，为工单列表的列头（如“创建时间”、“优先级”）添加可点击的排序图标，用户点击时切换排序顺序。
    *   `fetchTickets` 函数将根据用户选择的排序条件请求数据。
*   **预期效果**：用户可以根据自己的需求，快速找到最相关或最紧急的工单，提高工作效率。

#### 2.1.3 批量操作

引入批量操作功能，以提高处理多个工单的效率。

*   **实现方式**：
    *   在每个工单卡片上添加一个复选框。
    *   在工单列表顶部添加一个“全选”复选框和批量操作按钮（如“批量关闭”、“批量分配负责人”）。
    *   当用户选择多个工单后，点击批量操作按钮，弹出一个确认对话框，确认后调用相应的后端 API 进行批量更新。
*   **预期效果**：减少重复性操作，特别适用于需要对大量工单进行相同处理的场景。

#### 2.1.4 通知与提醒

实现实时通知机制，确保用户及时了解工单的最新动态。

*   **实现方式**：
    *   **后端集成**：考虑使用 WebSocket 或 Server-Sent Events (SSE) 技术，当工单状态变更、有新评论或被分配负责人时，后端主动向前端推送消息。
    *   **前端展示**：在前端集成一个通知中心或使用 Toast 提示，实时显示收到的通知。例如，当有新评论时，弹出“工单 TKxxx 有新评论”的提示。
    *   **通知类型**：区分不同类型的通知，如状态变更通知、新评论通知、分配通知等。
*   **预期效果**：提高信息传递的及时性，减少用户错过重要更新的可能性。

#### 2.1.5 负责人分配与管理

完善工单负责人分配功能，使其在创建和编辑工单时均可操作。

*   **实现方式**：
    *   **新增工单表单**：在“创建新工单”对话框中添加一个“负责人”下拉选择框，数据来源于系统用户列表。
    *   **工单详情页**：在工单详情页添加一个“负责人”字段，并支持编辑功能，用户可以选择或修改当前工单的负责人。
    *   **后端 API**：修改 `createTicket` 和 `updateTicket` 接口，使其支持 `assignee_id` 字段。
*   **预期效果**：明确工单责任人，便于工单流转和跟踪。

#### 2.1.6 附件上传

允许用户在创建工单或添加评论时上传相关文件。

*   **实现方式**：
    *   **后端存储**：搭建文件存储服务（如使用云存储服务 S3 或本地存储）。
    *   **后端 API**：提供文件上传接口，并关联到工单或评论。
    *   **前端组件**：在“创建新工单”对话框和“添加评论”区域添加文件上传组件，支持多文件选择和上传进度显示。
    *   **详情展示**：在工单详情页和评论中展示已上传的附件列表，并提供下载链接。
*   **预期效果**：用户可以提供更详细的问题背景和证据，提高问题解决效率。

#### 2.1.7 富文本编辑

提升工单描述和评论的表达能力。

*   **实现方式**：
    *   将当前工单描述和评论的 `Textarea` 组件替换为成熟的富文本编辑器组件（如 ReactQuill, Draft.js 或 Tiptap）。
    *   编辑器应支持基本的文本格式（加粗、斜体、列表）、图片插入、链接等。
*   **预期效果**：使工单描述和评论内容更清晰、更具可读性，方便沟通。

#### 2.1.8 操作反馈优化

提供更友好、更明确的用户操作反馈。

*   **实现方式**：
    *   引入一个统一的 Toast/Snackbar 组件（如 Shadcn UI 的 `useToast`）。
    *   在所有涉及数据提交或状态变更的操作（创建、更新、删除工单，添加评论等）成功或失败后，通过 Toast 提示用户操作结果。
    *   在数据加载过程中，显示加载指示器（如 Spinners 或 Skeleton 屏幕）。
*   **预期效果**：提升用户对系统响应的感知，减少焦虑感。

#### 2.1.9 空状态优化

改善搜索或筛选结果为空时的用户体验。

*   **实现方式**：
    *   当 `filteredTickets` 数组为空时，除了显示“暂无工单”，还可以提供“清除筛选条件”按钮，方便用户快速恢复到完整列表。
    *   如果是在搜索结果为空的情况下，可以提示用户“没有找到相关工单，请尝试其他关键词”。
*   **预期效果**：引导用户进行下一步操作，避免用户困惑。

#### 2.1.10 响应式设计增强

确保页面在不同设备上都能提供最佳显示效果。

*   **实现方式**：
    *   对工单卡片、搜索筛选区域、对话框等关键布局元素进行更细致的响应式断点设计。
    *   利用 Tailwind CSS 的响应式工具类，确保在小屏幕设备上布局能够自动调整，例如将水平排列的元素堆叠显示。
*   **预期效果**：提升移动端用户体验，扩大应用的使用场景。

### 2.2 功能完善性方案

在现有功能基础上，增加更多核心业务逻辑，使工单管理系统更加完善。

#### 2.2.1 工单编辑功能

允许用户修改已创建工单的除状态外的其他信息。

*   **实现方式**：
    *   在工单详情对话框中，为标题、描述、客户、分类、优先级、来源等字段添加“编辑”按钮或直接使其可编辑。
    *   点击编辑后，字段变为可输入状态，并显示“保存”和“取消”按钮。
    *   保存时，调用后端 `updateTicket` API 更新相应字段。
*   **预期效果**：提高工单信息的灵活性和准确性。

#### 2.2.2 工单删除/归档功能

提供工单的生命周期管理能力。

*   **实现方式**：
    *   在工单详情页或工单卡片上添加“删除”或“归档”按钮。
    *   点击后弹出确认对话框，防止误操作。
    *   **删除**：调用后端 `deleteTicket` API，从数据库中彻底移除工单（谨慎使用，通常建议软删除）。
    *   **归档**：在工单模型中增加一个 `is_archived` 字段，调用 `updateTicket` API 将其设置为 `true`。在列表查询时，默认不显示已归档工单，但提供一个筛选选项来查看归档工单。
*   **预期效果**：保持工单列表的整洁，管理历史工单。

#### 2.2.3 内部评论与外部评论区分

满足团队内部沟通和客户沟通的不同需求。

*   **实现方式**：
    *   在添加评论的表单中，增加一个复选框“内部评论”（`is_internal`）。
    *   后端 `createTicketComment` API 接收此字段。
    *   在工单详情页展示评论时，根据 `is_internal` 字段，对内部评论进行视觉上的区分（如不同背景色、显示“内部”标签），并且在向客户展示工单详情时，过滤掉内部评论。
*   **预期效果**：提高团队协作效率，同时保护敏感信息不暴露给客户。

#### 2.2.4 历史记录/审计日志

记录工单的关键操作，便于追溯和审计。

*   **实现方式**：
    *   **后端设计**：为工单操作（创建、状态变更、负责人分配、评论添加、字段修改等）设计一个独立的日志表，记录操作类型、操作人、操作时间、变更详情等。
    *   **前端展示**：在工单详情页添加一个“操作历史”或“活动日志”选项卡，展示该工单的所有历史操作记录。
*   **预期效果**：增强系统的可追溯性和合规性，方便问题排查和责任界定。

#### 2.2.5 SLA (服务级别协议) 管理

引入 SLA 计时器和预警功能，提升服务响应效率。

*   **实现方式**：
    *   **后端逻辑**：在工单创建时，根据工单类型、优先级等设置 SLA 目标时间（如响应时间、解决时间）。后端定时任务检查即将超期或已超期的工单。
    *   **前端展示**：在工单卡片和详情页显示 SLA 剩余时间或超期状态，并用颜色进行视觉警示（如绿色表示正常，黄色表示即将超期，红色表示已超期）。
    *   **预警通知**：结合通知与提醒功能，在 SLA 即将超期时向负责人发送预警。
*   **预期效果**：确保服务质量，避免工单处理延误。

#### 2.2.6 自定义字段

提高工单系统的灵活性，适应不同业务需求。

*   **实现方式**：
    *   **后端设计**：设计一个灵活的自定义字段存储方案，允许管理员定义不同类型的字段（文本、数字、日期、下拉选择等），并关联到工单。
    *   **管理界面**：提供一个独立的管理界面，供管理员配置自定义字段。
    *   **前端渲染**：在创建/编辑工单表单和工单详情页，根据后端返回的自定义字段配置动态渲染相应的输入控件和显示内容。
*   **预期效果**：系统能够更好地适应未来业务变化和特定行业需求。

### 2.3 性能优化方案

针对当前 `Tickets.jsx` 存在的性能瓶颈，我们将采取以下措施进行优化。

#### 2.3.1 API 请求优化

减少不必要的 API 请求，提升数据加载效率。

*   **实现方式**：
    *   **客户端缓存**：对于 `fetchCustomers` 和 `fetchCategories` 这类不经常变动的数据，可以在首次加载后将其缓存到本地状态或使用 React Query/SWR 等数据请求库进行管理，避免每次筛选或组件重新渲染时都重新请求。
    *   **按需加载**：例如，`fetchCustomers` 和 `fetchCategories` 可以在“创建新工单”对话框打开时才触发，而不是在组件挂载时就加载。
    *   **合并请求**：如果后端 API 允许，可以将 `getTickets` 的筛选参数直接传递，避免在前端进行二次过滤。
*   **预期效果**：降低服务器压力，加快页面数据更新速度。

#### 2.3.2 状态管理优化

优化组件内部状态管理，减少不必要的组件渲染。

*   **实现方式**：
    *   对于复杂的全局状态，考虑引入 **Zustand** 或 **React Context API 结合 `useReducer`**。Zustand 是一个轻量级的状态管理库，非常适合 React，可以避免 Redux 的繁琐配置。
    *   将 `tickets`, `searchTerm`, `statusFilter`, `priorityFilter` 等状态提升到更高级别的组件或使用 Zustand store 进行管理。
    *   使用 `React.memo` 或 `useCallback`/`useMemo` 对性能敏感的组件和回调函数进行优化，避免不必要的重新渲染。
*   **预期效果**：提升组件渲染性能，使应用更流畅。

#### 2.3.3 虚拟化列表

针对大量工单列表的渲染性能问题，引入列表虚拟化技术。

*   **实现方式**：
    *   使用如 `react-window` 或 `react-virtualized` 这样的库来渲染工单列表。
    *   这些库只渲染当前视口内可见的列表项，而不是所有项，从而大幅减少 DOM 元素的数量。
*   **预期效果**：即使有成千上万条工单，页面也能保持极高的渲染性能和滚动流畅度。

### 2.4 代码质量与可维护性方案

提升代码质量是长期维护和团队协作的基础。我们将从以下几个方面入手。

#### 2.4.1 组件拆分与模块化

将大型组件拆分为更小、更专注、可复用的组件。

*   **实现方式**：
    *   将 `Tickets.jsx` 拆分为：
        *   `TicketList.jsx`：负责工单列表的渲染和交互。
        *   `TicketFilters.jsx`：负责搜索和筛选控件。
        *   `CreateTicketDialog.jsx`：负责新建工单的表单和逻辑。
        *   `TicketDetailDialog.jsx`：负责工单详情和评论的展示与交互。
        *   `TicketCard.jsx`：单个工单卡片的展示组件。
    *   创建 `constants.js` 或 `enums.js` 文件，统一管理 `statusMap` 和 `priorityMap` 等常量。
    *   创建 `utils.js` 文件，封装 `formatDate` 等通用工具函数。
*   **预期效果**：提高代码的可读性、可维护性和组件复用性，降低单个文件的复杂度。

#### 2.4.2 错误处理机制

建立统一、友好的错误处理机制。

*   **实现方式**：
    *   移除 `alert` 提示，统一使用 Toast 组件显示错误信息。
    *   在 API 请求层进行集中错误处理，例如使用 `try-catch` 块捕获 API 错误，并将其转换为用户友好的消息。
    *   对于关键操作，记录错误日志到后端或前端监控系统。
*   **预期效果**：提升用户体验，方便问题排查。

#### 2.4.3 引入 TypeScript

通过静态类型检查提高代码健壮性和开发效率。

*   **实现方式**：
    *   将 `Tickets.jsx` 及其拆分出的子组件文件重命名为 `.tsx`。
    *   为组件的 `props`、`state`、API 响应数据以及函数参数和返回值定义明确的接口（`interface`）或类型（`type`）。
    *   逐步为整个前端项目引入 TypeScript。
*   **预期效果**：减少运行时错误，提高代码可读性和可维护性，便于团队协作。

#### 2.4.4 API 抽象与封装

对 `ticketAPI` 和 `customerAPI` 进行更高级别的封装。

*   **实现方式**：
    *   创建一个 `apiClient.js` 或 `axiosInstance.js` 文件，配置 Axios 实例，包括 baseURL、请求拦截器（用于添加认证 Token）、响应拦截器（用于统一处理错误响应、刷新 Token 等）。
    *   `ticketAPI` 和 `customerAPI` 将基于此 `apiClient` 进行构建。
*   **预期效果**：统一 API 请求逻辑，简化组件中的 API 调用，提高代码复用性。

#### 2.4.5 单元测试与集成测试

确保代码质量和功能稳定性。

*   **实现方式**：
    *   引入 Jest 和 React Testing Library。
    *   为核心组件（如 `TicketCard`, `TicketFilters`）编写单元测试，验证其渲染和交互行为。
    *   为关键业务逻辑（如 `handleCreateTicket`, `handleUpdateTicketStatus`）编写集成测试，模拟用户操作流程。
*   **预期效果**：提高代码质量，减少回归错误，加速开发迭代。

#### 2.4.6 代码风格统一与自动化

通过工具强制统一代码风格。

*   **实现方式**：
    *   配置 ESLint 和 Prettier，并集成到开发工作流中（如 VS Code 插件、Git Hooks）。
    *   定义一套团队认可的代码风格规范。
*   **预期效果**：提高代码可读性，减少代码审查中的风格问题，提升团队协作效率。

### 2.5 总结与实施路线图

本方案提供了一个全面的 `Tickets.jsx` 完善路线图。实施时建议遵循迭代开发原则，优先实现对用户体验和核心功能提升最大的部分。

**建议的实施顺序：**

1.  **第一阶段：基础优化与核心功能增强**
    *   组件拆分（`TicketList`, `TicketFilters`, `CreateTicketDialog`, `TicketDetailDialog`, `TicketCard`）。
    *   引入分页功能。
    *   操作反馈优化（Toast 提示、加载指示器）。
    *   工单编辑功能。
    *   负责人分配功能。
    *   API 请求优化（缓存、按需加载）。

2.  **第二阶段：高级功能与用户体验提升**
    *   排序功能。
    *   批量操作。
    *   内部评论与外部评论区分。
    *   附件上传（如果后端支持）。
    *   富文本编辑。
    *   空状态优化。

3.  **第三阶段：性能与质量提升**
    *   状态管理优化（Zustand/Context API）。
    *   虚拟化列表。
    *   引入 TypeScript。
    *   API 抽象与封装。
    *   单元测试与集成测试。
    *   代码风格统一。
    *   通知与提醒（如果后端支持）。
    *   历史记录/审计日志。
    *   SLA 管理。
    *   自定义字段。

通过以上步骤，`Tickets.jsx` 页面将从一个基础的工单管理界面，演变为一个功能完善、用户友好、性能卓越且易于维护的专业级售后服务平台。




## 3. 完善后的代码结构与关键代码片段（伪代码）




### 3.1 文件结构概览

为了提高代码的可读性、可维护性和组件复用性，我们将 `Tickets.jsx` 拆分为多个独立的组件，并引入常量和工具函数文件。新的文件结构将如下所示：

```
src/
├── components/
│   ├── ui/ (Shadcn UI 组件)
│   └── common/ (通用可复用组件)
│       ├── Pagination.jsx (新增：分页组件)
│       ├── Toast.jsx (新增：统一的Toast提示组件)
│       └── LoadingSpinner.jsx (新增：加载指示器)
├── pages/
│   └── Tickets.jsx (主页面，负责协调和数据流)
├── features/
│   └── tickets/ (与工单相关的特定功能模块)
│       ├── components/
│       │   ├── TicketCard.jsx (工单卡片)
│       │   ├── TicketFilters.jsx (搜索和筛选)
│       │   ├── CreateTicketDialog.jsx (创建工单对话框)
│       │   ├── TicketDetailDialog.jsx (工单详情对话框)
│       │   ├── TicketEditForm.jsx (新增：工单编辑表单)
│       │   ├── TicketCommentSection.jsx (新增：评论区，包含富文本和附件)
│       │   └── TicketHistoryLog.jsx (新增：操作历史)
│       ├── hooks/
│       │   └── useTickets.js (新增：自定义Hook，封装工单数据逻辑)
│       ├── stores/
│       │   └── ticketStore.js (新增：Zustand状态管理)
│       └── utils/
│           └── ticketUtils.js (新增：工单相关工具函数)
├── lib/
│   ├── api.js (现有：API调用)
│   ├── apiClient.js (新增：Axios实例封装)
│   ├── constants.js (新增：常量定义，如状态、优先级映射)
└── contexts/
    └── AuthContext.js (现有：认证上下文)
```

### 3.2 `Tickets.jsx` (主页面) 伪代码

`Tickets.jsx` 将主要负责协调各个子组件，管理全局状态（通过 Zustand 或 Context API），并处理数据流。它将变得更加简洁，专注于组件的组合和高层逻辑。

```jsx
// src/pages/Tickets.jsx
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import TicketFilters from '@/features/tickets/components/TicketFilters';
import TicketList from '@/features/tickets/components/TicketList';
import CreateTicketDialog from '@/features/tickets/components/CreateTicketDialog';
import { useTicketStore } from '@/features/tickets/stores/ticketStore';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Toast from '@/components/common/Toast'; // 统一的Toast组件

const Tickets = () => {
  const { 
    tickets, 
    loading, 
    fetchTickets, 
    searchTerm, 
    statusFilter, 
    priorityFilter, 
    pagination, 
    setPagination,
    setSearchTerm,
    setStatusFilter,
    setPriorityFilter,
    // ...其他状态和方法
  } = useTicketStore();

  useEffect(() => {
    fetchTickets();
  }, [searchTerm, statusFilter, priorityFilter, pagination.currentPage, pagination.pageSize]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">售后服务</h1>
          <p className="text-gray-600">管理和处理客户服务工单</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              新建工单
            </Button>
          </DialogTrigger>
          <CreateTicketDialog />
        </Dialog>
      </div>

      <TicketFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />

      <TicketList tickets={tickets} />

      <Pagination 
        currentPage={pagination.currentPage}
        pageSize={pagination.pageSize}
        totalItems={pagination.totalItems}
        onPageChange={(page) => setPagination({ ...pagination, currentPage: page })}
        onPageSizeChange={(size) => setPagination({ ...pagination, pageSize: size })}
      />

      {/* Toast组件通常在App.js或Layout组件中全局引入 */}
      <Toast />
    </div>
  );
};

export default Tickets;
```

### 3.3 `TicketList.jsx` (工单列表) 伪代码

`TicketList.jsx` 将负责渲染工单卡片列表，并处理批量操作的选中逻辑。

```jsx
// src/features/tickets/components/TicketList.jsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import TicketCard from './TicketCard';
import { useTicketStore } from '@/features/tickets/stores/ticketStore';
import { Checkbox } from '@/components/ui/checkbox'; // 用于批量选择
import { Button } from '@/components/ui/button'; // 用于批量操作按钮

const TicketList = ({ tickets }) => {
  const { selectedTicketIds, toggleTicketSelection, toggleAllTicketsSelection, clearSelectedTickets, performBulkAction } = useTicketStore();

  const handleBulkClose = () => {
    performBulkAction('close', selectedTicketIds);
    clearSelectedTickets();
  };

  if (tickets.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无工单</h3>
          <p className="text-gray-500 mb-4">点击"新建工单"开始创建第一个工单</p>
          {/* 如果有筛选条件，可以显示清除筛选按钮 */}
          {useTicketStore.getState().searchTerm || useTicketStore.getState().statusFilter || useTicketStore.getState().priorityFilter ? (
            <Button variant="outline" onClick={() => {
              useTicketStore.getState().setSearchTerm('');
              useTicketStore.getState().setStatusFilter('');
              useTicketStore.getState().setPriorityFilter('');
            }}>清除筛选</Button>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 批量操作区域 */}
      {tickets.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <Checkbox
            checked={selectedTicketIds.length === tickets.length && tickets.length > 0}
            onCheckedChange={toggleAllTicketsSelection}
            aria-label="Select all"
          />
          <Label htmlFor="select-all-tickets">全选</Label>
          {selectedTicketIds.length > 0 && (
            <>
              <Button size="sm" onClick={handleBulkClose}>批量关闭 ({selectedTicketIds.length})</Button>
              {/* 更多批量操作按钮 */}
            </>
          )}
        </div>
      )}

      <div className="grid gap-4">
        {tickets.map((ticket) => (
          <TicketCard 
            key={ticket.id} 
            ticket={ticket} 
            isSelected={selectedTicketIds.includes(ticket.id)}
            onSelect={() => toggleTicketSelection(ticket.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TicketList;
```

### 3.4 `TicketCard.jsx` (工单卡片) 伪代码

`TicketCard.jsx` 将专注于单个工单的展示和交互，包括查看详情和直接更新状态。

```jsx
// src/features/tickets/components/TicketCard.jsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, MessageSquare, Clock, User } from 'lucide-react';
import { statusMap, priorityMap } from '@/lib/constants';
import { formatDate } from '@/lib/utils'; // 假设formatDate移到utils
import { useTicketStore } from '@/features/tickets/stores/ticketStore';
import { Checkbox } from '@/components/ui/checkbox';

const TicketCard = ({ ticket, isSelected, onSelect }) => {
  const { setSelectedTicket, setShowDetailDialog, handleUpdateTicketStatus } = useTicketStore();

  const handleViewTicket = () => {
    setSelectedTicket(ticket);
    setShowDetailDialog(true);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center mr-4">
            <Checkbox checked={isSelected} onCheckedChange={onSelect} className="mr-3" />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold">{ticket.title}</h3>
                <Badge className={statusMap[ticket.status]?.color}>
                  {statusMap[ticket.status]?.label}
                </Badge>
                <Badge className={priorityMap[ticket.priority]?.color}>
                  {priorityMap[ticket.priority]?.label}
                </Badge>
                {/* 新增：SLA 状态 */}
                {ticket.sla_status && (
                  <Badge variant="outline" className={`
                    ${ticket.sla_status === 'on_track' ? 'bg-green-100 text-green-800'
                    : ticket.sla_status === 'warning' ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'}
                  `}>
                    SLA: {ticket.sla_status === 'on_track' ? '正常' : ticket.sla_status === 'warning' ? '即将超期' : '已超期'}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3">{ticket.ticket_number}</p>
              <p className="text-gray-700 mb-4 line-clamp-2">{ticket.description}</p>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{ticket.customer?.company_name || '未知客户'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(ticket.created_at)}</span>
                </div>
                {ticket.assignee && (
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>负责人: {ticket.assignee.full_name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewTicket}
            >
              <Eye className="w-4 h-4 mr-1" />
              查看
            </Button>
            {ticket.status !== 'closed' && (
              <Select
                value={ticket.status}
                onValueChange={(value) => handleUpdateTicketStatus(ticket.id, value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusMap).map(([key, val]) => (
                    <SelectItem key={key} value={key}>{val.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketCard;
```

### 3.5 `CreateTicketDialog.jsx` (创建工单对话框) 伪代码

此组件将封装创建新工单的表单逻辑，并增加负责人分配、分类选择等功能。

```jsx
// src/features/tickets/components/CreateTicketDialog.jsx
import React, { useState, useEffect } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useTicketStore } from '@/features/tickets/stores/ticketStore';
import { useToast } from '@/components/ui/use-toast'; // Shadcn Toast Hook
import { customerAPI, userAPI } from '@/lib/api'; // 假设有userAPI获取用户列表
import RichTextEditor from '@/components/common/RichTextEditor'; // 新增富文本编辑器组件
import FileUploader from '@/components/common/FileUploader'; // 新增文件上传组件

const CreateTicketDialog = () => {
  const { createTicket, fetchTickets } = useTicketStore();
  const { toast } = useToast();

  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    customer_id: '',
    category_id: '',
    priority: 'medium',
    source: 'web',
    assignee_id: '', // 新增负责人字段
    attachments: [], // 新增附件字段
  });
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]); // 用于负责人选择

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [customerData, categoryData, userData] = await Promise.all([
          customerAPI.getCustomers(),
          ticketAPI.getCategories(),
          userAPI.getUsers(), // 获取系统用户列表
        ]);
        setCustomers(customerData.customers || []);
        setCategories(categoryData.categories || []);
        setUsers(userData.users || []);
      } catch (error) {
        console.error('加载表单数据失败:', error);
        toast({
          title: '错误',
          description: '加载必要数据失败，请重试。',
          variant: 'destructive',
        });
      }
    };
    loadFormData();
  }, []);

  const handleCreate = async () => {
    if (!newTicket.title || !newTicket.description || !newTicket.customer_id) {
      toast({
        title: '提示',
        description: '请填写工单标题、描述和客户。',
        variant: 'warning',
      });
      return;
    }

    try {
      await createTicket(newTicket);
      toast({
        title: '成功',
        description: '工单创建成功。',
      });
      // 重置表单
      setNewTicket({
        title: '',
        description: '',
        customer_id: '',
        category_id: '',
        priority: 'medium',
        source: 'web',
        assignee_id: '',
        attachments: [],
      });
      fetchTickets(); // 刷新列表
      // 关闭对话框 (假设由父组件控制)
      // onOpenChange(false);
    } catch (error) {
      console.error('创建工单失败:', error);
      toast({
        title: '错误',
        description: '创建工单失败，请稍后再试。',
        variant: 'destructive',
      });
    }
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>创建新工单</DialogTitle>
        <DialogDescription>填写工单基本信息</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">工单标题</Label>
          <Input
            id="title"
            value={newTicket.title}
            onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="description">问题描述</Label>
          {/* 使用富文本编辑器 */}
          <RichTextEditor
            value={newTicket.description}
            onChange={(content) => setNewTicket({ ...newTicket, description: content })}
          />
        </div>
        <div>
          <Label htmlFor="customer">客户</Label>
          <Select value={newTicket.customer_id} onValueChange={(value) => setNewTicket({ ...newTicket, customer_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="选择客户" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id.toString()}>
                  {customer.company_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="category">分类</Label>
          <Select value={newTicket.category_id} onValueChange={(value) => setNewTicket({ ...newTicket, category_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="priority">优先级</Label>
          <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(priorityMap).map(([key, val]) => (
                <SelectItem key={key} value={key}>{val.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="assignee">负责人</Label>
          <Select value={newTicket.assignee_id} onValueChange={(value) => setNewTicket({ ...newTicket, assignee_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="选择负责人" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">未分配</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="attachments">附件</Label>
          <FileUploader 
            onFilesChange={(files) => setNewTicket({ ...newTicket, attachments: files })}
            // 假设FileUploader返回文件URL或ID
          />
        </div>
      </div>
      <DialogFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => { /* 关闭对话框 */ }}>
          取消
        </Button>
        <Button onClick={handleCreate}>
          创建工单
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default CreateTicketDialog;
```

### 3.6 `TicketDetailDialog.jsx` (工单详情对话框) 伪代码

此组件将展示工单的详细信息，并集成编辑功能、评论区和操作历史。

```jsx
// src/features/tickets/components/TicketDetailDialog.jsx
import React, { useState, useEffect } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Shadcn Tabs
import { statusMap, priorityMap } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { useTicketStore } from '@/features/tickets/stores/ticketStore';
import TicketEditForm from './TicketEditForm'; // 新增工单编辑表单
import TicketCommentSection from './TicketCommentSection'; // 新增评论区
import TicketHistoryLog from './TicketHistoryLog'; // 新增操作历史
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ticketAPI, userAPI } from '@/lib/api';

const TicketDetailDialog = () => {
  const { selectedTicket, setSelectedTicket, setShowDetailDialog, handleUpdateTicketStatus } = useTicketStore();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState([]); // 用于负责人选择

  useEffect(() => {
    if (selectedTicket) {
      // 每次打开详情时重新获取最新评论和历史记录
      const fetchDetails = async () => {
        try {
          const [commentsData, historyData, userData] = await Promise.all([
            ticketAPI.getTicketComments(selectedTicket.id),
            ticketAPI.getTicketHistory(selectedTicket.id), // 假设有获取历史记录的API
            userAPI.getUsers(),
          ]);
          useTicketStore.getState().setComments(commentsData.comments || []);
          useTicketStore.getState().setTicketHistory(historyData.history || []);
          setUsers(userData.users || []);
        } catch (error) {
          console.error('获取工单详情数据失败:', error);
          toast({
            title: '错误',
            description: '加载工单详情失败，请重试。',
            variant: 'destructive',
          });
        }
      };
      fetchDetails();
    }
  }, [selectedTicket?.id]);

  const handleSaveEdit = async (updatedFields) => {
    try {
      await ticketAPI.updateTicket(selectedTicket.id, updatedFields);
      setSelectedTicket({ ...selectedTicket, ...updatedFields }); // 更新本地状态
      useTicketStore.getState().fetchTickets(); // 刷新列表
      toast({
        title: '成功',
        description: '工单信息更新成功。',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('更新工单失败:', error);
      toast({
        title: '错误',
        description: '更新工单失败，请稍后再试。',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTicket = async () => {
    if (window.confirm('确定要删除此工单吗？此操作不可逆。')) {
      try {
        await ticketAPI.deleteTicket(selectedTicket.id);
        useTicketStore.getState().fetchTickets(); // 刷新列表
        setShowDetailDialog(false);
        toast({
          title: '成功',
          description: '工单已成功删除。',
        });
      } catch (error) {
        console.error('删除工单失败:', error);
        toast({
          title: '错误',
          description: '删除工单失败，请稍后再试。',
          variant: 'destructive',
        });
      }
    }
  };

  if (!selectedTicket) return null; // 或者显示加载状态

  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          {selectedTicket.title}
          <Badge className={statusMap[selectedTicket.status]?.color}>
            {statusMap[selectedTicket.status]?.label}
          </Badge>
          <Badge className={priorityMap[selectedTicket.priority]?.color}>
            {priorityMap[selectedTicket.priority]?.label}
          </Badge>
          {/* 新增：SLA 状态 */}
          {selectedTicket.sla_status && (
            <Badge variant="outline" className={`
              ${selectedTicket.sla_status === 'on_track' ? 'bg-green-100 text-green-800'
              : selectedTicket.sla_status === 'warning' ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'}
            `}>
              SLA: {selectedTicket.sla_status === 'on_track' ? '正常' : selectedTicket.sla_status === 'warning' ? '即将超期' : '已超期'}
            </Badge>
          )}
        </DialogTitle>
        <DialogDescription>
          工单号: {selectedTicket.ticket_number} | 创建时间: {formatDate(selectedTicket.created_at)}
        </DialogDescription>
      </DialogHeader>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Label>状态:</Label>
          <Select
            value={selectedTicket.status}
            onValueChange={(value) => handleUpdateTicketStatus(selectedTicket.id, value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusMap).map(([key, val]) => (
                <SelectItem key={key} value={key}>{val.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Label>负责人:</Label>
          <Select
            value={selectedTicket.assignee_id || ''}
            onValueChange={(value) => handleSaveEdit({ assignee_id: value || null })}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="未分配" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">未分配</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? '取消编辑' : '编辑工单'}
          </Button>
          <Button variant="destructive" onClick={handleDeleteTicket}>
            删除工单
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">详情</TabsTrigger>
          <TabsTrigger value="comments">评论</TabsTrigger>
          <TabsTrigger value="history">操作历史</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-4 pt-4">
          {isEditing ? (
            <TicketEditForm ticket={selectedTicket} onSave={handleSaveEdit} onCancel={() => setIsEditing(false)} />
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">问题描述</h4>
                <div className="text-gray-700 bg-gray-50 p-3 rounded" dangerouslySetInnerHTML={{ __html: selectedTicket.description }}></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">客户</h4>
                  <p className="text-gray-700">{selectedTicket.customer?.company_name || '未知'}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">分类</h4>
                  <p className="text-gray-700">{selectedTicket.category?.name || '未知'}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">优先级</h4>
                  <p className="text-gray-700">{priorityMap[selectedTicket.priority]?.label}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">来源</h4>
                  <p className="text-gray-700">{selectedTicket.source}</p>
                </div>
                {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">附件</h4>
                    <ul className="list-disc pl-5">
                      {selectedTicket.attachments.map((attachment, index) => (
                        <li key={index}><a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{attachment.filename}</a></li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* 动态渲染自定义字段 */}
                {selectedTicket.custom_fields && Object.keys(selectedTicket.custom_fields).map(key => (
                  <div key={key}>
                    <h4 className="font-medium mb-2">{key}</h4>
                    <p className="text-gray-700">{selectedTicket.custom_fields[key]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="comments" className="pt-4">
          <TicketCommentSection ticketId={selectedTicket.id} />
        </TabsContent>
        <TabsContent value="history" className="pt-4">
          <TicketHistoryLog ticketId={selectedTicket.id} />
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
};

export default TicketDetailDialog;
```

### 3.7 `TicketEditForm.jsx` (工单编辑表单) 伪代码

这是一个独立的表单组件，用于编辑工单的非状态字段。

```jsx
// src/features/tickets/components/TicketEditForm.jsx
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import RichTextEditor from '@/components/common/RichTextEditor';
import FileUploader from '@/components/common/FileUploader';
import { customerAPI, ticketAPI, userAPI } from '@/lib/api';
import { priorityMap } from '@/lib/constants';

const TicketEditForm = ({ ticket, onSave, onCancel }) => {
  const [editedTicket, setEditedTicket] = useState(ticket);
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadFormData = async () => {
      const [customerData, categoryData, userData] = await Promise.all([
        customerAPI.getCustomers(),
        ticketAPI.getCategories(),
        userAPI.getUsers(),
      ]);
      setCustomers(customerData.customers || []);
      setCategories(categoryData.categories || []);
      setUsers(userData.users || []);
    };
    loadFormData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setEditedTicket({ ...editedTicket, [id]: value });
  };

  const handleRichTextChange = (content) => {
    setEditedTicket({ ...editedTicket, description: content });
  };

  const handleFilesChange = (files) => {
    setEditedTicket({ ...editedTicket, attachments: files });
  };

  const handleSubmit = () => {
    onSave(editedTicket);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">工单标题</Label>
        <Input id="title" value={editedTicket.title} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="description">问题描述</Label>
        <RichTextEditor value={editedTicket.description} onChange={handleRichTextChange} />
      </div>
      <div>
        <Label htmlFor="customer_id">客户</Label>
        <Select value={editedTicket.customer_id.toString()} onValueChange={(value) => setEditedTicket({ ...editedTicket, customer_id: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id.toString()}>
                {customer.company_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="category_id">分类</Label>
        <Select value={editedTicket.category_id.toString()} onValueChange={(value) => setEditedTicket({ ...editedTicket, category_id: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="priority">优先级</Label>
        <Select value={editedTicket.priority} onValueChange={(value) => setEditedTicket({ ...editedTicket, priority: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(priorityMap).map(([key, val]) => (
              <SelectItem key={key} value={key}>{val.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="assignee_id">负责人</Label>
        <Select value={editedTicket.assignee_id?.toString() || ''} onValueChange={(value) => setEditedTicket({ ...editedTicket, assignee_id: value || null })}>
          <SelectTrigger>
            <SelectValue placeholder="未分配" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">未分配</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="attachments">附件</Label>
        <FileUploader 
          initialFiles={editedTicket.attachments}
          onFilesChange={handleFilesChange}
        />
      </div>
      {/* 动态渲染自定义字段的编辑 */}
      {editedTicket.custom_fields && Object.keys(editedTicket.custom_fields).map(key => (
        <div key={key}>
          <Label htmlFor={`custom_field_${key}`}>{key}</Label>
          <Input 
            id={`custom_field_${key}`}
            value={editedTicket.custom_fields[key]}
            onChange={(e) => setEditedTicket({ 
              ...editedTicket, 
              custom_fields: { ...editedTicket.custom_fields, [key]: e.target.value }
            })}
          />
        </div>
      ))}
      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={onCancel}>取消</Button>
        <Button onClick={handleSubmit}>保存</Button>
      </div>
    </div>
  );
};

export default TicketEditForm;
```

### 3.8 `TicketCommentSection.jsx` (评论区) 伪代码

此组件将展示工单评论，并提供添加新评论的功能，区分内部/外部评论，并支持附件和富文本。

```jsx
// src/features/tickets/components/TicketCommentSection.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useTicketStore } from '@/features/tickets/stores/ticketStore';
import { useToast } from '@/components/ui/use-toast';
import { ticketAPI } from '@/lib/api';
import RichTextEditor from '@/components/common/RichTextEditor';
import FileUploader from '@/components/common/FileUploader';
import { formatDate } from '@/lib/utils';

const TicketCommentSection = ({ ticketId }) => {
  const { comments, setComments, addComment } = useTicketStore();
  const { toast } = useToast();
  const [newCommentContent, setNewCommentContent] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [newCommentAttachments, setNewCommentAttachments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await ticketAPI.getTicketComments(ticketId);
        setComments(data.comments || []);
      } catch (error) {
        console.error('获取评论失败:', error);
        toast({
          title: '错误',
          description: '加载评论失败。',
          variant: 'destructive',
        });
      }
    };
    fetchComments();
  }, [ticketId]);

  const handleAddComment = async () => {
    if (!newCommentContent.trim()) {
      toast({
        title: '提示',
        description: '评论内容不能为空。',
        variant: 'warning',
      });
      return;
    }

    try {
      await addComment(ticketId, {
        content: newCommentContent,
        is_internal: isInternalComment,
        attachments: newCommentAttachments, // 传递附件
      });
      setNewCommentContent('');
      setIsInternalComment(false);
      setNewCommentAttachments([]);
      toast({
        title: '成功',
        description: '评论添加成功。',
      });
      // 重新获取评论以显示最新内容
      const data = await ticketAPI.getTicketComments(ticketId);
      setComments(data.comments || []);
    } catch (error) {
      console.error('添加评论失败:', error);
      toast({
        title: '错误',
        description: '添加评论失败，请稍后再试。',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium mb-2">评论</h4>
      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {comments.length === 0 ? (
          <p className="text-gray-500">暂无评论。</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className={`p-3 rounded-lg ${comment.is_internal ? 'bg-blue-50' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                <span>
                  <strong>{comment.author?.full_name || '未知用户'}</strong>
                  {comment.is_internal && <span className="ml-2 text-blue-700 font-semibold">(内部评论)</span>}
                </span>
                <span>{formatDate(comment.created_at)}</span>
              </div>
              <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: comment.content }}></div>
              {comment.attachments && comment.attachments.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">附件:</p>
                  <ul className="list-disc pl-5 text-sm">
                    {comment.attachments.map((attachment, index) => (
                      <li key={index}><a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{attachment.filename}</a></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className="mt-4 p-4 border rounded-lg bg-white">
        <h5 className="font-medium mb-2">添加评论</h5>
        <RichTextEditor
          value={newCommentContent}
          onChange={setNewCommentContent}
          placeholder="输入评论内容..."
        />
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="internal-comment"
              checked={isInternalComment}
              onCheckedChange={setIsInternalComment}
            />
            <Label htmlFor="internal-comment">内部评论</Label>
          </div>
          <FileUploader 
            onFilesChange={setNewCommentAttachments}
            // 假设FileUploader返回文件URL或ID
          />
          <Button onClick={handleAddComment}>提交评论</Button>
        </div>
      </div>
    </div>
  );
};

export default TicketCommentSection;
```

### 3.9 `TicketHistoryLog.jsx` (操作历史) 伪代码

此组件将展示工单的所有操作历史记录。

```jsx
// src/features/tickets/components/TicketHistoryLog.jsx
import React, { useEffect } from 'react';
import { useTicketStore } from '@/features/tickets/stores/ticketStore';
import { useToast } from '@/components/ui/use-toast';
import { ticketAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';

const TicketHistoryLog = ({ ticketId }) => {
  const { ticketHistory, setTicketHistory } = useTicketStore();
  const { toast } = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await ticketAPI.getTicketHistory(ticketId);
        setTicketHistory(data.history || []);
      } catch (error) {
        console.error('获取工单历史失败:', error);
        toast({
          title: '错误',
          description: '加载工单历史失败。',
          variant: 'destructive',
        });
      }
    };
    fetchHistory();
  }, [ticketId]);

  if (ticketHistory.length === 0) {
    return <p className="text-gray-500">暂无操作历史。</p>;
  }

  return (
    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
      {ticketHistory.map((log) => (
        <div key={log.id} className="p-3 rounded-lg bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
            <span>
              <strong>{log.operator?.full_name || '系统'}</strong>
              <span className="ml-2">{log.action_type}</span>
            </span>
            <span>{formatDate(log.timestamp)}</span>
          </div>
          <p className="text-gray-800">{log.description}</p>
          {log.details && (
            <pre className="mt-1 text-xs text-gray-700 bg-gray-100 p-2 rounded overflow-x-auto">
              {JSON.stringify(log.details, null, 2)}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
};

export default TicketHistoryLog;
```

### 3.10 `ticketStore.js` (Zustand 状态管理) 伪代码

使用 Zustand 管理工单相关的全局状态，包括工单列表、筛选条件、选中工单、详情工单、评论、历史记录等，并封装数据操作逻辑。

```jsx
// src/features/tickets/stores/ticketStore.js
import { create } from 'zustand';
import { ticketAPI } from '@/lib/api';

export const useTicketStore = create((set, get) => ({
  tickets: [],
  loading: false,
  searchTerm: '',
  statusFilter: '',
  priorityFilter: '',
  selectedTicketIds: [],
  selectedTicket: null,
  comments: [],
  ticketHistory: [],
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  },

  setSearchTerm: (term) => set({ searchTerm: term, 'pagination.currentPage': 1 }),
  setStatusFilter: (status) => set({ statusFilter: status, 'pagination.currentPage': 1 }),
  setPriorityFilter: (priority) => set({ priorityFilter: priority, 'pagination.currentPage': 1 }),
  setSelectedTicket: (ticket) => set({ selectedTicket: ticket }),
  setShowDetailDialog: (isOpen) => set({ showDetailDialog: isOpen }), // 假设由store控制dialog状态
  setComments: (comments) => set({ comments: comments }),
  setTicketHistory: (history) => set({ ticketHistory: history }),
  setPagination: (newPagination) => set((state) => ({ pagination: { ...state.pagination, ...newPagination }})),

  fetchTickets: async () => {
    set({ loading: true });
    try {
      const { searchTerm, statusFilter, priorityFilter, pagination } = get();
      const params = {
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        search: searchTerm,
        status: statusFilter,
        priority: priorityFilter,
        // ...其他排序参数
      };
      const data = await ticketAPI.getTickets(params);
      set({ 
        tickets: data.tickets || [],
        pagination: { 
          ...pagination, 
          totalItems: data.total_items, 
          totalPages: data.total_pages 
        }
      });
    } catch (error) {
      console.error('获取工单列表失败:', error);
      set({ tickets: [] });
      // 可以在这里触发全局Toast提示
    } finally {
      set({ loading: false });
    }
  },

  createTicket: async (ticketData) => {
    try {
      await ticketAPI.createTicket(ticketData);
      // 成功后不需要立即fetchTickets，因为CreateTicketDialog会调用fetchTickets
    } catch (error) {
      console.error('创建工单失败:', error);
      throw error; // 抛出错误以便组件处理
    }
  },

  handleUpdateTicketStatus: async (ticketId, newStatus) => {
    try {
      await ticketAPI.updateTicket(ticketId, { status: newStatus });
      set((state) => ({
        tickets: state.tickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
        ),
        selectedTicket: state.selectedTicket?.id === ticketId ? { ...state.selectedTicket, status: newStatus } : state.selectedTicket,
      }));
      // 可以在这里触发全局Toast提示
    } catch (error) {
      console.error('更新工单状态失败:', error);
      throw error;
    }
  },

  toggleTicketSelection: (ticketId) => {
    set((state) => ({
      selectedTicketIds: state.selectedTicketIds.includes(ticketId)
        ? state.selectedTicketIds.filter((id) => id !== ticketId)
        : [...state.selectedTicketIds, ticketId],
    }));
  },

  toggleAllTicketsSelection: () => {
    set((state) => ({
      selectedTicketIds: state.selectedTicketIds.length === state.tickets.length && state.tickets.length > 0
        ? []
        : state.tickets.map((ticket) => ticket.id),
    }));
  },

  clearSelectedTickets: () => set({ selectedTicketIds: [] }),

  performBulkAction: async (actionType, ticketIds) => {
    try {
      // 根据actionType调用不同的API或执行不同的逻辑
      if (actionType === 'close') {
        await ticketAPI.bulkUpdateTickets(ticketIds, { status: 'closed' }); // 假设有批量更新API
      }
      // ... 其他批量操作
      get().fetchTickets(); // 刷新列表
      // 可以在这里触发全局Toast提示
    } catch (error) {
      console.error('批量操作失败:', error);
      throw error;
    }
  },

  addComment: async (ticketId, commentData) => {
    try {
      await ticketAPI.createTicketComment(ticketId, commentData);
      // 成功后，重新获取评论列表
      // get().fetchTicketComments(ticketId); // 或者直接更新本地comments状态
    } catch (error) {
      console.error('添加评论失败:', error);
      throw error;
    }
  },

  // ... 其他与工单相关的操作，如删除、编辑等
}));
```

### 3.11 `constants.js` (常量定义) 伪代码

将状态和优先级映射等常量集中管理。

```jsx
// src/lib/constants.js
export const statusMap = {
  'open': { label: '待处理', color: 'bg-blue-100 text-blue-800' },
  'in_progress': { label: '处理中', color: 'bg-yellow-100 text-yellow-800' },
  'pending': { label: '等待中', color: 'bg-orange-100 text-orange-800' },
  'resolved': { label: '已解决', color: 'bg-green-100 text-green-800' },
  'closed': { label: '已关闭', color: 'bg-gray-100 text-gray-800' }
};

export const priorityMap = {
  'low': { label: '低', color: 'bg-gray-100 text-gray-800' },
  'medium': { label: '中', color: 'bg-blue-100 text-blue-800' },
  'high': { label: '高', color: 'bg-orange-100 text-orange-800' },
  'urgent': { label: '紧急', color: 'bg-red-100 text-red-800' }
};

// 其他常量，如工单来源、SLA类型等
export const TICKET_SOURCES = ['web', 'email', 'phone', 'chat'];
export const SLA_STATUSES = ['on_track', 'warning', 'overdue'];
```

### 3.12 `utils.js` (工具函数) 伪代码

封装常用的工具函数。

```jsx
// src/lib/utils.js
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('zh-CN');
};

// 其他工具函数，如文件大小格式化、URL处理等
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
```

### 3.13 `apiClient.js` (API 客户端封装) 伪代码

统一 Axios 配置和请求拦截。

```jsx
// src/lib/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
      if (error.response.status === 401) {
        // window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 3.14 `api.js` (API 调用) 伪代码

基于 `apiClient` 封装具体的 API 调用函数。

```jsx
// src/lib/api.js
import apiClient from './apiClient';

export const ticketAPI = {
  getTickets: async (params) => {
    const response = await apiClient.get('/tickets', { params });
    return response.data;
  },
  createTicket: async (ticketData) => {
    const response = await apiClient.post('/tickets', ticketData);
    return response.data;
  },
  updateTicket: async (ticketId, updateData) => {
    const response = await apiClient.put(`/tickets/${ticketId}`, updateData);
    return response.data;
  },
  deleteTicket: async (ticketId) => {
    const response = await apiClient.delete(`/tickets/${ticketId}`);
    return response.data;
  },
  getTicketComments: async (ticketId) => {
    const response = await apiClient.get(`/tickets/${ticketId}/comments`);
    return response.data;
  },
  createTicketComment: async (ticketId, commentData) => {
    const response = await apiClient.post(`/tickets/${ticketId}/comments`, commentData);
    return response.data;
  },
  getTicketHistory: async (ticketId) => {
    const response = await apiClient.get(`/tickets/${ticketId}/history`);
    return response.data;
  },
  bulkUpdateTickets: async (ticketIds, updateData) => {
    const response = await apiClient.post('/tickets/bulk-update', { ids: ticketIds, ...updateData });
    return response.data;
  },
  getCategories: async () => {
    const response = await apiClient.get('/ticket-categories');
    return response.data;
  },
  uploadAttachment: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/attachments/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export const customerAPI = {
  getCustomers: async () => {
    const response = await apiClient.get('/customers');
    return response.data;
  },
};

export const userAPI = {
  getUsers: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },
};
```

### 3.15 `RichTextEditor.jsx` (富文本编辑器) 伪代码

一个简单的富文本编辑器组件示例，可以使用第三方库实现。

```jsx
// src/components/common/RichTextEditor.jsx
import React, { useRef } from 'react';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const quillRef = useRef(null);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'image'
  ];

  return (
    <div className="rich-text-editor">
      <textarea 
        className="w-full p-2 border rounded-md min-h-[100px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <p className="text-sm text-gray-500 mt-1">此处将集成富文本编辑器，目前为普通文本框。</p>
    </div>
  );
};

export default RichTextEditor;
```

### 3.16 `FileUploader.jsx` (文件上传器) 伪代码

一个简单的文件上传组件示例。

```jsx
// src/components/common/FileUploader.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ticketAPI } from '@/lib/api';
import { formatFileSize } from '@/lib/utils';

const FileUploader = ({ onFilesChange, initialFiles = [] }) => {
  const [files, setFiles] = useState(initialFiles);
  const { toast } = useToast();

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length === 0) return;

    const uploadedFilesInfo = [];
    for (const file of selectedFiles) {
      try {
        const mockFileUrl = URL.createObjectURL(file);
        uploadedFilesInfo.push({ 
          id: Date.now() + Math.random(), 
          filename: file.name, 
          url: mockFileUrl, 
          size: file.size 
        });

        toast({
          title: '上传成功',
          description: `文件 ${file.name} 上传成功。`,
        });
      } catch (error) {
        console.error('文件上传失败:', error);
        toast({
          title: '上传失败',
          description: `文件 ${file.name} 上传失败。`,
          variant: 'destructive',
        });
      }
    }
    const newFiles = [...files, ...uploadedFilesInfo];
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const handleRemoveFile = (fileToRemove) => {
    const updatedFiles = files.filter(file => file.id !== fileToRemove.id);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
    if (fileToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(fileToRemove.url);
    }
  };

  return (
    <div className="space-y-2">
      <Input 
        id="file-upload"
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
      <Label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
        <Upload className="w-4 h-4 mr-2" />
        选择文件
      </Label>
      <div className="mt-2">
        {files.map((file) => (
          <div key={file.id} className="flex items-center justify-between bg-gray-100 p-2 rounded-md mb-1">
            <span className="text-sm text-gray-800">{file.filename} ({formatFileSize(file.size)})</span>
            <Button variant="ghost" size="sm" onClick={() => handleRemoveFile(file)}>
              <X className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;
```

### 3.17 `Pagination.jsx` (分页组件) 伪代码

一个通用的分页组件。

```jsx
// src/components/common/Pagination.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({ currentPage, pageSize, totalItems, onPageChange, onPageSizeChange }) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirstPage = () => {
    onPageChange(1);
  };

  const handleLastPage = () => {
    onPageChange(totalPages);
  };

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex-1 text-sm text-gray-700">
        显示 {Math.min((currentPage - 1) * pageSize + 1, totalItems)} 到 {Math.min(currentPage * pageSize, totalItems)} 条，共 {totalItems} 条
      </div>
      <div className="flex items-center space-x-2">
        <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={handleFirstPage}
          disabled={currentPage === 1}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={handleLastPage}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
```

### 3.18 `LoadingSpinner.jsx` (加载指示器) 伪代码

一个简单的加载指示器组件。

```jsx
// src/components/common/LoadingSpinner.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <span className="ml-2 text-lg text-gray-700">加载中...</span>
    </div>
  );
};

export default LoadingSpinner;
```

### 3.19 `Toast.jsx` (统一的Toast提示组件) 伪代码

Shadcn UI 提供了 `useToast` Hook 和 `Toaster` 组件来管理 Toast 提示。通常 `Toaster` 会放在应用的根组件中。

```jsx
// src/components/common/Toast.jsx
const ToastPlaceholder = () => {
  return (
    <div className="fixed bottom-4 right-4 p-3 bg-gray-800 text-white rounded-md shadow-lg z-50">
      Toast 提示将在此处显示 (由 Shadcn UI 的 Toaster 组件管理)
    </div>
  );
};

export default ToastPlaceholder;
```

### 3.20 `useTickets.js` (自定义Hook) 伪代码

一个自定义 Hook，用于封装工单数据获取和管理逻辑，但考虑到 Zustand 已经提供了更强大的全局状态管理，此 Hook 的作用可能被 Zustand Store 部分替代。如果不需要全局状态，可以考虑使用此 Hook。

```jsx
// src/features/tickets/hooks/useTickets.js
import { useState, useEffect, useCallback } from 'react';
import { ticketAPI } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

const useTickets = (initialFilters = {}) => {
  const { toast } = useToast();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        ...filters,
      };
      const data = await ticketAPI.getTickets(params);
      setTickets(data.tickets || []);
      setPagination(prev => ({ 
        ...prev, 
        totalItems: data.total_items, 
        totalPages: data.total_pages 
      }));
    } catch (err) {
      console.error('获取工单失败:', err);
      setError(err);
      toast({
        title: '错误',
        description: '获取工单列表失败。',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.currentPage, pagination.pageSize]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const updatePagination = (newPagination) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  };

  const createTicket = async (ticketData) => {
    setLoading(true);
    try {
      await ticketAPI.createTicket(ticketData);
      toast({
        title: '成功',
        description: '工单创建成功。',
      });
      fetchTickets();
    } catch (err) {
      console.error('创建工单失败:', err);
      toast({
        title: '错误',
        description: '创建工单失败。',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    tickets,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    updatePagination,
    fetchTickets,
    createTicket,
  };
};

export default useTickets;
```

### 3.21 `ticketUtils.js` (工单相关工具函数) 伪代码

将工单特有的辅助函数放在这里。

```jsx
// src/features/tickets/utils/ticketUtils.js

export const calculateSlaStatus = (ticket) => {
  const now = new Date();
  const createdAt = new Date(ticket.created_at);
  const hoursDiff = (now - createdAt) / (1000 * 60 * 60);

  if (ticket.status === 'resolved' || ticket.status === 'closed') {
    return 'on_track';
  }

  if (ticket.priority === 'urgent' && hoursDiff > 4) {
    return 'overdue';
  } else if (ticket.priority === 'high' && hoursDiff > 8) {
    return 'overdue';
  } else if (ticket.priority === 'medium' && hoursDiff > 24) {
    return 'overdue';
  } else if (ticket.priority === 'low' && hoursDiff > 48) {
    return 'overdue';
  }

  if (ticket.priority === 'urgent' && hoursDiff > 3) {
    return 'warning';
  } else if (ticket.priority === 'high' && hoursDiff > 6) {
    return 'warning';
  }

  return 'on_track';
};
```

### 总结

以上伪代码展示了 `Tickets.jsx` 页面及其相关组件在功能增强、用户体验优化、性能提升和代码质量改进后的结构。通过模块化、状态管理、通用组件和工具函数的引入，整个工单管理模块将变得更加健壮、高效和易于维护。实际开发中，需要根据具体的技术栈和项目需求，填充伪代码中的具体实现细节，并进行充分的测试。



### 3.1 文件结构概览

为了提高代码的可读性、可维护性和组件复用性，我们将 `Tickets.jsx` 拆分为多个独立的组件，并引入常量和工具函数文件。新的文件结构将如下所示：

```
src/
├── components/
│   ├── ui/ (Shadcn UI 组件)
│   └── common/ (通用可复用组件)
│       ├── Pagination.jsx (新增：分页组件)
│       ├── Toast.jsx (新增：统一的Toast提示组件)
│       └── LoadingSpinner.jsx (新增：加载指示器)
├── pages/
│   └── Tickets.jsx (主页面，负责协调和数据流)
├── features/
│   └── tickets/ (与工单相关的特定功能模块)
│       ├── components/
│       │   ├── TicketCard.jsx (工单卡片)
│       │   ├── TicketFilters.jsx (搜索和筛选)
│       │   ├── CreateTicketDialog.jsx (创建工单对话框)
│       │   ├── TicketDetailDialog.jsx (工单详情对话框)
│       │   ├── TicketEditForm.jsx (新增：工单编辑表单)
│       │   ├── TicketCommentSection.jsx (新增：评论区，包含富文本和附件)
│       │   └── TicketHistoryLog.jsx (新增：操作历史)
│       ├── hooks/
│       │   └── useTickets.js (新增：自定义Hook，封装工单数据逻辑)
│       ├── stores/
│       │   └── ticketStore.js (新增：Zustand状态管理)
│       └── utils/
│           └── ticketUtils.js (新增：工单相关工具函数)
├── lib/
│   ├── api.js (现有：API调用)
│   ├── apiClient.js (新增：Axios实例封装)
│   ├── constants.js (新增：常量定义，如状态、优先级映射)
└── contexts/
    └── AuthContext.js (现有：认证上下文)
```



### 3.2 `Tickets.jsx` (主页面) 伪代码

`Tickets.jsx` 将主要负责协调各个子组件，管理全局状态（通过 Zustand 或 Context API），并处理数据流。它将变得更加简洁，专注于组件的组合和高层逻辑。

```jsx
// src/pages/Tickets.jsx
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import TicketFilters from '@/features/tickets/components/TicketFilters';
import TicketList from '@/features/tickets/components/TicketList';
import CreateTicketDialog from '@/features/tickets/components/CreateTicketDialog';
import { useTicketStore } from '@/features/tickets/stores/ticketStore';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Toast from '@/components/common/Toast'; // 统一的Toast组件

const Tickets = () => {
  const { 
    tickets, 
    loading, 
    fetchTickets, 
    searchTerm, 
    statusFilter, 
    priorityFilter, 
    pagination, 
    setPagination,
    setSearchTerm,
    setStatusFilter,
    setPriorityFilter,
    // ...其他状态和方法
  } = useTicketStore();

  useEffect(() => {
    fetchTickets();
  }, [searchTerm, statusFilter, priorityFilter, pagination.currentPage, pagination.pageSize]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">售后服务</h1>
          <p className="text-gray-600">管理和处理客户服务工单</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              新建工单
            </Button>
          </DialogTrigger>
          <CreateTicketDialog />
        </Dialog>
      </div>

      <TicketFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />

      <TicketList tickets={tickets} />

      <Pagination 
        currentPage={pagination.currentPage}
        pageSize={pagination.pageSize}
        totalItems={pagination.totalItems}
        onPageChange={(page) => setPagination({ ...pagination, currentPage: page })}
        onPageSizeChange={(size) => setPagination({ ...pagination, pageSize: size })}
      />

      {/* Toast组件通常在App.js或Layout组件中全局引入 */}
      <Toast />
    </div>
  );
};

export default Tickets;
```



### 3.3 `TicketList.jsx` (工单列表) 伪代码

`TicketList.jsx` 将负责渲染工单卡片列表，并处理批量操作的选中逻辑。

```jsx
// src/features/tickets/components/TicketList.jsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import TicketCard from './TicketCard';
import { useTicketStore } from '@/features/tickets/stores/ticketStore';
import { Checkbox } from '@/components/ui/checkbox'; // 用于批量选择
import { Button } from '@/components/ui/button'; // 用于批量操作按钮

const TicketList = ({ tickets }) => {
  const { selectedTicketIds, toggleTicketSelection, toggleAllTicketsSelection, clearSelectedTickets, performBulkAction } = useTicketStore();

  const handleBulkClose = () => {
    performBulkAction('close', selectedTicketIds);
    clearSelectedTickets();
  };

  if (tickets.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无工单</h3>
          <p className="text-gray-500 mb-4">点击"新建工单"开始创建第一个工单</p>
          {/* 如果有筛选条件，可以显示清除筛选按钮 */}
          {useTicketStore.getState().searchTerm || useTicketStore.getState().statusFilter || useTicketStore.getState().priorityFilter ? (
            <Button variant="outline" onClick={() => {
              useTicketStore.getState().setSearchTerm('');
              useTicketStore.getState().setStatusFilter('');
              useTicketStore.getState().setPriorityFilter('');
            }}>清除筛选</Button>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 批量操作区域 */}
      {tickets.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <Checkbox
            checked={selectedTicketIds.length === tickets.length && tickets.length > 0}
            onCheckedChange={toggleAllTicketsSelection}
            aria-label="Select all"
          />
          <Label htmlFor="select-all-tickets">全选</Label>
          {selectedTicketIds.length > 0 && (
            <>
              <Button size="sm" onClick={handleBulkClose}>批量关闭 ({selectedTicketIds.length})</Button>
              {/* 更多批量操作按钮 */}
            </>
          )}
        </div>
      )}

      <div className="grid gap-4">
        {tickets.map((ticket) => (
          <TicketCard 
            key={ticket.id} 
            ticket={ticket} 
            isSelected={selectedTicketIds.includes(ticket.id)}
            onSelect={() => toggleTicketSelection(ticket.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TicketList;
```



### 3.4 `TicketCard.jsx` (工单卡片) 伪代码

`TicketCard.jsx` 将专注于单个工单的展示和交互，包括查看详情和直接更新状态。

```jsx
// src/features/tickets/components/TicketCard.jsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, MessageSquare, Clock, User } from 'lucide-react';
import { statusMap, priorityMap } from '@/lib/constants';
import { formatDate } from '@/lib/utils'; // 假设formatDate移到utils
import { useTicketStore } from '@/features/tickets/stores/ticketStore';
import { Checkbox } from '@/components/ui/checkbox';

const TicketCard = ({ ticket, isSelected, onSelect }) => {
  const { setSelectedTicket, setShowDetailDialog, handleUpdateTicketStatus } = useTicketStore();

  const handleViewTicket = () => {
    setSelectedTicket(ticket);
    setShowDetailDialog(true);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center mr-4">
            <Checkbox checked={isSelected} onCheckedChange={onSelect} className="mr-3" />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold">{ticket.title}</h3>
                <Badge className={statusMap[ticket.status]?.color}>
                  {statusMap[ticket.status]?.label}
                </Badge>
                <Badge className={priorityMap[ticket.priority]?.color}>
                  {priorityMap[ticket.priority]?.label}
                </Badge>
                {/* 新增：SLA 状态 */}
                {ticket.sla_status && (
                  <Badge variant="outline" className={`
                    ${ticket.sla_status === 'on_track' ? 'bg-green-100 text-green-800'
                    : ticket.sla_status === 'warning' ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'}
                  `}>
                    SLA: {ticket.sla_status === 'on_track' ? '正常' : ticket.sla_status === 'warning' ? '即将超期' : '已超期'}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3">{ticket.ticket_number}</p>
              <p className="text-gray-700 mb-4 line-clamp-2">{ticket.description}</p>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{ticket.customer?.company_name || '未知客户'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(ticket.created_at)}</span>
                </div>
                {ticket.assignee && (
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>负责人: {ticket.assignee.full_name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewTicket}
            >
              <Eye className="w-4 h-4 mr-1" />
              查看
            </Button>
            {ticket.status !== 'closed' && (
              <Select
                value={ticket.status}
                onValueChange={(value) => handleUpdateTicketStatus(ticket.id, value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusMap).map(([key, val]) => (
                    <SelectItem key={key} value={key}>{val.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketCard;
```



### 3.5 `CreateTicketDialog.jsx` (创建工单对话框) 伪代码

此组件将封装创建新工单的表单逻辑，并增加负责人分配、分类选择等功能。

```jsx
// src/features/tickets/components/CreateTicketDialog.jsx
import React, { useState, useEffect } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useTicketStore } from '@/features/tickets/stores/ticketStore';
import { useToast } from '@/components/ui/use-toast'; // Shadcn Toast Hook
import { customerAPI, userAPI } from '@/lib/api'; // 假设有userAPI获取用户列表
import RichTextEditor from '@/components/common/RichTextEditor'; // 新增富文本编辑器组件
import FileUploader from '@/components/common/FileUploader'; // 新增文件上传组件

const CreateTicketDialog = () => {
  const { createTicket, fetchTickets } = useTicketStore();
  const { toast } = useToast();

  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    customer_id: '',
    category_id: '',
    priority: 'medium',
    source: 'web',
    assignee_id: '', // 新增负责人字段
    attachments: [], // 新增附件字段
  });
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]); // 用于负责人选择

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [customerData, categoryData, userData] = await Promise.all([
          customerAPI.getCustomers(),
          ticketAPI.getCategories(),
          userAPI.getUsers(), // 获取系统用户列表
        ]);
        setCustomers(customerData.customers || []);
        setCategories(categoryData.categories || []);
        setUsers(userData.users || []);
      } catch (error) {
        console.error('加载表单数据失败:', error);
        toast({
          title: '错误',
          description: '加载必要数据失败，请重试。',
          variant: 'destructive',
        });
      }
    };
    loadFormData();
  }, []);

  const handleCreate = async () => {
    if (!newTicket.title || !newTicket.description || !newTicket.customer_id) {
      toast({
        title: '提示',
        description: '请填写工单标题、描述和客户。',
        variant: 'warning',
      });
      return;
    }

    try {
      await createTicket(newTicket);
      toast({
        title: '成功',
        description: '工单创建成功。',
      });
      // 重置表单
      setNewTicket({
        title: '',
        description: '',
        customer_id: '',
        category_id: '',
        priority: 'medium',
        source: 'web',
        assignee_id: '',
        attachments: [],
      });
      fetchTickets(); // 刷新列表
      // 关闭对话框 (假设由父组件控制)
      // onOpenChange(false);
    } catch (error) {
      console.error('创建工单失败:', error);
      toast({
        title: '错误',
        description: '创建工单失败，请稍后再试。',
        variant: 'destructive',
      });
    }
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>创建新工单</DialogTitle>
        <DialogDescription>填写工单基本信息</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">工单标题</Label>
          <Input
            id="title"
            value={newTicket.title}
            onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="description">问题描述</Label>
          {/* 使用富文本编辑器 */}
          <RichTextEditor
            value={newTicket.description}
            onChange={(content) => setNewTicket({ ...newTicket, description: content })}
          />
        </div>
        <div>
          <Label htmlFor="customer">客户</Label>
          <Select value={newTicket.customer_id} onValueChange={(value) => setNewTicket({ ...newTicket, customer_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="选择客户" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id.toString()}>
                  {customer.company_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="category">分类</Label>
          <Select value={newTicket.category_id} onValueChange={(value) => setNewTicket({ ...newTicket, category_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="priority">优先级</Label>
          <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(priorityMap).map(([key, val]) => (
                <SelectItem key={key} value={key}>{val.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="assignee">负责人</Label>
          <Select value={newTicket.assignee_id} onValueChange={(value) => setNewTicket({ ...newTicket, assignee_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="选择负责人" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">未分配</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="attachments">附件</Label>
          <FileUploader 
            onFilesChange={(files) => setNewTicket({ ...newTicket, attachments: files })}
            // 假设FileUploader返回文件URL或ID
          />
        </div>
      </div>
      <DialogFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => { /* 关闭对话框 */ }}>
          取消
        </Button>
        <Button onClick={handleCreate}>
          创建工单
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default CreateTicketDialog;
```



### 3.6 `TicketDetailDialog.jsx` (工单详情对话框) 伪代码

此组件将展示工单的详细信息，并集成编辑功能、评论区和操作历史。

```jsx
// src/features/tickets/components/TicketDetailDialog.jsx
import React, { useState, useEffect } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Shadcn Tabs
import { statusMap, priorityMap } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { useTicketStore } from '@/features/tickets/stores/ticketStore';
import TicketEditForm from './TicketEditForm'; // 新增工单编辑表单
import TicketCommentSection from './TicketCommentSection'; // 新增评论区
import TicketHistoryLog from './TicketHistoryLog'; // 新增操作历史
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ticketAPI, userAPI } from '@/lib/api';

const TicketDetailDialog = () => {
  const { selectedTicket, setSelectedTicket, setShowDetailDialog, handleUpdateTicketStatus } = useTicketStore();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState([]); // 用于负责人选择

  useEffect(() => {
    if (selectedTicket) {
      // 每次打开详情时重新获取最新评论和历史记录
      const fetchDetails = async () => {
        try {
          const [commentsData, historyData, userData] = await Promise.all([
            ticketAPI.getTicketComments(selectedTicket.id),
            ticketAPI.getTicketHistory(selectedTicket.id), // 假设有获取历史记录的API
            userAPI.getUsers(),
          ]);
          useTicketStore.getState().setComments(commentsData.comments || []);
          useTicketStore.getState().setTicketHistory(historyData.history || []);
          setUsers(userData.users || []);
        } catch (error) {
          console.error('获取工单详情数据失败:', error);
          toast({
            title: '错误',
            description: '加载工单详情失败，请重试。',
            variant: 'destructive',
          });
        }
      };
      fetchDetails();
    }
  }, [selectedTicket?.id]);

  const handleSaveEdit = async (updatedFields) => {
    try {
      await ticketAPI.updateTicket(selectedTicket.id, updatedFields);
      setSelectedTicket({ ...selectedTicket, ...updatedFields }); // 更新本地状态
      useTicketStore.getState().fetchTickets(); // 刷新列表
      toast({
        title: '成功',
        description: '工单信息更新成功。',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('更新工单失败:', error);
      toast({
        title: '错误',
        description: '更新工单失败，请稍后再试。',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTicket = async () => {
    if (window.confirm('确定要删除此工单吗？此操作不可逆。')) {
      try {
        await ticketAPI.deleteTicket(selectedTicket.id);
        useTicketStore.getState().fetchTickets(); // 刷新列表
        setShowDetailDialog(false);
        toast({
          title: '成功',
          description: '工单已成功删除。',
        });
      } catch (error) {
        console.error('删除工单失败:', error);
        toast({
          title: '错误',
          description: '删除工单失败，请稍后再试。',
          variant: 'destructive',
        });
      }
    }
  };

  if (!selectedTicket) return null; // 或者显示加载状态

  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          {selectedTicket.title}
          <Badge className={statusMap[selectedTicket.status]?.color}>
            {statusMap[selectedTicket.status]?.label}
          </Badge>
          <Badge className={priorityMap[selectedTicket.priority]?.color}>
            {priorityMap[selectedTicket.priority]?.label}
          </Badge>
          {/* 新增：SLA 状态 */}
          {selectedTicket.sla_status && (
            <Badge variant="outline" className={`
              ${selectedTicket.sla_status === 'on_track' ? 'bg-green-100 text-green-800'
              : selectedTicket.sla_status === 'warning' ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'}
            `}>
              SLA: {selectedTicket.sla_status === 'on_track' ? '正常' : selectedTicket.sla_status === 'warning' ? '即将超期' : '已超期'}
            </Badge>
          )}
        </DialogTitle>
        <DialogDescription>
          工单号: {selectedTicket.ticket_number} | 创建时间: {formatDate(selectedTicket.created_at)}
        </DialogDescription>
      </DialogHeader>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Label>状态:</Label>
          <Select
            value={selectedTicket.status}
            onValueChange={(value) => handleUpdateTicketStatus(selectedTicket.id, value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusMap).map(([key, val]) => (
                <SelectItem key={key} value={key}>{val.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Label>负责人:</Label>
          <Select
            value={selectedTicket.assignee_id || ''}
            onValueChange={(value) => handleSaveEdit({ assignee_id: value || null })}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="未分配" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">未分配</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? '取消编辑' : '编辑工单'}
          </Button>
          <Button variant="destructive" onClick={handleDeleteTicket}>
            删除工单
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">详情</TabsTrigger>
          <TabsTrigger value="comments">评论</TabsTrigger>
          <TabsTrigger value="history">操作历史</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-4 pt-4">
          {isEditing ? (
            <TicketEditForm ticket={selectedTicket} onSave={handleSaveEdit} onCancel={() => setIsEditing(false)} />
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">问题描述</h4>
                <div className="text-gray-700 bg-gray-50 p-3 rounded" dangerouslySetInnerHTML={{ __html: selectedTicket.description }}></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">客户</h4>
                  <p className="text-gray-700">{selectedTicket.customer?.company_name || '未知'}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">分类</h4>
                  <p className="text-gray-700">{selectedTicket.category?.name || '未知'}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">优先级</h4>
                  <p className="text-gray-700">{priorityMap[selectedTicket.priority]?.label}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">来源</h4>
                  <p className="text-gray-700">{selectedTicket.source}</p>
                </div>
                {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">附件</h4>
                    <ul className="list-disc pl-5">
                      {selectedTicket.attachments.map((attachment, index) => (
                        <li key={index}><a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{attachment.filename}</a></li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* 动态渲染自定义字段 */}
                {selectedTicket.custom_fields && Object.keys(selectedTicket.custom_fields).map(key => (
                  <div key={key}>
                    <h4 className="font-medium mb-2">{key}</h4>
                    <p className="text-gray-700">{selectedTicket.custom_fields[key]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="comments" className="pt-4">
          <TicketCommentSection ticketId={selectedTicket.id} />
        </TabsContent>
        <TabsContent value="history" className="pt-4">
          <TicketHistoryLog ticketId={selectedTicket.id} />
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
};

export default TicketDetailDialog;
```



### 3.7 `TicketEditForm.jsx` (工单编辑表单) 伪代码

这是一个独立的表单组件，用于编辑工单的非状态字段。

```jsx
// src/features/tickets/components/TicketEditForm.jsx
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import RichTextEditor from '@/components/common/RichTextEditor';
import FileUploader from '@/components/common/FileUploader';
import { customerAPI, ticketAPI, userAPI } from '@/lib/api';
import { priorityMap } from '@/lib/constants';

const TicketEditForm = ({ ticket, onSave, onCancel }) => {
  const [editedTicket, setEditedTicket] = useState(ticket);
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadFormData = async () => {
      const [customerData, categoryData, userData] = await Promise.all([
        customerAPI.getCustomers(),
        ticketAPI.getCategories(),
        userAPI.getUsers(),
      ]);
      setCustomers(customerData.customers || []);
      setCategories(categoryData.categories || []);
      setUsers(userData.users || []);
    };
    loadFormData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setEditedTicket({ ...editedTicket, [id]: value });
  };

  const handleRichTextChange = (content) => {
    setEditedTicket({ ...editedTicket, description: content });
  };

  const handleFilesChange = (files) => {
    setEditedTicket({ ...editedTicket, attachments: files });
  };

  const handleSubmit = () => {
    onSave(editedTicket);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">工单标题</Label>
        <Input id="title" value={editedTicket.title} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="description">问题描述</Label>
        <RichTextEditor value={editedTicket.description} onChange={handleRichTextChange} />
      </div>
      <div>
        <Label htmlFor="customer_id">客户</Label>
        <Select value={editedTicket.customer_id.toString()} onValueChange={(value) => setEditedTicket({ ...editedTicket, customer_id: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id.toString()}>
                {customer.company_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="category_id">分类</Label>
        <Select value={editedTicket.category_id.toString()} onValueChange={(value) => setEditedTicket({ ...editedTicket, category_id: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="priority">优先级</Label>
        <Select value={editedTicket.priority} onValueChange={(value) => setEditedTicket({ ...editedTicket, priority: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(priorityMap).map(([key, val]) => (
              <SelectItem key={key} value={key}>{val.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="assignee_id">负责人</Label>
        <Select value={editedTicket.assignee_id?.toString() || ''} onValueChange={(value) => setEditedTicket({ ...editedTicket, assignee_id: value || null })}>
          <SelectTrigger>
            <SelectValue placeholder="未分配" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">未分配</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="attachments">附件</Label>
        <FileUploader 
          initialFiles={editedTicket.attachments}
          onFilesChange={handleFilesChange}
        />
      </div>
      {/* 动态渲染自定义字段的编辑 */}
      {editedTicket.custom_fields && Object.keys(editedTicket.custom_fields).map(key => (
        <div key={key}>
          <Label htmlFor={`custom_field_${key}`}>{key}</Label>
          <Input 
            id={`custom_field_${key}`}
            value={editedTicket.custom_fields[key]}
            onChange={(e) => setEditedTicket({ 
              ...editedTicket,
              custom_fields: { ...editedTicket.custom_fields, [key]: e.target.value }
            })}
          />
        </div>
      ))}
      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={onCancel}>取消</Button>
        <Button onClick={handleSubmit}>保存</Button>
      </div>
    </div>
  );
};

export default TicketEditForm;
```



### 3.8 `TicketCommentSection.jsx` (评论区) 伪代码

此组件将展示工单评论，并提供添加新评论的功能，区分内部/外部评论，并支持附件和富文本。

```jsx
// src/features/tickets/components/TicketCommentSection.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useTicketStore } from '@/features/tickets/stores/ticketStore';
import { useToast } from '@/components/ui/use-toast';
import { ticketAPI } from '@/lib/api';
import RichTextEditor from '@/components/common/RichTextEditor';
import FileUploader from '@/components/common/FileUploader';
import { formatDate } from '@/lib/utils';

const TicketCommentSection = ({ ticketId }) => {
  const { comments, setComments, addComment } = useTicketStore();
  const { toast } = useToast();
  const [newCommentContent, setNewCommentContent] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [newCommentAttachments, setNewCommentAttachments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await ticketAPI.getTicketComments(ticketId);
        setComments(data.comments || []);
      } catch (error) {
        console.error('获取评论失败:', error);
        toast({
          title: '错误',
          description: '加载评论失败。',
          variant: 'destructive',
        });
      }
    };
    fetchComments();
  }, [ticketId]);

  const handleAddComment = async () => {
    if (!newCommentContent.trim()) {
      toast({
        title: '提示',
        description: '评论内容不能为空。',
        variant: 'warning',
      });
      return;
    }

    try {
      await addComment(ticketId, {
        content: newCommentContent,
        is_internal: isInternalComment,
        attachments: newCommentAttachments, // 传递附件
      });
      setNewCommentContent('');
      setIsInternalComment(false);
      setNewCommentAttachments([]);
      toast({
        title: '成功',
        description: '评论添加成功。',
      });
      // 重新获取评论以显示最新内容
      const data = await ticketAPI.getTicketComments(ticketId);
      setComments(data.comments || []);
    } catch (error) {
      console.error('添加评论失败:', error);
      toast({
        title: '错误',
        description: '添加评论失败，请稍后再试。',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium mb-2">评论</h4>
      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {comments.length === 0 ? (
          <p className="text-gray-500">暂无评论。</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className={`p-3 rounded-lg ${comment.is_internal ? 'bg-blue-50' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                <span>
                  <strong>{comment.author?.full_name || '未知用户'}</strong>
                  {comment.is_internal && <span className="ml-2 text-blue-700 font-semibold">(内部评论)</span>}
                </span>
                <span>{formatDate(comment.created_at)}</span>
              </div>
              <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: comment.content }}></div>
              {comment.attachments && comment.attachments.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">附件:</p>
                  <ul className="list-disc pl-5 text-sm">
                    {comment.attachments.map((attachment, index) => (
                      <li key={index}><a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{attachment.filename}</a></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className="mt-4 p-4 border rounded-lg bg-white">
        <h5 className="font-medium mb-2">添加评论</h5>
        <RichTextEditor
          value={newCommentContent}
          onChange={setNewCommentContent}
          placeholder="输入评论内容..."
        />
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="internal-comment"
              checked={isInternalComment}
              onCheckedChange={setIsInternalComment}
            />
            <Label htmlFor="internal-comment">内部评论</Label>
          </div>
          <FileUploader 
            onFilesChange={setNewCommentAttachments}
            // 假设FileUploader返回文件URL或ID
          />
          <Button onClick={handleAddComment}>提交评论</Button>
        </div>
      </div>
    </div>
  );
};

export default TicketCommentSection;
```



### 3.9 `TicketHistoryLog.jsx` (操作历史) 伪代码

此组件将展示工单的所有操作历史记录。

```jsx
// src/features/tickets/components/TicketHistoryLog.jsx
import React, { useEffect } from 'react';
import { useTicketStore } from '@/features/tickets/stores/ticketStore';
import { useToast } from '@/components/ui/use-toast';
import { ticketAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';

const TicketHistoryLog = ({ ticketId }) => {
  const { ticketHistory, setTicketHistory } = useTicketStore();
  const { toast } = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await ticketAPI.getTicketHistory(ticketId);
        setTicketHistory(data.history || []);
      } catch (error) {
        console.error('获取工单历史失败:', error);
        toast({
          title: '错误',
          description: '加载工单历史失败。',
          variant: 'destructive',
        });
      }
    };
    fetchHistory();
  }, [ticketId]);

  if (ticketHistory.length === 0) {
    return <p className="text-gray-500">暂无操作历史。</p>;
  }

  return (
    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
      {ticketHistory.map((log) => (
        <div key={log.id} className="p-3 rounded-lg bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
            <span>
              <strong>{log.operator?.full_name || '系统'}</strong>
              <span className="ml-2">{log.action_type}</span>
            </span>
            <span>{formatDate(log.timestamp)}</span>
          </div>
          <p className="text-gray-800">{log.description}</p>
          {log.details && (
            <pre className="mt-1 text-xs text-gray-700 bg-gray-100 p-2 rounded overflow-x-auto">
              {JSON.stringify(log.details, null, 2)}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
};

export default TicketHistoryLog;
```



### 3.10 `ticketStore.js` (Zustand 状态管理) 伪代码

使用 Zustand 管理工单相关的全局状态，包括工单列表、筛选条件、选中工单、详情工单、评论、历史记录等，并封装数据操作逻辑。

```jsx
// src/features/tickets/stores/ticketStore.js
import { create } from 'zustand';
import { ticketAPI } from '@/lib/api';

export const useTicketStore = create((set, get) => ({
  tickets: [],
  loading: false,
  searchTerm: '',
  statusFilter: '',
  priorityFilter: '',
  selectedTicketIds: [],
  selectedTicket: null,
  comments: [],
  ticketHistory: [],
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  },

  setSearchTerm: (term) => set({ searchTerm: term, 'pagination.currentPage': 1 }),
  setStatusFilter: (status) => set({ statusFilter: status, 'pagination.currentPage': 1 }),
  setPriorityFilter: (priority) => set({ priorityFilter: priority, 'pagination.currentPage': 1 }),
  setSelectedTicket: (ticket) => set({ selectedTicket: ticket }),
  setShowDetailDialog: (isOpen) => set({ showDetailDialog: isOpen }), // 假设由store控制dialog状态
  setComments: (comments) => set({ comments: comments }),
  setTicketHistory: (history) => set({ ticketHistory: history }),
  setPagination: (newPagination) => set((state) => ({ pagination: { ...state.pagination, ...newPagination }})),

  fetchTickets: async () => {
    set({ loading: true });
    try {
      const { searchTerm, statusFilter, priorityFilter, pagination } = get();
      const params = {
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        search: searchTerm,
        status: statusFilter,
        priority: priorityFilter,
        // ...其他排序参数
      };
      const data = await ticketAPI.getTickets(params);
      set({ 
        tickets: data.tickets || [],
        pagination: { 
          ...pagination, 
          totalItems: data.total_items, 
          totalPages: data.total_pages 
        }
      });
    } catch (error) {
      console.error('获取工单列表失败:', error);
      set({ tickets: [] });
      // 可以在这里触发全局Toast提示
    } finally {
      set({ loading: false });
    }
  },

  createTicket: async (ticketData) => {
    try {
      await ticketAPI.createTicket(ticketData);
      // 成功后不需要立即fetchTickets，因为CreateTicketDialog会调用fetchTickets
    } catch (error) {
      console.error('创建工单失败:', error);
      throw error; // 抛出错误以便组件处理
    }
  },

  handleUpdateTicketStatus: async (ticketId, newStatus) => {
    try {
      await ticketAPI.updateTicket(ticketId, { status: newStatus });
      set((state) => ({
        tickets: state.tickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
        ),
        selectedTicket: state.selectedTicket?.id === ticketId ? { ...state.selectedTicket, status: newStatus } : state.selectedTicket,
      }));
      // 可以在这里触发全局Toast提示
    } catch (error) {
      console.error('更新工单状态失败:', error);
      throw error;
    }
  },

  toggleTicketSelection: (ticketId) => {
    set((state) => ({
      selectedTicketIds: state.selectedTicketIds.includes(ticketId)
        ? state.selectedTicketIds.filter((id) => id !== ticketId)
        : [...state.selectedTicketIds, ticketId],
    }));
  },

  toggleAllTicketsSelection: () => {
    set((state) => ({
      selectedTicketIds: state.selectedTicketIds.length === state.tickets.length && state.tickets.length > 0
        ? []
        : state.tickets.map((ticket) => ticket.id),
    }));
  },

  clearSelectedTickets: () => set({ selectedTicketIds: [] }),

  performBulkAction: async (actionType, ticketIds) => {
    try {
      // 根据actionType调用不同的API或执行不同的逻辑
      if (actionType === 'close') {
        await ticketAPI.bulkUpdateTickets(ticketIds, { status: 'closed' }); // 假设有批量更新API
      }
      // ... 其他批量操作
      get().fetchTickets(); // 刷新列表
      // 可以在这里触发全局Toast提示
    } catch (error) {
      console.error('批量操作失败:', error);
      throw error;
    }
  },

  addComment: async (ticketId, commentData) => {
    try {
      await ticketAPI.createTicketComment(ticketId, commentData);
      // 成功后，重新获取评论列表
      // get().fetchTicketComments(ticketId); // 或者直接更新本地comments状态
    } catch (error) {
      console.error('添加评论失败:', error);
      throw error;
    }
  },

  // ... 其他与工单相关的操作，如删除、编辑等
}));
```



### 3.11 `constants.js` (常量定义) 伪代码

将状态和优先级映射等常量集中管理。

```jsx
// src/lib/constants.js
export const statusMap = {
  'open': { label: '待处理', color: 'bg-blue-100 text-blue-800' },
  'in_progress': { label: '处理中', color: 'bg-yellow-100 text-yellow-800' },
  'pending': { label: '等待中', color: 'bg-orange-100 text-orange-800' },
  'resolved': { label: '已解决', color: 'bg-green-100 text-green-800' },
  'closed': { label: '已关闭', color: 'bg-gray-100 text-gray-800' }
};

export const priorityMap = {
  'low': { label: '低', color: 'bg-gray-100 text-gray-800' },
  'medium': { label: '中', color: 'bg-blue-100 text-blue-800' },
  'high': { label: '高', color: 'bg-orange-100 text-orange-800' },
  'urgent': { label: '紧急', color: 'bg-red-100 text-red-800' }
};

// 其他常量，如工单来源、SLA类型等
export const TICKET_SOURCES = ['web', 'email', 'phone', 'chat'];
export const SLA_STATUSES = ['on_track', 'warning', 'overdue'];
```



### 3.12 `utils.js` (工具函数) 伪代码

封装常用的工具函数。

```jsx
// src/lib/utils.js
export const formatDate = (dateString) => {
  if (!dateString) return 
  return new Date(dateString).toLocaleString(

// 其他工具函数，如文件大小格式化、URL处理等
export const formatFileSize = (bytes) => {
  if (bytes === 0) return 
  const k = 1024;
  const sizes = [\Bytes\
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) +   + sizes[i];
};
```



### 3.12 `utils.js` (工具函数) 伪代码

封装常用的工具函数。

```jsx
// src/lib/utils.js
export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('zh-CN');
};

// 其他工具函数，如文件大小格式化、URL处理等
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
```



### 3.13 `apiClient.js` (API 客户端封装) 伪代码

统一 Axios 配置和请求拦截。

```jsx
// src/lib/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
      if (error.response.status === 401) {
        // window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```



### 3.14 `api.js` (API 调用) 伪代码

基于 `apiClient` 封装具体的 API 调用函数。

```jsx
// src/lib/api.js
import apiClient from './apiClient';

export const ticketAPI = {
  getTickets: async (params) => {
    const response = await apiClient.get('/tickets', { params });
    return response.data;
  },
  createTicket: async (ticketData) => {
    const response = await apiClient.post('/tickets', ticketData);
    return response.data;
  },
  updateTicket: async (ticketId, updateData) => {
    const response = await apiClient.put(`/tickets/${ticketId}`, updateData);
    return response.data;
  },
  deleteTicket: async (ticketId) => {
    const response = await apiClient.delete(`/tickets/${ticketId}`);
    return response.data;
  },
  getTicketComments: async (ticketId) => {
    const response = await apiClient.get(`/tickets/${ticketId}/comments`);
    return response.data;
  },
  createTicketComment: async (ticketId, commentData) => {
    const response = await apiClient.post(`/tickets/${ticketId}/comments`, commentData);
    return response.data;
  },
  getTicketHistory: async (ticketId) => {
    const response = await apiClient.get(`/tickets/${ticketId}/history`);
    return response.data;
  },
  bulkUpdateTickets: async (ticketIds, updateData) => {
    const response = await apiClient.post('/tickets/bulk-update', { ids: ticketIds, ...updateData });
    return response.data;
  },
  getCategories: async () => {
    const response = await apiClient.get('/ticket-categories');
    return response.data;
  },
  uploadAttachment: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/attachments/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export const customerAPI = {
  getCustomers: async () => {
    const response = await apiClient.get('/customers');
    return response.data;
  },
};

export const userAPI = {
  getUsers: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },
};
```



### 3.15 `RichTextEditor.jsx` (富文本编辑器) 伪代码

一个简单的富文本编辑器组件示例，可以使用第三方库实现。

```jsx
// src/components/common/RichTextEditor.jsx
import React, { useRef } from 'react';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const quillRef = useRef(null);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'image'
  ];

  return (
    <div className="rich-text-editor">
      <textarea 
        className="w-full p-2 border rounded-md min-h-[100px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <p className="text-sm text-gray-500 mt-1">此处将集成富文本编辑器，目前为普通文本框。</p>
    </div>
  );
};

export default RichTextEditor;
```



### 3.16 `FileUploader.jsx` (文件上传器) 伪代码

一个简单的文件上传组件示例。

```jsx
// src/components/common/FileUploader.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ticketAPI } from '@/lib/api';
import { formatFileSize } from '@/lib/utils';

const FileUploader = ({ onFilesChange, initialFiles = [] }) => {
  const [files, setFiles] = useState(initialFiles);
  const { toast } = useToast();

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length === 0) return;

    const uploadedFilesInfo = [];
    for (const file of selectedFiles) {
      try {
        const mockFileUrl = URL.createObjectURL(file);
        uploadedFilesInfo.push({ 
          id: Date.now() + Math.random(), 
          filename: file.name, 
          url: mockFileUrl, 
          size: file.size 
        });

        toast({
          title: '上传成功',
          description: `文件 ${file.name} 上传成功。`,
        });
      } catch (error) {
        console.error('文件上传失败:', error);
        toast({
          title: '上传失败',
          description: `文件 ${file.name} 上传失败。`,
          variant: 'destructive',
        });
      }
    }
    const newFiles = [...files, ...uploadedFilesInfo];
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const handleRemoveFile = (fileToRemove) => {
    const updatedFiles = files.filter(file => file.id !== fileToRemove.id);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
    if (fileToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(fileToRemove.url);
    }
  };

  return (
    <div className="space-y-2">
      <Input 
        id="file-upload"
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
      <Label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
        <Upload className="w-4 h-4 mr-2" />
        选择文件
      </Label>
      <div className="mt-2">
        {files.map((file) => (
          <div key={file.id} className="flex items-center justify-between bg-gray-100 p-2 rounded-md mb-1">
            <span className="text-sm text-gray-800">{file.filename} ({formatFileSize(file.size)})</span>
            <Button variant="ghost" size="sm" onClick={() => handleRemoveFile(file)}>
              <X className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;
```



### 3.17 `Pagination.jsx` (分页组件) 伪代码

一个通用的分页组件。

```jsx
// src/components/common/Pagination.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({ currentPage, pageSize, totalItems, onPageChange, onPageSizeChange }) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirstPage = () => {
    onPageChange(1);
  };

  const handleLastPage = () => {
    onPageChange(totalPages);
  };

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex-1 text-sm text-gray-700">
        显示 {Math.min((currentPage - 1) * pageSize + 1, totalItems)} 到 {Math.min(currentPage * pageSize, totalItems)} 条，共 {totalItems} 条
      </div>
      <div className="flex items-center space-x-2">
        <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={handleFirstPage}
          disabled={currentPage === 1}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={handleLastPage}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
```



### 3.18 `LoadingSpinner.jsx` (加载指示器) 伪代码

一个简单的加载指示器组件。

```jsx
// src/components/common/LoadingSpinner.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <span className="ml-2 text-lg text-gray-700">加载中...</span>
    </div>
  );
};

export default LoadingSpinner;
```



### 3.19 `Toast.jsx` (统一的Toast提示组件) 伪代码

Shadcn UI 提供了 `useToast` Hook 和 `Toaster` 组件来管理 Toast 提示。通常 `Toaster` 会放在应用的根组件中。

```jsx
// src/components/common/Toast.jsx
const ToastPlaceholder = () => {
  return (
    <div className="fixed bottom-4 right-4 p-3 bg-gray-800 text-white rounded-md shadow-lg z-50">
      Toast 提示将在此处显示 (由 Shadcn UI 的 Toaster 组件管理)
    </div>
  );
};

export default ToastPlaceholder;
```



### 3.20 `useTickets.js` (自定义Hook) 伪代码

一个自定义 Hook，用于封装工单数据获取和管理逻辑，但考虑到 Zustand 已经提供了更强大的全局状态管理，此 Hook 的作用可能被 Zustand Store 部分替代。如果不需要全局状态，可以考虑使用此 Hook。

```jsx
// src/features/tickets/hooks/useTickets.js
import { useState, useEffect, useCallback } from 'react';
import { ticketAPI } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

const useTickets = (initialFilters = {}) => {
  const { toast } = useToast();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        ...filters,
      };
      const data = await ticketAPI.getTickets(params);
      setTickets(data.tickets || []);
      setPagination(prev => ({ 
        ...prev, 
        totalItems: data.total_items, 
        totalPages: data.total_pages 
      }));
    } catch (err) {
      console.error('获取工单失败:', err);
      setError(err);
      toast({
        title: '错误',
        description: '获取工单列表失败。',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.currentPage, pagination.pageSize]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const updatePagination = (newPagination) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  };

  const createTicket = async (ticketData) => {
    setLoading(true);
    try {
      await ticketAPI.createTicket(ticketData);
      toast({
        title: '成功',
        description: '工单创建成功。',
      });
      fetchTickets();
    } catch (err) {
      console.error('创建工单失败:', err);
      toast({
        title: '错误',
        description: '创建工单失败。',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    tickets,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    updatePagination,
    fetchTickets,
    createTicket,
  };
};

export default useTickets;
```



### 3.21 `ticketUtils.js` (工单相关工具函数) 伪代码

将工单特有的辅助函数放在这里。

```jsx
// src/features/tickets/utils/ticketUtils.js

export const calculateSlaStatus = (ticket) => {
  const now = new Date();
  const createdAt = new Date(ticket.created_at);
  const hoursDiff = (now - createdAt) / (1000 * 60 * 60);

  if (ticket.status === 'resolved' || ticket.status === 'closed') {
    return 'on_track';
  }

  if (ticket.priority === 'urgent' && hoursDiff > 4) {
    return 'overdue';
  } else if (ticket.priority === 'high' && hoursDiff > 8) {
    return 'overdue';
  } else if (ticket.priority === 'medium' && hoursDiff > 24) {
    return 'overdue';
  } else if (ticket.priority === 'low' && hoursDiff > 48) {
    return 'overdue';
  }

  if (ticket.priority === 'urgent' && hoursDiff > 3) {
    return 'warning';
  } else if (ticket.priority === 'high' && hoursDiff > 6) {
    return 'warning';
  }

  return 'on_track';
};
```

### 总结

以上伪代码展示了 `Tickets.jsx` 页面及其相关组件在功能增强、用户体验优化、性能提升和代码质量改进后的结构。通过模块化、状态管理、通用组件和工具函数的引入，整个工单管理模块将变得更加健壮、高效和易于维护。实际开发中，需要根据具体的技术栈和项目需求，填充伪代码中的具体实现细节，并进行充分的测试。


