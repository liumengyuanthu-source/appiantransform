import { useEffect, useMemo, useState } from "react";

const apps = [
  { id: "NEO", domain: "Finance / Procurement", users: "606", md: 559, price: 163.34, risk: "critical", disposition: "Strategic BPM", wave: "Dedicated", pattern: "Financial control case", summary: "Material-cost indemnity from claim and negotiation through settlement, implementation, reserves and month-end.", systems: "SAP ECC, WIPS/RPA, EDW, GSDB, FTO, eTracker, INVREQS", decision: "Proceed. Protect with a dedicated lane and a parallel month-end close." },
  { id: "Aftermarket", domain: "Procurement", users: "111", md: 258, price: 74.87, risk: "attention", disposition: "SAP-dependent", wave: "Wave 3", pattern: "External approval portal", summary: "Supplier commercial changes, parts, approvals and iPOS execution.", systems: "iPOS, EDW/GCP, supplier portal", decision: "Confirm the SAP/iPOS roadmap before committing to a full rebuild." },
  { id: "AAM", domain: "Digital", users: "25", md: 114, price: 32.87, risk: "blocked", disposition: "Validate", wave: "Wave 0", pattern: "Internal compliance workflow", summary: "Application accreditation and access-policy approvals.", systems: "No material integration disclosed", decision: "Use only after the Appian export proves scope; current estimate is provisional." },
  { id: "Asset Lifecycle", domain: "Finance", users: "54", md: 143, price: 41.25, risk: "attention", disposition: "SAP-dependent", wave: "Wave 1", pattern: "Asset lifecycle case", summary: "Fixed-asset retirement, marketplace and shipping activity.", systems: "SAP ECC, e-shipper", decision: "Confirm whether SAP Turbo/HANA absorbs the remaining lifecycle." },
  { id: "Build Books", domain: "Manufacturing", users: "TBC", md: 322, price: 92.61, risk: "critical", disposition: "Strategic BPM", wave: "Wave 2", pattern: "Operational record platform", summary: "Prototype build records, stations, checks, sign-off and downloads.", systems: "eCCAR, reporting, file feeds", decision: "Re-estimate performance, mobile and 20–25 year retention; not a simple workflow." },
  { id: "eCCAR", domain: "Quality", users: "3,033", md: 376, price: 108.53, risk: "critical", disposition: "Strategic BPM", wave: "Wave 2", pattern: "Quality issue case", summary: "Manufacturing issues from containment through corrective action and closure.", systems: "Qlik, external CoC, media attachments", decision: "Proceed, but resolve mobile/offline and media-volume assumptions." },
  { id: "House of Craft", domain: "Growth", users: "TBC", md: 142, price: 40.62, risk: "blocked", disposition: "Validate", wave: "Hold", pattern: "Order orchestration", summary: "Bespoke vehicle order fulfilment and traceability.", systems: "Salesforce, Solve Engine", decision: "Do not baseline until valid source material and data-migration scope arrive." },
  { id: "Brexit", domain: "Customs", users: "189", md: 165, price: 47.75, risk: "attention", disposition: "SAP-dependent", wave: "Wave 3", pattern: "Document workflow", summary: "Shipment and customs workflow across suppliers and carriers.", systems: "SAP GTS, Automation Anywhere, SFTP/MFT", decision: "Separate continuity migration from the excluded IQ Bot rebuild." },
  { id: "SOT", domain: "Procurement", users: "445 + ~4,800 ext.", md: 140, price: 40.25, risk: "blocked", disposition: "SAP-dependent", wave: "Wave 3", pattern: "Supplier audit portal", summary: "Supplier tooling statements, validations, evidence and audit checks.", systems: "SAP, QAF, supplier identity", decision: "Move out of Wave 1; external scale and validation complexity are underrepresented." },
  { id: "Chip+", domain: "Procurement", users: "560", md: 353, price: 101.18, risk: "critical", disposition: "Strategic BPM", wave: "Wave 3", pattern: "Reverse-auction marketplace", summary: "Multi-round semiconductor bidding and broker approvals.", systems: "SCIM, FX, external broker identity", decision: "Proceed with custom UI, strict tenant isolation and timer/event controls." },
  { id: "SCIM", domain: "Supply Chain", users: "697", md: 322, price: 92.40, risk: "attention", disposition: "Strategic BPM", wave: "Wave 2", pattern: "Escalation case", summary: "Supply-chain incidents, L0–L3 escalation, analytics and Chip+ linkage.", systems: "GCP/BigQuery, Qlik, Chip+", decision: "Proceed as a reusable operational-case pattern." },
  { id: "Warranty Claims", domain: "Quality", users: "71", md: 158, price: 45.49, risk: "attention", disposition: "SAP-dependent", wave: "Wave 1", pattern: "Assessment work queue", summary: "Assessor prioritisation, claim review and capacity routing.", systems: "SAP Turbo, Vertex AI / ML boundary", decision: "Confirm the SAP target and keep the ML rebuild outside parity scope." },
  { id: "WILMA", domain: "Quality", users: "282 + external", md: 236, price: 68.17, risk: "blocked", disposition: "SAP-dependent", wave: "Wave 3", pattern: "External audit case", summary: "Warranty audits, evidence, reports, debit/credit and appeals.", systems: "SAP, retailers, importers, document evidence", decision: "Re-estimate external users, reporting and field/offline audit needs." },
  { id: "WLTP CO2", domain: "Engineering", users: "46", md: 284, price: 81.52, risk: "blocked", disposition: "Validate", wave: "Hold", pattern: "Engineering data workflow", summary: "CO2 attribute data, trackers, forms and engineering-file coordination.", systems: "Oracle P6, rMFD, SharePoint, AA Bot", decision: "Confirm that it is still live before authorising a rebuild." },
];

const bi = (en, zh) => ({ en, zh });
const neoStages = [
  {
    n: "01", chapter: bi("CLAIM", "立项"), name: bi("Access & recognise", "准入与识别"), owner: bi("Buyer · FBP", "采购员 · FBP"),
    intent: bi("Turn a supplier claim or internally identified opportunity into an owned, correctly classified commercial case.", "将供应商索赔或内部识别的降本机会转化为责任清晰、分类正确的商业 Case。"),
    trigger: bi("Supplier claim, contract, email, verbal notice or an internally recognised opportunity.", "供应商索赔、合同、邮件、口头通知，或内部识别的机会。"),
    before: bi("Access and buyer mapping are arranged through the FBP and support mailboxes. COC, buyer WIPS code, LL6 and LL5 mappings sit outside the case. Risk and Opportunity must be chosen up front; price increases and decreases may require separate linked lines.", "访问权限和采购员映射依赖 FBP 与支持邮箱；COC、采购员 WIPS Code、LL6 与 LL5 映射游离在 Case 之外。必须一开始选择 Risk 或 Opportunity；涨价与降价可能需要创建两条关联记录。"),
    after: bi("ForgeRock sign-on and the organisation master derive buyer, PM and hierarchy. A single intake creates the correct Risk or Opportunity case, preserves linked lines, and makes confidentiality and ownership explicit.", "ForgeRock 登录与组织主数据自动带出采购员、PM 和层级；统一入口创建正确的 Risk 或 Opportunity Case，保留关联记录，并明确机密性与责任归属。"),
    rules: [bi("Confidential claims are visible only to the buyer and PM.", "机密 Case 仅采购员与 PM 可见。"), bi("Raising on behalf of another buyer transfers edit rights to that buyer or their line manager after submission.", "代他人创建后，提交后的编辑权归目标采购员或其直属经理。"), bi("Fiscal year, notification method, GSDB and supplier currency establish the case context.", "财年、通知方式、GSDB 与供应商币种构成 Case 基础上下文。")],
    exceptions: [bi("Access denied or missing buyer mapping", "访问被拒或采购员映射缺失"), bi("Vendor or currency missing in SAP Vendor Master", "SAP Vendor Master 中缺少供应商或币种")],
    systems: "ForgeRock · Org master · GSDB · SAP Vendor Master", evidence: bi("Identity, ownership, confidentiality and source notification", "身份、责任归属、机密性与原始通知证据"),
    migration: [bi("Migrate buyer / PM / hierarchy mappings as governed reference data.", "将采购员、PM 与层级映射迁为受治理的参考数据。"), bi("Preserve Risk / Opportunity classification and linked-line relationships.", "保留 Risk / Opportunity 分类及关联记录关系。")]
  },
  {
    n: "02", chapter: bi("CLAIM", "立项"), name: bi("Build the claim", "构建索赔记录"), owner: bi("Buyer · FBP", "采购员 · FBP"),
    intent: bi("Capture enough commercial truth to forecast, negotiate and later request approval without losing provenance.", "收集足够的商业事实，以支持预测、谈判和后续审批，同时不丢失数据来源。"),
    trigger: bi("An owned Risk or Opportunity case exists.", "已建立责任明确的 Risk 或 Opportunity Case。"),
    before: bi("The buyer moves through multiple forms for transaction type, lever, dates, description, maturity, likelihood, documents, CO2, inflation and Parts or Lump Sum data. Some fields are optional at creation but become mandatory at Mandate or Settlement, so readiness is hard to see.", "采购员需要跨多个表单填写交易类型、Lever、日期、描述、成熟度、可能性、附件、CO2、通胀以及 Parts 或 Lump Sum 数据。部分字段在创建时可选、到 Mandate 或 Settlement 才变为必填，用户难以判断当前就绪度。"),
    after: bi("A guided case reveals fields by transaction type and maturity, shows a live completeness score and explains what is required now, for Mandate and for Settlement. Every manual override records reason, author and version.", "引导式 Case 根据交易类型和成熟度逐步展示字段，实时显示完整度，并说明当前、Mandate 与 Settlement 各自需要什么；每次人工覆盖都记录原因、人员和版本。"),
    rules: [bi("Effective date must respect the WIPS 18-month restriction; implementation date cannot be in the past.", "Effective Date 必须满足 WIPS 的 18 个月限制；Implementation Date 不能早于当前日期。"), bi("Description requires at least 100 characters and must explain supplier, parts, rationale, impact and offsets.", "描述至少 100 字符，并说明供应商、零件、原因、影响与抵消措施。"), bi("Maturity progresses 0 Placeholder → 1 Claim Initiated → 2 Negotiation → 3 Deal Agreed in Principle → 4 Deal Signed.", "成熟度依次为 0 Placeholder → 1 Claim Initiated → 2 Negotiation → 3 Deal Agreed in Principle → 4 Deal Signed。"), bi("Parts or Lump Sum data become mandatory before an approval Mandate.", "发起正式 Mandate 前，Parts 或 Lump Sum 数据必须完整。")],
    exceptions: [bi("Missing parts or current-price mismatch", "零件缺失或当前价格不一致"), bi("Signed evidence not yet available", "签署证据尚未取得")],
    systems: "NEO forms · SAP part data · Document service", evidence: bi("Field completeness, maturity history, attachments and value lineage", "字段完整度、成熟度历史、附件与金额来源"),
    migration: [bi("Map every field, conditional rule and maturity dependency—not only the visible form.", "迁移必须映射所有字段、条件规则与成熟度依赖，而不只是可见表单。"), bi("Carry attachments, comments and prior versions with their authorship.", "附件、评论和历史版本必须连同作者信息一起迁移。")]
  },
  {
    n: "03", chapter: bi("VALUE", "测算"), name: bi("Quantify & negotiate", "量化与谈判"), owner: bi("Buyer · Supplier · FBP", "采购员 · 供应商 · FBP"),
    intent: bi("Establish the supplier ask, expected settlement and forecast impact on a defendable calculation basis.", "在可辩护的计算基础上明确供应商诉求、预期结算金额和预测影响。"),
    trigger: bi("Claim values, parts or Lump Sum data are available and negotiation begins.", "索赔金额、Parts 或 Lump Sum 数据已具备并开始谈判。"),
    before: bi("SAP prices and the daily Frozen Turnover file calculate impact as part-price delta × FTO volume. FTO must match fiscal year, part, vendor and plant / carline; one mismatch returns no volume. Missing parts and price errors are corrected through Excel bulk upload, Vendor Master, MIA or an FBP-led FTO refresh after the 3pm update.", "SAP 价格与每日 Frozen Turnover 文件按“零件价差 × FTO Volume”计算影响。FTO 必须同时匹配财年、零件、供应商和工厂/车型；任一不匹配都会返回无 Volume。缺失零件和价格错误通过 Excel Bulk Upload、Vendor Master、MIA 或 FBP 在每日 15:00 更新后执行 FTO Refresh 来处理。"),
    after: bi("A calculation service shows supplier Gross Claim, Annual Forecast, price source, FTO freshness and every matched or unmatched key. Bulk uploads are prevalidated; missing data becomes an owned work item rather than an invisible zero.", "计算服务同时展示供应商 Gross Claim、Annual Forecast、价格来源、FTO 新鲜度及每个匹配/未匹配键。Bulk Upload 在提交前校验；缺失数据转化为有责任人的工作项，而不是不可见的零值。"),
    rules: [bi("Gross Claim is the supplier request; Annual Forecast is the intended settlement estimate.", "Gross Claim 是供应商诉求；Annual Forecast 是预期结算估计。"), bi("FTO is also the basis for yearly targets and approval values.", "FTO 同时用于年度目标和审批金额。"), bi("Likelihood is Contractual / Probable / Possible / Remote / Closed.", "Likelihood 分为 Contractual / Probable / Possible / Remote / Closed。"), bi("Runout dates and plant applicability change the calculated exposure.", "Runout Date 与适用工厂会改变测算敞口。")],
    exceptions: [bi("No FTO volume for one of four matching keys", "四个匹配键中任一不匹配导致无 FTO Volume"), bi("SAP / WIPS current price mismatch or BODS / VCARS issue", "SAP / WIPS 当前价格不一致或 BODS / VCARS 问题")],
    systems: "SAP ECC · WIPS · FTO · Excel bulk upload", evidence: bi("Price lineage, FTO timestamp, matched keys and approved overrides", "价格来源、FTO 时间戳、匹配键与已批准覆盖"),
    migration: [bi("Rebuild calculations as versioned domain rules, not embedded workflow expressions.", "将计算重建为版本化领域规则，而不是嵌入流程表达式。"), bi("Reconcile every migrated value against a golden Appian case.", "每个迁移金额都必须与 Appian 黄金案例对账。")]
  },
  {
    n: "04", chapter: bi("DECIDE", "决策"), name: bi("Mandate the deal", "授权谈判边界"), owner: bi("FBP · GPF · Procurement · Clearing House", "FBP · GPF · Procurement · Clearing House"),
    intent: bi("Approve the boundary within which the buyer may negotiate and sign—not the final settlement itself.", "批准采购员可进行谈判和签署的边界，而不是批准最终结算本身。"),
    trigger: bi("Guidance, Review or formal Mandate is needed.", "需要 Guidance、Review 或正式 Mandate。"),
    before: bi("Risks may request Guidance or Review during Claim Initiated / Negotiation, but formal approval requires Deal Agreed in Principle plus complete Parts or Lump Sum values. Opportunities may skip Mandate unless Clearing House input is wanted. DoA, forum agenda and acknowledgements are handled across the claim and approval request; a rejected or cancelled request is reopened through comments and may create a new request line.", "Risk 可在 Claim Initiated / Negotiation 阶段请求 Guidance 或 Review，但正式批准必须达到 Deal Agreed in Principle 且 Parts 或 Lump Sum 金额完整。Opportunity 可跳过 Mandate，除非需要 Clearing House 介入。DoA、Forum Agenda 与确认信息分散在 Case 和 Approval Request 中；被拒或取消后需要依据评论重新发起，并可能生成新的 Request Line。"),
    after: bi("Flowable BPMN orchestrates the approval journey and DMN resolves DoA, forum and segregation-of-duties. One versioned decision pack holds Problem Statement, request detail, REDS, GT&C change, risk factor, category, audit and Mandate values. Returns identify exact fields and deltas.", "Flowable BPMN 编排审批旅程，DMN 计算 DoA、Forum 与职责分离。一份版本化 Decision Pack 统一承载 Problem Statement、请求详情、REDS、GT&C 变更、Main Risk、Category、Audit 与 Mandate Values；退回时明确指出字段与版本差异。"),
    rules: [bi("Guidance = advice; Review = discuss a potential deal; Mandate = approval to get the deal signed.", "Guidance = 获取建议；Review = 讨论潜在交易；Mandate = 获得签署交易的授权。"), bi("Problem Statement and request detail each require at least 100 characters.", "Problem Statement 与请求详情均至少 100 字符。"), bi("Audit status is Complete / Required / Not Applicable.", "Audit 状态为 Complete / Required / Not Applicable。"), bi("Mandate value is the ceiling for the later Settlement control.", "Mandate Value 是后续 Settlement 的控制上限。")],
    exceptions: [bi("Mandate rejected or sent back with comments", "Mandate 被拒或带评论退回"), bi("DoA cancelled or forum evidence incomplete", "DoA 被取消或 Forum 证据不完整")],
    systems: "Flowable BPMN / DMN · Org master · Notification service", evidence: bi("DoA route, acknowledgements, agenda, decision and rejection reason", "DoA 路由、确认、议程、决策与拒绝原因"),
    migration: [bi("Preserve the difference between Guidance, Review and Mandate.", "必须保留 Guidance、Review 与 Mandate 的业务差异。"), bi("Migrate approval lineage, including superseded requests and rejection comments.", "迁移完整审批链，包括被替代的请求与拒绝评论。")]
  },
  {
    n: "05", chapter: bi("DECIDE", "决策"), name: bi("Approve settlement", "批准最终结算"), owner: bi("Buyer · FBP · Approvers", "采购员 · FBP · 审批人"),
    intent: bi("Confirm the signed commercial agreement is executable and still inside the approved Mandate boundary.", "确认已签商业协议可执行，并且仍在已批准的 Mandate 边界内。"),
    trigger: bi("The deal is signed and ready for execution.", "交易已签署并准备执行。"),
    before: bi("The buyer changes Maturity to Deal Signed and Likelihood to Contractual, attaches the signed agreement, then submits Settlement. Submission locks the line; FBP rejection unlocks it. If an error is found after approval, the current process may require cancellation, closure and creation of a new line. A missing signed agreement needs an explicit Clearing House justification.", "采购员将 Maturity 改为 Deal Signed、Likelihood 改为 Contractual，上传已签协议后提交 Settlement。提交即锁定记录；FBP 拒绝后解锁。若批准后发现错误，当前流程可能只能取消、关闭并重建新记录。无已签协议时，必须提供 Clearing House 已同意的说明。"),
    after: bi("Settlement is a versioned state transition. The service compares signed agreement, Settlement values and Mandate ceiling; material variance triggers re-authorisation. Rejection returns only the affected fields, while approved evidence remains immutable.", "Settlement 成为版本化状态转换。服务比较已签协议、Settlement 金额与 Mandate Ceiling；重大差异自动触发重新授权。拒绝只退回受影响字段，已批准证据保持不可变。"),
    rules: [bi("Settlement is not Mandate: Mandate approves negotiation headroom; Settlement approves the final executable value.", "Settlement 不等于 Mandate：Mandate 批准谈判空间，Settlement 批准最终可执行金额。"), bi("The line is locked while Settlement is in approval.", "Settlement 审批期间记录必须锁定。"), bi("Signed agreement is required unless an approved exception is recorded.", "必须有已签协议，除非记录了批准的例外。")],
    exceptions: [bi("Settlement rejected and re-requested", "Settlement 被拒后重新申请"), bi("Approved value differs from signed agreement or Mandate", "批准金额与签署协议或 Mandate 不一致")],
    systems: "Flowable · Document service · Audit store", evidence: bi("Signed agreement, value comparison, approval decision and lock history", "已签协议、金额比较、审批决策与锁定历史"),
    migration: [bi("Migrate in-flight locked requests without reopening commercial values.", "迁移在途锁定请求时不得重新开放商业金额。"), bi("Define deterministic rules for cancelled, rejected and superseded lines.", "为 Cancelled、Rejected 与 Superseded 记录定义确定性规则。")]
  },
  {
    n: "06", chapter: bi("EXECUTE", "执行"), name: bi("Implement transaction", "执行交易"), owner: bi("CBSL · GFS · Buyer · RPA", "CBSL · GFS · 采购员 · RPA"),
    intent: bi("Turn the approved commercial agreement into the correct SAP / WIPS transaction exactly once.", "将已批准的商业协议准确且仅一次地转化为正确的 SAP / WIPS 交易。"),
    trigger: bi("Settlement is approved and marked complete.", "Settlement 已批准并 Mark as Complete。"),
    before: bi("Implementation branches by transaction type. Price Claim triggers the WIPS robot and second WIPS approval; AMM, Price Correction and Resource create CBSL tasks; EMC / BAC / TD container contracts are checked by GFS in SAP; LSP payable / receivable may use bots, buyer PO tasks, balance checks, GFS review or manual invoice through eTracker and INVREQS. RPA failure creates a buyer task that can be retried or sent to CBSL for manual action.", "实施按交易类型分流。Price Claim 触发 WIPS Robot 及第二次 WIPS Approval；AMM、Price Correction 与 Resource 创建 CBSL 任务；EMC / BAC / TD Container Contract 由 GFS 在 SAP 检查；LSP Payable / Receivable 可能经过 Bot、采购员 PO 任务、余额检查、GFS Review，或通过 eTracker 与 INVREQS 走 Manual Invoice。RPA 失败会创建采购员任务，可重试或转 CBSL 人工处理。"),
    after: bi("Each transaction type is a reusable Flowable subprocess with an idempotency key and correlation ID. Technical retry, business rejection and human takeover are separate states. The case shows the downstream document, owner, attempt history and reconciliation result.", "每种交易类型都是可复用的 Flowable Subprocess，并带有 Idempotency Key 与 Correlation ID。技术重试、业务拒绝和人工接管被拆成独立状态；Case 展示下游单据、责任人、尝试历史和对账结果。"),
    rules: [bi("No duplicate SAP, WIPS, PO or invoice posting.", "不得重复创建 SAP、WIPS、PO 或 Invoice 交易。"), bi("Robot success alone is insufficient; downstream approval and reconciliation complete implementation.", "Robot 成功并不代表完成；必须完成下游审批与对账。"), bi("Manual CBSL or GFS action must retain the same NEO correlation and approval evidence.", "CBSL 或 GFS 人工处理必须保留同一 NEO 关联标识和审批证据。")],
    exceptions: [bi("RPA Error / missing part / price mismatch", "RPA Error / 零件缺失 / 价格不一致"), bi("SAP contract or PO rejected", "SAP Contract 或 PO 被拒"), bi("Insufficient vendor balance or manual invoice reversal", "供应商余额不足或 Manual Invoice 冲销")],
    systems: "SAP ECC · WIPS / RPA · CBSL · GFS · eTracker · INVREQS", evidence: bi("Correlation ID, downstream document, retry / takeover history and reconciliation", "关联 ID、下游单据、重试/接管历史与对账"),
    migration: [bi("Model transaction-type variants explicitly; do not force one generic happy path.", "必须显式建模交易类型分支，不能强行套用一条通用 Happy Path。"), bi("Prove idempotency and manual-replay controls before production.", "上线前必须验证幂等和人工重放控制。")]
  },
  {
    n: "07", chapter: bi("CLOSE", "关账"), name: bi("Reserve & month-end", "准备金与月结"), owner: bi("Material Cost Analyst · FBP", "Material Cost Analyst · FBP"),
    intent: bi("Calculate and post a complete, explainable reserve for every open Risk and Opportunity at month-end.", "为每个未结 Risk 与 Opportunity 计算并过账完整、可解释的月末准备金。"),
    trigger: bi("WD-6 month-end cycle begins; PO payment, GR and scheduling feeds are due.", "WD-6 月结周期开始，需要接收 PO Payment、GR 与 Scheduling 数据。"),
    before: bi("Material Cost Analysts upload SAP PO payments and monitor Processing until Ingested. Purchasing document numbers link payments to NEO IDs. Daily WD-6 to WD-1 PO Payment, GR and scheduling feeds generate draft reserves; FBPs review POA detail and amend unimplemented claim values. On WD1, final feeds, journal template, park / post, Teams snapshot, memo lines and post-close thresholds are coordinated across NEO, Excel, SAP, EDW and Teams.", "Material Cost Analyst 上传 SAP PO Payment，并监控 Processing 直至 Ingested；Purchasing Document Number 将付款关联到 NEO ID。WD-6 至 WD-1 每日 PO Payment、GR 与 Scheduling Feed 生成 Draft Reserve；FBP 依据 POA Detail 复核并调整未实施索赔金额。WD1 最终 Feed、Journal Template、Park/Post、Teams Snapshot、Memo Line 与 Post-close Threshold 分散在 NEO、Excel、SAP、EDW 和 Teams 中协同。"),
    after: bi("A month-end control centre shows each feed's timestamp, row count, control total and rejected rows; draft and final reserve versions; FBP review; journal generation; Teams publication and post-close exceptions. Every NEO ID drills into its matched PO Payment rows.", "月结控制中心展示每个 Feed 的时间戳、行数、控制总额与拒绝行，以及 Draft/Final Reserve 版本、FBP Review、Journal 生成、Teams 发布和 Post-close Exception。每个 NEO ID 可下钻到匹配的 PO Payment 明细。"),
    rules: [bi("WD-6 to WD-1 is the protected review window; final WD1 activity is time-bound.", "WD-6 至 WD-1 是受保护的复核窗口；WD1 最终活动有严格时点。"), bi("PO Payment, GR and scheduling data must reconcile before journal sign-off.", "Journal Sign-off 前，PO Payment、GR 与 Scheduling 数据必须完成对账。"), bi("Adjustments after the WD1 journal threshold require controlled manual posting.", "超过 WD1 Journal 阈值后的调整必须通过受控人工过账。")],
    exceptions: [bi("Feed failed, wrong layout or status not Ingested", "Feed 失败、格式错误或状态未到 Ingested"), bi("Unmatched NEO ID / purchasing document", "NEO ID 与 Purchasing Document 未匹配"), bi("Final reserve variance above post-close threshold", "Final Reserve 差异超过 Post-close Threshold")],
    systems: "SAP ECC · EDW · NEO · Excel · Teams", evidence: bi("Feed control totals, reserve versions, FBP review and journal sign-off", "Feed 控制总额、准备金版本、FBP 复核与 Journal Sign-off"),
    migration: [bi("Rehearse two production-like month-end cycles and one full parallel close.", "完成两次类生产月结演练和一次完整并行月结。"), bi("Cut over only with zero unexplained reserve variance.", "只有不可解释的准备金差异为零时才能切换。")]
  },
  {
    n: "08", chapter: bi("CLOSE", "关账"), name: bi("Reconcile & close", "对账与关闭"), owner: bi("Finance · Audit · Service Owner", "财务 · 审计 · 服务负责人"),
    intent: bi("Separate commercial agreement, technical implementation, financial reconciliation and legal closure.", "明确区分商业达成、技术实施、财务对账和法律关闭。"),
    trigger: bi("Downstream transaction and month-end reserve activity are complete.", "下游交易与月结准备金活动已完成。"),
    before: bi("Workflow, finance and closure statuses can be interpreted as one end state. A claim may be commercially agreed or technically implemented while payments, reserves, memo lines or reversal evidence remain unresolved.", "Workflow、Finance 与 Closure Status 容易被理解为同一个终态。一个 Case 可能商业上已达成或技术上已实施，但付款、准备金、Memo Line 或冲销证据仍未解决。"),
    after: bi("Commercially Agreed, Settlement Approved, Implemented, Financially Reconciled and Closed are independent gates. Closure requires zero balance difference, all downstream evidence, retention classification and an immutable audit package.", "Commercially Agreed、Settlement Approved、Implemented、Financially Reconciled 与 Closed 成为独立关口。关闭必须满足余额差异为零、下游证据齐全、保留策略明确，并生成不可变审计包。"),
    rules: [bi("Implemented does not mean financially complete.", "Implemented 不代表财务完成。"), bi("Closed requires reconciliation and retention evidence, not only a workflow status.", "Closed 必须具备对账和保留证据，不能只依赖 Workflow Status。"), bi("Legal hold overrides normal archive deletion.", "Legal Hold 优先于常规归档删除策略。")],
    exceptions: [bi("Residual balance, unmatched payment or open memo line", "余额残留、未匹配付款或开放 Memo Line"), bi("Downstream reversal after apparent implementation", "表面已实施后发生下游冲销")],
    systems: "Reconciliation service · Audit store · Historical archive", evidence: bi("Zero-balance proof, status lineage, retention and immutable audit package", "零余额证明、状态链路、保留策略与不可变审计包"),
    migration: [bi("Map Appian workflow status and finance status separately for every in-flight case.", "必须为每个在途 Case 分别映射 Appian Workflow Status 与 Finance Status。"), bi("Retain Appian read-only until post-cutover reconciliation is accepted.", "在切换后对账验收前，保留 Appian 只读访问。")]
  }
];

const architecture = [
  { key: "01", name: "Channels & Identity", tone: "teal", items: ["React + TypeScript applications", "ForgeRock workforce and partner SSO", "Supplier / broker federated identity", "BeyondTrust privileged access"], rule: "Users authenticate once; authorisation is enforced server-side on every call." },
  { key: "02", name: "14 Bounded Applications", tone: "teal", items: ["Independent domain APIs and schemas", "Shared design system and task inbox", "Per-app release and ownership", "No cross-application database calls"], rule: "Share platform capabilities, not business tables or domain logic." },
  { key: "03", name: "Workflow & Control", tone: "teal", items: ["Flowable BPMN / DMN / CMMN", "DoA, SoD, timers and escalation", "Versioned process definitions", "Task, approval and notification APIs"], rule: "Flowable owns orchestration; domain services own calculations and invariants." },
  { key: "04", name: "Domain & Data", tone: "dark", items: ["Spring services", "PostgreSQL per-app schema", "S3 evidence and attachments", "Immutable audit and read-only archive"], rule: "Operational, document, audit, analytics and historical data have different lifecycles." },
  { key: "05", name: "Integration", tone: "amber", items: ["JLR APIM and SAP API platform", "Idempotency, outbox, retry and DLQ", "Reconciliation and manual replay", "REST, OData, RFC/BAPI, SFTP, mTLS"], rule: "No point-to-point integration; every transaction has a contract and correlation ID." },
  { key: "06", name: "UK Cloud & Operations", tone: "dark", items: ["AWS UK EKS, RDS/Aurora, S3, MQ", "KMS, Secrets, CloudTrail and GuardDuty", "Pipeline-only deployment", "Regional SIEM / Splunk and runbooks"], rule: "Production data remains in the approved UK boundary with time-boxed support access." },
];

const risks = [
  { id: "R01", state: "blocked", area: "Scope", title: "AAM and House of Craft source evidence is incomplete", owner: "JLR Platform Owner", action: "Deliver valid exports, source and SME walkthroughs before baselining." },
  { id: "R02", state: "blocked", area: "Portfolio", title: "Six applications overlap a future SAP roadmap", owner: "Steering Committee", action: "Decide full rebuild, bridge, direct-to-SAP or retire for each application." },
  { id: "R03", state: "blocked", area: "Scale", title: "SOT and WILMA external users are not in the sizing basis", owner: "Business + Architect", action: "Confirm identities, concurrency, geography and portal support model." },
  { id: "R04", state: "attention", area: "Technology", title: "Foundation stack and production target versions differ", owner: "Chief Architect", action: "Freeze the POC baseline and the controlled upgrade path." },
  { id: "R05", state: "attention", area: "NEO", title: "Month-end control cannot tolerate state or value variance", owner: "NEO Product Owner", action: "Complete two rehearsals and a full parallel close before cutover." },
  { id: "R06", state: "attention", area: "NFR", title: "Build Books throughput and 20–25 year retention need proof", owner: "Architecture Lead", action: "Run performance and archive POCs before final design authority." },
  { id: "R07", state: "attention", area: "Mobile", title: "Offline capability is excluded for field-oriented applications", owner: "Business Owners", action: "Decide whether eCCAR, Build Books and WILMA require offline operation." },
  { id: "R08", state: "attention", area: "Security", title: "Pen test and UK/China support boundary remain open", owner: "JLR Security / DPO", action: "Approve boundary, test scope and production-access operating model." },
  { id: "R09", state: "normal", area: "Commercial", title: "Bottom-up Phase 1 baseline is transparent", owner: "Programme Director", action: "Reconcile stale 8-app assumptions and correct the workbook formula error." },
  { id: "R10", state: "normal", area: "Ownership", title: "JLR receives application and foundation source", owner: "Commercial Lead", action: "Make source acceptance, SBOM and reproducible build contractual gates." },
];

const modules = [
  ["01", "Project Overview"], ["02", "14-App Portfolio"], ["03", "NEO Journey"], ["04", "Target Architecture"], ["05", "Migration Factory"],
  ["06", "Data & Integration"], ["07", "Quality & Cutover"], ["08", "AI & Token Control"], ["09", "Commercial & Resources"], ["10", "Risk & Decisions"], ["11", "Report Center"],
];

const stateLabels = { normal: "Controlled", attention: "Needs Attention", blocked: "Blocked", critical: "Critical" };

const zhPairs = [
  ["PROJECT CONTROL STUDIO", "项目控制台"], ["Project Overview", "项目总览"], ["14-App Portfolio", "14 应用组合"], ["NEO Journey", "NEO 业务旅程"], ["Target Architecture", "目标架构"], ["Migration Factory", "迁移工厂"], ["Data & Integration", "数据与集成"], ["Quality & Cutover", "质量与切换"], ["AI & Token Control", "AI 与 Token 控制"], ["Commercial & Resources", "商务与资源"], ["Risk & Decisions", "风险与决策"], ["Report Center", "报告中心"],
  ["PROJECT OVERVIEW", "项目总览"], ["PORTFOLIO CONTROL", "应用组合控制"], ["NEO CONTROL JOURNEY", "NEO 控制旅程"], ["TARGET ARCHITECTURE", "目标架构"], ["MIGRATION FACTORY", "迁移工厂"], ["DATA & INTEGRATION", "数据与集成"], ["QUALITY & CUTOVER", "质量与切换"], ["COMMERCIAL & RESOURCES", "商务与资源"], ["RISK & DECISIONS", "风险与决策"], ["REPORT CENTER", "报告中心"],
  ["Appian Exit Control", "Appian 退出控制"], ["One evidence-led view of portfolio disposition, NEO protection, migration readiness and the 31 March 2027 deadline.", "以证据为基础，统一管理应用处置、NEO 保护、迁移就绪度和 2027 年 3 月 31 日截止日期。"],
  ["In-scope applications", "范围内应用"], ["Implementation baseline", "实施基线"], ["Phase 1 price", "第一阶段报价"], ["Mandatory cutover", "强制切换日期"], ["Excluding VAT · bottom-up quotation", "不含增值税 · 自下而上报价"], ["No post-expiry reliance on Appian", "到期后不得继续依赖 Appian"],
  ["5 strategic · 6 SAP-dependent · 3 validate / hold", "5 个战略应用 · 6 个依赖 SAP 路线 · 3 个待验证/暂缓"], ["3,572 application MD + 800 foundation MD", "3,572 应用人日 + 800 平台底座人日"],
  ["Exception-driven worklist", "异常驱动工作清单"], ["Only decisions that can change scope, safety, time or cost are shown.", "只显示会改变范围、安全、工期或成本的决策。"], ["Programme control journey", "项目控制旅程"], ["Release is governed by evidence, not dates alone.", "发布由证据控制，而不是只看日期。"], ["What success means", "成功标准"], ["Executive outcome", "管理层结果"], ["Business outcome", "业务结果"], ["Technology outcome", "技术结果"],
  ["Appian can be decommissioned on time", "Appian 能按时退役"], ["NEO month-end reconciles to zero", "NEO 月结差异归零"], ["Every application has a signed disposition", "每个应用都有正式批准的处置结论"], ["JLR owns code, data and runbooks", "JLR 拥有代码、数据和运行手册"], ["Users continue in-flight work without rekeying", "用户无需重新录入即可继续处理在途事项"], ["Approval and financial controls remain intact", "审批和财务控制保持完整"], ["External partners retain supported access", "外部合作伙伴获得持续支持的访问"], ["Journey improvements wait until parity is safe", "在等价迁移安全后再优化业务旅程"], ["BPMN/DMN and application code are versioned", "BPMN/DMN 与应用代码全部版本化"], ["Interfaces are idempotent and reconciled", "接口具备幂等和对账能力"], ["UK production boundary is enforced", "英国生产数据边界得到强制执行"], ["SBOM, tests and runbooks gate production", "SBOM、测试和运行手册共同控制生产准入"],
  ["Mobilise", "启动"], ["Prove", "验证"], ["Migrate", "迁移"], ["Rehearse", "演练"], ["Cut over", "切换"], ["Stabilise", "稳定"], ["Exports, source, SMEs", "导出包、源码、业务专家"], ["Foundation + real POC", "平台底座 + 真实 POC"], ["Three waves + NEO lane", "三波次 + NEO 专属轨道"], ["Data, integration, UAT", "数据、集成、UAT"], ["No month-end change", "月结期间不切换"], ["Hypercare + ownership", "重点保障 + 运营移交"],
  ["14 Applications, Five Decisions", "14 个应用，五类决策"], ["Treat each application by business future, architecture pattern and migration evidence — not by one blanket template.", "按照业务未来、架构模式和迁移证据分别处理每个应用，而不是采用一套模板。"], ["Strategic BPM", "战略 BPM"], ["SAP-dependent", "依赖 SAP 路线"], ["Validate / hold", "验证 / 暂缓"], ["Known internal users", "已知内部用户"], ["Continuity scope must match the SAP roadmap", "连续性范围必须与 SAP 路线一致"], ["Excludes two unknown apps and external populations", "不含两个用户数未知的应用及外部用户"], ["DOMAIN", "业务域"], ["DISPOSITION", "处置方式"], ["applications shown", "个应用"], ["Application", "应用"], ["Users", "用户"], ["Price", "价格"], ["Decision", "决策"], ["SELECTED APPLICATION", "当前应用"], ["Architecture pattern", "架构模式"], ["Wave", "波次"], ["Systems", "关联系统"], ["Control decision", "控制结论"], ["Quoted price", "报价"], ["person-days", "人日"], ["Validate", "待验证"],
  ["From Supplier Claim to Month-end", "从供应商索赔到月结"], ["NEO is the programme's control-critical reference application: a commercial case, multi-system transaction and financial close in one journey.", "NEO 是本项目的关键控制应用：一条旅程同时覆盖商业事项、多系统交易与财务关账。"], ["Measured effort", "测算工作量"], ["Known touchpoints", "已知触点"], ["Cutover rule", "切换规则"], ["Across 9 system and data families", "覆盖 9 类系统与数据"], ["Zero variance", "零差异"], ["Parallel close before production switch", "正式切换前完成并行月结"], ["Before · Appian today", "Before · 当前 Appian"], ["After · Flowable target", "After · Flowable 目标"], ["CURRENT EXPERIENCE", "当前体验"], ["TARGET EXPERIENCE", "目标体验"], ["PRIMARY OWNER", "主要责任人"], ["CONTROL EVIDENCE", "控制证据"], ["SYSTEMS", "系统"], ["Design rule", "设计原则"], ["What changes — and what stays authoritative.", "哪些会改变，哪些仍是权威来源。"], ["Mandate approves the negotiation boundary.", "Mandate 批准谈判边界。"], ["Settlement approves the final agreement for execution.", "Settlement 批准最终协议进入执行。"], ["Implemented is not Closed until finance is reconciled.", "只有完成财务对账，Implemented 才能转为 Closed。"],
  ["Recognise", "识别事项"], ["Create & enrich", "创建与补充"], ["Calculate & negotiate", "测算与谈判"], ["Mandate", "授权"], ["Settlement", "结算批准"], ["Implement", "实施"], ["Reserve & close", "准备金与月结"], ["Reconcile & archive", "对账与归档"], ["Buyer", "采购员"], ["Supplier", "供应商"], ["Finance / Audit", "财务 / 审计"],
  ["One Platform, 14 Bounded Applications", "一个平台，14 个边界清晰的应用"], ["The target shares identity, workflow, audit, integration and operations — while keeping every application's business logic and data boundary explicit.", "目标平台共享身份、流程、审计、集成和运维能力，同时明确每个应用的业务逻辑与数据边界。"], ["ARCHITECTURE RULE", "架构原则"], ["Application patterns", "应用模式"], ["The migration factory must support four different shapes.", "迁移工厂必须支持四种不同的应用形态。"], ["Financial control", "财务控制型"], ["External collaboration", "外部协作型"], ["Operational case", "运营 Case 型"], ["Task & data workflow", "任务与数据流程型"],
  ["Prove, Scale, Rehearse, Cut Over", "验证、扩展、演练、切换"], ["The factory is released by evidence: exports and source, signed specifications, golden-case parity, reconciled data and production readiness.", "迁移工厂以证据放行为原则：导出包与源码、签署规格、黄金案例等价、数据对账和生产就绪度。"], ["Quoted wave plan", "报价波次"], ["Control recommendation", "控制建议"], ["Lane", "轨道"], ["Applications", "应用"], ["Control view", "控制判断"], ["Factory acceptance chain", "迁移工厂验收链"], ["Machine acceleration never removes accountable human gates.", "机器加速不能替代有明确责任人的人工关口。"], ["Evidence in hand", "证据齐备"], ["Specification signed", "规格已签署"], ["POC proven", "POC 已验证"], ["Wave ready", "波次就绪"], ["Cutover ready", "切换就绪"], ["Accepted", "正式验收"],
  ["Contracts Before Connections", "先定义契约，再建立连接"], ["Every interface needs an owner, schema, authentication model, frequency, idempotency rule, failure path and reconciliation control.", "每个接口都必须明确责任人、数据结构、认证方式、频率、幂等规则、失败路径和对账控制。"], ["System families", "系统类别"], ["NEO touchpoints", "NEO 触点"], ["Migration tiers", "迁移等级"], ["Point-to-point", "点对点集成"], ["Non-negotiable controls", "不可妥协的控制"], ["Family", "类别"], ["Contract", "接口契约"],
  ["No Production Without Evidence", "没有证据，不进生产"], ["Functional parity is necessary but insufficient: data, security, performance, accessibility, resilience and operational ownership all gate production.", "功能等价是必要条件，但还不够；数据、安全、性能、无障碍、韧性和运维责任都必须通过生产准入。"], ["Data rehearsals", "数据演练"], ["NEO parallel close", "NEO 并行月结"], ["Critical defects", "严重缺陷"], ["Month-end cutover", "月结期间切换"], ["Production admission matrix", "生产准入矩阵"], ["Each gate requires named evidence and an accountable approver.", "每个关口都需要明确的证据和有责任的批准人。"], ["NEO protected cutover", "NEO 受保护切换"], ["Business and financial state move together.", "业务状态与财务状态必须同步迁移。"], ["Prohibited", "禁止"],
  ["Know What the Price Buys", "明确价格购买了什么"], ["The quotation is a delivery baseline, not proof of five-year value. The business case must compare Appian renewal with migration, cloud, operations and future change.", "报价是交付基线，并不能证明五年价值；商业论证必须比较 Appian 续约与迁移、云、运维及后续变更成本。"], ["Phase 1 excl. VAT", "第一阶段不含税"], ["Foundation", "共享底座"], ["Annual run baseline", "年度运行基线"], ["Foundation allocation", "底座工作量分配"], ["Shared scope that every application depends on.", "所有应用共同依赖的共享范围。"], ["Commercial control questions", "商务控制问题"], ["Resolve before an unconditional fixed commitment.", "在无条件固定承诺前必须解决。"], ["Top quoted applications", "报价最高的应用"], ["Control note", "控制说明"],
  ["Escalate Decisions, Not Noise", "升级决策，而不是噪音"], ["Every open risk carries an owner, action and decision boundary. Missing evidence stays visible; delivery does not silently absorb uncertainty.", "每个开放风险都必须有责任人、行动和决策边界；缺失证据保持可见，交付团队不能静默吸收不确定性。"], ["All", "全部"], ["Steering decisions required now", "当前需要 Steering Committee 决策"], ["These decisions materially change scope, cost or delivery safety.", "这些决策会实质改变范围、成本或交付安全。"],
  ["One Baseline, Multiple Conversations", "一套基线，多种沟通"], ["Generate each report from the same portfolio, risk, evidence and decision data — without maintaining parallel slide narratives.", "所有报告都从同一套应用组合、风险、证据和决策数据生成，避免维护多套平行汇报。"], ["REPORT PACK", "报告包"], ["Print / PDF", "打印 / PDF"], ["Outcome", "目标结果"], ["Critical path", "关键路径"], ["Escalation", "升级事项"], ["Internal working control view", "内部项目控制视图"],
  ["A supplier claim, contract, email or internal signal identifies a cost risk or opportunity. Access and buyer mappings may be arranged outside NEO.", "供应商索赔、合同、邮件或内部信号触发成本风险或机会；访问权限与采购员映射可能在 NEO 之外维护。"],
  ["A role-based intake starts the correct Risk or Opportunity case and confirms buyer, supplier and organisational ownership.", "基于角色的入口自动启动正确的风险或机会 Case，并确认采购员、供应商和组织归属。"],
  ["The buyer enters GSDB, fiscal year, transaction type, lever, maturity, likelihood and evidence across multiple forms.", "采购员需要跨多个表单录入 GSDB、财年、交易类型、杠杆、成熟度、可能性和证据。"],
  ["A guided case reveals fields progressively, scores completeness and records every manual override with reason and provenance.", "引导式 Case 按需展示字段、评估完整度，并记录每次人工覆盖的原因和来源。"],
  ["SAP prices and the daily FTO file calculate exposure. Missing parts or stale prices are corrected through Excel and offline follow-up.", "SAP 价格与每日 FTO 文件用于计算敞口；缺失零件或过期价格通过 Excel 和线下跟进修正。"],
  ["Live freshness indicators, prevalidated bulk upload and calculation services show supplier ask, forecast impact and negotiation history together.", "实时新鲜度、预校验批量上传和计算服务，将供应商诉求、预测影响及谈判历史统一呈现。"],
  ["Guidance, Review or Mandate is routed through DoA. Users navigate between claim, approval and comments when items are returned.", "Guidance、Review 或 Mandate 按 DoA 路由；退回时用户需要在索赔、审批和评论之间切换。"],
  ["Flowable BPMN and DMN build one decision pack, route by DoA and show exact returned fields and version differences.", "Flowable BPMN 与 DMN 生成统一决策包，按 DoA 路由，并明确展示退回字段与版本差异。"],
  ["The signed agreement is attached and a settlement request is submitted; rejected requests are manually amended and resubmitted.", "上传签署协议后提交结算请求；被拒请求需要人工修改并重新提交。"],
  ["The service compares settlement, mandate and signed agreement values and automatically triggers re-authorisation when thresholds are exceeded.", "服务自动比较结算、授权和已签协议金额，超过阈值时触发重新授权。"],
  ["POA, LSP, price correction, resource, contract or invoice paths move through SAP, WIPS, robots and manual teams.", "POA、LSP、价格修正、资源、合同或发票路径跨 SAP、WIPS、机器人和人工团队流转。"],
  ["Each transaction type is a controlled subprocess with idempotent commands, technical retry, business rejection and human takeover separated.", "每种交易类型都成为受控子流程，明确区分幂等命令、技术重试、业务拒绝与人工接管。"],
  ["PO payments, GR and scheduling files feed WD-6 to WD1 reserve calculations, journal templates and Teams checks.", "PO 付款、GR 和排程文件进入 WD-6 至 WD1 的准备金计算、日记账模板和 Teams 检查。"],
  ["A month-end control centre displays feed freshness, unmatched items, draft/final reserve, review status and journal evidence.", "月结控制中心统一展示数据新鲜度、未匹配项、草稿/最终准备金、复核状态和日记账证据。"],
  ["Commercial closure, implementation and financial completion can appear as one ambiguous end state.", "商业关闭、实施完成和财务完成可能被混为一个含糊的最终状态。"],
  ["Commercially Agreed, Implemented, Financially Reconciled and Closed are separate gates with immutable audit history.", "Commercially Agreed、Implemented、Financially Reconciled 与 Closed 被拆成独立关口，并保留不可变审计历史。"],
  ["Users currently bridge gaps across forms, Excel, email, Teams and downstream systems.", "当前用户通过表单、Excel、邮件、Teams 和下游系统人工弥合流程断点。"],
  ["Flowable owns orchestration. NEO domain services own calculations. SAP and WIPS remain transaction systems.", "Flowable 负责流程编排，NEO 领域服务负责计算，SAP 与 WIPS 继续作为交易系统。"],
  ["AAM and House of Craft source evidence is incomplete", "AAM 与 House of Craft 的源材料证据不完整"], ["Deliver valid exports, source and SME walkthroughs before baselining.", "在建立基线前提供有效导出包、源码和 SME 走查。"],
  ["Six applications overlap a future SAP roadmap", "六个应用与未来 SAP 路线重叠"], ["Decide full rebuild, bridge, direct-to-SAP or retire for each application.", "逐应用决定完整重建、过渡桥接、直达 SAP 或退役。"],
  ["SOT and WILMA external users are not in the sizing basis", "SOT 与 WILMA 的外部用户未纳入估算基线"], ["Confirm identities, concurrency, geography and portal support model.", "确认身份体系、并发量、地域与门户支持模式。"],
  ["Foundation stack and production target versions differ", "底座技术栈与生产目标版本不一致"], ["Freeze the POC baseline and the controlled upgrade path.", "冻结 POC 基线和受控升级路径。"],
  ["Month-end control cannot tolerate state or value variance", "月结控制不能容忍状态或金额差异"], ["Complete two rehearsals and a full parallel close before cutover.", "切换前完成两次演练和一次完整并行月结。"],
  ["Build Books throughput and 20–25 year retention need proof", "Build Books 吞吐量及 20–25 年保留要求需要验证"], ["Run performance and archive POCs before final design authority.", "在最终设计审批前完成性能与归档 POC。"],
  ["Offline capability is excluded for field-oriented applications", "面向现场的应用尚未包含离线能力"], ["Decide whether eCCAR, Build Books and WILMA require offline operation.", "决定 eCCAR、Build Books 与 WILMA 是否需要离线运行。"],
  ["Pen test and UK/China support boundary remain open", "渗透测试及中英支持边界仍待确定"], ["Approve boundary, test scope and production-access operating model.", "批准数据边界、测试范围与生产访问运营模式。"],
  ["Bottom-up Phase 1 baseline is transparent", "第一阶段自下而上基线透明可追溯"], ["Reconcile stale 8-app assumptions and correct the workbook formula error.", "校正旧的 8 应用假设及工作簿公式错误。"],
  ["JLR receives application and foundation source", "JLR 接收应用与共享底座源码"], ["Make source acceptance, SBOM and reproducible build contractual gates.", "将源码验收、SBOM 和可复现构建设为合同关口。"],
  ["Scope", "范围"], ["Portfolio", "应用组合"], ["Scale", "规模"], ["Commercial", "商务"], ["Ownership", "所有权"], ["JLR Platform Owner", "JLR 平台负责人"], ["Chief Architect", "首席架构师"], ["Product Owner", "产品负责人"], ["Programme Director", "项目总监"], ["Commercial Lead", "商务负责人"],
  ["LENS", "视角"], ["SCENARIO", "场景"], ["Executive", "管理层"], ["Business", "业务"], ["Technology", "技术"], ["Portfolio baseline", "项目组合基线"], ["Controlled only", "仅受控项"], ["Needs attention", "需要关注"], ["Blocked only", "仅阻塞项"], ["Save Local Snapshot", "保存本地快照"], ["BASELINE DATE", "基线日期"], ["Controlled draft", "受控草案"], ["Controlled", "受控"], ["Needs Attention", "需要关注"], ["Blocked", "阻塞"], ["Critical", "关键"],
];

function useDomTranslation(language, dependencies) {
  useEffect(() => {
    if (language !== "zh") return undefined;
    const root = document.querySelector(".studio");
    if (!root) return undefined;
    const pairs = [...zhPairs].sort((a, b) => b[0].length - a[0].length);
    let translating = false;
    const translate = () => {
      if (translating) return;
      translating = true;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (node.parentElement?.closest(".language-toggle, .locale-native")) continue;
        let next = node.nodeValue;
        const exact = pairs.find(([en]) => next.trim() === en);
        if (exact) {
          node.nodeValue = next.replace(exact[0], exact[1]);
          continue;
        }
        for (const [en, zh] of pairs) next = next.split(en).join(zh);
        if (next !== node.nodeValue) node.nodeValue = next;
      }
      translating = false;
    };
    translate();
    const observer = new MutationObserver(translate);
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [language, ...dependencies]);
}
function Kpi({ label, value, note, tone = "teal" }) { return <article className={`kpi tone-${tone}`}><div className="eyebrow">{label}</div><strong>{value}</strong><p>{note}</p></article>; }
function PageTitle({ number, kicker, title, desc }) { return <div className="page-heading"><div><span>{number} · {kicker}</span><h1>{title}</h1></div><p>{desc}</p></div>; }
function Status({ value }) { return <span className={`status status-${value}`}>{stateLabels[value] || value}</span>; }

function Overview({ lens, scenario }) {
  const openRisks = risks.filter(r => scenario === "all" || r.state === scenario).slice(0, 5);
  return <>
    <PageTitle number="01" kicker="PROJECT OVERVIEW" title="Appian Exit Control" desc="One evidence-led view of portfolio disposition, NEO protection, migration readiness and the 31 March 2027 deadline." />
    <section className="kpi-grid"><Kpi label="In-scope applications" value="14" note="5 strategic · 6 SAP-dependent · 3 validate / hold" /><Kpi label="Implementation baseline" value="4,372 MD" note="3,572 application MD + 800 foundation MD" /><Kpi label="Phase 1 price" value="¥12.653m" note="Excluding VAT · bottom-up quotation" /><Kpi label="Mandatory cutover" value="31 Mar 27" note="No post-expiry reliance on Appian" tone="amber" /></section>
    <section className="panel span-2"><div className="panel-head"><div><h2>Exception-driven worklist</h2><p>Only decisions that can change scope, safety, time or cost are shown.</p></div><Status value={scenario === "all" ? "attention" : scenario} /></div><div className="worklist">{openRisks.map(r => <div className="work-row" key={r.id}><div className={`rail rail-${r.state}`} /><div><b>{r.id} · {r.title}</b><small>{r.area} · {r.action}</small></div><span>{r.owner}</span><Status value={r.state} /></div>)}</div></section>
    <div className="two-col"><section className="panel"><div className="panel-head"><div><h2>Programme control journey</h2><p>Release is governed by evidence, not dates alone.</p></div></div><div className="phase-strip">{[['P0','Mobilise','Exports, source, SMEs'],['P1','Prove','Foundation + real POC'],['P2','Migrate','Three waves + NEO lane'],['P3','Rehearse','Data, integration, UAT'],['P4','Cut over','No month-end change'],['P5','Stabilise','Hypercare + ownership']].map((p,i)=><div className={i===0?'active':''} key={p[0]}><span>{p[0]}</span><b>{p[1]}</b><small>{p[2]}</small></div>)}</div></section><section className="panel"><div className="panel-head"><div><h2>What success means</h2><p>{lens === "executive" ? "Executive outcome" : lens === "business" ? "Business outcome" : "Technology outcome"}</p></div></div><div className="decision-list">{(lens === "executive" ? ["Appian can be decommissioned on time", "NEO month-end reconciles to zero", "Every application has a signed disposition", "JLR owns code, data and runbooks"] : lens === "business" ? ["Users continue in-flight work without rekeying", "Approval and financial controls remain intact", "External partners retain supported access", "Journey improvements wait until parity is safe"] : ["BPMN/DMN and application code are versioned", "Interfaces are idempotent and reconciled", "UK production boundary is enforced", "SBOM, tests and runbooks gate production"]).map((x,i)=><div key={x}><span>0{i+1}</span><p>{x}</p></div>)}</div></section></div>
  </>;
}

function Portfolio() {
  const [domain, setDomain] = useState("All"); const [disposition, setDisposition] = useState("All"); const [selected, setSelected] = useState(apps[0]);
  const domains = ["All", ...new Set(apps.map(a => a.domain))]; const filtered = apps.filter(a => (domain === "All" || a.domain === domain) && (disposition === "All" || a.disposition === disposition));
  return <><PageTitle number="02" kicker="PORTFOLIO CONTROL" title="14 Applications, Five Decisions" desc="Treat each application by business future, architecture pattern and migration evidence — not by one blanket template." />
    <section className="kpi-grid compact"><Kpi label="Strategic BPM" value="5" note="NEO, Build Books, eCCAR, Chip+, SCIM" /><Kpi label="SAP-dependent" value="6" note="Continuity scope must match the SAP roadmap" tone="amber" /><Kpi label="Validate / hold" value="3" note="AAM, House of Craft, WLTP" tone="red" /><Kpi label="Known internal users" value="6,119+" note="Excludes two unknown apps and external populations" /></section>
    <section className="toolbar"><label>DOMAIN<select value={domain} onChange={e=>setDomain(e.target.value)}>{domains.map(x=><option key={x}>{x}</option>)}</select></label><label>DISPOSITION<select value={disposition} onChange={e=>setDisposition(e.target.value)}>{["All","Strategic BPM","SAP-dependent","Validate"].map(x=><option key={x}>{x}</option>)}</select></label><span>{filtered.length} applications shown</span></section>
    <div className="portfolio-layout"><section className="panel table-panel"><div className="app-table header"><span>Application</span><span>Users</span><span>MD</span><span>Price</span><span>Decision</span></div>{filtered.map(a=><button key={a.id} className={`app-table ${selected.id===a.id?'selected':''}`} onClick={()=>setSelected(a)}><span><i className={`risk-line ${a.risk}`} /> <b>{a.id}</b><small>{a.domain}</small></span><span>{a.users}</span><span>{a.md}</span><span>¥{a.price.toFixed(2)}w</span><span>{a.disposition}</span></button>)}</section><aside className="panel detail-panel"><div className="panel-head"><div><span className="eyebrow">SELECTED APPLICATION</span><h2>{selected.id}</h2></div><Status value={selected.risk} /></div><p className="lead">{selected.summary}</p><dl><dt>Architecture pattern</dt><dd>{selected.pattern}</dd><dt>Wave</dt><dd>{selected.wave}</dd><dt>Systems</dt><dd>{selected.systems}</dd><dt>Control decision</dt><dd>{selected.decision}</dd></dl><div className="amount"><span>Quoted price</span><b>¥{selected.price.toFixed(2)}w</b><small>{selected.md} person-days</small></div></aside></div>
  </>;
}

function NeoJourney({ language }) {
  const isZh = language === "zh";
  const pick = value => typeof value === "string" ? value : value[isZh ? "zh" : "en"];
  const [stageId, setStageId] = useState("01");
  const stage = neoStages.find(item => item.n === stageId) || neoStages[0];
  const copy = isZh ? {
    kicker: "NEO 端到端业务旅程", title: "一条 Case，贯穿商业决策、交易执行与财务月结",
    desc: "从 Supplier Claim 或 Opportunity 开始，经量化、Mandate、Settlement、SAP/WIPS 实施、准备金和最终对账。选择任一步，理解今天怎样工作、为什么复杂，以及迁移到 Flowable 后应该怎样控制。",
    users: "业务用户", roles: "采购员、FBP、Clearing House、CBSL/GFS、MCA", effort: "测算工作量", effortNote: "345 开发 · 126 数据 · 88 PM/BA", touchpoints: "已知触点", touchNote: "覆盖身份、采购、财务、机器人与数据平台", cutover: "NEO 切换铁律", cutoverNote: "两次演练 + 一次完整并行月结",
    mapTitle: "先看懂四段业务，再进入八个步骤", mapNote: "NEO 不是一条审批流，而是一条从商业事实到财务关账的控制链。",
    stages: "选择旅程步骤", current: "当前 · Appian 业务体验", target: "目标 · Flowable 业务体验", why: "这一步解决什么", trigger: "进入条件 / 触发", owner: "主要责任人", evidence: "必须留下的控制证据", systems: "系统触点", rules: "关键业务规则与关口", exceptions: "异常与返工路径", migration: "迁移到 Flowable 的设计含义",
    branches: "四个最容易被误解的业务分支", branchesNote: "这些不是技术细节，而是 NEO 的核心业务语义。",
    stateTitle: "七个里程碑，五类不同的完成", stateNote: "迁移时必须分别映射商业、审批、执行、财务和归档状态，不能压成一个 Workflow Status。",
    sources: "材料覆盖", sourceNote: "基于 NEO E2E Process、POA Claim、FTO、Mandate、Settlement、Approvals、Implementation、LSP 与 PO Payments 工作指引整理。",
    chapters: [
      ["01—02", "立项", "识别 Risk / Opportunity，并构建可审批的商业事实"],
      ["03", "测算", "用 SAP 价格与 FTO 形成可追溯的预测金额"],
      ["04—05", "决策", "Mandate 控制谈判边界，Settlement 控制最终协议"],
      ["06—08", "执行与关账", "完成下游交易、准备金、对账和审计关闭"]
    ],
    branchCards: [
      ["Risk 与 Opportunity", "Risk 通常需要 Mandate；Opportunity 可跳过 Mandate 直接进入 Settlement，除非需要 Clearing House 介入。涨价与降价可能需要两条关联 Line。"],
      ["Mandate 与 Settlement", "Mandate 批准“可以谈到哪里”；Settlement 批准“最终签了什么”。超出 Mandate Ceiling 的 Settlement 必须重新授权。"],
      ["实施分流", "Price Claim 走 WIPS/RPA；AMM、Price Correction、Resource 走 CBSL；Container Contract 走 GFS/SAP；LSP 可能走 PO、余额检查或 Manual Invoice。"],
      ["Implemented 与 Closed", "Robot 或人工交易完成仅代表 Implemented。只有付款、准备金、Journal、Memo Line 与余额全部对账，才能 Financially Reconciled 并 Closed。"]
    ],
    states: [["01","Recognised","商业事项已识别"],["02","Claim ready","主数据与金额可用"],["03","Mandated","谈判边界获批"],["04","Settled","最终协议获批"],["05","Implemented","下游交易完成"],["06","Reconciled","财务差异为零"],["07","Closed","审计与保留完成"]]
  } : {
    kicker: "NEO END-TO-END BUSINESS JOURNEY", title: "One case across commercial decision, transaction execution and month-end close",
    desc: "Start with a Supplier Claim or Opportunity, then follow quantification, Mandate, Settlement, SAP/WIPS implementation, reserve and final reconciliation. Select any step to understand today's work, its complexity and the Flowable control design.",
    users: "Business users", roles: "Buyer, FBP, Clearing House, CBSL/GFS, MCA", effort: "Measured effort", effortNote: "345 development · 126 data · 88 PM/BA", touchpoints: "Known touchpoints", touchNote: "Identity, procurement, finance, automation and data platforms", cutover: "NEO cutover rule", cutoverNote: "Two rehearsals + one full parallel close",
    mapTitle: "Understand four business chapters before the eight steps", mapNote: "NEO is not one approval flow; it is a control chain from commercial fact to financial close.",
    stages: "Select a journey step", current: "Current · Appian business experience", target: "Target · Flowable business experience", why: "What this step achieves", trigger: "Entry condition / trigger", owner: "Primary owners", evidence: "Control evidence required", systems: "System touchpoints", rules: "Business rules and gates", exceptions: "Exceptions and rework", migration: "Flowable migration implications",
    branches: "Four business branches most often misunderstood", branchesNote: "These are core NEO semantics, not technical details.",
    stateTitle: "Status is not one field; it represents five kinds of completion", stateNote: "Migration must map commercial, approval, implementation, finance and archive states separately.",
    sources: "Evidence base", sourceNote: "Synthesised from NEO E2E Process, POA Claim, FTO, Mandate, Settlement, Approvals, Implementation, LSP and PO Payments work instructions.",
    chapters: [
      ["01—02", "Claim", "Recognise Risk / Opportunity and build approval-ready commercial truth"],
      ["03", "Value", "Use SAP pricing and FTO to create a traceable forecast value"],
      ["04—05", "Decide", "Mandate controls negotiation headroom; Settlement controls the final agreement"],
      ["06—08", "Execute & close", "Complete downstream transaction, reserve, reconciliation and audit closure"]
    ],
    branchCards: [
      ["Risk vs Opportunity", "Risk normally requires Mandate. Opportunity may move directly to Settlement unless Clearing House input is wanted. Increases and decreases may require linked lines."],
      ["Mandate vs Settlement", "Mandate approves how far the buyer may negotiate; Settlement approves what was finally signed. A Settlement above the Mandate ceiling requires re-authorisation."],
      ["Implementation routing", "Price Claim uses WIPS/RPA; AMM, Price Correction and Resource use CBSL; container contracts use GFS/SAP; LSP may use PO, balance check or manual invoice."],
      ["Implemented vs Closed", "Robot or human transaction completion means Implemented only. Payments, reserves, journals, memo lines and balances must reconcile before Financially Reconciled and Closed."]
    ],
    states: [["01","Recognised","Commercial event identified"],["02","Claim ready","Master data and value available"],["03","Mandated","Negotiation boundary approved"],["04","Settled","Final agreement approved"],["05","Implemented","Downstream transaction complete"],["06","Reconciled","Finance variance is zero"],["07","Closed","Audit and retention complete"]]
  };
  return <div className="locale-native"><PageTitle number="03" kicker={copy.kicker} title={copy.title} desc={copy.desc} />
    <section className="kpi-grid compact"><Kpi label={copy.users} value="606" note={copy.roles} /><Kpi label={copy.effort} value="559 MD" note={copy.effortNote} /><Kpi label={copy.touchpoints} value="21" note={copy.touchNote} /><Kpi label={copy.cutover} value={isZh ? "零差异" : "Zero variance"} note={copy.cutoverNote} tone="amber" /></section>

    <section className="panel neo-orientation"><div className="panel-head"><div><h2>{copy.mapTitle}</h2><p>{copy.mapNote}</p></div><span className="evidence-chip">{copy.sources}</span></div><div className="neo-chapter-grid">{copy.chapters.map((item,i)=><div key={item[0]} className={`neo-chapter chapter-${i+1}`}><span>{item[0]}</span><b>{item[1]}</b><p>{item[2]}</p></div>)}</div></section>

    <section className="neo-stage-section"><div className="section-label"><span>{copy.stages}</span><small>{stage.n} / 08</small></div><div className="neo-stage-nav">{neoStages.map(item=><button className={stageId===item.n?"active":""} key={item.n} onClick={()=>setStageId(item.n)}><span>{item.n}</span><small>{pick(item.chapter)}</small><b>{pick(item.name)}</b><i>{pick(item.owner)}</i></button>)}</div></section>

    <section className="neo-stage-focus panel"><header><div><span>{stage.n} · {pick(stage.chapter)}</span><h2>{pick(stage.name)}</h2><p>{pick(stage.intent)}</p></div><strong>{pick(stage.owner)}</strong></header>
      <div className="neo-context-grid"><div><span>{copy.trigger}</span><p>{pick(stage.trigger)}</p></div><div><span>{copy.evidence}</span><p>{pick(stage.evidence)}</p></div><div><span>{copy.systems}</span><p>{stage.systems}</p></div></div>
      <div className="neo-compare-grid"><article className="experience-card current"><span>{copy.current}</span><p>{pick(stage.before)}</p></article><article className="experience-card target"><span>{copy.target}</span><p>{pick(stage.after)}</p></article></div>
      <div className="neo-control-grid"><article><h3>{copy.rules}</h3><ol>{stage.rules.map((item,i)=><li key={i}><span>{String(i+1).padStart(2,"0")}</span><p>{pick(item)}</p></li>)}</ol></article><article className="exception-card"><h3>{copy.exceptions}</h3><ul>{stage.exceptions.map((item,i)=><li key={i}>{pick(item)}</li>)}</ul></article><article className="migration-card"><h3>{copy.migration}</h3><ul>{stage.migration.map((item,i)=><li key={i}>{pick(item)}</li>)}</ul></article></div>
    </section>

    <section className="panel"><div className="panel-head"><div><h2>{copy.branches}</h2><p>{copy.branchesNote}</p></div></div><div className="neo-branch-grid">{copy.branchCards.map((item,i)=><article key={item[0]}><span>0{i+1}</span><h3>{item[0]}</h3><p>{item[1]}</p></article>)}</div></section>

    <section className="panel neo-state-panel"><div className="panel-head"><div><h2>{copy.stateTitle}</h2><p>{copy.stateNote}</p></div></div><div className="neo-state-flow">{copy.states.map((item,i)=><div key={item[0]}><span>{item[0]}</span><b>{item[1]}</b><small>{item[2]}</small>{i<copy.states.length-1&&<i aria-hidden="true" />}</div>)}</div><footer><b>{copy.sources}</b><span>{copy.sourceNote}</span></footer></section>
  </div>;
}

function Architecture() {
  const [selected, setSelected] = useState(architecture[2]);
  return <><PageTitle number="04" kicker="TARGET ARCHITECTURE" title="One Platform, 14 Bounded Applications" desc="The target shares identity, workflow, audit, integration and operations — while keeping every application's business logic and data boundary explicit." />
    <div className="architecture-grid"><div className="arch-stack">{architecture.map(a=><button className={`arch-layer ${selected.key===a.key?'selected':''} tone-${a.tone}`} key={a.key} onClick={()=>setSelected(a)}><span>{a.key}</span><b>{a.name}</b><small>{a.items.join(" · ")}</small></button>)}</div><aside className="panel detail-panel arch-detail"><span className="eyebrow">ARCHITECTURE RULE</span><h2>{selected.name}</h2><p className="lead">{selected.rule}</p><div className="decision-list">{selected.items.map((x,i)=><div key={x}><span>0{i+1}</span><p>{x}</p></div>)}</div></aside></div>
    <section className="panel"><div className="panel-head"><div><h2>Application patterns</h2><p>The migration factory must support four different shapes.</p></div></div><div className="pattern-grid"><div><span>A</span><b>Financial control</b><p>NEO · values, SoD, periods, reconciliation.</p></div><div><span>B</span><b>External collaboration</b><p>Aftermarket, Brexit, SOT, Chip+, WILMA.</p></div><div><span>C</span><b>Operational case</b><p>Build Books, eCCAR, SCIM.</p></div><div><span>D</span><b>Task & data workflow</b><p>AAM, Asset, Warranty, WLTP, HOC.</p></div></div></section>
  </>;
}

function MigrationFactory() {
  const [plan, setPlan] = useState("recommended");
  const current = [["Wave 1","AAM · Build Books · SOT","Unsafe: two high-risk pioneers"],["Wave 2","Asset · WLTP · HOC · Chip+ · eCCAR · SCIM","Too many unknowns together"],["Wave 3","Aftermarket · Brexit · Warranty · WILMA","Four SAP-dependent applications"],["Dedicated","NEO","Correct principle"]];
  const recommended = [["Wave 0","Foundation + smallest proven export","Prove translation, data and operations"],["Wave 1","AAM / Asset / Warranty after decisions","Low-risk real applications only"],["Wave 2","SCIM · Build Books · eCCAR","Operational-case pattern"],["Wave 3","Chip+ · SOT · WILMA · Brexit · Aftermarket","External ecosystem and complex integration"],["Dedicated","NEO","Starts early; parallel month-end close"],["Hold","HOC · WLTP","Enter only when evidence and usage are confirmed"]];
  return <><PageTitle number="05" kicker="MIGRATION FACTORY" title="Prove, Scale, Rehearse, Cut Over" desc="The factory is released by evidence: exports and source, signed specifications, golden-case parity, reconciled data and production readiness." />
    <section className="gate-grid">{[['G0','Evidence in hand','Exports, source, owners, interfaces'],['G1','Specification signed','State, data, rules and roles'],['G2','POC proven','Real app, real integration, real migration'],['G3','Wave ready','Golden cases and NFR evidence'],['G4','Cutover ready','Two rehearsals, runbooks, zero critical defects'],['G5','Accepted','Production validation and ownership']].map((x,i)=><div key={x[0]} className={i<2?'passed':''}><span>{x[0]}</span><b>{x[1]}</b><p>{x[2]}</p></div>)}</section>
    <section className="mode-switch"><button className={plan==='current'?'active':''} onClick={()=>setPlan('current')}>Quoted wave plan</button><button className={plan==='recommended'?'active':''} onClick={()=>setPlan('recommended')}>Control recommendation</button></section>
    <section className="panel wave-table"><div className="wave-row head"><span>Lane</span><span>Applications</span><span>Control view</span></div>{(plan==='current'?current:recommended).map(x=><div className="wave-row" key={x[0]}><span>{x[0]}</span><b>{x[1]}</b><p>{x[2]}</p></div>)}</section>
    <section className="panel"><div className="panel-head"><div><h2>Factory acceptance chain</h2><p>Machine acceleration never removes accountable human gates.</p></div></div><div className="phase-strip six"><div><span>01</span><b>Extract</b><small>Appian XML, forms, data</small></div><div><span>02</span><b>Specify</b><small>Signed business truth</small></div><div><span>03</span><b>Generate</b><small>BPMN, APIs, UI baseline</small></div><div><span>04</span><b>Review</b><small>Engineer owns code</small></div><div><span>05</span><b>Compare</b><small>Golden-case parity</small></div><div><span>06</span><b>Release</b><small>Evidence pack accepted</small></div></div></section>
  </>;
}

function DataIntegration() {
  const families = [["Identity","ForgeRock · partner IdP · PAM","OIDC/SAML, SCIM, OAuth2, mTLS"],["ERP & Finance","SAP ECC · GTS · Turbo","Claims, PO, pricing, payments, journal"],["Data & Reporting","EDW · GSDB · Qlik · BigQuery","Master, GR, schedule, analytics"],["Procurement & MFG","iPOS · WIPS · functional services","Quotation and transaction execution"],["CRM & Fulfilment","Salesforce · Solve Engine","Bespoke order flow"],["Automation & Files","RPA · FTO · SFTP/MFT · Excel","Controlled batch and fallback paths"],["Engineering","Oracle P6 · rMFD · SharePoint","Attributes, plans and evidence"],["Collaboration","Teams · eTracker · INVREQS","Review and manual invoice paths"]];
  return <><PageTitle number="06" kicker="DATA & INTEGRATION" title="Contracts Before Connections" desc="Every interface needs an owner, schema, authentication model, frequency, idempotency rule, failure path and reconciliation control." />
    <section className="kpi-grid compact"><Kpi label="System families" value="8" note="Across the 14-application estate" /><Kpi label="NEO touchpoints" value="21" note="The measured integration anchor" /><Kpi label="Migration tiers" value="A / B / C" note="Snapshot · in-flight · attachments & audit" /><Kpi label="Point-to-point" value="0 target" note="All enterprise routes through governed API layers" /></section>
    <section className="panel matrix"><div className="matrix-row matrix-head"><span>Family</span><span>Systems</span><span>Contract</span></div>{families.map(f=><div className="matrix-row" key={f[0]}><b>{f[0]}</b><span>{f[1]}</span><p>{f[2]}</p></div>)}</section>
    <div className="two-col"><section className="panel"><h2>Migration tiers</h2><div className="decision-list"><div><span>A</span><p><b>Core snapshot.</b> Required master and closed-case reference.</p></div><div><span>B</span><p><b>In-flight continuity.</b> Active instances, tasks and state mapping.</p></div><div><span>C</span><p><b>Audit complete.</b> Attachments, history and control evidence.</p></div></div></section><section className="panel"><h2>Non-negotiable controls</h2><div className="decision-list"><div><span>01</span><p>Idempotency keys for external financial actions.</p></div><div><span>02</span><p>Outbox, retry, dead-letter and manual replay.</p></div><div><span>03</span><p>Counts, control totals and attachment hashes.</p></div><div><span>04</span><p>Read-only history with retention and legal hold.</p></div></div></section></div>
  </>;
}

function QualityCutover() {
  return <><PageTitle number="07" kicker="QUALITY & CUTOVER" title="No Production Without Evidence" desc="Functional parity is necessary but insufficient: data, security, performance, accessibility, resilience and operational ownership all gate production." />
    <section className="kpi-grid compact"><Kpi label="Data rehearsals" value="2" note="Production-like copies before cutover" /><Kpi label="NEO parallel close" value="1 month" note="Reconcile every control total to zero" /><Kpi label="Critical defects" value="0" note="Required at production admission" /><Kpi label="Month-end cutover" value="Prohibited" note="Switch only at an approved close boundary" tone="red" /></section>
    <section className="panel"><div className="panel-head"><div><h2>Production admission matrix</h2><p>Each gate requires named evidence and an accountable approver.</p></div></div><div className="qa-grid">{[['Functional','Golden cases match Appian','Business Owner'],['Data','Counts, totals and hashes reconcile','Migration Lead'],['Integration','Failure and replay paths proven','Architecture Lead'],['Performance','Peak volumes and month-end proven','NFR Lead'],['Security','Threat model, SAST/DAST, pen test','JLR Security'],['Accessibility','WCAG 2.2 AA checks complete','UX / QA'],['Operations','Alerts, backup, DR and runbooks','Service Owner'],['Cutover','Dress rehearsal and rollback passed','Programme Director']].map((x,i)=><div key={x[0]}><span>0{i+1}</span><b>{x[0]}</b><p>{x[1]}</p><small>{x[2]}</small></div>)}</div></section>
    <section className="panel"><div className="panel-head"><div><h2>NEO protected cutover</h2><p>Business and financial state move together.</p></div></div><div className="phase-strip six"><div><span>T-8w</span><b>Map</b><small>25 states and in-flight paths</small></div><div><span>T-6w</span><b>Rehearse 1</b><small>Counts and control totals</small></div><div><span>T-4w</span><b>Rehearse 2</b><small>Timed migration and rollback</small></div><div><span>Jan</span><b>Parallel</b><small>Full month-end close</small></div><div><span>Feb</span><b>Cut over</b><small>Approved close boundary</small></div><div><span>T+4w</span><b>Stabilise</b><small>Read-only Appian retained</small></div></div></section>
  </>;
}

function TokenControl({ language }) {
  const isZh = language === "zh";
  const copy = isZh ? {
    kicker: "AI 与 TOKEN 控制", title: "把 AI 加速变成可管理的交付能力",
    desc: "用可编辑假设测算 14 个应用的 Token 规模、预算消耗与人工关口；AI 提速，但不替代业务、工程、质量或发布责任。",
    assumption: "规划假设", assumptionNote: "以下数字用于项目预算与容量规划，并非任何模型供应商的正式报价。",
    appCount: "应用数量", rounds: "平均迭代轮次", cache: "缓存复用率", overhead: "试验冗余", inputRate: "输入单价 / 百万 Token", outputRate: "输出单价 / 百万 Token", budget: "Token 预算上限",
    input: "可计费输入 Token", output: "输出 Token", cost: "预测 Token 成本", use: "预算消耗", million: "百万", within: "受控", watch: "需要关注", freeze: "冻结非必要试验",
    lean: "精益", expected: "预期", peak: "峰值", formula: "测算逻辑", allocation: "Token 活动分配", allocationNote: "把 Token 用到可复核的工程产物，而不是泛化对话。",
    responsibility: "AI 做什么，人做什么", responsibilityNote: "每个阶段都有明确的人类责任人；AI 不拥有审批权、生产权限或财务签署权。",
    phase: "阶段", ai: "AI 负责", human: "人工负责", prohibited: "AI 禁止事项",
    unit: "加权复杂度单元", formulaText: "原始 Token = 加权复杂度 × 单元基准 × 迭代轮次；再按缓存收益与试验冗余调整。",
    activities: [["导出包分析","18%"],["规格与映射","20%"],["BPMN / DMN / 代码","32%"],["测试与证据","20%"],["文档与报告","10%"]],
    rows: [
      ["发现与盘点","解析 Appian 导出包，起草对象与依赖清单","产品负责人 / BA 验证范围与业务含义","承诺范围或处置结论"],
      ["流程与数据映射","起草状态、角色、规则、字段与接口映射","BA、数据负责人和控制人批准业务真相","最终批准映射或控制设计"],
      ["构建","生成 BPMN / DMN、React / Java 骨架与测试","工程师审查、修正并对代码质量负责","合并代码、部署或绕过审查"],
      ["数据迁移","生成转换脚本、校验规则与对账草案","迁移负责人批准映射、例外与执行窗口","直接操作生产数据"],
      ["测试与证据","生成测试、执行自动检查并整理日志","QA 判定缺陷、风险与准入结论","签署 UAT 或降低缺陷等级"],
      ["切换与运行","汇总就绪度、监测指标并提示异常","发布负责人、QA、BA 作出 Go / No-Go","批准切换、财务过账或生产例外"]
    ]
  } : {
    kicker: "AI & TOKEN CONTROL", title: "Make AI acceleration governable",
    desc: "Model token volume, budget consumption and human gates across 14 applications. AI accelerates delivery; it does not replace business, engineering, quality or release accountability.",
    assumption: "Planning assumptions", assumptionNote: "These figures support programme budgeting and capacity planning; they are not a provider quotation.",
    appCount: "Application count", rounds: "Average iteration rounds", cache: "Cache reuse", overhead: "Experiment overhead", inputRate: "Input rate / 1M tokens", outputRate: "Output rate / 1M tokens", budget: "Token budget cap",
    input: "Billable input tokens", output: "Output tokens", cost: "Forecast token cost", use: "Budget consumption", million: "million", within: "Controlled", watch: "Needs attention", freeze: "Freeze non-essential experiments",
    lean: "Lean", expected: "Expected", peak: "Peak", formula: "Estimation logic", allocation: "Token activity allocation", allocationNote: "Spend tokens on reviewable engineering outputs, not undirected conversation.",
    responsibility: "What AI does, what people own", responsibilityNote: "Every phase retains a named human owner. AI has no approval authority, production privilege or financial sign-off.",
    phase: "Phase", ai: "AI contributes", human: "Human owns", prohibited: "AI must not",
    unit: "weighted complexity units", formulaText: "Raw tokens = weighted complexity × unit baseline × iteration rounds, adjusted for cache benefit and experiment overhead.",
    activities: [["Export analysis","18%"],["Specification & mapping","20%"],["BPMN / DMN / code","32%"],["Test & evidence","20%"],["Documentation & reporting","10%"]],
    rows: [
      ["Discovery & inventory","Parse Appian exports; draft object and dependency inventory","Product owner / BA validates scope and business meaning","Commit scope or disposition"],
      ["Process & data mapping","Draft state, role, rule, field and interface mappings","BA, data owner and control owner approve business truth","Approve final mappings or controls"],
      ["Build","Generate BPMN / DMN, React / Java scaffolds and tests","Engineer reviews, corrects and owns code quality","Merge, deploy or bypass review"],
      ["Data migration","Draft transforms, validation rules and reconciliation","Migration lead approves mappings, exceptions and execution window","Touch production data directly"],
      ["Test & evidence","Generate tests, run automated checks and organise logs","QA judges defects, risk and admission","Sign UAT or downgrade defects"],
      ["Cutover & run","Summarise readiness, monitor signals and flag anomalies","Release lead, QA and BA make Go / No-Go","Approve cutover, financial posting or production exception"]
    ]
  };
  const [appsCount, setAppsCount] = useState(14);
  const [rounds, setRounds] = useState(2.5);
  const [cacheRate, setCacheRate] = useState(55);
  const [experiment, setExperiment] = useState(10);
  const [inputRate, setInputRate] = useState(22);
  const [outputRate, setOutputRate] = useState(110);
  const [budgetCap, setBudgetCap] = useState(100000);
  const appWeightSum = 18.25;
  const units = appWeightSum * (appsCount / 14) + 4;
  const rawInputM = units * 18 * rounds;
  const rawOutputM = units * 4.5 * rounds;
  const billableInputM = rawInputM * (1 - (cacheRate / 100) * .5) * (1 + experiment / 100);
  const billableOutputM = rawOutputM * (1 + experiment / 100);
  const forecastCost = billableInputM * inputRate + billableOutputM * outputRate;
  const budgetUse = budgetCap > 0 ? forecastCost / budgetCap * 100 : 0;
  const level = budgetUse >= 85 ? "blocked" : budgetUse >= 70 ? "attention" : "normal";
  const levelText = level === "blocked" ? copy.freeze : level === "attention" ? copy.watch : copy.within;
  const applyPreset = (preset) => {
    if (preset === "lean") { setRounds(2); setCacheRate(65); setExperiment(5); }
    if (preset === "expected") { setRounds(2.5); setCacheRate(55); setExperiment(10); }
    if (preset === "peak") { setRounds(3.5); setCacheRate(35); setExperiment(15); }
  };
  const fields = [
    [copy.appCount, appsCount, setAppsCount, 1], [copy.rounds, rounds, setRounds, .5], [copy.cache, cacheRate, setCacheRate, 5], [copy.overhead, experiment, setExperiment, 5],
    [copy.inputRate, inputRate, setInputRate, 1], [copy.outputRate, outputRate, setOutputRate, 5], [copy.budget, budgetCap, setBudgetCap, 5000]
  ];
  return <><PageTitle number="08" kicker={copy.kicker} title={copy.title} desc={copy.desc} />
    <section className="token-assumptions panel"><div className="panel-head"><div><h2>{copy.assumption}</h2><p>{copy.assumptionNote}</p></div><Status value={level} /></div>
      <div className="preset-row"><button onClick={()=>applyPreset("lean")}>{copy.lean}</button><button className="active" onClick={()=>applyPreset("expected")}>{copy.expected}</button><button onClick={()=>applyPreset("peak")}>{copy.peak}</button></div>
      <div className="token-input-grid">{fields.map(([label,value,setter,step])=><label key={label}><span>{label}</span><input type="number" min="0" step={step} value={value} onChange={e=>setter(Number(e.target.value))}/></label>)}</div>
    </section>
    <section className="kpi-grid token-kpis"><Kpi label={copy.input} value={`${billableInputM.toFixed(0)}M`} note={`${rawInputM.toFixed(0)}M raw · ${cacheRate}% cache`} /><Kpi label={copy.output} value={`${billableOutputM.toFixed(0)}M`} note={`${rounds}× ${isZh?'迭代':'iterations'}`} /><Kpi label={copy.cost} value={`¥${Math.round(forecastCost).toLocaleString()}`} note={`${copy.unit}: ${units.toFixed(1)}`} tone={level === "normal" ? "teal" : level === "attention" ? "amber" : "red"} /><Kpi label={copy.use} value={`${budgetUse.toFixed(1)}%`} note={levelText} tone={level === "normal" ? "teal" : level === "attention" ? "amber" : "red"} /></section>
    <div className="two-col"><section className="panel"><div className="panel-head"><div><h2>{copy.formula}</h2><p>{copy.formulaText}</p></div></div><div className="formula-box"><code>({appWeightSum.toFixed(2)} × {appsCount}/14 + 4) × token baseline × {rounds}</code><span>{isZh ? "缓存只折减可缓存输入的 50%，输出不折减；两者都计入试验冗余。" : "Cache reduces 50% of cache-eligible input only; experiment overhead applies to input and output."}</span></div></section>
      <section className="panel"><div className="panel-head"><div><h2>{copy.allocation}</h2><p>{copy.allocationNote}</p></div></div><div className="allocation-list">{copy.activities.map(([name,pct])=><div key={name}><span>{name}</span><i><b style={{width:pct}} /></i><strong>{pct}</strong></div>)}</div></section></div>
    <section className="panel responsibility-panel"><div className="panel-head"><div><h2>{copy.responsibility}</h2><p>{copy.responsibilityNote}</p></div></div><div className="responsibility-table"><div className="responsibility-row responsibility-head"><span>{copy.phase}</span><span>{copy.ai}</span><span>{copy.human}</span><span>{copy.prohibited}</span></div>{copy.rows.map(row=><div className="responsibility-row" key={row[0]}>{row.map((cell,i)=><div key={i} data-label={[copy.phase,copy.ai,copy.human,copy.prohibited][i]}>{i===0?<b>{cell}</b>:cell}</div>)}</div>)}</div></section>
  </>;
}

function Commercial() {
  return <><PageTitle number="09" kicker="COMMERCIAL & RESOURCES" title="Know What the Price Buys" desc="The quotation is a delivery baseline, not proof of five-year value. The business case must compare Appian renewal with migration, cloud, operations and future change." />
    <section className="kpi-grid"><Kpi label="Phase 1 excl. VAT" value="¥12.653m" note="Applications + shared foundation" /><Kpi label="Applications" value="¥10.309m" note="3,572 MD across 14 applications" /><Kpi label="Foundation" value="¥2.344m" note="800 MD shared platform scope" /><Kpi label="Annual run baseline" value="¥5.084m" note="Phase 2 squad + cloud list price" tone="amber" /></section>
    <div className="two-col"><section className="panel"><div className="panel-head"><div><h2>Foundation allocation</h2><p>Shared scope that every application depends on.</p></div></div><div className="matrix"><div className="matrix-row"><b>Migration toolchain</b><span>160 MD</span><p>Specification, generation and validation</p></div><div className="matrix-row"><b>Foundation adaptation</b><span>240 MD</span><p>Workflow and common platform services</p></div><div className="matrix-row"><b>Integration adapters</b><span>160 MD</span><p>Governed enterprise connectivity</p></div><div className="matrix-row"><b>Frontend components</b><span>80 MD</span><p>Shared React interaction patterns</p></div><div className="matrix-row"><b>Testing</b><span>80 MD</span><p>Foundation verification</p></div><div className="matrix-row"><b>Architecture</b><span>80 MD</span><p>Target design and admission</p></div></div></section><section className="panel"><div className="panel-head"><div><h2>Commercial control questions</h2><p>Resolve before an unconditional fixed commitment.</p></div></div><div className="decision-list"><div><span>01</span><p>What is the five-year Appian renewal and change cost?</p></div><div><span>02</span><p>Which SAP-dependent apps need full rebuilds versus bridges?</p></div><div><span>03</span><p>Does the resource curve support 4,372 MD in six months?</p></div><div><span>04</span><p>Are external-user and peak-load costs fully represented?</p></div><div><span>05</span><p>Who funds framework upgrades, CVEs and platform ownership?</p></div></div></section></div>
    <section className="panel table-panel"><div className="app-table header"><span>Top quoted applications</span><span>Users</span><span>MD</span><span>Price</span><span>Control note</span></div>{[...apps].sort((a,b)=>b.price-a.price).slice(0,7).map(a=><div className="app-table" key={a.id}><span><b>{a.id}</b><small>{a.pattern}</small></span><span>{a.users}</span><span>{a.md}</span><span>¥{a.price.toFixed(2)}w</span><span>{a.decision}</span></div>)}</section>
  </>;
}

function Risks({ scenario }) {
  const [filter, setFilter] = useState(scenario === "all" ? "all" : scenario); const items = risks.filter(r=>filter==='all'||r.state===filter);
  return <><PageTitle number="10" kicker="RISK & DECISIONS" title="Escalate Decisions, Not Noise" desc="Every open risk carries an owner, action and decision boundary. Missing evidence stays visible; delivery does not silently absorb uncertainty." />
    <section className="mode-switch"><button className={filter==='all'?'active':''} onClick={()=>setFilter('all')}>All</button><button className={filter==='blocked'?'active':''} onClick={()=>setFilter('blocked')}>Blocked</button><button className={filter==='attention'?'active':''} onClick={()=>setFilter('attention')}>Needs Attention</button><button className={filter==='normal'?'active':''} onClick={()=>setFilter('normal')}>Controlled</button></section>
    <section className="risk-grid">{items.map(r=><article className="panel risk-card" key={r.id}><div><span className="risk-id">{r.id}</span><Status value={r.state}/></div><h2>{r.title}</h2><p>{r.action}</p><footer><span>{r.area}</span><b>{r.owner}</b></footer></article>)}</section>
    <section className="panel"><div className="panel-head"><div><h2>Steering decisions required now</h2><p>These decisions materially change scope, cost or delivery safety.</p></div></div><div className="decision-list"><div><span>01</span><p>Approve application-by-application disposition, especially the six SAP candidates.</p></div><div><span>02</span><p>Approve NEO as a dedicated lane with a protected parallel close.</p></div><div><span>03</span><p>Replace the current Wave 1 composition with a lower-risk proven export.</p></div><div><span>04</span><p>Approve external identity, mobile/offline and retention principles.</p></div><div><span>05</span><p>Make source, SBOM, reproducible build and runbook acceptance contractual.</p></div></div></section>
  </>;
}

function ReportCenter({ onSnapshot }) {
  const [report, setReport] = useState("Steering Committee");
  const thesis = report === "NEO Control Review" ? "Protect financial accuracy through state mapping, parallel close and zero-variance reconciliation." : report === "Architecture Board" ? "Approve a bounded-app architecture with Flowable for orchestration and domain services for business truth." : report === "Migration Readiness" ? "Release waves only after source, specification, golden-case, data and operational evidence pass." : report === "Commercial Review" ? "Reconcile the bottom-up quotation with application disposition, external scale and the five-year TCO." : "The migration is viable, but commitment should remain evidence-gated until application disposition, NEO controls and source readiness are proven.";
  return <><PageTitle number="11" kicker="REPORT CENTER" title="One Baseline, Multiple Conversations" desc="Generate each report from the same portfolio, risk, evidence and decision data — without maintaining parallel slide narratives." />
    <section className="toolbar"><label>REPORT PACK<select value={report} onChange={e=>setReport(e.target.value)}>{["Steering Committee","NEO Control Review","Architecture Board","Migration Readiness","Commercial Review"].map(x=><option key={x}>{x}</option>)}</select></label><button onClick={()=>window.print()}>Print / PDF</button><button className="primary" onClick={onSnapshot}>Save Local Snapshot</button></section>
    <section className="report-page"><span className="eyebrow">{report.toUpperCase()} · CONTROL PACK</span><h2>{report === "Steering Committee" ? "Appian Exit: decision-led status" : report}</h2><p className="report-thesis">{thesis}</p><div className="report-grid"><div><span>01</span><b>Outcome</b><p>Exit Appian by 31 March 2027 without interrupting 14 business applications.</p></div><div><span>02</span><b>Critical path</b><p>Exports, source, interfaces, SMEs, test environments and NEO month-end evidence.</p></div><div><span>03</span><b>Decision</b><p>Proceed with Flowable POC and NEO lane; re-baseline wave content after week-one measurement.</p></div><div><span>04</span><b>Escalation</b><p>Do not hide SAP overlap, external-user scale, missing source or unresolved data residency.</p></div></div><div className="report-footer"><span>Baseline · 17 September 2026</span><span>Internal working control view</span></div></section>
  </>;
}

function App() {
  const [active, setActive] = useState("01"); const [lens, setLens] = useState("executive"); const [scenario, setScenario] = useState("all"); const [language, setLanguage] = useState("zh"); const activeLabel = modules.find(m=>m[0]===active)?.[1];
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [active]);
  useDomTranslation(language, [active, lens, scenario]);
  const snapshot = () => { const data = { baseline: "2026-09-17", activeModule: activeLabel, language, lens, scenario, totals: { applications: 14, personDays: 4372, phase1Cny: 12652500 }, applications: apps, risks }; const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], {type:"application/json"})); const a = document.createElement("a"); a.href=url; a.download="jlr-appian-control-snapshot.json"; a.click(); URL.revokeObjectURL(url); };
  const content = useMemo(()=>({"01": <Overview lens={lens} scenario={scenario}/>, "02": <Portfolio/>, "03": <NeoJourney language={language}/>, "04": <Architecture/>, "05": <MigrationFactory/>, "06": <DataIntegration/>, "07": <QualityCutover/>, "08": <TokenControl language={language}/>, "09": <Commercial/>, "10": <Risks scenario={scenario}/>, "11": <ReportCenter onSnapshot={snapshot}/>})[active],[active,lens,scenario,language]);
  return <div className="studio" key={language}><aside className="sidebar"><button className="brand" onClick={()=>setActive("01")} aria-label="Return to project overview"><span>JLR</span><small>Appian Control</small></button><nav>{modules.map(([n,label])=><button key={n} className={active===n?'active':''} onClick={()=>setActive(n)}><span>{n}</span><b>{label}</b></button>)}</nav><div className="baseline"><span>BASELINE DATE</span><b>17 Sep 2026</b><small><i /> Controlled draft</small></div></aside><main><header className="control-header"><div><span>{active} · {activeLabel.toUpperCase()}</span><b>PROJECT CONTROL STUDIO</b></div><div className="header-controls"><div className="language-toggle" aria-label="Language"><button className={language==='zh'?'active':''} onClick={()=>setLanguage('zh')}>中文</button><button className={language==='en'?'active':''} onClick={()=>setLanguage('en')}>EN</button></div><label>LENS<select value={lens} onChange={e=>setLens(e.target.value)}><option value="executive">Executive</option><option value="business">Business</option><option value="technology">Technology</option></select></label><label>SCENARIO<select value={scenario} onChange={e=>setScenario(e.target.value)}><option value="all">Portfolio baseline</option><option value="normal">Controlled only</option><option value="attention">Needs attention</option><option value="blocked">Blocked only</option></select></label><button onClick={snapshot}>Save Local Snapshot</button></div></header><div className="workspace">{content}</div></main></div>;
}

export { App };
