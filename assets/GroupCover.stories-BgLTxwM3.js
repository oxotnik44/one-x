import{r as m,j as u}from"./iframe-CCPG9B4X.js";import{G as n,a as d}from"./ConfirmDeleteModal-D2XLBDl3.js";import{L as a}from"./Logo-BiOHOkjz.js";import"./Modal-fdBgQfJh.js";import"./index-CBrGr1YP.js";import"./index-DwxnaDBX.js";import"./classNames-DZENv8ZT.js";import"./clsx-B-dksMZM.js";import"./iconBase-BDT6FSQA.js";import"./Button-Bbd_4dKP.js";import"./ButtonNavigation-BxvL78nb.js";import"./sidebarStore-BPjn5dKp.js";import"./Dropdown-xaWiqvUd.js";import"./FilePicker-C-0viexR.js";import"./useTranslation-CGIo-ki9.js";import"./Text-BdjnsNMI.js";import"./Input-CrW3eORU.js";import"./Like-B-_46ITe.js";import"./index-C9vfmkzM.js";import"./Loader-C1jWAQqW.js";import"./PageLoader-CcW8yQkr.js";import"./PageWrapper-B_RLjTmo.js";import"./TrackControlButton-OZ2XJtMV.js";import"./UserAvatar-DMAIqh6G.js";const l={id:"1",name:"Mock Group",userId:"user-1",genre:"Рок",cover:a,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()},M={title:"shared/GroupCover",component:n,tags:["autodocs"]},e={args:{edit:!1,preview:null,onIconChange:void 0}},r={args:{edit:!1,preview:"https://via.placeholder.com/256x256.png?text=Preview+Image"}},t={render:()=>{const[s,i]=m.useState(a);d.setState({currentGroup:l});const p=o=>{if(o&&o[0]){const c=URL.createObjectURL(o[0]);i(c)}};return u.jsx(n,{edit:!0,preview:s,onIconChange:p})}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const q=["Default","WithPreview","Editable"];export{e as Default,t as Editable,r as WithPreview,q as __namedExportsOrder,M as default};
