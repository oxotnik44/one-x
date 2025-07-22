import{r as u,j as d}from"./iframe-Bt4UvEqW.js";import{G as n,u as l}from"./index-BlSK3dwA.js";import{L as a}from"./Logo-BiOHOkjz.js";import"./Text-IhfjRFJQ.js";import"./clsx-B-dksMZM.js";import"./useTranslation-D6XLV_9q.js";const m={id:"1",name:"Mock Group",userId:"user-1",genre:"Рок",cover:a,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()},I={title:"shared/GroupCover",component:n,tags:["autodocs"]},e={args:{edit:!1,preview:null,onIconChange:void 0}},r={args:{edit:!1,preview:"https://via.placeholder.com/256x256.png?text=Preview+Image"}},t={render:()=>{const[s,c]=u.useState(a);l.setState({currentGroup:m});const i=o=>{if(o&&o[0]){const p=URL.createObjectURL(o[0]);c(p)}};return d.jsx(n,{edit:!0,preview:s,onIconChange:i})}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
    useGroupStore.setState({
      currentGroup: mockGroup
    });
    const handleIconChange = (files: FileList | null) => {
      if (files && files[0]) {
        const url = URL.createObjectURL(files[0]);
        setPreview(url);
      }
    };
    return <GroupCover edit preview={preview} onIconChange={handleIconChange} />;
  }
}`,...t.parameters?.docs?.source}}};const G=["Default","WithPreview","Editable"];export{e as Default,t as Editable,r as WithPreview,G as __namedExportsOrder,I as default};
