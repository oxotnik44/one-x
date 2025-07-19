import{R as p,j as a}from"./iframe-U8ya4lKj.js";import{B as l,a as c}from"./Button-DE9W436l.js";import{c as n,d as u}from"./index-Crfi9Vkz.js";import{u as y}from"./useTranslation-CSTQQmYg.js";const x=p.memo(({isPlaying:t,isCurrent:s,onClick:e,className:r="",theme:i,showOnHover:m=!1})=>{const{t:o}=y("playButton");return a.jsx(l,{size:c.L,square:!0,onClick:e,theme:i,className:`
                    ${m?"opacity-0 hover:opacity-100":"opacity-100"}
                    transition-opacity ${r}
                `,"aria-label":o(s&&t?"pause":"play"),children:s&&t?a.jsx(n,{className:"h-6 w-6 text-white"}):a.jsx(u,{className:"h-6 w-6 text-white"})})});x.displayName="PlayButton";export{x as P};
