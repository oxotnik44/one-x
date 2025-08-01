import{r as m,j as u}from"./iframe-C0kfoYRU.js";import{G as n,a as d}from"./AutoHideScroll-Bn4kiatZ.js";import{L as a}from"./Logo-BiOHOkjz.js";import"./Modal-ot01iIn6.js";import"./index-CCh5LiNu.js";import"./index-BXuEUrgA.js";import"./classNames-CSVCBH4b.js";import"./iconBase-BzJrSpo7.js";import"./Button-BG29j6-m.js";import"./ButtonNavigation-AGHQnJJF.js";import"./sidebarStore-DngkkDiT.js";import"./Dropdown-B0nLrr0u.js";import"./FilePicker-BOxeBJkN.js";import"./useTranslation-DTQxaVaH.js";import"./Text-Cv_jbED3.js";import"./Input-Syt8WR94.js";import"./Like-CU83MUjH.js";import"./index-DJP2UdXn.js";import"./Loader-BA1QRYy5.js";import"./PageLoader-CjR7aYj7.js";import"./PageWrapper-CUwEEPPt.js";import"./TrackControlButton-Cp9njBny.js";import"./UserAvatar-D3VV5S8d.js";const l={id:"1",name:"Mock Group",userId:"user-1",genre:"Рок",cover:a,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()},F={title:"shared/GroupCover",component:n,tags:["autodocs"]},e={args:{edit:!1,preview:null,onIconChange:void 0}},r={args:{edit:!1,preview:"https://via.placeholder.com/256x256.png?text=Preview+Image"}},t={render:()=>{const[s,i]=m.useState(a);d.setState({currentGroup:l});const p=o=>{if(o&&o[0]){const c=URL.createObjectURL(o[0]);i(c)}};return u.jsx(n,{edit:!0,preview:s,onIconChange:p})}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const M=["Default","WithPreview","Editable"];export{e as Default,t as Editable,r as WithPreview,M as __namedExportsOrder,F as default};
