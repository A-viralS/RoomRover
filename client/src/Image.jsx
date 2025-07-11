// export default function Image ({ src, ...rest }) {
//   // Serve local images from the public folder
//   const imageUrl = src?.startsWith('https://') ? src : `/${src}`
//   return <img {...rest} src={imageUrl} alt='' />
// }
export default function Image({ src, ...rest }) {
  return <img {...rest} src={src} alt='' />
}
