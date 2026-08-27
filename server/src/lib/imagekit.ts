import ImageKit, { toFile } from "@imagekit/nodejs";

// The @imagekit/nodejs server SDK only needs the private key.
// publicKey and urlEndpoint are client-side (browser SDK) concepts.
// It reads IMAGEKIT_PRIVATE_KEY from env automatically, but we pass it explicitly.
const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

export { toFile };
export default imagekit;
 