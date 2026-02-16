import{j as e,r as x,c as ke,R as Ce}from"./client-D7f9BLy3.js";import{b as et,d as tt,e as nt,g as Ee}from"./storage-BROYPw1S.js";function me({icon:t,label:n,value:o,fullValue:a,status:c,subLabel:r}){const[s,l]=x.useState(!1),i=a&&a.length>0&&a!==o,d=()=>c==="scanning"?e.jsx("div",{className:"context-status scanning",children:e.jsx("div",{className:"scan-spinner"})}):c==="success"?e.jsx("div",{className:"context-status success",children:e.jsx("svg",{width:"10",height:"10",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})})}):e.jsx("div",{className:"context-status warning",children:e.jsx("svg",{width:"10",height:"10",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",children:e.jsx("path",{d:"M12 9v4M12 17h.01"})})});return e.jsxs("div",{className:`context-item ${c} ${i?"has-tooltip":""}`,onMouseEnter:()=>i&&l(!0),onMouseLeave:()=>l(!1),children:[e.jsx("div",{className:"context-item-line"}),e.jsx("div",{className:"context-item-icon",children:t}),e.jsxs("div",{className:"context-item-content",children:[e.jsxs("div",{className:"context-item-header",children:[e.jsx("span",{className:"context-item-label",children:n}),d(),i&&e.jsx("span",{className:"hover-hint",children:e.jsxs("svg",{width:"10",height:"10",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("path",{d:"M12 16v-4M12 8h.01"})]})})]}),c==="scanning"?e.jsx("div",{className:"context-item-value scanning",children:"Scanning..."}):o?e.jsx("div",{className:"context-item-value",children:o}):e.jsx("div",{className:"context-item-value warning",children:r||"Not found"})]}),s&&a&&e.jsxs("div",{className:"context-tooltip",children:[e.jsx("div",{className:"context-tooltip-header",children:n}),e.jsx("div",{className:"context-tooltip-content",children:a})]})]})}function ot({postData:t,isScanning:n,analyzeImage:o,onAnalyzeImageChange:a}){const c=(f,y)=>f?f.length>y?f.slice(0,y)+"...":f:"",r=()=>n?"scanning":t!=null&&t.postContent?"success":"warning",s=()=>n?"scanning":t!=null&&t.authorName?"success":"warning",l=()=>n?"scanning":"success",i=()=>{var y,M;return n?"scanning":(((M=(y=t==null?void 0:t.threadContext)==null?void 0:y.existingComments)==null?void 0:M.length)||0)>0?"success":"warning"},d=()=>{var f,y;return t?((f=t.threadContext)==null?void 0:f.mode)==="reply"&&((y=t.threadContext)!=null&&y.parentComment)?`Replying to ${t.threadContext.parentComment.authorName}`:"Direct Comment Mode":null},p=()=>{var f,y;return t?((f=t.threadContext)==null?void 0:f.mode)==="reply"&&((y=t.threadContext)!=null&&y.parentComment)?c(t.threadContext.parentComment.content,50):"Commenting directly on the main post":null},u=()=>{var f,y;return t&&((f=t.threadContext)==null?void 0:f.mode)==="reply"&&(y=t.threadContext)!=null&&y.parentComment?t.threadContext.parentComment.content:null},m=()=>{var y,M;if(!t)return null;const f=((M=(y=t.threadContext)==null?void 0:y.existingComments)==null?void 0:M.length)||0;return f===0?"No previous comments found":`${f} previous comment${f>1?"s":""} analyzed`},g=()=>{var y;if(!t)return null;const f=(y=t.threadContext)==null?void 0:y.existingComments;return!f||f.length===0?null:f.map((M,b)=>`${b+1}. ${M.authorName}: "${c(M.content,100)}"`).join(`

`)},k=()=>{if(!t)return null;const f=[];return t.authorName&&f.push(`Name: ${t.authorName}`),t.authorHeadline&&f.push(`Headline: ${t.authorHeadline}`),f.length>0?f.join(`
`):null},S=()=>n?"scanning":t!=null&&t.imageUrl?"success":"warning";return e.jsxs("div",{className:"context-awareness",children:[e.jsxs("div",{className:"context-header",children:[e.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("path",{d:"M12 16v-4M12 8h.01"})]}),e.jsx("span",{children:"Context Analysis"}),n&&e.jsx("span",{className:"scanning-badge",children:"Scanning"})]}),e.jsxs("div",{className:"context-timeline",children:[e.jsx(me,{icon:e.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),e.jsx("polyline",{points:"14 2 14 8 20 8"}),e.jsx("line",{x1:"16",y1:"13",x2:"8",y2:"13"}),e.jsx("line",{x1:"16",y1:"17",x2:"8",y2:"17"})]}),label:"Post Content",value:t?c(t.postContent,50):null,fullValue:(t==null?void 0:t.postContent)||null,status:r(),subLabel:"Unable to scrape post content"}),e.jsx(me,{icon:e.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"12",cy:"7",r:"4"})]}),label:"Author",value:t!=null&&t.authorName?`${t.authorName}${t.authorHeadline?` • ${c(t.authorHeadline,30)}`:""}`:null,fullValue:k(),status:s(),subLabel:"Author info not found"}),e.jsx(me,{icon:e.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("polyline",{points:"9 17 4 12 9 7"}),e.jsx("path",{d:"M20 18v-2a4 4 0 0 0-4-4H4"})]}),label:d()||"Thread Mode",value:p(),fullValue:u(),status:l()}),e.jsx(me,{icon:e.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"})}),label:"Discussion Context",value:m(),fullValue:g(),status:i()}),e.jsxs("div",{className:`context-item ${S()}`,children:[e.jsx("div",{className:"context-item-line"}),e.jsx("div",{className:"context-item-icon",children:e.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}),e.jsx("circle",{cx:"8.5",cy:"8.5",r:"1.5"}),e.jsx("polyline",{points:"21 15 16 10 5 21"})]})}),e.jsxs("div",{className:"context-item-content",children:[e.jsxs("div",{className:"context-item-header",children:[e.jsx("span",{className:"context-item-label",children:"Image Analysis"}),S()==="scanning"?e.jsx("div",{className:"context-status scanning",children:e.jsx("div",{className:"scan-spinner"})}):S()==="success"?e.jsx("div",{className:"context-status success",children:e.jsx("svg",{width:"10",height:"10",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})})}):e.jsx("div",{className:"context-status warning",children:e.jsx("svg",{width:"10",height:"10",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",children:e.jsx("path",{d:"M12 9v4M12 17h.01"})})}),(t==null?void 0:t.imageUrl)&&a&&e.jsxs("label",{className:"image-analysis-toggle",onClick:f=>f.stopPropagation(),children:[e.jsx("input",{type:"checkbox",checked:o??!1,onChange:f=>a(f.target.checked)}),e.jsx("span",{className:`mini-toggle ${o?"active":""}`})]})]}),S()==="scanning"?e.jsx("div",{className:"context-item-value scanning",children:"Scanning..."}):t!=null&&t.imageUrl?e.jsx("div",{className:"context-item-value",children:o?"Will analyze image":"Image skipped (click toggle)"}):e.jsx("div",{className:"context-item-value warning",children:"No image in post"})]})]})]})]})}function Te(){var t;try{return!!((t=chrome==null?void 0:chrome.runtime)!=null&&t.id)}catch{return!1}}async function he(t){if(console.log("[FloatingPanel] safeSendMessage called with type:",t.type),!Te())return console.error("[FloatingPanel] Extension context invalidated!"),{success:!1,error:"Extension was updated. Please refresh the page."};try{console.log("[FloatingPanel] Sending message to background script...");const n=await chrome.runtime.sendMessage(t);return console.log("[FloatingPanel] Received response from background:",n),n}catch(n){if(console.error("[FloatingPanel] Error sending message:",n),n instanceof Error&&(n.message.includes("Extension context invalidated")||n.message.includes("Receiving end does not exist")))return{success:!1,error:"Extension was updated. Please refresh the page."};throw n}}const st=[{value:"professional",label:"Professional"},{value:"funny",label:"Funny"},{value:"question",label:"Question"},{value:"agree-add-value",label:"Agree & Add Value"}];function rt({postData:t,isScanning:n=!1,onClose:o,onInsertComment:a}){const[c,r]=x.useState("generate"),[s,l]=x.useState("professional"),[i,d]=x.useState(""),[p,u]=x.useState(!1),[m,g]=x.useState([]),[k,S]=x.useState([]),[f,y]=x.useState(null),[M,b]=x.useState(null),[N,v]=x.useState(!1),[w,E]=x.useState(!0),[R,_]=x.useState(null),[P,I]=x.useState([]),[W,V]=x.useState(null),[le,ce]=x.useState(null),[C,T]=x.useState(!1),[O,F]=x.useState(!1),[G,te]=x.useState(!1),[J,Oe]=x.useState(!1),[re,Ve]=x.useState(null),Ge=!n&&t&&t.postContent&&N,de=x.useRef(null),Ue=()=>{const h=de.current;h&&(h.style.height="auto",h.style.height=`${Math.min(h.scrollHeight,120)}px`)},ue=x.useRef(null),H=x.useRef({isDragging:!1,startX:0,startY:0,initialX:0,initialY:0});x.useEffect(()=>{Ye(),xe()},[]),x.useEffect(()=>{t!=null&&t.imageUrl&&J&&te(!0)},[t==null?void 0:t.imageUrl,J]);const Ye=async()=>{var h;E(!0),_(null);try{const j=await he({type:"CHECK_CONFIG"});if(!j.success){v(!1),_(j.error||"Failed to check configuration"),E(!1);return}const A=j.settings;if(!A){v(!1),_("Settings not found. Please configure the extension in Settings."),E(!1);return}Ve({enableEmojis:A.enableEmojis??!1,languageLevel:A.languageLevel||"fluent",serviceDescription:A.serviceDescription||""});const B=A.persona&&A.persona.trim().length>0,L=A.apiKey&&A.apiKey.trim().length>0,$=B&&L;if(v($),F(!!((h=A.serviceDescription)!=null&&h.trim())),Oe(A.enableImageAnalysis??!1),te(A.enableImageAnalysis??!1),$)console.log("[FloatingPanel] Configuration check successful - extension ready");else{const q=[];B||q.push("persona"),L||q.push("API key"),_(`Please complete your setup in Settings: ${q.join(", ")}`)}}catch(j){console.error("[FloatingPanel] Configuration check failed:",j),v(!1),j!=null&&j.message?_(`Error: ${j.message}`):_("Failed to check configuration. Please try again.")}finally{E(!1)}},xe=async()=>{const h=await et();I(h)};x.useEffect(()=>{const h=ue.current;if(!h)return;const j=L=>{if(!L.target.closest(".panel-header"))return;H.current.isDragging=!0,H.current.startX=L.clientX,H.current.startY=L.clientY;const q=h.getBoundingClientRect();H.current.initialX=q.left,H.current.initialY=q.top,h.style.transition="none"},A=L=>{if(!H.current.isDragging)return;const $=L.clientX-H.current.startX,q=L.clientY-H.current.startY;h.style.right="auto",h.style.left=`${H.current.initialX+$}px`,h.style.top=`${H.current.initialY+q}px`},B=()=>{H.current.isDragging=!1,h.style.transition=""};return h.addEventListener("mousedown",j),document.addEventListener("mousemove",A),document.addEventListener("mouseup",B),()=>{h.removeEventListener("mousedown",j),document.removeEventListener("mousemove",A),document.removeEventListener("mouseup",B)}},[]);const Xe=async()=>{var h;if(!t){b("No post data available. Please try again.");return}if(!re||!N){b("Configuration not ready. Please wait...");return}u(!0),b(null),g([]),S([]);try{const j={type:"GENERATE_COMMENTS",payload:{postData:t,tone:s,enableEmojis:re.enableEmojis,languageLevel:re.languageLevel,userThoughts:i.trim()||void 0,enableImageAnalysis:G&&!!(t!=null&&t.imageUrl),includeServiceOffer:C&&!!((h=re.serviceDescription)!=null&&h.trim()),serviceDescription:C?re.serviceDescription:void 0}},A=await he(j);A.success?A.scoredComments&&A.scoredComments.length>0?(S(A.scoredComments),g(A.scoredComments.map(B=>B.text))):A.comments&&g(A.comments):b(A.error||"Failed to generate comments")}catch(j){b(j instanceof Error?j.message:"An unexpected error occurred")}finally{u(!1)}},Ie=async(h,j)=>{y(h);try{const B={type:"REFINE_COMMENT",payload:{comment:k.length>0?k[h].text:m[h],refinementType:j}},L=await he(B);if(L.success&&L.comment){if(k.length>0){const q=[...k];q[h]={...q[h],text:L.comment},S(q)}const $=[...m];$[h]=L.comment,g($)}else L.error&&b(L.error)}catch(A){console.error("Refine error:",A)}finally{y(null)}},Me=async(h,j,A)=>{try{await navigator.clipboard.writeText(h),j!==void 0&&(V(j),setTimeout(()=>V(null),2e3)),A&&(ce(A),setTimeout(()=>ce(null),2e3))}catch(B){console.error("Copy failed:",B)}},Ke=async(h,j)=>{var B;t&&await tt(h,t.postContent);const A=j!==void 0&&(((B=k[j])==null?void 0:B.text)||m[j])||h;a(h),he({type:"STREAM_UPDATE_PERSONA",payload:{originalAiSuggestion:A,finalUserVersion:h}}).catch(L=>{console.error("[FloatingPanel] Persona update error:",L)}),xe()},Je=async()=>{await nt(),I([])},Qe=()=>{if(Te())try{chrome.runtime.sendMessage({type:"OPEN_OPTIONS"})}catch{b("Extension was updated. Please refresh the page.")}else b("Extension was updated. Please refresh the page.")},Ze=(h,j)=>h.length<=j?h:h.slice(0,j)+"...",De=h=>{const j=new Date(h),B=new Date().getTime()-j.getTime(),L=Math.floor(B/6e4),$=Math.floor(B/36e5),q=Math.floor(B/864e5);return L<1?"Just now":L<60?`${L}m ago`:$<24?`${$}h ago`:q<7?`${q}d ago`:j.toLocaleDateString()};return w?e.jsxs("div",{className:"panel",ref:ue,children:[e.jsxs("div",{className:"panel-header",children:[e.jsxs("div",{className:"panel-title",children:[e.jsx("div",{className:"panel-icon",children:e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"})})}),e.jsx("span",{children:"AI Comment Assistant"})]}),e.jsx("button",{className:"close-btn",onClick:o,children:e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})})]}),e.jsx("div",{className:"panel-content",children:e.jsxs("div",{className:"no-api-key",children:[e.jsx("div",{className:"no-api-key-icon",children:e.jsx("div",{className:"w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"})}),e.jsx("h3",{children:"Checking Configuration..."}),e.jsx("p",{children:"Verifying your setup"})]})})]}):N?e.jsx(e.Fragment,{children:e.jsxs("div",{className:"panel",ref:ue,children:[e.jsxs("div",{className:"panel-header",children:[e.jsxs("div",{className:"panel-title",children:[e.jsx("div",{className:"panel-icon",children:e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"})})}),e.jsx("span",{children:"AI Comment Assistant"})]}),e.jsx("button",{className:"close-btn",onClick:o,children:e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})})]}),e.jsxs("div",{className:"tabs",children:[e.jsxs("button",{className:`tab ${c==="generate"?"active":""}`,onClick:()=>r("generate"),children:[e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("polygon",{points:"13 2 3 14 12 14 11 22 21 10 12 10 13 2"})}),"Generate"]}),e.jsxs("button",{className:`tab ${c==="history"?"active":""}`,onClick:()=>{r("history"),xe()},children:[e.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("polyline",{points:"12 6 12 12 16 14"})]}),"History"]})]}),e.jsx(ot,{postData:t,isScanning:n,analyzeImage:G,onAnalyzeImageChange:te}),e.jsx("div",{className:"panel-content",children:c==="generate"?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"section",children:[e.jsxs("div",{className:"section-label",children:["Your key point ",e.jsx("span",{className:"optional-label",children:"(optional)"})]}),e.jsxs("div",{className:"thoughts-input-wrapper",children:[e.jsx("textarea",{ref:de,className:"thoughts-input",value:i,onChange:h=>{d(h.target.value),Ue()},placeholder:"e.g., Mention that we just launched a similar feature, or ask about their pricing model...",rows:2}),i&&e.jsx("button",{className:"clear-thoughts-btn",onClick:()=>{d(""),de.current&&(de.current.style.height="auto")},title:"Clear",children:e.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})})]})]}),e.jsx("div",{className:"section",children:e.jsxs("label",{className:`service-offer-toggle ${O?"":"disabled"}`,children:[e.jsxs("div",{className:"toggle-left",children:[e.jsx("div",{className:"toggle-icon",children:e.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"2",y:"7",width:"20",height:"14",rx:"2",ry:"2"}),e.jsx("path",{d:"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"})]})}),e.jsxs("div",{className:"toggle-text",children:[e.jsx("span",{className:"toggle-label",children:"Include Service Offer"}),O?e.jsx("span",{className:"toggle-hint",children:"Subtly promote your expertise"}):e.jsx("span",{className:"toggle-hint warning",children:"Configure in Settings first"})]})]}),e.jsx("input",{type:"checkbox",checked:C,onChange:h=>T(h.target.checked),disabled:!O,className:"toggle-checkbox"}),e.jsx("span",{className:`toggle-switch ${C?"active":""}`})]})}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-label",children:"Tone"}),e.jsx("select",{className:"tone-select",value:s,onChange:h=>l(h.target.value),children:st.map(h=>e.jsx("option",{value:h.value,children:h.label},h.value))})]}),e.jsx("div",{className:"section",children:e.jsx("button",{className:"generate-btn",onClick:Xe,disabled:!Ge||p,children:n?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"spinner"}),"Scanning Context..."]}):p?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"spinner"}),"Generating..."]}):t?e.jsxs(e.Fragment,{children:[e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("polygon",{points:"13 2 3 14 12 14 11 22 21 10 12 10 13 2"})}),"Generate Comments"]}):e.jsxs(e.Fragment,{children:[e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("path",{d:"M12 8v4M12 16h.01"})]}),"Waiting for Context..."]})})}),p&&e.jsxs("div",{className:"shimmer-container",children:[e.jsxs("div",{className:"shimmer-card",children:[e.jsx("div",{className:"shimmer-line long"}),e.jsx("div",{className:"shimmer-line medium"}),e.jsx("div",{className:"shimmer-line short"})]}),e.jsxs("div",{className:"shimmer-card",children:[e.jsx("div",{className:"shimmer-line long"}),e.jsx("div",{className:"shimmer-line medium"})]}),e.jsxs("div",{className:"shimmer-card",children:[e.jsx("div",{className:"shimmer-line medium"}),e.jsx("div",{className:"shimmer-line long"})]})]}),M&&e.jsxs("div",{className:"error-message",children:[e.jsxs("svg",{className:"error-icon",width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),e.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]}),e.jsx("span",{children:M})]}),m.length>0&&!p&&e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-label",children:"Generated Comments"}),e.jsx("div",{className:"results",children:m.map((h,j)=>{const A=k[j];return e.jsxs("div",{className:`comment-card ${f===j?"refining":""}`,children:[(A==null?void 0:A.recommendationTag)&&e.jsx("div",{className:"recommendation-tag",children:A.recommendationTag}),e.jsx("div",{className:"comment-text",children:h}),e.jsxs("div",{className:"comment-actions",children:[e.jsxs("div",{className:"action-group",children:[e.jsx("button",{className:"action-btn refine-btn",onClick:()=>Ie(j,"concise"),disabled:f!==null,title:"Make more concise",children:f===j?e.jsx("div",{className:"spinner-small"}):e.jsxs(e.Fragment,{children:[e.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M4 12h16M4 12l4-4M4 12l4 4M20 12l-4-4M20 12l-4 4"})}),e.jsx("span",{children:"Shorter"})]})}),e.jsx("button",{className:"action-btn refine-btn",onClick:()=>Ie(j,"rephrase"),disabled:f!==null,title:"Rephrase",children:f===j?e.jsx("div",{className:"spinner-small"}):e.jsxs(e.Fragment,{children:[e.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M1 4v6h6"}),e.jsx("path",{d:"M3.51 15a9 9 0 1 0 2.13-9.36L1 10"})]}),e.jsx("span",{children:"Rephrase"})]})})]}),e.jsxs("div",{className:"action-group",children:[e.jsx("button",{className:`action-btn ${W===j?"copied":""}`,onClick:()=>Me(h,j),title:"Copy to clipboard",children:W===j?e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})}):e.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}),e.jsx("path",{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"})]})}),e.jsxs("button",{className:"insert-btn",onClick:()=>Ke(h,j),title:"Insert into comment box",children:[e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M5 12h14M12 5l7 7-7 7"})}),"Insert"]})]})]})]},j)})})]})]}):e.jsx("div",{className:"history-section",children:P.length===0?e.jsxs("div",{className:"empty-history",children:[e.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("polyline",{points:"12 6 12 12 16 14"})]}),e.jsx("p",{children:"No comments in history yet."}),e.jsx("span",{children:"Generated comments will appear here."})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"history-header",children:[e.jsxs("span",{className:"history-count",children:[P.length," recent comments"]}),e.jsxs("button",{className:"clear-history-btn",onClick:Je,children:[e.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("polyline",{points:"3 6 5 6 21 6"}),e.jsx("path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"})]}),"Clear"]})]}),e.jsx("div",{className:"history-list",children:P.map(h=>e.jsxs("div",{className:"history-item",children:[e.jsxs("div",{className:"history-meta",children:[e.jsx("span",{className:"history-time",children:De(h.timestamp)}),e.jsx("span",{className:"history-post",children:Ze(h.postPreview,30)})]}),e.jsx("div",{className:"history-comment",children:h.comment}),e.jsxs("div",{className:"history-actions",children:[e.jsx("button",{className:`action-btn ${le===h.id?"copied":""}`,onClick:()=>Me(h.comment,void 0,h.id),children:le===h.id?e.jsxs(e.Fragment,{children:[e.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})}),"Copied"]}):e.jsxs(e.Fragment,{children:[e.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}),e.jsx("path",{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"})]}),"Copy"]})}),e.jsxs("button",{className:"insert-btn",onClick:()=>a(h.comment),children:[e.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M5 12h14M12 5l7 7-7 7"})}),"Insert"]})]})]},h.id))})]})})}),e.jsxs("div",{className:"panel-footer",children:[e.jsx("span",{children:"Supported by "}),e.jsx("a",{href:"https://travel-code.com/",target:"_blank",rel:"noopener noreferrer",className:"sponsor-link",children:"Travel Code"}),e.jsx("span",{children:" — AI-powered corporate travel platform. Managing all corporate travel in one place."})]})]})}):e.jsx(e.Fragment,{children:e.jsxs("div",{className:"panel",ref:ue,children:[e.jsxs("div",{className:"panel-header",children:[e.jsxs("div",{className:"panel-title",children:[e.jsx("div",{className:"panel-icon",children:e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"})})}),e.jsx("span",{children:"AI Comment Assistant"})]}),e.jsx("button",{className:"close-btn",onClick:o,children:e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})})]}),e.jsx("div",{className:"panel-content",children:e.jsxs("div",{className:"no-api-key",children:[e.jsx("div",{className:"no-api-key-icon",children:e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"})})}),e.jsx("h3",{children:"Setup Required"}),e.jsx("p",{children:R||"Please complete your setup in Settings"}),e.jsxs("button",{className:"settings-btn",onClick:Qe,children:[e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"12",r:"3"}),e.jsx("path",{d:"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"})]}),"Open Settings"]})]})}),e.jsxs("div",{className:"panel-footer",children:[e.jsx("span",{children:"Supported by "}),e.jsx("a",{href:"https://travel-code.com/",target:"_blank",rel:"noopener noreferrer",className:"sponsor-link",children:"Travel Code"}),e.jsx("span",{children:" — AI-powered corporate travel platform. Managing all corporate travel in one place."})]})]})})}const it=[{value:"friendly",label:"Friendly"},{value:"professional",label:"Professional"},{value:"follow-up",label:"Follow-up"},{value:"closing-deal",label:"Closing Deal"},{value:"networking",label:"Networking"}];function Le(){var t;try{return!!((t=chrome==null?void 0:chrome.runtime)!=null&&t.id)}catch{return!1}}async function at(t){if(!Le())return{success:!1,error:"Extension was updated. Please refresh the page."};try{return await chrome.runtime.sendMessage(t)}catch(n){if(n instanceof Error&&(n.message.includes("Extension context invalidated")||n.message.includes("Receiving end does not exist")))return{success:!1,error:"Extension was updated. Please refresh the page."};throw n}}function lt({conversationContext:t,isScanning:n=!1,onClose:o,onInsertReply:a}){const[c,r]=x.useState("friendly"),[s,l]=x.useState(""),[i,d]=x.useState(!1),[p,u]=x.useState([]),[m,g]=x.useState(null),[k,S]=x.useState(null),[f,y]=x.useState(!0),[M,b]=x.useState(null),[N,v]=x.useState(!1),[w,E]=x.useState(!1),R=!n&&t&&t.messages.length>0&&f,_=x.useRef(null),P=x.useRef(null),I=x.useRef({isDragging:!1,startX:0,startY:0,initialX:0,initialY:0});x.useEffect(()=>{Ee().then(C=>{var T;y(!!C.apiKey),E(!!((T=C.serviceDescription)!=null&&T.trim()))})},[]);const W=()=>{const C=_.current;C&&(C.style.height="auto",C.style.height=`${Math.min(C.scrollHeight,120)}px`)};x.useEffect(()=>{const C=P.current;if(!C)return;const T=G=>{if(!G.target.closest(".panel-header"))return;I.current.isDragging=!0,I.current.startX=G.clientX,I.current.startY=G.clientY;const J=C.getBoundingClientRect();I.current.initialX=J.left,I.current.initialY=J.top,C.style.transition="none"},O=G=>{if(!I.current.isDragging)return;const te=G.clientX-I.current.startX,J=G.clientY-I.current.startY;C.style.right="auto",C.style.left=`${I.current.initialX+te}px`,C.style.top=`${I.current.initialY+J}px`},F=()=>{I.current.isDragging=!1,C.style.transition=""};return C.addEventListener("mousedown",T),document.addEventListener("mousemove",O),document.addEventListener("mouseup",F),()=>{C.removeEventListener("mousedown",T),document.removeEventListener("mousemove",O),document.removeEventListener("mouseup",F)}},[]);const V=async()=>{var C;if(!t){S("No conversation context available.");return}d(!0),S(null),u([]),g(null);try{const T=await Ee();if(!T.apiKey){y(!1);return}const O={type:"GENERATE_MESSAGES",payload:{conversationContext:t,tone:c,persona:T.persona,enableEmojis:T.enableEmojis??!1,languageLevel:T.languageLevel||"fluent",userThoughts:s.trim()||void 0,includeServiceOffer:N&&!!((C=T.serviceDescription)!=null&&C.trim()),serviceDescription:N?T.serviceDescription:void 0}},F=await at(O);F.success&&F.replies?(u(F.replies),F.summary&&g(F.summary)):S(F.error||"Failed to generate replies")}catch(T){S(T instanceof Error?T.message:"An unexpected error occurred")}finally{d(!1)}},le=async(C,T)=>{try{await navigator.clipboard.writeText(C),b(T),setTimeout(()=>b(null),2e3)}catch(O){console.error("Copy failed:",O)}},ce=()=>{if(Le())try{chrome.runtime.sendMessage({type:"OPEN_OPTIONS"})}catch{S("Extension was updated. Please refresh the page.")}else S("Extension was updated. Please refresh the page.")};return f?e.jsxs("div",{className:"panel messaging-panel",ref:P,children:[e.jsxs("div",{className:"panel-header",children:[e.jsxs("div",{className:"panel-title",children:[e.jsx("div",{className:"panel-icon messaging",children:e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"})})}),e.jsx("span",{children:"Conversation Co-pilot"})]}),e.jsx("button",{className:"close-btn",onClick:o,children:e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})})]}),e.jsx("div",{className:"messaging-context",children:n?e.jsxs("div",{className:"context-scanning",children:[e.jsx("div",{className:"spinner-small"}),e.jsx("span",{children:"Analyzing conversation..."})]}):t?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"context-participant",children:[e.jsx("span",{className:"context-label",children:"Chatting with:"}),e.jsx("span",{className:"context-value",children:t.participantName})]}),t.participantHeadline&&e.jsx("div",{className:"context-headline",children:t.participantHeadline}),e.jsxs("div",{className:"context-stats",children:[e.jsxs("span",{className:"stat",children:[e.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"})}),t.messages.length," messages"]}),e.jsxs("span",{className:"stat",children:[e.jsx("span",{className:`sentiment-dot ${t.sentiment}`}),t.sentiment]})]}),m&&e.jsxs("div",{className:"ai-summary",children:[e.jsx("div",{className:"summary-topic",children:m.topic}),e.jsxs("div",{className:"summary-action",children:[e.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("polygon",{points:"13 2 3 14 12 14 11 22 21 10 12 10 13 2"})}),m.suggestedAction]})]})]}):e.jsxs("div",{className:"context-empty",children:[e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("path",{d:"M12 8v4M12 16h.01"})]}),e.jsx("span",{children:"Open a conversation to get started"})]})}),e.jsxs("div",{className:"panel-content",children:[e.jsxs("div",{className:"section",children:[e.jsxs("div",{className:"section-label",children:["Your goal for this reply ",e.jsx("span",{className:"optional-label",children:"(optional)"})]}),e.jsxs("div",{className:"thoughts-input-wrapper",children:[e.jsx("textarea",{ref:_,className:"thoughts-input",value:s,onChange:C=>{l(C.target.value),W()},placeholder:"e.g., Schedule a call for next week, or ask about their budget...",rows:2}),s&&e.jsx("button",{className:"clear-thoughts-btn",onClick:()=>{l(""),_.current&&(_.current.style.height="auto")},title:"Clear",children:e.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})})]})]}),e.jsx("div",{className:"section",children:e.jsxs("label",{className:`service-offer-toggle ${w?"":"disabled"}`,children:[e.jsxs("div",{className:"toggle-left",children:[e.jsx("div",{className:"toggle-icon",children:e.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"2",y:"7",width:"20",height:"14",rx:"2",ry:"2"}),e.jsx("path",{d:"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"})]})}),e.jsxs("div",{className:"toggle-text",children:[e.jsx("span",{className:"toggle-label",children:"Include Service Offer"}),w?e.jsx("span",{className:"toggle-hint",children:"Subtly mention your expertise"}):e.jsx("span",{className:"toggle-hint warning",children:"Configure in Settings first"})]})]}),e.jsx("input",{type:"checkbox",checked:N,onChange:C=>v(C.target.checked),disabled:!w,className:"toggle-checkbox"}),e.jsx("span",{className:`toggle-switch ${N?"active":""}`})]})}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-label",children:"Conversation Tone"}),e.jsx("select",{className:"tone-select",value:c,onChange:C=>r(C.target.value),children:it.map(C=>e.jsx("option",{value:C.value,children:C.label},C.value))})]}),e.jsx("div",{className:"section",children:e.jsx("button",{className:"generate-btn",onClick:V,disabled:!R||i,children:n?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"spinner"}),"Analyzing Chat..."]}):i?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"spinner"}),"Crafting Replies..."]}):t?e.jsxs(e.Fragment,{children:[e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("polygon",{points:"13 2 3 14 12 14 11 22 21 10 12 10 13 2"})}),"Suggest Replies"]}):e.jsxs(e.Fragment,{children:[e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"})}),"Open a Conversation"]})})}),i&&e.jsxs("div",{className:"shimmer-container",children:[e.jsxs("div",{className:"shimmer-card",children:[e.jsx("div",{className:"shimmer-line long"}),e.jsx("div",{className:"shimmer-line short"})]}),e.jsxs("div",{className:"shimmer-card",children:[e.jsx("div",{className:"shimmer-line medium"}),e.jsx("div",{className:"shimmer-line long"})]})]}),k&&e.jsxs("div",{className:"error-message",children:[e.jsxs("svg",{className:"error-icon",width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),e.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]}),e.jsx("span",{children:k})]}),p.length>0&&!i&&e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-label",children:"Suggested Replies"}),e.jsx("div",{className:"results",children:p.map((C,T)=>e.jsxs("div",{className:"comment-card",children:[e.jsx("div",{className:"recommendation-tag",children:C.recommendationTag}),e.jsx("div",{className:"comment-text",children:C.text}),e.jsx("div",{className:"comment-actions",children:e.jsxs("div",{className:"action-group",children:[e.jsx("button",{className:`action-btn ${M===T?"copied":""}`,onClick:()=>le(C.text,T),title:"Copy to clipboard",children:M===T?e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})}):e.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}),e.jsx("path",{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"})]})}),e.jsxs("button",{className:"insert-btn",onClick:()=>a(C.text),title:"Insert into message box",children:[e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M5 12h14M12 5l7 7-7 7"})}),"Send"]})]})})]},T))})]})]}),e.jsxs("div",{className:"panel-footer",children:[e.jsx("span",{children:"Supported by "}),e.jsx("a",{href:"https://travel-code.com/",target:"_blank",rel:"noopener noreferrer",className:"sponsor-link",children:"Travel Code"}),e.jsx("span",{children:" — AI-powered corporate travel platform. Managing all corporate travel in one place."})]})]}):e.jsxs("div",{className:"panel messaging-panel",ref:P,children:[e.jsxs("div",{className:"panel-header",children:[e.jsxs("div",{className:"panel-title",children:[e.jsx("div",{className:"panel-icon messaging",children:e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"})})}),e.jsx("span",{children:"Conversation Co-pilot"})]}),e.jsx("button",{className:"close-btn",onClick:o,children:e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})})]}),e.jsx("div",{className:"panel-content",children:e.jsxs("div",{className:"no-api-key",children:[e.jsx("div",{className:"no-api-key-icon",children:e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"})})}),e.jsx("h3",{children:"API Key Required"}),e.jsx("p",{children:"Please configure your API key in the extension settings."}),e.jsx("button",{className:"settings-btn",onClick:ce,children:"Open Settings"})]})}),e.jsxs("div",{className:"panel-footer",children:[e.jsx("span",{children:"Supported by "}),e.jsx("a",{href:"https://travel-code.com/",target:"_blank",rel:"noopener noreferrer",className:"sponsor-link",children:"Travel Code"}),e.jsx("span",{children:" — AI-powered corporate travel platform. Managing all corporate travel in one place."})]})]})}const _e={"business-mistake":{name:"Business Mistake & Lesson",prompt:"Write a post about a business mistake and lessons learned — in the style of a founder who honestly documents their journey. Format: hook → crisis → solution → key takeaway."}},ct=[{value:"professional",label:"Professional"},{value:"raw",label:"Raw/Authentic"},{value:"bold",label:"Bold"}];function dt(){var t;try{return!!((t=chrome==null?void 0:chrome.runtime)!=null&&t.id)}catch{return!1}}async function ut(t){if(!dt())return{success:!1,error:"Extension was updated. Please refresh the page."};try{return await chrome.runtime.sendMessage(t)}catch(n){if(console.error("[PostAssistant] Error sending message:",n),n instanceof Error&&(n.message.includes("Extension context invalidated")||n.message.includes("Receiving end does not exist")))return{success:!1,error:"Extension was updated. Please refresh the page."};throw n}}function mt({onClose:t,onInsertPost:n}){const[o,a]=x.useState("business-mistake"),[c,r]=x.useState(""),[s,l]=x.useState(""),[i,d]=x.useState("raw"),[p,u]=x.useState(!1),[m,g]=x.useState(null),[k,S]=x.useState(null),[f,y]=x.useState(null),M=async()=>{var v;u(!0),y(null),g(null);try{let w="";o==="business-mistake"?w=_e["business-mistake"].prompt:c.trim()?w=c.trim():w="Write a post about a business mistake and lessons learned — in the style of a founder who honestly documents their journey. Format: hook → crisis → solution → key takeaway.",console.log("[PostAssistant] Sending request:",{topic:w,tone:i,keyPoints:s.trim()||void 0});const E=await ut({type:"generate-post",data:{topic:w,tone:i,keyPoints:s.trim()||void 0}});if(console.log("[PostAssistant] Received response:",E),E.success&&((v=E.data)!=null&&v.post))g(E.data.post),S(E.data.originalPost||E.data.post);else{const R=E.error||"Failed to generate post";console.error("[PostAssistant] Error:",R),y(R)}}catch(w){y(w.message||"An error occurred")}finally{u(!1)}},b=()=>{m&&(n(m),t())},N=v=>{if(!v)return"";const R=(P=>{const I=document.createElement("div");return I.textContent=P,I.innerHTML})(v).split(`
`),_=[];for(let P=0;P<R.length;P++){let I=R[P];const W=I.trim();if(W===""){_.push("<br/>");continue}if(W.startsWith("### ")){_.push(`<h3>${W.substring(4)}</h3>`);continue}if(W.startsWith("## ")){_.push(`<h2>${W.substring(3)}</h2>`);continue}if(W.startsWith("# ")){_.push(`<h1>${W.substring(2)}</h1>`);continue}I=I.replace(/\*\*([^*]+?)\*\*/g,"<strong>$1</strong>"),I=I.replace(/__([^_]+?)__/g,"<strong>$1</strong>"),I=I.replace(new RegExp("(?<!\\*)\\*([^*]+?)\\*(?!\\*)","g"),"<em>$1</em>"),I=I.replace(new RegExp("(?<!_)_([^_]+?)_(?!_)","g"),"<em>$1</em>"),I=I.replace(/#(\w+)/g,'<span style="color: #70b5f9; font-weight: 600;">#$1</span>'),_.push(`<p>${I}</p>`)}return _.join("")};return e.jsxs("div",{className:"panel",children:[e.jsxs("div",{className:"panel-header",children:[e.jsxs("div",{className:"panel-title",children:[e.jsx("div",{className:"panel-icon",children:e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"}),e.jsx("circle",{cx:"7.5",cy:"14.5",r:"1.5"}),e.jsx("circle",{cx:"16.5",cy:"14.5",r:"1.5"})]})}),e.jsx("span",{children:"Post Assistant"})]}),e.jsx("button",{className:"close-btn",onClick:t,title:"Close",children:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})})]}),e.jsxs("div",{className:"panel-content",children:[e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-label",children:"Template"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px"},children:[e.jsx("button",{onClick:()=>a("business-mistake"),style:{padding:"12px",background:o==="business-mistake"?"rgba(10, 102, 194, 0.2)":"rgba(255, 255, 255, 0.05)",border:`1px solid ${o==="business-mistake"?"rgba(10, 102, 194, 0.4)":"rgba(255, 255, 255, 0.1)"}`,borderRadius:"10px",color:"#fff",cursor:"pointer",textAlign:"left",fontSize:"13px",fontWeight:o==="business-mistake"?600:400},children:_e["business-mistake"].name}),e.jsx("button",{onClick:()=>a("custom"),style:{padding:"12px",background:o==="custom"?"rgba(10, 102, 194, 0.2)":"rgba(255, 255, 255, 0.05)",border:`1px solid ${o==="custom"?"rgba(10, 102, 194, 0.4)":"rgba(255, 255, 255, 0.1)"}`,borderRadius:"10px",color:"#fff",cursor:"pointer",textAlign:"left",fontSize:"13px",fontWeight:o==="custom"?600:400},children:"Custom Topic"})]})]}),o==="custom"&&e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-label",children:"Topic"}),e.jsx("textarea",{className:"thoughts-input",placeholder:"Write about our new update, My thoughts on AI, etc.",value:c,onChange:v=>r(v.target.value),rows:3})]}),e.jsxs("div",{className:"section",children:[e.jsxs("div",{className:"section-label",children:["Key Points ",e.jsx("span",{className:"optional-label",children:"(optional)"})]}),e.jsx("textarea",{className:"thoughts-input",placeholder:"Add context, specific points, or details you want to include in the post...",value:s,onChange:v=>l(v.target.value),rows:3})]}),e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-label",children:"Tone"}),e.jsx("select",{className:"tone-select",value:i,onChange:v=>d(v.target.value),children:ct.map(v=>e.jsx("option",{value:v.value,children:v.label},v.value))})]}),e.jsx("button",{className:"generate-btn",onClick:M,disabled:p||o==="custom"&&!c.trim(),children:p?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"spinner"}),"Generating..."]}):e.jsxs(e.Fragment,{children:[e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M13 2L3 14h9l-1 8 10-12h-9l1-8z"})}),"Generate Post"]})}),f&&e.jsxs("div",{className:"error-message",children:[e.jsxs("svg",{className:"error-icon",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("path",{d:"M12 8v4M12 16h.01"})]}),e.jsx("span",{children:f})]}),m&&e.jsxs("div",{className:"section",children:[e.jsx("div",{className:"section-label",style:{marginBottom:"12px",fontSize:"14px",fontWeight:600},children:"Generated Post"}),e.jsx("div",{className:"post-preview",style:{maxHeight:"300px",overflowY:"auto",padding:"16px",background:"rgba(255, 255, 255, 0.03)",border:"1px solid rgba(255, 255, 255, 0.1)",borderRadius:"8px",fontSize:"14px",lineHeight:"1.6",color:"#fff",wordWrap:"break-word",fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'},dangerouslySetInnerHTML:{__html:N(k||m)}}),e.jsxs("button",{className:"insert-btn",onClick:b,style:{marginTop:"16px",width:"100%",padding:"12px 16px",background:"linear-gradient(135deg, #0a66c2 0%, #004182 100%)",border:"none",borderRadius:"8px",color:"#fff",fontSize:"14px",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",transition:"all 0.2s ease"},onMouseEnter:v=>{v.currentTarget.style.background="linear-gradient(135deg, #004182 0%, #0a66c2 100%)",v.currentTarget.style.transform="translateY(-1px)"},onMouseLeave:v=>{v.currentTarget.style.background="linear-gradient(135deg, #0a66c2 0%, #004182 100%)",v.currentTarget.style.transform="translateY(0)"},children:[e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("path",{d:"M12 5v14M5 12l7-7 7 7"})}),"Insert into Post"]})]})]})]})}function Re(t){const n=document.createElement("button");return n.className="lai-ai-button",n.setAttribute("aria-label","Generate AI Comment"),n.innerHTML=`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
      <circle cx="7.5" cy="14.5" r="1.5"/>
      <circle cx="16.5" cy="14.5" r="1.5"/>
    </svg>
  `,n.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),t()}),n}function se(t,n){for(const o of n)try{const a=t.querySelector(o);if(a)return a}catch{console.warn(`[LinkedIn AI] Invalid selector: ${o}`)}return null}function X(t,n){const o=[],a=new Set;for(const c of n)try{t.querySelectorAll(c).forEach(s=>{a.has(s)||(a.add(s),o.push(s))})}catch{}return o}function be(t){let n=t.parentElement;for(;n;){if(n.querySelectorAll('[data-view-name="reaction-button"], [data-view-name="feed-comment-button"], [data-view-name="feed-share-button"], [data-view-name="feed-send-as-message-button"]').length>=3)return n;const a=n.querySelectorAll("button");let c=0;if(a.forEach(r=>{var l;const s=(l=r.textContent)==null?void 0:l.trim();["Like","Comment","Repost","Send"].includes(s||"")&&c++}),c>=3)return n;n=n.parentElement}return null}function ht(){const t=document.querySelectorAll('[data-view-name="feed-full-update"]');return t.length>0?Array.from(t):X(document,[".feed-shared-update-v2",".occludable-update",'[data-urn*="activity"]','[data-urn*="ugcPost"]'])}function Be(t){var c;const n=t.querySelector('[data-view-name="feed-comment-button"]');if(n)return be(n);const o=t.querySelectorAll("button");for(const r of o)if(((c=r.textContent)==null?void 0:c.trim())==="Comment")return be(r);const a=t.querySelector('[data-view-name="reaction-button"]');return a?be(a):se(t,[".social-actions-button",".feed-shared-social-action-bar",".social-details-social-activity",'[class*="social-actions"]'])}function oe(t){let n=t.trim();return n=n.replace(/…?see (more|less)/gi,""),n=n.replace(/…?\s*more\s*$/gi,""),n=n.replace(/…?voir (plus|moins)/gi,""),n=n.replace(/…?mehr (anzeigen|ausblenden)/gi,""),n=n.replace(/…?ещё/gi,""),n=n.replace(/…?больше/gi,""),n=n.replace(/…?mostrar (más|menos)/gi,""),n=n.replace(/[\d,.]+ (reactions?|likes?|comments?|reposts?|shares?)/gi,""),n=n.replace(/\b(Like|Comment|Repost|Send|Share|Reply)\b\s*/g,(o,a)=>/^\s*$/.test(n.substring(n.indexOf(o)-5,n.indexOf(o)))?"":o),n=n.replace(/\s+/g," ").trim(),n}function pt(t){const n=t.querySelectorAll('[data-view-name="feed-commentary"]');if(n.length>0){const l=[];for(const i of n){let d=!1,p=i.parentElement;for(let u=0;u<8&&!(!p||p===t);u++){if(Array.from(p.querySelectorAll("button")).find(g=>{var k;return((k=g.textContent)==null?void 0:k.trim())==="Reply"})){d=!0;break}p=p.parentElement}d||l.push(i)}if(l.length>0){let d=l[0].parentElement;for(;d&&d!==t;){const m=d.querySelectorAll('[data-view-name="feed-commentary"]'),g=Array.from(d.querySelectorAll("button")).some(k=>{var S;return((S=k.textContent)==null?void 0:S.trim())==="Reply"});if(m.length>=l.length&&!g)break;d=d.parentElement}if(d&&d!==t){const m=oe(d.textContent||"");if(m.length>10)return m}const p=[];l.forEach(m=>{var k;const g=(k=m.textContent)==null?void 0:k.trim();g&&p.push(g)});const u=oe(p.join(`
`));if(u.length>10)return u}}const o=Be(t);if(o){let l=o.previousElementSibling;for(;l;){const i=oe(l.textContent||""),d=l.querySelectorAll("img").length>0,p=i.length;if(p>30&&(!d||p>100))return i;l=l.previousElementSibling}}const a=se(t,['[class*="update-components-text"]',".feed-shared-update-v2__description",".feed-shared-text",".feed-shared-inline-show-more-text",".break-words",'[data-test-id="main-feed-activity-card__commentary"]']);if(a){const l=oe(a.textContent||"");if(l.length>10)return l}let c="",r=0;const s=t.children;for(let l=0;l<s.length;l++){const i=s[l];if(i===o||i.contains(o)||Array.from(i.querySelectorAll("button")).some(u=>{var m;return((m=u.textContent)==null?void 0:m.trim())==="Reply"}))continue;const p=oe(i.textContent||"");p.length>r&&p.length>30&&(c=p,r=p.length)}return c||""}function ye(t){var a,c;let n=!1;if(t.querySelectorAll('button, span[role="button"], a[role="button"], span.see-more, a.see-more').forEach(r=>{var i,d,p;const s=((i=r.textContent)==null?void 0:i.trim().toLowerCase())||"",l=((d=r.getAttribute("aria-label"))==null?void 0:d.toLowerCase())||"";(s==="more"||s==="...more"||s==="…more"||s==="…ещё"||s==="ещё"||s.includes("see more")||s.includes("show more")||s.includes("voir plus")||s.includes("mehr anzeigen")||s.includes("mostrar más")||s.includes("больше")||l.includes("see more")||l.includes("show more")||l.includes("expand"))&&(Array.from(((p=r.parentElement)==null?void 0:p.querySelectorAll("button"))||[]).some(m=>{var g;return((g=m.textContent)==null?void 0:g.trim())==="Reply"&&m!==r})||(r.click(),n=!0,console.log('[LinkedIn AI] Expanded "see more" text')))}),!n){const r=t.querySelectorAll('[data-view-name="feed-commentary"]');for(const s of r){const l=s.parentElement;if(l){const i=l.querySelector('button, span[role="button"]');i&&((a=i.textContent)!=null&&a.trim().toLowerCase().includes("more")||(c=i.textContent)!=null&&c.trim().toLowerCase().includes("ещё"))&&(i.click(),n=!0,console.log("[LinkedIn AI] Expanded truncated commentary"))}}}return n||X(t,[".feed-shared-inline-show-more-text__see-more-less-toggle",".see-more",'[data-control-name="see_more"]','button[aria-label*="see more"]','button[aria-label*="Show more"]']).forEach(s=>{s.click(),n=!0}),n}async function gt(t){ye(t)&&(await new Promise(a=>setTimeout(a,500)),ye(t)&&await new Promise(a=>setTimeout(a,300)))}function ft(t){var r,s,l,i,d,p,u,m,g,k,S,f,y,M;const n=t.querySelector('[data-view-name="feed-actor-image"]');if(n){const b=n.parentElement;if(b){const v=b.querySelectorAll('a[href*="/in/"], a[href*="/company/"]');for(const w of v){if(w===n)continue;const E=(r=w.textContent)==null?void 0:r.trim();if(E&&E.length>=2&&E.length<100)return E.split(`
`)[0].trim()}}const N=(s=n.parentElement)==null?void 0:s.parentElement;if(N){const v=N.querySelectorAll('a[href*="/in/"], a[href*="/company/"]');for(const w of v){if(w===n)continue;const E=w.querySelectorAll("span");for(const _ of E){const P=(l=_.textContent)==null?void 0:l.trim();if(P&&P.length>=2&&P.length<80&&!P.includes("•")&&!P.includes("followers"))return P}const R=(p=(d=(i=w.textContent)==null?void 0:i.trim())==null?void 0:d.split(`
`)[0])==null?void 0:p.trim();if(R&&R.length>=2&&R.length<80)return R}}}const o=t.querySelector('[data-view-name="feed-header-text"]');if(o){const b=(g=(m=(u=o.textContent)==null?void 0:u.trim())==null?void 0:m.split(`
`)[0])==null?void 0:g.trim();if(b&&b.length>=2)return b}const a=se(t,['[class*="update-components-actor__name"]',".feed-shared-actor__name",".feed-shared-actor__title",'a[class*="actor-name"]']);if(a){let b=((k=a.textContent)==null?void 0:k.trim())||"";if(b=b.split(`
`)[0].replace(/View.*profile/gi,"").replace(/•.*$/g,"").trim(),b)return b}const c=(S=t.children[0])==null?void 0:S.children;if(c)for(let b=0;b<Math.min(3,c.length);b++){const N=c[b],v=N==null?void 0:N.querySelector('a[href*="/in/"], a[href*="/company/"]');if(v){const w=(M=(y=(f=v.textContent)==null?void 0:f.trim())==null?void 0:y.split(`
`)[0])==null?void 0:M.trim();if(w&&w.length>=2&&w.length<80)return w}}return"Unknown Author"}function xt(t){var a,c,r,s,l;const n=t.querySelector('[data-view-name="feed-actor-image"]');if(n){const i=(a=n.parentElement)==null?void 0:a.parentElement;if(i){const d=i.querySelectorAll("span");for(const p of d){const u=(c=p.textContent)==null?void 0:c.trim();if(u&&u.length>=5&&u.length<200&&!u.includes("•")&&!u.match(/^\d+[hdwmy]$/)&&!u.match(/^\d+\s*(followers?|connections?)/i)&&!u.includes("Follow")&&!u.includes("Promoted")){const m=(r=n.parentElement)==null?void 0:r.querySelector('a[href*="/in/"], a[href*="/company/"]'),g=(s=m==null?void 0:m.textContent)==null?void 0:s.trim();if(g&&u!==g&&!u.startsWith(g))return u}}}}const o=se(t,['[class*="update-components-actor__description"]',".feed-shared-actor__description",".feed-shared-actor__sub-description",".update-components-actor__sublabel"]);if(o){let i=((l=o.textContent)==null?void 0:l.trim())||"";if(i=i.split("•")[0].trim(),i=i.replace(/\d+\s*(followers?|connections?)/gi,"").trim(),i)return i}return""}function bt(t){const n=t.querySelectorAll('[data-view-name="feed-update-image"] img, [data-view-name="image"] img');for(const c of n){const r=c;if(r.closest('[data-view-name="feed-actor-image"]')||r.closest('[data-view-name="feed-header-actor-image"]'))continue;const s=r.src||r.getAttribute("data-delayed-url")||r.getAttribute("data-src");if(!s||s.startsWith("data:")||s.includes("/icons/")||s.includes("ghost-organization")||s.includes("ghost-person"))continue;const l=r.naturalWidth||r.width,i=r.naturalHeight||r.height;if(!(l&&i&&(l<100||i<100)))return s}const o=t.querySelectorAll("img");for(const c of o){const r=c;if(r.closest('[data-view-name="feed-actor-image"]')||r.closest('[data-view-name="feed-header-actor-image"]')||r.closest('[data-view-name="identity-module"]'))continue;const s=r.src||r.getAttribute("data-delayed-url");if(!s||s.startsWith("data:")||s.includes("/icons/")||s.includes("ghost-")||s.includes("logo"))continue;const l=r.naturalWidth||r.width,i=r.naturalHeight||r.height;if(l&&i&&(l<100||i<100))continue;const d=r.getBoundingClientRect();if(d.width>150&&d.height>100)return s}const a=[".update-components-image__image",".feed-shared-image__image",".ivm-view-attr__img--centered",'[class*="update-components-image"] img',"img[data-delayed-url]"];for(const c of a){const r=t.querySelectorAll(c);for(const s of r){const l=s;if(l.closest('.feed-shared-actor, [class*="actor"]'))continue;const i=l.src||l.getAttribute("data-delayed-url");if(i&&!i.startsWith("data:")&&!i.includes("/icons/"))return i}}}function qe(){return X(document,['[role="textbox"][contenteditable="true"]','.ql-editor[contenteditable="true"]','[data-placeholder="Add a comment…"]','[data-placeholder="Add a comment..."]','[aria-placeholder="Add a comment…"]','[aria-placeholder="Add a comment..."]','[contenteditable="true"][aria-label*="comment" i]','[contenteditable="true"][aria-label*="reply" i]','.editor-content [contenteditable="true"]']).find(a=>{const c=a.getBoundingClientRect();return c.width>0&&c.height>0})||null}function vt(t,n){try{const o=t.querySelectorAll('a[data-attribute-index], span[data-mention], [class*="mention"], a[href*="/in/"]'),a=[];o.forEach(p=>{a.push(p.cloneNode(!0))});const r=(t.textContent||"").match(/^(@[\w\s]+)\s*/),s=r?r[1]:null;t.innerHTML="",a.length>0?a.forEach(p=>{t.appendChild(p),t.appendChild(document.createTextNode(" "))}):s&&t.appendChild(document.createTextNode(s+" "));const l=document.createElement("p");l.textContent=n,t.appendChild(l),t.dispatchEvent(new InputEvent("input",{bubbles:!0,cancelable:!0,inputType:"insertText",data:n})),t.dispatchEvent(new Event("change",{bubbles:!0})),t.dispatchEvent(new KeyboardEvent("keyup",{bubbles:!0})),t.focus();const i=window.getSelection(),d=document.createRange();return d.selectNodeContents(t),d.collapse(!1),i==null||i.removeAllRanges(),i==null||i.addRange(d),!0}catch(o){return console.error("[LinkedIn AI] Failed to inject text:",o),!1}}function yt(t){var c,r,s,l,i,d,p,u,m;const n=t.querySelectorAll('a[href*="/in/"]');for(const g of n){if(g.closest('[data-view-name="feed-commentary"]'))continue;const S=g.querySelector('span[aria-hidden="true"]');if(S){const b=(c=S.textContent)==null?void 0:c.trim();if(b&&b.length>=2&&b.length<100)return b}const f=g.querySelectorAll("p");for(const b of f){const N=(r=b.textContent)==null?void 0:r.trim();if(N&&N.length>=2&&N.length<80&&!N.includes("•")&&!N.includes("1st")&&!N.includes("2nd")&&!N.includes("3rd"))return N}const y=g.querySelectorAll("span");for(const b of y){const N=(s=b.textContent)==null?void 0:s.trim();if(N&&N.length>=2&&N.length<80&&!N.includes("•")&&!N.includes("1st")&&!N.includes("2nd")&&!N.includes("3rd"))return N}let M=((d=(i=(l=g.textContent)==null?void 0:l.trim())==null?void 0:i.split(`
`)[0])==null?void 0:d.trim())||"";if(M.includes("•")&&(M=M.split("•")[0].trim()),M&&M.length>=2&&M.length<80)return M}const a=se(t,[".comments-post-meta__name-text",".comments-post-meta__name",'[class*="comments-post-meta__name"]']);if(a){const g=(m=(u=(p=a.textContent)==null?void 0:p.trim())==null?void 0:u.split(`
`)[0])==null?void 0:m.trim();if(g&&g.length>=2)return g}return"Unknown"}function Z(t){var n,o,a,c;try{if((((n=t.textContent)==null?void 0:n.trim())||"").length<10)return null;const s=yt(t);let l="";const i=t.querySelectorAll('[data-view-name="feed-commentary"]');if(i.length>0){const u=[];i.forEach(m=>{var k;const g=(k=m.textContent)==null?void 0:k.trim();g&&u.push(g)}),l=u.join(" ").trim()}if(!l||l.length<5){const u=[],m=document.createTreeWalker(t,NodeFilter.SHOW_TEXT,{acceptNode:k=>{var y;const S=k.parentElement;if(!S||S.tagName==="BUTTON"||S.closest('a[href*="/in/"]')&&!S.closest('[data-view-name="feed-commentary"]')||S.closest("time"))return NodeFilter.FILTER_REJECT;const f=((y=k.textContent)==null?void 0:y.trim())||"";return f.length<3||["Like","Reply","Report","1st","2nd","3rd","•"].includes(f)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});let g;for(;g=m.nextNode();){const k=((o=g.textContent)==null?void 0:o.trim())||"";k.length>=3&&k!==s&&u.push(k)}u.length>0&&(l=u.sort((k,S)=>S.length-k.length)[0])}if(!l||l.length<5){const u=se(t,[".comments-comment-item__main-content",'[class*="comment-item__main-content"]',".comments-comment-item-content-body",".update-components-text"]);l=((a=u==null?void 0:u.textContent)==null?void 0:a.trim())||""}if(l=oe(l),!l||l.length<5)return null;const p=!!!t.querySelector('[data-view-name="comment-actor-picture"]')||!!t.closest('[class*="replies-list"]')||!!((c=t.parentElement)!=null&&c.closest('[class*="replies"]'));return{authorName:s,authorHeadline:"",content:l,isReply:p}}catch(r){return console.error("[LinkedIn AI] Error extracting comment:",r),null}}function We(t){const n=t.querySelectorAll('[data-view-name="comment-container"]');if(n.length>0)return Array.from(n);const o=X(t,[".comments-comment-item",".comments-comment-entity",'article[class*="comments-comment-item"]']);if(o.length>0)return o;const a=Array.from(t.querySelectorAll('button, [data-view-name="comment-reply"]')).filter(s=>{var i;return((i=s.textContent)==null?void 0:i.trim())==="Reply"||s.getAttribute("data-view-name")==="comment-reply"}),c=[],r=new Set;for(const s of a){let l=s.parentElement;for(let i=0;i<8&&l;i++){if(l.querySelector('a[href*="/in/"]')&&l.textContent.length>20){r.has(l)||(r.add(l),c.push(l));break}l=l.parentElement}}return c}function wt(t,n=5){const o=[],a=new Set,c=We(t);for(const r of c){if(o.length>=n)break;if(!t.contains(r))continue;const s=Z(r);if(s&&s.content.length>5){const l=s.content.slice(0,50).toLowerCase();a.has(l)||(a.add(l),o.push(s))}}return o}function jt(t,n){var k,S,f,y,M,b,N;const o=qe(),a=!!n;if(!o&&!a)return{isReply:!1,parentComment:null,threadParticipants:[]};let c=(o==null?void 0:o.closest('[class*="replies-list"], [class*="replies"]'))||null;const r=(o==null?void 0:o.querySelector('a[href*="/in/"], [data-mention], span[data-type="mention"]'))||null,s=((k=o==null?void 0:o.textContent)==null?void 0:k.trim())||"",l=s.length>0&&s!=="Add a comment..."&&s!=="Add a comment…",i=((S=o==null?void 0:o.getAttribute("aria-label"))==null?void 0:S.toLowerCase())||"",d=((f=o==null?void 0:o.getAttribute("aria-placeholder"))==null?void 0:f.toLowerCase())||"",p=i.includes("reply")||d.includes("reply");if(!a&&!c&&!r&&!l&&!p)return{isReply:!1,parentComment:null,threadParticipants:[]};let u=null;const m=[],g=We(t);if(!u&&n&&(u=Z(n),u&&(m.push(u.authorName),console.log("[LinkedIn AI] Found parent comment from clicked element:",u.authorName)),!n.querySelector('[data-view-name="comment-actor-picture"]'))){const w=(M=(y=n.parentElement)==null?void 0:y.parentElement)==null?void 0:M.parentElement;if(w!=null&&w.parentElement){const E=Array.from(w.parentElement.children),R=E.indexOf(w);for(let _=R-1;_>=0;_--){const I=E[_].querySelector('[data-view-name="comment-container"]');if(I&&!!I.querySelector('[data-view-name="comment-actor-picture"]')){const V=Z(I);V&&V.authorName!==(u==null?void 0:u.authorName)&&(m.push(V.authorName),console.log("[LinkedIn AI] Found thread parent:",V.authorName));break}}}}if(!u&&c){for(const v of g)if(v.contains(c)){u=Z(v),u&&m.push(u.authorName);break}}if(!u&&(r||l)){const v=((N=(b=r==null?void 0:r.textContent)==null?void 0:b.trim())==null?void 0:N.replace("@",""))||s;if(v)for(const w of g){const E=Z(w);if(E&&E.authorName.toLowerCase().includes(v.toLowerCase())){u=E,m.push(E.authorName);break}}}if(!u&&o){const v=o.getBoundingClientRect();let w=null,E=1/0;for(const R of g){const _=R.getBoundingClientRect(),P=Math.abs(_.bottom-v.top);P<E&&P<200&&(E=P,w=Z(R))}w&&(u=w,m.push(w.authorName))}for(const v of g){const w=Z(v);w&&w.authorName!=="Unknown"&&!m.includes(w.authorName)&&m.push(w.authorName)}return{isReply:!0,parentComment:u,threadParticipants:m}}function kt(t){const n=t.closest('[data-view-name="feed-full-update"]');if(n)return n;let o=t.parentElement;for(let c=0;c<15&&o;c++){const r=o.querySelector(':scope > [data-view-name="feed-full-update"]');if(r)return r;const s=o.querySelector('[data-view-name="feed-full-update"]');if(s&&o.contains(t)&&o.contains(s))return s;o=o.parentElement}const a=[".feed-shared-update-v2",".occludable-update",'[data-urn*="activity"]','[data-urn*="ugcPost"]'];for(const c of a){const r=t.closest(c);if(r)return r}return t}function Ct(t){if(t.closest('[data-view-name="comment-container"]')||t.closest('.comments-comment-item, .comments-comment-entity, [class*="comments-comment-item"]'))return!0;let a=t.parentElement;for(let c=0;c<4&&a;c++){const r=a.querySelectorAll("button");let s=!1,l=!1;if(r.forEach(i=>{var p,u;const d=(p=i.textContent)==null?void 0:p.trim();d==="Reply"&&(s=!0),d==="Like"&&!((u=i.getAttribute("data-view-name"))!=null&&u.includes("reaction"))&&(l=!0)}),s&&l)return!0;a=a.parentElement}return!1}function Nt(t,n){if(t.contains(n))return t;let o=t.parentElement;for(let a=0;a<5&&o;a++){if(o.querySelector('[data-view-name="comment-container"]')&&o.contains(t))return o;o=o.parentElement}return t}async function St(t){try{const n=kt(t);if(!n)return console.warn("[LinkedIn AI] Could not find main post container"),null;const o=Ct(t),a=ft(n),c=xt(n);await gt(n);const r=pt(n);if(!r)return console.warn("[LinkedIn AI] Could not extract post content"),null;const s=bt(n),l=Nt(n,t),i=wt(l,5);let d;const p=[];if(o){const m=t.closest('[data-view-name="comment-container"]')||void 0,g=jt(l,m);d=g.parentComment||void 0,p.push(...g.threadParticipants)}for(const m of i)p.includes(m.authorName)||p.push(m.authorName);const u={mode:o?"reply":"post",parentComment:d,existingComments:i,threadParticipants:p};return console.log("[LinkedIn AI] Scraped data:",{authorName:a,authorHeadline:c,postContentLength:r.length,hasImage:!!s,isReplyMode:o,parentComment:d==null?void 0:d.authorName,existingCommentsCount:i.length}),{authorName:a,authorHeadline:c,postContent:r,imageUrl:s,threadContext:u}}catch(n){return console.error("[LinkedIn AI] Error scraping post data:",n),null}}function fe(){return X(document,['[role="dialog"][aria-label*="Start a post" i]','[role="dialog"][aria-label*="Create a post" i]','[role="dialog"][aria-label*="post" i]','[data-view-name*="share"]',".share-box-feed-entry__modal",".share-box__modal",".artdeco-modal",'[class*="share-box"]','[class*="share-modal"]']).find(a=>{const c=a.getBoundingClientRect();return c.width>0&&c.height>0})||null}function Ne(){const t=['[role="textbox"][contenteditable="true"]','.ql-editor[contenteditable="true"]','[data-placeholder*="What do you want to talk about"]','[aria-placeholder*="What do you want to talk about"]','[contenteditable="true"][aria-label*="post" i]','[contenteditable="true"][aria-label*="Text editor" i]',".ql-container .ql-editor"],n=fe();if(n){const c=X(n,t);if(c.length>0){const r=c.find(s=>{const l=s.getBoundingClientRect();return l.width>0&&l.height>0});if(r)return r}}return X(document,t).find(c=>{const r=c.getBoundingClientRect();return r.width>0&&r.height>0})||null}function At(){var a;const t=fe();if(!t)return null;const o=X(t,[".share-box__toolbar",".share-box-feed-entry__toolbar",".share-box__footer",".share-creation-state__toolbar",'[class*="share-box"][class*="toolbar"]','[class*="share-box"][class*="footer"]',".artdeco-modal__actionbar"]);if(o.length===0){const c=t.querySelectorAll("button");for(const r of c){const s=((a=r.getAttribute("aria-label"))==null?void 0:a.toLowerCase())||"";if(s.includes("photo")||s.includes("video")||s.includes("media"))return r.parentElement}}return o[0]||null}function It(t,n){try{t.innerHTML="";const o=document.createElement("p");o.textContent=n,t.appendChild(o),t.dispatchEvent(new InputEvent("input",{bubbles:!0,cancelable:!0,inputType:"insertText",data:n})),t.dispatchEvent(new Event("change",{bubbles:!0})),t.dispatchEvent(new KeyboardEvent("keyup",{bubbles:!0})),t.focus();const a=window.getSelection(),c=document.createRange();return c.selectNodeContents(t),c.collapse(!1),a==null||a.removeAllRanges(),a==null||a.addRange(c),!0}catch(o){return console.error("[LinkedIn AI] Failed to inject text into post editor:",o),!1}}function Mt(){const t=window.getSelection();return(t==null?void 0:t.toString().trim())||""}function Et(){const t=Mt();return!t||t.length<10?null:{authorName:"Selected Text",authorHeadline:"",postContent:t,threadContext:{mode:"post",existingComments:[],threadParticipants:[]}}}const Y={messageItem:[".msg-s-message-list__event",".msg-s-event-listitem",'[class*="msg-s-event-listitem"]'],messageContent:[".msg-s-event-listitem__body",".msg-s-message-group__content",'[class*="msg-s-event-listitem__body"]',"p.msg-s-event-listitem__body"],messageTimestamp:[".msg-s-message-list__time-heading",".msg-s-message-group__timestamp","time"],participantName:[".msg-overlay-bubble-header__title",".msg-thread__link-to-profile",".msg-entity-lockup__entity-title",'[class*="msg-overlay-bubble-header__title"]',"h2.msg-entity-lockup__entity-title"],participantHeadline:[".msg-entity-lockup__entity-subtitle",".msg-overlay-bubble-header__subtitle",'[class*="msg-entity-lockup__entity-subtitle"]'],messageInput:[".msg-form__contenteditable",".msg-form__message-texteditor",'[contenteditable="true"][role="textbox"]',"div.msg-form__contenteditable"],myMessageIndicator:[".msg-s-message-group--selfsend",'[class*="selfsend"]']};function ae(t,n){for(const o of n){const a=t.querySelector(o);if(a)return a}return null}function _t(t,n){for(const o of n){const a=t.querySelectorAll(o);if(a.length>0)return Array.from(a)}return[]}function D(){return!!(window.location.pathname.includes("/messaging")||window!==window.top&&!!document.querySelector('.msg-form, .msg-form__contenteditable, [class*="msg-form"], .msg-overlay-bubble-header'))}function Pt(){const t=document.querySelector(".global-nav__me-photo, .feed-identity-module__actor-meta"),n=t==null?void 0:t.getAttribute("alt");if(n)return n;const o=document.querySelector(".global-nav__me .t-14");return o!=null&&o.textContent?o.textContent.trim():"Me"}function ze(){var o,a;const t=ae(document,Y.participantName),n=ae(document,Y.participantHeadline);return{name:((o=t==null?void 0:t.textContent)==null?void 0:o.trim())||"Unknown",headline:((a=n==null?void 0:n.textContent)==null?void 0:a.trim())||void 0}}function Tt(t){const n=t.closest(".msg-s-message-group");if(n){for(const o of Y.myMessageIndicator)if(n.matches(o)||n.querySelector(o))return!0}for(const o of Y.myMessageIndicator)if(t.matches(o)||t.closest(o))return!0;return!1}function Lt(t=10){var s,l;const n=[],o=Pt(),a=ze(),r=_t(document,Y.messageItem).slice(-t);for(const i of r){const d=ae(i,Y.messageContent),p=(s=d==null?void 0:d.textContent)==null?void 0:s.trim();if(!p||p.length<2)continue;const u=Tt(i),m=ae(i,Y.messageTimestamp),g=(l=m==null?void 0:m.textContent)==null?void 0:l.trim();n.push({sender:u?"me":"other",senderName:u?o:a.name,content:p,timestamp:g})}return n}function Rt(t){if(t.length===0)return"neutral";const o=t.slice(-5).map(d=>d.content.toLowerCase()).join(" "),c=["great","awesome","thanks","thank you","excellent","love","excited","looking forward","happy","pleased"].some(d=>o.includes(d)),s=["price","cost","budget","deal","offer","proposal","terms","negotiate","discount","rate"].some(d=>o.includes(d)),l=t[t.length-1],i=l.sender==="me";return l.content.length<20,s?"negotiating":c?"positive":i&&t.length>3?"cold":"neutral"}function Bt(t){if(t.length===0)return"General conversation";const n=t.map(a=>a.content).join(" ").toLowerCase(),o=[{pattern:/job|position|opportunity|hiring|role|career/i,topic:"Job opportunity discussion"},{pattern:/project|collaboration|partner|work together/i,topic:"Collaboration proposal"},{pattern:/service|solution|help|consulting/i,topic:"Business services"},{pattern:/meeting|call|schedule|calendar|zoom|coffee/i,topic:"Scheduling a meeting"},{pattern:/price|cost|budget|quote|proposal/i,topic:"Pricing negotiation"},{pattern:/connect|networking|intro|introduction/i,topic:"Networking"},{pattern:/question|help|advice|recommend/i,topic:"Seeking advice"},{pattern:/follow.?up|checking in|touch base/i,topic:"Follow-up conversation"}];for(const{pattern:a,topic:c}of o)if(a.test(n))return c;return"Professional discussion"}async function qt(){try{if(!D())return console.log("[LinkedIn AI] Not on messaging page"),null;const t=ze(),n=Lt(10);if(n.length===0)return console.log("[LinkedIn AI] No messages found in conversation"),null;const o=n[n.length-1],a=Bt(n),c=Rt(n);return console.log("[LinkedIn AI] Scraped conversation:",{participant:t.name,messageCount:n.length,topic:a,sentiment:c,lastMessageFrom:o.sender}),{participantName:t.name,participantHeadline:t.headline,messages:n,topic:a,sentiment:c,lastMessageFrom:o.sender}}catch(t){return console.error("[LinkedIn AI] Error scraping conversation:",t),null}}function Wt(){return ae(document,Y.messageInput)}function zt(t){const n=Wt();if(!n)return console.error("[LinkedIn AI] Message input not found"),!1;try{n.focus(),n.innerHTML="";const o=document.createElement("p");return o.textContent=t,n.appendChild(o),n.dispatchEvent(new Event("input",{bubbles:!0})),n.dispatchEvent(new Event("change",{bubbles:!0})),setTimeout(()=>{n.innerText=t,n.dispatchEvent(new Event("input",{bubbles:!0}))},50),!0}catch(o){return console.error("[LinkedIn AI] Error injecting text:",o),!1}}const Ft=`
  .lai-ai-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: linear-gradient(135deg, #0a66c2 0%, #0077b5 100%);
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(10, 102, 194, 0.3);
    margin-left: 8px;
    align-self: center;
    flex-shrink: 0;
  }
  
  .lai-ai-button:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(10, 102, 194, 0.4);
  }
  
  .lai-ai-button:active {
    transform: scale(0.95);
  }
  
  .lai-ai-button svg {
    width: 18px;
    height: 18px;
    color: white;
  }

  .lai-ai-button::after {
    content: 'AI Comment';
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) scale(0.9);
    padding: 6px 10px;
    background: #1a1a2e;
    color: white;
    font-size: 12px;
    font-weight: 500;
    border-radius: 6px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .lai-ai-button::before {
    content: '';
    position: absolute;
    bottom: calc(100% + 2px);
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #1a1a2e;
    opacity: 0;
    pointer-events: none;
    transition: all 0.2s ease;
  }

  .lai-ai-button:hover::after,
  .lai-ai-button:hover::before {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }

  .lai-ai-button:hover::before {
    transform: translateX(-50%);
  }

  .lai-selection-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: linear-gradient(135deg, #0a66c2 0%, #0077b5 100%);
    border: none;
    border-radius: 12px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(10, 102, 194, 0.4);
    z-index: 999998;
    transition: all 0.2s ease;
  }

  .lai-selection-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(10, 102, 194, 0.5);
  }

  .lai-selection-btn svg {
    width: 18px;
    height: 18px;
  }

  /* Messaging AI Button */
  .lai-messaging-ai-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 6px rgba(124, 58, 237, 0.3);
    margin: 0 4px;
    flex-shrink: 0;
    vertical-align: middle;
    align-self: center;
  }

  .lai-messaging-ai-button:hover {
    transform: scale(1.1);
    box-shadow: 0 3px 10px rgba(124, 58, 237, 0.4);
    background: linear-gradient(135deg, #6d28d9 0%, #9333ea 100%);
  }

  .lai-messaging-ai-button:active {
    transform: scale(0.95);
  }

  .lai-messaging-ai-button svg {
    width: 16px;
    height: 16px;
    color: white;
  }

  /* Post Assistant Sparkle Button */
  .lai-post-sparkle-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
    margin: 0 4px;
    flex-shrink: 0;
    align-self: center;
  }
  
  .lai-post-sparkle-button:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
    background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%);
  }
  
  .lai-post-sparkle-button:active {
    transform: scale(0.95);
  }
  
  .lai-post-sparkle-button svg {
    width: 18px;
    height: 18px;
    color: white;
  }
`;let z=null,Q=null,U=null,Se=null;function Ht(){if(document.getElementById("lai-content-styles"))return;const t=document.createElement("style");t.id="lai-content-styles",t.textContent=Ft,document.head.appendChild(t)}function ee(){if(Q)return Q;Q=document.createElement("div"),Q.id="lai-panel-container";const t=Q.attachShadow({mode:"open"}),n=document.createElement("style");n.textContent=en(),t.appendChild(n);const o=document.createElement("div");return o.id="lai-panel-mount",t.appendChild(o),document.body.appendChild(Q),Q}function pe(t,n){const c=ee().shadowRoot.getElementById("lai-panel-mount");z||(z=ke.createRoot(c)),z.render(e.jsx(Ce.StrictMode,{children:e.jsx(rt,{postData:t,isScanning:n,onClose:K,onInsertComment:Jt})}))}function ve(t,n){const c=ee().shadowRoot.getElementById("lai-panel-mount");z||(z=ke.createRoot(c)),z.render(e.jsx(Ce.StrictMode,{children:e.jsx(lt,{conversationContext:t,isScanning:n,onClose:K,onInsertReply:Ot})}))}function $t(){const o=ee().shadowRoot.getElementById("lai-panel-mount");z||(z=ke.createRoot(o)),z.render(e.jsx(Ce.StrictMode,{children:e.jsx(mt,{onClose:K,onInsertPost:Vt})}))}function Ot(t){zt(t)&&K()}function Vt(t){const n=Ne();n?It(n,t)&&K():navigator.clipboard.writeText(t).then(()=>{alert("Post copied to clipboard! Paste it into the post editor."),K()}).catch(()=>{console.error("[LinkedIn AI] Failed to copy to clipboard")})}function Gt(){ee(),$t()}function Ut(){ee(),ve(null,!0),(async()=>{await new Promise(n=>setTimeout(n,200));const t=await qt();ve(t||null,!1)})()}function Yt(t){var c;const n=['[role="textbox"][contenteditable="true"]','[contenteditable="true"][aria-label*="comment" i]','[contenteditable="true"][aria-label*="reply" i]','[aria-placeholder="Add a comment…"]','[aria-placeholder="Add a comment..."]','[data-placeholder="Add a comment…"]','[data-placeholder="Add a comment..."]','.ql-editor[contenteditable="true"]',".comments-comment-box__form-container .ql-editor",".comments-comment-texteditor .ql-editor",'.editor-content [contenteditable="true"]'];for(const r of n){const s=t.querySelectorAll(r);for(const l of s){const i=l.getBoundingClientRect();if(i.width>0&&i.height>0)return l}}const o=[],a=t.getBoundingClientRect();for(const r of n){const s=document.querySelectorAll(r);for(const l of s){const i=l.getBoundingClientRect();if(i.width>0&&i.height>0){const d=Math.abs(i.top-a.top);o.push({box:l,distance:d})}}}return o.sort((r,s)=>r.distance-s.distance),((c=o[0])==null?void 0:c.box)||null}function Xt(t,n=!1){ee(),pe(null,!0),Ae(),(async()=>{let o=t.closest('[data-view-name="feed-full-update"]')||t.closest(".feed-shared-update-v2")||t.closest(".occludable-update")||t.closest('[data-urn*="activity"]');if(!o){let r=t.parentElement;for(let s=0;s<15&&r;s++){const l=r.querySelector('[data-view-name="feed-full-update"]');if(l){o=l;break}r=r.parentElement}}o&&ye(o);const a=n?400:200;await new Promise(r=>setTimeout(r,a)),Se=Yt(t);const c=await St(t);c?pe(c,!1):(pe(null,!1),Qt())})()}function Kt(t){ee();const n={...t,threadContext:t.threadContext||{mode:"post",existingComments:[],threadParticipants:[]}};pe(n,!1),Ae()}function K(){z&&(z.unmount(),z=null),Se=null}function Jt(t){let n=Se;if(n){const o=n.getBoundingClientRect();(!document.body.contains(n)||o.width===0&&o.height===0)&&(n=null)}if(n||(n=qe()),n&&vt(n,t)){K();return}navigator.clipboard.writeText(t).then(()=>{alert("Comment copied to clipboard! Paste it into the comment box."),K()}).catch(()=>{console.error("[LinkedIn AI] Failed to copy to clipboard")})}function Fe(t,n=!1){Xt(t,n)}function Qt(){U||(U=document.createElement("button"),U.className="lai-selection-btn",U.innerHTML=`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 7V4h16v3"/>
      <path d="M9 20h6"/>
      <path d="M12 4v16"/>
    </svg>
    Analyze Selected Text
  `,U.addEventListener("click",()=>{const t=Et();t?(Kt(t),Ae()):alert("Please highlight some text from a LinkedIn post first.")}),document.body.appendChild(U))}function Ae(){U&&(U.remove(),U=null)}function we(){ht().forEach(n=>{const o=n;if(o.dataset.laiProcessed)return;o.dataset.laiProcessed="true";const a=Be(n);if(a){const c=a.closest('[data-view-name="comment-container"]'),r=Array.from(a.querySelectorAll("button")).some(l=>{var i;return((i=l.textContent)==null?void 0:i.trim())==="Reply"}),s=a.closest('.comments-comment-item, .comments-comment-entity, [class*="comments-comment-item"], .comments-comments-list');if(c||s||r)return;if(!a.querySelector(".lai-ai-button")){const l=Re(()=>{Fe(l,!1)});a.appendChild(l)}}He(n)})}function Zt(t){var c,r;const n=t.querySelector('[data-view-name="comment-reply"]');if(n){n.click(),console.log("[LinkedIn AI] Clicked Reply button (by data-view-name)");return}const o=t.querySelectorAll('button, span[role="button"]');for(const s of o)if(((c=s.textContent)==null?void 0:c.trim())==="Reply"){s.click(),console.log("[LinkedIn AI] Clicked Reply button (by text)");return}const a=(r=t.querySelector('button[aria-label*="Reply"], button[aria-label*="reply"], [class*="reply-action"], .comments-comment-social-bar__reply-action'))==null?void 0:r.closest("button");a&&(a.click(),console.log("[LinkedIn AI] Clicked Reply button (by selector)"))}function He(t){const n=t.querySelectorAll('[data-view-name="comment-container"]');if(n.length>0){n.forEach(c=>{const r=c.querySelector('[data-view-name="comment-reply"]')||Array.from(c.querySelectorAll("button")).find(s=>{var l;return((l=s.textContent)==null?void 0:l.trim())==="Reply"});ge(c,r||void 0)});return}const o=t.querySelectorAll('.comments-comment-item, .comments-comment-entity, article[class*="comments-comment"]');if(o.length>0){o.forEach(c=>{ge(c)});return}const a=Array.from(t.querySelectorAll("button")).filter(c=>{var r;return((r=c.textContent)==null?void 0:r.trim())==="Reply"});for(const c of a){let r=c.parentElement;for(let s=0;s<8&&r;s++){if(r.querySelector('a[href*="/in/"]')&&r.textContent.length>20){ge(r,c);break}r=r.parentElement}}}function ge(t,n){var r;const o=t;if(o.dataset.laiCommentProcessed)return;o.dataset.laiCommentProcessed="true";let a=null;const c=n||t.querySelector('[data-view-name="comment-reply"]');if(c){let s=c.parentElement;for(let l=0;l<4&&s;l++){if(s.children.length>=2&&s.querySelector("button")!==null){a=s;break}s=s.parentElement}}if(!a&&n){let s=n.parentElement;for(let l=0;l<3&&s;l++){const i=s.querySelectorAll("button");let d=!1,p=!1;if(i.forEach(u=>{var g;const m=(g=u.textContent)==null?void 0:g.trim();m==="Like"&&(d=!0),m==="Reply"&&(p=!0)}),d&&p){a=s;break}s=s.parentElement}}if(!a){const s=[".comments-comment-social-bar",'[class*="comment-social-bar"]',".comments-comment-item__action-bar"];for(const l of s)if(a=t.querySelector(l),a)break}if(!a){const s=t.querySelectorAll("button");for(const l of s){const i=(r=l.textContent)==null?void 0:r.trim();if(i==="Reply"||i==="Like"){a=l.parentElement;break}}}if(a&&!a.querySelector(".lai-ai-button")){const s=Re(()=>{Zt(t),setTimeout(()=>{Fe(s,!0)},300)});s.style.width="28px",s.style.height="28px",s.style.marginLeft="4px",s.style.alignSelf="center",a.appendChild(s)}}function Dt(){document.querySelectorAll('[data-view-name="feed-full-update"], .feed-shared-update-v2, .occludable-update, [data-urn*="activity"]').forEach(o=>{He(o)}),document.querySelectorAll('[data-view-name="comment-container"]').forEach(o=>{if(o.dataset.laiCommentProcessed)return;const c=o.querySelector('[data-view-name="comment-reply"]')||Array.from(o.querySelectorAll("button")).find(r=>{var s;return((s=r.textContent)==null?void 0:s.trim())==="Reply"});ge(o,c||void 0)})}function ie(){const t=document.createElement("button");return t.className="lai-post-sparkle-button",t.setAttribute("aria-label","AI Post Assistant"),t.title="AI Post Assistant",t.innerHTML=`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
      <circle cx="7.5" cy="14.5" r="1.5"/>
      <circle cx="16.5" cy="14.5" r="1.5"/>
    </svg>
  `,t.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Gt()}),t}function ne(){var c;if(document.querySelector(".lai-post-sparkle-button"))return;const t=document.querySelectorAll("div");for(const r of t)if(r.children.length===2){const s=r.children[0],l=r.children[1];if(s.tagName==="A"&&((c=l.textContent)==null?void 0:c.trim())==="Start a post"){const i=r.getBoundingClientRect();if(i.width>200&&i.height>30){const d=ie();d.style.alignSelf="center",d.style.marginLeft="8px",d.style.marginRight="4px",r.appendChild(d),console.log("[LinkedIn AI] Post Assistant button injected into Start a post row");return}}}const n=fe();let o=At();if(!o){const r=[".share-box__toolbar",".share-box-feed-entry__toolbar",".share-box__footer",".share-creation-state__toolbar",".share-box__actions",".share-box-feed-entry__actions",".artdeco-modal__actionbar",'[class*="share-box"][class*="toolbar"]','[class*="share-box"][class*="footer"]','[class*="share-box"][class*="actions"]'];for(const s of r){const l=document.querySelector(s);if(l){const i=l.getBoundingClientRect();if(i.width>0&&i.height>0){o=l;break}}}}if(o){const r=ie();o.insertBefore(r,o.firstChild),console.log("[LinkedIn AI] Post Assistant button injected into toolbar");return}const a=Ne();if(a&&a.parentElement){let r=a.parentElement;for(let s=0;s<3;s++)if(r){const l=r.querySelector('[class*="toolbar"], [class*="footer"], [class*="actions"], [class*="button"]');if(l){const i=ie();l.insertBefore(i,l.firstChild),console.log("[LinkedIn AI] Post Assistant button injected near editor");return}r=r.parentElement}if(a.parentElement){const s=ie();a.parentElement.insertBefore(s,a.nextSibling),console.log("[LinkedIn AI] Post Assistant button injected after editor");return}}if(n){const r=ie();r.style.position="absolute",r.style.top="10px",r.style.right="10px",r.style.zIndex="10000",n.appendChild(r),console.log("[LinkedIn AI] Post Assistant button injected as absolute positioned")}}function je(){const t=[".msg-form__footer",".msg-form__left-actions",".msg-form__right-actions",".msg-form__content-container",".msg-form"];let n=null;for(const l of t)if(n=document.querySelector(l),n)break;if(!n){console.log("[LinkedIn AI] Message form footer not found");return}if(document.querySelector(".lai-messaging-ai-button"))return;const o=document.createElement("button");o.className="lai-messaging-ai-button",o.type="button",o.title="AI Reply Assistant",o.innerHTML=`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    </svg>
  `,o.addEventListener("click",l=>{l.preventDefault(),l.stopPropagation(),Ut()});const a=document.querySelector(".msg-form__left-actions");if(a){a.appendChild(o),console.log("[LinkedIn AI] Messaging AI button injected into left actions");return}const c=document.querySelector(".msg-form__right-actions");if(c){c.insertBefore(o,c.firstChild),console.log("[LinkedIn AI] Messaging AI button injected into right actions");return}const r=document.querySelector(".msg-form__footer");if(r){r.insertBefore(o,r.firstChild),console.log("[LinkedIn AI] Messaging AI button injected into footer");return}const s=document.querySelector('.msg-form__send-button, .msg-form__send-btn, button[type="submit"][class*="send"]');if(s&&s.parentElement){s.parentElement.insertBefore(o,s),console.log("[LinkedIn AI] Messaging AI button injected before send button");return}if(n){n.appendChild(o),console.log("[LinkedIn AI] Messaging AI button appended to form container");return}console.log("[LinkedIn AI] Could not find suitable location for messaging button")}function $e(){try{return window!==window.top}catch{return!0}}function Pe(){Ht();const t=$e();D()?je():t||we(),!t&&!D()&&ne(),!t&&!D()&&setInterval(()=>{(fe()||Ne())&&ne()},500);let n=null;const o=()=>{n&&clearTimeout(n),n=setTimeout(()=>{D()?je():t||(we(),Dt()),!t&&!D()&&ne()},300)};new MutationObserver(c=>{let r=!1,s=!1;c.forEach(l=>{l.addedNodes.length>0&&(l.addedNodes.forEach(i=>{var d,p,u,m,g,k,S,f,y,M,b,N;i instanceof Element&&(((p=(d=i.getAttribute)==null?void 0:d.call(i,"data-view-name"))!=null&&p.includes("feed")||((u=i.getAttribute)==null?void 0:u.call(i,"data-view-name"))==="comment-container"||(m=i.querySelector)!=null&&m.call(i,'[data-view-name="feed-full-update"]')||(g=i.querySelector)!=null&&g.call(i,'[data-view-name="feed-comment-button"]')||(k=i.querySelector)!=null&&k.call(i,'[data-view-name="comment-container"]')||(S=i.querySelector)!=null&&S.call(i,'[data-view-name="comment-reply"]')||(f=i.querySelector)!=null&&f.call(i,"button"))&&(r=!0),((y=i.matches)!=null&&y.call(i,'.comments-comment-item, .comments-comment-entity, [class*="comment"], .feed-shared-update-v2')||(M=i.querySelector)!=null&&M.call(i,".comments-comment-item, .comments-comment-entity"))&&(r=!0),((b=i.matches)!=null&&b.call(i,'[role="dialog"], .artdeco-modal, [class*="share-box"], [class*="share-modal"]')||(N=i.querySelector)!=null&&N.call(i,'[role="dialog"][aria-label*="post" i], .artdeco-modal, [class*="share-box"]'))&&(s=!0))}),r=!0)}),r&&o(),s&&!t&&(setTimeout(()=>ne(),100),setTimeout(()=>ne(),500),setTimeout(()=>ne(),1e3))}).observe(document.body,{childList:!0,subtree:!0})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Pe):Pe();if(!$e()){let t=location.href;new MutationObserver(()=>{location.href!==t&&(t=location.href,setTimeout(()=>{D()?je():we()},1e3))}).observe(document,{subtree:!0,childList:!0})}function en(){return`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    .panel {
      position: fixed;
      top: 80px;
      right: 20px;
      width: 400px;
      max-height: calc(100vh - 100px);
      background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #fff;
      z-index: 999999;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(30px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
    }
    
    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.02);
      cursor: move;
      flex-shrink: 0;
    }
    
    .panel-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      font-size: 14px;
    }
    
    .panel-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: linear-gradient(135deg, #0a66c2 0%, #00a0dc 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .panel-icon svg {
      width: 18px;
      height: 18px;
      color: white;
    }

    .panel-icon.messaging {
      background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    }

    /* Messaging Context Styles */
    .messaging-context {
      padding: 12px 16px;
      background: rgba(124, 58, 237, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .context-scanning {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #a78bfa;
      font-size: 13px;
    }

    .context-participant {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }

    .context-label {
      font-size: 11px;
      color: #9ca3af;
    }

    .context-value {
      font-size: 14px;
      font-weight: 600;
      color: #f3f4f6;
    }

    .context-headline {
      font-size: 12px;
      color: #9ca3af;
      margin-bottom: 8px;
    }

    .context-stats {
      display: flex;
      gap: 12px;
      margin-top: 8px;
    }

    .context-stats .stat {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: #9ca3af;
    }

    .sentiment-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #6b7280;
    }

    .sentiment-dot.positive {
      background: #22c55e;
    }

    .sentiment-dot.neutral {
      background: #eab308;
    }

    .sentiment-dot.negotiating {
      background: #f97316;
    }

    .sentiment-dot.cold {
      background: #6b7280;
    }

    .ai-summary {
      margin-top: 10px;
      padding: 10px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      border-left: 3px solid #a855f7;
    }

    .summary-topic {
      font-size: 12px;
      font-weight: 500;
      color: #e5e7eb;
      margin-bottom: 6px;
    }

    .summary-action {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: #a78bfa;
    }

    .context-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 16px;
      color: #6b7280;
      font-size: 13px;
      text-align: center;
    }

    .context-empty svg {
      opacity: 0.5;
    }
    
    .close-btn {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      border: none;
      background: rgba(255, 255, 255, 0.1);
      color: #9ca3af;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    
    .close-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }

    /* Tabs */
    .tabs {
      display: flex;
      padding: 0 12px;
      background: rgba(0, 0, 0, 0.2);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      flex-shrink: 0;
    }

    .tab {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 12px 16px;
      border: none;
      background: transparent;
      color: #6b7280;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
    }

    .tab:hover {
      color: #9ca3af;
    }

    .tab.active {
      color: #0a66c2;
      border-bottom-color: #0a66c2;
    }

    .tab svg {
      opacity: 0.7;
    }

    .tab.active svg {
      opacity: 1;
    }

    /* Reply Mode Indicator */
    .reply-mode-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: linear-gradient(90deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%);
      border-bottom: 1px solid rgba(139, 92, 246, 0.2);
      font-size: 12px;
      color: #a78bfa;
      font-weight: 500;
    }

    .reply-mode-indicator svg {
      flex-shrink: 0;
    }

    .reply-to-name {
      color: #c4b5fd;
      font-weight: 600;
      margin-left: 4px;
    }

    /* Context Awareness Section */
    .context-awareness {
      background: rgba(0, 0, 0, 0.25);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 12px 16px;
    }

    .context-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #9ca3af;
      margin-bottom: 12px;
    }

    .context-header svg {
      color: #6b7280;
    }

    .scanning-badge {
      margin-left: auto;
      padding: 2px 8px;
      background: rgba(59, 130, 246, 0.2);
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 10px;
      font-size: 9px;
      color: #60a5fa;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .context-timeline {
      display: flex;
      flex-direction: column;
      gap: 0;
      position: relative;
    }

    .context-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 8px 0;
      position: relative;
    }

    .context-item-line {
      position: absolute;
      left: 5px;
      top: 22px;
      bottom: -8px;
      width: 2px;
      background: rgba(255, 255, 255, 0.1);
    }

    .context-item:last-child .context-item-line {
      display: none;
    }

    .context-item-icon {
      width: 12px;
      height: 12px;
      margin-top: 2px;
      flex-shrink: 0;
      color: #6b7280;
      position: relative;
      z-index: 1;
    }

    .context-item.success .context-item-icon {
      color: #4ade80;
    }

    .context-item.warning .context-item-icon {
      color: #fbbf24;
    }

    .context-item.scanning .context-item-icon {
      color: #60a5fa;
    }

    .context-item-content {
      flex: 1;
      min-width: 0;
    }

    .context-item-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 2px;
    }

    .context-item-label {
      font-size: 11px;
      font-weight: 600;
      color: #e5e7eb;
    }

    .context-status {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .context-status.success {
      background: rgba(34, 197, 94, 0.2);
      color: #22c55e;
    }

    .context-status.warning {
      background: rgba(251, 191, 36, 0.2);
      color: #fbbf24;
    }

    .context-status.scanning {
      background: rgba(59, 130, 246, 0.2);
    }

    .scan-spinner {
      width: 8px;
      height: 8px;
      border: 1.5px solid rgba(96, 165, 250, 0.3);
      border-top-color: #60a5fa;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    /* Mini toggle for image analysis in context item */
    .image-analysis-toggle {
      display: flex;
      align-items: center;
      margin-left: auto;
      cursor: pointer;
    }

    .image-analysis-toggle input {
      display: none;
    }

    .mini-toggle {
      width: 28px;
      height: 16px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      position: relative;
      transition: all 0.2s;
    }

    .mini-toggle::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 12px;
      height: 12px;
      background: #fff;
      border-radius: 50%;
      transition: all 0.2s;
    }

    .mini-toggle.active {
      background: linear-gradient(135deg, #8b5cf6, #a855f7);
    }

    .mini-toggle.active::after {
      transform: translateX(12px);
    }

    .context-item-value {
      font-size: 11px;
      color: #9ca3af;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .context-item-value.scanning {
      color: #60a5fa;
      font-style: italic;
    }

    .context-item-value.warning {
      color: #fbbf24;
      font-size: 10px;
    }

    /* Hover tooltip for context items */
    .context-item.has-tooltip {
      cursor: pointer;
    }

    .context-item.has-tooltip:hover {
      background: rgba(255, 255, 255, 0.03);
      border-radius: 6px;
      margin: -4px;
      padding: 4px;
    }

    .hover-hint {
      margin-left: 4px;
      opacity: 0.4;
      transition: opacity 0.2s;
    }

    .context-item:hover .hover-hint {
      opacity: 0.8;
    }

    .context-tooltip {
      position: absolute;
      left: 0;
      right: 0;
      top: 100%;
      margin-top: 4px;
      background: #1e1e2f;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 10px;
      padding: 12px;
      z-index: 100;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      animation: tooltipFadeIn 0.15s ease-out;
    }

    @keyframes tooltipFadeIn {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .context-tooltip-header {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #9ca3af;
      margin-bottom: 8px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .context-tooltip-content {
      font-size: 12px;
      line-height: 1.6;
      color: #e5e7eb;
      max-height: 200px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .context-tooltip-content::-webkit-scrollbar {
      width: 4px;
    }

    .context-tooltip-content::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 2px;
    }

    .context-tooltip-content::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
    }
    
    .panel-content {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }
    
    .section {
      margin-bottom: 20px;
    }
    
    .section-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #9ca3af;
      margin-bottom: 8px;
    }
    
    .post-preview {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      padding: 12px;
      font-size: 13px;
      line-height: 1.5;
      color: #d1d5db;
      max-height: 100px;
      overflow-y: auto;
    }
    
    .post-preview h1 {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      margin: 12px 0 8px 0;
    }
    
    .post-preview h2 {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      margin: 10px 0 6px 0;
    }
    
    .post-preview h3 {
      font-size: 14px;
      font-weight: 600;
      color: #e5e7eb;
      margin: 8px 0 4px 0;
    }
    
    .post-preview p {
      margin: 8px 0;
      line-height: 1.6;
    }
    
    .post-preview strong {
      font-weight: 600;
      color: #fff;
    }
    
    .post-preview em {
      font-style: italic;
      color: #d1d5db;
    }
    
    .post-preview br {
      line-height: 1.6;
    }
    
    .author-info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #9ca3af;
      margin-bottom: 8px;
    }
    
    .author-name {
      color: #fff;
      font-weight: 500;
    }
    
    /* Your Thoughts Input */
    .thoughts-input-wrapper {
      position: relative;
    }

    .thoughts-input {
      width: 100%;
      padding: 10px 32px 10px 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      color: #fff;
      font-size: 13px;
      font-family: inherit;
      line-height: 1.5;
      resize: none;
      transition: all 0.2s;
      min-height: 60px;
      max-height: 120px;
    }

    .thoughts-input::placeholder {
      color: #6b7280;
      font-size: 12px;
    }

    .thoughts-input:hover {
      border-color: rgba(255, 255, 255, 0.2);
    }

    .thoughts-input:focus {
      outline: none;
      border-color: #0a66c2;
      box-shadow: 0 0 0 3px rgba(10, 102, 194, 0.2);
    }

    .clear-thoughts-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: none;
      background: rgba(255, 255, 255, 0.1);
      color: #9ca3af;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .clear-thoughts-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }

    .optional-label {
      font-weight: 400;
      color: #6b7280;
      font-size: 10px;
    }

    /* Service Offer Toggle */
    .service-offer-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(234, 88, 12, 0.05));
      border: 1px solid rgba(245, 158, 11, 0.2);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }

    .service-offer-toggle:not(.disabled):hover {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(234, 88, 12, 0.1));
      border-color: rgba(245, 158, 11, 0.3);
    }

    .service-offer-toggle.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .toggle-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .toggle-icon {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: rgba(245, 158, 11, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #f59e0b;
    }

    .toggle-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .toggle-label {
      font-size: 12px;
      font-weight: 500;
      color: #fff;
    }

    .toggle-hint {
      font-size: 10px;
      color: #9ca3af;
    }

    .toggle-hint.warning {
      color: #f59e0b;
    }

    .toggle-checkbox {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    .toggle-switch {
      width: 36px;
      height: 20px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      position: relative;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .toggle-switch::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      background: #fff;
      border-radius: 50%;
      transition: all 0.2s;
    }

    .toggle-switch.active {
      background: linear-gradient(135deg, #f59e0b, #ea580c);
    }

    .toggle-switch.active::after {
      transform: translateX(16px);
    }

    /* Image Toggle */
    .image-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(168, 85, 247, 0.05));
      border: 1px solid rgba(139, 92, 246, 0.2);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }

    .image-toggle:hover {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1));
      border-color: rgba(139, 92, 246, 0.3);
    }

    .toggle-icon.image {
      background: rgba(139, 92, 246, 0.15);
      color: #a855f7;
    }

    .toggle-switch.image.active {
      background: linear-gradient(135deg, #8b5cf6, #a855f7);
    }

    .tone-select {
      width: 100%;
      padding: 10px 14px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
    }
    
    .tone-select:hover {
      border-color: rgba(255, 255, 255, 0.2);
    }
    
    .tone-select:focus {
      outline: none;
      border-color: #0a66c2;
      box-shadow: 0 0 0 3px rgba(10, 102, 194, 0.2);
    }
    
    .tone-select option {
      background: #1a1a2e;
      color: #fff;
    }
    
    .generate-btn {
      width: 100%;
      padding: 12px 20px;
      background: linear-gradient(135deg, #0a66c2 0%, #0077b5 100%);
      border: none;
      border-radius: 10px;
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s;
    }
    
    .generate-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(10, 102, 194, 0.4);
    }
    
    .generate-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .spinner-small {
      width: 12px;
      height: 12px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Shimmer Loading */
    .shimmer-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .shimmer-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .shimmer-line {
      height: 12px;
      border-radius: 6px;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.05) 0%,
        rgba(255, 255, 255, 0.1) 50%,
        rgba(255, 255, 255, 0.05) 100%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    .shimmer-line.long { width: 100%; }
    .shimmer-line.medium { width: 75%; }
    .shimmer-line.short { width: 50%; }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    .results {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .comment-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 14px;
      transition: all 0.2s;
    }

    .comment-card.refining {
      opacity: 0.6;
    }
    
    .comment-card:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.15);
    }
    
    .comment-text {
      font-size: 13px;
      line-height: 1.6;
      color: #e5e7eb;
      margin-bottom: 12px;
    }
    
    .comment-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .action-group {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 6px 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.05);
      color: #9ca3af;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    .action-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .action-btn.copied {
      background: rgba(34, 197, 94, 0.2);
      border-color: rgba(34, 197, 94, 0.3);
      color: #22c55e;
    }

    .action-btn.refine-btn {
      padding: 5px 8px;
      font-size: 10px;
      gap: 4px;
    }

    .action-btn.refine-btn span {
      font-weight: 500;
    }

    .insert-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px;
      background: linear-gradient(135deg, #0a66c2 0%, #0077b5 100%);
      border: none;
      border-radius: 6px;
      color: #fff;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .insert-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(10, 102, 194, 0.4);
    }
    
    /* Recommendation Tag */
    .recommendation-tag {
      display: inline-block;
      font-size: 10px;
      font-weight: 600;
      color: #93c5fd;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
      padding: 3px 8px;
      background: rgba(59, 130, 246, 0.15);
      border-radius: 4px;
    }
    
    .error-message {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 10px;
      padding: 12px;
      color: #fca5a5;
      font-size: 13px;
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }
    
    .error-icon {
      flex-shrink: 0;
      color: #ef4444;
    }
    
    .no-api-key {
      text-align: center;
      padding: 20px;
    }
    
    .no-api-key-icon {
      width: 48px;
      height: 48px;
      margin: 0 auto 16px;
      border-radius: 12px;
      background: rgba(251, 191, 36, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fbbf24;
    }
    
    .no-api-key h3 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .no-api-key p {
      font-size: 13px;
      color: #9ca3af;
      margin-bottom: 16px;
    }
    
    .settings-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 16px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #fff;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .settings-btn:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    /* History Tab */
    .history-section {
      min-height: 200px;
    }

    .empty-history {
      text-align: center;
      padding: 40px 20px;
      color: #6b7280;
    }

    .empty-history svg {
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-history p {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 4px;
      color: #9ca3af;
    }

    .empty-history span {
      font-size: 12px;
    }

    .history-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .history-count {
      font-size: 11px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .clear-history-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: transparent;
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 4px;
      color: #ef4444;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .clear-history-btn:hover {
      background: rgba(239, 68, 68, 0.1);
    }

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .history-item {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 12px;
    }

    .history-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-size: 11px;
      color: #6b7280;
    }

    .history-time {
      color: #9ca3af;
      font-weight: 500;
    }

    .history-post {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .history-comment {
      font-size: 13px;
      line-height: 1.5;
      color: #d1d5db;
      margin-bottom: 10px;
    }

    .history-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .panel-footer {
      padding: 12px 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(0, 0, 0, 0.2);
      font-size: 11px;
      color: #6b7280;
      text-align: center;
      line-height: 1.5;
      flex-shrink: 0;
    }
    
    .panel-footer .sponsor-link {
      color: #9ca3af;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.2s;
    }
    
    .panel-footer .sponsor-link:hover {
      color: #0a66c2;
      text-decoration: underline;
    }
    
    .panel-footer .footer-divider {
      margin: 0 8px;
      color: #4b5563;
    }
    
    .panel-footer .support-link {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: #ef4444;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s;
      margin-left: 4px;
    }
    
    .panel-footer .support-link svg {
      width: 14px;
      height: 14px;
      fill: #ef4444;
      stroke: #ef4444;
    }
    
    .panel-footer .support-link:hover {
      color: #f87171;
      text-decoration: underline;
    }
    
    .panel-footer .support-link:hover svg {
      fill: #f87171;
      stroke: #f87171;
      transform: scale(1.1);
    }
  `}
