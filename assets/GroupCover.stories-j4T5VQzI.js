import{r as p,j as l}from"./iframe-U8ya4lKj.js";import{G as n}from"./GroupCover-BGBq_pSL.js";import{L as d}from"./Logo-BiOHOkjz.js";import"./Text-DVKAWUAM.js";import"./clsx-B-dksMZM.js";import"./useTranslation-CSTQQmYg.js";const w={title:"shared/GroupCover",component:n,tags:["autodocs"]},e={args:{edit:!1,preview:null,onIconChange:void 0}},r={args:{edit:!1,preview:"https://via.placeholder.com/256x256.png?text=Preview+Image"}},t={render:()=>{const[a,s]=p.useState(d),i=o=>{if(o&&o[0]){const c=URL.createObjectURL(o[0]);s(c)}};return l.jsx(n,{edit:!0,preview:a,onIconChange:i})}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    edit: false,
    preview: null,
    onIconChange: undefined
  }
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    edit: false,
    preview: 'https://via.placeholder.com/256x256.png?text=Preview+Image'
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [preview, setPreview] = useState<string | null>(Logo);
    const handleIconChange = (files: FileList | null) => {
      if (files && files[0]) {
        const url = URL.createObjectURL(files[0]);
        setPreview(url);
      }
    };
    return <GroupCover edit preview={preview} onIconChange={handleIconChange} />;
  }
}`,...t.parameters?.docs?.source}}};const x=["Default","WithPreview","Editable"];export{e as Default,t as Editable,r as WithPreview,x as __namedExportsOrder,w as default};
