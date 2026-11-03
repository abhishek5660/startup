export const LOADER_KEY = "nt-loaded";

/**
 * Runs before first paint: skip the intro on repeat visits, on phones (faster first paint) and for reduced-motion users.
 * Uses a window flag + injected <style> (React hydration would strip a class on <html>).
 */
export const loaderScript = `try{if(sessionStorage.getItem('${LOADER_KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches||innerWidth<768){window.__ntSkipLoader=1;var s=document.createElement('style');s.textContent='#nt-loader{display:none!important}:root{--intro:0s}';document.head.appendChild(s)}}catch(e){}`;
