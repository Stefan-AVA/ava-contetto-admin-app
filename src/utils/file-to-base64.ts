export default function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
    let baseURL = ""

    const reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onload = () => {
      baseURL = reader.result as string
      resolve(baseURL)
    }

    return baseURL
  })
}
