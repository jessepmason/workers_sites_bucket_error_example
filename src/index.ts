/// <reference path=".d.ts"/>
import ASSET_MANIFEST from "__STATIC_CONTENT_MANIFEST";
import { getAssetFromKV, NotFoundError, MethodNotAllowedError,mapRequestToAsset } from '@cloudflare/kv-asset-handler';


async function getAsset(request:Request,url:URL,env:any,ctx:any){
  try {

    const result =  await getAssetFromKV(
      {
        request,
        waitUntil(promise) {
          return ctx.waitUntil(promise)
        },
      },
      {
        ASSET_NAMESPACE: env.__STATIC_CONTENT,
        ASSET_MANIFEST: ASSET_MANIFEST,
      }
    )

    return result;

  } catch (error) {
      console.log(error);
      return new Response(url.pathname + " not found" ,{
        headers:{
        status:"404"
    }})
  }

}



export default {
  async fetch(request: Request,env:any,ctx:any): Promise<Response> {
    const url = new URL(request.url);
    if(url.pathname.includes(".")){
      return getAsset(request,url,env,ctx);
    }
    return new Response("Hello World!");
  },
};
