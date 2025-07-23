import{r as o,j as n}from"./iframe-CCPG9B4X.js";import{F as a}from"./FilePicker-C-0viexR.js";import"./useTranslation-CGIo-ki9.js";const m={title:"shared/FilePicker",component:a,parameters:{layout:"centered"}},e={render:()=>{const[l,r]=o.useState(null),s=t=>{if(!t||t.length===0){r(null);return}const i=t[0],c=URL.createObjectURL(i);r(c)};return n.jsx(a,{accept:"image/*",onChange:s,placeholder:n.jsx("div",{className:"text-center text-gray-400",children:"Выберите файл"}),previewUrl:l,title:"Выберите изображение"})}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [preview, setPreview] = useState<string | null>(null);
    const handleChange = (files: FileList | null) => {
      if (!files || files.length === 0) {
        setPreview(null);
        return;
      }
      const file = files[0];
      const url = URL.createObjectURL(file);
      setPreview(url);
    };
    return <FilePicker accept="image/*" onChange={handleChange} placeholder={<div className="text-center text-gray-400">Выберите файл</div>} previewUrl={preview} title="Выберите изображение" />;
  }
}`,...e.parameters?.docs?.source}}};const h=["Default"];export{e as Default,h as __namedExportsOrder,m as default};
