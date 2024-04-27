export default function Image ({ src, ...rest }) {
  src =
    src && src.includes('https://') //for s3
      ? src
      : src
  return <img {...rest} src={src} alt={''} />
}
