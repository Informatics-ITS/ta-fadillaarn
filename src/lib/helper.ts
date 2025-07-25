type OpenGraphType = {
  siteName: string;
  description: string;
  templateTitle?: string;
  logo?: string;
};
// !STARTERCONF This OG is generated from https://github.com/theodorusclarence/og
// Please clone them and self-host if your site is going to be visited by many people.
// Then change the url and the default logo.
// export function openGraph({
//   siteName,
//   templateTitle,
//   description,
//   logo = 'https://ergocheck.site/logo.png',
// }: OpenGraphType): string {
//   const ogLogo = encodeURIComponent(logo);
//   const ogSiteName = encodeURIComponent(siteName.trim());
//   const ogTemplateTitle = templateTitle
//     ? encodeURIComponent(templateTitle.trim())
//     : undefined;
//   const ogDesc = encodeURIComponent(description.trim());

//   return `https://ergocheck-ijlrbc2vd-fadillaarns-projects.vercel.app/api/general?siteName=${ogSiteName}&description=${ogDesc}&logo=${ogLogo}${
//     ogTemplateTitle ? `&templateTitle=${ogTemplateTitle}` : ''
//   }`;
// }

export function getFromLocalStorage(key: string): string | null {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(key);
  }
  return null;
}

export function getFromSessionStorage(key: string): string | null {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem(key);
  }
  return null;
}
