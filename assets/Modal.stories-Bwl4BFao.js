import{r as o,j as e}from"./iframe-CCPG9B4X.js";import{M as s}from"./Modal-fdBgQfJh.js";import"./index-CBrGr1YP.js";import"./index-DwxnaDBX.js";import"./classNames-DZENv8ZT.js";import"./clsx-B-dksMZM.js";import"./iconBase-BDT6FSQA.js";const m={title:"shared/Modal",component:s,tags:["autodocs"]},t={render:()=>{const[n,r]=o.useState(!0);return e.jsxs(e.Fragment,{children:[e.jsx("button",{onClick:()=>r(!0),className:"px-4 py-2 bg-blue-500 text-white rounded",children:"Открыть модалку"}),e.jsx(s,{isOpen:n,onClose:()=>r(!1),children:e.jsx("div",{className:"text-white",children:"Контент модального окна"})})]})}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return <>\r
                <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded">\r
                    Открыть модалку\r
                </button>\r
                <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>\r
                    <div className="text-white">Контент модального окна</div>\r
                </Modal>\r
            </>;
  }
}`,...t.parameters?.docs?.source}}};const x=["Default"];export{t as Default,x as __namedExportsOrder,m as default};
